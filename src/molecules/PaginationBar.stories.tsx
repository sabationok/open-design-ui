import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { PaginationBar } from './PaginationBar';

const meta = {
  title: 'Molecules/PaginationBar',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [page, setPage] = useState(0);
    const totalPages = 5;
    return (
      <div className="max-w-lg">
        <PaginationBar
          page={page}
          totalPages={totalPages}
          total={93}
          noun="events"
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
        />
      </div>
    );
  },
};
