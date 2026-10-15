export function SectionCard({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <span className="text-[14px] font-semibold text-foreground">{title}</span>
        {action}
      </div>
      {children}
    </div>
  );
}
