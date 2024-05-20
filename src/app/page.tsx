'use client';

import { api } from '~/trpc/react';
import { AddBoard, Board } from './_components/board';
import { BoardView } from './_components/board/view';
import { CircularProgress } from '@mui/material';

export default function Home() {
  const { data: boards, isLoading: boardsLoading } = api.board.list.useQuery();
  if (boardsLoading || !boards) {
    return (
      <div className="flex min-h-full w-full items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <main className="bg-sandy-light text-sandy-dark flex min-h-full flex-row gap-5">
      <div className="flex min-h-[100%] w-[500px] flex-col justify-start gap-4 border-r-[1px]  p-3">
        {boards.map(b => (
          <Board key={b.id} id={b.id} name={b.name} />
        ))}
        <AddBoard />
      </div>
      <BoardView />
    </main>
  );
}
