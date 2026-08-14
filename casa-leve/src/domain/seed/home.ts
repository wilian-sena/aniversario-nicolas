import type {
  BlessingTask,
  Hotspot,
  LaundryLoad,
  LaundryStatus,
  MealSuggestion,
  NotificationPref,
} from '@/domain/types';
import { ANA, NICOLAS, WILIAN } from '@/domain/seed/family';

/** §13 — tres cargas por semana, cada uma com o seu dia. */
export const LAUNDRY_LOADS: LaundryLoad[] = [
  {
    id: 'comum-escura',
    title: 'Roupa comum / escura',
    description: 'A carga da semana toda.',
    day: 1,
  },
  {
    id: 'nicolas-desporto',
    title: 'Nicolas + desportiva + toalhas',
    description: 'Natação, jiu-jitsu e toalhas pequenas.',
    day: 3,
    ownerId: NICOLAS,
  },
  {
    id: 'clara-cama',
    title: 'Roupa clara / roupa de cama',
    description: 'Quinta ou sexta, conforme der.',
    day: 4,
  },
];

export const LAUNDRY_FLOW: LaundryStatus[] = [
  'por-preparar',
  'preparada',
  'a-lavar',
  'lavada',
  'a-secar',
  'seca',
  'dobrada',
  'guardada',
];

export const LAUNDRY_LABELS: Record<LaundryStatus, string> = {
  'por-preparar': 'Por preparar',
  preparada: 'Preparada',
  'a-lavar': 'A lavar',
  lavada: 'Lavada',
  'a-secar': 'A secar',
  seca: 'Seca',
  dobrada: 'Dobrada',
  guardada: 'Guardada',
};

/** Rotulo do botao que faz a carga avancar — em portugues natural. */
export const LAUNDRY_ACTIONS: Record<LaundryStatus, string> = {
  'por-preparar': 'Voltar ao início',
  preparada: 'Já está preparada',
  'a-lavar': 'Pôr a lavar',
  lavada: 'Já lavou',
  'a-secar': 'Pôr a secar',
  seca: 'Já secou',
  dobrada: 'Já dobrei',
  guardada: 'Guardar',
};

export const HOTSPOTS: Hotspot[] = [
  { id: 'mesa-jantar', name: 'Mesa de jantar', icon: '🍽️' },
  { id: 'bancada', name: 'Bancada da cozinha', icon: '🧽' },
  { id: 'sofa', name: 'Sofá', icon: '🛋️' },
  { id: 'entrada', name: 'Entrada', icon: '🚪' },
  { id: 'corredor', name: 'Corredor', icon: '🚶' },
  { id: 'cadeira-roupa', name: 'Cadeira com roupa', icon: '👕' },
];

/** §14 — planeamento leve, sem receitas. */
export const MEAL_SUGGESTIONS: MealSuggestion[] = [
  { day: 0, strategy: 'Preparar a base de segunda', cookId: ANA },
  { day: 1, strategy: 'Refeição pronta ou simples', cookId: ANA },
  { day: 2, strategy: 'Cozinhar para hoje e para quarta', cookId: ANA },
  { day: 3, strategy: 'Reaquecer e finalizar', cookId: ANA },
  { day: 4, strategy: 'Cozinhar para hoje e para sexta', cookId: ANA },
  { day: 5, strategy: 'Simples ou reaproveitada', cookId: ANA },
  { day: 6, strategy: 'Livre — dia de família', cookId: ANA },
];

/**
 * §12 — Bencao semanal de quinta, 25 minutos, todos ao mesmo tempo.
 * Os adultos alternam entre a semana A e a semana B; o Nicolas mantem-se.
 */
export const BLESSING_A: BlessingTask[] = [
  { id: 'b-aspirar-sala', title: 'Aspirar a sala', memberId: WILIAN },
  { id: 'b-aspirar-corredor', title: 'Aspirar o corredor', memberId: WILIAN },
  { id: 'b-aspirar-quartos', title: 'Aspirar os quartos', memberId: WILIAN },
  { id: 'b-pano', title: 'Passar pano nas áreas principais', memberId: WILIAN },
  { id: 'b-casa-banho', title: 'Casa de banho', memberId: ANA },
  { id: 'b-po', title: 'Pó', memberId: ANA },
  { id: 'b-espelhos', title: 'Espelhos', memberId: ANA },
  { id: 'b-lixos', title: 'Recolher pequenos lixos', memberId: NICOLAS },
  { id: 'b-quarto', title: 'Organizar o quarto', memberId: NICOLAS },
  { id: 'b-sapatos', title: 'Organizar os sapatos', memberId: NICOLAS },
];

export const NOTIFICATION_DEFAULTS: NotificationPref[] = [
  { id: 'manha', label: 'Rotina da manhã', time: '07:00', enabled: false },
  { id: 'noite', label: 'Preparar a noite', time: '17:30', enabled: false },
  { id: 'reset', label: 'Reset da casa', time: '20:15', enabled: false },
  { id: 'planeamento', label: 'Planeamento da semana (domingo)', time: '18:00', enabled: false },
  { id: 'atividade', label: 'Antes de sair para a atividade', time: '17:45', enabled: false },
];
