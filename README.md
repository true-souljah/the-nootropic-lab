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

Each region is wired to a dedicated Cloudflare Pages project. A push to `main`
that touches `apps/{region}/**` triggers that region's Pages deploy.

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
