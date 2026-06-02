import { defineConfig, devices } from '@playwright/test';

// Multi-region smoke + a11y config. Serves prebuilt static exports for 4
// region apps on distinct ports and runs region-targeted spec files
// against each. Tests are organized by filename prefix:
//
//   e2e/jp-*.spec.ts    → jp-chromium project    → http://127.0.0.1:4173
//   e2e/latam-*.spec.ts → latam-chromium project → http://127.0.0.1:4174
//   e2e/ca-*.spec.ts    → ca-chromium project    → http://127.0.0.1:4175
//   e2e/eu-*.spec.ts    → eu-chromium project    → http://127.0.0.1:4176
//
// Prereqs: each region's `npm run build:<region>` must have produced the
// corresponding `apps/<region>/out/`. The webServer array below runs `npx
// serve` against each, so the build needs to happen BEFORE the test runs.
//
// Trailing-slash note: every region uses Next.js static export with
// `trailingSlash: true` (writes each route to `<route>/index.html`).
// `serve` resolves trailing-slash URLs to those files automatically —
// we deliberately do NOT pass `--single` (SPA fallback) which would
// short-circuit that.
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'jp-chromium',
      testMatch: /jp-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4173',
      },
    },
    {
      name: 'latam-chromium',
      testMatch: /latam-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4174',
      },
    },
    {
      name: 'ca-chromium',
      testMatch: /ca-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4175',
      },
    },
    {
      name: 'eu-chromium',
      testMatch: /eu-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4176',
      },
    },
  ],
  webServer: [
    {
      command: 'npx serve apps/jp/out --listen 4173',
      url: 'http://127.0.0.1:4173',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npx serve apps/latam/out --listen 4174',
      url: 'http://127.0.0.1:4174',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npx serve apps/ca/out --listen 4175',
      url: 'http://127.0.0.1:4175',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npx serve apps/eu/out --listen 4176',
      url: 'http://127.0.0.1:4176',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
