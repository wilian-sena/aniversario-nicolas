'use client';

import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { PageHeader } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Timer } from '@/components/Timer';
import { TaskChecklist } from '@/components/TaskChecklist';
import { FAMILY } from '@/domain/seed/family';
import { memberTheme } from '@/lib/members';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';
import { useToday } from '@/store/selectors';

const GOALS = ['Pia livre', 'Mesa livre', 'Chão desimpedido', 'Mochila pronta'];

/** §10 — o reset da noite: temporizador, tarefas por pessoa e fecho do dia. */
export default function ResetPage() {
  const router = useRouter();
  const { toggleTask, setDayClosed, snapshot } = useApp();
  const day = useToday();

  const resetTasks = day.visible.filter((t) => t.type === 'reset');
  const closed = day.flags.dayClosed;

  const closeDay = () => {
    setDayClosed(day.date, true);
    router.push('/');
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reset da noite" subtitle="Dez minutos, todos juntos." />

      <Card className="py-6">
        <Timer
          minutes={snapshot.settings.resetTimerMinutes}
          startLabel={`Começar reset — ${snapshot.settings.resetTimerMinutes} min`}
          doneMessage="Acabou. A casa já está melhor do que estava."
          doneAction={{ label: 'Casa fechada por hoje', onClick: closeDay }}
        />
      </Card>

      <section aria-labelledby="objetivo-titulo">
        <h2 id="objetivo-titulo" className="section-title mb-2 px-1">
          Objetivo desta noite
        </h2>
        <ul className="grid grid-cols-2 gap-2">
          {GOALS.map((goal) => (
            <li
              key={goal}
              className="rounded-2xl border border-linha bg-white px-3 py-3 text-sm font-semibold uppercase tracking-wide text-navy-700"
            >
              {goal}
            </li>
          ))}
        </ul>
      </section>

      {FAMILY.map((member) => {
        const tasks = resetTasks.filter((t) => t.memberId === member.id);
        if (tasks.length === 0) return null;
        const theme = memberTheme(member.id);
        return (
          <section key={member.id} aria-label={`Reset de ${member.name}`}>
            <h2 className={cn('mb-2 px-1 text-sm font-semibold', theme.text)}>{member.name}</h2>
            <TaskChecklist tasks={tasks} onToggle={toggleTask} />
          </section>
        );
      })}

      <Card className={cn(closed && 'border-nicolas/40 bg-nicolas-soft')}>
        {closed ? (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-nicolas-strong" aria-hidden="true" />
            <div className="flex-1">
              <p className="font-semibold text-nicolas-strong">Casa fechada por hoje ✓</p>
              <p className="text-sm text-navy-600">Nada transita para amanhã.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => setDayClosed(day.date, false)}>
              Reabrir
            </Button>
          </div>
        ) : (
          <>
            <p className="text-sm text-navy-600">
              {day.canClose
                ? 'O essencial está feito. Podes fechar o dia.'
                : 'Podes fechar o dia quando quiseres — o que ficar por fazer não passa para amanhã.'}
            </p>
            <Button size="lg" className="mt-3 w-full" onClick={closeDay}>
              Terminar o dia
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
