import type { Activity, DayOfWeek, DayPlan, DayTheme, IsoDate, Settings } from '@/domain/types';
import { ACTIVITIES } from '@/domain/seed/family';
import { dayOfWeek } from '@/lib/date';

interface ThemeSpec {
  theme: DayTheme;
  label: string;
  note: string;
  focus: string[];
  icon: string;
  minutes?: (s: Settings) => number;
}

const THEMES: Record<DayOfWeek, ThemeSpec> = {
  1: {
    theme: 'minimal',
    label: 'Manutenção mínima',
    note: 'Hoje há natação. A casa fica no essencial.',
    focus: ['Jantar simples', 'Banho', 'Reset de 5 a 10 minutos'],
    icon: '🏊',
  },
  2: {
    theme: 'zone',
    label: 'Zona da semana',
    note: 'Depois do jantar, 15 minutos na zona da semana.',
    focus: ['15 minutos de zona, depois do jantar', 'Reset da noite'],
    icon: '🏠',
    minutes: (s) => s.zoneTimerMinutes,
  },
  3: {
    theme: 'minimal',
    label: 'Manutenção mínima',
    note: 'Hoje há jiu-jitsu. A casa fica no essencial.',
    focus: ['Jantar simples', 'Banho', 'Reset curto'],
    icon: '🥋',
  },
  4: {
    theme: 'blessing',
    label: 'Bênção semanal da casa',
    note: '25 minutos, todos ao mesmo tempo.',
    focus: ['Bênção semanal — 25 minutos', 'Reset da noite'],
    icon: '🧹',
    minutes: (s) => s.blessingTimerMinutes,
  },
  5: {
    theme: 'light',
    label: 'Noite leve',
    note: 'Hoje é dia leve. Apenas reset mínimo.',
    focus: ['Reset mínimo'],
    icon: '🥋',
  },
  6: {
    theme: 'family',
    label: 'Família',
    note: 'Hoje é dia de família. Não há faxinas.',
    focus: ['Reset rápido opcional — 10 minutos'],
    icon: '❤️',
    minutes: (s) => s.quickResetMinutes,
  },
  0: {
    theme: 'planning',
    label: 'Preparação da semana',
    note: '10 minutos a preparar a semana e a casa fica previsível.',
    focus: ['Planeamento — 10 minutos', 'Base da refeição de segunda'],
    icon: '📋',
    minutes: (s) => s.planningMinutes,
  },
};

export function activitiesForDay(day: DayOfWeek, activities: Activity[] = ACTIVITIES): Activity[] {
  return activities.filter((a) => a.day === day);
}

export function externalActivitiesForDay(day: DayOfWeek, activities: Activity[] = ACTIVITIES): Activity[] {
  return activitiesForDay(day, activities).filter((a) => a.external);
}

/** Regra 1 — noites com atividade externa nao recebem tarefas pesadas. */
export function isMinimalNight(day: DayOfWeek, activities: Activity[] = ACTIVITIES): boolean {
  return externalActivitiesForDay(day, activities).length > 0;
}

export function getDayPlan(date: IsoDate, settings: Settings, activities: Activity[] = ACTIVITIES): DayPlan {
  const day = dayOfWeek(date);
  const spec = THEMES[day];
  return {
    date,
    dayOfWeek: day,
    theme: spec.theme,
    themeLabel: spec.label,
    houseNote: spec.note,
    houseFocus: spec.focus,
    activities: activitiesForDay(day, activities),
    focusMinutes: spec.minutes?.(settings),
    icon: spec.icon,
  };
}
