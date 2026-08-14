'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/AppShell';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { NotificationSettings } from '@/components/NotificationSettings';
import { ACTIVITIES, FAMILY, NICOLAS } from '@/domain/seed/family';
import { TASK_TEMPLATES } from '@/domain/seed/tasks';
import { ZONES } from '@/domain/seed/zones';
import { WEEKDAY_LONG } from '@/lib/date';
import { memberTheme } from '@/lib/members';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';

const TIMERS = [
  { key: 'zoneTimerMinutes', label: 'Zona (terça)', min: 5, max: 30 },
  { key: 'blessingTimerMinutes', label: 'Bênção semanal', min: 10, max: 45 },
  { key: 'resetTimerMinutes', label: 'Reset da noite', min: 5, max: 20 },
  { key: 'quickResetMinutes', label: 'Reset rápido (sábado)', min: 5, max: 20 },
  { key: 'planningMinutes', label: 'Planeamento (domingo)', min: 5, max: 30 },
] as const;

export default function SettingsPage() {
  const { snapshot, updateSettings, resetAll } = useApp();
  const { settings } = snapshot;
  const [confirming, setConfirming] = useState(false);

  const nicolasTasks = TASK_TEMPLATES.filter((t) => t.memberId === NICOLAS);

  return (
    <div className="space-y-6">
      <PageHeader title="Configurações" subtitle="Ajusta o que não encaixar." backHref="/familia" />

      <section aria-labelledby="timers-titulo">
        <SectionTitle>
          <span id="timers-titulo">Durações</span>
        </SectionTitle>
        <Card className="space-y-4">
          {TIMERS.map((timer) => (
            <label key={timer.key} className="block">
              <span className="flex items-baseline justify-between">
                <span className="text-[15px] font-medium">{timer.label}</span>
                <span className="text-sm tabular-nums text-navy-500">
                  {settings[timer.key]} min
                </span>
              </span>
              <input
                type="range"
                min={timer.min}
                max={timer.max}
                step={5}
                value={settings[timer.key]}
                onChange={(event) => updateSettings({ [timer.key]: Number(event.target.value) })}
                className="mt-2 w-full accent-navy-800"
              />
            </label>
          ))}
        </Card>
      </section>

      <section aria-labelledby="estrelas-config">
        <SectionTitle>
          <span id="estrelas-config">Tarefas que dão estrelas</span>
        </SectionTitle>
        <p className="mb-2 px-1 text-sm text-navy-500">
          Os pais decidem. A higiene básica pode ser acompanhada sem dar estrelas.
        </p>
        <ul className="space-y-2">
          {nicolasTasks.map((task) => {
            const active = settings.starTemplateIds.includes(task.id);
            return (
              <li key={task.id}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={active}
                  onClick={() =>
                    updateSettings({
                      starTemplateIds: active
                        ? settings.starTemplateIds.filter((id) => id !== task.id)
                        : [...settings.starTemplateIds, task.id],
                    })
                  }
                  className={cn(
                    'tap flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left',
                    active ? 'border-nicolas/40 bg-nicolas-soft' : 'border-linha bg-white',
                  )}
                >
                  <span aria-hidden="true" className={active ? 'text-sol' : 'text-navy-300'}>
                    ★
                  </span>
                  <span className="flex-1 text-[15px] font-medium">{task.title}</span>
                  <span className="text-xs text-navy-500">{active ? 'Dá estrela' : 'Só rotina'}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <NotificationSettings />

      <section aria-labelledby="som-titulo">
        <SectionTitle>
          <span id="som-titulo">Som</span>
        </SectionTitle>
        <Card>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(event) => updateSettings({ soundEnabled: event.target.checked })}
              className="h-5 w-5 accent-navy-800"
            />
            <span className="text-[15px]">Som suave quando um temporizador termina</span>
          </label>
        </Card>
      </section>

      <section aria-labelledby="rotacao-titulo">
        <SectionTitle>
          <span id="rotacao-titulo">Rotação das zonas</span>
        </SectionTitle>
        <Card>
          <label className="block">
            <span className="text-[15px] font-medium">Semana de referência (Zona 1)</span>
            <input
              type="date"
              value={settings.zoneAnchor}
              onChange={(event) => updateSettings({ zoneAnchor: event.target.value })}
              className="mt-2 w-full rounded-2xl border border-linha px-3 py-2.5 text-[15px]"
            />
          </label>
          <p className="mt-2 text-sm text-navy-500">
            A partir desta semana, o ciclo avança uma zona por semana e volta à Zona 1 depois da
            Zona {ZONES.length}.
          </p>
          <label className="mt-4 block">
            <span className="text-[15px] font-medium">Bênção nessa semana</span>
            <select
              value={settings.blessingAnchorWeek}
              onChange={(event) =>
                updateSettings({ blessingAnchorWeek: event.target.value === 'B' ? 'B' : 'A' })
              }
              className="mt-2 w-full rounded-2xl border border-linha bg-white px-3 py-2.5 text-[15px]"
            >
              <option value="A">Semana A</option>
              <option value="B">Semana B</option>
            </select>
          </label>
        </Card>
      </section>

      <section aria-labelledby="agenda-titulo">
        <SectionTitle>
          <span id="agenda-titulo">Horários e atividades</span>
        </SectionTitle>
        <Card>
          <ul className="space-y-2 text-[15px]">
            {FAMILY.filter((m) => m.work).map((member) => {
              const theme = memberTheme(member.id);
              return (
                <li key={member.id} className="flex items-center gap-2">
                  <span aria-hidden="true" className={cn('h-2 w-2 rounded-full', theme.dot)} />
                  {member.name}: {member.work?.label} {member.work?.start}–{member.work?.end}
                </li>
              );
            })}
            {ACTIVITIES.filter((a) => a.external).map((activity) => (
              <li key={activity.id} className="flex items-center gap-2">
                <span aria-hidden="true">{activity.icon}</span>
                {activity.title} · {WEEKDAY_LONG[activity.day]} {activity.start}–{activity.end}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-navy-500">
            Estes horários vêm do seed da família. Para alterar de forma permanente, edita
            <code className="mx-1 rounded bg-navy-50 px-1 py-0.5 text-xs">src/domain/seed/family.ts</code>
            — a sincronização entre telemóveis fica para a versão com Supabase.
          </p>
        </Card>
      </section>

      <section aria-labelledby="dados-titulo">
        <SectionTitle>
          <span id="dados-titulo">Dados</span>
        </SectionTitle>
        <Card>
          <p className="text-sm text-navy-600">
            Tudo fica guardado neste telemóvel (IndexedDB) e funciona sem internet.
          </p>
          <Button variant="outline" className="mt-3 w-full" onClick={() => setConfirming(true)}>
            Recomeçar do zero
          </Button>
        </Card>
      </section>

      <ConfirmDialog
        open={confirming}
        title="Apagar tudo?"
        description="As conclusões, hotspots, roupa e refeições guardadas são apagadas. A configuração da família volta ao início."
        confirmLabel="Apagar"
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          void resetAll();
          setConfirming(false);
        }}
      />
    </div>
  );
}
