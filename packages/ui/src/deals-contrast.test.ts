// WCAG contrast of the colour pairs the Deals page uses, computed from the real tokens in
// styles/tokens.css (no new token): 4.5:1 for text, 3:1 for non-text (the focus ring).
// The populated page cannot be axe-scanned while every promo file is empty, so this stands in.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const TOKENS = readFileSync(join(__dirname, 'styles', 'tokens.css'), 'utf8');

function token(name: string): string {
  const m = new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})\\s*;`).exec(TOKENS);
  if (!m) throw new Error(`token --color-${name} not found as a #rrggbb value`);
  return m[1];
}

function luminance(hex: string): number {
  const channel = (i: number) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
}

function ratio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const WHITE = '#FFFFFF';
const TEXT = 4.5;
const NON_TEXT = 3;

describe('Deals page colour contrast (tokens.css)', () => {
  it('the maths: black on white is 21:1 and a colour on itself is 1:1', () => {
    expect(ratio('#000000', WHITE)).toBeCloseTo(21, 5);
    expect(ratio(token('ds-ink'), token('ds-ink'))).toBeCloseTo(1, 5);
  });

  it.each(['ds-ink', 'ds-ink-soft', 'ds-muted'])('%s text on card, card-sub and bg is at least 4.5:1', (ink) => {
    for (const surface of ['ds-card', 'ds-card-sub', 'ds-bg']) {
      expect(ratio(token(ink), token(surface)), `${ink} on ${surface}`).toBeGreaterThanOrEqual(TEXT);
    }
  });

  it.each([
    ['ds-good-ink', 'ds-good-soft'],
    ['ds-warn-ink', 'ds-warn-soft'],
    ['ds-bad-ink', 'ds-bad-soft'],
    ['ds-accent', 'ds-accent-soft'],
  ])('chip text %s on %s is at least 4.5:1', (ink, surface) => {
    expect(ratio(token(ink), token(surface))).toBeGreaterThanOrEqual(TEXT);
  });

  it.each(['ds-accent', 'ds-accent-press', 'ds-ink'])('white text on %s (buy button, pressed, copy button) is at least 4.5:1', (fill) => {
    expect(ratio(WHITE, token(fill))).toBeGreaterThanOrEqual(TEXT);
  });

  it('the review link (ds-accent) reads on card, card-sub and bg at 4.5:1', () => {
    for (const surface of ['ds-card', 'ds-card-sub', 'ds-bg']) expect(ratio(token('ds-accent'), token(surface)), surface).toBeGreaterThanOrEqual(TEXT);
  });

  it('the focus ring is at least 3:1 on white and on the page background', () => {
    expect(ratio(token('ds-focus-ring'), WHITE)).toBeGreaterThanOrEqual(NON_TEXT);
    expect(ratio(token('ds-focus-ring'), token('ds-bg'))).toBeGreaterThanOrEqual(NON_TEXT);
  });

  it('ds-faint fails text contrast, so the Deals files never use it', () => {
    expect(ratio(token('ds-faint'), WHITE)).toBeLessThan(TEXT);
    for (const file of ['templates/DealsList.client.tsx', 'templates/DealsPage.tsx']) {
      expect(readFileSync(join(__dirname, file), 'utf8'), file).not.toMatch(/ds-faint/);
    }
  });

  it('the Deals files use only ds-* colour tokens (no raw colour, no grey/indigo utility)', () => {
    for (const file of ['templates/DealsList.client.tsx', 'templates/DealsPage.tsx']) {
      const src = readFileSync(join(__dirname, file), 'utf8');
      expect(src, file).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(|\b(?:text|bg|border)-(?:gray|slate|zinc|indigo|green|red|amber|yellow|blue)-\d/);
    }
  });
});
