'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, CheckSquare, Home, LayoutGrid, Users } from 'lucide-react';
import { cn } from '@/lib/cn';

const ITEMS = [
  { href: '/', label: 'Hoje', Icon: Home },
  { href: '/semana', label: 'Semana', Icon: CalendarDays },
  { href: '/zonas', label: 'Zonas', Icon: LayoutGrid },
  { href: '/tarefas', label: 'Tarefas', Icon: CheckSquare },
  { href: '/familia', label: 'Família', Icon: Users },
] as const;

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-linha bg-white/95 backdrop-blur"
      style={{ paddingBottom: 'var(--safe-bottom)' }}
    >
      <ul className="mx-auto flex max-w-3xl">
        {ITEMS.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex min-h-[56px] flex-col items-center justify-center gap-1 py-2 text-[11px] font-medium transition-colors',
                  active ? 'text-navy-900' : 'text-navy-400 hover:text-navy-600',
                )}
              >
                <Icon
                  className={cn('h-5 w-5', active && 'stroke-[2.4]')}
                  aria-hidden="true"
                />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
