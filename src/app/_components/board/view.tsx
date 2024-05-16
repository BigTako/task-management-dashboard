"use client";

import { useCallback, useState } from "react";
import { AddCard, Card, CardType } from "../card";
import { BoardType } from "./types";
import { Column as ColumnEnum } from "@prisma/client";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

const columnTitles = {
  IN_PROGRESS: "In Progress",
  TO_DO: "To Do",
  DONE: "Done",
};

function Column({
  name,
  cards,
  boardId,
}: {
  name: ColumnEnum;
  cards: CardType[];
  boardId: string;
}) {
  return (
    <div className="flex max-w-[33%] grow flex-col gap-2">
      <h3 className="text-center font-bold">{columnTitles[name]}</h3>
      <div className="flex h-full flex-col gap-3 overflow-y-auto bg-blue-900 p-2 text-center">
        {cards.map((card) => (
          <Card
            key={card.title}
            title={card.title}
            description={card.description}
          />
        ))}
        <AddCard boardId={boardId} column={name} />
      </div>
    </div>
  );
}

function useSearchUrl() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const get = useCallback((param: string) => searchParams.get(param), []);
  const set = useCallback(
    (param: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set(param, value);
      } else {
        params.delete(param);
      }

      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams],
  );
  return [get, set];
}

export function BoardView({ boards }: { boards: BoardType[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [boardId, setBoardId] = useState(searchParams.get("board"));

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (boardId) {
      params.set("board", boardId);
    } else {
      params.delete("board");
    }

    replace(`${pathname}?${params.toString()}`);
  }, [boardId, pathname, replace, searchParams]);

  const seachBoardId = searchParams.get("board") ?? "";

  const curBoard = boards.find((board) => board.id === seachBoardId);

  const toDoCards =
    curBoard?.cards.filter((card) => card.column === ColumnEnum.TO_DO) ?? [];

  const inProgressCards =
    curBoard?.cards.filter((card) => card.column === ColumnEnum.IN_PROGRESS) ??
    [];

  const doneCards =
    curBoard?.cards.filter((card) => card.column === ColumnEnum.DONE) ?? [];

  return (
    <div className="flex min-h-full w-full flex-col items-stretch gap-5 p-2">
      <div className="flex gap-4">
        <div className="h-[40px] w-full rounded-[20px] bg-green-300 text-black">
          <input
            className="h-full w-full outline-none"
            defaultValue={searchParams.get("board") ?? ""}
            onChange={(e) => setBoardId(e.target.value)}
          />
        </div>
        <button
          className="rounded-[20px] bg-green-300 px-3 text-black"
          onClick={handleSearch}
        >
          Load
        </button>
      </div>
      <div className="flex h-full gap-3">
        <Column
          boardId={seachBoardId}
          name={ColumnEnum.TO_DO}
          cards={toDoCards}
        />
        <Column
          boardId={seachBoardId}
          name={ColumnEnum.IN_PROGRESS}
          cards={inProgressCards}
        />
        <Column
          boardId={seachBoardId}
          name={ColumnEnum.DONE}
          cards={doneCards}
        />
      </div>
    </div>
  );
}
