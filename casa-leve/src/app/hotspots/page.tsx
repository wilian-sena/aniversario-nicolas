'use client';

import { PageHeader } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { HotspotStatusList } from '@/components/HotspotStatus';

export default function HotspotsPage() {
  return (
    <div className="space-y-5">
      <PageHeader title="Hotspots" subtitle="Os sítios que acumulam sozinhos." backHref="/tarefas" />
      <HotspotStatusList />
      <Card className="bg-navy-50/60">
        <p className="text-sm text-navy-600">
          Marcar é suficiente. Um ponto vermelho hoje pode ser a missão de zona da próxima terça.
        </p>
      </Card>
    </div>
  );
}
