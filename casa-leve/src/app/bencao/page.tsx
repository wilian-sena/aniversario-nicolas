'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/AppShell';
import { Card, Pill } from '@/components/ui/Card';
import { Timer } from '@/components/Timer';
import { TaskChecklist } from '@/components/TaskChecklist';
import { getBlessingTasks, getBlessingWeek } from '@/domain/blessing';
import { FAMILY } from '@/domain/seed/family';
import { memberTheme } from '@/lib/members';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';
import { useToday } from '@/store/selectors';

/** §12 — bencao semanal de quinta-feira, 25 minutos, todos ao mesmo tempo. */
export default function BlessingPage() {
  const router = useRouter();
  const { snapshot, toggleTask } = useApp();
  const day = useToday();

  const week = getBlessingWeek(day.date, snapshot.settings);
  const tasks = day.tasks.filter((t) => t.type === 'blessing');
  const isThursday = day.plan.dayOfWeek === 4;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Bênção semanal"
        subtitle={`${snapshot.settings.blessingTimerMinutes} minutos, todos ao mesmo tempo.`}
        action={<Pill tone="info">Semana {week}</Pill>}
      />

      {isThursday ? (
        <Card className="py-6">
          <Timer
            minutes={snapshot.settings.blessingTimerMinutes}
            startLabel={`Começar — ${snapshot.settings.blessingTimerMinutes} min`}
            doneMessage="Acabou. A casa agradece."
            doneAction={{ label: 'Concluir por hoje', onClick: () => router.push('/') }}
          />
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-navy-600">
            A bênção é à quinta-feira. Esta é a divisão de tarefas da semana {week}.
          </p>
        </Card>
      )}

      {FAMILY.map((member) => {
        const memberTasks = tasks.filter((t) => t.memberId === member.id);
        const theme = memberTheme(member.id);
        if (memberTasks.length === 0) return null;
        return (
          <section key={member.id} aria-label={`Bênção de ${member.name}`}>
            <h2 className={cn('mb-2 px-1 text-sm font-semibold', theme.text)}>{member.name}</h2>
            <TaskChecklist tasks={memberTasks} onToggle={toggleTask} />
          </section>
        );
      })}

      {tasks.length === 0 ? <BlessingPreview /> : null}

      <p className="px-1 text-center text-xs text-navy-500">
        Os adultos trocam de tarefas a cada semana. As do Nicolas mantêm-se.
      </p>
    </div>
  );
}

function BlessingPreview() {
  const { snapshot } = useApp();
  const day = useToday();
  const week = getBlessingWeek(day.date, snapshot.settings);
  const tasks = getBlessingTasks(week);

  return (
    <div className="space-y-4">
      {FAMILY.map((member) => {
        const memberTasks = tasks.filter((t) => t.memberId === member.id);
        if (memberTasks.length === 0) return null;
        const theme = memberTheme(member.id);
        return (
          <section key={member.id}>
            <h2 className={cn('mb-2 px-1 text-sm font-semibold', theme.text)}>{member.name}</h2>
            <ul className="space-y-2">
              {memberTasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-2xl border border-linha bg-white px-3 py-3 text-[15px]"
                >
                  {task.title}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
