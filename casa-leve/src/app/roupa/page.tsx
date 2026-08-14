'use client';

import { PageHeader } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { LaundryTracker } from '@/components/LaundryTracker';
import { weekKey } from '@/lib/date';
import { useApp } from '@/store/AppState';

export default function LaundryPage() {
  const { today } = useApp();

  return (
    <div className="space-y-5">
      <PageHeader title="Roupa" subtitle="Três cargas por semana, um passo de cada vez." backHref="/semana" />
      <LaundryTracker weekKey={weekKey(today)} />
      <Card className="bg-navy-50/60">
        <p className="text-sm text-navy-600">
          Cada pessoa guarda a sua roupa sempre que possível. A roupa dobrada não fica à espera na
          cadeira.
        </p>
      </Card>
    </div>
  );
}
