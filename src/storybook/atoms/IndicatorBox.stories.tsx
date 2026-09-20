import type { Meta, StoryObj } from '@storybook/react-vite';
import { IndicatorBox } from '../../atoms/IndicatorBox';
import { newBadgeDecorator } from '../lib/newBadge';

const meta = {
  title: 'Atoms/IndicatorBox',
  tags: ['autodocs'],
  decorators: [newBadgeDecorator('Atoms/IndicatorBox')],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => (
    <div className="flex max-w-sm flex-col gap-2.5">
      <IndicatorBox tone="neutral">Neutral content block.</IndicatorBox>
      <IndicatorBox tone="accent">Accent content block.</IndicatorBox>
      <IndicatorBox tone="success">Success content block.</IndicatorBox>
      <IndicatorBox tone="warning">Warning content block.</IndicatorBox>
      <IndicatorBox tone="danger">Danger content block.</IndicatorBox>
    </div>
  ),
};

export const AsHint: Story = {
  name: 'Composed as a hint',
  render: () => (
    <IndicatorBox tone="accent" className="max-w-sm">
      <div className="text-[13px] font-semibold text-zinc-900">Tip</div>
      <p className="mt-1 text-[13px] text-zinc-600">Assign items to yourself or delegate to Claude/Fable by tapping the owner pill.</p>
    </IndicatorBox>
  ),
};

export const AsIssueCard: Story = {
  name: 'Composed as a finding card',
  render: () => (
    <IndicatorBox tone="danger" className="max-w-sm">
      <div className="font-mono text-[11px] font-semibold text-vui-danger-text">SEC7</div>
      <div className="mt-1 text-[14px] font-semibold text-zinc-900">SQL injection via interpolated jsonb_set</div>
      <p className="mt-1.5 text-[13px] text-zinc-600">Bind key/value as parameters instead of interpolating them into the query string.</p>
      <div className="mt-2 flex gap-1.5">
        <span className="rounded-[5px] border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">statistics</span>
        <span className="rounded-[5px] border border-zinc-200 bg-zinc-100 px-1.5 py-0.5 font-mono text-[10px] text-zinc-500">security</span>
      </div>
    </IndicatorBox>
  ),
};

export const CustomColor: Story = {
  render: () => (
    <IndicatorBox color="#7c3aed" className="max-w-sm">
      One-off category color via the <code className="font-mono text-[12px]">color</code> escape hatch.
    </IndicatorBox>
  ),
};
