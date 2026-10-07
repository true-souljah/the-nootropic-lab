#!/usr/bin/env node
// One-off product pack-shot optimiser (2026-10-07). Re-runnable; NOT part of
// any build.
//
//   node scripts/optimize-product-images.mjs <path/to/manifest.json>
//
// Provenance: the site owner decided on 2026-10-07 to show each product's
// real pack-shot instead of the letter monogram and authorised using the
// vendors' own product images. Every input file was downloaded from the
// vendor's OWN website; the manifest records, per product id, the vendor page
// (sourcePageUrl), the exact image URL (imageUrl) and the fetch date. Those
// three fields are copied into packages/data/src/product-images.json, which is
// the committed provenance record and the source of the typed map in
// product-images.ts. Ids whose manifest entry has `file: null` (no vendor image
// could be retrieved) are skipped and keep the monogram fallback.
//
// Output per id, both contain-fit on white (no crop of the product):
//   packages/data/assets/products/<id>-192.webp  192×192 (2× for tiles ≤ 96px)
//   packages/data/assets/products/<id>-480.webp  480×480 (review-page hero)
// Pack-shots on a white/transparent background are trimmed to the product and
// re-padded so it fills the tile; full-bleed studio photos (coloured backdrop
// edge to edge) keep their backdrop and fill the square.
//
// sharp is not a declared dependency: it is present in node_modules as an
// optional dependency of `next`. CI and Cloudflare install with
// `npm ci --omit=dev` and never run this script — the committed .webp files
// are the build input (scripts/sync-product-images.mjs copies them into each
// region app).
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import sharp from 'sharp';

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');
const OUT_DIR = join(ROOT, 'packages', 'data', 'assets', 'products');
const PROVENANCE = join(ROOT, 'packages', 'data', 'src', 'product-images.json');

const SIZES = [
  { suffix: 192, maxBytes: 15 * 1024 },
  { suffix: 480, maxBytes: 45 * 1024 },
];
const QUALITY_STEPS = [80, 76, 72, 68];
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
// Fraction of the square kept clear around a trimmed product, per side.
const PAD = 0.06;

const manifestPath = process.argv[2];
if (!manifestPath) {
  console.error('usage: node scripts/optimize-product-images.mjs <path/to/manifest.json>');
  process.exit(2);
}
const manifestDir = dirname(resolve(manifestPath));
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

mkdirSync(OUT_DIR, { recursive: true });

/** Flattened (alpha → white), EXIF-rotated RGB buffer of the source image. */
async function flattened(file) {
  return sharp(file).rotate().flatten({ background: WHITE }).toBuffer();
}

/**
 * Returns { buffer, fullBleed }: a white-bordered pack-shot comes back trimmed
 * to the product; a photo whose edges are not white comes back untouched.
 */
async function prepare(file) {
  const flat = await flattened(file);
  const meta = await sharp(flat).metadata();
  const { data, info } = await sharp(flat)
    .trim({ background: '#ffffff', threshold: 12 })
    .toBuffer({ resolveWithObject: true });
  const trimmed = info.width < meta.width || info.height < meta.height;
  return trimmed ? { buffer: data, fullBleed: false } : { buffer: flat, fullBleed: true };
}

async function render({ buffer, fullBleed }, size, quality) {
  const meta = await sharp(buffer).metadata();
  const aspect = meta.width / meta.height;
  let pipeline;
  if (fullBleed && aspect > 0.9 && aspect < 1.1) {
    // Near-square studio photo: fill the square (crops < 5% of backdrop) so no
    // white sliver frames one pair of sides.
    pipeline = sharp(buffer).resize(size, size, { fit: 'cover', position: 'centre' });
  } else {
    const inner = fullBleed ? size : Math.round(size * (1 - 2 * PAD));
    const fitted = await sharp(buffer)
      .resize(inner, inner, { fit: 'contain', background: WHITE })
      .toBuffer();
    pipeline = sharp({ create: { width: size, height: size, channels: 3, background: WHITE } }).composite([
      { input: fitted, gravity: 'centre' },
    ]);
  }
  return pipeline.webp({ quality, effort: 6, smartSubsample: true }).toBuffer();
}

const provenance = {};
const report = [];
let failed = false;
for (const [id, entry] of Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))) {
  if (!entry.file) {
    report.push(`${id}: no image (${(entry.reason ?? '').slice(0, 60)}…) — monogram fallback`);
    continue;
  }
  for (const key of ['sourcePageUrl', 'imageUrl', 'fetchedAt']) {
    if (!entry[key]) {
      console.error(`${id}: manifest entry lacks ${key} — refusing to ship an image without provenance`);
      process.exit(1);
    }
  }
  const prepared = await prepare(join(manifestDir, entry.file));
  const sizes = [];
  for (const { suffix, maxBytes } of SIZES) {
    let out;
    let quality;
    for (quality of QUALITY_STEPS) {
      out = await render(prepared, suffix, quality);
      if (out.length <= maxBytes) break;
    }
    if (out.length > maxBytes) {
      console.error(`${id}-${suffix}: ${out.length} B still over ${maxBytes} B at q${quality}`);
      failed = true;
    }
    const target = join(OUT_DIR, `${id}-${suffix}.webp`);
    writeFileSync(target, out);
    sizes.push(`${suffix}: ${statSync(target).size} B q${quality}`);
  }
  provenance[id] = { sourcePageUrl: entry.sourcePageUrl, imageUrl: entry.imageUrl, fetchedAt: entry.fetchedAt };
  report.push(`${id}: ${prepared.fullBleed ? 'full-bleed' : 'trimmed+padded'} · ${sizes.join(' · ')}`);
}

writeFileSync(PROVENANCE, `${JSON.stringify(provenance, null, 2)}\n`);
console.log(report.join('\n'));
console.log(`optimize-product-images: ${Object.keys(provenance).length} products → ${OUT_DIR}`);
if (failed) process.exit(1);
