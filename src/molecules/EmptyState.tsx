import { isValidElement, type ComponentType, type ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../lib/utils';

type IconComponent = ComponentType<{ className?: string }>;

export type EmptyStateVariant = 'plain' | 'dashed';

export interface EmptyStateProps {
  /** A rendered node (`<Icon />`, an emoji) or an icon component (`Inbox`). Defaults to an inbox icon. */
  icon?: ReactNode | IconComponent;
  title: ReactNode;
  description?: ReactNode;
  /** One or more next-step controls. */
  action?: ReactNode;
  /** "plain" sits inside an existing card; "dashed" draws its own dashed drop-zone outline. */
  variant?: EmptyStateVariant;
  className?: string;
}

const VARIANT: Record<EmptyStateVariant, { root: string; tile: string; title: string; description: string; action: string }> = {
  plain: {
    root: 'justify-center py-12',
    tile: 'mb-3.5 h-11 w-11 rounded-lg border border-border bg-ds-gray-100 text-xl text-ds-gray-700 [&_svg]:size-5',
    title: 'text-[15px] font-semibold',
    description: 'mx-auto mt-1 max-w-[240px]',
    action: 'mt-3.5',
  },
  dashed: {
    root: 'gap-2 rounded-xl border border-dashed border-ds-gray-alpha-500 px-6 py-10',
    tile: 'size-10 rounded-full border border-border bg-ds-background-200 text-ds-gray-700 [&_svg]:size-5',
    title: 'mt-1 text-sm font-medium',
    description: 'max-w-sm',
    action: 'mt-2',
  },
};

// lucide icons are forwardRef objects, so "is a component" is not just `typeof === 'function'`.
function isIconComponent(icon: EmptyStateProps['icon']): icon is IconComponent {
  if (typeof icon === 'function') return true;
  return typeof icon === 'object' && icon !== null && !isValidElement(icon) && '$$typeof' in icon;
}

function renderIcon(icon: EmptyStateProps['icon']) {
  if (icon === undefined) return <Inbox aria-hidden />;
  if (isIconComponent(icon)) {
    const Icon = icon;
    return <Icon className="size-5" />;
  }
  return icon;
}

// Empty: an invitation, not an apology. Say what the space is for and offer the next step.
export function EmptyState({ icon, title, description, action, variant = 'plain', className }: EmptyStateProps) {
  const v = VARIANT[variant];
  return (
    <div className={cn('flex flex-col items-center text-center', v.root, className)}>
      <div className={cn('flex shrink-0 items-center justify-center', v.tile)}>{renderIcon(icon)}</div>
      <div className={cn('text-foreground', v.title)}>{title}</div>
      {description && <div className={cn('text-[13px] text-muted-foreground', v.description)}>{description}</div>}
      {action && <div className={cn('flex flex-wrap justify-center gap-2', v.action)}>{action}</div>}
    </div>
  );
}
