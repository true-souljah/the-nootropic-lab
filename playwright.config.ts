import { defineConfig, devices } from '@playwright/test';

// Multi-region smoke + a11y config. Serves prebuilt static exports for ALL
// 8 region apps on distinct ports and runs region-targeted spec files
// against each. PR-Q40 closes the 8-of-8-regions infrastructure milestone.
// Tests are organized by filename prefix:
//
//   e2e/jp-*.spec.ts    → jp-chromium project    → http://127.0.0.1:4173
//   e2e/latam-*.spec.ts → latam-chromium project → http://127.0.0.1:4174
//   e2e/ca-*.spec.ts    → ca-chromium project    → http://127.0.0.1:4175
//   e2e/eu-*.spec.ts    → eu-chromium project    → http://127.0.0.1:4176
//   e2e/us-*.spec.ts    → us-chromium project    → http://127.0.0.1:4177
//   e2e/au-*.spec.ts    → au-chromium project    → http://127.0.0.1:4178
//   e2e/gcc-*.spec.ts   → gcc-chromium project   → http://127.0.0.1:4179
//   e2e/sea-*.spec.ts   → sea-chromium project   → http://127.0.0.1:4180
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
    // testMatch is a regex against the full path. The `[/\\]` prefix
    // forces the region tag to appear at the start of the basename
    // (after the directory separator) — without it, a substring
    // match like the "us-" inside "stat​**us-**messages" causes
    // jp-status-messages.spec.ts to also match us-chromium. PR-Q31 #95
    // surfaced and fixed that bug.
    {
      name: 'jp-chromium',
      testMatch: /[/\\]jp-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4173',
      },
    },
    {
      name: 'latam-chromium',
      testMatch: /[/\\]latam-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4174',
      },
    },
    {
      name: 'ca-chromium',
      testMatch: /[/\\]ca-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4175',
      },
    },
    {
      name: 'eu-chromium',
      testMatch: /[/\\]eu-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4176',
      },
    },
    {
      name: 'us-chromium',
      testMatch: /[/\\]us-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4177',
      },
    },
    {
      name: 'au-chromium',
      testMatch: /[/\\]au-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4178',
      },
    },
    {
      name: 'gcc-chromium',
      testMatch: /[/\\]gcc-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4179',
      },
    },
    {
      name: 'sea-chromium',
      testMatch: /[/\\]sea-.*\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://127.0.0.1:4180',
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
    {
      command: 'npx serve apps/us/out --listen 4177',
      url: 'http://127.0.0.1:4177',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npx serve apps/au/out --listen 4178',
      url: 'http://127.0.0.1:4178',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npx serve apps/gcc/out --listen 4179',
      url: 'http://127.0.0.1:4179',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: 'npx serve apps/sea/out --listen 4180',
      url: 'http://127.0.0.1:4180',
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
  ],
});
