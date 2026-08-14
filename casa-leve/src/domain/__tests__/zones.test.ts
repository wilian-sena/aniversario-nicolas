import { describe, expect, it } from 'vitest';
import { ZONES } from '@/domain/seed/zones';
import type { Completion } from '@/domain/types';
import {
  MAX_WEEKLY_MISSIONS,
  completedMissionsInWeek,
  getNextZone,
  getZoneForDate,
  toggleMissionPick,
  zoneProgressLabel,
} from '@/domain/zones';
import { addDays, weekDates } from '@/lib/date';

const ANCHOR = '2026-01-05'; // segunda-feira

describe('rotação das zonas', () => {
  it('começa na zona 1 na semana da âncora', () => {
    expect(getZoneForDate(ANCHOR, ANCHOR).id).toBe(1);
    expect(getZoneForDate(addDays(ANCHOR, 6), ANCHOR).id).toBe(1);
  });

  it('avança uma zona por semana', () => {
    for (let week = 0; week < 5; week += 1) {
      const date = addDays(ANCHOR, week * 7);
      expect(getZoneForDate(date, ANCHOR).id).toBe(week + 1);
    }
  });

  it('volta à zona 1 depois da zona 5', () => {
    expect(getZoneForDate(addDays(ANCHOR, 5 * 7), ANCHOR).id).toBe(1);
    expect(getZoneForDate(addDays(ANCHOR, 7 * 7), ANCHOR).id).toBe(3);
  });

  it('funciona para datas anteriores à âncora', () => {
    expect(getZoneForDate(addDays(ANCHOR, -7), ANCHOR).id).toBe(5);
    expect(getZoneForDate(addDays(ANCHOR, -14), ANCHOR).id).toBe(4);
  });

  it('sabe qual é a zona seguinte', () => {
    expect(getNextZone(ANCHOR, ANCHOR).id).toBe(2);
    expect(getNextZone(addDays(ANCHOR, 4 * 7), ANCHOR).id).toBe(1);
  });

  it('tem cinco zonas com missões', () => {
    expect(ZONES).toHaveLength(5);
    for (const zone of ZONES) {
      expect(zone.missions.length).toBeGreaterThan(0);
    }
  });
});

describe('missões da semana', () => {
  it('escolhe no máximo três missões', () => {
    let picked: string[] = [];
    picked = toggleMissionPick(picked, 'z1-sapatos');
    picked = toggleMissionPick(picked, 'z1-casacos');
    picked = toggleMissionPick(picked, 'z1-mesa');
    picked = toggleMissionPick(picked, 'z1-portas');
    expect(picked).toHaveLength(MAX_WEEKLY_MISSIONS);
    expect(picked).not.toContain('z1-portas');
  });

  it('permite desmarcar uma missão já escolhida', () => {
    const picked = toggleMissionPick(['z1-sapatos', 'z1-casacos'], 'z1-sapatos');
    expect(picked).toEqual(['z1-casacos']);
  });

  it('descreve o progresso sem percentagens', () => {
    expect(zoneProgressLabel([], 0)).toBe('Ainda não escolheste missões');
    expect(zoneProgressLabel(['a', 'b', 'c'], 2)).toBe('2 de 3 missões escolhidas concluídas');
  });
});

describe('progresso da zona ao longo da semana', () => {
  const TERCA = '2026-08-11';
  const QUARTA = '2026-08-12';
  const semana = weekDates(TERCA);

  const feita = (missionId: string, date: string): [string, Completion] => [
    `zm-${missionId}@${date}`,
    {
      instanceId: `zm-${missionId}@${date}`,
      templateId: `zm-${missionId}`,
      memberId: 'familia',
      date,
      completedAt: `${date}T20:00:00.000Z`,
      points: 0,
    },
  ];

  it('conta as missões feitas em qualquer dia da semana', () => {
    const completions = new Map([feita('z2-gaveta', TERCA)]);
    expect(completedMissionsInWeek(['z2-gaveta', 'z2-prateleira'], semana, completions)).toEqual([
      'z2-gaveta',
    ]);
  });

  it('uma missão feita na terça continua feita na quarta', () => {
    const completions = new Map([feita('z2-gaveta', TERCA)]);
    const naQuarta = completedMissionsInWeek(['z2-gaveta'], weekDates(QUARTA), completions);
    expect(naQuarta).toEqual(['z2-gaveta']);
  });

  it('não conta missões de outras semanas', () => {
    const completions = new Map([feita('z2-gaveta', '2026-08-04')]);
    expect(completedMissionsInWeek(['z2-gaveta'], semana, completions)).toEqual([]);
  });

  it('não conta missões que deixaram de estar escolhidas', () => {
    const completions = new Map([feita('z2-gaveta', TERCA)]);
    expect(completedMissionsInWeek(['z2-prateleira'], semana, completions)).toEqual([]);
  });
});
