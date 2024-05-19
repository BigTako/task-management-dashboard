'use client';

import { CircularProgress } from '@mui/material';
import { useState } from 'react';

import { api } from '~/trpc/react';
import { CardType } from './types';
import { Column } from '@prisma/client';
import { InputError } from '../InputError';

export function CreateCard({ boardId, column }: { boardId: string; column: Column }) {
  const [cardData, setCardData] = useState<Pick<CardType, 'title' | 'description'>>({ title: '', description: '' });

  const [cardErrors, setCardErrors] = useState<Partial<Pick<CardType, 'title' | 'description'>>>({});

  const utils = api.useUtils();
  const createCard = api.card.create.useMutation({
    onSuccess: async () => {
      await utils.board.one.invalidate({ id: boardId });
      setCardData({ title: '', description: '' });
      setCardErrors({ title: '', description: '' });
    },
    onError: error => {
      const errorData = error.shape?.data.zodError?.fieldErrors as {
        title?: string[];
        description?: string[];
      };
      setCardErrors({
        title: errorData?.title?.[0],
        description: errorData?.description?.[0],
      });
    },
  });

  const { title, description } = cardData;

  return (
    <form
      onSubmit={async e => {
        e.preventDefault();
        createCard.mutate({ title, description, column, boardId });
      }}
      className="flex grow flex-col items-center justify-end gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setCardData(v => ({ ...v, title: e.target.value }))}
        className="w-full rounded-[10px] border-[1px] border-black px-4 py-2 text-black"
      />
      <InputError>{cardErrors.title}</InputError>
      <input
        type="text"
        placeholder="Descripton"
        value={description}
        onChange={e => setCardData(v => ({ ...v, description: e.target.value }))}
        className="w-full rounded-[10px] border-[1px] border-black px-4 py-2 text-black"
      />
      <InputError>{cardErrors.description}</InputError>
      <button
        type="submit"
        className="w-full rounded-[10px] bg-gray-800 px-3 py-2 font-semibold text-white transition"
        disabled={createCard.isPending}
      >
        {createCard.isPending ? <CircularProgress size={'20px'} /> : 'Submit'}
      </button>
    </form>
  );
}
