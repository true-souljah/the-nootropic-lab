import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { productImages, PRODUCT_IMAGE_SIZES } from '@nootropic/data';

// Product pack-shots (2026-10-07): every map entry must point at a real
// product and a real, correctly sized file; the products WITHOUT an image are
// pinned so adding one is a deliberate choice; and the per-region copies
// shipped from apps/<region>/public/products/ must match the source set.

const REPO_ROOT = join(__dirname, '..', '..', '..');
const DATA_SRC = join(REPO_ROOT, 'packages', 'data', 'src');
const ASSETS = join(REPO_ROOT, 'packages', 'data', 'assets', 'products');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'] as const;

// Active products with no vendor image: Memo Plus Gold has no vendor-owned
// page (manifest 2026-10-07; the operator must supply one).
const ACTIVE_WITHOUT_IMAGE = ['memo-plus-gold'];
// Discontinued products keep their review page (monogram) — no current
// vendor page to take a pack-shot from.
const DISCONTINUED_WITHOUT_IMAGE = ['blackmores-brain-active', 'braineffect-focus', 'performance-lab-mind'];

interface RegionProduct {
  id: string;
  discontinued?: unknown;
}

const regionProducts = Object.fromEntries(
  REGIONS.map((r) => [
    r,
    JSON.parse(readFileSync(join(DATA_SRC, `products-${r}.json`), 'utf8')) as RegionProduct[],
  ]),
) as Record<(typeof REGIONS)[number], RegionProduct[]>;
const allProducts = new Map<string, RegionProduct>();
for (const r of REGIONS) for (const p of regionProducts[r]) allProducts.set(p.id, p);

const entries = Object.entries(productImages);

/** Canvas size from a WebP header (lossy VP8, lossless VP8L or extended VP8X). */
function webpSize(buf: Buffer): { width: number; height: number } {
  expect(buf.toString('ascii', 0, 4)).toBe('RIFF');
  expect(buf.toString('ascii', 8, 12)).toBe('WEBP');
  const chunk = buf.toString('ascii', 12, 16);
  if (chunk === 'VP8 ') return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  if (chunk === 'VP8L') {
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
  }
  if (chunk === 'VP8X') return { width: buf.readUIntLE(24, 3) + 1, height: buf.readUIntLE(27, 3) + 1 };
  throw new Error(`unknown WebP chunk ${chunk}`);
}

describe('product images', () => {
  it('has entries and reads every region catalogue', () => {
    expect(entries.length).toBeGreaterThanOrEqual(20);
    for (const r of REGIONS) expect(regionProducts[r].length, r).toBeGreaterThan(0);
  });

  it.each(entries)('%s: id exists in a region catalogue', (id) => {
    expect(allProducts.has(id), `${id} is in no products-*.json`).toBe(true);
  });

  it.each(entries)('%s: both files exist at the declared size and within budget', (id, image) => {
    const budgets = { sm: 15 * 1024, lg: 45 * 1024 };
    for (const variant of ['sm', 'lg'] as const) {
      const file = image[variant];
      const px = PRODUCT_IMAGE_SIZES[variant];
      expect(file.src).toBe(`/products/${id}-${px}.webp`);
      const path = join(ASSETS, `${id}-${px}.webp`);
      expect(existsSync(path), `${path} missing`).toBe(true);
      const buf = readFileSync(path);
      expect(webpSize(buf)).toEqual({ width: file.width, height: file.height });
      expect(buf.length, `${id}-${px}.webp bytes`).toBeLessThanOrEqual(budgets[variant]);
    }
  });

  it.each(entries)('%s: provenance is recorded', (_id, image) => {
    expect(image.sourcePageUrl).toMatch(/^https:\/\//);
    expect(image.imageUrl).toMatch(/^https:\/\//);
    expect(image.fetchedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('has no orphan files in packages/data/assets/products', () => {
    const expected = entries.flatMap(([id]) => Object.values(PRODUCT_IMAGE_SIZES).map((px) => `${id}-${px}.webp`));
    expect(readdirSync(ASSETS).sort()).toEqual(expected.sort());
  });

  it('pins exactly which products render the monogram fallback', () => {
    const without = [...allProducts.values()].filter((p) => !(p.id in productImages));
    const active = without.filter((p) => p.discontinued == null).map((p) => p.id).sort();
    const discontinued = without.filter((p) => p.discontinued != null).map((p) => p.id).sort();
    expect(active).toEqual(ACTIVE_WITHOUT_IMAGE);
    expect(discontinued).toEqual(DISCONTINUED_WITHOUT_IMAGE);
  });

  it.each(REGIONS)('%s: public/products holds exactly the region set, byte-identical to the source', (region) => {
    const dir = join(REPO_ROOT, 'apps', region, 'public', 'products');
    const expected = regionProducts[region]
      .filter((p) => p.id in productImages)
      .flatMap((p) => Object.values(PRODUCT_IMAGE_SIZES).map((px) => `${p.id}-${px}.webp`))
      .sort();
    expect(expected.length).toBeGreaterThan(0);
    expect(existsSync(dir), `${dir} missing — run node scripts/sync-product-images.mjs`).toBe(true);
    expect(readdirSync(dir).sort(), `run node scripts/sync-product-images.mjs ${region}`).toEqual(expected);
    for (const file of expected) {
      expect(readFileSync(join(dir, file)).equals(readFileSync(join(ASSETS, file))), `${region}/${file} differs`).toBe(
        true,
      );
    }
  });

  it.each(REGIONS)('%s: prebuild and predev run the sync for this region', (region) => {
    const pkg = JSON.parse(readFileSync(join(REPO_ROOT, 'apps', region, 'package.json'), 'utf8'));
    const command = `node ../../scripts/sync-product-images.mjs ${region}`;
    expect(pkg.scripts.prebuild).toBe(command);
    expect(pkg.scripts.predev).toBe(command);
  });
});
