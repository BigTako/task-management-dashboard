'use client';

import type { Card, Column as ColumnEnum } from '@prisma/client';
import { useSearchUrl } from '../_hooks';
import { BoardSearch } from './search';
import { DragDropContext } from 'react-beautiful-dnd';
import { api } from '~/trpc/react';
import { CircularProgress } from '@mui/material';
import { Column } from './column';
import { useCallback } from 'react';

const columnTitles = {
  IN_PROGRESS: 'In Progress',
  TO_DO: 'To Do',
  DONE: 'Done',
};

export function BoardView() {
  const { getParam } = useSearchUrl();

  const seachBoardId = getParam('board') ?? '';
  const utils = api.useUtils();

  const { data: curBoard, isLoading: curBoardLoading } = api.board.one.useQuery({ id: seachBoardId });

  const moveCard = api.card.move.useMutation({
    // optimistic update
    onMutate: async data => {
      const prevData = utils.board.one.getData({ id: seachBoardId });
      if (!prevData) return;
      const foundedCard = prevData.cards.find(c => c.id === data.id);
      if (!foundedCard) return;

      if (foundedCard.column === data.toColumn && data.toPosition === foundedCard.position) return;

      await utils.board.one.cancel({ id: seachBoardId });

      const isSameColumn = data.toColumn === foundedCard.column;

      const { curColumn, rest } = prevData.cards.reduce(
        (r: { curColumn: Card[]; rest: Card[] }, o: Card) => {
          if (o.id !== foundedCard.id) {
            const isCurrentColumn = o.column === data.toColumn;
            r[isCurrentColumn ? 'curColumn' : 'rest'].push(o);
          }
          return r;
        },
        { curColumn: [] as Card[], rest: [] as Card[] },
      );

      curColumn.splice(data.toPosition, 0, {
        ...foundedCard,
        column: isSameColumn ? foundedCard.column : (data.toColumn as ColumnEnum),
        position: data.toPosition,
      });

      const temp = curColumn.map((card, i) => ({ ...card, position: i }));

      const cards = [...rest, ...temp].sort((a, b) => a.position - b.position);

      utils.board.one.setData({ id: seachBoardId }, { ...prevData, cards });
    },
  });

  const cardsByColumn = useCallback(
    ({ columnName }: { columnName: ColumnEnum }) => {
      return curBoard?.cards.filter(card => card.column === columnName) ?? [];
    },
    [curBoard],
  );

  if (curBoardLoading) {
    return (
      <div className="flex min-h-full w-full items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="flex min-h-full w-full flex-col items-stretch gap-5 p-2">
      <BoardSearch />

      <div className="flex h-full gap-3">
        <DragDropContext
          onDragEnd={result => {
            const { source, destination } = result;

            if (!source || !destination) {
              return;
            }

            moveCard.mutate({
              id: result.draggableId,
              boardId: seachBoardId,
              toColumn: destination.droppableId,
              toPosition: destination.index,
            });
          }}
        >
          {Object.entries(columnTitles).map(ent => {
            const [columnName, columnTitle] = ent as [ColumnEnum, string];
            const cards = cardsByColumn({ columnName });
            return (
              <Column key={columnName} name={columnName} title={columnTitle} cards={cards} boardId={seachBoardId} />
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
