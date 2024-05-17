'use client';

import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { api } from '~/trpc/react';
import { BoardType } from './types';
import { InputError } from '../InputError';

export function EditBoard({ id, name }: { id: string; name: string }) {
  const [newName, setNewName] = useState(name);
  const [boardErrors, setBoardErrors] = useState<Partial<Pick<BoardType, 'name'>>>({});

  const utils = api.useUtils();
  const updateBoard = api.board.update.useMutation({
    onSuccess: () => {
      utils.board.invalidate();
      setBoardErrors({});
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
        className="w-full rounded-[10px] border-[1px] border-black px-4 py-2 text-black"
      />
      <InputError>{boardErrors.name}</InputError>
      <button
        type="submit"
        className="w-full rounded-[10px] bg-gray-800 px-3 py-2 font-semibold text-white transition"
        disabled={updateBoard.isPending}
      >
        {updateBoard.isPending ? <CircularProgress size={'20px'} /> : 'Submit'}
      </button>
    </form>
  );
}
