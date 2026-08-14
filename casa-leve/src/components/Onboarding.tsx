'use client';

import { Button } from '@/components/ui/Button';
import { FAMILY } from '@/domain/seed/family';
import { memberTheme } from '@/lib/members';
import { useApp } from '@/store/AppState';
import { cn } from '@/lib/cn';

/** §30 — sem onboarding longo: a casa ja vem configurada. */
export function Onboarding() {
  const { updateSettings } = useApp();

  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-between px-6 py-12">
      <div className="flex flex-1 flex-col justify-center">
        <p className="section-title">Casa Leve</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight">A casa está pronta.</h1>
        <p className="mt-2 text-4xl font-semibold leading-tight text-navy-400">Vamos começar.</p>

        <ul className="mt-10 flex gap-3">
          {FAMILY.map((member) => {
            const theme = memberTheme(member.id);
            return (
              <li
                key={member.id}
                className={cn('flex-1 rounded-card border p-3 text-center', theme.soft, theme.border)}
              >
                <span className={cn('block text-sm font-semibold', theme.text)}>{member.name}</span>
              </li>
            );
          })}
        </ul>

        <p className="mt-8 text-[15px] leading-relaxed text-navy-600">
          Constância é mais importante que perfeição.
        </p>
      </div>

      <Button size="lg" className="w-full" onClick={() => updateSettings({ onboarded: true })}>
        Entrar
      </Button>
    </main>
  );
}
