import type { Settings } from '@/domain/types';
import { NOTIFICATION_DEFAULTS } from '@/domain/seed/home';
import { DEFAULT_STAR_TEMPLATE_IDS } from '@/domain/seed/tasks';

export const DEFAULT_SETTINGS: Settings = {
  /** Segunda-feira de referencia da rotacao das zonas (Zona 1 nessa semana). */
  zoneAnchor: '2026-01-05',
  blessingAnchorWeek: 'A',
  zoneTimerMinutes: 15,
  blessingTimerMinutes: 25,
  resetTimerMinutes: 10,
  quickResetMinutes: 10,
  planningMinutes: 10,
  starTemplateIds: DEFAULT_STAR_TEMPLATE_IDS,
  notifications: NOTIFICATION_DEFAULTS,
  soundEnabled: true,
  onboarded: false,
};
