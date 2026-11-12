import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Known values offered as you type (the browser's own datalist): any text still goes, the list only helps.
   * Shown as given; the browser filters them by the text. Ignored when `list` is set. For a closed list use SearchSelect.
   */
  suggestions?: readonly string[];
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, suggestions, list, ...props }, ref) => {
  const listId = React.useId();
  const withList = !list && !!suggestions?.length;
  const input = (
    <input
      type={type}
      list={withList ? listId : list}
      className={cn(
        'border-input bg-background placeholder:text-ds-gray-700 flex h-8 w-full rounded-md border px-3 py-1 text-sm transition-shadow file:border-0 file:bg-transparent file:text-sm file:font-medium hover:border-ds-gray-alpha-500 focus-visible:outline-none focus-visible:shadow-ds-input-focus disabled:cursor-not-allowed disabled:bg-ds-background-200 disabled:text-ds-gray-700 aria-[invalid=true]:border-ds-red-700',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
  if (!withList) return input;
  return (
    <>
      {input}
      <datalist id={listId}>
        {suggestions!.map((s) => (
          <option key={s} value={s} />
        ))}
      </datalist>
    </>
  );
});
Input.displayName = 'Input';

export { Input };
