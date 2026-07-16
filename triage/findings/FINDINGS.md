# Backlog triage findings (saved session)

Generated: 2026-07-16. Repo: `garrytan/gbrain`.  
Working branch for this dashboard: `cursor/backlog-dashboard-9efd`.

This folder is the durable dump of everything discovered during maintainer triage so it is not stranded in `/tmp` or chat history.

## What’s in this folder

| Path | What it is |
|---|---|
| `FINDINGS.md` | This narrative summary |
| `NEXT_ACTIONS.md` | Ordered checklist of what to do next |
| `audits/summary.json` | Machine-readable rollup |
| `audits/already-fixed-close-results.json` | Per-item already-fixed close/leave-open decisions |
| `audits/already-fixed-reaudit.json` | Post-close residual-warning scan (#1434 class) |
| `audits/already-fixed-summary.md` | Earlier human summary of the already-fixed wave |
| `audits/duplicate-close-wave3.json` | Issue↔PR pair closes (close issue, keep fix PR) |
| `audits/duplicate-wave3-audit.json` | Verification that every keep-PR is still open |
| `audits/label-apply-results.json` | Label apply run results (when present) |
| `verify-2836/` | Windows sync PR verification transcripts |
| `../data/` | Live dashboard snapshot + analysis + caches |

Dashboard UI: `triage/index.html` (serve with `python3 -m http.server 8765` from `triage/`).

---

## Priority labels (what P0–P3 mean)

| Label | Meaning |
|---|---|
| **P0** | Security / data-loss |
| **P1** | Concrete bugs / high-priority fixes |
| **P2** | Features / proposals |
| **P3** | No strong auto signal — needs a quick human glance |

Also applied on GitHub: `duplicate`, `already-fixed`, `proprietary`, `low-value`, `merge-candidate`, `fix-needed`, `needs-review`, `feature-consider`.

---

## Actions already taken on GitHub

### 1. Labels
Full pass over open issues+PRs (~1286 items) with triage dispositions → GitHub labels.

### 2. Already-fixed closes
- Closed **61** items that appeared fixed on master (with comments citing SHAs/PRs).
- Left **11** open when evidence was weak: #11, #14, #223, #555, #699, #1144, #1172, #1331, #1569, #1963, #2050.

### 3. False-positive reopens (#1434 class)
After reaudit of residual / “partial fix” comments, **reopened**:

| Issue | Why reopen |
|---|---|
| [#1434](https://github.com/garrytan/gbrain/issues/1434) | #1456 only covers single non-default source; residual [#2229](https://github.com/garrytan/gbrain/issues/2229) |
| [#1633](https://github.com/garrytan/gbrain/issues/1633) | Maintainer: #1807 fixed orphan-pileup symptom, **not** busy-loop root cause |
| [#1745](https://github.com/garrytan/gbrain/issues/1745) | Open PR [#2730](https://github.com/garrytan/gbrain/pull/2730) still `Fixes #1745` |

Reviewed and **kept closed**: #978, #1404, #1762 (see `audits/summary.json`).

**Rule learned:** do not close as already-fixed when the thread says “partial fix”, files a residual issue, or an open PR still targets the issue.

### 4. Duplicate closes
- Earlier: same-kind exact duplicates + competing PRs closed.
- Wave 3: **29 issues** closed as “tracked by open fix PR”; fix PRs left open; misleading `duplicate` label removed from those PRs.
- Wave 3 audit: **0 problems** (every keep-PR still open).

**Rule learned:** an issue↔PR pair is not a duplicate of the PR. Never close the fix PR.

---

## Windows P0 verification (#2836 / #2828)

No Windows VM in this cloud environment (Linux only; gbrain CI also ubuntu-only).  
Bug class is **path separator string mismatch**, so verification used:

1. PR unit tests — **13/13 pass** (`test/sync-reconcile-mass-delete.test.ts`)
2. Related sync tests — **12/12 pass**
3. `path.win32.relative` simulation of the real call site:
   - Reproduced issue fingerprint (subdir pages look stale; root survives)
   - 1,224-page corpus: old stale **1215** → after fix **0**
   - Mass-delete valve blocks >50% wipe on sources with >20 pages

**Recommendation: merge #2836.**  
Caveat: no real Windows host end-to-end; ask #2828 reporter to confirm after ship.

Artifacts under `verify-2836/`.

---

## Wave 1 — check these first

1. **Merge** [#2836](https://github.com/garrytan/gbrain/pull/2836) (Windows mass-delete) — verified here.
2. Other P0s: #2825, #2684, #2706 (+ #2828 closes with #2836).
3. Merge-candidate skims: #2730 (pairs with #1745), #2440, #2801, #472, #2068, #2632, #2820.
4. Already merged: #2625 (admin token leak).
5. Do **not** re-close: #1434, #2229, #1633, #1745.

Skip bulk P1/P3 until Wave 1 is done.

---

## How to refresh later

```bash
bun triage/scripts/build-dataset.mjs --live
bun triage/scripts/apply-labels.mjs          # only with explicit approval
cd triage && python3 -m http.server 8765
```

Do not batch-close `already-fixed` again without scanning for residual / partial-fix language first.
