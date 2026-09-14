import { cn } from '../lib/utils';

export function SearchInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn('flex-1 min-w-[160px] rounded-md border border-zinc-200 px-3 py-[7px] font-mono text-[13px] placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none', className)}
      {...props}
    />
  );
}
