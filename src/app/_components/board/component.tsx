"use client";

import { ReactNode, useCallback, useState } from "react";
import { cn } from "~/utils/cn";
import { BsPencilSquare } from "react-icons/bs";
import { BsTrashFill } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import { BsXCircle } from "react-icons/bs";

import { CreateBoard } from "./create";

function BoardLayout({
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

export function Board({ id, name }: { id: string; name: string }) {
  return (
    <BoardLayout>
      <div className="flex gap-2">
        <div>
          <h3 className="font-bold">{id}</h3>
          <h4>{name}</h4>
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
    </BoardLayout>
  );
}

export function AddBoard() {
  const [formOpened, setFormOpened] = useState(false);

  const toggleFormOpened = useCallback(() => {
    setFormOpened((v) => !v);
  }, []);

  return (
    <BoardLayout className="cursor-pointer text-center">
      <div>
        {formOpened ? (
          <div className="flex gap-2">
            <CreateBoard />
            <h2 className="flex flex-col gap-2 text-[20px]">
              <BsXCircle onClick={toggleFormOpened} />
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
    </BoardLayout>
  );
}
