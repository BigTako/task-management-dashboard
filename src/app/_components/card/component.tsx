'use client';

import { type ReactNode, useCallback, useState } from 'react';
import { BsPencilSquare, BsPlusCircle, BsTrashFill, BsXCircleFill } from 'react-icons/bs';
import { cn } from '~/utils/cn';
import { api } from '~/trpc/react';
import { CreateCard } from './create';
import type { Column } from '@prisma/client';
import { EditCard } from './edit';
import type { CardType } from './types';

function CardLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('bg-sandy-light flex flex-col gap-2 rounded-[10px] p-3 text-inherit', className)}>
      {children}
    </div>
  );
}

export function Card({ card }: { card: CardType }) {
  const { id, title, description } = card;

  const [editFormOpened, setEditFormOpened] = useState(false);
  const utils = api.useUtils();

  const deleteCard = api.card.delete.useMutation({
    onSuccess: async () => {
      await utils.board.one.invalidate({ id: card.boardId });
    },
  });

  return (
    <CardLayout className="text-start">
      <div className="flex justify-between gap-2">
        {editFormOpened ? (
          <EditCard id={id} onSubmit={() => setEditFormOpened(false)} />
        ) : (
          <div>
            <div className="font-bold">{title}</div>
            <div>{description}</div>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <button className="text-[20px]" onClick={() => setEditFormOpened(v => !v)}>
            {editFormOpened ? <BsXCircleFill /> : <BsPencilSquare />}
          </button>
          <button className="text-[20px]" onClick={() => deleteCard.mutate({ id })}>
            <BsTrashFill />
          </button>
        </div>
      </div>
    </CardLayout>
  );
}

export function AddCard({ boardId, column }: { boardId: string; column: Column }) {
  const [formOpened, setFormOpened] = useState(false);

  const toggleFormOpened = useCallback(() => {
    setFormOpened(v => !v);
  }, []);

  return (
    <CardLayout className="cursor-pointer">
      <div>
        {formOpened ? (
          <div className="flex gap-2">
            <CreateCard boardId={boardId} column={column} />
            {/* <CreateBoard /> */}
            <h2 className="flex flex-col gap-2 text-[20px]">
              <BsXCircleFill onClick={toggleFormOpened} />
            </h2>
          </div>
        ) : (
          <h1 className="flex justify-center text-center text-2xl" onClick={toggleFormOpened}>
            <BsPlusCircle />
          </h1>
        )}
      </div>
    </CardLayout>
  );
}
