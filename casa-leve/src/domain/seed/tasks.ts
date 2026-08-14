import type { DayOfWeek, TaskTemplate } from '@/domain/types';
import { ANA, NICOLAS, WILIAN } from '@/domain/seed/family';

export const WEEKDAYS: DayOfWeek[] = [1, 2, 3, 4, 5];
export const EVERY_DAY: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];
/** Noites com atividade externa — manutencao minima (Regra 1). */
export const ACTIVITY_NIGHTS: DayOfWeek[] = [1, 3, 5];
/** Noites em que amanha ha escola: e nestas que a mochila importa. */
export const SCHOOL_EVE: DayOfWeek[] = [0, 1, 2, 3, 4];

type Draft = Omit<TaskTemplate, 'recurring' | 'priority' | 'isEssential'> &
  Partial<Pick<TaskTemplate, 'recurring' | 'priority' | 'isEssential'>>;

const task = (draft: Draft): TaskTemplate => ({
  recurring: true,
  priority: 'normal',
  isEssential: false,
  ...draft,
});

/** Rotina da manha — curta e sempre igual (§8). */
const MORNING: TaskTemplate[] = [
  task({ id: 'm-w-levantar', title: 'Levantar', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 5 }),
  task({ id: 'm-w-higiene', title: 'Higiene', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 10 }),
  task({ id: 'm-w-preparar', title: 'Preparar-me', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 5 }),
  task({ id: 'm-w-acordar', title: 'Acordar o Nicolas', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 5 }),
  task({ id: 'm-w-vestir', title: 'Ajudar o Nicolas a vestir-se', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 10 }),
  task({ id: 'm-w-pequeno-almoco', title: 'Pequeno-almoço', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 15 }),
  task({ id: 'm-w-lanche', title: 'Verificar o lanche', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 3 }),
  task({
    id: 'm-w-mochila',
    title: 'Verificar a mochila',
    memberId: WILIAN,
    type: 'morning',
    days: WEEKDAYS,
    duration: 3,
    isEssential: true,
  }),
  task({ id: 'm-w-escola', title: 'Levar o Nicolas à escola', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 20 }),
  task({ id: 'm-w-regressar', title: 'Regressar a casa', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 15 }),
  task({ id: 'm-w-trabalho', title: 'Iniciar o trabalho', memberId: WILIAN, type: 'morning', days: WEEKDAYS, duration: 1 }),

  task({
    id: 'm-n-pijama',
    title: 'Pijama guardado',
    memberId: NICOLAS,
    type: 'morning',
    days: WEEKDAYS,
    points: 1,
    starCategory: 'autonomia',
  }),
  task({ id: 'm-n-vestir', title: 'Vestir-me', memberId: NICOLAS, type: 'morning', days: WEEKDAYS }),
  task({ id: 'm-n-pequeno-almoco', title: 'Pequeno-almoço', memberId: NICOLAS, type: 'morning', days: WEEKDAYS }),
  task({ id: 'm-n-dentes', title: 'Lavar os dentes', memberId: NICOLAS, type: 'morning', days: WEEKDAYS }),
  task({
    id: 'm-n-mochila',
    title: 'Mochila',
    memberId: NICOLAS,
    type: 'morning',
    days: WEEKDAYS,
    points: 1,
    starCategory: 'autonomia',
  }),
  task({ id: 'm-n-sapatos', title: 'Sapatos', memberId: NICOLAS, type: 'morning', days: WEEKDAYS }),

  task({ id: 'm-a-sair', title: 'Sair para o trabalho', memberId: ANA, type: 'morning', days: WEEKDAYS, duration: 5 }),
];

/** Microacoes de 2–5 min durante o home office (§9). Sempre opcionais. */
const MICRO: TaskTemplate[] = [
  task({
    id: 'micro-manha-maquina',
    title: 'Ligar a máquina da roupa',
    description: 'Pausa da manhã — escolhe só uma.',
    memberId: WILIAN,
    type: 'micro',
    days: WEEKDAYS,
    duration: 3,
    priority: 'optional',
  }),
  task({
    id: 'micro-manha-objetos',
    title: 'Guardar cinco objetos',
    description: 'Pausa da manhã — escolhe só uma.',
    memberId: WILIAN,
    type: 'micro',
    days: WEEKDAYS,
    duration: 2,
    priority: 'optional',
  }),
  task({
    id: 'micro-almoco-roupa',
    title: 'Transferir a roupa',
    description: 'Almoço — escolhe só uma.',
    memberId: WILIAN,
    type: 'micro',
    days: WEEKDAYS,
    duration: 3,
    priority: 'optional',
  }),
  task({
    id: 'micro-almoco-louca',
    title: 'Guardar a louça',
    description: 'Almoço — escolhe só uma.',
    memberId: WILIAN,
    type: 'micro',
    days: WEEKDAYS,
    duration: 5,
    priority: 'optional',
  }),
  task({
    id: 'micro-almoco-bancada',
    title: 'Limpar a bancada utilizada',
    description: 'Almoço — escolhe só uma.',
    memberId: WILIAN,
    type: 'micro',
    days: WEEKDAYS,
    duration: 3,
    priority: 'optional',
  }),
];

/** Fim de tarde e noite — antes do reset. */
const EVENING: TaskTemplate[] = [
  task({ id: 'e-w-buscar-nicolas', title: 'Buscar o Nicolas', memberId: WILIAN, type: 'evening', days: WEEKDAYS, duration: 20 }),
  task({ id: 'e-w-buscar-ana', title: 'Buscar a Ana', memberId: WILIAN, type: 'evening', days: WEEKDAYS, duration: 15 }),
  task({
    id: 'e-w-banho',
    title: 'Acompanhar o banho do Nicolas',
    memberId: WILIAN,
    type: 'evening',
    days: EVERY_DAY,
    duration: 20,
  }),
  task({
    id: 'e-w-roupa-atividade',
    title: 'Preparar a roupa da atividade',
    memberId: WILIAN,
    type: 'evening',
    days: ACTIVITY_NIGHTS,
    duration: 5,
  }),
  task({
    id: 'e-a-jantar',
    title: 'Preparar o jantar',
    memberId: ANA,
    type: 'kitchen',
    days: EVERY_DAY,
    duration: 30,
  }),
  task({
    id: 'e-a-amanha',
    title: 'Verificar os alimentos de amanhã',
    description: 'Descongelar o que for preciso.',
    memberId: ANA,
    type: 'kitchen',
    days: EVERY_DAY,
    duration: 5,
  }),
  task({
    id: 'e-n-prato',
    title: 'Levar o prato e o copo para a cozinha',
    memberId: NICOLAS,
    type: 'evening',
    days: EVERY_DAY,
    points: 1,
    starCategory: 'autonomia',
  }),
  task({ id: 'e-n-dentes', title: 'Lavar os dentes', memberId: NICOLAS, type: 'evening', days: EVERY_DAY }),
  task({
    id: 'e-n-pijama',
    title: 'Pijama no lugar',
    memberId: NICOLAS,
    type: 'evening',
    days: EVERY_DAY,
    points: 1,
    starCategory: 'autonomia',
  }),
];

/** Reset da noite — todos participam (Regra 4, §10). */
const RESET: TaskTemplate[] = [
  task({ id: 'r-w-sala', title: 'Sala', memberId: WILIAN, type: 'reset', days: EVERY_DAY, duration: 3 }),
  task({ id: 'r-w-corredor', title: 'Corredor', memberId: WILIAN, type: 'reset', days: EVERY_DAY, duration: 2 }),
  task({
    id: 'r-w-mochila',
    title: 'Mochila preparada',
    memberId: WILIAN,
    type: 'reset',
    days: SCHOOL_EVE,
    duration: 3,
    isEssential: true,
  }),
  task({
    id: 'r-w-roupa-atividade',
    title: 'Roupa da atividade de amanhã',
    memberId: WILIAN,
    type: 'reset',
    days: [0, 2, 4],
    duration: 3,
  }),
  task({
    id: 'r-n-brinquedos',
    title: 'Brinquedos recolhidos',
    memberId: NICOLAS,
    type: 'reset',
    days: EVERY_DAY,
    duration: 5,
    isEssential: true,
    points: 1,
    starCategory: 'autonomia',
  }),
  task({
    id: 'r-n-cesto',
    title: 'Roupa suja no cesto',
    memberId: NICOLAS,
    type: 'reset',
    days: EVERY_DAY,
    duration: 2,
    isEssential: true,
    points: 1,
    starCategory: 'autonomia',
  }),
  task({ id: 'r-n-quarto', title: 'Quarto arrumado', memberId: NICOLAS, type: 'reset', days: EVERY_DAY, duration: 5 }),
  task({
    id: 'r-n-mochila',
    title: 'Mochila no sítio',
    memberId: NICOLAS,
    type: 'reset',
    days: WEEKDAYS,
    duration: 2,
    points: 1,
    starCategory: 'autonomia',
  }),
  task({
    id: 'r-n-sapatos',
    title: 'Sapatos organizados',
    memberId: NICOLAS,
    type: 'reset',
    days: EVERY_DAY,
    duration: 2,
    points: 1,
    starCategory: 'autonomia',
  }),
];

/**
 * Fechar a cozinha faz parte do reset da noite; o responsavel e calculado
 * a partir das Regras 2 e 3 (ver `getKitchenDuty`).
 */
export const KITCHEN_DUTY: TaskTemplate[] = [
  task({
    id: 'k-louca',
    title: 'Encaminhar a louça',
    memberId: '',
    type: 'reset',
    days: EVERY_DAY,
    duration: 5,
    isEssential: true,
  }),
  task({
    id: 'k-bancada',
    title: 'Pia e bancada livres',
    memberId: '',
    type: 'reset',
    days: EVERY_DAY,
    duration: 5,
    isEssential: true,
  }),
  task({
    id: 'k-alimentos',
    title: 'Guardar alimentos',
    memberId: '',
    type: 'reset',
    days: EVERY_DAY,
    duration: 3,
  }),
];

/** Domingo — preparacao da semana, 10 minutos (§5). */
export const PLANNING: TaskTemplate[] = [
  task({ id: 'p-agenda', title: 'Verificar a agenda', memberId: WILIAN, type: 'planning', days: [0], duration: 2 }),
  task({ id: 'p-atividades', title: 'Atividades da semana', memberId: WILIAN, type: 'planning', days: [0], duration: 1 }),
  task({ id: 'p-escola', title: 'Escola', memberId: WILIAN, type: 'planning', days: [0], duration: 1 }),
  task({ id: 'p-refeicoes', title: 'Refeições', memberId: ANA, type: 'planning', days: [0], duration: 3 }),
  task({ id: 'p-roupa', title: 'Roupa', memberId: ANA, type: 'planning', days: [0], duration: 2 }),
  task({ id: 'p-zona', title: 'Zona da próxima semana', memberId: WILIAN, type: 'planning', days: [0], duration: 1 }),
  task({
    id: 'p-natacao',
    title: 'Roupa de natação',
    memberId: NICOLAS,
    type: 'planning',
    days: [0],
    duration: 2,
    points: 1,
    starCategory: 'autonomia',
  }),
  task({
    id: 'p-jiujitsu',
    title: 'Roupa de jiu-jitsu',
    memberId: NICOLAS,
    type: 'planning',
    days: [0],
    duration: 2,
    points: 1,
    starCategory: 'autonomia',
  }),
  task({
    id: 'p-mochila',
    title: 'Mochila',
    memberId: NICOLAS,
    type: 'planning',
    days: [0],
    duration: 2,
    points: 1,
    starCategory: 'autonomia',
  }),
  task({
    id: 'p-base-segunda',
    title: 'Preparar a base da refeição de segunda',
    memberId: ANA,
    type: 'planning',
    days: [0],
    duration: 20,
  }),
];

export const TASK_TEMPLATES: TaskTemplate[] = [...MORNING, ...MICRO, ...EVENING, ...RESET, ...PLANNING];

/** Tarefas do Nicolas que dao estrelas por defeito (§19) — higiene fica de fora. */
export const DEFAULT_STAR_TEMPLATE_IDS: string[] = [...TASK_TEMPLATES, ...KITCHEN_DUTY]
  .filter((t) => t.memberId === NICOLAS && (t.points ?? 0) > 0)
  .map((t) => t.id);
