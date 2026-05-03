---
name: pr-draft-summary
description: Create a PR title and draft description for artlyst-manager after substantive code changes are finished.
---

# PR Draft Summary

## Purpose

Produce a concise PR-ready summary for `artlyst-manager` after substantive work is complete.

The output should help the user open a pull request quickly: summarize what changed, why it changed, and any notable impact on Firestore, UI, validation, or verification.

## When to Trigger

- The task is finished or ready for review.
- The work touched runtime code, tests, build/test configuration, or docs with behavior impact.
- Skip for trivial edits or conversation-only tasks.

## Inputs to Collect Automatically

Do not ask the user for these.

- Current branch: `git rev-parse --abbrev-ref HEAD`
- Working tree: `git status -sb`
- Untracked files: `git ls-files --others --exclude-standard`
- Changed files:
  - Unstaged: `git diff --name-only`
  - Staged: `git diff --name-only --cached`
  - Diff summary: `git diff --stat` and `git diff --stat --cached`
- Base reference:
  - `BASE_REF=$(git rev-parse --abbrev-ref --symbolic-full-name @{upstream} 2>/dev/null || echo origin/main)`
  - `BASE_COMMIT=$(git merge-base --fork-point "$BASE_REF" HEAD || git merge-base "$BASE_REF" HEAD || echo "$BASE_REF")`
- Commits ahead of the base: `git log --oneline --no-merges ${BASE_COMMIT}..HEAD`

## Category signals

Use the changed paths to infer the main change type.

- Runtime:
  - `src/`
  - `next.config.ts`
  - `postcss.config.mjs`
- Tests:
  - `vitest.config.mts`
  - `vitest.setup.ts`
  - `src/**/*.test.*`
  - `src/**/*.spec.*`
- Validation / schema / Firestore:
  - `src/schema/`
  - `src/lib/actions/`
  - `src/lib/firestore.ts`
- Build / lint / typecheck:
  - `package.json`
  - `pnpm-lock.yaml`
  - `tsconfig.json`
  - `eslint.config.mjs`
  - `lefthook.yml`
- Docs / repo meta:
  - `AGENTS.md`
  - `README.md`
  - `.github/`
  - `.codex/`

## Workflow

1. Run the commands above and compute `BASE_REF` / `BASE_COMMIT` first.
2. If there are no local changes and no commits ahead of `${BASE_COMMIT}`, reply briefly that no PR draft is needed.
3. Infer whether the work is primarily a `feat`, `fix`, `refactor`, `test`, `docs`, or `chore`.
4. Summarize the change in 1 to 3 short sentences using the most important touched paths and the diff summary.
5. Call out impact when relevant:
   - Firestore data shape or transaction behavior
   - UI behavior or accessibility
   - Validation / schema behavior
   - Verification commands that were run
6. Suggest a branch name only if the current branch is still `main`; otherwise keep the current branch.
7. Draft a Conventional Commit style PR title that matches the primary area, such as `feat(exhibition): ...` or `fix(museum): ...`.
8. Write a compact PR description with:
   - what changed
   - why it changed
   - notable risks or review points

## Output Format

When this summary is useful, append a compact Markdown block in the same language as the surrounding conversation unless the user requests otherwise.

```md
# Pull Request Draft

## Branch name suggestion

git checkout -b <suggested-branch-name>

## Title

<conventional-commit-style title>

## Description

<short PR description covering what changed, why, and any important impact or review points>
```

Keep it concise. Do not repeat the same details across every section, and do not list test commands unless the user asks for them or they are important context.
