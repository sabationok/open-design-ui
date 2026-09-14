export function KeyValueRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-px rounded-[4px] border border-zinc-200 bg-white px-2 py-1.5">
      <span className="w-full truncate font-mono text-[11px] text-zinc-900" title={value}>
        {value}
      </span>
      <span className="font-mono text-[10px] text-zinc-400">{label}</span>
    </div>
  );
}
