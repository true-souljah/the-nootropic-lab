import { describe, test, expect } from 'vitest';
import { allProductsUS, allProductsLatam, allProductsGCC, allProductsSEA } from '@nootropic/data';
import type { Product } from '@nootropic/data';

// The Nootropics Depot Lion's Mane records linked the store homepage and said
// 90 servings, a size the store does not sell, so the record could not be
// tied to one product. The site owner chose the 1:1 extract (2026-10-09): its
// label (nootropicsdepot.com product page and Supplement Facts image, checked
// 2026-10-08) gives Lion's Mane extract (fruiting body) 500mg per capsule, one
// capsule a serving, in 60ct and 180ct bottles. 500mg is below the 1000mg
// minimum of the site's Lion's Mane evidence page (ingredients.ts, 1–1.8g/day),
// and a 1:1 extract is the same basis as that dose, so the verdict is false.

const URL =
  'https://nootropicsdepot.com/lions-mane-hericium-erinaceus-whole-fruiting-body-medicinal-mushroom-extract-500mg-capsules/';

const REGIONS: [string, readonly Product[]][] = [
  ['us', allProductsUS], ['latam', allProductsLatam], ['gcc', allProductsGCC], ['sea', allProductsSEA],
];

describe.each(REGIONS)('%s Nootropics Depot Lion\'s Mane is the 1:1 extract on its label', (_region, products) => {
  const p = products.find((x) => x.slug === 'nootropics-depot-lions-mane');
  if (!p) throw new Error('Nootropics Depot Lion\'s Mane record missing');

  test('links the 1:1 product page, not the homepage', () => {
    expect(p.affiliateUrl).toBe(URL);
  });

  test('one 500mg row, judged against the 1000mg Lion\'s Mane minimum', () => {
    expect(p.ingredientDosages).toEqual([
      { name: "Lion's Mane fruiting body extract (1:1)", doseInProduct: '500mg', clinicalDose: '1000-1800mg/day', adequatelyDosed: false },
    ]);
  });

  test('a serving is one capsule and the bottle is the 60ct size', () => {
    expect(p.capsulesPerServing).toBe(1);
    expect(p.servingsPerContainer).toBe(60);
  });
});
