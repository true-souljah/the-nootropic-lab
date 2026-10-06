import { describe, test, expect } from 'vitest';
import { latamCountries } from '@nootropic/data';

// Source-level guard for the LATAM country customs notes (2026-10 rewrite from
// the verified fact sheet): every note must cite at least one official source
// domain inline, list the official pages it used, and must not regress to the
// retired, unsourced figures of the earlier copy.

const CITATION = /\(fuente: ([a-z0-9.-]+\.[a-z]{2,})(\/[^,)]*)?, consultado \d{4}-\d{2}-\d{2}\)/g;

const RETIRED: RegExp[] = [
  /60% import tax/i,
  /3 units per SKU/i,
  /1 a 3 meses/i,
];

describe('LATAM customsNote sourcing', () => {
  test('six countries are covered', () => {
    expect(latamCountries.map(c => c.code).sort()).toEqual(['AR', 'BR', 'CL', 'CO', 'MX', 'PE']);
  });

  for (const c of latamCountries) {
    test(`${c.code}: cites at least one source domain listed in customsSources`, () => {
      const cited = [...c.customsNote.matchAll(CITATION)].map(m => m[1]);
      expect(cited.length).toBeGreaterThan(0);
      expect(c.customsSources.length).toBeGreaterThan(0);
      const hosts = c.customsSources.map(s => new URL(s.url).hostname.replace(/^www\./, ''));
      const matches = (h: string, d: string) => h === d || h.endsWith(`.${d}`);
      for (const domain of cited) {
        expect(hosts.some(h => matches(h, domain))).toBe(true);
      }
      // Reverse: every listed source is actually cited in the note.
      for (const h of hosts) {
        expect(cited.some(d => matches(h, d))).toBe(true);
      }
    });

    test(`${c.code}: contains none of the retired figures`, () => {
      for (const re of RETIRED) expect(c.customsNote).not.toMatch(re);
    });
  }

  // ARCA's Puerta a Puerta pages (re-fetched 2026-10-05): the INAL-intervention
  // exemption under ANMAT Disposición 537/2025 (intervenciones.asp) and the
  // "libre ingreso" outcome of the supplement authorisation (medicamentos.asp).
  test('AR: quotes the INAL exemption and the "libre ingreso" wording', () => {
    const ar = latamCountries.find(c => c.code === 'AR')!.customsNote;
    expect(ar).toContain('«la intervención del Instituto Nacional de Alimentos» (INAL)');
    expect(ar).toContain('Disposición N° 537 del 24 de enero de 2025');
    expect(ar).toContain('determinar el libre ingreso de lo declarado para uso personal');
    expect(ar).not.toMatch(/no verificamos su contenido/);
  });
});
