import { forwardRef, type ReactNode } from 'react';
import { Button, type ButtonProps } from '../components/ui/button';
import { cn } from '../lib/utils';
import { CONTROL_SQUARE, type ComponentSize } from '../lib/componentSize';

export interface IconButtonProps extends Omit<ButtonProps, 'aria-label' | 'size' | 'variant' | 'children' | 'asChild'> {
  /** The button's only name: `aria-label`, and the tooltip unless `title` is given. */
  label: string;
  /** The icon. Sized by the button (`size-3.5` at xs, `size-4` above). */
  children: ReactNode;
  size?: ComponentSize;
  /** Destructive action (delete): reddens on hover. */
  danger?: boolean;
}

const ICON: Record<ComponentSize, string> = { xs: '[&_svg]:size-3.5', sm: '[&_svg]:size-4', md: '[&_svg]:size-4' };

// A quiet square icon-only button (edit, delete, add in a row or a heading), on the library `Button`.
// A text button is `Button`; an icon-only route link is `IconLink`.
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, title, size = 'sm', danger, className, children, type = 'button', ...rest },
  ref,
) {
  return (
    <Button
      ref={ref}
      type={type}
      variant="ghost"
      size="icon"
      aria-label={label}
      title={title ?? label}
      className={cn(
        'shrink-0 text-muted-foreground hover:text-foreground',
        CONTROL_SQUARE[size],
        ICON[size],
        danger && 'hover:bg-vui-danger-bg hover:text-vui-danger-text',
        className,
      )}
      {...rest}
    >
      {children}
    </Button>
  );
});
