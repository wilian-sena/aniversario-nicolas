'use client';

import { useEffect, useState } from 'react';
import { Card, SectionTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/cn';
import { useApp } from '@/store/AppState';

type Permission = 'default' | 'granted' | 'denied' | 'unsupported';

/** §28 — lembretes preparados, desligados por defeito e sempre reversiveis. */
export function NotificationSettings() {
  const { snapshot, updateSettings } = useApp();
  const [permission, setPermission] = useState<Permission>('default');

  useEffect(() => {
    if (typeof Notification === 'undefined') {
      setPermission('unsupported');
      return;
    }
    setPermission(Notification.permission);
  }, []);

  const askPermission = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const toggle = (id: string) => {
    updateSettings({
      notifications: snapshot.settings.notifications.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item,
      ),
    });
  };

  const setTime = (id: string, time: string) => {
    updateSettings({
      notifications: snapshot.settings.notifications.map((item) =>
        item.id === id ? { ...item, time } : item,
      ),
    });
  };

  return (
    <section aria-labelledby="notif-titulo">
      <SectionTitle>
        <span id="notif-titulo">Lembretes</span>
      </SectionTitle>

      <Card className="mb-2">
        <p className="text-sm text-navy-600">
          {permission === 'granted'
            ? 'Os lembretes estão autorizados neste telemóvel.'
            : permission === 'denied'
              ? 'Os lembretes foram bloqueados nas definições do telemóvel.'
              : permission === 'unsupported'
                ? 'Este dispositivo não suporta notificações.'
                : 'Podes ligar os lembretes quando quiseres. Nada é obrigatório.'}
        </p>
        {permission === 'default' ? (
          <Button variant="outline" className="mt-3 w-full" onClick={() => void askPermission()}>
            Autorizar lembretes
          </Button>
        ) : null}
      </Card>

      <ul className="space-y-2">
        {snapshot.settings.notifications.map((item) => (
          <li
            key={item.id}
            className={cn(
              'flex items-center gap-3 rounded-2xl border px-3 py-3',
              item.enabled ? 'border-navy-900/20 bg-white' : 'border-linha bg-white/70',
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium">{item.label}</p>
              <label className="mt-1 flex items-center gap-2 text-sm text-navy-500">
                <span className="sr-only">Hora de {item.label}</span>
                <input
                  type="time"
                  value={item.time}
                  onChange={(event) => setTime(item.id, event.target.value)}
                  className="rounded-pill border border-linha px-2 py-1 text-sm"
                />
              </label>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={item.enabled}
              aria-label={item.label}
              onClick={() => toggle(item.id)}
              className={cn(
                'relative h-7 w-12 shrink-0 rounded-pill transition-colors',
                item.enabled ? 'bg-navy-800' : 'bg-navy-200',
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform',
                  item.enabled ? 'translate-x-5' : 'translate-x-0',
                )}
              />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
