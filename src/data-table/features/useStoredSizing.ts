import { useEffect, useState } from 'react';
import type { ColumnSizingInfoState, ColumnSizingState } from '@tanstack/react-table';

const sizingKey = (storageKey: string) => `${storageKey}:sizing`;

// localStorage may be missing or throw (private mode, blocked site data): the table then just
// starts from the column defaults.
function read(storageKey: string | undefined): ColumnSizingState {
  if (!storageKey) return {};
  try {
    const raw = localStorage.getItem(sizingKey(storageKey));
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    return parsed && typeof parsed === 'object' ? (parsed as ColumnSizingState) : {};
  } catch {
    return {};
  }
}

function write(storageKey: string, sizing: ColumnSizingState) {
  try {
    if (Object.keys(sizing).length) localStorage.setItem(sizingKey(storageKey), JSON.stringify(sizing));
    else localStorage.removeItem(sizingKey(storageKey));
  } catch {
    // ignore: sizing is a convenience
  }
}

const EMPTY_INFO: ColumnSizingInfoState = {
  startOffset: null,
  startSize: null,
  deltaOffset: null,
  deltaPercentage: null,
  isResizingColumn: false,
  columnSizingStart: [],
};

// Controlled column sizing for useReactTable; with a `storageKey`, remembered in localStorage
// (`<storageKey>:sizing`) and written when a drag ends, not on every pointer move.
export function useStoredSizing(storageKey: string | undefined) {
  const [columnSizing, onColumnSizingChange] = useState<ColumnSizingState>(() => read(storageKey));
  const [columnSizingInfo, onColumnSizingInfoChange] = useState<ColumnSizingInfoState>(EMPTY_INFO);
  const resizing = !!columnSizingInfo.isResizingColumn;
  useEffect(() => {
    if (storageKey && !resizing) write(storageKey, columnSizing);
  }, [storageKey, columnSizing, resizing]);
  return { state: { columnSizing, columnSizingInfo }, onColumnSizingChange, onColumnSizingInfoChange };
}
