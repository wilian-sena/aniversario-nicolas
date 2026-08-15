'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

interface RouterValue {
  path: string;
  push: (to: string) => void;
  back: () => void;
}

const RouterContext = createContext<RouterValue | null>(null);

function currentPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

/**
 * Router minimo para a versao de demonstracao numa unica pagina.
 * Usa o fragmento do endereco, por isso funciona sem servidor.
 */
export function DemoRouter({ children }: { children: ReactNode }) {
  const [path, setPath] = useState<string>(() =>
    typeof window === 'undefined' ? '/' : currentPath(),
  );

  useEffect(() => {
    const sync = () => setPath(currentPath());
    window.addEventListener('hashchange', sync);
    return () => window.removeEventListener('hashchange', sync);
  }, []);

  const push = useCallback((to: string) => {
    window.location.hash = to;
    window.scrollTo({ top: 0 });
  }, []);

  const back = useCallback(() => window.history.back(), []);

  const value = useMemo(() => ({ path, push, back }), [path, push, back]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useDemoRouter(): RouterValue {
  const context = useContext(RouterContext);
  if (!context) throw new Error('useDemoRouter precisa do <DemoRouter>.');
  return context;
}
