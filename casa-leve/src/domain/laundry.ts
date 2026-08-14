import type { LaundryEntry, LaundryLoad, LaundryStatus } from '@/domain/types';
import { LAUNDRY_FLOW, LAUNDRY_LOADS } from '@/domain/seed/home';

export function laundryEntryId(weekKey: string, loadId: string): string {
  return `${weekKey}:${loadId}`;
}

export function nextLaundryStatus(status: LaundryStatus): LaundryStatus {
  const index = LAUNDRY_FLOW.indexOf(status);
  if (index < 0 || index === LAUNDRY_FLOW.length - 1) return LAUNDRY_FLOW[LAUNDRY_FLOW.length - 1];
  return LAUNDRY_FLOW[index + 1];
}

export function previousLaundryStatus(status: LaundryStatus): LaundryStatus {
  const index = LAUNDRY_FLOW.indexOf(status);
  if (index <= 0) return LAUNDRY_FLOW[0];
  return LAUNDRY_FLOW[index - 1];
}

export function laundryProgress(status: LaundryStatus): number {
  const index = Math.max(0, LAUNDRY_FLOW.indexOf(status));
  return index / (LAUNDRY_FLOW.length - 1);
}

export function getLaundryEntry(
  entries: Map<string, LaundryEntry>,
  weekKey: string,
  loadId: string,
): LaundryEntry {
  const id = laundryEntryId(weekKey, loadId);
  return (
    entries.get(id) ?? {
      id,
      weekKey,
      loadId,
      status: 'por-preparar',
      updatedAt: '',
    }
  );
}

export function loadsForDay(day: number, loads: LaundryLoad[] = LAUNDRY_LOADS): LaundryLoad[] {
  // A carta de quinta pode escorregar para sexta sem deixar de aparecer.
  return loads.filter((load) => load.day === day || (load.day === 4 && day === 5));
}
