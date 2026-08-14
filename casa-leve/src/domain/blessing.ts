import type { BlessingTask, BlessingWeek, IsoDate, Settings } from '@/domain/types';
import { BLESSING_A } from '@/domain/seed/home';
import { ANA, WILIAN } from '@/domain/seed/family';
import { weeksBetween } from '@/lib/date';

/** Alternancia automatica A/B, ancorada na mesma semana das zonas. */
export function getBlessingWeek(date: IsoDate, settings: Settings): BlessingWeek {
  const weeks = weeksBetween(settings.zoneAnchor, date);
  const even = ((weeks % 2) + 2) % 2 === 0;
  const anchorIsA = settings.blessingAnchorWeek === 'A';
  const isA = even ? anchorIsA : !anchorIsA;
  return isA ? 'A' : 'B';
}

/** Na semana B os adultos trocam entre si; o Nicolas mantem as tarefas dele. */
export function getBlessingTasks(week: BlessingWeek, base: BlessingTask[] = BLESSING_A): BlessingTask[] {
  if (week === 'A') return base;
  return base.map((task) => {
    if (task.memberId === WILIAN) return { ...task, memberId: ANA };
    if (task.memberId === ANA) return { ...task, memberId: WILIAN };
    return task;
  });
}

export function getBlessingTasksForDate(date: IsoDate, settings: Settings): BlessingTask[] {
  return getBlessingTasks(getBlessingWeek(date, settings));
}

/** Instancia estavel por data — marcar numa semana nao marca noutra. */
export function blessingInstanceId(taskId: string, date: IsoDate): string {
  return `${taskId}@${date}`;
}
