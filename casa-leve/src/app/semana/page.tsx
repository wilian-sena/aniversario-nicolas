'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Shirt, UtensilsCrossed } from 'lucide-react';
import { Card, SectionTitle } from '@/components/ui/Card';
import { WeeklyCalendar } from '@/components/WeeklyCalendar';
import { getZoneForDate } from '@/domain/zones';
import { addDays, formatLongDate, weekDates } from '@/lib/date';
import { useApp } from '@/store/AppState';

export default function WeekPage() {
  const { today, snapshot } = useApp();
  const [offset, setOffset] = useState(0);

  const anchor = addDays(today, offset * 7);
  const dates = weekDates(anchor);
  const zone = getZoneForDate(anchor, snapshot.settings.zoneAnchor);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-3">
        <div>
          <p className="section-title">Semana</p>
          <h1 className="mt-2 text-2xl font-semibold leading-tight">
            {formatLongDate(dates[0])} — {formatLongDate(dates[6])}
          </h1>
          <p className="mt-1 text-sm text-navy-500">
            Zona {zone.id} · {zone.shortName}
          </p>
        </div>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => setOffset((value) => value - 1)}
            aria-label="Semana anterior"
            className="tap flex items-center justify-center rounded-full border border-linha bg-white text-navy-600 hover:bg-navy-50"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setOffset((value) => value + 1)}
            aria-label="Semana seguinte"
            className="tap flex items-center justify-center rounded-full border border-linha bg-white text-navy-600 hover:bg-navy-50"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      {offset !== 0 ? (
        <button
          type="button"
          onClick={() => setOffset(0)}
          className="text-sm font-semibold text-navy-700 underline"
        >
          Voltar à semana atual
        </button>
      ) : null}

      <WeeklyCalendar dates={dates} today={today} />

      <section aria-labelledby="atalhos-titulo">
        <SectionTitle>
          <span id="atalhos-titulo">Da semana</span>
        </SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <Card className="p-0">
            <Link
              href="/roupa"
              className="flex h-full flex-col gap-1 rounded-card p-4 transition-colors hover:bg-navy-50/50"
            >
              <Shirt className="h-5 w-5 text-navy-400" aria-hidden="true" />
              <span className="text-[15px] font-semibold">Roupa</span>
              <span className="text-sm text-navy-500">Três cargas por semana</span>
            </Link>
          </Card>
          <Card className="p-0">
            <Link
              href="/refeicoes"
              className="flex h-full flex-col gap-1 rounded-card p-4 transition-colors hover:bg-navy-50/50"
            >
              <UtensilsCrossed className="h-5 w-5 text-navy-400" aria-hidden="true" />
              <span className="text-[15px] font-semibold">Refeições</span>
              <span className="text-sm text-navy-500">Jantar previsto de cada dia</span>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}
