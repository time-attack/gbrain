# Backlog triage dashboard

Read-only checklist UI for the huge open-issue / open-PR backlog on `garrytan/gbrain`.

**This page never comments, labels, closes, or merges on GitHub.** Selections live in browser `localStorage`. Export a JSON approval manifest and apply actions only after an explicit human OK.

## Maps to the maintainer ask

| # | Ask | Where it lives |
|---|---|---|
| 1 | Duplicates & consolidations | Disposition `duplicate`, `data/consolidations.json`, filter **Duplicates** |
| 2 | Stupid / useless PRs | Disposition `low_value` (+ already_fixed), filter **Low-value / junk** |
| 3 | Proprietary / non-mainstream APIs | Disposition `proprietary`, filter **Proprietary** |
| 4 | Priorities for what’s left | `P0`–`P3`, default **Actionable only**, **Wave 1 (P0 + merge cand.)** |
| 5 | Extra testing | `data/testing-notes.json` + “What was tested” column (local re-runs of overlapping tests for merge candidates) |
| 6 | Simple explanations | Plain templates + small-model rewrites in `data/simple-overrides.json` |
| 7 | Checkbox web dashboard | `index.html` / `app.js` |

## Snapshot (committed data)

Rebuild refreshes these numbers:

- ~1335 open items
- Filtered out (dup / junk / proprietary / already-fixed): see `meta.counts.filteredOut`
- Actionable remainder: see `meta.counts.actionable`
- Green+CLEAN PRs and merge candidates are called out in the rail

## View locally

```bash
bun triage/scripts/build-dataset.mjs          # uses caches /tmp or triage/data
# or: bun triage/scripts/build-dataset.mjs --live

cd triage && python3 -m http.server 8765
# http://127.0.0.1:8765/
```

## Tests

```bash
bun test --cwd triage
bun triage/scripts/deep-test-merge-candidates.mjs   # optional; needs node_modules + /tmp/gbrain-pr-deep
```

## Session findings (saved to disk)

Durable notes from the maintainer triage session (closes, reopens, Windows verify, Wave-1 checklist):

- [`findings/FINDINGS.md`](findings/FINDINGS.md) — full narrative
- [`findings/NEXT_ACTIONS.md`](findings/NEXT_ACTIONS.md) — ordered todo
- [`findings/audits/`](findings/audits/) — JSON audits of already-fixed + duplicate waves
- [`findings/verify-2836/`](findings/verify-2836/) — PR #2836 Windows path verification transcripts

## Privacy / safety

Do not paste real contact names into curated copy. Do not mutate GitHub from this tool unless a human explicitly approves.
