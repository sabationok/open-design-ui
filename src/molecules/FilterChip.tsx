import { cn } from '../lib/utils';

interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  variant?: 'default' | 'directory';
  className?: string;
}

export function FilterChip({ label, onRemove, variant = 'default', className }: FilterChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md text-sm',
        variant === 'default' && 'border border-vui-accent-border bg-vui-accent-bg px-3 py-[7px] text-vui-accent-text',
        variant === 'directory' && 'border border-dashed border-cyan-400 bg-cyan-50 px-3 py-[7px] font-mono text-xs text-cyan-700',
        className,
      )}
    >
      {label}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 leading-none opacity-70 hover:opacity-100 transition-opacity"
          aria-label={`Remove ${label} filter`}
        >
          ×
        </button>
      )}
    </span>
  );
}
