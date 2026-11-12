import type { ReactNode } from 'react';
import { TabsGroup, type TabsGroupLink, type TabsGroupUrlProps } from '../atoms/TabsGroup';
import { cn } from '../lib/utils';

export interface TabBarProps {
  children: ReactNode;
  className?: string;
}

// Underlined tab row for state-driven tabs; fill with `TabButton`s.
export function TabBar({ children, className }: TabBarProps) {
  return <div className={cn('mb-4 flex gap-1 border-b border-border', className)}>{children}</div>;
}

export type NavTabItem = TabsGroupLink;

export interface NavTabsProps {
  items: NavTabItem[];
  /** Accessible name of the <nav>. */
  label?: string;
  size?: TabsGroupUrlProps['size'];
  /** Per tab `to`: a filled / hollow "is set" dot. */
  marks?: TabsGroupUrlProps['marks'];
  className?: string;
}

// Route-driven underlined tabs (each tab is a NavLink): the `navType: 'url'` preset of `TabsGroup`, padded to the
// page gutter. Scrolls horizontally on phones.
export function NavTabs({ items, label = 'Tabs', size, marks, className }: NavTabsProps) {
  return (
    <TabsGroup
      navType="url"
      items={items}
      label={label}
      size={size}
      marks={marks}
      className={cn('px-2 sm:px-4', className)}
    />
  );
}
