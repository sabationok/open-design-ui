import { useState, type ReactNode } from 'react';
import { Check, ChevronDown, ChevronRight, Copy, Crosshair } from 'lucide-react';
import { cn } from '../lib/utils';

// ─── Primitive formatting ──────────────────────────────────────────────────────

type PrimitiveType = 'string' | 'number' | 'boolean' | 'null';

const PRIMITIVE_STYLES: Record<PrimitiveType, string> = {
  string: 'text-json-string',
  number: 'text-json-number',
  boolean: 'text-json-boolean',
  null: 'text-muted-foreground',
};

function isExpandable(value: unknown): value is Record<string, unknown> | unknown[] {
  return typeof value === 'object' && value !== null;
}

function formatPrimitive(value: unknown): { type: PrimitiveType; text: string } {
  if (value === null || value === undefined) return { type: 'null', text: 'null' };
  if (typeof value === 'string') return { type: 'string', text: JSON.stringify(value) };
  if (typeof value === 'boolean') return { type: 'boolean', text: String(value) };
  return { type: 'number', text: String(value) };
}

function PrimitiveValue({ value }: { value: unknown }) {
  const { type, text } = formatPrimitive(value);
  return <span className={PRIMITIVE_STYLES[type]}>{text}</span>;
}

// ─── Tree node ──────────────────────────────────────────────────────────────

function Punct({ children }: { children: ReactNode }) {
  return <span className="text-foreground">{children}</span>;
}

function NodeToggle({ open }: { open: boolean }) {
  const Icon = open ? ChevronDown : ChevronRight;
  return <Icon className="size-3.5 shrink-0 text-muted-foreground/70" />;
}

function SelectPathButton({ onClick }: { onClick: (e: React.MouseEvent) => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Use this path"
      className="ml-1 shrink-0 rounded-sm p-0.5 text-muted-foreground/50 opacity-0 hover:text-foreground group-hover:opacity-100"
    >
      <Crosshair className="size-3" />
    </button>
  );
}

interface JsonNodeProps {
  keyLabel?: string;
  value: unknown;
  depth: number;
  isLast: boolean;
  defaultExpandDepth: number;
  path: string;
  selectedPath?: string;
  onSelectPath?: (path: string) => void;
}

function JsonNode({
  keyLabel,
  value,
  depth,
  isLast,
  defaultExpandDepth,
  path,
  selectedPath,
  onSelectPath,
}: JsonNodeProps) {
  const [open, setOpen] = useState(depth < defaultExpandDepth);
  const trailingComma = !isLast && <Punct>,</Punct>;
  const keyPrefix = keyLabel !== undefined && (
    <>
      <span className="text-json-key">{keyLabel}</span>
      <Punct>: </Punct>
    </>
  );
  const isSelected = onSelectPath && path === selectedPath;

  if (!isExpandable(value)) {
    return (
      <div
        className={cn(
          'group flex items-start gap-1 py-px pl-5 font-mono text-[12px] leading-[1.7] whitespace-pre-wrap break-words',
          onSelectPath && 'cursor-pointer hover:bg-muted/30',
          isSelected && 'bg-primary/10',
        )}
        onClick={onSelectPath ? () => onSelectPath(path) : undefined}
      >
        {keyPrefix}
        <PrimitiveValue value={value} />
        {trailingComma}
        {onSelectPath && <SelectPathButton onClick={(e) => { e.stopPropagation(); onSelectPath(path); }} />}
      </div>
    );
  }

  const isArray = Array.isArray(value);
  const entries = isArray
    ? value.map((v, i) => [String(i), v] as const)
    : Object.entries(value);
  const [open_, close] = isArray ? ['[', ']'] : ['{', '}'];

  if (entries.length === 0) {
    return (
      <div
        className={cn(
          'group flex items-start gap-1 py-px pl-5 font-mono text-[12px] leading-[1.7]',
          onSelectPath && 'cursor-pointer hover:bg-muted/30',
          isSelected && 'bg-primary/10',
        )}
        onClick={onSelectPath ? () => onSelectPath(path) : undefined}
      >
        {keyPrefix}
        <Punct>{open_}{close}</Punct>
        {trailingComma}
        {onSelectPath && <SelectPathButton onClick={(e) => { e.stopPropagation(); onSelectPath(path); }} />}
      </div>
    );
  }

  return (
    <div className="font-mono text-[12px] leading-[1.7]">
      <div
        className={cn('group flex w-full items-start gap-1 py-px pl-1', isSelected && 'bg-primary/10')}
      >
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-start gap-1 text-left hover:bg-muted/30"
        >
          <NodeToggle open={open} />
          {keyPrefix}
          <Punct>{open_}</Punct>
          {!open && <span className="text-muted-foreground">…</span>}
          {!open && <Punct>{close}</Punct>}
          {!open && trailingComma}
        </button>
        {onSelectPath && <SelectPathButton onClick={() => onSelectPath(path)} />}
      </div>
      {open && (
        <>
          <div className="pl-4">
            {entries.map(([k, v], i) => (
              <JsonNode
                key={isArray ? i : k}
                keyLabel={isArray ? undefined : k}
                value={v}
                depth={depth + 1}
                isLast={i === entries.length - 1}
                defaultExpandDepth={defaultExpandDepth}
                path={isArray ? `${path}[${k}]` : path ? `${path}.${k}` : k}
                selectedPath={selectedPath}
                onSelectPath={onSelectPath}
              />
            ))}
          </div>
          <div className="pl-5">
            <Punct>{close}</Punct>
            {trailingComma}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Toolbar ────────────────────────────────────────────────────────────────

function ToggleButton({ open, onClick, label }: { open: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground"
      onClick={onClick}
    >
      <ChevronDown
        className={cn('size-3.5 shrink-0 text-muted-foreground/60 transition-transform', !open && '-rotate-90')}
      />
      {label}
    </button>
  );
}

function CopyButton({ copied, onClick }: { copied: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1 rounded-sm border border-border bg-background px-2 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted"
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface JSONViewerProps {
  label?: string;
  value: unknown;
  defaultOpen?: boolean;
  /** Tree expansion depth on mount — 0 collapses everything, 1 opens the first level. */
  defaultExpandDepth?: number;
  /** Max height of the scrollable content area (px or CSS string). Omit for no limit. */
  maxHeight?: number | string;
  className?: string;
  /** Currently selected path (lodash `get`-compatible, e.g. "data.items[0].email"), for highlighting. */
  selectedPath?: string;
  /** When set, every node becomes clickable and reports its path on click — enables using the tree as a path picker. */
  onSelectPath?: (path: string) => void;
}

export function JSONViewer({
  label,
  value,
  defaultOpen = true,
  defaultExpandDepth = 1,
  maxHeight,
  className,
  selectedPath,
  onSelectPath,
}: JSONViewerProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(JSON.stringify(value, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const maxH = maxHeight != null
    ? (typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight)
    : undefined;

  return (
    <div className={cn('overflow-hidden rounded-md border border-border', className)}>
      {label && (
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <ToggleButton open={open} onClick={() => setOpen((o) => !o)} label={label} />
          <CopyButton copied={copied} onClick={handleCopy} />
        </div>
      )}
      {open && (
        <div className="overflow-auto" style={maxH ? { maxHeight: maxH } : undefined}>
          <div className="px-2 py-1.5">
            <JsonNode
              value={value}
              depth={0}
              isLast
              defaultExpandDepth={defaultExpandDepth}
              path=""
              selectedPath={selectedPath}
              onSelectPath={onSelectPath}
            />
          </div>
        </div>
      )}
    </div>
  );
}
