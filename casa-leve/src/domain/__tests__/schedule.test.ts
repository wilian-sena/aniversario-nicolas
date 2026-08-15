import { describe, expect, it } from 'vitest';
import type { Completion } from '@/domain/types';
import {
  canCloseDay,
  dayProgress,
  essentialTasks,
  getKitchenDuty,
  groupByMember,
  instanceId,
  resolveTasks,
  templatesForDate,
  visibleTasks,
} from '@/domain/schedule';
import { getDayPlan, isMinimalNight, nightGoals } from '@/domain/dayPlan';
import { getZoneForDate } from '@/domain/zones';
import { ZONES } from '@/domain/seed/zones';
import { ANA, NICOLAS, SHARED, WILIAN } from '@/domain/seed/family';
import { DEFAULT_SETTINGS } from '@/domain/seed/settings';

const settings = { ...DEFAULT_SETTINGS, zoneAnchor: '2026-01-05' };

// Semana de 10 a 16 de agosto de 2026 (segunda a domingo).
const SEGUNDA = '2026-08-10';
const TERCA = '2026-08-11';
const QUARTA = '2026-08-12';
const QUINTA = '2026-08-13';
const SEXTA = '2026-08-14';
const SABADO = '2026-08-15';
const DOMINGO = '2026-08-16';

const build = (date: string, missionIds: string[] = []) =>
  templatesForDate({ date, settings, missionIds });

describe('tarefas recorrentes', () => {
  it('não cria cópias: cada dia é calculado a partir dos modelos', () => {
    const segunda = build(SEGUNDA).map((t) => t.id);
    const quarta = build(QUARTA).map((t) => t.id);
    expect(segunda).toContain('m-w-escola');
    expect(quarta).toContain('m-w-escola');
  });

  it('não mostra a rotina da escola ao fim de semana', () => {
    const sabado = build(SABADO).map((t) => t.id);
    expect(sabado).not.toContain('m-w-escola');
    expect(sabado).toContain('r-n-brinquedos');
  });

  it('só mostra o planeamento ao domingo', () => {
    expect(build(DOMINGO).map((t) => t.id)).toContain('p-base-segunda');
    expect(build(SEXTA).map((t) => t.id)).not.toContain('p-base-segunda');
  });

  it('dá um id de instância diferente por data', () => {
    expect(instanceId('r-n-brinquedos', TERCA)).not.toBe(instanceId('r-n-brinquedos', QUARTA));
  });

  it('marcar a terça não marca a quarta', () => {
    const completion: Completion = {
      instanceId: instanceId('r-n-brinquedos', TERCA),
      templateId: 'r-n-brinquedos',
      memberId: NICOLAS,
      date: TERCA,
      completedAt: new Date().toISOString(),
      points: 1,
    };
    const map = new Map([[completion.instanceId, completion]]);

    const terca = resolveTasks({ date: TERCA, settings, missionIds: [] }, map);
    const quarta = resolveTasks({ date: QUARTA, settings, missionIds: [] }, map);

    expect(terca.find((t) => t.id === 'r-n-brinquedos')?.completed).toBe(true);
    expect(quarta.find((t) => t.id === 'r-n-brinquedos')?.completed).toBe(false);
  });
});

describe('regras da noite', () => {
  it('trata segunda, quarta e sexta como noites de manutenção mínima', () => {
    expect(isMinimalNight(1)).toBe(true);
    expect(isMinimalNight(3)).toBe(true);
    expect(isMinimalNight(5)).toBe(true);
    expect(isMinimalNight(2)).toBe(false);
    expect(isMinimalNight(4)).toBe(false);
  });

  it('não coloca missões de zona nas noites de atividade', () => {
    const segunda = build(SEGUNDA, ['z1-sapatos']).filter((t) => t.type === 'zone');
    expect(segunda).toHaveLength(0);
  });

  it('coloca as missões escolhidas na terça', () => {
    const zona = getZoneForDate(TERCA, settings.zoneAnchor);
    const escolhidas = zona.missions.slice(0, 2).map((m) => m.id);
    const tarefas = build(TERCA, escolhidas).filter((t) => t.type === 'zone');
    expect(tarefas).toHaveLength(2);
    expect(tarefas[0].memberId).toBe(SHARED);
    expect(tarefas[0].duration).toBe(15);
    expect(tarefas[0].zoneId).toBe(zona.id);
  });

  it('ignora missões que não são da zona da semana', () => {
    const zona = getZoneForDate(TERCA, settings.zoneAnchor);
    const outra = ZONES.find((z) => z.id !== zona.id)!;
    const tarefas = build(TERCA, [outra.missions[0].id]).filter((t) => t.type === 'zone');
    expect(tarefas).toHaveLength(0);
  });

  it('coloca a bênção semanal na quinta', () => {
    const bencao = build(QUINTA).filter((t) => t.type === 'blessing');
    expect(bencao.length).toBeGreaterThan(0);
    expect(bencao.every((t) => t.duration === 25)).toBe(true);
    expect(build(SEXTA).filter((t) => t.type === 'blessing')).toHaveLength(0);
  });
});

describe('atribuição da cozinha', () => {
  it('quem cozinha não fecha a cozinha', () => {
    const terca = getKitchenDuty(2);
    expect(terca.cookId).toBe(ANA);
    expect(terca.closerId).toBe(WILIAN);
  });

  it('nas noites de atividade a cozinha fica com quem está em casa', () => {
    for (const day of [1, 3, 5] as const) {
      expect(getKitchenDuty(day).closerId).toBe(ANA);
    }
  });

  it('fechar a cozinha faz parte do reset, cozinhar não', () => {
    const tarefas = build(TERCA);
    const reset = tarefas.filter((t) => t.type === 'reset').map((t) => t.id);
    expect(reset).toEqual(expect.arrayContaining(['k-louca', 'k-bancada', 'k-alimentos']));
    expect(tarefas.find((t) => t.id === 'e-a-jantar')?.type).toBe('kitchen');
  });

  it('atribui as tarefas da cozinha a quem fecha', () => {
    const terca = build(TERCA).filter((t) => t.id.startsWith('k-'));
    expect(terca).toHaveLength(3);
    expect(terca.every((t) => t.memberId === WILIAN)).toBe(true);

    const quarta = build(QUARTA).filter((t) => t.id.startsWith('k-'));
    expect(quarta.every((t) => t.memberId === ANA)).toBe(true);
  });
});

describe('modo essencial e fecho do dia', () => {
  const tasks = () => resolveTasks({ date: SEXTA, settings, missionIds: [] }, new Map());

  it('mostra apenas o essencial quando está ligado', () => {
    const all = tasks();
    const essencial = visibleTasks(all, true);
    expect(essencial.length).toBeGreaterThan(0);
    expect(essencial.length).toBeLessThan(all.length);
    expect(essencial.every((t) => t.isEssential)).toBe(true);
  });

  it('o essencial cobre louça, bancada, cesto e brinquedos', () => {
    const ids = essentialTasks(tasks()).map((t) => t.id);
    expect(ids).toEqual(
      expect.arrayContaining(['k-louca', 'k-bancada', 'r-n-cesto', 'r-n-brinquedos']),
    );
  });

  it('a mochila só é essencial na véspera de um dia de escola', () => {
    const naVespera = resolveTasks({ date: DOMINGO, settings, missionIds: [] }, new Map());
    expect(naVespera.map((t) => t.id)).toContain('r-w-mochila');

    for (const semEscolaAmanha of [SEXTA, SABADO]) {
      const tarefas = resolveTasks({ date: semEscolaAmanha, settings, missionIds: [] }, new Map());
      expect(tarefas.map((t) => t.id)).not.toContain('r-w-mochila');
    }
  });

  it('mesmo sem mochila o dia continua a poder fechar-se', () => {
    const sexta = resolveTasks({ date: SEXTA, settings, missionIds: [] }, new Map());
    expect(essentialTasks(sexta).length).toBeGreaterThan(0);
  });

  it('só deixa fechar o dia quando o essencial está feito', () => {
    const all = tasks();
    expect(canCloseDay(all)).toBe(false);
    const done = all.map((t) => (t.isEssential ? { ...t, completed: true } : t));
    expect(canCloseDay(done)).toBe(true);
  });

  it('conta o progresso sem percentagens estranhas', () => {
    const all = tasks();
    const contaveis = all.filter((t) => t.priority !== 'optional');
    const progress = dayProgress(all.map((t) => (t.id === 'r-n-cesto' ? { ...t, completed: true } : t)));
    expect(progress.total).toBe(contaveis.length);
    expect(progress.done).toBe(1);
    expect(progress.essentialTotal).toBeGreaterThan(0);
  });

  it('não conta as microações opcionais como dívida do dia', () => {
    const all = tasks();
    expect(all.some((t) => t.priority === 'optional')).toBe(true);
    expect(dayProgress(all).total).toBeLessThan(all.length);
  });
});

describe('quem faz o quê', () => {
  it('distribui tarefas pelos três membros', () => {
    const grouped = groupByMember(resolveTasks({ date: TERCA, settings, missionIds: [] }, new Map()));
    expect((grouped.get(WILIAN) ?? []).length).toBeGreaterThan(0);
    expect((grouped.get(ANA) ?? []).length).toBeGreaterThan(0);
    expect((grouped.get(NICOLAS) ?? []).length).toBeGreaterThan(0);
  });

  it('descreve o tema de cada dia', () => {
    expect(getDayPlan(SEGUNDA, settings).theme).toBe('minimal');
    expect(getDayPlan(TERCA, settings).theme).toBe('zone');
    expect(getDayPlan(QUINTA, settings).theme).toBe('blessing');
    expect(getDayPlan(SEXTA, settings).theme).toBe('light');
    expect(getDayPlan(SABADO, settings).theme).toBe('family');
    expect(getDayPlan(DOMINGO, settings).theme).toBe('planning');
    expect(getDayPlan(QUINTA, settings).focusMinutes).toBe(25);
  });

  it('só promete mochila pronta quando amanhã há escola', () => {
    expect(nightGoals(0)).toContain('Mochila pronta');
    expect(nightGoals(3)).toContain('Mochila pronta');
    expect(nightGoals(5)).not.toContain('Mochila pronta');
    expect(nightGoals(6)).not.toContain('Mochila pronta');
    expect(nightGoals(5)).toEqual(['Pia livre', 'Mesa livre', 'Chão desimpedido']);
  });

  it('não põe tarefas domésticas pesadas na sexta', () => {
    const pesadas = build(SEXTA).filter((t) => t.type === 'zone' || t.type === 'blessing');
    expect(pesadas).toHaveLength(0);
  });
});
