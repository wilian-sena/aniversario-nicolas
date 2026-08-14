import type { IsoDate, Zone, ZoneMission } from '@/domain/types';
import { ZONES, ZONE_COUNT } from '@/domain/seed/zones';
import { weeksBetween } from '@/lib/date';

/**
 * Ciclo automatico de cinco zonas. A semana da ancora e a Zona 1;
 * depois da Zona 5 volta-se a Zona 1, em qualquer direcao no tempo.
 */
export function getZoneForDate(date: IsoDate, anchor: IsoDate, zones: Zone[] = ZONES): Zone {
  const weeks = weeksBetween(anchor, date);
  const count = zones.length || ZONE_COUNT;
  const index = ((weeks % count) + count) % count;
  return zones[index];
}

export function getNextZone(date: IsoDate, anchor: IsoDate, zones: Zone[] = ZONES): Zone {
  const current = getZoneForDate(date, anchor, zones);
  const index = zones.findIndex((z) => z.id === current.id);
  return zones[(index + 1) % zones.length];
}

export function findZone(zoneId: number, zones: Zone[] = ZONES): Zone | undefined {
  return zones.find((z) => z.id === zoneId);
}

export function findMission(missionId: string, zones: Zone[] = ZONES): ZoneMission | undefined {
  for (const zone of zones) {
    const mission = zone.missions.find((m) => m.id === missionId);
    if (mission) return mission;
  }
  return undefined;
}

export const MAX_WEEKLY_MISSIONS = 3;

/** §7 — entre 1 e 3 missoes por semana, nunca a zona inteira. */
export function toggleMissionPick(picked: string[], missionId: string): string[] {
  if (picked.includes(missionId)) return picked.filter((id) => id !== missionId);
  if (picked.length >= MAX_WEEKLY_MISSIONS) return picked;
  return [...picked, missionId];
}

export function zoneProgressLabel(picked: string[], doneCount: number): string {
  if (picked.length === 0) return 'Ainda não escolheste missões';
  return `${doneCount} de ${picked.length} missões escolhidas concluídas`;
}
