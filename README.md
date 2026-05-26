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
