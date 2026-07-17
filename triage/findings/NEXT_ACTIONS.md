# Next actions (ordered) — updated 2026-07-16 (evening)

## Done today (verified + executed)

- **Merged 9 PRs:** #2836 (Windows mass-delete P0), #2820 (fix-wave A: tool-loop resume +
  provider fixes, deep-reviewed line-by-line, 542 local tests green), #2698 (P0 #2684
  takes source-scope), #2718 (P0 #2706 image source routing), #2440 (marked.lexer OOM),
  #2801 (shard-flake pin), #472 (BigInt serialization), #2068 (orphan exclusions),
  #2632 (chronicle config keys).
- **Closed 25:** 13 verified close-candidates (see audits/close-verify-summary.md),
  #2730 (superseded on master; loud-stamp re-roll invited), and 11 PRs superseded by
  merged #2820 (#2062 #2065 #2274 #2487 #2336 #2257 #2491 #2614 #2806 #2617 #2572).
- P0 issues #2828, #2684, #2706 resolved via the merges above.

## Do now

1. **Fix #2825** (query_cache ignores hard-excludes — cross-process leak, NO PR exists).
   Triage-verified plan: fold sorted hard-exclude/include prefixes into knobsHash
   (`src/core/search/hybrid.ts` ~1573 + `mode.ts` KnobsHashContext), bump
   KNOBS_HASH_VERSION 11→12, add drift-guard regression test. Size S.
2. **Ship a release** (`/ship`) — 9 merged fixes are sitting unreleased on master;
   #2820 deliberately left the VERSION bump to the release flow.
3. **#2112**: cherry-pick or ask for re-roll of its uncovered doctor.ts hunk
   (explicit models.subagent check) — the rest was superseded by #2820.
   **#2063**: review on its own merits (independent gateway refactor, NOT superseded).
4. **#1745**: main bug fixed on master; keep open only for the loud cycle-stamp
   residual (updateSourceConfig boolean unchecked at cycle.ts stamp site).

## Then: work the queue

`REVIEW_QUEUE.md` — 141 clusters, 757 queued items, leverage-ordered, one
"start here" item per cluster. Top clusters: gateway-misc (3 P0s incl. #160),
PGLite WASM crashes, facts/extract+release-CI chain, multi-source scoping.

## Keep open (do not re-close)

- #1434 (+#2229), #1633, #1745 (residual only)

## Standing rules

- Close-candidate buckets are review-priority hints, NEVER close lists
  (adversarially verified 2026-07-16: only 13/310 were safe — audits/close-verify-summary.md).
- Relabel rescued `duplicate` fix PRs to `fix-needed` when touched.
- `proprietary` auto-label is broken (flags mainstream providers as niche); re-score before use.
- Optional hardening: windows-latest CI job running test/sync-reconcile-mass-delete.test.ts.
