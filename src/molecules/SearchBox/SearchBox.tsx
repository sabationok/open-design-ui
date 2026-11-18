import { cn } from '../../lib/utils';
import { SearchBoxInput } from './SearchBoxInput';
import { SearchBoxProvider, type SearchBoxConfig } from './SearchBoxContext';
import { SearchOptionsMenu } from './SearchOptionsMenu';

export interface SearchBoxProps extends SearchBoxConfig {
  /** Classes of the row. */
  className?: string;
}

/**
 * SearchBox — a SearchInput with a menu of search options beside it: the field to search in (the caller's fields plus
 * «all fields», grouped under headers by `groups`) and the match mode (`ilike` contains / `like` exact). Controlled:
 * `value` is `{ path: '<mode>:<field | *>', value }`, `onChange(undefined)` on blank text. The chosen field and mode
 * stay while the text is empty. The options are two drill-in `sub` items of DropdownMenu, each a radio list;
 * `extraItems` follow behind a separator. Helpers: `parseSearchPath`, `toSearchParams`, `matchesSearch`.
 */
export function SearchBox({ className, ...config }: SearchBoxProps) {
  return (
    <SearchBoxProvider {...config}>
      <div className={cn('flex min-w-0 flex-1 items-center gap-1', className)}>
        <SearchBoxInput />
        <SearchOptionsMenu />
      </div>
    </SearchBoxProvider>
  );
}
