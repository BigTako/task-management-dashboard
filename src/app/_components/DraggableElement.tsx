import type { ReactNode } from 'react';
import { Draggable, type DraggableProvided } from 'react-beautiful-dnd';

type DraggableCardProps = {
  id: string;
  index: number;
  children: ReactNode;
};

export function DraggableElement({ id, index, children }: DraggableCardProps) {
  return (
    <Draggable key={id} draggableId={id} index={index}>
      {(provided: DraggableProvided) => (
        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {children}
        </div>
      )}
    </Draggable>
  );
}
