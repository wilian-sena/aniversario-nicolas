'use client';

import Link from 'next/link';
import type { IsoDate } from '@/domain/types';
import { getDayPlan } from '@/domain/dayPlan';
import { getKitchenDuty } from '@/domain/schedule';
import { LAUNDRY_LABELS, MEAL_SUGGESTIONS } from '@/domain/seed/home';
import { getLaundryEntry, loadsForDay } from '@/domain/laundry';
import { WEEKDAY_SHORT, dayOfWeek, fromIsoDate, weekKey } from '@/lib/date';
import { memberName } from '@/lib/members';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';

const THEME_TONE: Record<string, string> = {
  minimal: 'bg-navy-50 text-navy-700',
  zone: 'bg-lavanda-soft text-lavanda',
  blessing: 'bg-nicolas-soft text-nicolas-strong',
  light: 'bg-navy-50 text-navy-700',
  family: 'bg-ana-soft text-ana-strong',
  planning: 'bg-sol-soft text-sol',
};

/** §17 — a semana inteira num relance: atividade, casa, refeicao e roupa. */
export function WeeklyCalendar({ dates, today }: { dates: IsoDate[]; today: IsoDate }) {
  const { snapshot, mealsByDate, laundryById } = useApp();
  const week = weekKey(dates[0] ?? today);

  return (
    <ul className="space-y-3">
      {dates.map((date) => {
        const plan = getDayPlan(date, snapshot.settings);
        const day = dayOfWeek(date);
        const isToday = date === today;
        const meal = mealsByDate.get(date);
        const suggestion = MEAL_SUGGESTIONS.find((m) => m.day === day);
        const duty = getKitchenDuty(day);
        const loads = loadsForDay(day);

        return (
          <li
            key={date}
            className={cn(
              'rounded-card border p-4',
              isToday ? 'border-navy-900/25 bg-white shadow-card' : 'border-linha bg-white/70',
            )}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 shrink-0 text-center">
                <p className="text-xs font-bold tracking-wide text-navy-400">{WEEKDAY_SHORT[day]}</p>
                <p className="text-xl font-semibold leading-tight">{fromIsoDate(date).getDate()}</p>
              </div>

              <div className="min-w-0 flex-1">
                <span className={cn('pill', THEME_TONE[plan.theme])}>
                  <span aria-hidden="true">{plan.icon}</span>
                  {plan.themeLabel}
                </span>

                <ul className="mt-2 space-y-1 text-sm text-navy-600">
                  {plan.activities
                    .filter((a) => a.external)
                    .map((activity) => (
                      <li key={activity.id}>
                        <span aria-hidden="true">{activity.icon}</span> {activity.title}{' '}
                        {activity.start}–{activity.end}
                      </li>
                    ))}
                  <li>
                    <span aria-hidden="true">🏠</span> Casa:{' '}
                    {plan.houseFocus[0]?.toLowerCase() ?? 'nada marcado'}
                  </li>
                  <li>
                    <span aria-hidden="true">🍽️</span> {meal || suggestion?.strategy}
                    <span className="text-navy-400"> · fecha: {memberName(duty.closerId)}</span>
                  </li>
                  {loads.map((load) => {
                    const entry = getLaundryEntry(laundryById, week, load.id);
                    return (
                      <li key={load.id}>
                        <span aria-hidden="true">👕</span> {load.title} ·{' '}
                        {LAUNDRY_LABELS[entry.status].toLowerCase()}
                      </li>
                    );
                  })}
                </ul>

                {isToday ? (
                  <Link
                    href="/"
                    className="mt-2 inline-block text-sm font-semibold text-navy-800 underline"
                  >
                    Ver o dia de hoje
                  </Link>
                ) : null}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
