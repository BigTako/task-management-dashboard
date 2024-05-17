'use client';

import { ReactNode, useCallback, useState } from 'react';
import { cn } from '~/utils/cn';
import { BsPencilSquare, BsXCircleFill, BsTrashFill, BsPlusCircle } from 'react-icons/bs';
import { CreateBoard } from './create';
import { api } from '~/trpc/react';
import { CircularProgress } from '@mui/material';
import { EditBoard } from './edit';

function BoardLayout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2 rounded-[10px] bg-white p-3 text-gray-800', className)}>{children}</div>
  );
}

export function Board({ id, name }: { id: string; name: string }) {
  const [showEditForm, setShowEditForm] = useState(false);
  const utils = api.useUtils();

  const deleteBoard = api.board.delete.useMutation({
    onSuccess: () => {
      utils.board.invalidate();
    },
  });

  return (
    <BoardLayout>
      <div className="flex gap-2">
        {showEditForm ? (
          <EditBoard id={id} name={name} />
        ) : (
          <div>
            <h3 className="font-bold">{id}</h3>
            <h4>{name}</h4>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <button className="text-[20px]">
            {showEditForm ? (
              <BsXCircleFill onClick={() => setShowEditForm(false)} />
            ) : (
              <BsPencilSquare onClick={() => setShowEditForm(true)} />
            )}
          </button>
          <button className="text-[20px]" onClick={() => deleteBoard.mutate({ id })}>
            {deleteBoard.isPending ? <CircularProgress size={'20px'} className="text-black" /> : <BsTrashFill />}
          </button>
        </div>
      </div>
    </BoardLayout>
  );
}

export function AddBoard() {
  const [formOpened, setFormOpened] = useState(false);

  const toggleFormOpened = useCallback(() => {
    setFormOpened(v => !v);
  }, []);

  return (
    <BoardLayout className="cursor-pointer text-center">
      <div>
        {formOpened ? (
          <div className="flex gap-2">
            <CreateBoard />
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
    </BoardLayout>
  );
}
