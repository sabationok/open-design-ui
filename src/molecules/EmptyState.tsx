import { type ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-ds-gray-100 text-xl text-ds-gray-700">
        {icon ?? '☐'}
      </div>
      <div className="text-[15px] font-semibold text-foreground">{title}</div>
      {description && (
        <div className="mx-auto mt-1 max-w-[240px] text-[13px] text-muted-foreground">{description}</div>
      )}
      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );
}
