import { api } from "~/trpc/server";
import { AddBoard, Board } from "./_components/board";
import { CardType } from "./_components/card";
import { AddCard, Card } from "./_components/card";

const columnTitles = {
  IN_PROGRESS: "In Progress",
  TO_DO: "To Do",
  DONE: "Done",
};

function Column({ title, cards }: { title: string; cards: CardType[] }) {
  return (
    <div className="flex max-w-[33%] grow flex-col gap-2">
      <h3 className="text-center font-bold">{title}</h3>
      <div className="flex h-full flex-col gap-3 overflow-y-auto bg-blue-900 p-2 text-center">
        {cards.map((card) => (
          <Card
            key={card.title}
            title={card.title}
            description={card.description}
          />
        ))}
        <AddCard />
      </div>
    </div>
  );
}

export default async function Home() {
  const boards = await api.board.list();

  if (!boards) {
    return <div>Loading...</div>;
  }

  const curBoard = boards[1];

  return (
    <main className="flex min-h-full flex-row gap-5 bg-gradient-to-b from-[#2e026d] to-[#15162c] p-3 text-white">
      <div className="flex min-h-[100%] w-[500px] flex-col justify-start gap-4 border-r-[1px] border-r-blue-500 p-3">
        {boards.map((b) => (
          <Board key={b.id} id={b.id} name={b.name} />
        ))}
        <AddBoard />
        {/* <ListBoard /> */}
      </div>
      <div className="flex min-h-full w-full flex-col items-stretch gap-5 p-2">
        <div className="flex gap-4">
          <div className="h-[40px] w-full rounded-[20px] bg-green-300 text-black"></div>
          <button className="rounded-[20px] bg-green-300 px-3 text-black">
            Load
          </button>
        </div>
        <div className="flex h-full gap-3">
          <Column
            title="To Do"
            cards={
              curBoard?.cards.filter((card) => card.column === "TO_DO") ?? []
            }
          />
          <Column
            title="In Progress"
            cards={
              curBoard?.cards.filter((card) => card.column === "IN_PROGRESS") ??
              []
            }
          />
          <Column
            title="Done"
            cards={
              curBoard?.cards.filter((card) => card.column === "DONE") ?? []
            }
          />
        </div>
      </div>
      {/* <CreateBoard /> */}
    </main>
  );
}
