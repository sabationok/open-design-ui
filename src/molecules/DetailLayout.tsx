export function DetailLayout({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[320px_1fr]">
      {sidebar}
      {children}
    </div>
  );
}
