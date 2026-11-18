import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowDownLeft, ArrowUpRight, Ban, CheckCircle2, MessageSquare, Receipt } from 'lucide-react';
import { Timeline } from '../../molecules/Timeline';
import { TimelineDot } from '../../atoms/TimelineDot';

const meta = {
  title: 'Molecules/Timeline',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Original plain rail with absolute `TimelineDot`s (unchanged API). */
export const PlainRail: Story = {
  render: () => (
    <div className="max-w-md">
      <Timeline>
        {[
          { label: 'Attempt 3 delivered', meta: '200 OK · 84 ms', color: 'var(--vui-success)' },
          { label: 'Attempt 2 failed', meta: '503 Service Unavailable', color: 'var(--vui-danger)' },
          { label: 'Attempt 1 failed', meta: 'Timeout after 10 s', color: 'var(--vui-danger)' },
        ].map((a) => (
          <div key={a.label} className="relative">
            <TimelineDot color={a.color} />
            <div className="text-[13px] text-foreground">{a.label}</div>
            <div className="text-xs text-ds-gray-700">{a.meta}</div>
          </div>
        ))}
      </Timeline>
    </div>
  ),
};

/** Compound activity rail: icon dots, tones, trailing amounts, footer and a nested list. */
export const ActivityRail: Story = {
  render: () => {
    const [active, setActive] = useState('t1');
    return (
      <div className="max-w-md">
        <Timeline.Root aria-label="Transaction history">
          <Timeline.Item
            icon={ArrowDownLeft}
            tone="accent"
            title="Incoming transfer"
            meta="Oct 24, 2026 · Completed"
            trailing={<span className="font-mono text-[13px] tabular-nums text-foreground">+1,200.00</span>}
            active={active === 't1'}
            onClick={() => setActive('t1')}
          >
            <Timeline.Root>
              <Timeline.Item
                icon={Receipt}
                tone="warning"
                title="Processing fee"
                meta="Oct 24, 2026"
                trailing={<span className="font-mono text-[13px] tabular-nums text-foreground">-4.50</span>}
                active={active === 't2'}
                onClick={() => setActive('t2')}
              />
              <Timeline.Item
                icon={ArrowUpRight}
                title="Split to savings"
                meta="Oct 25, 2026"
                trailing={<span className="font-mono text-[13px] tabular-nums text-foreground">-300.00</span>}
                active={active === 't3'}
                onClick={() => setActive('t3')}
              />
            </Timeline.Root>
          </Timeline.Item>
          <Timeline.Item
            icon={MessageSquare}
            title="Comment added"
            meta="Oct 25, 2026"
            footer={
              <p className="rounded-md border border-border bg-ds-background-200 px-2.5 py-1.5 text-xs text-muted-foreground">
                Matches invoice 2026-114.
              </p>
            }
          />
          <Timeline.Item icon={Ban} tone="danger" title="Refund rejected" meta="Oct 26, 2026" />
          <Timeline.Item icon={CheckCircle2} tone="success" title="Reconciled" meta="Oct 27, 2026" />
          <Timeline.Item title="Created (no icon)" meta="Oct 20, 2026" />
        </Timeline.Root>
      </div>
    );
  },
};
