'use client';

import Link from 'next/link';
import type { ResolvedTask } from '@/domain/types';
import { HOTSPOTS, LAUNDRY_LABELS, LAUNDRY_LOADS } from '@/domain/seed/home';
import { getLaundryEntry } from '@/domain/laundry';
import { hotspotSummary } from '@/components/HotspotStatus';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';

type Tone = 'ok' | 'warn' | 'alert' | 'idle';

const TONES: Record<Tone, string> = {
  ok: 'bg-nicolas',
  warn: 'bg-sol',
  alert: 'bg-ana',
  idle: 'bg-navy-200',
};

interface Indicator {
  id: string;
  label: string;
  value: string;
  tone: Tone;
  href?: string;
}

function statusOf(tasks: ResolvedTask[], ids: string[]): { done: boolean; total: number } {
  const relevant = tasks.filter((t) => ids.includes(t.id));
  return { done: relevant.length > 0 && relevant.every((t) => t.completed), total: relevant.length };
}

/** §15 "CASA AGORA" — indicadores simples, sem metricas complicadas. */
export function HouseNow({ tasks, weekKey }: { tasks: ResolvedTask[]; weekKey: string }) {
  const { hotspotsById, laundryById } = useApp();

  const kitchen = statusOf(tasks, ['k-louca', 'k-bancada', 'k-alimentos']);
  const living = statusOf(tasks, ['r-w-sala', 'r-w-corredor']);
  const rooms = statusOf(tasks, ['r-n-quarto', 'r-n-brinquedos']);

  const laundry = LAUNDRY_LOADS.map((load) => getLaundryEntry(laundryById, weekKey, load.id));
  const laundryPending = laundry.filter((entry) => entry.status !== 'guardada' && entry.status !== 'por-preparar');
  const laundryValue = laundryPending.length
    ? LAUNDRY_LABELS[laundryPending[0].status]
    : laundry.every((entry) => entry.status === 'guardada')
      ? 'Tudo guardado'
      : 'Sem carga a andar';

  const hotspots = hotspotSummary(HOTSPOTS.map((h) => hotspotsById.get(h.id)?.status ?? 'ok'));

  const indicators: Indicator[] = [
    {
      id: 'cozinha',
      label: 'Cozinha',
      value: kitchen.total === 0 ? 'Sem tarefas' : kitchen.done ? 'Fechada' : 'Por fechar',
      tone: kitchen.total === 0 ? 'idle' : kitchen.done ? 'ok' : 'warn',
    },
    {
      id: 'sala',
      label: 'Sala',
      value: living.total === 0 ? 'Sem tarefas' : living.done ? 'Desimpedida' : 'Por arrumar',
      tone: living.total === 0 ? 'idle' : living.done ? 'ok' : 'warn',
    },
    {
      id: 'quartos',
      label: 'Quartos',
      value: rooms.total === 0 ? 'Sem tarefas' : rooms.done ? 'Arrumados' : 'Por arrumar',
      tone: rooms.total === 0 ? 'idle' : rooms.done ? 'ok' : 'warn',
    },
    {
      id: 'roupa',
      label: 'Roupa',
      value: laundryValue,
      tone: laundryPending.length ? 'warn' : 'ok',
      href: '/roupa',
    },
    {
      id: 'hotspots',
      label: 'Hotspots',
      value: hotspots.label,
      tone: hotspots.tone,
      href: '/hotspots',
    },
  ];

  return (
    <ul className="grid grid-cols-2 gap-2">
      {indicators.map((indicator) => {
        const content = (
          <>
            <span className="flex items-center gap-2">
              <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', TONES[indicator.tone])} />
              <span className="text-xs font-semibold uppercase tracking-wide text-navy-500">
                {indicator.label}
              </span>
            </span>
            <span className="mt-1 block text-sm font-medium text-navy-900">{indicator.value}</span>
          </>
        );

        return (
          <li key={indicator.id} className={indicator.id === 'hotspots' ? 'col-span-2' : undefined}>
            {indicator.href ? (
              <Link
                href={indicator.href}
                className="block h-full rounded-2xl border border-linha bg-white p-3 transition-colors hover:bg-navy-50/50"
              >
                {content}
              </Link>
            ) : (
              <div className="h-full rounded-2xl border border-linha bg-white p-3">{content}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
