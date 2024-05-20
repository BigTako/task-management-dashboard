import { Droppable } from 'react-beautiful-dnd';
import { AddCard, Card, type CardType } from '../card';
import type { Column as ColumnEnum } from '@prisma/client';
import { DraggableElement } from '../DraggableElement';

export function Column({
  name,
  title,
  cards,
  boardId,
}: {
  name: ColumnEnum;
  title: string;
  cards: CardType[];
  boardId: string;
}) {
  return (
    <div className="flex w-[33.33%] grow flex-col gap-2">
      <h3 className="text-center font-bold">{title}</h3>
      <div className="bg-sandy-semilight flex h-full flex-col gap-3 overflow-y-auto  rounded-[20px] p-2 text-center">
        <Droppable droppableId={name} key={name}>
          {provided => {
            return (
              <div className="flex min-h-1 flex-col gap-3" {...provided.droppableProps} ref={provided.innerRef}>
                {cards.map((item, index) => {
                  return (
                    <DraggableElement id={item.id} index={index} key={item.id}>
                      <Card card={item} />
                    </DraggableElement>
                  );
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
