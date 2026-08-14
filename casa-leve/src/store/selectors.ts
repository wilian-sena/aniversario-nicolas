'use client';

import { useMemo } from 'react';
import type { DayFlags, IsoDate, ResolvedTask, Zone } from '@/domain/types';
import { completedMissionsInWeek, getZoneForDate } from '@/domain/zones';
import { canCloseDay, dayProgress, resolveTasks, type DayProgress } from '@/domain/schedule';
import { getDayPlan } from '@/domain/dayPlan';
import { useApp } from '@/store/AppState';
import { weekDates, weekKey as toWeekKey } from '@/lib/date';

export interface DayView {
  date: IsoDate;
  weekKey: string;
  plan: ReturnType<typeof getDayPlan>;
  zone: Zone;
  missionIds: string[];
  /** Missoes ja concluidas nesta semana (a zona nao e um compromisso diario). */
  missionsDone: string[];
  tasks: ResolvedTask[];
  visible: ResolvedTask[];
  progress: DayProgress;
  flags: DayFlags;
  canClose: boolean;
}

export function useDay(date: IsoDate): DayView {
  const { snapshot, completionsById, flagsByDate } = useApp();
  const { settings, zonePicks } = snapshot;

  return useMemo(() => {
    const key = toWeekKey(date);
    const missionIds = zonePicks.find((p) => p.weekKey === key)?.missionIds ?? [];
    const plan = getDayPlan(date, settings);
    const zone = getZoneForDate(date, settings.zoneAnchor);
    const tasks = resolveTasks({ date, settings, missionIds }, completionsById);
    const missionsDone = completedMissionsInWeek(missionIds, weekDates(date), completionsById);
    const flags = flagsByDate.get(date) ?? { date, essentialMode: false, dayClosed: false };
    const visible = flags.essentialMode ? tasks.filter((t) => t.isEssential) : tasks;

    return {
      date,
      weekKey: key,
      plan,
      zone,
      missionIds,
      missionsDone,
      tasks,
      visible,
      progress: dayProgress(tasks),
      flags,
      canClose: canCloseDay(tasks),
    };
  }, [date, settings, zonePicks, completionsById, flagsByDate]);
}

export function useToday(): DayView {
  const { today } = useApp();
  return useDay(today);
}
