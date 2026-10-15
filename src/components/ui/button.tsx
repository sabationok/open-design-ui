import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'border border-ds-red-400 bg-background text-ds-red-900 hover:bg-ds-red-100',
        outline: 'border border-border bg-background text-foreground hover:bg-ds-gray-alpha-100 disabled:text-ds-gray-600',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-ds-gray-200',
        ghost: 'text-foreground hover:bg-ds-gray-alpha-100',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        // Geist scale: tiny 24 · small 32 · medium 40. Dashboards default to "small".
        default: 'h-8 px-3',
        sm: 'h-6 px-2 text-xs [&_svg]:size-3.5',
        lg: 'h-10 px-4',
        icon: 'h-8 w-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
