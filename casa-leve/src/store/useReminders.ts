'use client';

import { useEffect, useRef } from 'react';
import type { NotificationPref } from '@/domain/types';
import { dayOfWeek } from '@/lib/date';
import { useApp } from '@/store/AppState';

const BODIES: Record<string, string> = {
  manha: 'Rotina da manhã: pijama, vestir, pequeno-almoço, mochila.',
  noite: 'Preparar a noite: jantar, banho e roupa do dia seguinte.',
  reset: 'Reset da casa: dez minutos, todos juntos.',
  planeamento: 'Planeamento da semana: dez minutos e a semana fica previsível.',
  atividade: 'Antes de sair: roupa da atividade e mochila.',
};

/** Um lembrete so faz sentido no dia certo. */
function appliesToday(pref: NotificationPref, day: number, hasActivity: boolean): boolean {
  if (pref.id === 'planeamento') return day === 0;
  if (pref.id === 'atividade') return hasActivity;
  return true;
}

/**
 * Lembretes locais enquanto a aplicacao esta aberta. Notificacoes em segundo
 * plano exigem push com servidor, o que fica para a versao com backend.
 */
export function useReminders(): void {
  const { snapshot, today } = useApp();
  const fired = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof Notification === 'undefined') return;
    if (Notification.permission !== 'granted') return;

    const check = () => {
      const now = new Date();
      const stamp = `${now.getHours()}`.padStart(2, '0') + ':' + `${now.getMinutes()}`.padStart(2, '0');
      const day = dayOfWeek(today);
      const hasActivity = [1, 3, 5].includes(day);

      for (const pref of snapshot.settings.notifications) {
        if (!pref.enabled || pref.time !== stamp) continue;
        if (!appliesToday(pref, day, hasActivity)) continue;
        const key = `${today}:${pref.id}`;
        if (fired.current.has(key)) continue;
        fired.current.add(key);
        new Notification('Casa Leve', { body: BODIES[pref.id] ?? pref.label, tag: key });
      }
    };

    check();
    const id = window.setInterval(check, 30_000);
    return () => window.clearInterval(id);
  }, [snapshot.settings.notifications, today]);
}
