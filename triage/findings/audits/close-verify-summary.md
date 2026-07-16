# Close-candidate adversarial verify (2026-07-16)

All 310 open items in the four "closeable" buckets (`duplicate`, `already-fixed`,
`low_value`, `proprietary`) were re-verified by 13 parallel adversarial agents, each
forced to REFUTE the close reason (live GitHub state + PR diffs + code checks against
origin/master @ bb3376e3), defaulting to rescue on uncertainty.

Per-item verdicts: `close-verify-2026-07-16.json`.

## Result: the buckets are NOT a close list

| Bucket | safe_close | rescue | already_closed | total |
|---|---|---|---|---|
| already_fixed | 3 | 8 | 0 | 11 |
| duplicate | 0 | 30 | 19 | 49 |
| low_value | 10 | 203 | 0 | 213 |
| proprietary | 0 | 34 | 3 | 37 |
| **total** | **13** | **275** | **22** | **310** |

Of the 288 still-open items, only **13 (4.5%)** survived verification as closeable.
This is far worse than the 2026-07-13 funnel audit (51% rescue) — these buckets must
never be batch-closed.

## The 13 verified safe closes

| Item | Why |
|---|---|
| PR #2767, #2766, #2765 | Mass skill-pack dumps (100–427 unrelated files each: ads/crypto/marketing packs), off-mission |
| PR #2648, #2548 | timeline_entries.event_page_id bootstrap fix already landed on master |
| PR #2513 | Diff dominated by unrelated CI-workflow deletions; the slug change itself regresses mixed CJK+Latin slugs |
| PR #2485 | Unfocused 29-file dump mixing one small fix with personal debug scripts |
| PR #2432 | Private fork bookkeeping (session notes, personal paths), not upstream-appropriate |
| PR #2159 | Empty diff — merge commit discarded the fix commit's changes |
| PR #1051 | Hardcodes vector(768) breaking default 1536-dim installs; personal .gitignore leaked in |
| Issue #1569 | ReDoS hardening landed (redos-guard.ts caps + runRegexBounded in link-inference.ts) |
| PR #1331 | Design already merged via commit 08cba39f (skillpack-harvest SKILL.md triggers) |
| Issue #699 | provider_id + effective_date columns now in the forward-reference bootstrap on both engines |

## Why each bucket failed

- **duplicate (0% closeable):** the wave-3 pass already closed the ISSUE side of each
  issue↔PR pair — the items still carrying the label are the live FIX PRs. Closing
  them kills the only remaining thread for each bug. 19 others were already closed.
- **proprietary (0% closeable):** almost all touch shared core code (gateway.ts,
  dims.ts, embedding preflight) or follow the shipped recipes/ extension pattern;
  litellm/OpenRouter/Bedrock/Ollama are mainstream, not niche.
- **low_value (5% closeable):** the bucket's signals were "merge conflicts + no test
  evidence + no CI" — first-pass SKIP heuristics, not close reasons. 203 of 213 are
  real fixes/features, many tested, several P0-class (WAL corruption #2232, full-sync
  data-loss guard #2593, JSONB double-encode #1584/#2428, source-isolation #1372/#470,
  prompt-cache no-op #2442).
- **already_fixed (27% closeable):** the 11 left-open residue items were left open for
  good reason — 8 confirmed still broken on master with code-level evidence.

## Rules going forward

1. These labels are REVIEW-PRIORITY hints, not close lists. `rescue` ≠ merge-worthy —
   it means "not safe to close without review".
2. `duplicate` on a PR whose paired issue was closed → relabel to `fix-needed`
   (the label now actively misleads).
3. `proprietary` as auto-applied is broken — the classifier treats any provider name
   as niche. Bucket needs re-scoring before any future use.
4. Before any close wave: adversarial verify + this human gate. No exceptions
   (now confirmed twice, at 51% and 95% false-positive rates).
