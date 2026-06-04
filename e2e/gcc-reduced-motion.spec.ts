import { test, expect } from '@playwright/test';

// Regression guard for `@media (prefers-reduced-motion: reduce)` on
// the GCC app. Twin of us-reduced-motion (PR-Q23 #87).
//
// Targets WCAG 2.3.3 (Animation from Interactions) + WCAG 2.2.2
// (Pause, Stop, Hide) — users with vestibular sensitivities who
// opt in via OS Reduce Motion / browser preference must see
// site-wide animations clamped.
//
// The global rule lives in packages/ui/src/styles/tokens.css:
//
//   @media (prefers-reduced-motion: reduce) {
//     *, *::before, *::after {
//       animation-duration: 0.01ms !important;
//       animation-iteration-count: 1 !important;
//       transition-duration: 0.01ms !important;
//       scroll-behavior: auto !important;
//     }
//   }
//
// PR-Q56 portfolio sweep — promotes US-only coverage (PR-Q23) to
// all 8 regions in a single mechanical PR. Closes the reduced-
// motion axis at 8/8. No region-specific anchors needed: the rule
// lives in shared CSS imported by every region's globals.css and
// the assertion is identical per region.

test.describe('GCC — global prefers-reduced-motion rule applies (WCAG 2.3.3 + 2.2.2)', () => {
  test('with reduced motion EMULATED → injected element transition is neutralized', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'klaro',
        value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
        domain: '127.0.0.1',
        path: '/',
      },
    ]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/best-nootropics-for-focus/');

    const computedDuration = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.transition = 'opacity 1s linear';
      probe.style.opacity = '1';
      document.body.appendChild(probe);
      const value = window.getComputedStyle(probe).transitionDuration;
      probe.remove();
      return value;
    });

    expect(computedDuration, `Expected reduced-motion override; computed = ${computedDuration}`).not.toBe('1s');
    const ms = parseFloat(computedDuration) * (computedDuration.endsWith('ms') ? 1 : 1000);
    expect(ms, `transition-duration ${computedDuration} = ${ms}ms`).toBeLessThanOrEqual(10);
  });

  test('without reduced motion → injected element transition KEEPS its declared duration (sanity)', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'klaro',
        value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
        domain: '127.0.0.1',
        path: '/',
      },
    ]);
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/best-nootropics-for-focus/');

    const computedDuration = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.transition = 'opacity 1s linear';
      probe.style.opacity = '1';
      document.body.appendChild(probe);
      const value = window.getComputedStyle(probe).transitionDuration;
      probe.remove();
      return value;
    });

    expect(computedDuration).toMatch(/^(1s|1000ms)$/);
  });
});

test.describe('GCC — keyframe animations also neutralized under reduced motion (WCAG 2.2.2)', () => {
  test('animation-duration is neutralized on an injected animated element', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'klaro',
        value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%7D',
        domain: '127.0.0.1',
        path: '/',
      },
    ]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/best-nootropics-for-focus/');

    const computedAnimDuration = await page.evaluate(() => {
      const style = document.createElement('style');
      style.textContent = '@keyframes probeFade { from { opacity: 0; } to { opacity: 1; } }';
      document.head.appendChild(style);
      const probe = document.createElement('div');
      probe.style.animation = 'probeFade 5s linear infinite';
      document.body.appendChild(probe);
      const value = window.getComputedStyle(probe).animationDuration;
      probe.remove();
      style.remove();
      return value;
    });

    expect(computedAnimDuration, `animation-duration = ${computedAnimDuration}`).not.toBe('5s');
    const ms = parseFloat(computedAnimDuration) * (computedAnimDuration.endsWith('ms') ? 1 : 1000);
    expect(ms, `animation-duration ${computedAnimDuration} = ${ms}ms`).toBeLessThanOrEqual(10);
  });
});
