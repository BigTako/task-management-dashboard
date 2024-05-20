'use client';

import { CircularProgress } from '@mui/material';
import { useState } from 'react';

import { api } from '~/trpc/react';
import { type Board as BoardType } from '@prisma/client';
import { InputError } from '../InputError';

export function EditBoard({ id, name, onSubmit }: { id: string; name: string; onSubmit?: () => void }) {
  const [newName, setNewName] = useState(name);
  const [boardErrors, setBoardErrors] = useState<Partial<Pick<BoardType, 'name'>>>({});

  const utils = api.useUtils();
  const updateBoard = api.board.update.useMutation({
    onSuccess: async () => {
      await utils.board.invalidate();
      setBoardErrors({});
      onSubmit?.();
    },
    onError: error => {
      const errorData = error.shape?.data.zodError?.fieldErrors as {
        name?: string;
      };
      setBoardErrors({
        name: errorData?.name?.[0],
      });
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        updateBoard.mutate({ id, name: newName });
      }}
      className="flex grow flex-col items-center justify-center gap-2"
    >
      <input
        type="text"
        placeholder="Name"
        value={newName}
        onChange={e => setNewName(e.target.value)}
        className="bg-sandy-light w-full rounded-[10px] px-4 py-2 text-inherit outline-none"
      />
      <InputError>{boardErrors.name}</InputError>
      <button
        type="submit"
        className="bg-sandy-dark w-full rounded-[10px] px-3 py-2 font-semibold text-white transition"
        disabled={updateBoard.isPending}
      >
        {updateBoard.isPending ? <CircularProgress size={'20px'} /> : 'Submit'}
      </button>
    </form>
  );
}
