export function BackButton({ onClick, children }: { onClick(): void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
    >
      {children}
    </button>
  );
}
