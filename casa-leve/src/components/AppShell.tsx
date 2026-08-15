'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Onboarding } from '@/components/Onboarding';
import { useApp } from '@/store/AppState';
import { useReminders } from '@/store/useReminders';

export function AppShell({ children }: { children: ReactNode }) {
  const { ready, snapshot } = useApp();
  useReminders();

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center px-6 text-navy-500" role="status">
        A abrir a casa…
      </div>
    );
  }

  if (!snapshot.settings.onboarded) return <Onboarding />;

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-pill focus:bg-navy-900 focus:px-4 focus:py-2 focus:text-white"
      >
        Saltar para o conteúdo
      </a>
      <main id="conteudo" className="mx-auto min-h-dvh w-full max-w-3xl px-4 pb-28 pt-5">
        {children}
      </main>
      <BottomNavigation />
    </>
  );
}

/** Cabecalho das paginas secundarias, com regresso claro. */
export function PageHeader({
  title,
  subtitle,
  backHref = '/',
  action,
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-5 flex items-start gap-2">
      <Link
        href={backHref}
        aria-label="Voltar"
        className="tap -ml-2 flex items-center justify-center rounded-full text-navy-500 hover:bg-navy-50 hover:text-navy-800"
      >
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </Link>
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-semibold leading-tight">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-navy-500">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}
