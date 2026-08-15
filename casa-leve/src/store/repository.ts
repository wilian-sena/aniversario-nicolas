import type {
  Completion,
  DayFlags,
  HotspotEntry,
  LaundryEntry,
  MealEntry,
  Settings,
  ZonePick,
} from '@/domain/types';
import { DEFAULT_SETTINGS } from '@/domain/seed/settings';
import { getPersistence } from '@/store/db';

const SETTINGS_KEY = 'settings';

interface SettingsRecord {
  id: string;
  value: Settings;
}

export interface Snapshot {
  settings: Settings;
  completions: Completion[];
  hotspots: HotspotEntry[];
  zonePicks: ZonePick[];
  laundry: LaundryEntry[];
  meals: MealEntry[];
  dayFlags: DayFlags[];
}

export const EMPTY_SNAPSHOT: Snapshot = {
  settings: DEFAULT_SETTINGS,
  completions: [],
  hotspots: [],
  zonePicks: [],
  laundry: [],
  meals: [],
  dayFlags: [],
};

export async function loadSnapshot(): Promise<Snapshot> {
  const db = getPersistence();
  const [settingsRecords, completions, hotspots, zonePicks, laundry, meals, dayFlags] = await Promise.all([
    db.getAll<SettingsRecord>('settings'),
    db.getAll<Completion>('completions'),
    db.getAll<HotspotEntry>('hotspots'),
    db.getAll<ZonePick>('zonePicks'),
    db.getAll<LaundryEntry>('laundry'),
    db.getAll<MealEntry>('meals'),
    db.getAll<DayFlags>('dayFlags'),
  ]);

  const stored = settingsRecords.find((record) => record.id === SETTINGS_KEY)?.value;
  return {
    // Merge com os valores por defeito: seed novo nunca fica em falta.
    settings: { ...DEFAULT_SETTINGS, ...(stored ?? {}) },
    completions,
    hotspots,
    zonePicks,
    laundry,
    meals,
    dayFlags,
  };
}

export async function saveSettings(settings: Settings): Promise<void> {
  await getPersistence().put<SettingsRecord>('settings', { id: SETTINGS_KEY, value: settings });
}

export async function saveCompletion(completion: Completion): Promise<void> {
  await getPersistence().put('completions', completion);
}

export async function removeCompletion(instanceId: string): Promise<void> {
  await getPersistence().remove('completions', instanceId);
}

export async function saveHotspot(entry: HotspotEntry): Promise<void> {
  await getPersistence().put('hotspots', entry);
}

export async function saveZonePick(pick: ZonePick): Promise<void> {
  await getPersistence().put('zonePicks', pick);
}

export async function saveLaundry(entry: LaundryEntry): Promise<void> {
  await getPersistence().put('laundry', entry);
}

export async function saveMeal(entry: MealEntry): Promise<void> {
  await getPersistence().put('meals', entry);
}

export async function saveDayFlags(flags: DayFlags): Promise<void> {
  await getPersistence().put('dayFlags', flags);
}

export async function resetEverything(): Promise<void> {
  await getPersistence().reset();
}
