import { type ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface TabButtonsItem<T extends string> {
  key: T;
  label: string;
  icon?: ReactNode;
}

export interface TabButtonsProps<T extends string> {
  tabs: readonly TabButtonsItem<T>[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}

export function TabButtons<T extends string>({
  tabs,
  value,
  onChange,
  className,
}: TabButtonsProps<T>) {
  return (
    <div className={cn('inline-flex gap-0.5 rounded-[10px] bg-zinc-100 p-[3px]', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          type="button"
          onClick={() => onChange(tab.key)}
          className={cn(
            'flex items-center gap-1.5 rounded-[8px] px-3 py-1.5 text-[13px] font-medium transition-all',
            value === tab.key
              ? 'bg-white text-zinc-900 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-700',
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
