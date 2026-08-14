'use client';

import { Check, Star } from 'lucide-react';
import type { ResolvedTask } from '@/domain/types';
import { cn } from '@/lib/cn';
import { memberTheme } from '@/lib/members';

/** §27 — estados compreensiveis, sem percentagens. */
function priorityMark(task: ResolvedTask) {
  if (task.isEssential) return { symbol: '⚠', label: 'Essencial', className: 'text-ana-strong' };
  if (task.priority === 'optional') return { symbol: '○', label: 'Opcional', className: 'text-navy-400' };
  return null;
}

export function TaskCard({
  task,
  onToggle,
  showMember = false,
  memberName,
}: {
  task: ResolvedTask;
  onToggle: (task: ResolvedTask) => void;
  showMember?: boolean;
  memberName?: string;
}) {
  const theme = memberTheme(task.memberId);
  const mark = priorityMark(task);

  return (
    <li>
      <button
        type="button"
        onClick={() => onToggle(task)}
        aria-pressed={task.completed}
        className={cn(
          'tap flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors',
          task.completed ? 'border-transparent bg-navy-50/60' : 'border-linha bg-white hover:bg-navy-50/40',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            task.completed ? cn(theme.solid, 'border-transparent') : 'border-navy-200 bg-white',
          )}
        >
          {task.completed ? <Check className="h-4 w-4 animate-pop" strokeWidth={3} /> : null}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              'block text-[15px] font-medium leading-snug',
              task.completed ? 'text-navy-400 line-through' : 'text-navy-900',
            )}
          >
            {task.title}
          </span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-navy-500">
            {showMember && memberName ? <span className={theme.text}>{memberName}</span> : null}
            {task.duration ? <span>{task.duration} min</span> : null}
            {mark ? (
              <span className={mark.className}>
                {mark.symbol} {mark.label}
              </span>
            ) : null}
            {task.description ? <span className="truncate">{task.description}</span> : null}
          </span>
        </span>

        {task.points ? (
          <span className="flex items-center gap-1 text-xs font-semibold text-sol">
            <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
            <span className="sr-only">Vale</span>
            {task.points}
          </span>
        ) : null}
      </button>
    </li>
  );
}
