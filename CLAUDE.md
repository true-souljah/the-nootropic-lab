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
