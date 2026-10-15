import * as React from 'react';
import { Check, Minus } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Shows a dash instead of a check (e.g. "some children selected"). Visual only — `checked` stays as given. */
  indeterminate?: boolean;
  /** Inline label; clicking it toggles the box. */
  label?: React.ReactNode;
  /** Classes for the outer <label>/<span> wrapper. */
  wrapperClassName?: string;
}

// Native checkbox with a Geist face: 16px, 4px radius, gray-1000 when checked.
const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, wrapperClassName, indeterminate = false, label, disabled, ...props }, ref) => {
    const inner = React.useRef<HTMLInputElement>(null);
    React.useImperativeHandle(ref, () => inner.current!);
    React.useEffect(() => {
      if (inner.current) inner.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const Icon = indeterminate ? Minus : Check;
    const box = (
      <span className="relative inline-flex size-4 shrink-0">
        <input
          ref={inner}
          type="checkbox"
          disabled={disabled}
          className={cn(
            'peer size-4 cursor-pointer appearance-none rounded-sm border border-ds-gray-alpha-600 bg-background transition-colors',
            'hover:border-ds-gray-1000 checked:border-ds-gray-1000 checked:bg-ds-gray-1000',
            'indeterminate:border-ds-gray-1000 indeterminate:bg-ds-gray-1000',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'disabled:cursor-not-allowed disabled:border-ds-gray-alpha-400 disabled:bg-ds-background-200',
            'disabled:checked:bg-ds-gray-600 disabled:checked:border-ds-gray-600',
            className,
          )}
          {...props}
        />
        <Icon
          aria-hidden
          strokeWidth={3}
          className={cn(
            'pointer-events-none absolute inset-0.5 size-3 text-ds-background-100 opacity-0',
            indeterminate ? 'peer-indeterminate:opacity-100' : 'peer-checked:opacity-100',
          )}
        />
      </span>
    );

    if (!label) return wrapperClassName ? <span className={wrapperClassName}>{box}</span> : box;
    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 text-sm text-foreground',
          disabled ? 'cursor-not-allowed text-ds-gray-700' : 'cursor-pointer',
          wrapperClassName,
        )}
      >
        {box}
        <span className="min-w-0">{label}</span>
      </label>
    );
  },
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
