import { FilterSelect } from './FilterSelect';

// ─── Types ────────────────────────────────────────────────────────────────────
// Maps to DirectoryType<FilterExtraTypes> from shared, simplified for UI consumption.
// filter.children → dropdown options (DirTypeEnum.FILTER_VALUES items)
// filter.label    → placeholder / group name
// filter.collection.value: "by_path" → values collected via config.collectPath
// TODO move shared/types/filters/option based on DirectoryType
export interface FilterOption {
  id?: string;
  value: string;
  label?: string;
}

export interface LocalDirectoryCollection<
  Config extends Record<string, any> = Record<string, any>,
> {
  id: string;
  label: string | null;
  dirType?: string;
  kind?: string | null;
  subType?: string | null;
  key?: unknown;
  value?: unknown;
  config?: Config | null;
  meta?: Record<string, unknown> | null;
  parent?: LocalDirectoryCollection | null;
  parentId?: string | null;
  children?: LocalDirectoryCollection[] | null;
}

// TODO move shared/types/filters/data based on DirectoryType
export interface FilterConfig {
  /** Unique filter key — used as form state key */
  key: string;
  label: string;
  /** Available dropdown values — DirTypeEnum.FILTER_VALUES items (children in DirectoryType) */
  children?: FilterOption[];
  /**
   * Collection metadata describing how children were auto-populated.
   * Hierarchy: grandparent{type:'by_path'} / parent{key:targetPath} / self{collectPath}
   */
  collection?: LocalDirectoryCollection<{
    collectPath: string;
  }>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface DataTableFiltersProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

/**
 * Renders a FilterSelect per filter config. Designed to sit inside a FilterBar.
 * Options come from filter.children[n].value / filter.children[n].label.
 */
export function DataTableFilters({ filters, values, onChange }: DataTableFiltersProps) {
  return (
    <>
      {filters.map((filter) => {
        const options = filter.children ?? [];
        return (
          <FilterSelect
            key={filter.key}
            value={values[filter.key] ?? ''}
            onChange={(e) => onChange(filter.key, e.target.value)}
          >
            <option value="">{filter.label}: All</option>
            {options.map((opt) => (
              <option key={opt.id ?? opt.value} value={opt.value}>
                {opt.label ?? opt.value}
              </option>
            ))}
          </FilterSelect>
        );
      })}
    </>
  );
}
