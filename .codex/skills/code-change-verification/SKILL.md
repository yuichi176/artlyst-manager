---
name: code-change-verification
description: Run the mandatory verification stack for artlyst-manager when changes affect runtime code, tests, or build/lint/typecheck configuration.
---

# Code Change Verification

## Overview

Use this skill when changes touch runtime code, tests, or build/lint/typecheck configuration in `artlyst-manager`.

Follow the repository rule in `AGENTS.md`: `pnpm lint` runs with `--fix`, so verification must run in the documented order and should not be abbreviated.

Docs-only or repo-meta changes such as `AGENTS.md`, `README.md`, `.github/`, or `.codex/` usually do not require the full verification stack.

## Quick start

1. Run from the repository root.
2. Prefer `bash .codex/skills/code-change-verification/scripts/run.sh`.
3. If any command fails, fix the issue and rerun the full sequence.
4. Only mark the task complete after the required commands pass.

## Manual workflow

Run these commands in order:

1. `pnpm lint`
2. `pnpm format`
3. `pnpm typecheck`
4. `pnpm test`
5. `pnpm build`

Notes:

- Do not prepend `pnpm i` unless the task explicitly changed dependencies or the lockfile state requires it.
- Do not skip later steps if `pnpm lint` rewrites files.
- If the change only affects docs or repository metadata, state that full verification was intentionally skipped.

## Documentation upkeep

- If verification exposes a durable repository rule or workflow expectation that is not already documented, update the relevant guidance before marking work complete.
- Use `.claude/rules/coding-style.md` for coding-style guidance that should persist across tasks.
- Use `AGENTS.md` for repository-wide contributor, verification, or workflow rules.
- Keep documentation changes concise and general.

## Resources

### scripts/run.sh

- Runs the repository verification commands in the required order with fail-fast behavior.
- Use this script when the full stack is required.
