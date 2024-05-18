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

  const updateCard = api.card.update.useMutation({
    onMutate: async cardChangedData => {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      if (!cardChangedData.column || !Object.keys(ColumnEnum).includes(cardChangedData.column)) {
        return;
      }

      await utils.board.one.cancel({ id: seachBoardId });

      // Get the data from the queryCache
      const prevData = utils.board.one.getData({ id: seachBoardId });
      const changedCard = prevData?.cards.find(c => c.id === cardChangedData.id);

      if (!changedCard || !prevData) return;

      const newCards = prevData.cards.map(c =>
        c.id === changedCard.id ? { ...c, column: cardChangedData.column as ColumnEnum } : c,
      );

      utils.board.one.setData({ id: seachBoardId }, { ...prevData, cards: newCards });
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
            console.log(result);
            updateCard.mutate({ id: result.draggableId, column: result.destination?.droppableId });
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
