import type { DayOfWeek, IsoDate } from '@/domain/types';

export const WEEKDAY_LONG = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
] as const;

export const WEEKDAY_SHORT = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'] as const;

export const MONTH_LONG = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
] as const;

/** Data local (nao UTC) em ISO curto. */
export function toIsoDate(date: Date): IsoDate {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Converte "2026-08-14" numa Date local ao meio-dia (evita saltos de DST). */
export function fromIsoDate(iso: IsoDate): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d, 12, 0, 0, 0);
}

export function dayOfWeek(iso: IsoDate): DayOfWeek {
  return fromIsoDate(iso).getDay() as DayOfWeek;
}

export function addDays(iso: IsoDate, amount: number): IsoDate {
  const date = fromIsoDate(iso);
  date.setDate(date.getDate() + amount);
  return toIsoDate(date);
}

/** Segunda-feira da semana a que a data pertence. */
export function startOfWeek(iso: IsoDate): IsoDate {
  const day = dayOfWeek(iso);
  const delta = day === 0 ? -6 : 1 - day;
  return addDays(iso, delta);
}

export function weekDates(iso: IsoDate): IsoDate[] {
  const monday = startOfWeek(iso);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export function diffInDays(from: IsoDate, to: IsoDate): number {
  const ms = fromIsoDate(to).getTime() - fromIsoDate(from).getTime();
  return Math.round(ms / 86_400_000);
}

/** Numero de semanas completas (segunda a segunda) entre duas datas. */
export function weeksBetween(from: IsoDate, to: IsoDate): number {
  return Math.floor(diffInDays(startOfWeek(from), startOfWeek(to)) / 7);
}

/** Chave estavel da semana, ex.: "2026-W33" (ISO 8601). */
export function weekKey(iso: IsoDate): string {
  const date = fromIsoDate(startOfWeek(iso));
  const thursday = new Date(date);
  thursday.setDate(thursday.getDate() + 3);
  const firstThursday = new Date(thursday.getFullYear(), 0, 4, 12);
  const offset = (firstThursday.getDay() + 6) % 7;
  firstThursday.setDate(firstThursday.getDate() - offset + 3);
  const week = 1 + Math.round((thursday.getTime() - firstThursday.getTime()) / (7 * 86_400_000));
  return `${thursday.getFullYear()}-W${`${week}`.padStart(2, '0')}`;
}

export function formatLongDate(iso: IsoDate): string {
  const date = fromIsoDate(iso);
  return `${date.getDate()} ${MONTH_LONG[date.getMonth()]}`;
}

export function formatWeekdayLong(iso: IsoDate): string {
  return WEEKDAY_LONG[dayOfWeek(iso)];
}

export function greetingFor(hour: number): string {
  if (hour < 12) return 'Bom dia';
  if (hour < 20) return 'Boa tarde';
  return 'Boa noite';
}

/** "18:00" -> 1080 minutos. */
export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function formatDuration(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${m}:${`${s}`.padStart(2, '0')}`;
}
