'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Settings } from 'lucide-react';
import type { IsoDate } from '@/domain/types';
import { formatLongDate, formatWeekdayLong, greetingFor } from '@/lib/date';

export function TodayHeader({ date }: { date: IsoDate }) {
  // A saudacao depende da hora, por isso so e calculada no cliente.
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setGreeting(greetingFor(new Date().getHours()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <header className="mb-6 flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-navy-500">{greeting ?? ' '}</p>
        <h1 className="mt-1 text-3xl font-semibold uppercase leading-none tracking-tight">
          {formatWeekdayLong(date)}
        </h1>
        <p className="mt-1 text-lg font-medium uppercase tracking-wide text-navy-400">
          {formatLongDate(date)}
        </p>
      </div>
      <Link
        href="/configuracoes"
        aria-label="Configurações"
        className="tap flex items-center justify-center rounded-full text-navy-400 hover:bg-navy-50 hover:text-navy-700"
      >
        <Settings className="h-5 w-5" aria-hidden="true" />
      </Link>
    </header>
  );
}
