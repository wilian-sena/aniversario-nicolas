'use client';

import { PageHeader } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { MealPlanner } from '@/components/MealPlanner';
import { weekDates } from '@/lib/date';
import { useApp } from '@/store/AppState';

export default function MealsPage() {
  const { today } = useApp();

  return (
    <div className="space-y-5">
      <PageHeader
        title="Refeições"
        subtitle="Só o suficiente para não pensar duas vezes."
        backHref="/semana"
      />
      <MealPlanner dates={weekDates(today)} today={today} />
      <Card className="bg-navy-50/60">
        <p className="text-sm text-navy-600">
          Terça e quinta cozinha-se a dobrar. Quarta e sexta é só reaquecer e finalizar.
        </p>
      </Card>
    </div>
  );
}
