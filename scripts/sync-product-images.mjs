#!/usr/bin/env node
// Copies each region's product pack-shots into its app's public/ dir.
//
//   node scripts/sync-product-images.mjs            # all 8 regions
//   node scripts/sync-product-images.mjs us eu      # just these
//
// Source: packages/data/assets/products/<id>-{192,480}.webp for every id in
// packages/data/src/product-images.json. Target: apps/<region>/public/products/,
// holding ONLY the images of products in that region's products-<region>.json
// (stale files from products that left the region are removed). Next's static
// export copies public/ into out/, so the files are served at /products/<file>.
//
// Wired as `prebuild` / `predev` in every apps/<region>/package.json, so it runs
// under `npm run build:<region>` from the root (CI, Cloudflare repo-root
// projects) and `npm run build` inside apps/<region> (Cloudflare root_dir
// projects). The copies are also committed — see the commit that added this
// script — and packages/ui/src/product-images.test.ts fails when they drift.
//
// Node built-ins only: CI and Cloudflare install with `npm ci --omit=dev`.
import { readFileSync, existsSync, mkdirSync, readdirSync, rmSync, copyFileSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];
const SIZES = [192, 480];
const ASSETS = join(ROOT, 'packages', 'data', 'assets', 'products');
const images = JSON.parse(readFileSync(join(ROOT, 'packages', 'data', 'src', 'product-images.json'), 'utf8'));

const args = process.argv.slice(2);
const unknown = args.filter((a) => !REGIONS.includes(a));
if (unknown.length) {
  console.error(`sync-product-images: unknown region(s) ${unknown.join(', ')} — expected ${REGIONS.join(', ')}`);
  process.exit(2);
}

function fail(message) {
  console.error(`sync-product-images: ${message}`);
  process.exit(1);
}

for (const region of args.length ? args : REGIONS) {
  const products = JSON.parse(readFileSync(join(ROOT, 'packages', 'data', 'src', `products-${region}.json`), 'utf8'));
  const ids = products.map((p) => p.id);
  if (ids.length === 0) fail(`${region}: products-${region}.json has no products`);
  const withImage = ids.filter((id) => Object.prototype.hasOwnProperty.call(images, id));
  // Every region sells products that have images; zero means a broken map/path.
  if (withImage.length === 0) fail(`${region}: none of ${ids.length} products has an image — refusing an empty sync`);

  const wanted = withImage.flatMap((id) => SIZES.map((px) => `${id}-${px}.webp`));
  for (const file of wanted) {
    if (!existsSync(join(ASSETS, file))) fail(`${region}: ${file} missing from packages/data/assets/products/`);
  }

  const dest = join(ROOT, 'apps', region, 'public', 'products');
  mkdirSync(dest, { recursive: true });
  const removed = readdirSync(dest).filter((f) => !wanted.includes(f));
  for (const f of removed) rmSync(join(dest, f), { recursive: true, force: true });
  for (const file of wanted) copyFileSync(join(ASSETS, file), join(dest, file));

  const without = ids.filter((id) => !withImage.includes(id));
  console.log(
    `sync-product-images: ${region} → ${withImage.length} products, ${wanted.length} files` +
      (without.length ? ` (monogram: ${without.join(', ')})` : '') +
      (removed.length ? ` (removed stale: ${removed.join(', ')})` : ''),
  );
}
