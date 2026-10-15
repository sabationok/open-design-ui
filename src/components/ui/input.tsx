import * as React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'border-input bg-background placeholder:text-ds-gray-700 flex h-8 w-full rounded-md border px-3 py-1 text-sm transition-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-ds-gray-alpha-500 focus-visible:outline-none focus-visible:shadow-ds-input-focus disabled:cursor-not-allowed disabled:bg-ds-background-200 disabled:text-ds-gray-700 aria-[invalid=true]:border-ds-red-700',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
