import { ReactNode } from "react";
import { cn } from "~/utils/cn";

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
        "flex flex-col gap-2 border-[2px] border-red-600 p-3 text-start",
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
    <CardLayout>
      <div>{title}</div>
      <div>{description}</div>
    </CardLayout>
  );
}

export function AddCard() {
  return (
    <CardLayout>
      <h1 className="cursor-pointer text-center text-2xl">+</h1>
    </CardLayout>
  );
}
