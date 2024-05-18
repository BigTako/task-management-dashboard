import { Droppable } from 'react-beautiful-dnd';
import { AddCard, Card, CardType } from '../card';
import { Column as ColumnEnum } from '@prisma/client';
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
  const lastPosition = cards[cards.length - 1]?.position ?? 0;
  return (
    <div className="flex max-w-[33.33%] grow flex-col gap-2">
      <h3 className="text-center font-bold">{title}</h3>
      <div className="flex h-full flex-col gap-3 overflow-y-auto bg-blue-900 p-2 text-center">
        <Droppable droppableId={name} key={name}>
          {provided => {
            return (
              <div className="flex min-h-1 flex-col gap-3" {...provided.droppableProps} ref={provided.innerRef}>
                {cards.map((item, index) => {
                  return (
                    <DraggableElement id={item.id} index={index}>
                      <Card card={item} />
                    </DraggableElement>
                  );
                })}
                {provided.placeholder}
              </div>
            );
          }}
        </Droppable>
        <AddCard boardId={boardId} column={name} lastPosition={lastPosition} />
      </div>
    </div>
  );
}
