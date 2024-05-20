'use client';

import { api } from '~/trpc/react';
import { AddBoard, Board } from './_components/board';
import { BoardView } from './_components/board/view';

export default function Home() {
  const { data: boards, isLoading: boardsLoading } = api.board.list.useQuery();
  if (boardsLoading || !boards) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex min-h-full flex-row gap-5 bg-[#FBF7F0] text-[#555555]">
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
