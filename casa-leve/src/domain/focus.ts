import type { ResolvedTask, TaskType } from '@/domain/types';

export type Phase = 'manha' | 'dia' | 'noite';

export const PHASE_LABEL: Record<Phase, string> = {
  manha: 'Agora de manhã',
  dia: 'Durante o dia',
  noite: 'Esta noite',
};

/** A casa tem tres momentos; o telemovel deve mostrar so o momento certo. */
export function phaseForHour(hour: number): Phase {
  if (hour < 11) return 'manha';
  if (hour < 17) return 'dia';
  return 'noite';
}

const TYPE_PHASE: Record<TaskType, Phase> = {
  morning: 'manha',
  micro: 'dia',
  evening: 'noite',
  kitchen: 'noite',
  zone: 'noite',
  blessing: 'noite',
  reset: 'noite',
  laundry: 'dia',
  planning: 'noite',
};

export function taskPhase(type: TaskType): Phase {
  return TYPE_PHASE[type];
}

const ORDER: Phase[] = ['manha', 'dia', 'noite'];

/**
 * O que interessa primeiro: a fase atual, depois o que ainda esta para vir.
 * O que ja passou desce, as opcionais ficam sempre no fim.
 */
export function sortByRelevance(tasks: ResolvedTask[], phase: Phase): ResolvedTask[] {
  const now = ORDER.indexOf(phase);
  const score = (task: ResolvedTask) => {
    const position = ORDER.indexOf(taskPhase(task.type));
    let value = 0;
    if (position > now) value += 10;
    if (position < now) value += 20;
    if (task.priority === 'optional') value += 40;
    if (task.isEssential) value -= 5;
    return value;
  };
  return [...tasks].sort((a, b) => score(a) - score(b));
}

export interface FocusList {
  /** Por fazer, ja limitadas, seguidas das ultimas feitas. */
  visible: ResolvedTask[];
  hidden: number;
}

/**
 * Mostra poucas tarefas de cada vez; o resto vive no ecra Tarefas.
 * Algumas ja feitas ficam visiveis para a marcacao ter resposta.
 */
export function focusList(tasks: ResolvedTask[], phase: Phase, limit = 4, doneLimit = 2): FocusList {
  const counted = tasks.filter((t) => t.priority !== 'optional');
  const pending = sortByRelevance(
    counted.filter((t) => !t.completed),
    phase,
  );
  const done = counted
    .filter((t) => t.completed)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''))
    .slice(0, doneLimit);

  return {
    visible: [...pending.slice(0, limit), ...done],
    hidden: Math.max(0, pending.length - limit),
  };
}
