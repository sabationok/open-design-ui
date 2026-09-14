import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, type BadgeConfig, type BadgeTone } from './Badge';

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
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'] satisfies BadgeTone[],
    },
    size: { control: 'radio', options: ['sm', 'md'] },
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
