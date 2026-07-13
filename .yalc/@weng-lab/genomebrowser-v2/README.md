# Genome Browser v2

`@weng-lab/genomebrowser-v2` is the active v2 workspace for the genome browser.

This package is still being shaped. Keep the README focused on the package itself and put maintainer notes in the repository root `docs/` folder.

## Docs

User-facing package docs live in [`./docs`](./docs/) and are intended to ship with the package.

Maintainer docs, design notes, and ADRs live in the repository root `docs/` folder and are not shipped with this package.

## Scripts

Run package scripts through the workspace package manager:

```bash
pnpm --filter @weng-lab/genomebrowser-v2 build
pnpm --filter @weng-lab/genomebrowser-v2 test
pnpm --filter @weng-lab/genomebrowser-v2 lint
pnpm --filter @weng-lab/genomebrowser-v2 format:check
```
