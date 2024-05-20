'use client';

import { CircularProgress } from '@mui/material';
import { useState } from 'react';

import { api } from '~/trpc/react';
import type { BoardType } from './types';
import { InputError } from '../InputError';

export function CreateBoard() {
  const [name, setName] = useState('');
  const [boardErrors, setBoardErrors] = useState<Partial<Pick<BoardType, 'name'>>>({});

  const utils = api.useUtils();

  const createBoard = api.board.create.useMutation({
    onSuccess: async () => {
      await utils.board.invalidate();
      setName('');
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
        createBoard.mutate({ name });
      }}
      className="flex grow flex-col items-center justify-center gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={e => setName(e.target.value)}
        className="bg-sandy-light w-full rounded-[10px] px-4 py-2 text-inherit outline-none"
      />
      <InputError>{boardErrors.name}</InputError>
      <button
        type="submit"
        className="bg-sandy-dark w-full rounded-[10px] px-3 py-2 font-semibold text-white transition"
        disabled={createBoard.isPending}
      >
        {createBoard.isPending ? <CircularProgress size={'20px'} /> : 'Submit'}
      </button>
    </form>
  );
}
