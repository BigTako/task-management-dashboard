import { ReactNode, useCallback, useState } from "react";
import {
  BsPencilSquare,
  BsPlusCircle,
  BsTrashFill,
  BsXCircleFill,
} from "react-icons/bs";
import { cn } from "~/utils/cn";
import { CreateCard } from "./create";
import { Column } from "@prisma/client";

function CardLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-[10px] bg-white p-3 text-gray-800",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Card({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <CardLayout className="text-start">
      <div className="flex justify-between gap-2">
        <div>
          <div className="font-bold">{title}</div>
          <div>{description}</div>
        </div>
        <div className="flex flex-col gap-3">
          <button className="text-[20px]">
            <BsPencilSquare />
          </button>
          <button className="text-[20px]">
            <BsTrashFill />
          </button>
        </div>
      </div>
    </CardLayout>
  );
}

export function AddCard({
  boardId,
  column,
}: {
  boardId: string;
  column: Column;
}) {
  const [formOpened, setFormOpened] = useState(false);

  const toggleFormOpened = useCallback(() => {
    setFormOpened((v) => !v);
  }, []);
  return (
    <CardLayout className="cursor-pointer">
      <div>
        {formOpened ? (
          <div className="flex gap-2">
            <CreateCard boardId={boardId} column={column} />
            {/* <CreateBoard /> */}
            <h2 className="flex flex-col gap-2 text-[20px]">
              <BsXCircleFill onClick={toggleFormOpened} />
            </h2>
          </div>
        ) : (
          <h1
            className="flex justify-center text-center text-2xl"
            onClick={toggleFormOpened}
          >
            <BsPlusCircle />
          </h1>
        )}
      </div>
    </CardLayout>
  );
}
