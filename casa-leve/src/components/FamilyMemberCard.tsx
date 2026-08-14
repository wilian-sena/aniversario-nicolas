'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { FamilyMember, ResolvedTask } from '@/domain/types';
import { focusList, type Phase } from '@/domain/focus';
import { TaskChecklist } from '@/components/TaskChecklist';
import { memberTheme } from '@/lib/members';
import { cn } from '@/lib/cn';

/**
 * Cartao "quem faz o que hoje": mostra apenas o que interessa agora,
 * nunca a lista inteira do dia (§15, §40). Sem comparacoes entre adultos (§18).
 */
export function FamilyMemberCard({
  member,
  tasks,
  phase,
  onToggle,
  href,
  emptyMessage,
  limit = 4,
}: {
  member: FamilyMember;
  tasks: ResolvedTask[];
  phase: Phase;
  onToggle: (task: ResolvedTask) => void;
  href?: string;
  emptyMessage?: string;
  limit?: number;
}) {
  const theme = memberTheme(member.id);
  const counted = tasks.filter((t) => t.priority !== 'optional');
  const done = counted.filter((t) => t.completed).length;
  const { visible, hidden, pending, total } = focusList(tasks, phase, limit);
  const acabou = total > 0 && pending === 0;

  return (
    <article className={cn('rounded-card border bg-white p-4', theme.border)}>
      <div className="mb-3 flex items-center gap-3">
        <span
          aria-hidden="true"
          className={cn('flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold', theme.solid)}
        >
          {member.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={cn('text-base font-semibold leading-tight', theme.text)}>{member.name}</h3>
          <p className="text-xs text-navy-500">
            {counted.length === 0 ? 'Sem tarefas hoje' : `${done} de ${counted.length} feitas`}
          </p>
        </div>
        {href ? (
          <Link
            href={href}
            className="tap flex items-center justify-center rounded-full text-navy-400 hover:bg-navy-50 hover:text-navy-700"
            aria-label={`Abrir perfil de ${member.name}`}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        ) : null}
      </div>

      {acabou ? (
        <p className={cn('mb-2 rounded-2xl px-3 py-2 text-[15px] font-medium', theme.soft, theme.text)}>
          {member.name} já tratou de tudo. ✓
        </p>
      ) : null}

      <TaskChecklist
        tasks={visible}
        onToggle={onToggle}
        emptyMessage={emptyMessage ?? `Hoje ${member.name} não tem nada.`}
      />

      {hidden > 0 ? (
        <Link
          href="/tarefas"
          className="mt-2 block px-1 text-sm font-medium text-navy-500 underline underline-offset-2"
        >
          Mais {hidden} {hidden === 1 ? 'tarefa' : 'tarefas'} hoje
        </Link>
      ) : null}
    </article>
  );
}
