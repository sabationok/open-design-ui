import { BreadcrumbSep, MonoId } from '../atoms';
import { BackLink } from './BackLink';

interface BreadcrumbNavProps {
  backLabel: string;
  onBack(): void;
  id: string;
  actions?: React.ReactNode;
}

export function BreadcrumbNav({ backLabel, onBack, id, actions }: BreadcrumbNavProps) {
  return (
    <>
      <BackLink onClick={onBack}>← {backLabel}</BackLink>
      <BreadcrumbSep />
      <MonoId>{id}</MonoId>
      {actions != null && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </>
  );
}
