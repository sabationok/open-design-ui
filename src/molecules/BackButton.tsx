export function BackButton({ onClick, children }: { onClick(): void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[13px] text-zinc-500 hover:text-zinc-900 transition-colors"
    >
      {children}
    </button>
  );
}
