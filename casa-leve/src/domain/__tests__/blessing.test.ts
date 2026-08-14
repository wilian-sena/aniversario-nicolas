import { describe, expect, it } from 'vitest';
import { getBlessingTasks, getBlessingWeek } from '@/domain/blessing';
import { BLESSING_A } from '@/domain/seed/home';
import { ANA, NICOLAS, WILIAN } from '@/domain/seed/family';
import { DEFAULT_SETTINGS } from '@/domain/seed/settings';
import { addDays } from '@/lib/date';

const ANCHOR = '2026-01-05';
const settings = { ...DEFAULT_SETTINGS, zoneAnchor: ANCHOR, blessingAnchorWeek: 'A' as const };

describe('bênção semanal A/B', () => {
  it('alterna a cada semana', () => {
    expect(getBlessingWeek(ANCHOR, settings)).toBe('A');
    expect(getBlessingWeek(addDays(ANCHOR, 7), settings)).toBe('B');
    expect(getBlessingWeek(addDays(ANCHOR, 14), settings)).toBe('A');
    expect(getBlessingWeek(addDays(ANCHOR, 21), settings)).toBe('B');
  });

  it('mantém a mesma semana de segunda a domingo', () => {
    expect(getBlessingWeek(addDays(ANCHOR, 7), settings)).toBe(
      getBlessingWeek(addDays(ANCHOR, 13), settings),
    );
  });

  it('respeita a âncora quando começa em B', () => {
    const inverted = { ...settings, blessingAnchorWeek: 'B' as const };
    expect(getBlessingWeek(ANCHOR, inverted)).toBe('B');
    expect(getBlessingWeek(addDays(ANCHOR, 7), inverted)).toBe('A');
  });

  it('troca as tarefas dos adultos na semana B', () => {
    const a = getBlessingTasks('A');
    const b = getBlessingTasks('B');
    const aspirarA = a.find((t) => t.id === 'b-aspirar-sala');
    const aspirarB = b.find((t) => t.id === 'b-aspirar-sala');
    expect(aspirarA?.memberId).toBe(WILIAN);
    expect(aspirarB?.memberId).toBe(ANA);

    const banhoA = a.find((t) => t.id === 'b-casa-banho');
    const banhoB = b.find((t) => t.id === 'b-casa-banho');
    expect(banhoA?.memberId).toBe(ANA);
    expect(banhoB?.memberId).toBe(WILIAN);
  });

  it('não troca as tarefas do Nicolas', () => {
    const nicolasA = BLESSING_A.filter((t) => t.memberId === NICOLAS).map((t) => t.id);
    const nicolasB = getBlessingTasks('B')
      .filter((t) => t.memberId === NICOLAS)
      .map((t) => t.id);
    expect(nicolasB).toEqual(nicolasA);
  });
});
