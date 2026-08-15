'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, Moon, Sparkles } from 'lucide-react';
import { Card, Pill, SectionTitle } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { TodayHeader } from '@/components/TodayHeader';
import { FamilyMemberCard } from '@/components/FamilyMemberCard';
import { TaskChecklist } from '@/components/TaskChecklist';
import { ZoneCard } from '@/components/ZoneCard';
import { EssentialMode } from '@/components/EssentialMode';
import { HouseNow } from '@/components/HouseNow';
import { FAMILY, SHARED } from '@/domain/seed/family';
import { getKitchenDuty } from '@/domain/schedule';
import { nightGoals } from '@/domain/dayPlan';
import { memberName } from '@/lib/members';
import { MicroActions } from '@/components/MicroActions';
import { phaseForHour, PHASE_LABEL, type Phase } from '@/domain/focus';
import { useApp } from '@/store/AppState';
import { useToday } from '@/store/selectors';

export default function TodayPage() {
  const { toggleTask, snapshot } = useApp();
  const day = useToday();
  const { plan, tasks, visible, flags, progress } = day;

  // A fase do dia so e conhecida no cliente (depende da hora).
  const [phase, setPhase] = useState<Phase>('manha');
  useEffect(() => {
    const update = () => setPhase(phaseForHour(new Date().getHours()));
    update();
    const id = window.setInterval(update, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const duty = getKitchenDuty(plan.dayOfWeek);
  const sharedTasks = visible.filter((t) => t.memberId === SHARED);
  const microTasks = visible.filter((t) => t.type === 'micro');
  const external = plan.activities.filter((a) => a.external);

  return (
    <div className="space-y-8">
      <TodayHeader date={day.date} />

      {flags.dayClosed ? (
        <Card className="border-nicolas/30 bg-nicolas-soft">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-nicolas-strong" aria-hidden="true" />
            <div>
              <p className="text-base font-semibold text-nicolas-strong">Casa fechada por hoje ✓</p>
              <p className="text-sm text-navy-600">Amanhã recomeçamos com calma.</p>
            </div>
          </div>
        </Card>
      ) : null}

      <section aria-labelledby="hoje-titulo">
        <SectionTitle>
          <span id="hoje-titulo">Hoje</span>
        </SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card>
            <h3 className="text-sm font-semibold text-navy-500">Agenda</h3>
            <ul className="mt-2 space-y-1.5 text-[15px]">
              {plan.activities.length === 0 ? (
                <li className="text-navy-500">Sem compromissos marcados.</li>
              ) : (
                plan.activities.map((activity) => (
                  <li key={activity.id} className="flex items-center gap-2">
                    <span aria-hidden="true">{activity.icon}</span>
                    <span className="font-medium">{activity.title}</span>
                    <span className="text-sm text-navy-500">
                      {activity.start}–{activity.end}
                    </span>
                  </li>
                ))
              )}
              {FAMILY.filter((m) => m.work?.days.includes(plan.dayOfWeek)).map((member) => (
                <li key={member.id} className="flex items-center gap-2 text-sm text-navy-500">
                  <span aria-hidden="true">💼</span>
                  {member.name}: {member.work?.label} {member.work?.start}–{member.work?.end}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-semibold text-navy-500">Casa</h3>
            <p className="mt-2 text-[15px] font-medium leading-snug">{plan.houseNote}</p>
            <ul className="mt-2 space-y-1 text-sm text-navy-600">
              {plan.houseFocus.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span aria-hidden="true" className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-navy-300" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <Pill tone="info">
                <span aria-hidden="true">{plan.icon}</span>
                {plan.themeLabel}
              </Pill>
              {external.length > 0 ? <Pill tone="warn">Manutenção mínima</Pill> : null}
            </div>
          </Card>
        </div>
      </section>

      <EssentialMode date={day.date} enabled={flags.essentialMode} />

      <section aria-labelledby="quem-titulo">
        <SectionTitle
          action={
            <span className="text-xs text-navy-400">
              {flags.essentialMode
                ? `${progress.essentialDone} de ${progress.essentialTotal} essenciais`
                : `${progress.done} de ${progress.total} feitas`}
            </span>
          }
        >
          <span id="quem-titulo">Quem faz o quê · {PHASE_LABEL[phase].toLowerCase()}</span>
        </SectionTitle>

        <p className="mb-3 px-1 text-sm text-navy-500">
          {duty.cookId === duty.closerId
            ? duty.reason
            : `${memberName(duty.cookId)} cozinha · ${memberName(duty.closerId)} fecha a cozinha.`}
        </p>

        <div className="space-y-3">
          {FAMILY.map((member) => (
            <FamilyMemberCard
              key={member.id}
              member={member}
              tasks={visible.filter((t) => t.memberId === member.id && t.type !== 'micro')}
              phase={phase}
              onToggle={toggleTask}
              href={`/familia/${member.id}`}
              emptyMessage={
                flags.essentialMode ? `No essencial, ${member.name} já está livre.` : undefined
              }
            />
          ))}

          {sharedTasks.length > 0 ? (
            <Card>
              <h3 className="text-base font-semibold text-lavanda">Todos</h3>
              <p className="mb-3 text-xs text-navy-500">Missões da zona desta semana.</p>
              <TaskChecklist tasks={sharedTasks} onToggle={toggleTask} />
            </Card>
          ) : null}
        </div>

        {phase === 'dia' && !flags.essentialMode ? (
          <div className="mt-3">
            <MicroActions tasks={microTasks} onToggle={toggleTask} />
          </div>
        ) : null}
      </section>

      <section aria-labelledby="zona-titulo">
        <SectionTitle>
          <span id="zona-titulo">Zona da semana</span>
        </SectionTitle>
        <ZoneCard zone={day.zone} missionIds={day.missionIds} missionsDone={day.missionsDone} />
      </section>

      {plan.theme === 'blessing' ? (
        <section aria-labelledby="bencao-titulo">
          <SectionTitle>
            <span id="bencao-titulo">Bênção semanal</span>
          </SectionTitle>
          <Card>
            <p className="text-[15px] font-medium">
              Hoje são {snapshot.settings.blessingTimerMinutes} minutos, todos ao mesmo tempo.
            </p>
            <Link
              href="/bencao"
              className="tap mt-3 flex w-full items-center justify-center gap-2 rounded-pill bg-navy-900 px-5 py-4 text-base font-semibold text-white transition-colors hover:bg-navy-800"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" /> Abrir a bênção
            </Link>
          </Card>
        </section>
      ) : null}

      <section aria-labelledby="reset-titulo">
        <SectionTitle>
          <span id="reset-titulo">Reset da noite</span>
        </SectionTitle>
        <Link
          href="/reset"
          className="tap flex w-full items-center justify-center gap-2 rounded-card bg-navy-900 px-5 py-5 text-base font-semibold text-white transition-colors hover:bg-navy-800"
        >
          <Moon className="h-5 w-5" aria-hidden="true" />
          Começar reset — {snapshot.settings.resetTimerMinutes} min
        </Link>
        <p className="mt-2 px-1 text-center text-xs text-navy-500">
          <Clock className="mr-1 inline h-3 w-3" aria-hidden="true" />
          {nightGoals(plan.dayOfWeek).join(' · ')}
        </p>
      </section>

      <section aria-labelledby="casa-titulo">
        <SectionTitle>
          <span id="casa-titulo">Casa agora</span>
        </SectionTitle>
        <HouseNow tasks={tasks} weekKey={day.weekKey} />
      </section>

      {progress.total === 0 ? <EmptyState message="Hoje é dia de família." /> : null}
    </div>
  );
}
