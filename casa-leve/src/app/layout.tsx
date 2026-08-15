import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { AppProvider } from '@/store/AppState';
import { AppShell } from '@/components/AppShell';
import { ServiceWorker } from '@/components/ServiceWorker';

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const metadata: Metadata = {
  title: 'Casa Leve',
  description:
    'A rotina da casa em pequenos passos: o que há hoje, quem faz o quê e o que falta para fechar o dia.',
  manifest: `${basePath}/manifest.webmanifest`,
  applicationName: 'Casa Leve',
  // A aplicação é da família: fica fora dos motores de busca.
  robots: { index: false, follow: false, nocache: true },
  appleWebApp: {
    capable: true,
    title: 'Casa Leve',
    statusBarStyle: 'default',
  },
  icons: {
    icon: `${basePath}/icons/icon-192.png`,
    apple: `${basePath}/icons/apple-touch-icon.png`,
  },
};

export const viewport: Viewport = {
  themeColor: '#1f3049',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-PT">
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
          <ServiceWorker />
        </AppProvider>
      </body>
    </html>
  );
}
