import { useId, useRef, useState, type ReactNode } from 'react';
import { Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { useDismiss } from '../lib/useDismiss';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';

export interface OptionsMenuItem {
  key: string;
  label: ReactNode;
  hint?: ReactNode;
  checked: boolean;
  onChange: (on: boolean) => void;
}

export interface OptionsMenuProps {
  items: OptionsMenuItem[];
  /** aria-label / tooltip of the icon button. */
  label?: string;
  /** The trigger's icon (default a settings glyph). */
  icon?: ReactNode;
  /** Which edge of the button the panel lines up with. */
  align?: 'left' | 'right';
  className?: string;
}

// A page's view options behind an icon button: a small panel of checkboxes ("Show archived").
export function OptionsMenu({ items, label = 'View options', icon, align = 'right', className }: OptionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useDismiss(open, [ref], (reason) => {
    setOpen(false);
    if (reason === 'escape' && ref.current?.contains(document.activeElement)) trigger.current?.focus();
  });
  return (
    <div ref={ref} className={cn('relative inline-flex', className)}>
      <Button
        ref={trigger}
        type="button"
        variant="outline"
        size="icon"
        aria-label={label}
        title={label}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className={cn('text-muted-foreground hover:text-foreground', open && 'bg-ds-gray-alpha-100 text-foreground')}
        onClick={() => setOpen((v) => !v)}
      >
        {icon ?? <Settings2 />}
      </Button>
      {open && (
        <div
          id={panelId}
          role="group"
          aria-label={label}
          className={cn(
            'absolute top-full z-50 mt-1 flex w-64 flex-col rounded-xl border border-border bg-popover p-1 text-popover-foreground shadow-ds-medium',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((i) => (
            <Checkbox
              key={i.key}
              checked={i.checked}
              onChange={(e) => i.onChange(e.target.checked)}
              wrapperClassName="flex w-full items-start rounded-md px-2 py-1.5 hover:bg-ds-gray-alpha-100"
              label={
                <span className="flex flex-col">
                  <span className="text-xs leading-4 text-foreground">{i.label}</span>
                  {i.hint && <span className="text-[11px] text-ds-gray-700">{i.hint}</span>}
                </span>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
