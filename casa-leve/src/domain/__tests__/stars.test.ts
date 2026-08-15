import { describe, expect, it } from 'vitest';
import type { Completion } from '@/domain/types';
import { summarizeStars } from '@/domain/stars';
import { nextLaundryStatus, previousLaundryStatus, laundryProgress } from '@/domain/laundry';
import { DEFAULT_STAR_TEMPLATE_IDS } from '@/domain/seed/tasks';
import { NICOLAS, WILIAN } from '@/domain/seed/family';
import { weekDates } from '@/lib/date';

const dates = weekDates('2026-08-14');

const completion = (over: Partial<Completion>): Completion => ({
  instanceId: 'x',
  templateId: 'r-n-brinquedos',
  memberId: NICOLAS,
  date: '2026-08-14',
  completedAt: '2026-08-14T20:00:00.000Z',
  points: 1,
  starCategory: 'autonomia',
  ...over,
});

describe('estrelas do Nicolas', () => {
  it('conta apenas as tarefas escolhidas pelos pais', () => {
    const list = [
      completion({ instanceId: 'a' }),
      completion({ instanceId: 'b', templateId: 'm-n-dentes', starCategory: 'autonomia' }),
    ];
    const summary = summarizeStars(list, dates, DEFAULT_STAR_TEMPLATE_IDS);
    expect(summary.total).toBe(1);
  });

  it('ignora tarefas dos adultos', () => {
    const list = [completion({ instanceId: 'c', memberId: WILIAN, templateId: 'r-n-brinquedos' })];
    expect(summarizeStars(list, dates, DEFAULT_STAR_TEMPLATE_IDS).total).toBe(0);
  });

  it('ignora dias fora da semana', () => {
    const list = [completion({ instanceId: 'd', date: '2026-07-01' })];
    expect(summarizeStars(list, dates, DEFAULT_STAR_TEMPLATE_IDS).total).toBe(0);
  });

  it('separa por categoria', () => {
    const list = [
      completion({ instanceId: 'e' }),
      completion({ instanceId: 'f', templateId: 'p-mochila', starCategory: 'autonomia' }),
    ];
    const summary = summarizeStars(list, dates, DEFAULT_STAR_TEMPLATE_IDS);
    expect(summary.byCategory.autonomia).toBe(2);
    expect(summary.byCategory.extra).toBe(0);
  });

  it('a higiene básica não dá estrelas por defeito', () => {
    expect(DEFAULT_STAR_TEMPLATE_IDS).not.toContain('m-n-dentes');
    expect(DEFAULT_STAR_TEMPLATE_IDS).toContain('r-n-brinquedos');
  });
});

describe('fluxo da roupa', () => {
  it('avança um estado de cada vez', () => {
    expect(nextLaundryStatus('por-preparar')).toBe('preparada');
    expect(nextLaundryStatus('a-secar')).toBe('seca');
  });

  it('não passa do último estado', () => {
    expect(nextLaundryStatus('guardada')).toBe('guardada');
    expect(previousLaundryStatus('por-preparar')).toBe('por-preparar');
  });

  it('anda para trás quando é preciso corrigir', () => {
    expect(previousLaundryStatus('lavada')).toBe('a-lavar');
  });

  it('descreve o progresso da carga', () => {
    expect(laundryProgress('por-preparar')).toBe(0);
    expect(laundryProgress('guardada')).toBe(1);
  });
});
