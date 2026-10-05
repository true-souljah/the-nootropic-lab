import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  ANMAT_DISPOSICION_2105_2022,
  anmatProhibitedCompounds,
  anmatProhibitedProducts,
  auditProductsForAnmat,
  findAnmatBannedIngredients,
  productsLatam,
} from '@nootropic/data';
import type { Product } from '@nootropic/data';

// ANMAT Disposición 2105/2022 (Boletín Oficial, 22 March 2022) prohibits
// seven NAMED products sold via noopept.com.ar. It is not a compound-class
// ban: "piracetam" appears only inside a quoted marketing claim, and no
// other racetam, phenibut, tianeptine or adrafinil is named. These tests
// lock the data module to that verified scope.

const BO_URL = 'https://www.boletinoficial.gob.ar/detalleAviso/primera/259661/20220322';
const DATA_FILE = join(__dirname, '..', '..', 'data', 'src', 'anmat-prohibited.ts');
const PAGE_FILE = join(
  __dirname, '..', '..', '..', 'apps', 'latam', 'src', 'app', 'anmat-disposicion-2105-2022-prohibidos', 'page.tsx',
);

function fakeProduct(...ingredients: string[]): Product {
  return { ingredientDosages: ingredients.map(name => ({ name })) } as unknown as Product;
}

describe('ANMAT Disposición 2105/2022 — source-level scope', () => {
  const src = readFileSync(DATA_FILE, 'utf8');
  const page = readFileSync(PAGE_FILE, 'utf8');

  it('data module and page cite the Boletín Oficial text, not the wrong argentina.gob.ar norm', () => {
    expect(src).toContain(BO_URL);
    expect(ANMAT_DISPOSICION_2105_2022.sourceUrl).toBe(BO_URL);
    expect(ANMAT_DISPOSICION_2105_2022.publishedDate).toBe('2022-03-22');
    for (const text of [src, page]) {
      expect(text).not.toContain('argentina.gob.ar/normativa/nacional/disposici');
      expect(text).not.toContain('2022-04-08');
      expect(text).not.toMatch(/8 de abril/i);
    }
  });

  it('data module contains no racetam (or other unnamed compound) entries', () => {
    const names = anmatProhibitedCompounds.flatMap(c => [c.name, c.nameEs, c.declaredAs]).join(' | ');
    expect(names).not.toMatch(/racetam/i);
    // The only "-racetam" string allowed is omberacetam, Noopept's INN alias.
    const racetamAliases = anmatProhibitedCompounds.flatMap(c => c.aliases.filter(a => /racetam/i.test(a)).map(a => `${c.name}:${a}`));
    expect(racetamAliases).toEqual(['Noopept:Omberacetam']);
    for (const unnamed of ['Aniracetam', 'Oxiracetam', 'Pramiracetam', 'Phenylpiracetam', 'Tianeptine', 'Adrafinil']) {
      expect(src).not.toContain(`name: '${unnamed}'`);
    }
    // Plain phenibut is not named; only the fluorinated F-Phenibut is.
    expect(anmatProhibitedCompounds.some(c => c.name === 'Phenibut')).toBe(false);
  });

  it('lists exactly the seven Artículo 1 products and the three recital substances', () => {
    expect(anmatProhibitedProducts).toHaveLength(7);
    expect(anmatProhibitedProducts.every(p => p.basis === 'named-in-articulo-1')).toBe(true);
    expect(anmatProhibitedProducts.map(p => p.nameAsWritten)).toContain('Newmind – F-Phenibut polvo');
    expect(anmatProhibitedCompounds.map(c => c.declaredAs)).toEqual([
      'Noopept',
      '4-Amino-3 (4-fluorophenyl) butyric acid HCL',
      'Bacopa Monnieri whole herb extract',
    ]);
    expect(anmatProhibitedCompounds.every(c => c.basis === 'cited-in-recitals-as-unauthorised-in-caa')).toBe(true);
  });
});

describe('findAnmatBannedIngredients — matches only Noopept and F-Phenibut', () => {
  it('flags Noopept and its GVS-111 / omberacetam aliases', () => {
    for (const n of ['Noopept 10mg', 'GVS-111', 'GVS -111', 'Omberacetam']) {
      expect(findAnmatBannedIngredients(fakeProduct(n)).map(c => c.name)).toEqual(['Noopept']);
    }
  });

  it('flags F-Phenibut but not plain phenibut', () => {
    expect(findAnmatBannedIngredients(fakeProduct('F-Phenibut HCl'))).toHaveLength(1);
    expect(findAnmatBannedIngredients(fakeProduct('4-Fluorophenibut'))).toHaveLength(1);
    expect(findAnmatBannedIngredients(fakeProduct('Phenibut HCl'))).toHaveLength(0);
  });

  it('does not match inside longer unrelated tokens', () => {
    expect(findAnmatBannedIngredients(fakeProduct('Noopeptide'))).toHaveLength(0);
    expect(findAnmatBannedIngredients(fakeProduct('F-Phenibutyl'))).toHaveLength(0);
    expect(findAnmatBannedIngredients(fakeProduct('XF-Phenibut'))).toHaveLength(0);
  });

  it('never flags Bacopa monnieri or racetams', () => {
    expect(findAnmatBannedIngredients(fakeProduct('Bacopa Monnieri (24% bacosides)'))).toHaveLength(0);
    expect(findAnmatBannedIngredients(fakeProduct('Bacopa Monnieri whole herb extract'))).toHaveLength(0);
    expect(findAnmatBannedIngredients(fakeProduct('Piracetam', 'Aniracetam'))).toHaveLength(0);
  });

  it('flags no LATAM catalogue product (several contain Bacopa)', () => {
    expect(productsLatam.some(p => p.ingredientDosages.some(i => /bacopa/i.test(i.name)))).toBe(true);
    const flagged = auditProductsForAnmat(productsLatam).filter(a => a.bannedCompounds.length > 0);
    expect(flagged.map(a => a.product.id)).toEqual([]);
  });
});
