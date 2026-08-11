import type {
  AppSettings,
  AppState,
  ChildProfile,
  ExtraJob,
  ISODate,
  LearningActivity,
  Responsibility,
  RewardTier,
  SavingsGoal,
  Transaction,
  WalletId,
} from '../types'

export type AppAction =
  /* Responsabilidades */
  | { type: 'responsibility/toggle'; responsibilityId: string; date: ISODate; part?: 'morning' | 'night' }
  | { type: 'responsibility/approve'; completionId: string }
  | { type: 'responsibility/reject'; completionId: string }
  | { type: 'responsibility/save'; responsibility: Responsibility }
  | { type: 'responsibility/remove'; id: string }
  /* Aprendizagem */
  | { type: 'learning/toggle'; activityId: string; date: ISODate }
  | { type: 'learning/approve'; completionId: string }
  | { type: 'learning/reject'; completionId: string }
  | { type: 'learning/save'; activity: LearningActivity }
  | { type: 'learning/remove'; id: string }
  /* Trabalhos extra */
  | { type: 'job/claim'; jobId: string }
  | { type: 'job/submit'; completionId: string }
  | { type: 'job/giveUp'; completionId: string }
  | { type: 'job/approve'; completionId: string }
  | { type: 'job/reject'; completionId: string; note?: string }
  | { type: 'job/save'; job: ExtraJob }
  | { type: 'job/remove'; id: string }
  /* Recompensas e cofrinhos */
  | { type: 'tiers/save'; tiers: RewardTier[] }
  | { type: 'wallets/percent'; percents: Record<WalletId, number> }
  /* Dinheiro */
  | { type: 'transaction/add'; transaction: Omit<Transaction, 'id' | 'date'> & { date?: string } }
  | { type: 'transaction/remove'; id: string }
  /* Objetivo */
  | { type: 'goal/save'; goal: SavingsGoal }
  | { type: 'goal/remove'; id: string }
  | { type: 'goal/celebrated'; id: string }
  | { type: 'goal/buy'; id: string }
  /* Semana */
  | { type: 'week/close'; chosenPrivilege?: string }
  /* Configurações e dados */
  | { type: 'settings/update'; patch: Partial<AppSettings> }
  | { type: 'profile/update'; patch: Partial<ChildProfile> }
  | { type: 'state/replace'; state: AppState }
  | { type: 'state/reset' }
