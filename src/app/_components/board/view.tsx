'use client';

import { AddCard, Card, CardType } from '../card';
import { BoardType } from './types';
import { Column as ColumnEnum } from '@prisma/client';
import { useSearchUrl } from '../_hooks';
import { BoardSearch } from './search';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { useState } from 'react';

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
        {cards.map(card => (
          <Card id={card.id} key={card.id} title={card.title} description={card.description} />
        ))}
        <AddCard boardId={boardId} column={name} />
      </div>
    </div>
  );
}

const tasks = [
  { id: '1', title: 'First task', description: 'dsfsdfdsf' },
  { id: '2', title: 'Second task', description: 'dsfsdfdsf' },
  { id: '3', title: 'Third task', description: 'dsfsdfdsf' },
  { id: '4', title: 'Forth task', description: 'dsfsdfdsf' },
  { id: '5', title: 'Fifth task', description: 'dsfsdfdsf' },
];

const taskStatus = {
  toDo: {
    name: 'To do',
    items: tasks,
  },
  inProgress: {
    name: 'In Progress',
    items: [],
  },
  done: {
    name: 'Done',
    items: [],
  },
};

function DraggableCard({ item, index }: { item: CardType; index: number }) {
  return (
    <Draggable key={item.id} draggableId={item.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={{
              userSelect: 'none',
              padding: 16,
              margin: '0 0 8px 0',
              minHeight: '50px',
              backgroundColor: snapshot.isDragging ? '#263B4A' : '#456C86',
              color: 'white',
              ...provided.draggableProps.style,
            }}
          >
            {item.title}
          </div>
        );
      }}
    </Draggable>
  );
}

const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function DropableColumn({ columnId, column }: { columnId: string; column: { name: string; items: CardType[] } }) {
  const { name, items } = column;
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      key={name}
    >
      <h2>{name}</h2>
      <div style={{ margin: 8 }}>
        <Droppable droppableId={columnId} key={columnId}>
          {(provided, snapshot) => {
            return (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
                  padding: 4,
                  width: 250,
                  minHeight: 500,
                }}
              >
                {items.map((item, index) => {
                  return <DraggableCard index={index} item={item} />;
                })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
      </div>
    </div>
  );
}

export function BoardView({ boards }: { boards: BoardType[] }) {
  const { getParam } = useSearchUrl();

  const seachBoardId = getParam('board') ?? '';

  const curBoard = boards.find(board => board.id === seachBoardId);

  const toDoCards = curBoard?.cards.filter(card => card.column === ColumnEnum.TO_DO) ?? [];

  const inProgressCards = curBoard?.cards.filter(card => card.column === ColumnEnum.IN_PROGRESS) ?? [];

  const doneCards = curBoard?.cards.filter(card => card.column === ColumnEnum.DONE) ?? [];

  const [columns, setColumns] = useState({
    to: {
      name: 'To do',
      items: toDoCards,
    },
    inProgress: {
      name: 'In Progress',
      items: inProgressCards,
    },
    done: {
      name: 'Done',
      items: doneCards,
    },
  });

  return (
    <div className="flex min-h-full w-full flex-col items-stretch gap-5 p-2">
      <BoardSearch />

      <div className="flex h-full gap-3">
        <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
          {Object.entries(columns).map(([columnId, column]) => (
            <DropableColumn columnId={columnId} column={column} />
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}
