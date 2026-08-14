'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LAUNDRY_FLOW, LAUNDRY_LABELS, LAUNDRY_LOADS } from '@/domain/seed/home';
import { getLaundryEntry, nextLaundryStatus, previousLaundryStatus } from '@/domain/laundry';
import { WEEKDAY_LONG } from '@/lib/date';
import { memberName } from '@/lib/members';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';

/** §13 — cada carga anda um passo de cada vez, sem formularios. */
export function LaundryTracker({ weekKey }: { weekKey: string }) {
  const { laundryById, setLaundryStatus } = useApp();

  return (
    <ul className="space-y-3">
      {LAUNDRY_LOADS.map((load) => {
        const entry = getLaundryEntry(laundryById, weekKey, load.id);
        const index = LAUNDRY_FLOW.indexOf(entry.status);
        const done = entry.status === 'guardada';

        return (
          <li key={load.id} className={cn('rounded-card border p-4', done ? 'border-nicolas/30 bg-nicolas-soft/50' : 'border-linha bg-white')}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-[15px] font-semibold leading-snug">{load.title}</h3>
                <p className="text-sm text-navy-500">
                  {WEEKDAY_LONG[load.day]} · {load.description}
                </p>
              </div>
              <span className="pill bg-navy-50 text-navy-700">{LAUNDRY_LABELS[entry.status]}</span>
            </div>

            <ol className="mt-3 flex gap-1" aria-hidden="true">
              {LAUNDRY_FLOW.map((status, position) => (
                <li
                  key={status}
                  className={cn(
                    'h-1.5 flex-1 rounded-pill',
                    position <= index ? 'bg-navy-700' : 'bg-navy-100',
                  )}
                />
              ))}
            </ol>

            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLaundryStatus(weekKey, load.id, previousLaundryStatus(entry.status))}
                disabled={index === 0}
                aria-label={`Recuar ${load.title}`}
                className="tap flex items-center justify-center rounded-full border border-linha bg-white text-navy-600 disabled:opacity-40"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setLaundryStatus(weekKey, load.id, nextLaundryStatus(entry.status))}
                disabled={done}
                className="tap flex flex-1 items-center justify-center gap-2 rounded-pill bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-40"
              >
                {done ? 'Guardada ✓' : `Passar a ${LAUNDRY_LABELS[nextLaundryStatus(entry.status)].toLowerCase()}`}
                {done ? null : <ChevronRight className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>

            {load.ownerId ? (
              <p className="mt-2 text-xs text-navy-500">
                {memberName(load.ownerId)} guarda a roupa dele sempre que possível.
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
