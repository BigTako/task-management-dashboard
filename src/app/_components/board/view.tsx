"use client";

import { AddCard, Card, CardType } from "../card";
import { BoardType } from "./types";
import { Column as ColumnEnum } from "@prisma/client";
import { useSearchUrl } from "../_hooks";
import { BoardSearch } from "./search";

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

export function BoardView({ boards }: { boards: BoardType[] }) {
  const { getParam } = useSearchUrl();

  const seachBoardId = getParam("board") ?? "";

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
      <BoardSearch />

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
