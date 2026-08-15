import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { fileURLToPath } from 'node:url';

/**
 * Build da versão de demonstração: a mesma aplicação, num único HTML.
 * `next/link` e `next/navigation` são trocados por um router de fragmento,
 * para a aplicação funcionar sem servidor.
 */
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [react(), viteSingleFile()],
  css: { postcss: fileURLToPath(new URL('..', import.meta.url)) },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.NEXT_PUBLIC_BASE_PATH': '""',
  },
  resolve: {
    alias: [
      { find: /^next\/link$/, replacement: fileURLToPath(new URL('./shims/link.tsx', import.meta.url)) },
      {
        find: /^next\/navigation$/,
        replacement: fileURLToPath(new URL('./shims/navigation.ts', import.meta.url)),
      },
      { find: '@', replacement: fileURLToPath(new URL('../src', import.meta.url)) },
    ],
  },
  build: {
    outDir: fileURLToPath(new URL('./dist', import.meta.url)),
    emptyOutDir: true,
    target: 'es2020',
  },
});
