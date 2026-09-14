import { Dot } from './Dot';

export function DotIndicator({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Dot color={ok ? 'bg-wy-delivered' : 'bg-wy-failed'} size="sm" />
      <span className="text-[12px] text-zinc-700">{label}</span>
    </div>
  );
}
