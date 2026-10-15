import * as React from 'react';
import { cn } from '../../lib/utils';

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'border-input bg-background placeholder:text-ds-gray-700 flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm transition-shadow hover:border-ds-gray-alpha-500 focus-visible:outline-none focus-visible:shadow-ds-input-focus disabled:cursor-not-allowed disabled:bg-ds-background-200 disabled:text-ds-gray-700 aria-[invalid=true]:border-ds-red-700',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';

export { Textarea };
