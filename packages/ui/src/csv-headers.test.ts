import { describe, test, expect, vi, afterEach } from 'vitest';
import { getStrings, productsUS, type Locale } from '@nootropic/data';
import { exportRowsToCsv } from './templates/comparator/utils';

// 2026-10-19, shared-template semantics leftovers (4): the comparator's CSV
// export typed its header row in English ('Rank', 'Name', 'Pack price', …)
// on every page, LATAM's Spanish comparator included, although it receives the
// page's UIStrings. The headers now come from `comparator.csvHeaders`; the
// cells stay data. (Shortlist's own export renders only on the English US
// /shortlist/ page, whose whole chrome is English.)

const ALL_LOCALES: Locale[] = ['en', 'es', 'fr', 'ja', 'pt', 'de', 'fr-CA'];

/** The header row each locale's export must write, in column order. */
const EXPECTED: Record<Locale, string[]> = {
  en: ['Rank', 'Name', 'Brand', 'Score', 'Pack price', 'Currency', 'Pack', 'Approx. per month', 'Approx. per serving', 'Daily serving', 'MBG days', 'Trustpilot', 'Best for'],
  es: ['Puesto', 'Nombre', 'Marca', 'Puntuación', 'Precio del envase', 'Moneda', 'Envase', 'Aprox. por mes', 'Aprox. por dosis', 'Dosis diaria', 'Días de garantía de devolución', 'Trustpilot', 'Ideal para'],
  fr: ['Rang', 'Nom', 'Marque', 'Note', 'Prix du conditionnement', 'Devise', 'Conditionnement', 'Env. par mois', 'Env. par dose', 'Dose quotidienne', 'Jours de garantie de remboursement', 'Trustpilot', 'Idéal pour'],
  pt: ['Posição', 'Nome', 'Marca', 'Pontuação', 'Preço da embalagem', 'Moeda', 'Embalagem', 'Aprox. por mês', 'Aprox. por dose', 'Dose diária', 'Dias de garantia de reembolso', 'Trustpilot', 'Ideal para'],
  de: ['Rang', 'Name', 'Marke', 'Bewertung', 'Packungspreis', 'Währung', 'Packung', 'Ca. pro Monat', 'Ca. pro Dosis', 'Tagesdosis', 'Tage Geld-zurück-Garantie', 'Trustpilot', 'Ideal für'],
  'fr-CA': ['Rang', 'Nom', 'Marque', 'Score', 'Prix du format', 'Devise', 'Format', 'Env. par mois', 'Env. par dose', 'Dose quotidienne', 'Jours de garantie de remboursement', 'Trustpilot', 'Idéal pour'],
  // Japanese copy is paused (owner decision 2026-10-13): ja carries the English text.
  ja: ['Rank', 'Name', 'Brand', 'Score', 'Pack price', 'Currency', 'Pack', 'Approx. per month', 'Approx. per serving', 'Daily serving', 'MBG days', 'Trustpilot', 'Best for'],
};

/**
 * Headers a translated locale shares with en on purpose, in column order: the
 * brand name, the German word "Name", and fr-CA's "Score" (its comparator
 * column says Score).
 */
const SAME_AS_EN: Partial<Record<Locale, string[]>> = {
  es: ['Trustpilot'],
  fr: ['Trustpilot'],
  pt: ['Trustpilot'],
  de: ['Name', 'Trustpilot'],
  'fr-CA': ['Score', 'Trustpilot'],
};

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

/** The CSV text exportRowsToCsv hands to the download, with the DOM stubbed. */
function exportedCsv(locale: Locale): string {
  let csv = '';
  vi.stubGlobal(
    'Blob',
    class {
      constructor(parts: string[]) {
        csv = parts.join('');
      }
    },
  );
  vi.stubGlobal('document', {
    createElement: () => ({ click() {}, href: '', download: '' }),
    body: { appendChild() {}, removeChild() {} },
  });
  vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:csv');
  vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  exportRowsToCsv(productsUS, getStrings(locale));
  return csv;
}

/** One CSV line's cells ("a","b""c" → a, b"c). */
const cells = (line: string) => [...line.matchAll(/"((?:[^"]|"")*)"/g)].map((m) => m[1].replace(/""/g, '"'));

describe('comparator CSV export: header row in the page language', () => {
  test.each(ALL_LOCALES)('%s', (locale) => {
    const [header, ...rows] = exportedCsv(locale).split('\n');
    expect(cells(header)).toEqual(EXPECTED[locale]);
    expect(rows.length, 'one row per product').toBe(productsUS.length);
    for (const row of rows) expect(cells(row).length, 'a cell per header').toBe(EXPECTED[locale].length);
  });

  test('en writes the header line it wrote before', () => {
    expect(exportedCsv('en').split('\n')[0]).toBe(
      '"Rank","Name","Brand","Score","Pack price","Currency","Pack","Approx. per month","Approx. per serving","Daily serving","MBG days","Trustpilot","Best for"',
    );
  });

  test.each(ALL_LOCALES.filter((l) => l !== 'en' && l !== 'ja'))('%s headers are translated (only the listed words match en)', (locale) => {
    const same = EXPECTED[locale].filter((h, i) => h === EXPECTED.en[i]);
    expect(same).toEqual(SAME_AS_EN[locale]);
  });
});
