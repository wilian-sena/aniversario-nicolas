'use client';

import { useDemoRouter } from '../router';

/** Substitui `next/navigation` na versao de demonstracao. */
export function usePathname(): string {
  return useDemoRouter().path;
}

export function useRouter() {
  const { push, back } = useDemoRouter();
  return { push, replace: push, back, forward: () => {}, refresh: () => {}, prefetch: () => {} };
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}
