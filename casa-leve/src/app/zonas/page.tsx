'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Pill, SectionTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Timer } from '@/components/Timer';
import { TaskChecklist } from '@/components/TaskChecklist';
import { ZoneMissionCard } from '@/components/ZoneMissionCard';
import { ZONES } from '@/domain/seed/zones';
import { MAX_WEEKLY_MISSIONS, getNextZone, toggleMissionPick, zoneProgressLabel } from '@/domain/zones';
import { instanceId } from '@/domain/schedule';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';
import { useToday } from '@/store/selectors';

export default function ZonesPage() {
  const router = useRouter();
  const { snapshot, setZonePicks, toggleTask, completionsById } = useApp();
  const day = useToday();
  const [showTimer, setShowTimer] = useState(false);

  const zone = day.zone;
  const picked = day.missionIds;
  const nextZone = getNextZone(day.date, snapshot.settings.zoneAnchor);
  const zoneTasks = day.tasks.filter((t) => t.type === 'zone');
  const doneCount = picked.filter((id) => completionsById.has(instanceId(`zm-${id}`, day.date))).length;

  return (
    <div className="space-y-6">
      <header className="mb-1">
        <p className="section-title">Zona desta semana</p>
        <h1 className="mt-2 flex items-center gap-2 text-2xl font-semibold leading-tight">
          <span aria-hidden="true">{zone.icon}</span> Zona {zone.id}
        </h1>
        <p className="mt-1 text-[15px] text-navy-600">{zone.name}</p>
      </header>

      <Card className="bg-lavanda-soft/60">
        <p className="text-[15px] leading-relaxed text-navy-700">
          Hoje não estamos a limpar esta divisão inteira. Estamos apenas a melhorar um pequeno
          pedaço dela.
        </p>
      </Card>

      <section aria-labelledby="missoes-titulo">
        <SectionTitle action={<Pill tone="info">{picked.length}/{MAX_WEEKLY_MISSIONS}</Pill>}>
          <span id="missoes-titulo">Missões da semana</span>
        </SectionTitle>
        <p className="mb-2 px-1 text-sm text-navy-500">{zoneProgressLabel(picked, doneCount)}</p>
        <ul className="space-y-2">
          {zone.missions.map((mission) => (
            <ZoneMissionCard
              key={mission.id}
              mission={mission}
              picked={picked.includes(mission.id)}
              completed={completionsById.has(instanceId(`zm-${mission.id}`, day.date))}
              disabled={picked.length >= MAX_WEEKLY_MISSIONS}
              onToggle={() => setZonePicks(day.weekKey, toggleMissionPick(picked, mission.id))}
            />
          ))}
        </ul>
      </section>

      {day.plan.theme === 'zone' ? (
        <section aria-labelledby="timer-titulo">
          <SectionTitle>
            <span id="timer-titulo">15 minutos de FlyLady</span>
          </SectionTitle>
          <Card className="py-6">
            {showTimer ? (
              <Timer
                minutes={snapshot.settings.zoneTimerMinutes}
                startLabel="Iniciar"
                doneMessage="Acabou. Não é preciso terminar tudo."
                doneAction={{ label: 'Concluir por hoje', onClick: () => router.push('/') }}
              />
            ) : (
              <Button
                size="lg"
                className="w-full"
                onClick={() => setShowTimer(true)}
                disabled={picked.length === 0}
              >
                Iniciar {snapshot.settings.zoneTimerMinutes} minutos
              </Button>
            )}
            {picked.length === 0 && !showTimer ? (
              <p className="mt-2 text-center text-sm text-navy-500">
                Escolhe primeiro 1 a 3 missões.
              </p>
            ) : null}
          </Card>

          {zoneTasks.length > 0 ? (
            <div className="mt-3">
              <TaskChecklist tasks={zoneTasks} onToggle={toggleTask} />
            </div>
          ) : null}
        </section>
      ) : (
        <Card>
          <p className="text-sm text-navy-600">
            As missões da zona são para terça-feira. Hoje podes só escolher quais serão.
          </p>
        </Card>
      )}

      <section aria-labelledby="ciclo-titulo">
        <SectionTitle>
          <span id="ciclo-titulo">Ciclo das zonas</span>
        </SectionTitle>
        <ul className="space-y-2">
          {ZONES.map((item) => {
            const current = item.id === zone.id;
            const next = item.id === nextZone.id;
            return (
              <li
                key={item.id}
                className={cn(
                  'flex items-center gap-3 rounded-2xl border px-3 py-3',
                  current ? 'border-navy-900/20 bg-white shadow-card' : 'border-linha bg-white/60',
                )}
              >
                <span aria-hidden="true" className="text-xl">
                  {item.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">Zona {item.id}</p>
                  <p className="truncate text-sm text-navy-500">{item.name}</p>
                </div>
                {current ? <Pill tone="info">Esta semana</Pill> : null}
                {next ? <Pill>A seguir</Pill> : null}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
