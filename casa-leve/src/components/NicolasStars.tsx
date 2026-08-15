'use client';

import { Star } from 'lucide-react';
import { STAR_CATEGORIES, starMessage, summarizeStars } from '@/domain/stars';
import { NICOLAS } from '@/domain/seed/family';
import { weekDates } from '@/lib/date';
import { useApp } from '@/store/AppState';

/** §19 — estrelas leves, sem transformar higiene basica numa transacao. */
export function NicolasStars() {
  const { snapshot, today } = useApp();
  const summary = summarizeStars(
    snapshot.completions,
    weekDates(today),
    snapshot.settings.starTemplateIds,
    NICOLAS,
  );

  return (
    <div className="rounded-card border border-nicolas/25 bg-nicolas-soft p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
          <Star className="h-6 w-6 fill-sol text-sol" aria-hidden="true" />
        </span>
        <div>
          <p className="text-2xl font-semibold leading-none text-nicolas-strong">
            {summary.total} <span className="text-base font-medium">estrelas</span>
          </p>
          <p className="mt-1 text-sm text-navy-600">{starMessage(summary.total)}</p>
        </div>
      </div>

      <ul className="mt-4 grid grid-cols-3 gap-2">
        {STAR_CATEGORIES.map((category) => (
          <li key={category.id} className="rounded-2xl bg-white/80 p-3 text-center">
            <p className="text-lg font-semibold text-navy-900">{summary.byCategory[category.id]}</p>
            <p className="text-xs font-medium text-navy-500">{category.label}</p>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs text-navy-500">
        Esta semana, de segunda a domingo. As estrelas não são um pagamento — são um sinal de que
        estás a cuidar das tuas coisas.
      </p>
    </div>
  );
}
