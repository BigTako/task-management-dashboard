'use client';

import { AddCard, Card, CardType } from '../card';
import { BoardType } from './types';
import { Column as ColumnEnum } from '@prisma/client';
import { useSearchUrl } from '../_hooks';
import { BoardSearch } from './search';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { api } from '~/trpc/react';
import { CircularProgress } from '@mui/material';

const columnTitles = {
  IN_PROGRESS: 'In Progress',
  TO_DO: 'To Do',
  DONE: 'Done',
};

function Column({ name, cards, boardId }: { name: ColumnEnum; cards: CardType[]; boardId: string }) {
  return (
    <div className="flex max-w-[33%] grow flex-col gap-2">
      <h3 className="text-center font-bold">{columnTitles[name]}</h3>
      <div className="flex h-full flex-col gap-3 overflow-y-auto bg-blue-900 p-2 text-center">
        <Droppable droppableId={name} key={name}>
          {provided => {
            return (
              <div
                className="flex flex-col gap-3"
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  minHeight: 1,
                }}
              >
                {cards.map((item, index) => {
                  return <DraggableCard index={index} item={item} />;
                })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
        <AddCard boardId={boardId} column={name} />
      </div>
    </div>
  );
}

function DraggableCard({ item, index }: { item: CardType; index: number }) {
  const { id } = item;
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
            <Card card={item} />
          </div>
        );
      }}
    </Draggable>
  );
}

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

  const toDoCards = curBoard?.cards.filter(card => card.column === ColumnEnum.TO_DO) ?? [];

  const inProgressCards = curBoard?.cards.filter(card => card.column === ColumnEnum.IN_PROGRESS) ?? [];

  const doneCards = curBoard?.cards.filter(card => card.column === ColumnEnum.DONE) ?? [];

  const columns = {
    TO_DO: {
      name: 'To do',
      items: toDoCards,
    },
    IN_PROGRESS: {
      name: 'In Progress',
      items: inProgressCards,
    },
    DONE: {
      name: 'Done',
      items: doneCards,
    },
  };

  return (
    <div className="flex min-h-full w-full flex-col items-stretch gap-5 p-2">
      <BoardSearch />

      <div className="flex h-full gap-3">
        <DragDropContext
          onDragEnd={result => {
            updateCard.mutate({ id: result.draggableId, column: result.destination?.droppableId });
          }}
        >
          {Object.entries(columns).map(([columnId, column]) => (
            <Column name={columnId as ColumnEnum} cards={column.items} boardId={seachBoardId} />
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
