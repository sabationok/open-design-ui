export type DateFormat = 'time' | 'time-s' | 'datetime';

export function DateCell({
  value,
  format = 'time-s',
}: {
  value: string | number | null | undefined;
  format?: DateFormat;
}) {
  if (!value) return <span className="text-[12px] text-zinc-400">—</span>;

  const d = new Date(value);
  let text: string;

  if (format === 'time') {
    text = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (format === 'time-s') {
    text = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } else {
    text = d.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return <span className="font-mono text-[12px] text-zinc-500">{text}</span>;
}