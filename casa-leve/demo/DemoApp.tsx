'use client';

import { AppProvider } from '@/store/AppState';
import { AppShell } from '@/components/AppShell';
import { MemberDetail } from '@/components/MemberDetail';
import { EmptyState } from '@/components/ui/EmptyState';
import TodayPage from '@/app/page';
import WeekPage from '@/app/semana/page';
import ZonesPage from '@/app/zonas/page';
import TasksPage from '@/app/tarefas/page';
import FamilyPage from '@/app/familia/page';
import ResetPage from '@/app/reset/page';
import BlessingPage from '@/app/bencao/page';
import LaundryPage from '@/app/roupa/page';
import MealsPage from '@/app/refeicoes/page';
import HotspotsPage from '@/app/hotspots/page';
import SettingsPage from '@/app/configuracoes/page';
import { DemoRouter, useDemoRouter } from './router';

const ROUTES: Record<string, () => React.ReactElement> = {
  '/': TodayPage,
  '/semana': WeekPage,
  '/zonas': ZonesPage,
  '/tarefas': TasksPage,
  '/familia': FamilyPage,
  '/reset': ResetPage,
  '/bencao': BlessingPage,
  '/roupa': LaundryPage,
  '/refeicoes': MealsPage,
  '/hotspots': HotspotsPage,
  '/configuracoes': SettingsPage,
};

function Screen() {
  const { path } = useDemoRouter();
  const clean = path.length > 1 ? path.replace(/\/$/, '') : path;

  const member = clean.match(/^\/familia\/(.+)$/);
  if (member) return <MemberDetail memberId={member[1]} />;

  const Page = ROUTES[clean];
  if (!Page) return <EmptyState message="Esta página não existe." />;
  return <Page />;
}

/** A aplicação real, numa página só, para poder ser vista em qualquer lado. */
export function DemoApp() {
  return (
    <DemoRouter>
      <AppProvider>
        <AppShell>
          <Screen />
        </AppShell>
      </AppProvider>
    </DemoRouter>
  );
}
