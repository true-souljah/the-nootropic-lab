import { test, expect } from '@playwright/test';

// Regression guard for the global `@media (prefers-reduced-motion: reduce)`
// rule in packages/ui/src/styles/tokens.css:
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
// This rule neutralizes site-wide animations for users who opt in via
// their OS / browser preference (macOS Reduce Motion, Windows Show
// Animations off, Firefox `general.smoothScroll = false`). Without it,
// the project's transitions and animations (StickyCtaBar slide,
// Skeleton shimmer, hover effects across the design system) would
// fire regardless — a WCAG 2.3.3 (Animation from Interactions) and
// WCAG 2.2.2 (Pause, Stop, Hide) failure for users with vestibular
// sensitivities.
//
// The rule is bundled into every region app via the shared
// region-globals.css → tokens.css import chain (PR-Q20 #84). If the
// import gets accidentally broken, the @media block gets deleted, or
// a future rule introduces `transition` with `!important` outside
// the @media scope, this spec catches the regression in CI.

test.describe('US — global prefers-reduced-motion rule applies (WCAG 2.3.3 + 2.2.2)', () => {
  test('with reduced motion EMULATED → injected element transition is neutralized', async ({ page, context }) => {
    // 1. Emulate `prefers-reduced-motion: reduce` so the global @media
    //    block kicks in.
    await context.addCookies([
      {
        name: 'klaro',
        value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
        domain: '127.0.0.1',
        path: '/',
      },
    ]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/best-nootropics-for-focus/');

    // 2. Inject a test element with a deliberate 1000ms transition that
    //    the global @media rule must override.
    const computedDuration = await page.evaluate(() => {
      const probe = document.createElement('div');
      probe.style.transition = 'opacity 1s linear';
      probe.style.opacity = '1';
      document.body.appendChild(probe);
      const value = window.getComputedStyle(probe).transitionDuration;
      probe.remove();
      return value;
    });

    // 3. With the global rule in effect, `getComputedStyle` should
    //    report a non-1000ms value (the rule forces transition-duration
    //    to 0.01ms with !important). Modern browsers report this as
    //    `"0.01ms"` or `"0s"` depending on rounding; both indicate the
    //    transition has been effectively neutralized.
    expect(computedDuration, `Expected reduced-motion override; computed = ${computedDuration}`).not.toBe('1s');
    // Numeric parse to assert ≤ 10ms — any value below that is
    // imperceptible and satisfies WCAG 2.3.3.
    const ms = parseFloat(computedDuration) * (computedDuration.endsWith('ms') ? 1 : 1000);
    expect(ms, `transition-duration ${computedDuration} = ${ms}ms`).toBeLessThanOrEqual(10);
  });

  test('without reduced motion → injected element transition KEEPS its declared duration (sanity)', async ({ page, context }) => {
    // Negative case — proves the previous test isn't accidentally
    // passing for the wrong reason (e.g., browser bug, !important
    // collision, or selector specificity). With reduced-motion NOT
    // emulated, the injected element should report the full 1s.
    await context.addCookies([
      {
        name: 'klaro',
        value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
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

    // With no media-query override the value should be `"1s"` (or
    // `"1000ms"` in some browsers).
    expect(computedDuration).toMatch(/^(1s|1000ms)$/);
  });
});

test.describe('US — keyframe animations also neutralized under reduced motion (WCAG 2.2.2)', () => {
  test('animation-duration is neutralized on an injected animated element', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'klaro',
        value: '%7B%22cloudflare-insights%22%3Afalse%2C%22google-analytics%22%3Afalse%2C%22impact-com%22%3Afalse%7D',
        domain: '127.0.0.1',
        path: '/',
      },
    ]);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/best-nootropics-for-focus/');

    const computedAnimDuration = await page.evaluate(() => {
      // Inject a keyframe + element. The global rule should clamp
      // `animation-duration` to 0.01ms.
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
