'use client';

import type { HotspotStatus as Status } from '@/domain/types';
import { HOTSPOTS } from '@/domain/seed/home';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';

export const STATUS_META: Record<Status, { label: string; symbol: string; chip: string; dot: string }> = {
  ok: { label: 'OK', symbol: '🟢', chip: 'bg-nicolas-soft text-nicolas-strong', dot: 'bg-nicolas' },
  atencao: { label: 'Atenção', symbol: '🟠', chip: 'bg-sol-soft text-sol', dot: 'bg-sol' },
  acumulado: { label: 'Acumulado', symbol: '🔴', chip: 'bg-ana-soft text-ana-strong', dot: 'bg-ana' },
};

const ORDER: Status[] = ['ok', 'atencao', 'acumulado'];

export function HotspotStatusList({ compact = false }: { compact?: boolean }) {
  const { hotspotsById, setHotspot } = useApp();

  return (
    <ul className="space-y-2">
      {HOTSPOTS.map((hotspot) => {
        const status = hotspotsById.get(hotspot.id)?.status ?? 'ok';
        return (
          <li key={hotspot.id} className="rounded-2xl border border-linha bg-white p-3">
            <div className="flex items-center gap-2">
              <span aria-hidden="true">{hotspot.icon}</span>
              <span className="flex-1 text-[15px] font-medium">{hotspot.name}</span>
              {compact ? (
                <span className={cn('pill', STATUS_META[status].chip)}>{STATUS_META[status].label}</span>
              ) : null}
            </div>
            {compact ? null : (
              <div
                role="radiogroup"
                aria-label={`Estado de ${hotspot.name}`}
                className="mt-2 grid grid-cols-3 gap-2"
              >
                {ORDER.map((option) => {
                  const active = status === option;
                  const meta = STATUS_META[option];
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setHotspot(hotspot.id, option)}
                      className={cn(
                        'tap flex items-center justify-center gap-1.5 rounded-pill border px-2 py-2 text-xs font-semibold transition-colors',
                        active
                          ? cn(meta.chip, 'border-transparent')
                          : 'border-linha bg-white text-navy-500 hover:bg-navy-50',
                      )}
                    >
                      <span aria-hidden="true">{meta.symbol}</span>
                      {meta.label}
                    </button>
                  );
                })}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function hotspotSummary(statuses: Status[]): { label: string; tone: 'ok' | 'warn' | 'alert' } {
  if (statuses.some((s) => s === 'acumulado')) return { label: 'Há um ponto acumulado', tone: 'alert' };
  if (statuses.some((s) => s === 'atencao')) return { label: 'Um ponto a precisar de atenção', tone: 'warn' };
  return { label: 'Tudo em ordem', tone: 'ok' };
}
