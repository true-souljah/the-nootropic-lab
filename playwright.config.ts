import { defineConfig, devices } from '@playwright/test';

// Smoke test config. Serves the prebuilt JP static export from `apps/jp/out/`
// and runs a small assertion suite against `/ingredients/[slug]/` to catch
// regressions on the mechanical migrations + i18n work landed earlier.
//
// Prereqs: `npm run build:jp` must have produced `apps/jp/out/`. The webServer
// block below runs `npx serve` against that directory, so the build needs to
// happen BEFORE the test runs (CI handles this in the job ordering).
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'jp-chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    // Static-export site → plain file server. We deliberately do NOT pass
    // `--single` (SPA fallback) because Next.js static export with
    // `trailingSlash: true` writes each route to `<route>/index.html` —
    // serve auto-resolves trailing-slash URLs to those files. SPA fallback
    // would short-circuit that and return the root index for every URL.
    command: 'npx serve apps/jp/out --listen 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
