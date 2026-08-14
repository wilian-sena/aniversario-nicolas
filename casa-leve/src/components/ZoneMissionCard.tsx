'use client';

import { Check } from 'lucide-react';
import type { ZoneMission } from '@/domain/types';
import { cn } from '@/lib/cn';

export function ZoneMissionCard({
  mission,
  picked,
  completed,
  disabled,
  onToggle,
}: {
  mission: ZoneMission;
  picked: boolean;
  completed: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled && !picked}
        aria-pressed={picked}
        className={cn(
          'tap flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-colors',
          picked ? 'border-lavanda/40 bg-lavanda-soft' : 'border-linha bg-white hover:bg-navy-50/40',
          disabled && !picked && 'opacity-40',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
            picked ? 'border-transparent bg-lavanda text-white' : 'border-navy-200',
          )}
        >
          {picked ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
        </span>
        <span className={cn('flex-1 text-[15px]', completed ? 'text-navy-400 line-through' : 'font-medium')}>
          {mission.title}
        </span>
        {completed ? <span className="text-xs font-semibold text-nicolas-strong">Feita</span> : null}
      </button>
    </li>
  );
}
