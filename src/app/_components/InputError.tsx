import { cn } from "~/utils/cn";

export function InputError({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("w-full ps-1 text-start text-red-500", className)}>
      {children}
    </div>
  );
}
