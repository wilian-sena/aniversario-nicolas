'use client';

import { PageHeader } from '@/components/AppShell';
import { Card, SectionTitle } from '@/components/ui/Card';
import { TaskChecklist } from '@/components/TaskChecklist';
import { EmptyState } from '@/components/ui/EmptyState';
import { NicolasStars } from '@/components/NicolasStars';
import { FAMILY } from '@/domain/seed/family';
import { weekDates } from '@/lib/date';
import { memberTheme } from '@/lib/members';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';
import { useToday } from '@/store/selectors';

/** §18 — perfil individual: responsabilidades, hoje e a semana, sem ranking. */
export function MemberDetail({ memberId }: { memberId: string }) {
  const { toggleTask, snapshot, today } = useApp();
  const day = useToday();
  const member = FAMILY.find((m) => m.id === memberId);

  if (!member) {
    return (
      <div className="space-y-5">
        <PageHeader title="Perfil" backHref="/familia" />
        <EmptyState message="Este perfil não existe." />
      </div>
    );
  }

  const theme = memberTheme(member.id);
  const tasks = day.tasks.filter((t) => t.memberId === member.id);
  const pending = tasks.filter((t) => !t.completed);
  const done = tasks.filter((t) => t.completed);

  const week = weekDates(today);
  const weekCompletions = snapshot.completions.filter(
    (c) => c.memberId === member.id && week.includes(c.date),
  );
  const activeDays = new Set(weekCompletions.map((c) => c.date)).size;

  return (
    <div className="space-y-6">
      <PageHeader title={member.name} subtitle={member.work?.label} backHref="/familia" />

      <Card className={cn(theme.soft, theme.border)}>
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn('flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold', theme.solid)}
          >
            {member.name.charAt(0)}
          </span>
          <div>
            <p className={cn('text-lg font-semibold', theme.text)}>{member.name}</p>
            <p className="text-sm text-navy-600">
              {member.work
                ? `${member.work.label} · ${member.work.start}–${member.work.end}`
                : 'Escola 09:00–17:00'}
            </p>
          </div>
        </div>
        {member.work?.homeOffice ? (
          <p className="mt-3 text-sm text-navy-600">
            Home office não é tempo disponível para a casa. Durante o expediente só há microações de
            2 a 5 minutos, e são sempre opcionais.
          </p>
        ) : null}
      </Card>

      <section aria-labelledby="hoje-membro">
        <SectionTitle
          action={<span className="text-xs text-navy-400">{done.length} de {tasks.length}</span>}
        >
          <span id="hoje-membro">Hoje</span>
        </SectionTitle>
        <TaskChecklist
          tasks={pending}
          onToggle={toggleTask}
          emptyMessage={`Nada pendente para ${member.name}. Aproveita.`}
        />
      </section>

      {done.length > 0 ? (
        <section aria-labelledby="feito-membro">
          <SectionTitle>
            <span id="feito-membro">Já feito</span>
          </SectionTitle>
          <TaskChecklist tasks={done} onToggle={toggleTask} />
        </section>
      ) : null}

      <section aria-labelledby="semana-membro">
        <SectionTitle>
          <span id="semana-membro">Esta semana</span>
        </SectionTitle>
        <div className="grid grid-cols-2 gap-2">
          <Card>
            <p className="text-2xl font-semibold">{weekCompletions.length}</p>
            <p className="text-sm text-navy-500">tarefas concluídas</p>
          </Card>
          <Card>
            <p className="text-2xl font-semibold">{activeDays}</p>
            <p className="text-sm text-navy-500">dias com participação</p>
          </Card>
        </div>
        <p className="mt-2 px-1 text-xs text-navy-500">
          Estes números são só para a própria pessoa. Não há comparações nem rankings.
        </p>
      </section>

      {member.isChild ? (
        <section aria-labelledby="estrelas-membro">
          <SectionTitle>
            <span id="estrelas-membro">Estrelas</span>
          </SectionTitle>
          <NicolasStars />
        </section>
      ) : null}

      <section aria-labelledby="resp-membro">
        <SectionTitle>
          <span id="resp-membro">Responsabilidades</span>
        </SectionTitle>
        <Card>
          <ul className="space-y-1.5 text-[15px] text-navy-700">
            {member.responsibilities.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span aria-hidden="true" className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', theme.dot)} />
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
