# the-nootropic-lab

[![build](https://github.com/true-souljah/the-nootropic-lab/actions/workflows/build.yml/badge.svg?branch=main)](https://github.com/true-souljah/the-nootropic-lab/actions/workflows/build.yml)

Eight-region Next.js 16 monorepo for The Nootropic Lab. Each region ships as a
static export deployed to its own Cloudflare Pages site.

## Layout

```
apps/
  us/  eu/  ca/  au/  jp/  latam/  gcc/  sea/
packages/
  ui/      # shared design-system primitives + page templates
  data/    # product catalog + ingredient library
```

The eight region apps share one `npm` workspace and one lockfile. UI primitives,
page templates, and the affiliate-tracking helper live in `@nootropic/ui`;
product and ingredient data live in `@nootropic/data`.

## Local development

```bash
npm install
npm run dev:us       # or dev:eu, dev:ca, dev:au, dev:jp, dev:latam, dev:gcc, dev:sea
```

## Build

```bash
npm run build:us     # single region
npm run build        # all eight regions in sequence
```

CI runs the same matrix in parallel — see [`.github/workflows/build.yml`](.github/workflows/build.yml).

## Deploy

Each region has its own Cloudflare Pages project. Every push to `main` runs
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which builds
all eight regions in parallel on GitHub runners and uploads each `out/` to its
project with `wrangler pages deploy`, usually within a few minutes of the
merge. Cloudflare's own git builds stay off ("automatic production branch
deployments" and preview deployments disabled on every project): they share
one build slot across the account, and production merges waited 30+ minutes
there. Deploy a single region by hand with
`gh workflow run deploy.yml -f region=<region>`.

## Promo data

Promo rows live in `packages/data/promos/<region>.json` (us, eu, ca, au, latam, gcc, sea; none for jp: held). They sit outside `packages/data/src` on purpose, so a promo change never touches `content-dates.json`. The hub writes them by PR; do not hand-edit except to remove a row. A row is plain text: no link, HTML or Markdown in `headline` or `terms_quote`; `expires` is required; `vendor_domain` must be a vendor store host of that region's catalogue. `npm run validate-data` checks every file; `packages/ui/src/promos.ts` is the schema. No ranking, score or sort code may read a promo field: `packages/ui/src/promo-firewall.test.ts` fails if one does. PRs from `promo-auto/*` or `promo-review/*` (or titled `promo:`) may change only the promo files (`Promo PR scope` check, `scripts/check-promo-pr.ts`).

## Affiliate links: UberNet (Performance Lab, Mind Lab Pro, Pre Lab Pro)

The Performance Lab family (Performance Lab, Mind Lab Pro, Pre Lab Pro) is
tracked through UberNet (affiliate id `a_aid=zid0oxj1g4uny`). The catalogue's
`commissionRate: "30%"` and `cookieDays: 365` for these records were confirmed
by the operator from the UberNet dashboard on 2026-10-08 (the public programme
page publishes no numbers).

- **On these sites** a UberNet DirectLink integration attributes clicks by
  referrer, so a plain vendor URL already earns. Catalogue records still carry
  `?a_aid=zid0oxj1g4uny&a_bid=<brand>` on a **product page** URL
  (`scripts/validate-data.ts` rejects bare homepages and search pages).
- **Off-site** (social posts, forums, guest articles, anything not on a
  thenootropiclab.com host) the referrer is not ours, so use these exact links:
  - Performance Lab: `https://www.performancelab.com/?a_aid=zid0oxj1g4uny&a_bid=a2ad38c1`
  - Mind Lab Pro: `https://www.mindlabpro.com/?a_aid=zid0oxj1g4uny&a_bid=6d45f5c3`
  - Pre Lab Pro: `https://www.prelabpro.com/?a_aid=zid0oxj1g4uny&a_bid=cd5830f2`
  - Nu:tropic: `https://www.nutropic.com/?a_aid=zid0oxj1g4uny&a_bid=daf96cbc` —
    the brand is retired: nutropic.com 301-redirects to the Performance Lab
    catalogue and no Nu:tropic product exists there (checked 2026-10-05), so it
    is not listed in the catalogue.
- Pre Lab Pro is sold only on performancelab.com (prelabpro.com has no product
  page or cart listing; its buy buttons go to
  performancelab.com/products/pre-lab-pro), so its catalogue record links there.
