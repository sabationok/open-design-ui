import type { ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import type { ComponentSize } from '../lib/componentSize';

export type ToggleChipTone = 'accent' | 'warning' | 'danger';
export type ToggleChipSize = Extract<ComponentSize, 'sm' | 'md'>;

const ON: Record<ToggleChipTone, string> = {
  accent: 'border-vui-accent-border bg-vui-accent-bg text-vui-accent-text',
  warning: 'border-vui-warning-border bg-vui-warning-bg text-vui-warning-text',
  danger: 'border-vui-danger-border bg-vui-danger-bg text-vui-danger-text',
};

const chipVariants = cva(
  'inline-flex items-center whitespace-nowrap rounded-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: { sm: 'px-2 py-0.5 text-xs', md: 'px-2.5 py-1 text-[13px]' },
    },
    defaultVariants: { size: 'md' },
  },
);

export interface ToggleChipProps {
  pressed: boolean;
  onClick: () => void;
  /** Colours the chip when it is on. */
  tone?: ToggleChipTone;
  size?: ToggleChipSize;
  title?: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/**
 * One button that is on or off (`aria-pressed`): a filter over a list, "for this card / for all". Controlled.
 * A group of them is laid out by its caller. For one choice of 2-5 use TabButtons, for a list of options ChipMultiSelect.
 */
export function ToggleChip({ pressed, onClick, tone = 'accent', size, title, disabled, className, children }: ToggleChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        chipVariants({ size }),
        pressed ? ON[tone] : 'border-input text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  );
}
