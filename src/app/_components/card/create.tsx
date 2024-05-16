"use client";

import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";
import { CardType } from "./types";
import { Column } from "@prisma/client";

export function CreateCard({
  boardId,
  column,
}: {
  boardId: string;
  column: Column;
}) {
  const [cardData, setCardData] = useState<
    Pick<CardType, "title" | "description">
  >({ title: "", description: "" });

  const router = useRouter();
  const utils = api.useUtils();

  const createCard = api.board.createCard.useMutation({
    onSuccess: async () => {
      router.refresh();
      await utils.board.invalidate();
      setCardData({ title: "", description: "" });
    },
  });
  // const createCard = api.card.create.useMutation({
  //   async onMutate() {
  //     const prevData = utils.board.list.getData();
  //     utils.board.
  //     // await utils.board.invalidate();
  //   },
  //   onSuccess: () => {
  //     router.refresh();
  //     setCardData({ title: "", description: "" });
  //   },
  // });

  const { title, description } = cardData;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        createCard.mutate({ title, description, column, boardId });

        // await utils.board.invalidate();
      }}
      className="flex grow flex-col items-center justify-center gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setCardData((v) => ({ ...v, title: e.target.value }))}
        className="w-full rounded-[10px] border-[1px] border-black px-4 py-2 text-black"
      />
      <input
        type="text"
        placeholder="Descripton"
        value={description}
        onChange={(e) =>
          setCardData((v) => ({ ...v, description: e.target.value }))
        }
        className="w-full rounded-[10px] border-[1px] border-black px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="w-full rounded-[10px] bg-gray-800 px-3 py-2 font-semibold text-white transition"
        disabled={createCard.isPending}
      >
        {createCard.isPending ? <CircularProgress size={"20px"} /> : "Submit"}
      </button>
    </form>
  );
}
