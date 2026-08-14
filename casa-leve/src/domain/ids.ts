import type { IsoDate } from '@/domain/types';

/** Identificador estavel de uma tarefa num dia concreto. */
export function instanceId(templateId: string, date: IsoDate): string {
  return `${templateId}@${date}`;
}

/** As missoes de zona viram tarefas com este prefixo. */
export function zoneMissionTaskId(missionId: string): string {
  return `zm-${missionId}`;
}
