export function KeyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-px rounded-[4px] border border-border bg-background px-2 py-1.5">
      <span className="w-full truncate font-mono text-[11px] text-foreground" title={value}>
        {value}
      </span>
      <span className="font-mono text-[10px] text-ds-gray-700">{label}</span>
    </div>
  );
}
