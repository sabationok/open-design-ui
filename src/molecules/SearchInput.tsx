import { cn } from '../lib/utils';

export function SearchInput({ className, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      className={cn('flex-1 min-w-[160px] rounded-md border border-border px-3 py-[7px] font-mono text-[13px] placeholder:text-ds-gray-700 focus:outline-none focus-visible:shadow-ds-input-focus', className)}
      {...props}
    />
  );
}
