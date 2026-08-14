/** 0 = domingo ... 6 = sabado (igual a Date.getDay). */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Data no formato ISO curto: "2026-08-14". */
export type IsoDate = string;

export type MemberId = string;

export type MemberColor = 'wilian' | 'ana' | 'nicolas';

export interface WorkSchedule {
  label: string;
  days: DayOfWeek[];
  start: string;
  end: string;
  /** Home office: presente em casa mas indisponivel para tarefas domesticas. */
  homeOffice: boolean;
}

export interface FamilyMember {
  id: MemberId;
  name: string;
  color: MemberColor;
  isChild: boolean;
  responsibilities: string[];
  work?: WorkSchedule;
}

export type TaskType =
  | 'morning'
  | 'evening'
  | 'reset'
  | 'micro'
  | 'zone'
  | 'blessing'
  | 'kitchen'
  | 'laundry'
  | 'planning';

export type TaskPriority = 'essential' | 'normal' | 'optional';

/**
 * Modelo de tarefa recorrente. Nao existem copias por dia: as tarefas de um dia
 * sao calculadas a partir destes modelos (ver `schedule.ts`).
 */
export interface TaskTemplate {
  id: string;
  title: string;
  description?: string;
  memberId: MemberId;
  type: TaskType;
  /** Dias em que a tarefa aparece. Vazio/omisso = todos os dias. */
  days?: DayOfWeek[];
  /** Data especifica (tarefa pontual), tem prioridade sobre `days`. */
  date?: IsoDate;
  /** Minutos estimados. */
  duration?: number;
  recurring: boolean;
  priority: TaskPriority;
  zoneId?: number;
  /** Aparece no Modo Essencial. */
  isEssential: boolean;
  /** Estrelas atribuidas ao Nicolas (0 = nenhuma). */
  points?: number;
  starCategory?: StarCategory;
}

/** Tarefa ja resolvida para um dia concreto. */
export interface ResolvedTask extends TaskTemplate {
  /** `${templateId}@${date}` — estavel e unico por dia. */
  instanceId: string;
  date: IsoDate;
  completed: boolean;
  completedAt?: string;
}

export interface Completion {
  instanceId: string;
  templateId: string;
  memberId: MemberId;
  date: IsoDate;
  completedAt: string;
  points: number;
  starCategory?: StarCategory;
}

export interface ZoneMission {
  id: string;
  title: string;
}

export interface Zone {
  id: number;
  name: string;
  shortName: string;
  icon: string;
  missions: ZoneMission[];
}

export interface Activity {
  id: string;
  title: string;
  icon: string;
  day: DayOfWeek;
  start: string;
  end: string;
  /** Quem acompanha — fica dispensado da tarefa domestica principal (Regra 3). */
  escortId?: MemberId;
  memberId: MemberId;
  external: boolean;
}

export type DayTheme =
  | 'minimal'
  | 'zone'
  | 'blessing'
  | 'light'
  | 'family'
  | 'planning';

export interface DayPlan {
  date: IsoDate;
  dayOfWeek: DayOfWeek;
  theme: DayTheme;
  /** Titulo curto: "Manutencao minima". */
  themeLabel: string;
  /** Frase para o dashboard: "Hoje e dia leve." */
  houseNote: string;
  /** Lista curta do que a casa espera hoje. */
  houseFocus: string[];
  activities: Activity[];
  /** Minutos do bloco principal do dia (15 zona, 25 bencao...). */
  focusMinutes?: number;
  icon: string;
}

export type LaundryStatus =
  | 'por-preparar'
  | 'preparada'
  | 'a-lavar'
  | 'lavada'
  | 'a-secar'
  | 'seca'
  | 'dobrada'
  | 'guardada';

export interface LaundryLoad {
  id: string;
  title: string;
  description: string;
  day: DayOfWeek;
  /** Quem guarda a roupa por defeito (cada um guarda a sua sempre que possivel). */
  ownerId?: MemberId;
}

export interface LaundryEntry {
  /** `${weekKey}:${loadId}` */
  id: string;
  weekKey: string;
  loadId: string;
  status: LaundryStatus;
  updatedAt: string;
}

export type HotspotStatus = 'ok' | 'atencao' | 'acumulado';

export interface Hotspot {
  id: string;
  name: string;
  icon: string;
}

export interface HotspotEntry {
  id: string;
  status: HotspotStatus;
  updatedAt: string;
}

export interface MealSuggestion {
  day: DayOfWeek;
  strategy: string;
  cookId?: MemberId;
}

export interface MealEntry {
  date: IsoDate;
  text: string;
}

export type BlessingWeek = 'A' | 'B';

export interface BlessingTask {
  id: string;
  title: string;
  memberId: MemberId;
}

export type StarCategory = 'autonomia' | 'aprendizagem' | 'extra';

export interface ZonePick {
  /** weekKey, ex.: "2026-W33" */
  weekKey: string;
  missionIds: string[];
}

export interface DayFlags {
  date: IsoDate;
  essentialMode: boolean;
  dayClosed: boolean;
}

export interface NotificationPref {
  id: string;
  label: string;
  time: string;
  enabled: boolean;
}

export interface Settings {
  /** Segunda-feira que corresponde a Zona 1 — ancora da rotacao. */
  zoneAnchor: IsoDate;
  /** Semana da bencao (A/B) na semana da ancora. */
  blessingAnchorWeek: BlessingWeek;
  zoneTimerMinutes: number;
  blessingTimerMinutes: number;
  resetTimerMinutes: number;
  quickResetMinutes: number;
  planningMinutes: number;
  /** Modelos de tarefa do Nicolas que atribuem estrelas. */
  starTemplateIds: string[];
  notifications: NotificationPref[];
  soundEnabled: boolean;
  onboarded: boolean;
}
