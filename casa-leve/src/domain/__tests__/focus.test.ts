import { describe, expect, it } from 'vitest';
import type { ResolvedTask, TaskType } from '@/domain/types';
import { focusList, phaseForHour, sortByRelevance, taskPhase } from '@/domain/focus';

const task = (id: string, type: TaskType, over: Partial<ResolvedTask> = {}): ResolvedTask => ({
  id,
  instanceId: `${id}@2026-08-14`,
  title: id,
  memberId: 'wilian',
  type,
  recurring: true,
  priority: 'normal',
  isEssential: false,
  date: '2026-08-14',
  completed: false,
  ...over,
});

describe('foco do momento', () => {
  it('divide o dia em três momentos', () => {
    expect(phaseForHour(7)).toBe('manha');
    expect(phaseForHour(13)).toBe('dia');
    expect(phaseForHour(20)).toBe('noite');
  });

  it('sabe a que momento pertence cada tipo de tarefa', () => {
    expect(taskPhase('morning')).toBe('manha');
    expect(taskPhase('micro')).toBe('dia');
    expect(taskPhase('reset')).toBe('noite');
  });

  it('põe primeiro as tarefas do momento atual', () => {
    const sorted = sortByRelevance([task('a', 'morning'), task('b', 'reset')], 'noite');
    expect(sorted[0].id).toBe('b');
  });

  it('faz descer o que já passou e sobe o que ainda vem', () => {
    const sorted = sortByRelevance([task('manha', 'morning'), task('noite', 'reset')], 'dia');
    expect(sorted.map((t) => t.id)).toEqual(['noite', 'manha']);
  });

  it('deixa as opcionais sempre para o fim', () => {
    const sorted = sortByRelevance(
      [task('micro', 'micro', { priority: 'optional' }), task('reset', 'reset')],
      'dia',
    );
    expect(sorted[1].id).toBe('micro');
  });

  it('sabe quando a pessoa acabou o dia', () => {
    const feitas = focusList(
      [task('a', 'reset', { completed: true, completedAt: '2026-08-14T20:00:00.000Z' })],
      'noite',
    );
    expect(feitas.pending).toBe(0);
    expect(feitas.total).toBe(1);

    const semNada = focusList([], 'noite');
    expect(semNada.total).toBe(0);
  });

  it('mostra poucas tarefas e conta as restantes', () => {
    const tasks = Array.from({ length: 9 }, (_, i) => task(`t${i}`, 'reset'));
    const list = focusList(tasks, 'noite', 4);
    expect(list.visible).toHaveLength(4);
    expect(list.hidden).toBe(5);
    expect(list.pending).toBe(9);
  });

  it('nunca mostra opcionais e conta só o que falta', () => {
    const list = focusList(
      [
        task('feita', 'reset', { completed: true, completedAt: '2026-08-14T20:00:00.000Z' }),
        task('opcional', 'micro', { priority: 'optional' }),
        task('por-fazer', 'reset'),
      ],
      'noite',
    );
    expect(list.visible.map((t) => t.id)).toEqual(['por-fazer', 'feita']);
    expect(list.hidden).toBe(0);
  });

  it('mantém as últimas feitas visíveis para dar resposta ao toque', () => {
    const done = Array.from({ length: 5 }, (_, i) =>
      task(`f${i}`, 'reset', { completed: true, completedAt: `2026-08-14T2${i}:00:00.000Z` }),
    );
    const list = focusList([...done, task('falta', 'reset')], 'noite', 4, 2);
    expect(list.visible.filter((t) => t.completed)).toHaveLength(2);
    expect(list.visible[0].id).toBe('falta');
  });
});
