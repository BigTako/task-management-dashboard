'use client';

import { CircularProgress } from '@mui/material';
import { useState } from 'react';

import { api } from '~/trpc/react';
import type { CardType } from './types';
import { InputError } from '../InputError';

export function EditCard({ id, onSubmit }: { id: string; onSubmit: () => void }) {
  const [cardData, setCardData] = useState<Pick<CardType, 'title' | 'description'>>({ title: '', description: '' });

  const [cardErrors, setCardErrors] = useState<Partial<Pick<CardType, 'title' | 'description'>>>({});

  const utils = api.useUtils();

  const editCard = api.card.update.useMutation({
    onSuccess: async () => {
      await utils.board.invalidate();
      setCardData({ title: '', description: '' });
      onSubmit();
    },
    onError: error => {
      const errorData = error.shape?.data.zodError?.fieldErrors as {
        title?: string;
        description?: string;
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
        editCard.mutate({ id, ...cardData });
      }}
      className="flex grow flex-col items-center justify-center gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setCardData(v => ({ ...v, title: e.target.value }))}
        className="bg-sandy-semilight text-sandy-dark placeholder-sandy-dark w-full rounded-[10px] px-4 py-2 outline-none"
      />
      <InputError>{cardErrors.title}</InputError>
      <input
        type="text"
        placeholder="Descripton"
        value={description}
        onChange={e => setCardData(v => ({ ...v, description: e.target.value }))}
        className="bg-sandy-semilight text-sandy-dark placeholder-sandy-dark w-full rounded-[10px] px-4 py-2 outline-none"
      />
      <InputError>{cardErrors.description}</InputError>
      <button
        type="submit"
        className="bg-sandy-dark w-full rounded-[10px] px-3 py-2 font-semibold text-white transition"
        disabled={editCard.isPending}
      >
        {editCard.isPending ? <CircularProgress size={'20px'} /> : 'Submit'}
      </button>
    </form>
  );
}
