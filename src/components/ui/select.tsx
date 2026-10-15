import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Geist scale: sm 24px · default 32px · lg 40px — same heights as Button/Input. */
  size?: 'sm' | 'default' | 'lg';
  /** Classes for the wrapper (width, margins). `className` goes to the <select> itself. */
  wrapperClassName?: string;
}

const SIZE = {
  sm: 'h-6 pl-2 pr-7 text-xs',
  default: 'h-8 pl-3 pr-8 text-sm',
  lg: 'h-10 pl-3 pr-9 text-sm',
} as const;

// Native <select> styled as a Geist control: keyboard, mobile pickers and autofill work out of the box.
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, wrapperClassName, size = 'default', children, ...props }, ref) => (
    <div className={cn('relative inline-flex w-full', wrapperClassName)}>
      <select
        ref={ref}
        className={cn(
          'border-input bg-background text-foreground w-full appearance-none truncate rounded-md border transition-shadow',
          'hover:border-ds-gray-alpha-500 focus-visible:outline-none focus-visible:shadow-ds-input-focus',
          'disabled:cursor-not-allowed disabled:bg-ds-background-200 disabled:text-ds-gray-700',
          'aria-[invalid=true]:border-ds-red-700',
          SIZE[size],
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden
        className={cn(
          'pointer-events-none absolute top-1/2 -translate-y-1/2 text-ds-gray-700',
          size === 'sm' ? 'right-2 size-3.5' : 'right-2.5 size-4',
        )}
      />
    </div>
  ),
);
Select.displayName = 'Select';

export { Select };
