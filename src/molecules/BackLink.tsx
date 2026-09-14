import { cn } from '../lib/utils';

export function BackLink({
  onClick,
  children,
  className,
}: {
  onClick(): void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('text-[13px] text-zinc-500 transition-colors hover:text-zinc-900', className)}
    >
      {children}
    </button>
  );
}
