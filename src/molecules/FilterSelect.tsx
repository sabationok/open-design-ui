import { cn } from '../lib/utils';

export function FilterSelect({ className, ...props }: React.ComponentProps<'select'>) {
  return (
    <select
      className={cn('rounded-md border border-zinc-200 bg-white px-3 py-[7px] text-[13px] text-zinc-700 focus:outline-none', className)}
      {...props}
    />
  );
}
