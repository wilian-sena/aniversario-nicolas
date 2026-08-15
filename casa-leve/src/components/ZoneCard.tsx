'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Zone } from '@/domain/types';
import { zoneProgressLabel } from '@/domain/zones';
import { Card } from '@/components/ui/Card';

export function ZoneCard({
  zone,
  missionIds,
  missionsDone,
}: {
  zone: Zone;
  missionIds: string[];
  /** Missoes concluidas nesta semana. */
  missionsDone: string[];
}) {

  return (
    <Card className="p-0">
      <Link href="/zonas" className="block rounded-card p-4 transition-colors hover:bg-navy-50/50">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="text-2xl">
            {zone.icon}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-navy-400">
              Zona {zone.id}
            </p>
            <h3 className="mt-0.5 text-base font-semibold leading-snug">{zone.name}</h3>
            <p className="mt-1 text-sm text-navy-500">
              {missionIds.length === 0
                ? 'Escolhe 1 a 3 missões para esta semana'
                : zoneProgressLabel(missionIds, missionsDone.length)}
            </p>
          </div>
          <ArrowRight className="mt-1 h-5 w-5 shrink-0 text-navy-300" aria-hidden="true" />
        </div>
      </Link>
    </Card>
  );
}
