import { cn } from '~/utils/cn';

export function InputError({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('text-red w-full ps-1 text-start', className)}>{children}</div>;
}
