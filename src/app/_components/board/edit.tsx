"use client";

import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

export function EditBoard({ id, name }: { id: string; name: string }) {
  const [newName, setNewName] = useState(name);

  const router = useRouter();
  const updateBoard = api.board.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        updateBoard.mutate({ id, body: { name: newName } });
      }}
      className="flex grow flex-col items-center justify-center gap-2"
    >
      <input
        type="text"
        placeholder="Title"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="w-full rounded-[10px] border-[1px] border-black px-4 py-2 text-black"
      />
      <button
        type="submit"
        className="w-full rounded-[10px] bg-gray-800 px-3 py-2 font-semibold text-white transition"
        disabled={updateBoard.isPending}
      >
        {updateBoard.isPending ? <CircularProgress size={"20px"} /> : "Submit"}
      </button>
    </form>
  );
}
