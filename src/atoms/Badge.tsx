import * as React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { Dot } from './Dot';

export type BadgeVariant = 'tone' | 'status' | 'swatch';
export type BadgeTone = 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
export type BadgeSize = 'sm' | 'md';
export type BadgeAppearance = 'filled' | 'bordered';

export interface BadgeColors {
  /** Combined `bg-*`/`text-*` classes. */
  main?: string;
  border?: string;
  dot?: string;
}

export interface BadgeConfigEntry {
  /** Preferred way to color a status/swatch entry — resolves `colors` from the shared tone palette. */
  tone?: BadgeTone;
  /** Escape hatch for one-off colors that don't map to a shared tone (e.g. arbitrary category colors). Overrides individual `tone`-derived fields when set. */
  colors?: BadgeColors;
  color?: string; // variant="swatch" — swatch square color (hex)
  label?: string;
  getLabel?: (key: string) => string;
  getColor?: (key: string) => string; // variant="swatch"
}
export type BadgeConfig = Record<string, BadgeConfigEntry>;

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;

  // variant="tone"
  tone?: BadgeTone;
  children?: React.ReactNode;

  // variant="status" | "swatch" — value lookup
  value?: string;
  config?: BadgeConfig;
  fallback?: BadgeConfigEntry;
  // key used to look up `config` — defaults to the raw value ("status" variant) or
  // value.toLowerCase() ("swatch" variant), matching each variant's prior behavior
  getKey?: (value: string) => string;

  // variant="status"
  withDot?: boolean;
  appearance?: BadgeAppearance;
  mono?: boolean;
}

const toneVariants = cva('inline-flex items-center font-semibold transition-colors', {
  variants: {
    size: {
      md: 'rounded-full border px-2.5 py-0.5 text-xs',
      sm: 'rounded-[4px] px-2 py-0.5 text-[11px]',
    },
    tone: {
      default: '',
      secondary: '',
      destructive: '',
      outline: '',
      success: '',
      warning: '',
    },
  },
  compoundVariants: [
    { size: 'md', tone: 'default', class: 'border-transparent bg-primary text-primary-foreground' },
    { size: 'md', tone: 'secondary', class: 'border-transparent bg-secondary text-secondary-foreground' },
    { size: 'md', tone: 'destructive', class: 'border-transparent bg-destructive text-destructive-foreground' },
    { size: 'md', tone: 'outline', class: 'text-foreground' },
    { size: 'md', tone: 'success', class: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { size: 'md', tone: 'warning', class: 'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { size: 'sm', tone: 'default', class: 'bg-zinc-100 text-zinc-600' },
    { size: 'sm', tone: 'secondary', class: 'bg-zinc-100 text-zinc-600' },
    { size: 'sm', tone: 'outline', class: 'bg-zinc-100 text-zinc-600' },
    { size: 'sm', tone: 'destructive', class: 'bg-vui-danger-bg text-vui-danger-text' },
    { size: 'sm', tone: 'success', class: 'bg-vui-success-bg text-vui-success-text' },
    { size: 'sm', tone: 'warning', class: 'bg-vui-warning-bg text-vui-warning-text' },
  ],
  defaultVariants: { size: 'md', tone: 'default' },
});

// Shared color palette for variant="status" — reused by every entity-specific config (WebhookStatusBadge,
// RequestStatusBadge, ...) via `entry.tone` so callers don't have to hand-write bg/text/border/dot classes
// per status. `default`/`secondary` intentionally share the neutral "pending" look.
const TONE_PALETTE: Record<BadgeTone, Required<BadgeColors>> = {
  default: { main: 'bg-vui-neutral-bg text-vui-neutral-text', border: 'border-vui-neutral-border', dot: 'bg-vui-neutral' },
  secondary: { main: 'bg-vui-neutral-bg text-vui-neutral-text', border: 'border-vui-neutral-border', dot: 'bg-vui-neutral' },
  outline: { main: 'bg-transparent text-zinc-700', border: 'border-zinc-300', dot: 'bg-zinc-400' },
  destructive: { main: 'bg-vui-danger-bg text-vui-danger-text', border: 'border-vui-danger-border', dot: 'bg-vui-danger' },
  success: { main: 'bg-vui-success-bg text-vui-success-text', border: 'border-vui-success-border', dot: 'bg-vui-success' },
  warning: { main: 'bg-vui-warning-bg text-vui-warning-text', border: 'border-vui-warning-border', dot: 'bg-vui-warning' },
};

const DEFAULT_STATUS_COLORS: Required<BadgeColors> = { main: 'bg-zinc-100 text-zinc-600', border: 'border-zinc-200', dot: 'bg-zinc-400' };
const DEFAULT_SWATCH_COLOR = '#71717a';

function resolveColors(entry: BadgeConfigEntry): Required<BadgeColors> {
  const palette = entry.tone ? TONE_PALETTE[entry.tone] : DEFAULT_STATUS_COLORS;
  return {
    main: entry.colors?.main ?? palette.main,
    border: entry.colors?.border ?? palette.border,
    dot: entry.colors?.dot ?? palette.dot,
  };
}

export function Badge({
  variant = 'tone',
  size = 'md',
  className,
  tone = 'default',
  children,
  value = '',
  config = {},
  fallback,
  getKey,
  withDot = true,
  appearance = 'filled',
  mono = false,
}: BadgeProps) {
  if (variant === 'swatch') {
    const key = (getKey ?? ((v: string) => v.toLowerCase()))(value);
    const entry = config[key] ?? fallback ?? {};
    const label = entry.getLabel?.(key) ?? entry.label ?? value;
    const swatchColor = entry.getColor?.(key) ?? entry.color ?? DEFAULT_SWATCH_COLOR;
    return (
      <span
        className={cn(
          'inline-flex items-center gap-[7px] rounded-[4px] border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700',
          className,
        )}
      >
        <span className="h-3.5 w-3.5 shrink-0 rounded-[3px]" style={{ background: swatchColor }} />
        {label}
      </span>
    );
  }

  if (variant === 'status') {
    const key = (getKey ?? ((v: string) => v))(value);
    const entry = config[key] ?? fallback;
    const colors = entry ? resolveColors(entry) : DEFAULT_STATUS_COLORS;
    return (
      <span
        className={cn(
          'inline-flex items-center rounded-[4px] font-medium',
          size === 'sm' ? 'gap-1 px-2 py-0.5 text-[11px]' : 'gap-1.5 px-2.5 py-0.5 text-xs',
          mono && 'font-mono text-[11px]',
          colors.main,
          appearance === 'bordered' && cn('border', colors.border),
          className,
        )}
      >
        {withDot && <Dot color={colors.dot} />}
        {value}
      </span>
    );
  }

  return <div className={cn(toneVariants({ tone, size }), className)}>{children}</div>;
}
