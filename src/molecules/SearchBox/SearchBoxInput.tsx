import { cn } from '../../lib/utils';
import { type ComponentSize, CONTROL_HEIGHT } from '../../lib/componentSize';
import { SearchInput } from '../SearchInput';
import { useSearchBox } from './SearchBoxContext';

const INPUT_SIZE: Record<ComponentSize, string> = {
  xs: 'px-1.5 text-xs',
  sm: 'text-[13px]',
  md: 'text-sm',
};

/** The text input of SearchBox; reads the box's context. */
export function SearchBoxInput() {
  const { size, placeholder, text, setText } = useSearchBox();
  return (
    <div className="flex min-w-0 flex-1">
      <SearchInput
        type="search"
        placeholder={placeholder}
        aria-label={placeholder}
        className={cn('min-w-0 py-0', CONTROL_HEIGHT[size], INPUT_SIZE[size])}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
