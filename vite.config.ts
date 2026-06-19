/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
    alias: {
      'calc-tournament': resolve(__dirname, 'libs/calc-tournament/src/index.ts'),
    },
  },
  plugins: [
    analog({
      prerender: {
        routes: async () => [],
      },
      nitro: {
        // Keep test files out of the server route scan — otherwise their
        // top-level vi.mock() calls get bundled and crash the dev server.
        ignore: ['**/*.spec.ts'],
        alias: {
          'calc-tournament': resolve(__dirname, 'libs/calc-tournament/src/index.ts'),
        },
      },
    }),
    tailwindcss(),
    tsconfigPaths(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
}));
