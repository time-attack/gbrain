# Next actions (ordered)

## Do now

1. **Merge** https://github.com/garrytan/gbrain/pull/2836  
   - Fixes https://github.com/garrytan/gbrain/issues/2828  
   - Local verification saved in `verify-2836/` (unit + path.win32 sim)  
   - After merge: ask Windows reporter on #2828 to re-run `gbrain sync --full`

2. **Skim / merge** these merge-candidates (local overlapping tests already noted in `../data/testing-notes.json` where applicable):
   - https://github.com/garrytan/gbrain/pull/2730 — fix for reopened #1745 (retagged off low-value)
   - https://github.com/garrytan/gbrain/pull/2440
   - https://github.com/garrytan/gbrain/pull/2801
   - https://github.com/garrytan/gbrain/pull/472
   - https://github.com/garrytan/gbrain/pull/2068
   - https://github.com/garrytan/gbrain/pull/2632
   - https://github.com/garrytan/gbrain/pull/2820

3. **P0 issues without an obvious green PR yet** (triage / assign):
   - https://github.com/garrytan/gbrain/issues/2825 — query_cache hard-exclude leak
   - https://github.com/garrytan/gbrain/issues/2684 — CLI take-writes slug-only
   - https://github.com/garrytan/gbrain/issues/2706 — image pages `source_id='default'`

## Keep open (do not re-close)

- https://github.com/garrytan/gbrain/issues/1434 (+ https://github.com/garrytan/gbrain/issues/2229)
- https://github.com/garrytan/gbrain/issues/1633
- https://github.com/garrytan/gbrain/issues/1745

## Already done

- #2625 merged (admin bootstrap token leak)
- Duplicate same-kind closes + wave-3 issue↔PR cleanup
- Already-fixed wave + #1434-class reopens
- Labels applied across open backlog

## Close-candidate buckets: VERIFIED 2026-07-16 — do not batch-close

All 310 `duplicate`/`already-fixed`/`low_value`/`proprietary` items were adversarially
verified (see `audits/close-verify-summary.md`). Only **13 confirmed safe to close**:
PRs #2767 #2766 #2765 #2648 #2548 #2513 #2485 #2432 #2159 #1051 #1331, issues #1569 #699.
Everything else is rescued — treat those labels as review-priority hints only.
The `duplicate` label on open fix PRs (whose paired issue wave-3 closed) actively
misleads; relabel to `fix-needed` when touched.

## Ignore until Wave 1 clears

- Bulk `p1` / `p3` / `needs-review` browsing
- Another mass `already-fixed` close pass (unless residual-safe)

## Optional hardening

- Add a `windows-latest` CI job that runs `bun test test/sync-reconcile-mass-delete.test.ts`
- Refresh snapshot: `bun triage/scripts/build-dataset.mjs --live`
