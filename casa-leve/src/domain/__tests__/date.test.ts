import { describe, expect, it } from 'vitest';
import {
  addDays,
  dayOfWeek,
  formatLongDate,
  greetingFor,
  startOfWeek,
  weekDates,
  weekKey,
  weeksBetween,
} from '@/lib/date';

describe('identificação do dia', () => {
  it('lê o dia da semana sem saltar por causa do fuso', () => {
    expect(dayOfWeek('2026-08-14')).toBe(5); // sexta
    expect(dayOfWeek('2026-08-16')).toBe(0); // domingo
    expect(dayOfWeek('2026-01-05')).toBe(1); // segunda
  });

  it('trata a semana como segunda a domingo', () => {
    expect(startOfWeek('2026-08-14')).toBe('2026-08-10');
    expect(startOfWeek('2026-08-16')).toBe('2026-08-10');
    expect(startOfWeek('2026-08-10')).toBe('2026-08-10');
  });

  it('lista os sete dias começando na segunda', () => {
    const dates = weekDates('2026-08-14');
    expect(dates).toHaveLength(7);
    expect(dates[0]).toBe('2026-08-10');
    expect(dates[6]).toBe('2026-08-16');
  });

  it('conta semanas completas entre datas', () => {
    expect(weeksBetween('2026-01-05', '2026-01-05')).toBe(0);
    expect(weeksBetween('2026-01-05', '2026-01-11')).toBe(0);
    expect(weeksBetween('2026-01-05', '2026-01-12')).toBe(1);
    expect(weeksBetween('2026-01-12', '2026-01-05')).toBe(-1);
  });

  it('dá a mesma chave de semana a dias da mesma semana', () => {
    expect(weekKey('2026-08-10')).toBe(weekKey('2026-08-16'));
    expect(weekKey('2026-08-16')).not.toBe(weekKey('2026-08-17'));
  });

  it('atravessa meses e anos', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28');
  });

  it('formata datas e saudações em português', () => {
    expect(formatLongDate('2026-08-14')).toBe('14 agosto');
    expect(greetingFor(8)).toBe('Bom dia');
    expect(greetingFor(15)).toBe('Boa tarde');
    expect(greetingFor(21)).toBe('Boa noite');
  });
});
