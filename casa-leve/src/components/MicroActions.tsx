'use client';

import type { ResolvedTask } from '@/domain/types';
import { cn } from '@/lib/cn';

/**
 * §9 — bloco discreto. Home office nao e disponibilidade domestica (Regra 5):
 * estas acoes sao opcionais e duram 2 a 5 minutos.
 */
export function MicroActions({
  tasks,
  onToggle,
}: {
  tasks: ResolvedTask[];
  onToggle: (task: ResolvedTask) => void;
}) {
  if (tasks.length === 0) return null;

  const groups = new Map<string, ResolvedTask[]>();
  for (const task of tasks) {
    const key = task.description ?? 'Se der';
    groups.set(key, [...(groups.get(key) ?? []), task]);
  }

  return (
    <div className="rounded-card border border-dashed border-linha bg-white/60 p-4">
      <h3 className="text-sm font-semibold text-navy-600">Se der, durante o trabalho</h3>
      <p className="mt-0.5 text-xs text-navy-500">
        Dois a cinco minutos. Nenhuma destas é obrigatória.
      </p>

      <div className="mt-3 space-y-3">
        {[...groups.entries()].map(([label, group]) => (
          <div key={label}>
            <p className="text-xs font-medium uppercase tracking-wide text-navy-400">
              {label.replace(' — escolhe só uma.', '')}
            </p>
            <ul className="mt-1.5 flex flex-wrap gap-2">
              {group.map((task) => (
                <li key={task.instanceId}>
                  <button
                    type="button"
                    onClick={() => onToggle(task)}
                    aria-pressed={task.completed}
                    className={cn(
                      'tap rounded-pill border px-3 py-2 text-sm transition-colors',
                      task.completed
                        ? 'border-transparent bg-navy-800 text-white'
                        : 'border-linha bg-white text-navy-700 hover:bg-navy-50',
                    )}
                  >
                    {task.completed ? '✓ ' : ''}
                    {task.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
