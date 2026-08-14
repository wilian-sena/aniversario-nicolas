'use client';

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { useDemoRouter } from '../router';

/** Substitui `next/link` na versao de demonstracao. */
export default function Link({
  href,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  const { push } = useDemoRouter();
  return (
    <a
      href={`#${href}`}
      onClick={(event) => {
        event.preventDefault();
        push(href);
      }}
      {...props}
    >
      {children}
    </a>
  );
}
