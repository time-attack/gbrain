# Backlog triage dashboard

Read-only checklist UI for the huge open-issue / open-PR backlog on `garrytan/gbrain`.

**This page never comments, labels, closes, or merges on GitHub.** Selections live in your browser `localStorage`. Export a JSON approval manifest and apply actions only after an explicit human OK.

## What’s in here

| Path | Role |
|---|---|
| `index.html` + `app.js` + `styles.css` | Checkbox dashboard (filters, simple explanations, claimed tests, proposed solutions) |
| `data/snapshot.json` | GitHub facts (title, author, snippet, PR merge/CI signals) |
| `data/analysis.json` | Disposition / priority / explanation / solution per item |
| `lib/classify.mjs` | Pure heuristics (duplicates, proprietary, P0 signals, green PRs) |
| `lib/curated.mjs` | Hand overrides from the audit (P0s + strongest merge candidates) |
| `scripts/build-dataset.mjs` | Rebuilds `data/*` from `/tmp` audit caches or live `gh` (read-only) |

## View locally

```bash
# from repo root
bun triage/scripts/build-dataset.mjs          # uses /tmp caches if present
# or:
bun triage/scripts/build-dataset.mjs --live   # gh issue/pr list only

cd triage && python3 -m http.server 8765
# open http://127.0.0.1:8765/
```

## Filters that match the maintainer ask

1. **Duplicates** — exact title clusters + soft TF-IDF neighbors  
2. **Low-value** — chore/dep bumps, draft+DIRTY stacks, thin AI bodies, high-volume noise  
3. **Proprietary** — niche/non-mainstream integrations (recipes for single vendors, Takeout, chat apps, etc.). Generic OpenAI-compatible gateway bugs that merely *mention* DeepSeek/llama-server as repro stay out of this bucket.  
4. **Priority** — P0 security/data-loss first; green+CLEAN PRs as merge candidates  
5. **What was tested** — parsed from PR bodies (author-claimed, not re-executed here)  
6. **Proposed solution** — one-line next step per row  
7. **Export selected JSON** — approval manifest draft for a later human-gated ops pass

## Tests

```bash
bun test triage/test/classify.test.mjs
```

## Refresh policy

Rebuild before a triage session if the backlog moved. Prefer `--live` when `gh` auth works. The committed `data/*.json` is a snapshot so the UI works offline in review PRs.

## Privacy

Do not paste real contact/portfolio names into curated explanations. Upstream GitHub titles may still contain reporter-chosen text; this tool does not rewrite GitHub.
