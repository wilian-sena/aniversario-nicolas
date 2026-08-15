'use client';

import { LifeBuoy } from 'lucide-react';
import type { IsoDate } from '@/domain/types';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';

/** Regra 6 — o dia correu mal: fica so o essencial, sem dívidas para amanhã. */
export function EssentialMode({ date, enabled }: { date: IsoDate; enabled: boolean }) {
  const { setEssentialMode } = useApp();

  return (
    <div
      className={cn(
        'rounded-card border p-4 transition-colors',
        enabled ? 'border-sol/40 bg-sol-soft' : 'border-linha bg-white',
      )}
    >
      <div className="flex items-start gap-3">
        <LifeBuoy className={cn('mt-0.5 h-5 w-5 shrink-0', enabled ? 'text-sol' : 'text-navy-400')} aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <h3 className="text-[15px] font-semibold">Modo Essencial</h3>
          <p className="mt-0.5 text-sm text-navy-600">
            {enabled
              ? 'Só o essencial. Amanhã retomamos normalmente.'
              : 'Dia difícil? Fica só com o mínimo para fechar o dia.'}
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Modo Essencial"
          onClick={() => setEssentialMode(date, !enabled)}
          className={cn(
            'relative h-7 w-12 shrink-0 rounded-pill transition-colors',
            enabled ? 'bg-sol' : 'bg-navy-200',
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
              enabled ? 'translate-x-5' : 'translate-x-0',
            )}
          />
        </button>
      </div>
    </div>
  );
}
