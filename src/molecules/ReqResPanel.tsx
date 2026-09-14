import { type ReactNode } from 'react';

export interface ReqResPanelProps {
  request?: ReactNode;
  response?: ReactNode;
  emptyMessage: string;
  className?: string;
}

function ReqResLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
      {children}
    </div>
  );
}

export function ReqResPanel({ request, response, emptyMessage, className }: ReqResPanelProps) {
  if (!request && !response) {
    return <p className="py-2 text-[12px] text-zinc-400">{emptyMessage}</p>;
  }
  return (
    <div className={className ?? 'flex flex-col gap-3'}>
      {request && (
        <div>
          <ReqResLabel>Request</ReqResLabel>
          {request}
        </div>
      )}
      {response && (
        <div>
          <ReqResLabel>Response</ReqResLabel>
          {response}
        </div>
      )}
    </div>
  );
}
