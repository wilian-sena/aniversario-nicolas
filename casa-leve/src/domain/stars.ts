import type { Completion, IsoDate, MemberId, StarCategory } from '@/domain/types';
import { NICOLAS } from '@/domain/seed/family';

export const STAR_CATEGORIES: { id: StarCategory; label: string; description: string }[] = [
  { id: 'autonomia', label: 'Autonomia', description: 'Cuidar das minhas coisas.' },
  { id: 'aprendizagem', label: 'Aprendizagem', description: 'Piano, leitura, xadrez, línguas.' },
  { id: 'extra', label: 'Extra', description: 'Ajudas que ninguém pediu.' },
];

export interface StarSummary {
  total: number;
  byCategory: Record<StarCategory, number>;
}

const emptyByCategory = (): Record<StarCategory, number> => ({
  autonomia: 0,
  aprendizagem: 0,
  extra: 0,
});

/**
 * §19 — estrelas so contam para as tarefas que os pais escolheram.
 * Higiene basica pode ser acompanhada sem gerar estrelas.
 */
export function summarizeStars(
  completions: Completion[],
  dates: IsoDate[],
  starTemplateIds: string[],
  memberId: MemberId = NICOLAS,
): StarSummary {
  const window = new Set(dates);
  const allowed = new Set(starTemplateIds);
  const byCategory = emptyByCategory();
  let total = 0;

  for (const completion of completions) {
    if (completion.memberId !== memberId) continue;
    if (!window.has(completion.date)) continue;
    if (!allowed.has(completion.templateId)) continue;
    const points = completion.points || 1;
    total += points;
    const category: StarCategory = completion.starCategory ?? 'autonomia';
    byCategory[category] += points;
  }

  return { total, byCategory };
}

export function starMessage(total: number): string {
  if (total === 0) return 'A semana está a começar.';
  if (total < 5) return 'Bom começo!';
  if (total < 12) return 'Estás a cuidar bem das tuas coisas.';
  return 'Que semana incrível!';
}
