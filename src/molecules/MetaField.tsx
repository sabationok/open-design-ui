import { MetaLabel } from '../atoms';

export function MetaField({
  label,
  children,
  className = 'mt-4',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <MetaLabel>{label}</MetaLabel>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}
