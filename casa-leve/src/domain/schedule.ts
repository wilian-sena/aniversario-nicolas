import type {
  Activity,
  Completion,
  DayOfWeek,
  IsoDate,
  MemberId,
  ResolvedTask,
  Settings,
  TaskTemplate,
  Zone,
} from '@/domain/types';
import { ACTIVITIES, ANA, SHARED, WILIAN } from '@/domain/seed/family';
import { KITCHEN_DUTY, TASK_TEMPLATES } from '@/domain/seed/tasks';
import { getBlessingTasksForDate } from '@/domain/blessing';
import { externalActivitiesForDay, isMinimalNight } from '@/domain/dayPlan';
import { getZoneForDate } from '@/domain/zones';
import { dayOfWeek } from '@/lib/date';

export function instanceId(templateId: string, date: IsoDate): string {
  return `${templateId}@${date}`;
}

export interface KitchenDuty {
  cookId: MemberId;
  closerId: MemberId;
  reason: string;
}

/**
 * Regra 2 — quem cozinha nao fecha a cozinha.
 * Regra 3 — quem acompanha o Nicolas numa atividade fica dispensado,
 * por isso nessas noites a cozinha fica com quem esta em casa.
 */
export function getKitchenDuty(day: DayOfWeek, activities: Activity[] = ACTIVITIES): KitchenDuty {
  const escorts = externalActivitiesForDay(day, activities)
    .map((a) => a.escortId)
    .filter((id): id is MemberId => Boolean(id));
  const cookId = ANA;
  if (escorts.includes(WILIAN)) {
    return {
      cookId,
      closerId: ANA,
      reason: 'O Wilian está na atividade — a Ana fecha a cozinha.',
    };
  }
  const closerId = escorts.includes(ANA) ? WILIAN : cookId === ANA ? WILIAN : ANA;
  return { cookId, closerId, reason: 'Quem cozinha não fecha a cozinha.' };
}

/** Missoes de zona escolhidas para a semana, ja no formato de tarefa. */
export function zoneMissionTemplates(zone: Zone, missionIds: string[]): TaskTemplate[] {
  return zone.missions
    .filter((m) => missionIds.includes(m.id))
    .map((mission) => ({
      id: `zm-${mission.id}`,
      title: mission.title,
      description: `Zona ${zone.id} — ${zone.shortName}`,
      memberId: SHARED,
      type: 'zone' as const,
      duration: 15,
      recurring: false,
      priority: 'normal' as const,
      zoneId: zone.id,
      isEssential: false,
    }));
}

function blessingTemplates(date: IsoDate, settings: Settings): TaskTemplate[] {
  return getBlessingTasksForDate(date, settings).map((task) => ({
    id: task.id,
    title: task.title,
    memberId: task.memberId,
    type: 'blessing' as const,
    duration: 25,
    recurring: true,
    priority: 'normal' as const,
    isEssential: false,
  }));
}

function matchesDay(template: TaskTemplate, date: IsoDate, day: DayOfWeek): boolean {
  if (template.date) return template.date === date;
  if (!template.days || template.days.length === 0) return true;
  return template.days.includes(day);
}

export interface ScheduleInput {
  date: IsoDate;
  settings: Settings;
  /** Missoes escolhidas para a semana desta data. */
  missionIds: string[];
  templates?: TaskTemplate[];
  activities?: Activity[];
}

/**
 * Constroi os modelos de tarefa aplicaveis a um dia — sem criar copias
 * persistidas. Inclui cozinha (dinamica), missoes de zona e bencao semanal.
 */
export function templatesForDate({
  date,
  settings,
  missionIds,
  templates = TASK_TEMPLATES,
  activities = ACTIVITIES,
}: ScheduleInput): TaskTemplate[] {
  const day = dayOfWeek(date);
  const base = templates.filter((t) => matchesDay(t, date, day));

  const duty = getKitchenDuty(day, activities);
  // A regra da cozinha aparece uma vez por grupo, nao repetida em cada tarefa.
  const kitchen = KITCHEN_DUTY.filter((t) => matchesDay(t, date, day)).map((t) => ({
    ...t,
    memberId: duty.closerId,
  }));

  const heavy: TaskTemplate[] = [];
  const minimal = isMinimalNight(day, activities);
  if (!minimal) {
    const plan = day;
    if (plan === 2) {
      const zone = getZoneForDate(date, settings.zoneAnchor);
      heavy.push(...zoneMissionTemplates(zone, missionIds));
    }
    if (plan === 4) {
      heavy.push(...blessingTemplates(date, settings));
    }
  }

  // Regra 3 — quem acompanha a atividade nao recebe a tarefa pesada da noite.
  const escorts = externalActivitiesForDay(day, activities)
    .map((a) => a.escortId)
    .filter((id): id is MemberId => Boolean(id));
  const filteredHeavy = heavy.filter((t) => !escorts.includes(t.memberId));

  return [...base, ...kitchen, ...filteredHeavy];
}

export function resolveTasks(input: ScheduleInput, completions: Map<string, Completion>): ResolvedTask[] {
  return templatesForDate(input).map((template) => {
    const id = instanceId(template.id, input.date);
    const completion = completions.get(id);
    return {
      ...template,
      instanceId: id,
      date: input.date,
      completed: Boolean(completion),
      completedAt: completion?.completedAt,
    };
  });
}

/** Regra 6 — Modo Essencial mostra apenas o minimo para fechar o dia. */
export function essentialTasks(tasks: ResolvedTask[]): ResolvedTask[] {
  return tasks.filter((t) => t.isEssential);
}

export function visibleTasks(tasks: ResolvedTask[], essentialMode: boolean): ResolvedTask[] {
  return essentialMode ? essentialTasks(tasks) : tasks;
}

export function tasksByMember(tasks: ResolvedTask[], memberId: MemberId): ResolvedTask[] {
  return tasks.filter((t) => t.memberId === memberId);
}

export function groupByMember(tasks: ResolvedTask[]): Map<MemberId, ResolvedTask[]> {
  const map = new Map<MemberId, ResolvedTask[]>();
  for (const task of tasks) {
    const list = map.get(task.memberId) ?? [];
    list.push(task);
    map.set(task.memberId, list);
  }
  return map;
}

export interface DayProgress {
  total: number;
  done: number;
  essentialTotal: number;
  essentialDone: number;
}

/** As opcionais nao entram na conta: sao um extra, nao uma divida. */
export function dayProgress(tasks: ResolvedTask[]): DayProgress {
  const counted = tasks.filter((t) => t.priority !== 'optional');
  const essential = essentialTasks(tasks);
  return {
    total: counted.length,
    done: counted.filter((t) => t.completed).length,
    essentialTotal: essential.length,
    essentialDone: essential.filter((t) => t.completed).length,
  };
}

/** O dia pode ser fechado quando o essencial esta feito. */
export function canCloseDay(tasks: ResolvedTask[]): boolean {
  const essential = essentialTasks(tasks);
  return essential.length > 0 && essential.every((t) => t.completed);
}
