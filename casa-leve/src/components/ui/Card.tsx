import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export function Card({
  children,
  className,
  as: Tag = 'section',
}: {
  children: ReactNode;
  className?: string;
  as?: 'section' | 'div' | 'article' | 'li';
}) {
  return <Tag className={cn('card p-4', className)}>{children}</Tag>;
}

export function SectionTitle({
  children,
  action,
}: {
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="mb-2 flex items-center justify-between gap-3 px-1">
      <h2 className="section-title">{children}</h2>
      {action}
    </div>
  );
}

export function Pill({
  children,
  className,
  tone = 'neutral',
}: {
  children: ReactNode;
  className?: string;
  tone?: 'neutral' | 'ok' | 'warn' | 'alert' | 'info';
}) {
  const tones = {
    neutral: 'bg-navy-50 text-navy-700',
    ok: 'bg-nicolas-soft text-nicolas-strong',
    warn: 'bg-sol-soft text-sol',
    alert: 'bg-ana-soft text-ana-strong',
    info: 'bg-lavanda-soft text-lavanda',
  } as const;
  return <span className={cn('pill', tones[tone], className)}>{children}</span>;
}
