export function IdCell({ id, chars = 14 }: { id: string; chars?: number }) {
  return (
    <span className="font-mono text-[12px]" title={id}>
      {id.slice(0, chars)}
    </span>
  );
}