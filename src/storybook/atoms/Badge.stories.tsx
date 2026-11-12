import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from 'lucide-react';
import { Badge, type BadgeConfig, type BadgeTone } from '../../atoms/Badge';

// export from src/storybook/components
const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap gap-3">{children}</div>
);

// Illustrative only — real apps supply their own BadgeConfig keyed by their own
// domain enum (see e.g. dashboard-app's WebhookStatusBadge). Badge itself has no
// knowledge of any entity's status/provider/event-type vocabulary.
const STATUS_CONFIG: BadgeConfig = {
  delivered: { tone: 'success' },
  failed: { tone: 'destructive' },
  retrying: { tone: 'warning' },
  pending: { tone: 'default' },
};

const SWATCH_CONFIG: BadgeConfig = {
  red: { color: '#ef4444', label: 'Red' },
  blue: { color: '#3b82f6', label: 'Blue' },
  green: { color: '#22c55e', label: 'Green' },
};

const meta = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'tone',
    size: 'sm',
    tone: 'default',
    children: 'Status',
  },
  argTypes: {
    tone: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'neutral', 'accent', 'danger'] satisfies BadgeTone[],
    },
    size: { control: 'radio', options: ['sm', 'md'] },
    appearance: { control: 'radio', options: ['filled', 'bordered'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tone: Story = {};

export const AllTones: Story = {
  render: (args) => (
    <Row>
      {(['success', 'destructive', 'warning', 'default'] as const).map((tone) => (
        <Badge key={tone} {...args} tone={tone}>
          {tone}
        </Badge>
      ))}
    </Row>
  ),
};

export const StatusVariant: Story = {
  name: 'variant="status"',
  render: () => (
    <Row>
      {Object.keys(STATUS_CONFIG).map((status) => (
        <Badge key={status} variant="status" appearance="bordered" value={status} config={STATUS_CONFIG} />
      ))}
    </Row>
  ),
};

export const SwatchVariant: Story = {
  name: 'variant="swatch"',
  render: () => (
    <Row>
      {Object.keys(SWATCH_CONFIG).map((key) => (
        <Badge key={key} variant="swatch" value={key} config={SWATCH_CONFIG} />
      ))}
    </Row>
  ),
};

export const ChipTones: Story = {
  name: 'appearance="bordered" (chip) + icon',
  render: () => (
    <div className="flex flex-col gap-3">
      {(['sm', 'md'] as const).map((size) => (
        <Row key={size}>
          {(['neutral', 'accent', 'warning', 'success', 'danger'] as const).map((tone) => (
            <Badge key={tone} appearance="bordered" size={size} tone={tone} icon={Tag}>
              {tone}
            </Badge>
          ))}
          <span className="w-24">
            <Badge appearance="bordered" size={size} tone="neutral" title="A label that is far too long to fit">
              A label that is far too long to fit
            </Badge>
          </span>
        </Row>
      ))}
    </div>
  ),
};

export const NewFilledTones: Story = {
  name: 'filled: neutral / accent / danger + icon',
  render: (args) => (
    <Row>
      {(['neutral', 'accent', 'danger'] as const).map((tone) => (
        <Badge key={tone} {...args} tone={tone} icon={Tag}>
          {tone}
        </Badge>
      ))}
    </Row>
  ),
};
