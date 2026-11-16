# Project instructions

## Backlog discipline

- BACKLOG.md is the single source of truth for planned work; done items get
  `- [x]` with a dated evidence note.
- A PR that completes a backlog item flips its checkbox in the same PR — an
  unticked done item is a bug.

- Backlog reads are verification passes: before reporting an item as open,
  check it against live state (registry/data files, live site, DNS, account
  APIs). Operator-side items (registrations, secrets, DNS, external accounts)
  can only close this way — once verified done, flip them immediately, in
  whichever repo's backlog they live.

## Promo data

- Promo rows are data only: `packages/data/promos/<region>.json`, written by the hub's PRs. Never add a score, rank or weight field, and never read a promo from a ranking, score or sort function (promo-firewall test).
- A PR that is a promo PR (branch `promo-auto/*` or `promo-review/*`, or title `promo:`) touches only promo files. Only `promo-auto/*` PRs may be auto-merged, and only for non-regulated percent, fixed and shipping rows.
- No promo row, page or badge ships without the deals-page PR (build plan PR 17).
