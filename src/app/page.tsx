"use client";

import { api } from "~/trpc/react";
// import { api } from "~/trpc/server";
import { AddBoard, Board } from "./_components/board";
import { BoardView } from "./_components/board/view";

export default function Home() {
  const { data: boards, isLoading: boardsLoading } = api.board.list.useQuery();

  if (boardsLoading || !boards) {
    return <div>Loading...</div>;
  }
  // const boards = await api.board.list();

  // if (!boards) {
  //   return <div>Loading...</div>;
  // }
  return (
    <main className="flex min-h-full flex-row gap-5 bg-gradient-to-b from-[#2e026d] to-[#15162c] p-3 text-white">
      <div className="flex min-h-[100%] w-[500px] flex-col justify-start gap-4 border-r-[1px] border-r-blue-500 p-3">
        {boards.map((b) => (
          <Board key={b.id} id={b.id} name={b.name} />
        ))}
        <AddBoard />
      </div>
      <BoardView boards={boards} />
    </main>
  );
}
