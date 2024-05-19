'use client';

import { Column as ColumnEnum } from '@prisma/client';
import { useSearchUrl } from '../_hooks';
import { BoardSearch } from './search';
import { DragDropContext } from 'react-beautiful-dnd';
import { api } from '~/trpc/react';
import { CircularProgress } from '@mui/material';
import { Column } from './column';

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
      await utils.board.one.cancel({ id: seachBoardId });
      // Get the data from the queryCache
      const prevData = utils.board.one.getData({ id: seachBoardId });
      const { id: cardId, source, destination } = data;
      if (!prevData) return;

      const updatedCards = prevData.cards
        .map(card => {
          if (card.column === source.column && card.position > source.position) {
            return { ...card, position: card.position - 1 };
          }
          if (card.column === destination.column && card.position >= destination.position) {
            return { ...card, position: card.position + 1 };
          }
          if (card.id === cardId) {
            return { ...card, position: destination.position, column: destination.column as ColumnEnum };
          }
          return card;
        })
        .sort((a, b) => a.position - b.position);

      utils.board.one.setData({ id: seachBoardId }, { ...prevData, cards: updatedCards });
    },
  });

  if (curBoardLoading) {
    return (
      <div className="flex min-h-full w-full items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  function cardsByColumn({ columnName }: { columnName: ColumnEnum }) {
    return curBoard?.cards.filter(card => card.column === columnName) ?? [];
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
              source: { position: source.index, column: source.droppableId as ColumnEnum },
              destination: { position: destination.index, column: destination.droppableId as ColumnEnum },
            });
          }}
        >
          {Object.entries(columnTitles).map(ent => {
            const [columnName, columnTitle] = ent as [ColumnEnum, string];
            const cards = cardsByColumn({ columnName: columnName as ColumnEnum });
            return <Column name={columnName} title={columnTitle} cards={cards} boardId={seachBoardId} />;
          })}
        </DragDropContext>
      </div>
    </div>
  );
}
