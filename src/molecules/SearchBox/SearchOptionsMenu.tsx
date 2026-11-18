import { SlidersHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { type ComponentSize, CONTROL_SQUARE } from '../../lib/componentSize';
import { Button } from '../../components/ui/button';
import { DropdownMenu } from '../Menu';
import { groupedListItems } from './groupedListItems';
import { useGroupedList } from './useGroupedList';
import { useSearchBox, type SearchBoxLabels } from './SearchBoxContext';
import type { SearchMode } from './searchPath';

const MODE_LABEL: Record<SearchMode, keyof SearchBoxLabels> = { ilike: 'contains', like: 'exact' };
const BUTTON_SIZE: Record<ComponentSize, string> = { xs: '[&_svg]:size-3.5', sm: '', md: '' };

/** The options menu beside the input: «Search in ›» (the grouped fields), «Match ›», the caller's extras. */
export function SearchOptionsMenu() {
  const { fields, groups, display, size, labels, extraItems, target, select } = useSearchBox();
  const { sections, labelOf, fullLabelOf, groupLabelOf } = useGroupedList({ items: fields, groups, display });
  const fieldLabel = labelOf(target.field) ?? target.field;
  const fieldFull = fullLabelOf(target.field) ?? target.field;
  const modeLabel = labels[MODE_LABEL[target.mode]];
  return (
    <DropdownMenu
      nested="drill"
      labels={{ trigger: labels.options }}
      trigger={
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            'shrink-0 text-muted-foreground hover:text-foreground data-[state=open]:bg-ds-gray-alpha-100 data-[state=open]:text-foreground',
            CONTROL_SQUARE[size],
            BUTTON_SIZE[size],
          )}
          aria-label={`${labels.options}: ${fieldFull} · ${modeLabel}`}
          title={`${fieldFull} · ${modeLabel}`}
        >
          <SlidersHorizontal />
        </Button>
      }
      items={[
        {
          kind: 'sub',
          label: `${labels.searchIn}: ${fieldLabel}`,
          // Under a header the same label can sit in two groups: say which one beside it.
          meta: display === 'grouped' ? groupLabelOf(target.field) : undefined,
          items: groupedListItems(sections, target.field, (field) => select({ field })),
        },
        {
          kind: 'sub',
          label: `${labels.match}: ${modeLabel}`,
          items: [
            {
              kind: 'radio',
              value: target.mode,
              options: (['ilike', 'like'] as const).map((m) => ({ value: m, label: labels[MODE_LABEL[m]] })),
              onChange: (mode) => select({ mode: mode as SearchMode }),
            },
          ],
        },
        ...(extraItems?.length ? [{ kind: 'separator' as const }, ...extraItems] : []),
      ]}
    />
  );
}
