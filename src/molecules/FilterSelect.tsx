import { Select, type SelectProps } from '../components/ui/select';
import { cn } from '../lib/utils';

/** @deprecated Use `Select` — same control; `FilterSelect` only sets `w-auto` for filter bars. */
export function FilterSelect({ wrapperClassName, ...props }: SelectProps) {
  return <Select wrapperClassName={cn('w-auto', wrapperClassName)} {...props} />;
}
