import { Fragment, cloneElement, isValidElement, useId, type ReactElement, type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface FormFieldProps {
  label: ReactNode;
  /** Helper text under the control; hidden while `error` is shown. */
  hint?: ReactNode;
  /** Error line under the control. Also marks the control `aria-invalid`. */
  error?: ReactNode;
  required?: boolean;
  /** Overrides the generated id (the control gets it unless it already has its own). */
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

type ControlProps = { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: boolean | 'true' | 'false' };

// Label + control + hint/error. A single element child is wired up automatically:
// id ↔ htmlFor, aria-describedby → hint/error, aria-invalid when `error` is set.
export function FormField({ label, hint, error, required, htmlFor, className, children }: FormFieldProps) {
  const autoId = useId();
  const child =
    isValidElement<ControlProps>(children) && children.type !== Fragment ? (children as ReactElement<ControlProps>) : null;
  const id = htmlFor ?? child?.props.id ?? autoId;
  const messageId = `${id}-message`;
  const message = error || hint;

  const control = child
    ? cloneElement(child, {
        id,
        'aria-describedby': [child.props['aria-describedby'], message && messageId].filter(Boolean).join(' ') || undefined,
        'aria-invalid': error ? true : child.props['aria-invalid'],
      })
    : children;

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={child ? id : htmlFor} className="text-[13px] font-medium text-muted-foreground">
        {label}
        {required && (
          <span aria-hidden className="ml-0.5 text-ds-red-900">
            *
          </span>
        )}
      </label>
      {control}
      {message && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={cn('text-xs', error ? 'text-ds-red-900' : 'text-ds-gray-700')}
        >
          {message}
        </p>
      )}
    </div>
  );
}
