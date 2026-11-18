import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ToggleChip, type ToggleChipTone } from '../../atoms/ToggleChip';

const meta = { title: 'Atoms/ToggleChip' } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

export const Tones: Story = {
  render: () => {
    const [on, setOn] = useState<Record<ToggleChipTone, boolean>>({ accent: true, warning: false, danger: true });
    return (
      <div className="flex flex-col gap-3 p-4">
        {(['md', 'sm'] as const).map((size) => (
          <div key={size} className="flex flex-wrap items-center gap-1.5">
            {(Object.keys(on) as ToggleChipTone[]).map((tone) => (
              <ToggleChip
                key={tone}
                tone={tone}
                size={size}
                pressed={on[tone]}
                onClick={() => setOn((s) => ({ ...s, [tone]: !s[tone] }))}
              >
                {tone}
              </ToggleChip>
            ))}
            <ToggleChip size={size} pressed={false} disabled onClick={() => {}}>
              disabled
            </ToggleChip>
          </div>
        ))}
      </div>
    );
  },
};
