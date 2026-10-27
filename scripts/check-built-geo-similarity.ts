// Cross-geo similarity gate (geo-regeneration pilot, 2026-10-26).
//
// Policy: a geo section is rebuilt only from its own geo's research; SEA pages
// must not be near-copies of another English region's same-path page (Google
// de-duplicated the cloned English pages of six regions — 2026-09 audit). This
// gate measures every SEA built page against the same-path English page of each
// other region with word-level 8-gram Jaccard similarity over <main> text and
// fails closed: a pair above its allowed ceiling, a missing build, a missing or
// unparsable baseline, an empty/suspicious page, or zero compared pairs exits
// non-zero. Complements e2e/us-cross-region-uniqueness.spec.ts (a sampled
// bigram tripwire with ceiling 0.95); this gate is exhaustive, stricter and
// baseline-ratcheted.
//
// Rule per pair: sim <= max(THRESHOLD 0.45, baseline[page][region] + 0.02).
// Pages absent from the baseline (new pages) must be <= THRESHOLD. The
// baseline may only ratchet DOWN; raising an entry above THRESHOLD requires an
// operator decision recorded in the PR — there is no override flag.
//
// Calibration (measured 2026-10-26 on origin/main d63aa3b3 builds of all 8
// apps, 8-gram word Jaccard over <main> visible text, English pages only):
//   SEA↔US content pages  n=50  median 0.684  p90 0.847  max 1.000
//   SEA↔EU n=46 median 0.761 · SEA↔CA n=48 median 0.744 · SEA↔AU n=49 median 0.687
//   SEA↔JP n=46 median 0.771 · SEA↔GCC n=51 median 0.673 · SEA↔LATAM: no pairs
//   (LATAM root pages are es/pt — 0 English pages)
//   verbatim clones today: ingredients/ and methodology/ index pages at 1.000;
//   shared legal pages (terms/privacy/cookie) 1.000 in every region by design
//   (grandfathered in the baseline); contact 0.56–1.00; imprint 0.62–0.68.
//   Already-localised same-path pages score 0.01–0.17 (home 0.023–0.167,
//   best-nootropics 0.099 vs US); highest distinct same-path pair: countries/
//   index 0.410; partially-localised review pages: 0.46–0.69.
//   THRESHOLD 0.45 sits between the highest distinct same-path pair (0.410) and
//   the lowest clone-ish page (0.459). TOLERANCE 0.02 absorbs rebuild jitter.
//   Within-region sibling ceiling for context: SEA countries/<a>↔<b> up to
//   0.637 (same template, different country) — not compared by this gate.
//
// Runs in CI after all 8 builds are placed (build.yml e2e job) and locally via
// `npm run check:geo-similarity`. Requires all 8 region builds under
// apps/<region>/out/ (or --root); exit 2 = tool/fail-closed, 1 = violations,
// 0 = pass. --write-baseline regenerates scripts/geo-similarity-baseline.json
// from the current builds (run it against a clean origin/main build).
//
//   npx tsx scripts/check-built-geo-similarity.ts [compareRegion...] [--root <monorepo root>] [--write-baseline]
//
// --root scans another checkout's builds (the baseline file itself always
// lives next to this script — it is this branch's policy, not the builds').
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync, type Dirent } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  BASELINE_TOLERANCE,
  LOCALE_PREFIXES,
  MIN_PAGE_TOKENS,
  SIMILARITY_THRESHOLD,
  TECHNICAL_EXCLUDES,
  extractMainText,
  htmlLang,
  isEnglishPage,
  jaccard,
  pairAllowed,
  shingles,
  tokenize,
} from '../packages/ui/src/geo-similarity';

type Baseline = {
  generatedAt: string;
  sourceCommit: string;
  threshold: number;
  tolerance: number;
  pairs: Record<string, Record<string, number>>;
};

const REGIONS = ['us', 'eu', 'ca', 'au', 'jp', 'latam', 'gcc', 'sea'];
const BASE = 'sea';
const args = process.argv.slice(2);
const rootAt = args.indexOf('--root');
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
// --root must be followed by an existing directory; misuse fails closed (exit 2)
// before any scanning, instead of silently resolving '' to the cwd.
function resolveRoot(): string {
  if (rootAt < 0) return resolve(SCRIPT_DIR, '..');
  const value = args[rootAt + 1];
  let isDir = false;
  if (value !== undefined) {
    try {
      isDir = statSync(value).isDirectory();
    } catch {
      isDir = false;
    }
  }
  if (!isDir) {
    console.error(
      `check-built-geo-similarity: --root needs an existing directory as its value (got ${value === undefined ? 'nothing' : JSON.stringify(value)}) — fix the invocation.`,
    );
    process.exit(2);
  }
  return resolve(value);
}
const ROOT = resolveRoot();
const BASELINE_FILE = join(SCRIPT_DIR, 'geo-similarity-baseline.json');
const writeBaseline = args.includes('--write-baseline');
// Positional args narrow the compare regions; sea is the base and never a compare region.
const only = [...new Set(args.filter((a, i) => REGIONS.includes(a) && a !== BASE && args[i - 1] !== '--root'))];
const compareRegions = only.length ? only : REGIONS.filter((r) => r !== BASE);

// Unlike the other post-build gates this one compares regions against each
// other, so partial coverage would silently skip pairs: require all 8 builds.
const missingBuilds = REGIONS.filter((r) => !existsSync(join(ROOT, 'apps', r, 'out', 'index.html')));
if (missingBuilds.length) {
  console.error(
    `check-built-geo-similarity: no build output for ${missingBuilds.join(', ')} under ${ROOT} — this gate needs all 8 region builds; build first.`,
  );
  process.exit(2);
}

let baseline: Baseline | undefined;
if (!writeBaseline) {
  if (!existsSync(BASELINE_FILE)) {
    console.error(
      'check-built-geo-similarity: missing baseline scripts/geo-similarity-baseline.json — fail closed (generate it with --write-baseline against a clean origin/main build).',
    );
    process.exit(2);
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(readFileSync(BASELINE_FILE, 'utf8'));
  } catch {
    console.error('check-built-geo-similarity: scripts/geo-similarity-baseline.json is not parsable JSON — fail closed.');
    process.exit(2);
  }
  const pairs = (parsed as Baseline | null)?.pairs;
  const usable =
    !!pairs && typeof pairs === 'object' && !Array.isArray(pairs) &&
    Object.values(pairs).every(
      (m) => !!m && typeof m === 'object' && !Array.isArray(m) && Object.values(m).every((v) => typeof v === 'number'),
    );
  if (!usable) {
    console.error('check-built-geo-similarity: scripts/geo-similarity-baseline.json has no usable pairs object — fail closed.');
    process.exit(2);
  }
  baseline = parsed as Baseline;
}

/** A filesystem error while scanning is a tool failure (exit 2), never a crash that reads like a violation (exit 1). */
function failFs(err: unknown, path?: string): never {
  const e = err as NodeJS.ErrnoException;
  console.error(
    `check-built-geo-similarity: filesystem error while scanning builds${path ? ` at ${path}` : ''}: ${e?.message ?? String(err)} — tool failure; fail closed (exit 2, not a violation).`,
  );
  process.exit(2);
}

function* pages(dir: string): Generator<string> {
  let entries: Dirent[];
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (err) {
    failFs(err, dir);
  }
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* pages(path);
    else if (entry.name.endsWith('.html')) yield path;
  }
}

function readHtml(file: string): string {
  try {
    return readFileSync(file, 'utf8');
  } catch (err) {
    return failFs(err, file);
  }
}

/** Path relative to the region's out/ with '/' separators (e.g. best-nootropics/index.html). */
function relKey(out: string, file: string): string {
  return relative(out, file).split(sep).join('/');
}

/** Technical error pages and localized subfolders never take part in the gate. */
function inScope(key: string): boolean {
  return !TECHNICAL_EXCLUDES.includes(key) && !LOCALE_PREFIXES.some((p) => key.startsWith(p));
}

/** relKey → shingles + <main> token count for every English, in-scope page of a region's build. */
function englishShingles(region: string): Map<string, { grams: Set<string>; tokens: number }> {
  const out = join(ROOT, 'apps', region, 'out');
  const byKey = new Map<string, { grams: Set<string>; tokens: number }>();
  for (const file of pages(out)) {
    const key = relKey(out, file);
    if (!inScope(key)) continue;
    const html = readHtml(file);
    if (!isEnglishPage(html)) continue; // e.g. LATAM's es/pt pages — simply not compared
    const text = extractMainText(html);
    byKey.set(key, { grams: shingles(text), tokens: tokenize(text).length });
  }
  return byKey;
}

// SEA is the base: every in-scope page must be English and non-empty, or the
// scan itself is broken — refuse to run on such a build.
const seaOut = join(ROOT, 'apps', BASE, 'out');
const seaPages = new Map<string, Set<string>>();
for (const file of pages(seaOut)) {
  const key = relKey(seaOut, file);
  if (!inScope(key)) continue;
  const html = readHtml(file);
  if (!isEnglishPage(html)) {
    console.error(
      `check-built-geo-similarity: sea/${key} is not English (lang="${htmlLang(html)}") — the SEA host must be English; fail closed.`,
    );
    process.exit(2);
  }
  const text = extractMainText(html);
  const tokens = tokenize(text).length;
  if (tokens < MIN_PAGE_TOKENS) {
    console.error(
      `check-built-geo-similarity: sea/${key} has only ${tokens} token(s) of <main> text (< ${MIN_PAGE_TOKENS}; the smallest real SEA page today has 42) — suspicious empty page; fail closed.`,
    );
    process.exit(2);
  }
  seaPages.set(key, shingles(text));
}

const violationLines: string[] = [];
const freshPairs: Record<string, Record<string, number>> = {};
let pairCount = 0;
let grandfathered = 0;
for (const region of compareRegions) {
  const regionPages = englishShingles(region);
  for (const [key, seaGrams] of seaPages) {
    const page = regionPages.get(key);
    if (!page) continue;
    // A paired compare-region page that is essentially empty means that build
    // is broken; scoring it as "dissimilar" would silently pass (fail open).
    if (page.tokens < MIN_PAGE_TOKENS) {
      console.error(
        `check-built-geo-similarity: ${region}/${key} has only ${page.tokens} token(s) of <main> text (< ${MIN_PAGE_TOKENS}) but pairs with a SEA page — suspicious empty compare-region build; fail closed.`,
      );
      process.exit(2);
    }
    pairCount += 1;
    const sim = jaccard(seaGrams, page.grams);
    if (writeBaseline) {
      (freshPairs[key] ??= {})[region] = Math.round(sim * 10000) / 10000;
      continue;
    }
    const entry = baseline?.pairs[key]?.[region];
    if (pairAllowed(sim, entry)) {
      if (entry !== undefined && entry > SIMILARITY_THRESHOLD) grandfathered += 1;
      continue;
    }
    const allowed = entry === undefined
      ? SIMILARITY_THRESHOLD
      : Math.max(SIMILARITY_THRESHOLD, entry + BASELINE_TOLERANCE);
    const why = entry === undefined
      ? '(threshold)'
      : entry + BASELINE_TOLERANCE > SIMILARITY_THRESHOLD
        ? `(baseline ${entry.toFixed(4)} + tol)`
        : `(threshold floor, baseline ${entry.toFixed(4)})`;
    violationLines.push(`sea/${key} vs ${region}: sim ${sim.toFixed(4)} > allowed ${allowed.toFixed(4)} ${why}`);
  }
}

let staleBaselineEntries = 0;
if (baseline) for (const key of Object.keys(baseline.pairs)) if (!seaPages.has(key)) staleBaselineEntries += 1;

console.log(
  `check-built-geo-similarity: regions=[${BASE} vs ${compareRegions.join(',')}] seaPages=${seaPages.size} pairs=${pairCount} ` +
    `violations=${violationLines.length} grandfatheredAboveThreshold=${grandfathered} staleBaselineEntries=${staleBaselineEntries}`,
);
// A scanner that compared nothing reads exactly like a clean pass — refuse it.
if (pairCount === 0) {
  console.error('check-built-geo-similarity: compared 0 pair(s) — refusing to report a pass.');
  process.exit(2);
}

if (writeBaseline) {
  // The baseline may only ratchet DOWN: refuse to silently RAISE an existing
  // ceiling — that is an operator decision recorded in a PR, not a side effect.
  if (existsSync(BASELINE_FILE)) {
    let oldPairs: Record<string, Record<string, number>> | undefined;
    try {
      const parsedOld = JSON.parse(readFileSync(BASELINE_FILE, 'utf8')) as Baseline | null;
      const op = parsedOld?.pairs;
      if (op && typeof op === 'object' && !Array.isArray(op)) oldPairs = op;
    } catch {
      oldPairs = undefined;
    }
    if (!oldPairs) {
      console.error(
        'check-built-geo-similarity: the existing scripts/geo-similarity-baseline.json is unparsable — refusing to overwrite it; delete the file deliberately to re-baseline.',
      );
      process.exit(2);
    }
    const raised: string[] = [];
    for (const [key, regions] of Object.entries(freshPairs)) {
      for (const [region, fresh] of Object.entries(regions)) {
        const old = oldPairs[key]?.[region];
        if (typeof old === 'number' && fresh > old + 0.0001) {
          raised.push(`baseline would RAISE ${key} vs ${region}: ${old} -> ${fresh}`);
        }
      }
    }
    if (raised.length) {
      for (const line of raised) console.error(`check-built-geo-similarity: ${line}`);
      console.error(
        'check-built-geo-similarity: the baseline may only ratchet DOWN; raising a ceiling requires deleting scripts/geo-similarity-baseline.json deliberately (operator decision recorded in a PR). Refusing to write.',
      );
      process.exit(2);
    }
  }
  let sourceCommit = 'unknown';
  try {
    sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT }).toString().trim();
  } catch {
    // no git (or no HEAD) where the builds came from — record 'unknown', don't crash
  }
  // Sorted keys keep the committed JSON diff-stable across rebuilds.
  const sortedPairs: typeof freshPairs = {};
  for (const key of Object.keys(freshPairs).sort()) {
    sortedPairs[key] = Object.fromEntries(Object.entries(freshPairs[key]).sort(([a], [b]) => (a < b ? -1 : 1)));
  }
  const fresh: Baseline = {
    generatedAt: new Date().toISOString(),
    sourceCommit,
    threshold: SIMILARITY_THRESHOLD,
    tolerance: BASELINE_TOLERANCE,
    pairs: sortedPairs,
  };
  writeFileSync(BASELINE_FILE, `${JSON.stringify(fresh, null, 2)}\n`);
  const writtenPairs = Object.values(sortedPairs).reduce((n, m) => n + Object.keys(m).length, 0);
  console.log(`wrote scripts/geo-similarity-baseline.json (${Object.keys(sortedPairs).length} pages, ${writtenPairs} pairs)`);
  process.exit(0);
}

if (violationLines.length) {
  console.error(`check-built-geo-similarity: ${violationLines.length} violation(s):`);
  for (const line of violationLines.slice(0, 300)) console.error(`  ${line}`);
  if (violationLines.length > 300) console.error(`  … ${violationLines.length - 300} more`);
  process.exit(1);
}
console.log(
  `check-built-geo-similarity: OK — ${pairCount} pair(s) within their allowed ceilings (${grandfathered} grandfathered above ${SIMILARITY_THRESHOLD}).`,
);
