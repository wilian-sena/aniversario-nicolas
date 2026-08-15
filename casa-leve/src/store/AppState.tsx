'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  Completion,
  DayFlags,
  HotspotEntry,
  HotspotStatus,
  IsoDate,
  LaundryEntry,
  LaundryStatus,
  ResolvedTask,
  Settings,
} from '@/domain/types';
import { laundryEntryId } from '@/domain/laundry';
import { EMPTY_SNAPSHOT, loadSnapshot, type Snapshot } from '@/store/repository';
import * as repo from '@/store/repository';
import { toIsoDate } from '@/lib/date';

interface AppActions {
  toggleTask: (task: ResolvedTask) => void;
  setHotspot: (hotspotId: string, status: HotspotStatus) => void;
  setZonePicks: (weekKey: string, missionIds: string[]) => void;
  setLaundryStatus: (weekKey: string, loadId: string, status: LaundryStatus) => void;
  setMeal: (date: IsoDate, text: string) => void;
  setEssentialMode: (date: IsoDate, enabled: boolean) => void;
  setDayClosed: (date: IsoDate, closed: boolean) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetAll: () => Promise<void>;
}

interface AppContextValue extends AppActions {
  ready: boolean;
  today: IsoDate;
  snapshot: Snapshot;
  completionsById: Map<string, Completion>;
  hotspotsById: Map<string, HotspotEntry>;
  laundryById: Map<string, LaundryEntry>;
  mealsByDate: Map<IsoDate, string>;
  flagsByDate: Map<IsoDate, DayFlags>;
}

const AppContext = createContext<AppContextValue | null>(null);

function upsert<T>(list: T[], item: T, matches: (candidate: T) => boolean): T[] {
  const index = list.findIndex(matches);
  if (index < 0) return [...list, item];
  const next = [...list];
  next[index] = item;
  return next;
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<Snapshot>(EMPTY_SNAPSHOT);
  const [ready, setReady] = useState(false);
  const [today, setToday] = useState<IsoDate>(() => toIsoDate(new Date()));

  useEffect(() => {
    let active = true;
    loadSnapshot()
      .then((loaded) => {
        if (active) setSnapshot(loaded);
      })
      .catch(() => {
        /* sem persistencia disponivel: a aplicacao continua em memoria */
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  // A data muda quando a aplicacao fica aberta durante a noite.
  useEffect(() => {
    const sync = () => setToday(toIsoDate(new Date()));
    const timer = window.setInterval(sync, 60_000);
    window.addEventListener('focus', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const toggleTask = useCallback((task: ResolvedTask) => {
    setSnapshot((current) => {
      const exists = current.completions.some((c) => c.instanceId === task.instanceId);
      if (exists) {
        void repo.removeCompletion(task.instanceId);
        return {
          ...current,
          completions: current.completions.filter((c) => c.instanceId !== task.instanceId),
        };
      }
      const completion: Completion = {
        instanceId: task.instanceId,
        templateId: task.id,
        memberId: task.memberId,
        date: task.date,
        completedAt: new Date().toISOString(),
        points: task.points ?? 0,
        starCategory: task.starCategory,
      };
      void repo.saveCompletion(completion);
      return { ...current, completions: [...current.completions, completion] };
    });
  }, []);

  const setHotspot = useCallback((hotspotId: string, status: HotspotStatus) => {
    const entry: HotspotEntry = { id: hotspotId, status, updatedAt: new Date().toISOString() };
    void repo.saveHotspot(entry);
    setSnapshot((current) => ({
      ...current,
      hotspots: upsert(current.hotspots, entry, (h) => h.id === hotspotId),
    }));
  }, []);

  const setZonePicks = useCallback((weekKey: string, missionIds: string[]) => {
    const pick = { weekKey, missionIds };
    void repo.saveZonePick(pick);
    setSnapshot((current) => ({
      ...current,
      zonePicks: upsert(current.zonePicks, pick, (z) => z.weekKey === weekKey),
    }));
  }, []);

  const setLaundryStatus = useCallback((weekKey: string, loadId: string, status: LaundryStatus) => {
    const entry: LaundryEntry = {
      id: laundryEntryId(weekKey, loadId),
      weekKey,
      loadId,
      status,
      updatedAt: new Date().toISOString(),
    };
    void repo.saveLaundry(entry);
    setSnapshot((current) => ({
      ...current,
      laundry: upsert(current.laundry, entry, (l) => l.id === entry.id),
    }));
  }, []);

  const setMeal = useCallback((date: IsoDate, text: string) => {
    const entry = { date, text };
    void repo.saveMeal(entry);
    setSnapshot((current) => ({
      ...current,
      meals: upsert(current.meals, entry, (m) => m.date === date),
    }));
  }, []);

  const patchFlags = useCallback((date: IsoDate, patch: Partial<DayFlags>) => {
    setSnapshot((current) => {
      const existing = current.dayFlags.find((f) => f.date === date) ?? {
        date,
        essentialMode: false,
        dayClosed: false,
      };
      const next: DayFlags = { ...existing, ...patch, date };
      void repo.saveDayFlags(next);
      return { ...current, dayFlags: upsert(current.dayFlags, next, (f) => f.date === date) };
    });
  }, []);

  const setEssentialMode = useCallback(
    (date: IsoDate, enabled: boolean) => patchFlags(date, { essentialMode: enabled }),
    [patchFlags],
  );

  const setDayClosed = useCallback(
    (date: IsoDate, closed: boolean) => patchFlags(date, { dayClosed: closed }),
    [patchFlags],
  );

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSnapshot((current) => {
      const settings = { ...current.settings, ...patch };
      void repo.saveSettings(settings);
      return { ...current, settings };
    });
  }, []);

  const resetAll = useCallback(async () => {
    await repo.resetEverything();
    setSnapshot({ ...EMPTY_SNAPSHOT, settings: { ...EMPTY_SNAPSHOT.settings, onboarded: true } });
    await repo.saveSettings({ ...EMPTY_SNAPSHOT.settings, onboarded: true });
  }, []);

  const value = useMemo<AppContextValue>(() => {
    return {
      ready,
      today,
      snapshot,
      completionsById: new Map(snapshot.completions.map((c) => [c.instanceId, c])),
      hotspotsById: new Map(snapshot.hotspots.map((h) => [h.id, h])),
      laundryById: new Map(snapshot.laundry.map((l) => [l.id, l])),
      mealsByDate: new Map(snapshot.meals.map((m) => [m.date, m.text])),
      flagsByDate: new Map(snapshot.dayFlags.map((f) => [f.date, f])),
      toggleTask,
      setHotspot,
      setZonePicks,
      setLaundryStatus,
      setMeal,
      setEssentialMode,
      setDayClosed,
      updateSettings,
      resetAll,
    };
  }, [
    ready,
    today,
    snapshot,
    toggleTask,
    setHotspot,
    setZonePicks,
    setLaundryStatus,
    setMeal,
    setEssentialMode,
    setDayClosed,
    updateSettings,
    resetAll,
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp tem de ser usado dentro de <AppProvider>.');
  return context;
}
