'use client';

import { useEffect } from 'react';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** Regista o service worker para a aplicacao funcionar offline. */
export function ServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register(`${basePath}/sw.js`, { scope: `${basePath}/` }).catch(() => {
        /* offline continua a funcionar com o que ja esta em cache */
      });
    };
    if (document.readyState === 'complete') register();
    else window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
