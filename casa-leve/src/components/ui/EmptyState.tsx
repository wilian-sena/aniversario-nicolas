import type { ReactNode } from 'react';

/** §31 — nunca mostrar caixas vazias, apenas uma frase humana. */
export function EmptyState({ message, hint }: { message: string; hint?: ReactNode }) {
  return (
    <div className="rounded-card bg-white/70 px-4 py-6 text-center">
      <p className="text-[15px] font-medium text-navy-700">{message}</p>
      {hint ? <p className="mt-1 text-sm text-navy-500">{hint}</p> : null}
    </div>
  );
}
