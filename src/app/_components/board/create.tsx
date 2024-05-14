"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateBoard() {
  const router = useRouter();
  const [name, setName] = useState("");

  const createBoard = api.board.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setName("");
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createBoard.mutate({ name });
      }}
      className="flex grow flex-col items-center justify-center gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-[10px] border-[1px] border-black px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="w-full rounded-[10px] bg-gray-800 px-3 py-2 font-semibold text-white transition"
        disabled={createBoard.isPending}
      >
        {createBoard.isPending ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
