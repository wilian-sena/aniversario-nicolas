import { beforeEach, describe, expect, it } from 'vitest';
import 'fake-indexeddb/auto';
import { setPersistence } from '@/store/db';
import {
  loadSnapshot,
  resetEverything,
  saveCompletion,
  saveDayFlags,
  saveHotspot,
  saveLaundry,
  saveMeal,
  saveSettings,
  saveZonePick,
} from '@/store/repository';
import { DEFAULT_SETTINGS } from '@/domain/seed/settings';
import { NICOLAS } from '@/domain/seed/family';

describe('persistência local', () => {
  beforeEach(async () => {
    setPersistence(null);
    await resetEverything();
  });

  it('começa com o seed por defeito', async () => {
    const snapshot = await loadSnapshot();
    expect(snapshot.settings.zoneTimerMinutes).toBe(15);
    expect(snapshot.completions).toHaveLength(0);
  });

  it('guarda e volta a ler uma conclusão', async () => {
    await saveCompletion({
      instanceId: 'r-n-brinquedos@2026-08-14',
      templateId: 'r-n-brinquedos',
      memberId: NICOLAS,
      date: '2026-08-14',
      completedAt: '2026-08-14T20:00:00.000Z',
      points: 1,
      starCategory: 'autonomia',
    });

    const snapshot = await loadSnapshot();
    expect(snapshot.completions).toHaveLength(1);
    expect(snapshot.completions[0].templateId).toBe('r-n-brinquedos');
  });

  it('não duplica ao guardar a mesma instância duas vezes', async () => {
    const completion = {
      instanceId: 'r-n-cesto@2026-08-14',
      templateId: 'r-n-cesto',
      memberId: NICOLAS,
      date: '2026-08-14',
      completedAt: '2026-08-14T20:00:00.000Z',
      points: 1,
    };
    await saveCompletion(completion);
    await saveCompletion({ ...completion, completedAt: '2026-08-14T21:00:00.000Z' });

    const snapshot = await loadSnapshot();
    expect(snapshot.completions).toHaveLength(1);
    expect(snapshot.completions[0].completedAt).toBe('2026-08-14T21:00:00.000Z');
  });

  it('guarda o resto do estado da casa', async () => {
    await saveSettings({ ...DEFAULT_SETTINGS, zoneTimerMinutes: 20, onboarded: true });
    await saveHotspot({ id: 'sofa', status: 'acumulado', updatedAt: '2026-08-14T10:00:00.000Z' });
    await saveZonePick({ weekKey: '2026-W33', missionIds: ['z3-brinquedos'] });
    await saveLaundry({
      id: '2026-W33:comum-escura',
      weekKey: '2026-W33',
      loadId: 'comum-escura',
      status: 'a-secar',
      updatedAt: '2026-08-14T10:00:00.000Z',
    });
    await saveMeal({ date: '2026-08-14', text: 'Sopa e tosta' });
    await saveDayFlags({ date: '2026-08-14', essentialMode: true, dayClosed: false });

    const snapshot = await loadSnapshot();
    expect(snapshot.settings.zoneTimerMinutes).toBe(20);
    expect(snapshot.settings.onboarded).toBe(true);
    expect(snapshot.hotspots[0].status).toBe('acumulado');
    expect(snapshot.zonePicks[0].missionIds).toEqual(['z3-brinquedos']);
    expect(snapshot.laundry[0].status).toBe('a-secar');
    expect(snapshot.meals[0].text).toBe('Sopa e tosta');
    expect(snapshot.dayFlags[0].essentialMode).toBe(true);
  });

  it('mantém os valores por defeito quando o seed cresce', async () => {
    await saveSettings({ ...DEFAULT_SETTINGS, soundEnabled: false });
    const snapshot = await loadSnapshot();
    expect(snapshot.settings.soundEnabled).toBe(false);
    expect(snapshot.settings.blessingTimerMinutes).toBe(25);
  });

  it('limpa tudo quando a família recomeça', async () => {
    await saveMeal({ date: '2026-08-14', text: 'Massa' });
    await resetEverything();
    const snapshot = await loadSnapshot();
    expect(snapshot.meals).toHaveLength(0);
  });
});
