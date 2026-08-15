'use client';

import Link from 'next/link';
import { ChevronRight, Settings } from 'lucide-react';
import { Card, SectionTitle } from '@/components/ui/Card';
import { NicolasStars } from '@/components/NicolasStars';
import { FAMILY } from '@/domain/seed/family';
import { memberTheme } from '@/lib/members';
import { cn } from '@/lib/cn';
import { useToday } from '@/store/selectors';

export default function FamilyPage() {
  const day = useToday();

  return (
    <div className="space-y-6">
      <header>
        <p className="section-title">Família</p>
        <h1 className="mt-2 text-2xl font-semibold leading-tight">Três pessoas, uma casa</h1>
        <p className="mt-1 text-sm text-navy-500">
          Cada perfil mostra o que essa pessoa tem hoje — sem comparações entre adultos.
        </p>
      </header>

      <ul className="space-y-3">
        {FAMILY.map((member) => {
          const theme = memberTheme(member.id);
          const tasks = day.tasks.filter(
            (t) => t.memberId === member.id && t.priority !== 'optional',
          );
          const done = tasks.filter((t) => t.completed).length;

          return (
            <li key={member.id}>
              <Link
                href={`/familia/${member.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-card border p-4 transition-colors hover:bg-navy-50/40',
                  theme.border,
                  'bg-white',
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-11 w-11 items-center justify-center rounded-full text-base font-bold',
                    theme.solid,
                  )}
                >
                  {member.name.charAt(0)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={cn('block text-base font-semibold', theme.text)}>{member.name}</span>
                  <span className="block text-sm text-navy-500">
                    {tasks.length === 0 ? 'Hoje sem tarefas' : `${done} de ${tasks.length} feitas hoje`}
                  </span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-navy-300" aria-hidden="true" />
              </Link>
            </li>
          );
        })}
      </ul>

      <section aria-labelledby="estrelas-titulo">
        <SectionTitle>
          <span id="estrelas-titulo">Estrelas do Nicolas</span>
        </SectionTitle>
        <NicolasStars />
      </section>

      <Card className="p-0">
        <Link
          href="/configuracoes"
          className="flex items-center gap-3 rounded-card p-4 transition-colors hover:bg-navy-50/50"
        >
          <Settings className="h-5 w-5 text-navy-400" aria-hidden="true" />
          <span className="flex-1 text-[15px] font-semibold">Configurações</span>
          <ChevronRight className="h-5 w-5 text-navy-300" aria-hidden="true" />
        </Link>
      </Card>
    </div>
  );
}
