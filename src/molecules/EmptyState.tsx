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
      <div className="mb-3.5 flex h-11 w-11 items-center justify-center rounded-[10px] border border-zinc-200 bg-zinc-100 text-xl text-zinc-400">
        {icon ?? '☐'}
      </div>
      <div className="text-[15px] font-semibold text-zinc-900">{title}</div>
      {description && (
        <div className="mx-auto mt-1 max-w-[240px] text-[13px] text-zinc-500">{description}</div>
      )}
      {action && <div className="mt-3.5">{action}</div>}
    </div>
  );
}
