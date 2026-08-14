'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Coffee, Flame, Shirt, UtensilsCrossed } from 'lucide-react';
import type { ResolvedTask, TaskType } from '@/domain/types';
import { Card, SectionTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { TaskChecklist } from '@/components/TaskChecklist';
import { EssentialMode } from '@/components/EssentialMode';
import { FAMILY } from '@/domain/seed/family';
import { getKitchenDuty } from '@/domain/schedule';
import { memberName } from '@/lib/members';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';
import { useToday } from '@/store/selectors';

const GROUPS: { id: TaskType; title: string; hint?: string }[] = [
  { id: 'morning', title: 'Rotina da manhã' },
  { id: 'micro', title: 'Microações do home office', hint: '2 a 5 minutos, e só se der.' },
  { id: 'evening', title: 'Fim de tarde' },
  { id: 'kitchen', title: 'Cozinha', hint: 'Preparar o jantar e deixar amanhã encaminhado.' },
  { id: 'zone', title: 'Zona da semana' },
  { id: 'blessing', title: 'Bênção semanal' },
  { id: 'reset', title: 'Reset da noite' },
  { id: 'planning', title: 'Planeamento da semana' },
];

export default function TasksPage() {
  const { toggleTask } = useApp();
  const day = useToday();
  const [filter, setFilter] = useState<string>('todos');

  const filtered =
    filter === 'todos' ? day.visible : day.visible.filter((task) => task.memberId === filter);

  const duty = getKitchenDuty(day.plan.dayOfWeek);
  const grouped = GROUPS.map((group) => ({
    ...group,
    hint:
      group.id === 'reset'
        ? `${memberName(duty.cookId)} cozinha · ${memberName(duty.closerId)} fecha a cozinha. ${duty.reason}`
        : group.hint,
    tasks: filtered.filter((task: ResolvedTask) => task.type === group.id),
  })).filter((group) => group.tasks.length > 0);

  return (
    <div className="space-y-6">
      <header>
        <p className="section-title">Tarefas</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight">O dia inteiro numa lista</h1>
        <p className="mt-1 text-sm text-navy-500">
          {day.flags.essentialMode
            ? `${day.progress.essentialDone} de ${day.progress.essentialTotal} essenciais`
            : `${day.progress.done} de ${day.progress.total} feitas · ${day.progress.essentialDone} de ${day.progress.essentialTotal} essenciais`}
        </p>
      </header>

      <div role="tablist" aria-label="Filtrar por pessoa" className="flex gap-2 overflow-x-auto pb-1">
        {[{ id: 'todos', name: 'Todos' }, ...FAMILY].map((option) => {
          const active = filter === option.id;
          return (
            <button
              key={option.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(option.id)}
              className={cn(
                'tap shrink-0 rounded-pill border px-4 py-2 text-sm font-semibold transition-colors',
                active
                  ? 'border-transparent bg-navy-900 text-white'
                  : 'border-linha bg-white text-navy-600 hover:bg-navy-50',
              )}
            >
              {option.name}
            </button>
          );
        })}
      </div>

      <EssentialMode date={day.date} enabled={day.flags.essentialMode} />

      {grouped.length === 0 ? (
        <EmptyState
          message="Nada importante agora. Aproveita."
          hint="Se aparecer alguma coisa, ela volta amanhã sem drama."
        />
      ) : (
        grouped.map((group) => (
          <section key={group.id} aria-labelledby={`grupo-${group.id}`}>
            <SectionTitle>
              <span id={`grupo-${group.id}`}>{group.title}</span>
            </SectionTitle>
            {group.hint ? <p className="mb-2 px-1 text-sm text-navy-500">{group.hint}</p> : null}
            <TaskChecklist tasks={group.tasks} onToggle={toggleTask} showMember={filter === 'todos'} />
          </section>
        ))
      )}

      <section aria-labelledby="mais-titulo">
        <SectionTitle>
          <span id="mais-titulo">Também da casa</span>
        </SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <ShortcutCard href="/roupa" Icon={Shirt} title="Roupa" hint="Cargas da semana" />
          <ShortcutCard href="/refeicoes" Icon={UtensilsCrossed} title="Refeições" hint="Jantar previsto" />
          <ShortcutCard href="/hotspots" Icon={Flame} title="Hotspots" hint="Sítios que acumulam" />
          <ShortcutCard href="/reset" Icon={Coffee} title="Reset" hint="Fechar o dia" />
        </div>
      </section>
    </div>
  );
}

function ShortcutCard({
  href,
  Icon,
  title,
  hint,
}: {
  href: string;
  Icon: typeof Shirt;
  title: string;
  hint: string;
}) {
  return (
    <Card className="p-0">
      <Link
        href={href}
        className="flex h-full flex-col gap-1 rounded-card p-4 transition-colors hover:bg-navy-50/50"
      >
        <Icon className="h-5 w-5 text-navy-400" aria-hidden="true" />
        <span className="text-[15px] font-semibold">{title}</span>
        <span className="text-sm text-navy-500">{hint}</span>
      </Link>
    </Card>
  );
}
