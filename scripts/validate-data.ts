// Lightweight, dependency-free validation gate for product data.
// Fails (exit 1) on missing required fields, non-numeric score, or duplicate id within a region.
import {
  productsUS, productsEU, productsCA, productsAU,
  productsJP, productsLatam, productsGCC, productsSEA,
} from '../packages/data/src/index';

const regions: Record<string, unknown[]> = {
  us: productsUS, eu: productsEU, ca: productsCA, au: productsAU,
  jp: productsJP, latam: productsLatam, gcc: productsGCC, sea: productsSEA,
};

let failed = 0;
for (const [region, products] of Object.entries(regions)) {
  if (!Array.isArray(products)) {
    console.error(`FAIL ${region}: export is not an array`);
    failed++;
    continue;
  }
  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const item of products) {
    const p = item as Record<string, unknown>;
    for (const f of ['id', 'name', 'slug']) {
      if (typeof p[f] !== 'string' || (p[f] as string).length === 0) {
        console.error(`FAIL ${region}: product ${String(p.id ?? '?')} missing/empty "${f}"`);
        failed++;
      }
    }
    if (typeof p.score !== 'number') {
      console.error(`FAIL ${region}: product ${String(p.id ?? '?')} has non-numeric score`);
      failed++;
    }
    const id = String(p.id);
    if (ids.has(id)) {
      console.error(`FAIL ${region}: duplicate id "${id}"`);
      failed++;
    }
    ids.add(id);
    // Slug uniqueness: [slug]/page.tsx generateStaticParams maps products
    // by slug; a duplicate slug generates a colliding route + duplicate
    // sitemap/ItemList entry (audit OPT-4 — EU shipped braineffect twice).
    const slug = String(p.slug);
    if (slugs.has(slug)) {
      console.error(`FAIL ${region}: duplicate slug "${slug}"`);
      failed++;
    }
    slugs.add(slug);
  }
  console.log(`ok ${region}: ${products.length} products`);
}

if (failed > 0) {
  console.error(`\n${failed} validation error(s).`);
  process.exit(1);
}
console.log('\nAll product data valid.');
