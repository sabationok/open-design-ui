import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoadMore } from '../../molecules/LoadMore';
import { Frame } from '../../molecules/SectionCard';

const meta = {
  title: 'Molecules/LoadMore',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Fake pager: every 3rd page fails once to show the retry note.
function useFakePager() {
  const [pages, setPages] = useState(1);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  const fetchNextPage = () => {
    setFetching(true);
    setError(false);
    setTimeout(() => {
      setFetching(false);
      if ((pages + 1) % 3 === 0 && !error) return setError(true);
      setPages((p) => p + 1);
    }, 700);
  };
  return { pages, pager: { hasNextPage: pages < 8, isFetchingNextPage: fetching, isFetchNextPageError: error, fetchNextPage } };
}

export const InfiniteList: Story = {
  name: 'LoadMore (scroll the list)',
  render: () => {
    const { pages, pager } = useFakePager();
    return (
      <div className="h-80 w-full max-w-md overflow-auto">
        <Frame>
          {Array.from({ length: pages * 6 }, (_, i) => (
            <div key={i} className="px-4 py-3 text-sm text-foreground">Row {i + 1}</div>
          ))}
        </Frame>
        <LoadMore {...pager} />
      </div>
    );
  },
};

export const States: Story = {
  name: 'LoadMore (static states)',
  render: () => (
    <div className="flex w-full max-w-md flex-col gap-4">
      <LoadMore hasNextPage isFetchingNextPage isFetchNextPageError={false} fetchNextPage={() => {}} enabled />
      <LoadMore hasNextPage isFetchingNextPage={false} isFetchNextPageError fetchNextPage={() => {}} />
    </div>
  ),
};
