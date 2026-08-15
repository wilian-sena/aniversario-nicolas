'use client';

import type { IsoDate } from '@/domain/types';
import { MEAL_SUGGESTIONS } from '@/domain/seed/home';
import { getKitchenDuty } from '@/domain/schedule';
import { WEEKDAY_LONG, dayOfWeek, fromIsoDate } from '@/lib/date';
import { memberName } from '@/lib/members';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';

/** §14 — planeamento leve: uma estrategia por dia e um campo livre. */
export function MealPlanner({ dates, today }: { dates: IsoDate[]; today: IsoDate }) {
  const { mealsByDate, setMeal } = useApp();

  return (
    <ul className="space-y-3">
      {dates.map((date) => {
        const day = dayOfWeek(date);
        const suggestion = MEAL_SUGGESTIONS.find((m) => m.day === day);
        const duty = getKitchenDuty(day);
        const isToday = date === today;

        return (
          <li
            key={date}
            className={cn(
              'rounded-card border p-4',
              isToday ? 'border-navy-900/25 bg-white shadow-card' : 'border-linha bg-white/70',
            )}
          >
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-[15px] font-semibold capitalize">
                {WEEKDAY_LONG[day]} <span className="text-navy-400">{fromIsoDate(date).getDate()}</span>
              </h3>
              <span className="text-xs text-navy-500">
                {memberName(duty.cookId)} cozinha · {memberName(duty.closerId)} fecha
              </span>
            </div>

            <p className="mt-1 text-sm text-navy-500">{suggestion?.strategy}</p>

            <label className="mt-2 block">
              <span className="sr-only">Jantar previsto para {WEEKDAY_LONG[day]}</span>
              <input
                type="text"
                value={mealsByDate.get(date) ?? ''}
                onChange={(event) => setMeal(date, event.target.value)}
                placeholder="Jantar previsto"
                className="w-full rounded-2xl border border-linha bg-white px-3 py-2.5 text-[15px] placeholder:text-navy-300"
              />
            </label>
          </li>
        );
      })}
    </ul>
  );
}
