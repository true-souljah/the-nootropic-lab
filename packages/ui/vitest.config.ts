import { defineConfig } from 'vitest/config';
import path from 'node:path';

const APPS = path.resolve(__dirname, '../../apps');

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
  resolve: {
    alias: {
      '@nootropic/data': path.resolve(__dirname, '../data/src/index.ts'),
    },
  },
  plugins: [
    {
      // Render tests import region app pages (apps/<region>/src/app/**), whose
      // `@/…` imports mean that app's own src/ (each app's tsconfig paths).
      name: 'region-app-src-alias',
      enforce: 'pre',
      async resolveId(source, importer) {
        if (!source.startsWith('@/') || !importer) return null;
        const app = path.relative(APPS, importer).split(path.sep);
        if (app.length < 3 || app[0].startsWith('..') || app[1] !== 'src') return null;
        return this.resolve(path.join(APPS, app[0], 'src', source.slice(2)), importer, { skipSelf: true });
      },
    },
  ],
});
