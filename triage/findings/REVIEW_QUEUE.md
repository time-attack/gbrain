# garrytan/gbrain — cluster-ordered review queue

Generated: 2026-07-16 · Source: `triage/data/analysis.json` (1286 items) + open-item caches + `audits/close-verify-2026-07-16.json`

## How to use this file

Work top to bottom. Each numbered cluster is a connected component of the cross-reference
graph (mentions in titles/bodies, union-find, plus analysis.json canonical/related links),
so reviewing one item usually settles or advances the whole cluster. Check items off as you
dispose of them. The bolded **⟵ start here** item is the suggested entry point: a
merge-candidate PR if one exists, else a fix PR with tests, else the newest fix PR, else the
newest PR, else the top-priority issue.

**Ordering (leverage, descending):** clusters containing a P0 first, then clusters with a
merge-candidate PR, then by score = size × mean priority (P0=4, P1=3, P2=2, P3=1, none=0.5).
Small clusters with a P0 therefore outrank large P1-only clusters — that is intentional.
Singleton P0s and singleton fix-needed PRs follow the clusters.

The ~200-item gateway/provider/tool-loop mega-component was re-clustered by dominant topic
into 16 reviewable sub-clusters (marked `[gateway component]`); its no-dominant-topic
remainder is the `gateway: misc` bucket. The tool-loop resume sub-cluster is **BLOCKED ON
#2820** (fix-wave A, under separate deep review — it supersedes most of that sub-cluster);
skip it until that review lands, then most of its items collapse.

**Exclusions (37 items not queued):** 22 verified already-closed, 13 just closed as safe_close
(PRs #2767 #2766 #2765 #2648 #2548 #2513 #2485 #2432 #2159 #1051 #1331, issues #1569 #699),
PR #2836 (just merged), issue #2828 (closed).

Items tagged `rescued:<bucket>` were close-candidates that survived adversarial verification
(see `audits/close-verify-summary.md`) — the bucket is a review-priority hint only; do NOT
batch-close them.

**Counts:** 141 clusters covering 602 items · 8 singleton merge-candidate PRs · 35 singleton P0s · 112 singleton P1 fix-needed PRs · 275 rescued close-candidates (final section).

---

## Part 1 — Clusters (highest leverage first)

### 1. gateway: misc (chained into the mega-component, no dominant sub-topic) [gateway component]
*leverage 52.0 · 29 items · contains P0*
- [ ] **PR #2528 — fix(files): handle bigint size_bytes in list output (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #160 — extractAndEnrich writes pages from untrusted text without a gate (fix_needed/P0)
- [ ] ISSUE #1001 — RFC: self-hosted shared GBrain readiness for multi-agent use (fix_needed/P0)
- [ ] ISSUE #1522 — IngestionEvent provenance fields (source_id, source_kind, source_uri) dropped by ingest_capture handler before… (fix_needed/P0)
- [ ] ISSUE #1486 — Windows: bun install fails due to Unix shell redirect syntax in postinstall script (fix_needed/P1)
- [ ] PR #1554 — fix(postinstall): cross-platform node shim instead of POSIX shell (fix_needed/P1)
- [ ] ISSUE #2118 — `gbrain search` post-print [last-retrieved] write-back fails with `UNDEFINED_VALUE: Undefined values are not a… (fix_needed/P1)
- [ ] ISSUE #2120 — `config get` reads only the DB plane -- a runtime-effective key in `~/.gbrain/config.json` reports not-found (… (fix_needed/P1)
- [ ] ISSUE #2395 — v0.42.52.0: schema pack "gbrain-base" fails to resolve (bundled but returns 'unknown') (fix_needed/P1)
- [ ] ISSUE #2450 — CLI local-op output normalization crashes on BigInt (cli.ts JSON.stringify has no replacer) (fix_needed/P1)
- [ ] ISSUE #2527 — gbrain files list crashes when Postgres returns size_bytes as bigint (fix_needed/P1)
- [ ] ISSUE #2792 — bug(sources): archive collapses already-archived into a reasonless "Failed to archive" — not idempotent, no di… (fix_needed/P1)
- [ ] ISSUE #976 — RFC: Memory as a coherent operation surface — three-plane cut of operations.ts (feature_consider/P2)
- [ ] ISSUE #1123 — doctor multi_source_drift recommendation references missing CLI surfaces (gbrain delete --source, gbrain sourc… (needs_review/P3)
- [ ] ISSUE #1175 — gbrain sources archive is undocumented in --help (soft-delete discoverability gap) (needs_review/P3)
- [ ] ISSUE #2077 — keyword arm: websearch_to_tsquery ANDs all terms — one absent term zeroes the match; add zero-row OR-fallback (needs_review/P3)
- [ ] ISSUE #2451 — calibration_profile + voice-gate use bare model ids → parseModelId throws "missing a provider prefix" (needs_review/P3)
- [ ] ISSUE #2471 — Takes are never embedded: takes.embedding has no write path and is the wrong dimension (vector(1536) vs the ac… (needs_review/P3)
- [ ] PR #2857 — feat(gateway): config-driven provider_chat_options passthrough (fixes #2577) (proprietary/P3, rescued:proprietary)
- [ ] PR #1177 — feat: --lock-duration and --low-pri-rate-cap flags on gbrain jobs work (low_value/none, rescued:low_value)
- [ ] PR #1858 — fix(takes): honor facts.extraction_model in takes extract --from-pages (duplicate/none, rescued:duplicate)
- [ ] PR #2024 — fix: route Windows PGLite init diagnostics (low_value/none, rescued:low_value)
- [ ] PR #2101 — fix(eval): route LongMemEval models through gateway (low_value/none, rescued:low_value)
- [ ] PR #2246 — Diagnose & recover unclean PGLite data dirs (refs #223) (low_value/none, rescued:low_value)
- [ ] PR #2284 — feat(dream): synthesize backfill loop hardening — configured zeros, bigint child ids, orchestrator-owned front… (duplicate/none, rescued:duplicate)
- [ ] PR #2378 — feat(ai): add Moonshot Kimi provider recipe (duplicate/none, rescued:duplicate)
- [ ] PR #2424 — feat: integrate native GBrain review and evidence fixes (low_value/none, rescued:low_value)
- [ ] PR #2452 — fix(calibration,takes,cli): model resolution, source-scoped takes reads, BigInt-safe output, calibration CLI r… (low_value/none, rescued:low_value)
- [ ] PR #2614 — fix(ai): raise gateway default max output tokens 4096 -> 32000 (low_value/none, rescued:low_value)

### 2. PGLite WASM crashes, init & recovery diagnostics [gateway component]
*leverage 42.5 · 16 items · contains P0*
- [ ] **PR #1671 — docs: add macOS 26.x Tahoe PGLite WASM workaround + native Postgres setup guide (needs_review/P3) ⟵ start here**
- [ ] ISSUE #1954 — PGLite WASM crash on macOS 26.3 — fresh init works briefly then crashes (fix_needed/P0)
- [ ] ISSUE #391 — v0.19 regression: WASM crash now consistent on macOS 25.3 / Bun 1.3.12 (was intermittent in v0.18) (fix_needed/P1)
- [ ] ISSUE #1122 — Fresh PGLite init on v0.35.4.0 + Bun: vector extension fails to load, migrations silently no-op, 'relation pag… (fix_needed/P1)
- [ ] ISSUE #1195 — PGLite WASM `Aborted()` on macOS 15.6 after v0.33 → v0.35 upgrade — diagnostic misattributes to macOS 26.3 bug… (fix_needed/P1)
- [ ] ISSUE #1346 — pglite-engine.ts:connect() swallows Aborted() but never calls NodeFS.repairWal() from the PR #994 overlay (fix_needed/P1)
- [ ] ISSUE #1368 — PGLite: gbrain query without --no-expand hangs at ~100% CPU before producing output (v0.40.2.0) (fix_needed/P1)
- [ ] ISSUE #1502 — PGLite WASM crash on Windows 11 ARM64 (same Aborted() as #223 on macOS arm64) (fix_needed/P1)
- [ ] ISSUE #1549 — PGLite on Windows 10 x64: gbrain init --pglite succeeds but search/think fails — pgvector extension missing fr… (fix_needed/P1)
- [ ] ISSUE #1670 — PGLite crashes on macOS 26.x (Tahoe) due to WASM runtime bug (fix_needed/P1)
- [ ] ISSUE #1870 — PGLite init-failure message hardcodes 'macOS 26.3 WASM bug' on Linux, hiding the real cause (connection conten… (fix_needed/P1)
- [ ] ISSUE #2008 — Windows: username with apostrophe in path breaks gbrain migration — NativeCommandError + WASM/module errors ar… (fix_needed/P1)
- [ ] ISSUE #2195 — PGLite WASM runtime fails on Windows 11 x64 (AMD64) — same Aborted() as #223 / #939 (fix_needed/P1)
- [ ] ISSUE #2674 — Corrupted-store PGLite init abort is mislabeled as the macOS 26.3 WASM bug — banner masks the real cause (fix_needed/P1)
- [ ] ISSUE #939 — PGLite WASM runtime aborts on init (Windows 11 + Bun 1.3.13, gbrain 0.33.1.0) (needs_review/P3)
- [ ] ISSUE #223 — PGLite WASM crash on macOS 26.3 with Bun 1.3.11 (already_fixed/none, rescued:already_fixed)

### 3. facts/extract pipeline, CLI exit-drain & release-CI security (chained mega-cluster)
*leverage 39.5 · 25 items · contains P0*
- [ ] **PR #2104 — fix(facts): durable facts-absorb jobs for one-shot CLI processes + source-scoped fence paths (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2142 — Add artifact attestations for release binaries (fix_needed/P0)
- [ ] ISSUE #2182 — Add scheduled OSV-Scanner dependency vulnerability scan (fix_needed/P0)
- [ ] ISSUE #2272 — Add Semgrep CE SAST workflow for TypeScript security checks (fix_needed/P0)
- [ ] ISSUE #1302 — v0.37.x: brainstorm/lsd judge phase always fails ("parseJudgeJSON: no strategy produced valid JSON") — output … (fix_needed/P1)
- [ ] ISSUE #1466 — Harden fact extraction and think fallback error handling (fix_needed/P1)
- [ ] ISSUE #1747 — extract: 0 wikilink edges on a non-default source populated via `import --source-id` (link resolution appears … (fix_needed/P1)
- [ ] ISSUE #1503 — Cycle extract phase still writes links/timeline to `default` source on federated brains (follow-up to #1204) (needs_review/P3)
- [ ] ISSUE #1520 — query: since/until filters on updated_at instead of effective_date (needs_review/P3)
- [ ] ISSUE #1897 — Conversation parser reads polished body, not raw_transcript sidecar; plain 'Speaker A:' lines never match → 0 … (needs_review/P3)
- [ ] ISSUE #2105 — cli.ts arms the 10s force-exit timer before the shared-op handler — local ops >10s are killed with exit 0 (needs_review/P3)
- [ ] ISSUE #2108 — facts:absorb fire-and-forget jobs are aborted by the 1s exit-drain — silent 100% fact loss on batch put_page i… (needs_review/P3)
- [ ] ISSUE #2113 — facts extraction: finish_reason=length never checked — mandatory-reasoning models silently extract zero facts … (needs_review/P3)
- [ ] ISSUE #2140 — Federated sources never appear in default search; `__all__` sentinel drops default-source results (needs_review/P3)
- [ ] ISSUE #2222 — release.yml: run verify before bun build (needs_review/P3)
- [ ] ISSUE #2228 — Clarify and harden provider-agnostic model config for facts backfill and dream (needs_review/P3)
- [ ] PR #2243 — ci(release): run verify before build (needs_review/P3)
- [ ] ISSUE #2604 — get_timeline: engine implements after/before date filtering but the op exposes only slug — window args silentl… (needs_review/P3)
- [ ] ISSUE #2610 — extract-conversation-facts writes terminal audit rows after swallowed model/config failures (needs_review/P3)
- [ ] PR #2694 — v0.42.57.0 fix(timeline): expose get_timeline date filters (#2604) (needs_review/P3)
- [ ] PR #1706 — query: filter since/until on effective date instead of updated_at (duplicate/none, rescued:duplicate)
- [ ] PR #1719 — fix(extract): thread source id through fs-walk path (closes #1503 defect 1) (low_value/none, rescued:low_value)
- [ ] PR #1898 — fix(conversation-parser): read raw_transcript sidecar + parse plain Speaker A/B lines (duplicate/none, rescued:duplicate)
- [ ] PR #2135 — fix(cli): GBRAIN_EXIT_DRAIN_MS exit-drain knob + arm disconnect watchdog after drain (#2108) (low_value/none, rescued:low_value)
- [ ] PR #2329 — release.yml: run verify before bun build (duplicate/none, rescued:duplicate)

### 4. multi-source scoping, monorepo subdir sync & PGLite doctor/serve
*leverage 37.0 · 17 items · contains P0*
- [ ] **PR #2459 — fix(doctor): treat disabled retrieval reflex as intentional (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #753 — feat: sync should support subdir-of-git-repo as a source (atlas-style monorepo with N logical sources) (fix_needed/P0)
- [ ] ISSUE #1513 — doctor: pgvector and jsonb_integrity checks throw false warnings on PGLite (fix_needed/P0)
- [ ] ISSUE #2706 — Image pages are created with source_id='default' regardless of the syncing source (fix_needed/P0)
- [ ] ISSUE #929 — bug: embed --stale --source should scope stale chunk queries by source_id (fix_needed/P1)
- [ ] PR #1183 — fix(doctor): run PGLite probes through active engine (fix_needed/P1)
- [ ] ISSUE #1205 — autopilot: cached sync anchor commit invalidated by upstream force-push / hard-reset triggers indefinite full-… (fix_needed/P1)
- [ ] PR #2049 — fix(serve): enable parent-death watchdog on Windows via signal-0 liveness probe (fix_needed/P1)
- [ ] ISSUE #2707 — sources add accepts non-git dirs that can never sync; stale last_commit after re-init dies on raw 'git cat-fil… (fix_needed/P1)
- [ ] ISSUE #677 — PGLite MCP server and maintenance commands need a cooperative single-owner mode (needs_review/P3)
- [ ] ISSUE #678 — Support full autopilot/minions/sync-watch features on local PGLite installs (needs_review/P3)
- [ ] ISSUE #784 — CLI: add --source filter to `query` and `search` commands (needs_review/P3)
- [ ] ISSUE #2091 — serve (stdio): engine connects eagerly before the MCP initialize handshake — slow PGLite boot / lock contentio… (needs_review/P3)
- [ ] ISSUE #2458 — PGLite Retrieval Reflex IPC serve can still monopolize DB and hang local CLI commands (needs_review/P3)
- [ ] PR #2718 — v0.42.58.0 fix(import): route image pages by source (#2706) (needs_review/P3)
- [ ] PR #774 — feat(sync): --src-subpath + --exclude for monorepo subdir-source support (low_value/none, rescued:low_value)
- [ ] PR #2092 — fix(serve): answer the MCP initialize handshake before the engine connects — lazy PGLite boot, retryable lock … (low_value/none, rescued:low_value)

### 5. dream/cycle synthesis, chronicle & derive-phase provenance [gateway component]
*leverage 31.5 · 16 items · contains P0*
- [ ] **PR #1837 — fix: make dream extract_facts idempotent so fence rows don't duplicate each cycle (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1619 — gbrain dream: extract phase silently drops all link/timeline batches when the module-singleton DB connection i… (fix_needed/P0)
- [ ] ISSUE #2570 — Add review-first lifecycle for dream/synthesis-generated pages (fix_needed/P0)
- [ ] ISSUE #2786 — bug(chronicle): backfill scoped to a source holding same-slug mirrors silently derives sole-copy db-only life/… (fix_needed/P0)
- [ ] ISSUE #1753 — dream-cycle synthesize writes 0 pages on a remote/Supabase deployment — children fail/timeout (likely #1471); … (fix_needed/P1)
- [ ] ISSUE #2781 — bug(autopilot): interval-derived cycle timeout stamp overrides the #1737 handler anchor — 600s budgets at defa… (fix_needed/P1)
- [ ] ISSUE #2784 — feat(doctor): warn on DB pages with no backing file outside declared db_only paths; ship derive-phase output p… (feature_consider/P2)
- [ ] ISSUE #1471 — resolveLintContentSanity disconnects shared module-level db singleton, killing the cycle's main engine connect… (needs_review/P3)
- [ ] ISSUE #1586 — dream synthesize writes synthesized pages to 'default' source, ignoring the resolved brain source (needs_review/P3)
- [ ] ISSUE #1781 — dream extract_facts non-idempotent: facts + fence rows duplicate each cycle (Postgres engine) (needs_review/P3)
- [ ] ISSUE #2163 — synthesize_concepts writes concept pages that are never chunked/embedded → unreachable by retrieval despite so… (needs_review/P3)
- [ ] ISSUE #2283 — dream synthesize backfill loop drops configured zeros, bigint job ids, deterministic frontmatter, and operator… (needs_review/P3)
- [ ] ISSUE #2415 — dream.synthesize and patterns write to the hardcoded wiki/ namespace with no config override (needs_review/P3)
- [ ] ISSUE #2569 — dream/synthesize: dream_generated provenance is render-time only — generated pages are unqueryable in DB, can … (needs_review/P3)
- [ ] ISSUE #2606 — Chronicle judge: output truncated at maxTokens=1500 is silently recorded as no_events (parse failure indisting… (needs_review/P3)
- [ ] PR #977 — feat: support Codex OAuth for dream synthesis (low_value/none, rescued:low_value)

### 6. subagent orchestration: timeouts, registries, phase gates [gateway component]
*leverage 24.0 · 13 items · contains P0*
- [ ] **PR #2279 — fix(dream): drop ANTHROPIC_API_KEY gate from patterns phase (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #1594 — Dream synthesize: hardcoded 30-min subagent timeout silently drops transcripts (fix_needed/P0)
- [ ] ISSUE #1974 — Subagent tool registry too narrow for cross-namespace research skills (fix_needed/P0)
- [ ] ISSUE #621 — Make dream synthesis and subagent LLM calls provider/helper-friendly (fix_needed/P1)
- [ ] ISSUE #2778 — bug(subagent): fenced allowlist omits add_timeline_entry (the canonical timeline op); 4096-token turn cap + un… (fix_needed/P1)
- [ ] ISSUE #2782 — bug(cycle): patterns phase reports status:ok with child_outcome:timeout and writes nothing when no subagent-ca… (fix_needed/P1)
- [ ] ISSUE #2785 — feat(jobs): plugin-registered job handlers loadable by jobs work — plugins ship subagent defs only, forcing tw… (feature_consider/P2)
- [ ] ISSUE #1306 — PGLite engine: `gbrain dream --phase synthesize` hangs indefinitely (no worker daemon to process queued subage… (needs_review/P3)
- [ ] ISSUE #2207 — litellm: subagent loop falls back to anthropic and dies without ANTHROPIC_API_KEY (chat/expansion touchpoints … (needs_review/P3)
- [ ] ISSUE #2278 — dream patterns phase skips with no_api_key on non-Anthropic stacks even though the subagent submission below r… (needs_review/P3)
- [ ] PR #1596 — fix(synthesize): promote subagent timeouts to config keys (#1594) (low_value/none, rescued:low_value)
- [ ] ISSUE #2050 — autopilot: drain-worker runs at concurrency=1, self-deadlocking any cycle phase that spawns a subagent (patter… (already_fixed/none, rescued:already_fixed)
- [ ] PR #2208 — feat(ai/recipes/litellm): declare chat + expansion touchpoints (#2207) (duplicate/none, rescued:duplicate)

### 7. sync/import ignore & skip rules (.gbrainignore, gitignore, prune, metafiles) [gateway component]
*leverage 21.5 · 12 items · contains P0*
- [ ] **PR #2678 — fix(sources): audit walker inverts pruneDir — nested sources report 0 files scanned (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2404 — ops/ hardcoded in PRUNE_DIR_NAMES: sync silently deletes ops/* pages and never imports ops/* files (fix_needed/P0)
- [ ] ISSUE #449 — Feature: path exclusion for `gbrain sync` (.gbrainignore or sync.exclude) (fix_needed/P1)
- [ ] ISSUE #920 — /sync-gbrain should add .gbrain-source to .gitignore when registering a code source (fix_needed/P1)
- [ ] ISSUE #2788 — feat(sync/doctor): warn when a collector's output dir is declared db_only — auto-gitignore makes sync AND impo… (feature_consider/P2)
- [ ] ISSUE #345 — gbrain import walker doesn't apply isSyncable(); READMEs become orphan pages and drag brain_score (third insta… (needs_review/P3)
- [ ] ISSUE #1073 — sync --strategy code enhancement: honor .gitignore (opt-in flag) (needs_review/P3)
- [ ] ISSUE #1148 — Per-project .gbrainignore (needs_review/P3)
- [ ] ISSUE #2082 — markdown walker ignores .gitignore on full reimport (incremental sync skips those files) — sync.respect_gitign… (needs_review/P3)
- [ ] PR #2462 — [codex] fix frontmatter scans to respect git excludes (needs_review/P3)
- [ ] ISSUE #2688 — import/sync: no way to include gitignored files — git ls-files fast path has no CLI override (stub-git shim is… (needs_review/P3)
- [ ] PR #2315 — fix(import): walker skips SYNC_SKIP_FILES metafiles so import and sync agree (closes #345) (low_value/none, rescued:low_value)

### 8. sync durability: checkpoints, renames, write-through, heartbeat [gateway component]
*leverage 19.5 · 8 items · contains P0*
- [ ] **PR #2402 — fix(sync): crash-safe renames loop — record per-file failures instead of throwing (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2426 — Write-through content stays DB-only and is silently deleted by `sync --full` (3 compounding durability bugs) (fix_needed/P0)
- [ ] ISSUE #1728 — import-checkpoint.json `dir` can resolve to CWD/repo root on SIGTERM — enforce staging-first checkpointing (fix_needed/P1)
- [ ] PR #2335 — v0.42.52.0 fix(sync): bump last_sync_at heartbeat on 0-changes sync (fix_needed/P1)
- [ ] ISSUE #2795 — bug(cli): sync --install-cron exists only in help text — no handler; it silently runs an ordinary sync instead… (fix_needed/P1)
- [ ] ISSUE #2791 — feat(ingestion): ship the audio path — transcription.ts is unimported, gateway transcribe() is a NotMigratedYe… (feature_consider/P2)
- [ ] ISSUE #1856 — Timeline entries on FS/git-canonical brains: `sync` fragments summary-first bullets, and `add_timeline_entry` … (needs_review/P3)
- [ ] PR #1731 — fix(import): make checkpoints staging-first (#1728) (low_value/none, rescued:low_value)

### 9. auth, MCP policy, SSE & agent bindings [gateway component]
*leverage 17.5 · 11 items · contains P0*
- [ ] **PR #1976 — fix(auth): add register-client agent binding flags (fix_needed/P1) ⟵ start here**
- [ ] PR #1560 — [fix] Send admin SSE cookies through reverse proxies (fix_needed/P0)
- [ ] ISSUE #2787 — feat(integrations): heartbeat_max_age health-check type — doctor passes senses that have been dead for weeks (… (feature_consider/P2)
- [ ] ISSUE #2793 — feat(serve): --install (launchd/systemd unit generation) mirroring autopilot --install — MCP serving currently… (feature_consider/P2)
- [ ] ISSUE #84 — Add policy enforcement for destructive MCP tools (delete_page, put_page, sync_brain) (needs_review/P3)
- [ ] ISSUE #912 — Admin dashboard "Live Activity" panel stuck on "connecting…" when serving via reverse proxy — SSE EventSource … (needs_review/P3)
- [ ] ISSUE #1945 — submit_agent bindings gate (operations.ts:2658) is unsatisfiable — --bound-* flags don't exist in `gbrain auth… (needs_review/P3)
- [ ] ISSUE #1971 — gbrain auth register-client missing --bound-* flags for agent-scoped clients (needs_review/P3)
- [ ] ISSUE #2555 — MCP get_chunks returns [] for pages readable via federated grant (outside the token's floor source) (needs_review/P3)
- [ ] ISSUE #2607 — sync --full git fast path bypasses pruneDir/isSyncable — re-imports ops/ and metafile pages that incremental s… (needs_review/P3)
- [ ] PR #975 — feat: legacy SSE MCP transport (GET /sse + POST /messages) (low_value/none, rescued:low_value)

### 10. soft-delete semantics: restore, stats, links
*leverage 13.5 · 7 items · contains P0*
- [ ] **PR #2235 — fix(stats): exclude soft-deleted pages from visible counts (fix_needed/P1) ⟵ start here**
- [ ] PR #1692 — feat(put_page): env-gated auto_link/auto_timeline opt-in for trusted remote callers (fix_needed/P0)
- [ ] ISSUE #1335 — Add `gbrain pages restore <slug>` CLI subcommand (plus `pages` CLI_ONLY registration fix) (fix_needed/P1)
- [ ] ISSUE #1305 — getHealth()/brain_score counts soft-deleted pages while getStats() excludes them (needs_review/P3)
- [ ] ISSUE #1702 — get_links / get_backlinks return links for soft-deleted endpoints (sibling of #1021) (needs_review/P3)
- [ ] ISSUE #1918 — Soft-delete handling cluster: put_page silently writes to soft-deleted records; write_through skips; list_page… (needs_review/P3)
- [ ] PR #1703 — fix(links): exclude soft-deleted endpoints from getLinks/getBacklinks (closes #1702, sibling of #1021) (low_value/none, rescued:low_value)

### 11. feat(engine): opt-in Postgres RLS source-scope binding
*leverage 13.5 · 5 items · contains P0*
- [ ] **PR #2387 — feat(engine): opt-in Postgres RLS source-scope binding (fix_needed/P0) ⟵ start here**
- [ ] ISSUE #2389 — Interest check: RFC 8693 OAuth 2.0 Token Exchange grant for multi-tenant gateways (fix_needed/P0)
- [ ] ISSUE #2454 — Feature: tag-filtered query/search for profile-scoped retrieval (fix_needed/P0)
- [ ] ISSUE #2183 — Add source-aware authority weighting / authority profiles for cross-source search (needs_review/P3)
- [ ] PR #2457 — v0.42.54.0 fix(security): views enforce caller RLS via security_invoker (low_value/none, rescued:low_value)

### 12. fix(search): port the CJK keyword fallback to the Postgres engine (PGLite parity)
*leverage 11.0 · 5 items · contains P0*
- [ ] **PR #2596 — fix(search): port the CJK keyword fallback to the Postgres engine (PGLite parity) (fix_needed/P0) ⟵ start here**
- [ ] ISSUE #584 — Context for PRs #580–#583: i18n + local model support (a thank-you note) (fix_needed/P0)
- [ ] PR #580 — feat(search): make FTS language configurable via GBRAIN_FTS_LANGUAGE (1/3) (feature_consider/P2)
- [ ] PR #581 — feat(schema): v116 migration recreates FTS triggers with configurable language (2/3) (low_value/none, rescued:low_value)
- [ ] PR #582 — feat(cli): add 'gbrain reindex-search-vector' command (3/3) (low_value/none, rescued:low_value)

### 13. Fix upgrade fails to find package.json
*leverage 11.0 · 5 items · contains P0*
- [ ] **PR #1030 — Fix upgrade fails to find package.json (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #486 — check-update --json returns no_releases with empty latest_version (fix_needed/P0)
- [ ] ISSUE #302 — check-update is blind on source-linked installs when origin/master is ahead (fix_needed/P1)
- [ ] ISSUE #2647 — Bun global GitHub install: self-upgrade misses HEAD and direct reinstall fails with DependencyLoop (fix_needed/P1)
- [ ] PR #853 — Fall back to npm for check-update (low_value/none, rescued:low_value)

### 14. frontmatter/markdown parser false positives [gateway component]
*leverage 9.5 · 4 items · contains P0*
- [ ] **PR #2153 — fix(markdown): treat `#` lines inside closed frontmatter as YAML comments, not headings (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1074 — frontmatter audit: false-positive MISSING_OPEN on convention plain-markdown files (CHANGELOG, README, CONTRIBU… (fix_needed/P0)
- [ ] ISSUE #2152 — parseMarkdown flags MISSING_CLOSE on valid YAML # comment lines inside the frontmatter fence (fix_needed/P0)
- [ ] ISSUE #344 — gbrain timeline-add and gbrain link are DB-only; markdown source of truth silently drifts (needs_review/P3)

### 15. fix(minions): restore rolling conversation prompt-cache on the direct SDK path
*leverage 8.5 · 4 items · contains P0*
- [ ] **PR #2771 — fix(minions): restore rolling conversation prompt-cache on the direct SDK path (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2490 — gateway.chat() prompt-cache marker is a silent no-op — cacheSystem never lands a breakpoint on @ai-sdk/anthrop… (fix_needed/P0)
- [ ] ISSUE #2740 — Cache growing conversation history in Anthropic subagent tool loops (needs_review/P3)
- [ ] PR #2442 — v0.42.27.0 fix(ai-gateway): fix silent no-op in Anthropic prompt caching; wire OpenAI prompt_cache_key (low_value/none, rescued:low_value)

### 16. fix(postgres-engine): build-then-swap reconnect() so a failed rebuild can't bric…
*leverage 8.0 · 4 items · contains P0*
- [ ] **PR #1906 — fix(postgres-engine): build-then-swap reconnect() so a failed rebuild can't brick the engine (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1491 — autopilot: minion worker crashes with "No database connection: connect() has not been called" (fix_needed/P0)
- [ ] PR #1891 — fix(retry): reconnect on null instance pool in non-batch config reads (#1593 follow-up) (low_value/none, rescued:low_value)
- [ ] PR #2025 — fix(minions): reconnect worker after promote connection loss (low_value/none, rescued:low_value)

### 17. fix(security): prevent leaking admin bootstrap token to non-TTY stdout
*leverage 8.0 · 2 items · contains P0 · has merge-candidate PR*
- [ ] **PR #2625 — fix(security): prevent leaking admin bootstrap token to non-TTY stdout (merge_candidate/P0) ⟵ start here**
- [ ] ISSUE #2624 — serve --http prints admin token to stdout (leaks into container log storage) (fix_needed/P0)

### 18. Silence doctor progress in JSON mode
*leverage 7.0 · 2 items · contains P0*
- [ ] **PR #851 — Silence doctor progress in JSON mode (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #693 — `gbrain doctor --json` writes progress lines to stderr; `--json` should be silent (fix_needed/P0)

### 19. Proposal: server-side tier-aware boost + split content_hash fast-path for mapper…
*leverage 7.0 · 2 items · contains P0*
- [ ] **ISSUE #638 — Proposal: server-side tier-aware boost + split content_hash fast-path for mapper-only writes (fix_needed/P0) ⟵ start here**
- [ ] ISSUE #648 — fix(chunker): CJK-aware recursive prose chunker (current breaks on no-space CJK paragraphs, produces chunks > … (fix_needed/P1)

### 20. feat(facts): date conversation facts at claim time + owner-trusted local fact re…
*leverage 6.0 · 2 items · contains P0*
- [ ] **PR #2427 — feat(facts): date conversation facts at claim time + owner-trusted local fact reads (fix_needed/P0) ⟵ start here**
- [ ] PR #2357 — feat(conversation-facts): parse Slack block format + route granular collector page-types (feature_consider/P2)

### 21. v0.42.57.0 fix(takes): scope page lookup by source (#2684)
*leverage 5.0 · 2 items · contains P0*
- [ ] **PR #2698 — v0.42.57.0 fix(takes): scope page lookup by source (#2684) (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2684 — CLI take-writes resolve pages by slug only (getPageId has no source filter) - cross-source writes when a slug … (fix_needed/P0)

### 22. feat(jobs): same-day prune via --older-than 0d + optional --status filter
*leverage 4.5 · 2 items · contains P0*
- [ ] **PR #2282 — feat(jobs): same-day prune via --older-than 0d + optional --status filter (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #2281 — gbrain jobs prune cannot clear same-day terminal jobs (--older-than 0d rejected; no --status filter) (fix_needed/P0)

### 23. fix: register missing doctor check names in doctor-categories to stop unknown-ch…
*leverage 4.5 · 2 items · contains P0*
- [ ] **PR #1839 — fix: register missing doctor check names in doctor-categories to stop unknown-check warnings (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #1715 — bug: doctor-categories missing emitted check names, causing unknown-check warnings (fix_needed/P0)

### 24. Clamp remote source overrides
*leverage 4.5 · 2 items · contains P0*
- [ ] **PR #1372 — Clamp remote source overrides (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2098 — bug: thin-client routing drops --source — query/search from a remote-MCP CLI silently search unscoped (fix_needed/P0)

### 25. docs: fix incorrect sources add --strategy code command
*leverage 4.5 · 2 items · contains P0*
- [ ] **PR #900 — docs: fix incorrect sources add --strategy code command (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #456 — docs: incorrect code indexing command (fix_needed/P0)

### 26. Honor positional check-backlinks directory
*leverage 4.5 · 2 items · contains P0*
- [ ] **PR #852 — Honor positional check-backlinks directory (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #485 — check-backlinks <check|fix> [dir] ignores the directory argument (fix_needed/P0)

### 27. fix: Unicode slug support across all 4 validators (closes #738, generalizes #115)
*leverage 4.5 · 2 items · contains P0*
- [ ] **PR #782 — fix: Unicode slug support across all 4 validators (closes #738, generalizes #115) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #738 — Support Unicode Markdown paths in sync slug generation (fix_needed/P0)

### 28. gateway tool-loop resume & multi-turn tool-result persistence [gateway component] **BLOCKED ON #2820 review outcome**
*leverage 39.5 · 21 items · has merge-candidate PR*
- [ ] **PR #2820 — fix(gateway): consolidate tool-loop resume + provider fixes — fix-wave A (supersedes 15 PRs) (merge_candidate/P1) ⟵ start here**
- [ ] ISSUE #1487 — gateway.chat(): incorrect tool schema format breaks non-Anthropic providers (agent.use_gateway_loop) (fix_needed/P1)
- [ ] ISSUE #1886 — multi-turn subagent loop drops tool-result user message → "Tool result is missing for tool call" with DeepSeek… (fix_needed/P1)
- [ ] ISSUE #2039 — gateway toolLoop: no resume reconciliation — crash mid-tool-round leaves a dangling tool-call tail that dead-l… (fix_needed/P1)
- [ ] ISSUE #2110 — Gateway-native tool loop loses tool results on deepseek parallel tool calls; subagent model config keys incons… (fix_needed/P1)
- [ ] ISSUE #2115 — subagent toolLoop: reasoning-model output breaks next-turn history — "Invalid prompt: messages do not match th… (fix_needed/P1)
- [ ] ISSUE #2256 — Gateway subagent loop unreliable for multi-turn tool calls on non-Anthropic providers (resume loop + Date-in-o… (fix_needed/P1)
- [ ] PR #2336 — fix(gateway): recover unbalanced tool-call histories instead of hard-failing the job (fix_needed/P1)
- [ ] ISSUE #2433 — ModelMessage[] schema rejects Date in tool-result output.value (Postgres timestamps crash multi-tool loops) (fix_needed/P1)
- [ ] PR #2487 — fix(subagent): gateway tool-loop drops tool-results on resume → openai-compat dead-letter (fix_needed/P1)
- [ ] ISSUE #2803 — subagent: InvalidPrompt (ModelMessage[] schema) from AI SDK v6 Zod discriminator race — 87% failure (fix_needed/P1)
- [ ] ISSUE #1157 — Feature: Allow configurable Anthropic-compatible provider list for subagent loop (proprietary/P3, rescued:proprietary)
- [ ] ISSUE #2273 — gateway-loop subagent path never persists tool-result user turns — every resume rebuilds an unbalanced convers… (needs_review/P3)
- [ ] ISSUE #2609 — gateway-native loop: tool results executed but never threaded back for OpenAI-compatible providers — subagent … (needs_review/P3)
- [ ] PR #2062 — fix(gateway): reconcile dangling tool-call replay (low_value/none, rescued:low_value)
- [ ] PR #2063 — test(ai): pin gateway tool schema conversion (low_value/none, rescued:low_value)
- [ ] PR #2065 — fix: persist gateway tool-result turns (low_value/none, rescued:low_value)
- [ ] PR #2112 — Fix gateway subagent replay reconciliation (low_value/none, rescued:low_value)
- [ ] PR #2257 — fix(subagent): reliable gateway tool-loop for non-Anthropic providers (persist tool-result messages + JSON-nor… (duplicate/none, rescued:duplicate)
- [ ] PR #2274 — fix(subagent): persist + reconcile tool-result turns in the gateway loop (duplicate/none, rescued:duplicate)
- [ ] PR #2491 — fix(ai): serialize Date in tool-result json output so Postgres timestamps don't crash multi-tool loops (#2433) (duplicate/none, rescued:duplicate)

### 29. schema packs: bundled-pack resolution + extends/borrow_from merge
*leverage 21.5 · 12 items · has merge-candidate PR*
- [ ] **PR #1707 — schema: resolve all bundled packs in schema use, not just gbrain-base (merge_candidate/P2) ⟵ start here**
- [ ] ISSUE #1574 — schema fork/show/diff/lint/validate `gbrain-base-v2` fails with "Unknown pack" — `packPathByName` only resolve… (fix_needed/P1)
- [ ] PR #1799 — fix(schema-pack): parseYamlMini fails loud on block scalars instead of silently truncating (#1750) (fix_needed/P1)
- [ ] ISSUE #2109 — gbrain-base-v2 removes the meeting type but extract-timeline-from-meetings hardcodes type='meeting' — unify-ty… (fix_needed/P1)
- [ ] PR #2856 — fix(schema-pack): merge extends chain + borrow_from into the resolved manifest (#1749) (fix_needed/P1)
- [ ] ISSUE #2323 — Proposal: `gbrain-life` domain pack — personal-life page types + calibration domains (kids, home, warranties, … (feature_consider/P2)
- [ ] ISSUE #1668 — Brain taxonomy redesign: 6 record-intent primitives, gbrain-core/domain-pack split, ulid identity, idempotent … (needs_review/P3)
- [ ] ISSUE #1726 — Observability: list_schema_packs hardcodes 2 of 7 bundled packs; no persistent config key for calibration holder (needs_review/P3)
- [ ] ISSUE #1749 — Schema-pack extends/borrow_from never merges parent page_types — lens packs silently resolve to own-types-only (needs_review/P3)
- [ ] ISSUE #1750 — parseYamlMini silently drops every key after a block scalar — gbrain-recommended ships with 0 page_types (needs_review/P3)
- [ ] ISSUE #2117 — `gbrain-base-v2` ships no `phases:` declaration and zero `link_types[].inference` regexes -- extract_atoms is … (needs_review/P3)
- [ ] PR #1838 — fix: merge parent page_types through schema-pack extends/borrow_from chain (duplicate/none, rescued:duplicate)

### 30. fix(config): register Life Chronicle keys so the documented enable command works
*leverage 9.0 · 4 items · has merge-candidate PR*
- [ ] **PR #2632 — fix(config): register Life Chronicle keys so the documented enable command works (merge_candidate/P1) ⟵ start here**
- [ ] PR #2629 — fix(autopilot,eval): make the nightly quality probe enable path work end-to-end (fix_needed/P1)
- [ ] PR #2630 — feat(autopilot): wire the nightly conversation-parser probe into the loop (feature_consider/P2)
- [ ] ISSUE #2653 — dream.drift.enabled gates an unwired scaffold — drift detection never actually ships (needs_review/P3)

### 31. test(doctor): pin embedding dims in hidden-by-search-policy — kill the shard-ord…
*leverage 8.0 · 3 items · has merge-candidate PR*
- [ ] **PR #2801 — test(doctor): pin embedding dims in hidden-by-search-policy — kill the shard-order 1280/1536 flake (merge_candidate/P1) ⟵ start here**
- [ ] PR #2800 — fix(ai): tier-configured models reach the recipe allowlist — current Anthropic models, tier registration, hone… (fix_needed/P1)
- [ ] PR #2799 — fix(pricing): add Sonnet 5 and Fable 5 to the canonical chat-pricing table (merge_candidate/P2)

### 32. fix(takes): bootstrap runs progress through the corpus instead of rescanning the…
*leverage 7.0 · 3 items · has merge-candidate PR*
- [ ] **PR #2638 — fix(takes): bootstrap runs progress through the corpus instead of rescanning the newest slice (merge_candidate/P2) ⟵ start here**
- [ ] PR #2804 — fix(takes): kill the propose_takes rescan loop — zero-claim scans cache, multi-claim pages keep every claim (fix_needed/P1)
- [ ] PR #2805 — feat(models): cycle phases and brainstorm honor the model-tier system (feature_consider/P2)

### 33. fix(import): skip marked.lexer on fence-less pages to avoid bulk-import OOM (#24…
*leverage 6.0 · 2 items · has merge-candidate PR*
- [ ] **PR #2440 — fix(import): skip marked.lexer on fence-less pages to avoid bulk-import OOM (#2437) (merge_candidate/P1) ⟵ start here**
- [ ] ISSUE #2437 — marked.lexer transient-memory amplification OOMs bulk import on fence-less pages (fix_needed/P1)

### 34. fix(extract): deterministic atom slug — stop cross-day + trailing-dash duplicate…
*leverage 4.0 · 2 items · has merge-candidate PR*
- [ ] **PR #2482 — fix(extract): deterministic atom slug — stop cross-day + trailing-dash duplicate atoms (merge_candidate/P2) ⟵ start here**
- [ ] ISSUE #2169 — Feature: semantic clustering + dedup-by-merge command (feature_consider/P2)

### 35. provider recipes & model-id/allowlist rot [gateway component]
*leverage 40.0 · 16 items*
- [ ] **PR #2757 — fix(anthropic): refresh model allowlist for the Claude 5 family (sonnet-5, opus-4-8) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1270 — cross-modal-eval: DEFAULT_SLOTS hardcoded model IDs rot silently (gpt-4o + gemini-1.5-pro + gemini-2.0-flash a… (fix_needed/P1)
- [ ] PR #1854 — fix: 5 Ollama compatibility fixes for local-first usage (fix_needed/P1)
- [ ] PR #1855 — fix: make cycle/brainstorm model assignment configurable via config (fix_needed/P1)
- [ ] PR #1979 — Make propose_takes resilient to missing Anthropic key (fix_needed/P1)
- [ ] ISSUE #2099 — eval longmemeval 404s out-of-the-box: resolveModel's provider-prefixed ids hit the raw Anthropic SDK; extracto… (fix_needed/P1)
- [ ] ISSUE #2507 — Stale Google/Gemini recipe + tier-resolved models not registered in extendedModels (valid Gemini models reject… (fix_needed/P1)
- [ ] PR #2516 — fix(dream): resolve model via gateway tier resolver in propose_takes, grade_takes, calibration_profile (fix_needed/P1)
- [ ] ISSUE #2613 — Google recipe chat allowlist is stale — gemini-1.5-pro is retired on the live API, no current models accepted (fix_needed/P1)
- [ ] ISSUE #2657 — stdio MCP: takesHoldersAllowList hardcoded to ['world'] — no operator override, so non-world takes are unreach… (fix_needed/P1)
- [ ] ISSUE #2689 — Anthropic chat allowlist predates Claude 5: claude-sonnet-5 accepted by config but chat client build fails sil… (fix_needed/P1)
- [ ] PR #1427 — feat(synopsis): tail-truncate documentText for small-model chat handlers (feature_consider/P2)
- [ ] ISSUE #2790 — feat(recipes): calendar-to-brain lookahead window — recipe promises "knows who you're meeting tomorrow" but ev… (feature_consider/P2)
- [ ] ISSUE #1467 — Take proposal workflow: configurable provider, multiple proposals, review CLI (needs_review/P3)
- [ ] ISSUE #1607 — eval cross-modal defaults + native-provider chat allowlists are stale; native-Anthropic gateway 404s valid mod… (needs_review/P3)
- [ ] ISSUE #1857 — takes extract --from-pages hardcodes anthropic:claude-haiku-4-5, silently returns 0 claims on OpenAI-only brains (needs_review/P3)

### 36. jobs/autopilot workers, locks & installers [gateway component]
*leverage 38.0 · 16 items*
- [ ] **PR #1376 — fix(jobs): retry resets started_at + attempts counters (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1868 — autopilot --install: generated launcher assumes macOS/zsh and omits bun from PATH → systemd service crash-loop… (fix_needed/P1)
- [ ] ISSUE #1887 — Postgres engine: post-print [last-retrieved] write-back races connection teardown (write CONNECTION_ENDED) → b… (fix_needed/P1)
- [ ] ISSUE #2116 — `onboard --auto` submits remediation jobs with no worker-liveness check and no inline fallback -- with jobswor… (fix_needed/P1)
- [ ] ISSUE #2234 — autopilot: conversation_facts_backfill 'connect() has not been called' crash-loops, then clean-exits past Rest… (fix_needed/P1)
- [ ] ISSUE #2731 — GBRAIN_DISABLE_DIRECT_POOL is env-only (no config.json plane): daemons/headless jobs silently fall back to the… (fix_needed/P1)
- [ ] ISSUE #2747 — resolveGbrainCliPath() fails inside managed-worker spawn when engine=postgres, silently blocking embed jobs (fix_needed/P1)
- [ ] ISSUE #2783 — bug(jobs): retry never resets started_at/attempts — the wall-clock sweep dead-letters any retry issued past th… (fix_needed/P1)
- [ ] ISSUE #2794 — bug(autopilot): --install never reads or persists --interval — tuning silently dropped at first install and ov… (fix_needed/P1)
- [ ] ISSUE #2845 — Autopilot parent-child lock contention: child 'jobs work' process repeatedly fails to acquire parent's lock (fix_needed/P1)
- [ ] ISSUE #1014 — feat: --lock-duration flag on `gbrain jobs work` to tune the wall-clock dead-letter cap (feature_consider/P2)
- [ ] PR #1185 — feat(integrations/doctor): surface dead-jobs from minions queue (feature_consider/P2)
- [ ] ISSUE #631 — clarify autopilot vs jobs supervisor production deployment shape (needs_review/P3)
- [ ] PR #2408 — v0.44.1.0 fix(extract): subject-scope link-type inference + reserved-slug fuzzy guard (needs_review/P3)
- [ ] ISSUE #2503 — autopilot lock can false-positive when stale PID is reused by unrelated process (needs_review/P3)
- [ ] ISSUE #2796 — docs: worker-concurrency guidance is three-way inconsistent (guides say 4, snippets say 2, real defaults are 1… (needs_review/P3)

### 37. embedding preflight & dims: ollama / litellm / llama-server local providers
*leverage 36.5 · 21 items*
- [ ] **PR #2642 — fix(embedding): per-model native dims for Ollama + explicit dims for … (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2051 — ollama:bge-m3 PGLite init/reinit resolves 768d or rejects native 1024d on v0.42.37.0 (fix_needed/P1)
- [ ] ISSUE #2170 — Ollama provider hardcodes 768d, rejects 1024d models (bge-m3, mxbai-embed-large) (fix_needed/P1)
- [ ] ISSUE #2187 — LiteLLM user-defined embedding models are not recognized as embedding-capable (fix_needed/P1)
- [ ] ISSUE #2251 — Dream cycle: updateSourceConfig array-coercion branch throws "jsonb_each on a non-object", permanently blockin… (fix_needed/P1)
- [ ] ISSUE #2295 — Bug: diagnoseEmbedding() blocks ollama embedding provider (fix_needed/P1)
- [ ] ISSUE #2297 — files upload-raw silently no-ops for small text/PDF (returns success, persists nothing) (fix_needed/P1)
- [ ] ISSUE #2301 — Bug: PGLite init silently falls back to `--no-embedding`, then blocks all recovery paths (fix_needed/P1)
- [ ] ISSUE #2337 — init: refuse explicit --embedding-dimensions for user_provided_models (litellm, llama-server) (fix_needed/P1)
- [ ] ISSUE #2345 — put_page silently no-ops when re-creating a soft-deleted slug (returns created_or_updated, but page stays soft… (fix_needed/P1)
- [ ] ISSUE #1402 — llama-server recipe is missing `dims_options` — both `reinit-pglite` and `init` refuse any custom-dim use (v0.… (proprietary/P3, rescued:proprietary)
- [ ] ISSUE #1674 — Unable to Init with a llama-server embedding model (needs_review/P3)
- [ ] ISSUE #1716 — Embedding: `litellm` recipe is unusable — diagnoseEmbedding rejects it unconditionally (v0.41.x) (proprietary/P3, rescued:proprietary)
- [ ] ISSUE #1812 — isAvailable('embedding') returns false for llama-server/litellm even with a concrete model configured → hybrid… (needs_review/P3)
- [ ] ISSUE #2028 — query embed deadline (~6s) silently degrades hybrid search to keyword-only — empty results for CJK content on … (needs_review/P3)
- [ ] ISSUE #2176 — `litellm:` (and `llama-server:`) embedding setup is a catch-22: `--embedding-dimensions` is required yet rejec… (needs_review/P3)
- [ ] ISSUE #2330 — Diagnostics surface: health reporting is structurally dishonest (omitted checks score as PASS) (needs_review/P3)
- [ ] PR #2316 — fix(files): persist small raw uploads into a per-page .raw/ git sidecar (closes #2297) (low_value/none, rescued:low_value)
- [ ] PR #2398 — v0.42.54.0 fix(reliability): silent-failure wave — upload-raw persistence, PGLite setup hint, honest doctor, c… (low_value/none, rescued:low_value)
- [ ] PR #2496 — v0.42.54.0 fix(ai): embedding preflight accepts user-named models on litellm/llama-server (#1716) (low_value/none, rescued:low_value)
- [ ] PR #2498 — v0.42.54.0 feat(ai): local-provider custom embedding dims + broaden Ollama catalog (#2170 #2271 #2051) (low_value/none, rescued:low_value)

### 38. query expansion, thinking/reasoning knobs & structured output [gateway component]
*leverage 21.0 · 13 items*
- [ ] **PR #2806 — fix(think): give thinking-default Claude 5 models output-token headroom (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2372 — query expansion on OpenAI-compatible providers: silent degradation + no path to strict structured outputs (fix_needed/P1)
- [ ] ISSUE #2577 — chat: no providerOptions passthrough for openai-compatible providers — hybrid-reasoning models (DeepSeek V4) s… (fix_needed/P1)
- [ ] PR #2617 — fix(ai): promote DeepSeek reasoning_content when content is empty (fix_needed/P1)
- [ ] ISSUE #1741 — feat: option to disable thinking/reasoning for openai-compatible providers (feature_consider/P2)
- [ ] ISSUE #1156 — Query expansion silently disabled on OpenAI-compatible endpoints (prompt does not constrain JSON key name) (needs_review/P3)
- [ ] PR #1618 — feat(zhipu): add chat/expansion support + fix expand() for openai-compat providers (proprietary/P3, rescued:proprietary)
- [ ] ISSUE #1779 — Make the reasoning/expansion LLM configurable via provider recipes (parity with embedding providers) (needs_review/P3)
- [ ] ISSUE #1987 — Support prompt caching for OpenRouter Anthropic routes (needs_review/P3)
- [ ] PR #1988 — feat(ai): support OpenRouter prompt caching (proprietary/P3, rescued:proprietary)
- [ ] PR #2373 — feat(ai/gateway): structured-output opt-in + capability-aware expansion fallback (#2372) (proprietary/P3, rescued:proprietary)
- [ ] PR #1135 — Allow explicit expansion_model to fall back to chat-capable providers (low_value/none, rescued:low_value)
- [ ] PR #2670 — fix(gateway): use providerOptions[recipe.id] for thinking disable + add retry loop (low_value/none, rescued:low_value)

### 39. API-key & gateway-config plumbing (config planes, env, secrets) [gateway component]
*leverage 21.0 · 10 items*
- [ ] **PR #2572 — fix: map openrouter_api_key through buildGatewayConfig into gateway env (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #365 — gbrain embed ignores openai_api_key from config.json; reads OPENAI_API_KEY env only (fix_needed/P1)
- [ ] ISSUE #1307 — brainstorm/lsd cross-generation hardcoded to anthropic:claude-sonnet-4-6 — unrunnable without ANTHROPIC_API_KE… (fix_needed/P1)
- [ ] ISSUE #2088 — Long-running jobs worker never refreshes AI gateway config — propose_takes hard-fails per page on hardcoded an… (fix_needed/P1)
- [ ] ISSUE #2119 — `config set anthropic_api_key` writes a config plane the runtime never reads for keys -- and the runtime's own… (fix_needed/P1)
- [ ] ISSUE #2571 — buildGatewayConfig does not map openrouter_api_key into gateway env — chat-based operations fail for file-plan… (fix_needed/P1)
- [ ] ISSUE #2789 — bug(integrations): show/status resolve secrets from process.env only (config-stored creds report [missing]); X… (fix_needed/P1)
- [ ] ISSUE #2608 — autopilot --install wrapper sources ~/.zshrc for API keys — worker env silently lost, every LLM job no-ops wit… (needs_review/P3)
- [ ] ISSUE #2728 — providers command bypasses canonical gateway config (needs_review/P3)
- [ ] PR #2125 — fix(jobs): refresh gateway config for queued AI work (low_value/none, rescued:low_value)

### 40. takes lifecycle: propose / supersede / embed / holders [gateway component]
*leverage 20.5 · 14 items*
- [ ] **PR #2261 — fix(propose-takes): insert sentinel rows for zero-proposal pages to avoid re-extraction every cycle (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2078 — takes supersede looks up its target with active:false — superseding any ACTIVE take fails "Row #N not found" (fix_needed/P1)
- [ ] ISSUE #2529 — serve --http ignores permissions.takes_holders for legacy bearer tokens — remote MCP callers always see only h… (fix_needed/P1)
- [ ] ISSUE #2780 — bug(privacy): derive phases (chronicle/facts/atoms/takes) re-materialize excluded-prefix pages as searchable p… (fix_needed/P1)
- [ ] ISSUE #1412 — gbrain dream propose_takes phase times out on large corpus (3,125 pages) — no configurable timeout or standalo… (needs_review/P3)
- [ ] ISSUE #2079 — `gbrain takes list` parses "list" as a page slug and prints "No takes on list." (needs_review/P3)
- [ ] ISSUE #2089 — takes.embedding has no writer — vector takes search (think takes_vec, takes search) is structurally dead; DDL … (needs_review/P3)
- [ ] ISSUE #2106 — propose_takes re-extracts every zero-take page on every cycle — no negative-result cache (needs_review/P3)
- [ ] ISSUE #2269 — MCP: expose takes_propose_accept / takes_propose_reject so Hermes/OpenClaw can review proposals natively in chat (needs_review/P3)
- [ ] ISSUE #2411 — gbrain takes propose is documented as the promotion path for take_proposals but the CLI command is missing (needs_review/P3)
- [ ] ISSUE #2556 — think --take silently writes no take row (CLI and MCP) (needs_review/P3)
- [ ] PR #2418 — feat: add review-first take proposals (low_value/none, rescued:low_value)
- [ ] PR #2519 — v0.42.54.0 fix(cli): supersede active takes (#2078) (low_value/none, rescued:low_value)
- [ ] PR #2618 — v0.42.57.0 fix(think): persist --take rows (#2556) (low_value/none, rescued:low_value)

### 41. code sync: extensions, chunk metadata, code-source recovery
*leverage 17.0 · 9 items*
- [ ] **PR #1232 — fix(embed): preserve code-chunk metadata across re-embed (#769) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #709 — bug: .astro extension missing from CODE_EXTENSIONS — Astro projects' SFCs invisible to code sync (fix_needed/P1)
- [ ] ISSUE #712 — code-stage sync writes pages with malformed frontmatter (MISSING_OPEN); `reindex-code` reports 'No code pages … (fix_needed/P1)
- [ ] ISSUE #877 — No recovery path when initial code-source import fails to embed (e.g. missing OPENAI_API_KEY at first sync) (fix_needed/P1)
- [ ] ISSUE #710 — MCP `search` tool only searches default source — federated source content missed (needs_review/P3)
- [ ] ISSUE #711 — `gbrain sources list` reports 0 pages for federated sources after successful sync (needs_review/P3)
- [ ] ISSUE #767 — sync --strategy code dropped on first sync via performFullSync (needs_review/P3)
- [ ] ISSUE #769 — Code chunks land in DB with NULL language / symbol_name / symbol_type across all languages (needs_review/P3)
- [ ] PR #850 — Add Astro files to code sync (needs_review/P3)

### 42. wikilink extraction & orphans (Obsidian/PARA brains)
*leverage 14.0 · 9 items*
- [ ] **PR #2866 — fix(links): resolve path-qualified wikilinks outside DIR_PATTERN in the DB/put_page path (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1846 — `extract links` bare-name wikilink resolver inconsistently drops edges on unambiguous targets (fix_needed/P1)
- [ ] ISSUE #1964 — extract links fails to resolve cross-directory wikilinks due to slug/path mismatch (fix_needed/P1)
- [ ] ISSUE #874 — fs wikilink extraction should resolve against synced slugified page slugs (needs_review/P3)
- [ ] ISSUE #1493 — extract links: hardcoded DIR_PATTERN whitelist drops all Obsidian/Notion-style wikilinks silently (created: 0 … (needs_review/P3)
- [ ] ISSUE #2081 — extract links: globalBasename resolution exists but no CLI flag exposes it — cross-folder bare wikilinks under… (needs_review/P3)
- [ ] ISSUE #2215 — gbrain orphans / orphan_ratio overcount on PARA / Obsidian / agent-organized brains — no user-extensible deny … (needs_review/P3)
- [ ] PR #2216 — feat(orphans): user-extensible exclude prefixes via brain config (#2215) (duplicate/none, rescued:duplicate)
- [ ] PR #2384 — feat(extract): PARA-numbered dirs + alias/title/basename wikilink resolution (low_value/none, rescued:low_value)

### 43. fence-write derives the file path from slug, never pages.source_path — fact writ…
*leverage 13.0 · 7 items*
- [ ] **ISSUE #2722 — fence-write derives the file path from slug, never pages.source_path — fact writes to spaced-filename pages fa… (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1841 — PGLite: concurrent gbrain capture during serve corrupts writes (addTag failed / Page not found) and leaves per… (fix_needed/P1)
- [ ] ISSUE #2443 — bug: `gbrain serve` as PID 1 doesn't reap orphaned subprocesses → zombie `git` accumulation → cgroup pids.max … (fix_needed/P1)
- [ ] ISSUE #2308 — jobs supervisor cannot restart after container recreation (gbrain_cycle_locks lease takeover is same-host only) (needs_review/P3)
- [ ] ISSUE #2839 — sync/import and fact-writers use disjoint lock domains — page-lock cannot deliver the atomicity its docstring … (needs_review/P3)
- [ ] ISSUE #2840 — page-lock: `isPidAlive()` silently steals a live lock across PID namespaces (containerized deploys) (needs_review/P3)
- [ ] ISSUE #2843 — sync: the import walker ignores SYNC_SKIP_FILES, so metafile pages are created once then frozen forever — late… (needs_review/P3)

### 44. ZeroEntropy/Voyage embeddings fail with "Invalid JSON response" for multi-chunk …
*leverage 10.0 · 4 items*
- [ ] **ISSUE #1610 — ZeroEntropy/Voyage embeddings fail with "Invalid JSON response" for multi-chunk pages on bun < 1.1.27 (Respons… (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1469 — hybrid `query` returns identical results regardless of input (vector path); `search` (BM25) correct (fix_needed/P1)
- [ ] ISSUE #1484 — `gbrain query` silently defaults to source='default' instead of cross-source — invisible miss when content liv… (fix_needed/P1)
- [ ] ISSUE #1626 — `--source __all__` cross-source query/search intermittently returns "No results" (non-deterministic); single-s… (needs_review/P3)

### 45. v0.42.57.0 fix(cycle): stamp path-derived dream sources (#1869)
*leverage 9.5 · 4 items*
- [ ] **PR #2549 — v0.42.57.0 fix(cycle): stamp path-derived dream sources (#1869) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1869 — gbrain dream --dir <path> never stamps cycle_freshness (only --source does) → brain shows perpetually stale (fix_needed/P1)
- [ ] ISSUE #1872 — systemctl stop of autopilot (SIGTERM) corrupts the PGLite engine — no graceful shutdown (fix_needed/P1)
- [ ] ISSUE #1874 — gbrain doctor always exits 0 even on [FAIL] checks — no exit code / severity signal for monitoring (degradatio… (fix_needed/P1)

### 46. fix(remediation): gate sync/extract recs on real extraction lag, not the stale_p…
*leverage 9.0 · 3 items*
- [ ] **PR #2363 — fix(remediation): gate sync/extract recs on real extraction lag, not the stale_pages proxy (fix_needed/P1) ⟵ start here**
- [ ] PR #2361 — fix(remediation): terminate onboard --auto loop on a terminally-failed step (fix_needed/P1)
- [ ] PR #2362 — fix(onboard): gate extract-ner / timeline recs on whether the action can actually help (fix_needed/P1)

### 47. dims: thread Matryoshka dimensions for Qwen3-Embedding on Ollama
*leverage 8.5 · 5 items*
- [ ] **PR #1072 — dims: thread Matryoshka dimensions for Qwen3-Embedding on Ollama (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1082 — skillpack-check exits 2 under no-brain temp HOME because doctor --fast --json fails (fix_needed/P1)
- [ ] ISSUE #1454 — doctor advertises agent.use_gateway_loop=true as fix, but config CLI rejects it (needs_review/P3)
- [ ] ISSUE #1852 — doctor subagent_capability warns about Anthropic even when agent.use_gateway_loop=true (needs_review/P3)
- [ ] PR #1680 — fix: allow gateway loop config flag (low_value/none, rescued:low_value)

### 48. fix(anomalies): suppress cohorts without enough baseline history
*leverage 8.0 · 4 items*
- [ ] **PR #2382 — fix(anomalies): suppress cohorts without enough baseline history (fix_needed/P1) ⟵ start here**
- [ ] PR #2380 — fix(search): normalize `/` in FTS queries so slash-containing terms match (fix_needed/P1)
- [ ] ISSUE #2383 — Should the `google` embedding recipe declare a default `max_batch_tokens`? (proprietary/P3, rescued:proprietary)
- [ ] ISSUE #2552 — Cloud-tuned embedding defaults (concurrency 20, no_batch_cap, char-based batch estimate) silently wedge CPU-on… (needs_review/P3)

### 49. [fix] Add source scoping to admin OAuth registration
*leverage 8.0 · 4 items*
- [ ] **PR #1558 — [fix] Add source scoping to admin OAuth registration (needs_review/P3) ⟵ start here**
- [ ] ISSUE #1036 — admin: dashboard at :3131/admin does not expose redirect_uris field for OAuth client registration (fix_needed/P1)
- [ ] ISSUE #1490 — admin: "Register Agent" form does not expose source_id / federated_read — multi-source clients silently broken (fix_needed/P1)
- [ ] ISSUE #1914 — DCR clients land with federated_read: {default} only → can't read from federated sources they themselves regis… (needs_review/P3)

### 50. fix(init): seed resolveAIOptions from loadConfig() (closes #203)
*leverage 7.5 · 4 items*
- [ ] **PR #1060 — fix(init): seed resolveAIOptions from loadConfig() (closes #203) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1058 — init: GBRAIN_EMBEDDING_MODEL/DIMENSIONS env vars ignored when no config.json AND no DATABASE_URL (fix_needed/P1)
- [ ] ISSUE #1061 — mcp__gbrain__whoami throws unknown_transport on stdio MCP calls (v0.33 → v0.35.1.0) (fix_needed/P1)
- [ ] ISSUE #203 — init: --provider flags required even when config.json has persisted embedding settings (DX) (needs_review/P3)

### 51. fix(links): resolve [[wikilink]] + exact slug-path values in frontmatter link fi…
*leverage 7.0 · 3 items*
- [ ] **PR #1983 — fix(links): resolve [[wikilink]] + exact slug-path values in frontmatter link fields (fix_needed/P1) ⟵ start here**
- [ ] PR #2406 — feat(links): resolve [[wikilink]] frontmatter values via global_basename (feature_consider/P2)
- [ ] PR #2434 — feat(extract): keep frontmatter links fresh on the incremental cycle (feature_consider/P2)

### 52. connection manager: poolers, IPv6, direct pool [gateway component]
*leverage 6.5 · 3 items*
- [ ] **PR #1006 — fix(connection-manager): skip direct URL derivation for Session Pooler (port 6543) — fixes IPv6-only ECONNREFU… (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1357 — Supabase init falls back to direct IPv6 connection during migrations when pooler URL provided (fix_needed/P1)
- [ ] ISSUE #1641 — Pooler→direct hostname swap in connection-manager.ts breaks IPv4-only networks during `gbrain init --url` (fix_needed/P1)

### 53. fix(cycle): stamp last_full_cycle_at for the source resolved from brainDir
*leverage 6.5 · 3 items*
- [ ] **PR #1993 — fix(cycle): stamp last_full_cycle_at for the source resolved from brainDir (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #1992 — Autopilot keeps cycle_freshness stale: inline cycle never stamps last_full_cycle_at (fix_needed/P1)
- [ ] ISSUE #2060 — autopilot targeted mode can leave cycle_freshness stale without dispatching a source cycle (fix_needed/P1)

### 54. fix(cli): support file input for stdin-backed ops
*leverage 6.5 · 3 items*
- [ ] **PR #1396 — fix(cli): support file input for stdin-backed ops (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1362 — `gbrain put <slug>` fails on Windows with ENOENT: /dev/stdin (fix_needed/P1)
- [ ] ISSUE #1363 — Add --file parameter to bypass Windows pipe buffer limitation (fix_needed/P1)

### 55. calibration & owner identity [gateway component]
*leverage 6.0 · 4 items*
- [ ] **PR #2467 — fix(calibration): resolve owner holder via config (default 'self'), fixes #2464 (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2035 — cli: calibration missing from CLI_ONLY set → "Unknown command" despite dispatch case existing (needs_review/P3)
- [ ] ISSUE #2464 — calibration_profile default holder 'garry' never matches the 'self' holder that consolidate writes → forecasti… (needs_review/P3)
- [ ] ISSUE #2465 — Owner-identity fragmentation: brain owner spans self / brain / people-<owner> holder strings (needs_review/P3)

### 56. fix(scripts): capture check/shard rc before watchdog teardown in no-timeout fall…
*leverage 6.0 · 2 items*
- [ ] **PR #2864 — fix(scripts): capture check/shard rc before watchdog teardown in no-timeout fallback (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2855 — verify/unit parallel runners: no-timeout fallback records the killed watchdog's rc (143) in every sentinel — p… (fix_needed/P1)

### 57. fix(chunker): estimated-token hard cap — URL-dense/CJK-fallback chunks overflow …
*leverage 6.0 · 2 items*
- [ ] **PR #2847 — fix(chunker): estimated-token hard cap — URL-dense/CJK-fallback chunks overflow strict embedding-server token … (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2826 — Chunker emits chunks past strict embedding-server token limits on URL-dense CJK docs (whitespace-word undercou… (fix_needed/P1)

### 58. fix(doctor): scope timeline labels to disambiguate entity coverage vs brain-scor…
*leverage 6.0 · 2 items*
- [ ] **PR #2761 — fix(doctor): scope timeline labels to disambiguate entity coverage vs brain-score component (#2298) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2298 — Bug: doctor mixes entity timeline coverage with whole-brain timeline score (fix_needed/P1)

### 59. fix(cycle): enforce extract-atoms drain deadline
*leverage 6.0 · 2 items*
- [ ] **PR #2752 — fix(cycle): enforce extract-atoms drain deadline (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2750 — fix(cycle): extract-atoms drain window does not bound lock/query/write lifetime (fix_needed/P1)

### 60. fix(test): isolate GBRAIN_HOME in hybrid-reranker integration test (#…
*leverage 6.0 · 2 items*
- [ ] **PR #2640 — fix(test): isolate GBRAIN_HOME in hybrid-reranker integration test (#… (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1527 — Bug: hybrid-reranker-integration.serial.test.ts is non-hermetic (reads ~/.gbrain config) (fix_needed/P1)

### 61. fix(dream): persist oversize-after-split skip to dream_verdicts (#1879)
*leverage 6.0 · 2 items*
- [ ] **PR #1968 — fix(dream): persist oversize-after-split skip to dream_verdicts (#1879) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1879 — dream synthesize: oversized session transcripts silently burn tokens on timeout (need a size guard / pre-chunk) (fix_needed/P1)

### 62. fix(markdown): case-only SLUG_MISMATCH message names the case diff (#1916)
*leverage 6.0 · 2 items*
- [ ] **PR #1966 — fix(markdown): case-only SLUG_MISMATCH message names the case diff (#1916) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1916 — Mixed-case slug: declared with mixed case fails SLUG_MISMATCH against lowercased default with no actionable er… (fix_needed/P1)

### 63. fix(doctor): normalize CRLF in extractTriggers so Windows skill triggers parse
*leverage 6.0 · 2 items*
- [ ] **PR #1149 — fix(doctor): normalize CRLF in extractTriggers so Windows skill triggers parse (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1150 — gbrain doctor reports 39 false mece_gap warnings on Windows (CRLF) — extractTriggers regex requires LF (fix_needed/P1)

### 64. embed preflight rejects user_provided_models recipes even when the config string…
*leverage 6.0 · 2 items*
- [ ] **ISSUE #2676 — embed preflight rejects user_provided_models recipes even when the config string names a model ("requires a sp… (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2675 — user_provided_models recipes (llama-server, litellm): init is a catch-22 — requires --embedding-dimensions, th… (fix_needed/P1)

### 65. gbrain migrate --to pglite: destination not self-bootstrapped + --url arg persis…
*leverage 6.0 · 2 items*
- [ ] **ISSUE #1271 — gbrain migrate --to pglite: destination not self-bootstrapped + --url arg persists secret to dest config.json (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #724 — gbrain migrate should preserve provider_base_urls / embedding_model / embedding_dimensions (fix_needed/P1)

### 66. bug: PGLite apply-migrations wedges with zembed-1 2560d due HNSW index emitted o…
*leverage 6.0 · 2 items*
- [ ] **ISSUE #1189 — bug: PGLite apply-migrations wedges with zembed-1 2560d due HNSW index emitted on migrate path (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1141 — bug: HNSW 2000-dim cap still hit on upgrade path despite #640 fix (zembed-1 2560d, schema v66 → v67) (fix_needed/P1)

### 67. bug: v0.32.2 facts migration dirty-checks unrelated sources before no-op detection
*leverage 6.0 · 2 items*
- [ ] **ISSUE #927 — bug: v0.32.2 facts migration dirty-checks unrelated sources before no-op detection (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #921 — Migration v0.32.2 silently reports status=failed at the CLI surface — no actionable error detail (fix_needed/P1)

### 68. fix(embed): per-batch token cap for OpenAI + opt-in for LiteLLM
*leverage 5.5 · 6 items*
- [ ] **PR #1180 — fix(embed): per-batch token cap for OpenAI + opt-in for LiteLLM (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #970 — Add max_batch_tokens for gemini-embedding-001 recipe (needs_review/P3)
- [ ] ISSUE #1080 — OpenAI/no-max_batch_tokens recipes may need per-key token sub-batching (needs_review/P3)
- [ ] ISSUE #1199 — dashscope: text-embedding-v3 rejects batches > 10 (`InvalidParameter`) — recipe has no `max_batch_count` field (proprietary/P3, rescued:proprietary)
- [ ] ISSUE #1207 — `gbrain import` makes per-file OpenAI embedding calls (~2s/file); batching would give 10-50× speedup (needs_review/P3)
- [ ] ISSUE #1818 — embedBatch() dispatches batches serially — give it bounded parallelism (the embed-stale.ts concurrency pool th… (needs_review/P3)

### 69. recipes: add canonical m365-contacts-to-brain.md (Microsoft Graph contacts → peo…
*leverage 5.5 · 6 items*
- [ ] **ISSUE #1261 — recipes: add canonical m365-contacts-to-brain.md (Microsoft Graph contacts → people/ enrichment) (needs_review/P3) ⟵ start here**
- [ ] ISSUE #1098 — recipes/*: ClawVisor health-check uses /health (masks vault/db degradation) instead of /ready (needs_review/P3)
- [ ] ISSUE #1099 — recipes: add canonical contacts-to-brain.md (Google Contacts → people/ enrichment) (needs_review/P3)
- [ ] ISSUE #1142 — recipes/meeting-sync: add Granola provider support (or sibling granola-sync.md) (needs_review/P3)
- [ ] ISSUE #1143 — integrity check flags type:code pages for bare-tweet phrases (false positives, auto-repair would corrupt source) (needs_review/P3)
- [ ] ISSUE #1144 — brain_score is composition-biased — treats code/calendar pages as entity-narrative pages (orphans, links, time… (already_fixed/none, rescued:already_fixed)

### 70. fix(cycle): tombstone zero-yield pages so extract_atoms stops rediscovering them…
*leverage 5.5 · 4 items*
- [ ] **PR #2145 — fix(cycle): tombstone zero-yield pages so extract_atoms stops rediscovering them (#2144) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2123 — extract_atoms never stamps frontmatter.concepts — synthesize_concepts permanently skips ("no atoms with concep… (needs_review/P3)
- [ ] ISSUE #2144 — extract_atoms: zero-yield pages are rediscovered forever — wedges --drain (false no_progress) and re-spends ni… (needs_review/P3)
- [ ] PR #2124 — fix(cycle): extract_atoms stamps concepts so synthesize_concepts has material (#2123) (duplicate/none, rescued:duplicate)

### 71. fix: merge provider base URL config from DB
*leverage 5.0 · 3 items*
- [ ] **PR #1676 — fix: merge provider base URL config from DB (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #919 — native-openai recipe ignores provider_base_urls for expansion/embedding/chat (proprietary/P3, rescued:proprietary)
- [ ] ISSUE #1664 — `provider_base_urls.llama-server-reranker` is ignored — reranker uses the recipe default, not the configured U… (proprietary/P3, rescued:proprietary)

### 72. Feature request: a cheap/bounded capture mode for the signal-detector (per-captu…
*leverage 5.0 · 3 items*
- [ ] **ISSUE #1751 — Feature request: a cheap/bounded capture mode for the signal-detector (per-capture cost dominated by multi-tur… (feature_consider/P2) ⟵ start here**
- [ ] ISSUE #1732 — Feature request: canonical DB→git reverse-sync for checkout-less (remote/Supabase) brains (feature_consider/P2)
- [ ] ISSUE #1825 — Clarify/source-aware write-through for company-brain sources.local_path repos (needs_review/P3)

### 73. bug: GBRAIN_DISABLE_DIRECT_POOL=1 kill-switch ignored on first connect (Supabase…
*leverage 5.0 · 3 items*
- [ ] **ISSUE #1268 — bug: GBRAIN_DISABLE_DIRECT_POOL=1 kill-switch ignored on first connect (Supabase Session pooler) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1163 — serve: terminal-launched processes accumulate across sessions, exhaust Supabase session pool over days (needs_review/P3)
- [ ] ISSUE #1817 — Recover prepared statements via Supabase Dedicated Pooler (transaction mode) instead of blanket prepare:false … (needs_review/P3)

### 74. feat(skills): skillify vault skills — obsidian-gbrain-safe-index + skill-vault-c…
*leverage 5.0 · 2 items*
- [ ] **PR #2685 — feat(skills): skillify vault skills — obsidian-gbrain-safe-index + skill-vault-capture-policy (fix_needed/P1) ⟵ start here**
- [ ] PR #2686 — feat(skills): harvest awesome-copilot skill registry (feature_consider/P2)

### 75. doctor resolver_health treats ClawHub workspace skills as required gbrain-routab…
*leverage 5.0 · 2 items*
- [ ] **ISSUE #1767 — doctor resolver_health treats ClawHub workspace skills as required gbrain-routable skills (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #386 — Feature request: support overlay skill roots to avoid local-edit conflicts in OpenClaw workspaces (feature_consider/P2)

### 76. fix(schema): make bundled pack inspection truthful
*leverage 4.5 · 4 items*
- [ ] **PR #2029 — fix(schema): make bundled pack inspection truthful (fix_needed/P1) ⟵ start here**
- [ ] PR #2030 — feat(extract): schema-pack frontmatter_links drive extraction, with D4 fail-empty semantics (low_value/none, rescued:low_value)
- [ ] PR #2040 — feat(extract): --frontmatter-only — schema-pack-driven link extraction without legacy typed inference (low_value/none, rescued:low_value)
- [ ] PR #2048 — fix(dream,minions): allow-list-derived paths + config-aware subagent auth — dream cycle on custom schema packs (low_value/none, rescued:low_value)

### 77. fix(ai): emit dimensions for Qwen3-Embedding on openai-compatible path
*leverage 4.5 · 3 items*
- [ ] **PR #2489 — fix(ai): emit dimensions for Qwen3-Embedding on openai-compatible path (fix_needed/P1) ⟵ start here**
- [ ] PR #2455 — feat(ai): add reranker touchpoint to LiteLLM proxy recipe (proprietary/P3, rescued:proprietary)
- [ ] PR #2472 — fix(ai): honor base_urls override for native-anthropic chat/expansion (low_value/none, rescued:low_value)

### 78. test(import-file): isolate GBRAIN_AUDIT_DIR so oversize fixtures don't pollute t…
*leverage 4.5 · 3 items*
- [ ] **PR #2317 — test(import-file): isolate GBRAIN_AUDIT_DIR so oversize fixtures don't pollute the operator's real audit log (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1893 — doctor content_sanity_audit_recent FAIL recurs weekly because audit JSONLs have no native rotation / retention… (fix_needed/P1)
- [ ] ISSUE #2823 — Test suite writes content-sanity audit events into the operator's real ~/.gbrain/audit (GBRAIN_AUDIT_DIR never… (needs_review/P3)

### 79. fix(autopilot): translate positional subcommands (closes #1525)
*leverage 4.5 · 3 items*
- [ ] **PR #1529 — fix(autopilot): translate positional subcommands (closes #1525) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #578 — bug: `gbrain sync --help` fires a live sync instead of printing help (CLI_ONLY commands without per-command he… (fix_needed/P1)
- [ ] ISSUE #1525 — UX trap: `gbrain autopilot status` starts the daemon instead of reporting status (needs_review/P3)

### 80. Support put --file and reject unknown op flags
*leverage 4.5 · 3 items*
- [ ] **PR #856 — Support put --file and reject unknown op flags (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #380 — `gbrain put --file <path>` silently ignored; flag is `--content`, unknown flags should error (fix_needed/P1)
- [ ] ISSUE #2876 — `gbrain list --limit` silently clamps at 100 with no pagination (needs_review/P3)

### 81. fix(webhook): extract links for incremental push syncs
*leverage 4.0 · 2 items*
- [ ] **PR #2850 — fix(webhook): extract links for incremental push syncs (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2849 — GitHub webhook sync can leave link extraction permanently stale (needs_review/P3)

### 82. fix(sources): stop source config re-wrapping into a growing JSON string scalar (…
*leverage 4.0 · 2 items*
- [ ] **PR #2837 — fix(sources): stop source config re-wrapping into a growing JSON string scalar (#2829) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2829 — sources.config grows one encoding layer per sync cycle when corrupted to a string scalar (observed 522MB seria… (needs_review/P3)

### 83. v0.42.58.0 fix(skillopt): emit proposed.md in no-mutate mode (#2635)
*leverage 4.0 · 2 items*
- [ ] **PR #2719 — v0.42.58.0 fix(skillopt): emit proposed.md in no-mutate mode (#2635) (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2635 — skillopt --no-mutate: best.md is written but proposed.md is never emitted (fix_needed/P1)

### 84. fix(extract): --stale sweep runs the real resolver — basename resolution reaches…
*leverage 4.0 · 2 items*
- [ ] **PR #2717 — fix(extract): --stale sweep runs the real resolver — basename resolution reaches stale pages (#2576 bugs 1+3) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2576 — extract --stale silently disables basename resolution (nullResolver) + DIR_PATTERN gaps for non-standard dirs (needs_review/P3)

### 85. v0.42.57.0 fix(schema): count dead prefixes by slug (#2664)
*leverage 4.0 · 2 items*
- [ ] **PR #2697 — v0.42.57.0 fix(schema): count dead prefixes by slug (#2664) (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2664 — schema stats: dead_prefixes false-positives — detectDeadPrefixes matches source_path, so put_page-created page… (fix_needed/P1)

### 86. v0.42.57.0 fix(import): normalize mixed-case slugs (#2680)
*leverage 4.0 · 2 items*
- [ ] **PR #2695 — v0.42.57.0 fix(import): normalize mixed-case slugs (#2680) (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2680 — importFromContent: mixed-case slug rolls back whole import — putPage lowercases via validateSlug, addTag match… (fix_needed/P1)

### 87. fix(dream): stamp incremental extraction watermark
*leverage 4.0 · 2 items*
- [ ] **PR #2637 — fix(dream): stamp incremental extraction watermark (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2636 — Dream incremental extract processes pages but never stamps links_extracted_at (needs_review/P3)

### 88. fix(minions): default timeout for contextual reindex
*leverage 4.0 · 2 items*
- [ ] **PR #2611 — fix(minions): default timeout for contextual reindex (fix_needed/P1) ⟵ start here**
- [ ] PR #2628 — perf(contextual-retrieval): bound per-chunk synopsis concurrency (needs_review/P3)

### 89. Make OAuth token rate limit configurable
*leverage 4.0 · 2 items*
- [ ] **PR #2501 — Make OAuth token rate limit configurable (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2463 — Make OAuth /token rate limiter configurable (fix_needed/P1)

### 90. fix(init): point soul-audit hint at the conversational skill, not a nonexistent …
*leverage 4.0 · 2 items*
- [ ] **PR #2486 — fix(init): point soul-audit hint at the conversational skill, not a nonexistent CLI verb (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2102 — `gbrain init` output advertises a `gbrain soul-audit` command that doesn't exist (needs_review/P3)

### 91. v0.86 fix(cycle): scope dream orphan counts (#2349)
*leverage 4.0 · 2 items*
- [ ] **PR #2368 — v0.86 fix(cycle): scope dream orphan counts (#2349) (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2349 — [bug] dream orphans phase page count is 2x actual (fix_needed/P1)

### 92. Fix task manager live-context contract
*leverage 4.0 · 2 items*
- [ ] **PR #2188 — Fix task manager live-context contract (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2186 — Task list has conflicting write/read contracts — tasks added via daily-task-manager never surface in live cont… (needs_review/P3)

### 93. fix(ai): pass `dimensions` for Google embeddings on openai-compat
*leverage 4.0 · 2 items*
- [ ] **PR #2168 — fix(ai): pass `dimensions` for Google embeddings on openai-compat (fix_needed/P1) ⟵ start here**
- [ ] PR #2164 — feat(recipes): add reranker touchpoint to OpenRouter (proprietary/P3, rescued:proprietary)

### 94. fix(extract): recognize reference wikilinks
*leverage 4.0 · 2 items*
- [ ] **PR #2071 — fix(extract): recognize reference wikilinks (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #2045 — Auto link-extractor never wires `reference`-type pages as link *targets* — `[[reference/X]]` wikilinks stay un… (needs_review/P3)

### 95. fix(embed): label content_chunks.model with the model that produced the vector (…
*leverage 4.0 · 2 items*
- [ ] **PR #1803 — fix(embed): label content_chunks.model with the model that produced the vector (#1717) (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1717 — Embedding: `gbrain embed`/`import` mislabels content_chunks.model as the gateway default (v0.41.x) (needs_review/P3)

### 96. sources.config.federated ignored by unqualified local CLI search/query — federat…
*leverage 4.0 · 2 items*
- [ ] **ISSUE #2561 — sources.config.federated ignored by unqualified local CLI search/query — federated source invisible unless --s… (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1913 — autopilot corrupts sources.config JSONB by appending {last_full_cycle_at} → federated source ends up "isolated" (needs_review/P3)

### 97. proposal: visual semantic units as the PDF primitive — text extraction can't ing…
*leverage 4.0 · 2 items*
- [ ] **ISSUE #2543 — proposal: visual semantic units as the PDF primitive — text extraction can't ingest research papers (feature_consider/P2) ⟵ start here**
- [ ] ISSUE #173 — feat: PDF ingestion (extend gbrain import beyond markdown) (feature_consider/P2)

### 98. Remote `extract_facts` fence-write is not idempotent — 2nd deposit to an already…
*leverage 4.0 · 2 items*
- [ ] **ISSUE #2044 — Remote `extract_facts` fence-write is not idempotent — 2nd deposit to an already-fenced page throws `idx_facts… (fix_needed/P1) ⟵ start here**
- [ ] ISSUE #1867 — Remote `extract_facts` deposits are never re-fenced — `row_num`-NULL backlog grows unboundedly; v0_32_2 is one… (needs_review/P3)

### 99. v0.42.57.0 fix(sync): pin PGLite code sync imports (#2189)
*leverage 3.5 · 2 items*
- [ ] **PR #2586 — v0.42.57.0 fix(sync): pin PGLite code sync imports (#2189) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2189 — gbrain sync (code) fails on ~all files: "undefined is not an object (evaluating 'row.deleted_at')" on PGLite (… (fix_needed/P1)

### 100. fix(schema-pack): narrow stats catch-all so masked errors surface, not fake 0 pa…
*leverage 3.5 · 2 items*
- [ ] **PR #2493 — fix(schema-pack): narrow stats catch-all so masked errors surface, not fake 0 pages (#2466) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2466 — schema stats reports "Total pages: 0" on PGLite despite a populated brain (catch-all in fetchCountRows masks t… (fix_needed/P1)

### 101. fix(rerank): classify missing auth before fallback
*leverage 3.5 · 2 items*
- [ ] **PR #2070 — fix(rerank): classify missing auth before fallback (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2059 — Reranker auth failures (missing ZEROENTROPY_API_KEY) recorded as reason 'unknown' — doctor reranker_health rep… (fix_needed/P1)

### 102. v0.37.6.0 fix: dynamic embedding column write target (closes #1262)
*leverage 3.5 · 2 items*
- [ ] **PR #1263 — v0.37.6.0 fix: dynamic embedding column write target (closes #1262) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1262 — PostgresEngine.upsertChunks ignores embedding_columns registry — writes 2560-dim embeddings into legacy vector… (fix_needed/P1)

### 103. fix: configure AI gateway for hybrid search in LongMemEval benchmark
*leverage 3.5 · 2 items*
- [ ] **PR #942 — fix: configure AI gateway for hybrid search in LongMemEval benchmark (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #940 — LongMemEval harness: missing configureGateway() prevents hybrid search (fix_needed/P1)

### 104. Normalize mixed-case slugs during imports
*leverage 3.5 · 2 items*
- [ ] **PR #855 — Normalize mixed-case slugs during imports (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #430 — `put_page` silently corrupts mixed-case slugs: page row created with lowercased slug, but `upsertChunks` queri… (fix_needed/P1)

### 105. CLI `put`: empty non-TTY stdin silently writes an empty page (0 chunks, invisibl…
*leverage 3.0 · 3 items*
- [ ] **ISSUE #2822 — CLI `put`: empty non-TTY stdin silently writes an empty page (0 chunks, invisible to embed --stale) — stray fi… (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2743 — put_page silently accepts multi-frontmatter content (YAML double-put corruption class) (needs_review/P3)
- [ ] ISSUE #2744 — gbrain extract should run prose-name → slug fanout over meetings/* bodies (needs_review/P3)

### 106. Feature: `gbrain skillpack scaffold --name-prefix <prefix>` to disambiguate gbra…
*leverage 3.0 · 2 items*
- [ ] **ISSUE #1355 — Feature: `gbrain skillpack scaffold --name-prefix <prefix>` to disambiguate gbrain skills in mixed workspaces (feature_consider/P2) ⟵ start here**
- [ ] ISSUE #1917 — gbrain skillpack scaffold can't find gbrain repo root from bun-installed binary (needs_review/P3)

### 107. Feature request: Pluggable embedding providers (Gemini, Voyage, Ollama)
*leverage 3.0 · 2 items*
- [ ] **ISSUE #771 — Feature request: Pluggable embedding providers (Gemini, Voyage, Ollama) (feature_consider/P2) ⟵ start here**
- [ ] ISSUE #1046 — Support hosted Perplexity embeddings without breaking embed jobs (needs_review/P3)

### 108. docs(skills): standardize timeline/back-link format on plain bullet
*leverage 2.0 · 3 items*
- [ ] **PR #1904 — docs(skills): standardize timeline/back-link format on plain bullet (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1895 — extractTimelineFromContent ignores enrich skill's plain-bullet timeline format → timeline_coverage stuck at 0% (needs_review/P3)
- [ ] PR #1896 — fix(extract): recognize plain-bullet timeline format (- YYYY-MM-DD — Summary) (duplicate/none, rescued:duplicate)

### 109. fix(recipes/minimax): add resolveOpenAICompatConfig + chat touchpoint
*leverage 2.0 · 2 items*
- [ ] **PR #2882 — fix(recipes/minimax): add resolveOpenAICompatConfig + chat touchpoint (proprietary/P3, rescued:proprietary) ⟵ start here**
- [ ] ISSUE #1977 — MiniMax recipe: embedding uses wrong request format (texts vs input) + missing chat touchpoint (proprietary/P3, rescued:proprietary)

### 110. v0.42.58.0 fix(pages): restore soft-deleted rows on putPage (#2760)
*leverage 2.0 · 2 items*
- [ ] **PR #2779 — v0.42.58.0 fix(pages): restore soft-deleted rows on putPage (#2760) (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2760 — putPage leaves a soft-deleted page hidden while reporting a successful write (needs_review/P3)

### 111. feat(ai): dashscope-rerank recipe — DashScope serves PLURAL /reranks under compa…
*leverage 2.0 · 2 items*
- [ ] **PR #2644 — feat(ai): dashscope-rerank recipe — DashScope serves PLURAL /reranks under compatible-api (proprietary/P3, rescued:proprietary) ⟵ start here**
- [ ] PR #2643 — fix(ai): enforce provider item-count batch caps (DashScope hard-limits 10 items/request) (proprietary/P3, rescued:proprietary)

### 112. dream: support Codex OAuth synthesize on PGLite
*leverage 2.0 · 2 items*
- [ ] **PR #2214 — dream: support Codex OAuth synthesize on PGLite (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2213 — Dream synthesize can reverse-write nested wiki/ paths for source-aware wiki repos (needs_review/P3)

### 113. Reject unknown init flags before migrate-only
*leverage 2.0 · 2 items*
- [ ] **PR #2201 — Reject unknown init flags before migrate-only (needs_review/P3) ⟵ start here**
- [ ] ISSUE #2185 — parseFlag silently accepts unknown flags (e.g. --dry-run on init --migrate-only no-ops and applies real migrat… (needs_review/P3)

### 114. apply-migrations reports “All migrations up to date” while schema is behind
*leverage 2.0 · 2 items*
- [ ] **ISSUE #1530 — apply-migrations reports “All migrations up to date” while schema is behind (needs_review/P3) ⟵ start here**
- [ ] ISSUE #1081 — Reduce spurious doctor freshness warnings in fixture and test contexts (needs_review/P3)

### 115. v0.42.58.0 fix(doctor): flag embed backfills without a worker (#2557)
*leverage 1.5 · 2 items*
- [ ] **PR #2696 — v0.42.58.0 fix(doctor): flag embed backfills without a worker (#2557) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2557 — Default deployment has no job-queue worker: embed-backfill jobs stay 'waiting' forever (needs_review/P3)

### 116. v0.42.58.0 fix(cycle): make dream lint audit-only (#2661)
*leverage 1.5 · 2 items*
- [ ] **PR #2669 — v0.42.58.0 fix(cycle): make dream lint audit-only (#2661) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2661 — dream lint phase mutates source tree with no no-fix/dry-run mode (needs_review/P3)

### 117. v0.42.58.0 fix(cli): show dream source help (#2356)
*leverage 1.5 · 2 items*
- [ ] **PR #2634 — v0.42.58.0 fix(cli): show dream source help (#2356) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2356 — doctor cycle_freshness recommends dream --source, but dream CLI has no --source (needs_review/P3)

### 118. feat(import): seed a brain from AI chat exports (ChatGPT/Claude) via memvelope e…
*leverage 1.5 · 2 items*
- [ ] **PR #2568 — feat(import): seed a brain from AI chat exports (ChatGPT/Claude) via memvelope envelopes (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #2567 — import: seeding a brain from AI chat exports (ChatGPT/Claude) via memvelope envelopes (needs_review/P3)

### 119. v0.42.54.0 fix(cli): honor search --json output (#2042)
*leverage 1.5 · 2 items*
- [ ] **PR #2531 — v0.42.54.0 fix(cli): honor search --json output (#2042) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2042 — search --json emits empty stdout when engine.disconnect() hangs and CLI force-exits (needs_review/P3)

### 120. v0.42.54.0 fix(schema): skip unsupported large-dim HNSW indexes (#1734)
*leverage 1.5 · 2 items*
- [ ] **PR #2510 — v0.42.54.0 fix(schema): skip unsupported large-dim HNSW indexes (#1734) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1734 — column cannot have more than 4000 dimensions for hnsw index (needs_review/P3)

### 121. fix(cycle): extract_facts guard requires live backing page, not just non-NULL en…
*leverage 1.5 · 2 items*
- [ ] **PR #2497 — fix(cycle): extract_facts guard requires live backing page, not just non-NULL entity_slug (#2484) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2484 — extract_facts dream phase permanently jams on structurally-unfenceable hot-memory rows (guard predicate over-m… (needs_review/P3)

### 122. fix(import): fall back to body H1 for title when frontmatter lacks title: instea…
*leverage 1.5 · 2 items*
- [ ] **PR #2495 — fix(import): fall back to body H1 for title when frontmatter lacks title: instead of slug-derived junk (#2446) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2446 — Importer fabricates junk titles from slug when frontmatter lacks title: — should fall back to body H1 (markdow… (needs_review/P3)

### 123. docs: add retrieval routing hints to search/query help text
*leverage 1.5 · 2 items*
- [ ] **PR #2474 — docs: add retrieval routing hints to search/query help text (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2416 — Concept/landscape queries silently default to keyword search instead of hybrid (`query`) — no affordance steer… (needs_review/P3)

### 124. feat(dream): orchestrator-owned transcript metadata + transcriptSource discovery…
*leverage 1.5 · 2 items*
- [ ] **PR #2286 — feat(dream): orchestrator-owned transcript metadata + transcriptSource discovery field (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #2285 — dream transcript metadata: discovery exposes no source label, date inference fights with content metadata, orc… (needs_review/P3)

### 125. feat(ai): claude-cli recipe for native gateway-based subagent dispatch
*leverage 1.5 · 2 items*
- [ ] **PR #2277 — feat(ai): claude-cli recipe for native gateway-based subagent dispatch (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #334 — feat: Support claude-cli as alternative to Anthropic API for Minions subagent handler (proprietary/P3, rescued:proprietary)

### 126. fix(queue): dead/cancelled jobs no longer block idempotency re-submission
*leverage 1.5 · 2 items*
- [ ] **PR #2253 — fix(queue): dead/cancelled jobs no longer block idempotency re-submission (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #2252 — queue.add() idempotency fast-path returns dead jobs, permanently blocking re-submission (needs_review/P3)

### 127. v0.42.53.0 docs: consolidate GBrain operational documentation (#2211)
*leverage 1.5 · 2 items*
- [ ] **PR #2212 — v0.42.53.0 docs: consolidate GBrain operational documentation (#2211) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2211 — Consolidate operational documentation entrypoints (needs_review/P3)

### 128. fix(onboard): stop dropping onboard-check remediations on the --apply --auto path
*leverage 1.5 · 2 items*
- [ ] **PR #2161 — fix(onboard): stop dropping onboard-check remediations on the --apply --auto path (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #2160 — gbrain onboard --apply --auto returns "Nothing to do" while --check --explain shows auto-eligible recommendati… (needs_review/P3)

### 129. feat(sources): persist + honor --include / --exclude globs across sync and lint …
*leverage 1.5 · 2 items*
- [ ] **PR #2157 — feat(sources): persist + honor --include / --exclude globs across sync and lint (#2156) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2156 — sources: add --include / --exclude glob filters honored by sync AND lint (needs_review/P3)

### 130. fix(doctor): stop claiming "Brain is at target" when the target is unreachable
*leverage 1.5 · 2 items*
- [ ] **PR #2151 — fix(doctor): stop claiming "Brain is at target" when the target is unreachable (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #2150 — gbrain doctor --remediation-plan prints contradictory verdict — "Target unreachable" followed by "Brain is at … (needs_review/P3)

### 131. docs: route non-project correspondence out of issues
*leverage 1.5 · 2 items*
- [ ] **PR #2130 — docs: route non-project correspondence out of issues (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1627 — This is Prior Art. (needs_review/P3)

### 132. fix(doctor): drop dead llm_fallback_enabled recommendation from conversation_for…
*leverage 1.5 · 2 items*
- [ ] **PR #1903 — fix(doctor): drop dead llm_fallback_enabled recommendation from conversation_format_coverage (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1890 — conversation_parser.llm_fallback_enabled / llm_polish are dead config (never read; doctor recommends the no-op) (needs_review/P3)

### 133. feat(reference): reference-only entity flag, exempt from coverage metrics
*leverage 1.5 · 2 items*
- [ ] **PR #1900 — feat(reference): reference-only entity flag, exempt from coverage metrics (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1899 — Canon/reference figures (imported from books/articles) sit permanently red in entity-coverage metrics with no … (needs_review/P3)

### 134. perf(config): batch + cache engine.getConfig to kill ~85 round-trips per query
*leverage 1.5 · 2 items*
- [ ] **PR #1694 — perf(config): batch + cache engine.getConfig to kill ~85 round-trips per query (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #1693 — perf(config): engine.getConfig issues ~85 round-trips per query; batch+cache to fix >5s latency + empty-stdout… (needs_review/P3)

### 135. docs: clarify HTTP localOnly boundary
*leverage 1.5 · 2 items*
- [ ] **PR #1679 — docs: clarify HTTP localOnly boundary (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #1612 — Docs: DEPLOY.md contradicts localOnly remote availability (needs_review/P3)

### 136. fix(cli): wire gbrain bench publish dispatcher (closes #1474)
*leverage 1.5 · 2 items*
- [ ] **PR #1476 — fix(cli): wire gbrain bench publish dispatcher (closes #1474) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #1475 — gbrain config set eval.capture true persists but is not honored at runtime (capture silently no-ops without GB… (needs_review/P3)

### 137. Keep dream JSON dry runs clean
*leverage 1.5 · 2 items*
- [ ] **PR #854 — Keep dream JSON dry runs clean (low_value/none, rescued:low_value) ⟵ start here**
- [ ] ISSUE #394 — gbrain dream --dry-run --json prints [dry-run] preamble on stdout before JSON CycleReport (needs_review/P3)

### 138. feat: replace split Google recipes with unified google-tools-mcp
*leverage 1.5 · 2 items*
- [ ] **PR #127 — feat: replace split Google recipes with unified google-tools-mcp (duplicate/none, rescued:duplicate) ⟵ start here**
- [ ] ISSUE #126 — Replace split Google integration recipes with unified google-tools-mcp (needs_review/P3)

### 139. `gbrain sync` reports `+1 added` but page never persists when ZeroEntropy embedd…
*leverage 1.5 · 2 items*
- [ ] **ISSUE #1438 — `gbrain sync` reports `+1 added` but page never persists when ZeroEntropy embedding step errors (needs_review/P3) ⟵ start here**
- [ ] ISSUE #11 — Feature request: Org-mode (.org) ingestion and sync support (already_fixed/none, rescued:already_fixed)

### 140. v0.42.58.0 fix(config): harden gateway config adapter boundary
*leverage 1.0 · 2 items*
- [ ] **PR #2430 — v0.42.58.0 fix(config): harden gateway config adapter boundary (low_value/none, rescued:low_value) ⟵ start here**
- [ ] PR #2429 — v0.42.57.0 fix(embedding): accept configured user-provided dimensions (low_value/none, rescued:low_value)

### 141. v0.41.29.0 feat(admin): Sources tab + federation management UI (stacked on #1592)
*leverage 1.0 · 2 items*
- [ ] **PR #1601 — v0.41.29.0 feat(admin): Sources tab + federation management UI (stacked on #1592) (low_value/none, rescued:low_value) ⟵ start here**
- [ ] PR #1592 — v0.41.28.0 feat(auth): grant-read / revoke-read / set-federated-read / list-clients (atomic SQL race-safe) (low_value/none, rescued:low_value)

---

## Part 2 — Singleton merge-candidate PRs (cheap wins, no cluster)

- [ ] PR #472 — v0.42.59.0 fix(files): normalize bigint sizes before JSON serialization (merge_candidate/P1)
- [ ] PR #2068 — fix(orphans): exclude generated corpus roots (merge_candidate/P1)
- [ ] PR #477 — v0.42.59.0 fix(autopilot): verify lock holder process before exiting (merge_candidate/P2)
- [ ] PR #1448 — docs: v0.29 to v0.41.2 production upgrade audit — 3 bugs + 8 feature gaps (merge_candidate/P2)
- [ ] PR #2270 — book-mirror: emit HTML <table valign=top> instead of markdown pipe tables (merge_candidate/P2)
- [ ] PR #2524 — feat(extract): recognize inline [Source: ..., YYYY-MM-DD] citations as timeline entries (merge_candidate/P2)
- [ ] PR #2615 — feat(extract_atoms): honor pack manifest extractable flag in page discovery (merge_candidate/P2)
- [ ] PR #2798 — docs: post-release reference-doc sync for v0.42.59.0 (merge_candidate/P2)

## Part 3 — Singleton P0s (no cluster)

- [ ] PR #434 — fix(test): isolate $HOME in mechanical.test.ts so E2E suite stops clobbering user config (fix_needed/P0)
- [ ] PR #2376 — fix(mcp): whoami over stdio returns local identity instead of unknown_transport (fix_needed/P0)
- [ ] PR #2478 — feat(config): auto_link_allow_remote flag for trusted MCP callers (fix_needed/P0)
- [ ] PR #2585 — feat(cycle): accept UUID source ids at the cycle lock via a slug-legal derived token (fix_needed/P0)
- [ ] PR #2709 — fix(sync): allow file transport only for the trusted local durability origin (fix_needed/P0)
- [ ] PR #2711 — feat(skills): harvest android/skills registry (19 skills) (fix_needed/P0)
- [ ] PR #2745 — feat(conversion): add loss-evidence manifest foundation (fix_needed/P0)
- [ ] PR #2827 — fix(SQN-3841): hide archival export snapshots (fix_needed/P0)
- [ ] ISSUE #159 — skills loaded without integrity verification (fix_needed/P0)
- [ ] ISSUE #443 — addLinksBatch: unnest(::text[]) silently drops rows when content contains array-syntax characters (fix_needed/P0)
- [ ] ISSUE #468 — [NaN] score prefix in `gbrain query` output (v0.10.1, Postgres engine) (fix_needed/P0)
- [ ] ISSUE #505 — Security: npm package name `gbrain` is squatted — dependency confusion attack vector (fix_needed/P0)
- [ ] ISSUE #550 — put_page fails with "no unique or exclusion constraint" — writes broken when pages_source_slug_key is missing,… (fix_needed/P0)
- [ ] ISSUE #579 — Security: please enable private vulnerability reporting (fix_needed/P0)
- [ ] ISSUE #617 — doctor: shipped skill routing fixtures produce resolver_health warnings on 0.26.6 (fix_needed/P0)
- [ ] ISSUE #781 — OAuth 2.1 token exchange always fails: getClient returns client_secret_hash where SDK expects plaintext (fix_needed/P0)
- [ ] ISSUE #895 — Ranking results inverted - most relevant content gets lowest score (fix_needed/P0)
- [ ] ISSUE #899 — Incremental extract fails to extract timeline and links for new pages (fix_needed/P0)
- [ ] ISSUE #1035 — put: silent type: concept regression on round-trip when frontmatter omits explicit type: field (fix_needed/P0)
- [ ] ISSUE #1154 — [Design discussion] Soft cross-source results under source-scoped queries — 'penumbra' pattern (fix_needed/P0)
- [ ] ISSUE #1196 — Stateless host deployments fall through to ZeroEntropy default after v0.36.2.0, breaking writes against existi… (fix_needed/P0)
- [ ] ISSUE #1284 — bug: sync auto-embed tries deleted slug after rename/delete and logs Page not found (fix_needed/P0)
- [ ] ISSUE #1386 — `--to supabase` flag is misnamed — the underlying functionality isn't Supabase-specific (fix_needed/P0)
- [ ] ISSUE #1431 — Supabase linter: pgvector + pg_trgm extensions installed in 'public' schema (extension_in_public) (fix_needed/P0)
- [ ] ISSUE #1462 — facts:absorb logging can fail on disconnected engine handle (fix_needed/P0)
- [ ] ISSUE #1552 — Feature request: CLI flag --user-id (and equivalent SDK param) for query/search ops to enable multi-tenant Saa… (fix_needed/P0)
- [ ] ISSUE #1729 — gbrain dream disconnects module Postgres singleton mid-cycle before conversation_facts_backfill (fix_needed/P0)
- [ ] ISSUE #1835 — doctor image_assets treats Windows D:/ paths as missing under WSL (fix_needed/P0)
- [ ] ISSUE #1978 — feat: raw-source persistence guarantee for synthesis/import pipelines (fix_needed/P0)
- [ ] ISSUE #2100 — Support multi-source wiki hubs / source groups for llm-wiki-style knowledge bases (fix_needed/P0)
- [ ] ISSUE #2138 — propose_takes: `ON CONFLICT DO NOTHING` on the per-page unique key silently drops claim #2+ for multi-claim pa… (fix_needed/P0)
- [ ] ISSUE #2289 — `--source __all__` silently falls back to `default` source instead of spanning all sources (fix_needed/P0)
- [ ] ISSUE #2412 — phantom-redirect.ts wipes page facts without the excludeSourcePrefixes guard used by extract-facts.ts (fix_needed/P0)
- [ ] ISSUE #2825 — query_cache ignores hard-exclude config — cached results leak GBRAIN_SEARCH_EXCLUDE'd slugs across processes (fix_needed/P0)
- [ ] ISSUE #2831 — write-through.ts: no case-insensitive filesystem collision guard before atomic write (data-loss on Windows/mac… (fix_needed/P0)

## Part 4 — Singleton fix-needed PRs, P1 (P0 PRs are in Part 3)

- [ ] PR #208 — fix(autopilot): cancel the between-cycle sleep on SIGTERM/SIGINT (#204) (fix_needed/P1)
- [ ] PR #556 — fix(throttle): use /proc/meminfo MemAvailable on Linux (fix_needed/P1)
- [ ] PR #840 — fix(import-file): skip empty code files so reindex-code stops failing on them (fix_needed/P1)
- [ ] PR #936 — Refresh source sync timestamp when unchanged (fix_needed/P1)
- [ ] PR #1079 — fix: sync all registered sources in autopilot cycle instead of single brainDir (fix_needed/P1)
- [ ] PR #1101 — fix: support root-level file references in ENTITY_REF_RE (fix_needed/P1)
- [ ] PR #1121 — fix: match plugin entry.id to openclaw.plugin.json id (fix_needed/P1)
- [ ] PR #1197 — fix: refresh source sync freshness on no-op sync (fix_needed/P1)
- [ ] PR #1202 — fix(salience): exclude briefings/* from their own Brain Pulse (fix_needed/P1)
- [ ] PR #1240 — ai/dims: forward `dimensions` for Qwen3-Embedding on openai-compat (fix_needed/P1)
- [ ] PR #1281 — fix(ai): cap llama-server embedding batches at its 32-input request limit (fix_needed/P1)
- [ ] PR #1294 — fix: Windows compat — CRLF parser, relTarget posix, apply-migr leak, gbrainDir contract (fix_needed/P1)
- [ ] PR #1341 — fix(extract): don't split timeline bullets on bare hyphens (fix_needed/P1)
- [ ] PR #1410 — fix(serve-http): add resource_metadata to WWW-Authenticate per MCP spec + RFC 9728 (fix_needed/P1)
- [ ] PR #1417 — fix(lint): only unwrap whole-page code fences, not mid-document blocks (fix_needed/P1)
- [ ] PR #1428 — fix(models): dispatch subcommand reads args[0] not args[1] (fix_needed/P1)
- [ ] PR #1430 — fix(sync): record sync attempt timestamp on no-op + suppress on pull failure (fix_needed/P1)
- [ ] PR #1460 — fix(cross-modal-eval): bump stale default slot models to current allowlist entries (fix_needed/P1)
- [ ] PR #1494 — Fix providers test base URL override (fix_needed/P1)
- [ ] PR #1508 — fix(entities): thread sourceId through findByTitleFuzzy + skip soft-deleted (fix_needed/P1)
- [ ] PR #1597 — fix(lint): code-fence-wrap detector and fixer regex now agree (fix_needed/P1)
- [ ] PR #1628 — fix(code-def): include method/constructor/field/struct/protocol definitions (fix_needed/P1)
- [ ] PR #1649 — fix(pglite): guard putPage against zero-row RETURNING (fix_needed/P1)
- [ ] PR #1662 — fix(think): render the Gaps section once instead of twice (fix_needed/P1)
- [ ] PR #1669 — fix(db-lock): self-heal cycle-lock refresh on pooler-reaped CONNECTION_ENDED (fix_needed/P1)
- [ ] PR #1675 — fix(chunker): cap oversized code chunks so they stay embeddable (fix_needed/P1)
- [ ] PR #1704 — test(e2e): harden suite — kill flakes, no-op assertions, cross-test coupling (fix_needed/P1)
- [ ] PR #1772 — fix(doctor): two false-positive/timeout fixes — drift walk skips node_modules; bare-tweet skips inline-code + … (fix_needed/P1)
- [ ] PR #1791 — fix(extract): clear pre-version-bump pages in extract --stale (permanent link-extraction-lag loop) (fix_needed/P1)
- [ ] PR #1853 — fix(jobs): backlinks worker defaults to check, not fix (fix_needed/P1)
- [ ] PR #1863 — fix(search): weak-top floor on autocut to stop cross-source result collapse (fix_needed/P1)
- [ ] PR #1926 — fix(schema-pack): enable extract_atoms in gbrain-base-v2 (fix_needed/P1)
- [ ] PR #1952 — fix(pglite): populate chunk FTS vectors on upsert (fix_needed/P1)
- [ ] PR #1961 — fix(readme): correct broken OpenClaw and Hermes project links (fix_needed/P1)
- [ ] PR #2013 — fix(autopilot): export ~/.bun/bin onto PATH in cron wrapper (fix_needed/P1)
- [ ] PR #2017 — fix(schema): list all bundled packs (fix_needed/P1)
- [ ] PR #2022 — fix(resolver): tolerate CRLF line endings in SKILL.md frontmatter parsing (fix_needed/P1)
- [ ] PR #2047 — fix(links): collapse hyphen runs in normalizeBasename (fix_needed/P1)
- [ ] PR #2067 — fix(sync): stamp last_sync_at on no-op up_to_date sync (fix_needed/P1)
- [ ] PR #2086 — fix: bound subagent tool stalls and retry timestamps (fix_needed/P1)
- [ ] PR #2127 — fix(budget): price non-Anthropic chat models via the canonical table (fix_needed/P1)
- [ ] PR #2233 — fix(facts): harden extraction gating and provider config (fix_needed/P1)
- [ ] PR #2242 — fix(doctor): clear atom backlog and orphan false positives (fix_needed/P1)
- [ ] PR #2262 — fix(cycle): bound propose_takes phase with per-call + phase-level deadlines (fix_needed/P1)
- [ ] PR #2267 — fix(schema-pack): embed bundled pack YAMLs in the compiled binary (+ entity-slug orphan floor) (fix_needed/P1)
- [ ] PR #2304 — fix(cli): thin-client pre-connectEngine routing seam for CLI-only commands (fix_needed/P1)
- [ ] PR #2310 — fix(capture): make fallback title truncation explicit (fix_needed/P1)
- [ ] PR #2325 — fix(dims): handle prefixed model IDs on openai-compatible path (fix_needed/P1)
- [ ] PR #2340 — fix(frontmatter): derive validate slug from brain root, not absolute path (#565) (fix_needed/P1)
- [ ] PR #2343 — fix(recipes/x-to-brain): use /users/by/username for app-only bearer health check (fix_needed/P1)
- [ ] PR #2352 — fix(extract): recognize plain-bullet interaction logs and date-only session headers in timeline extraction (fix_needed/P1)
- [ ] PR #2371 — fix: meter extract_atoms Haiku calls (fix_needed/P1)
- [ ] PR #2385 — fix(cycle): guard extract against empty-queue zero-walk + log symbol-resolve progress (fix_needed/P1)
- [ ] PR #2386 — fix(search): honor recency decay config on the hybrid path (fix_needed/P1)
- [ ] PR #2407 — fix: Bun+Windows write-through EEXIST, non-Anthropic --max-cost pricing, dream-page exclusion in enrich (fix_needed/P1)
- [ ] PR #2436 — fix(import): canonicalize slug in importFromContent so mixed-case put_page with tags doesn't roll back (fix_needed/P1)
- [ ] PR #2441 — fix(durability): set rebase.autoStash during harden so pull --rebase tolerates uncommitted write-throughs (fix_needed/P1)
- [ ] PR #2444 — fix: handle CRLF skill frontmatter in health checks (fix_needed/P1)
- [ ] PR #2453 — fix(chunkers/code): don't crash estimateTokens on code containing tiktoken special tokens (fix_needed/P1)
- [ ] PR #2461 — fix: allow sync on repos with no commits (Dream Cycle sync phase) (fix_needed/P1)
- [ ] PR #2469 — fix: doctor type_proliferation reads file-plane config instead of null (fix_needed/P1)
- [ ] PR #2479 — fix(think): surface page-vs-page conflicts on takes-empty brains; make retrieval breadth env-configurable (fix_needed/P1)
- [ ] PR #2488 — fix(gateway): drop non-string text parts in toModelMessages (AI SDK v6 schema reject) (fix_needed/P1)
- [ ] PR #2505 — Tune cycle freshness for nightly source dreams (fix_needed/P1)
- [ ] PR #2514 — fix(propose_takes): memoize empty extractions so zero-claim pages don't re-spend tokens every cycle (fix_needed/P1)
- [ ] PR #2517 — fix: harden doctor, embedding, and source config handling (fix_needed/P1)
- [ ] PR #2525 — fix(doctor): brain_score orphan/timeline components use the orphans-audit linkable scope (fix_needed/P1)
- [ ] PR #2545 — fix(gbrain): avoid harden hook push race (fix_needed/P1)
- [ ] PR #2551 — fix(openclaw): declare gbrain plugin manifest entry (fix_needed/P1)
- [ ] PR #2558 — fix(doctor): reuse liveSyncStatus for sync liveness (fix_needed/P1)
- [ ] PR #2559 — fix: handle <think> reasoning tags in parseExtractorOutput (fix_needed/P1)
- [ ] PR #2565 — fix(storage): Supabase signed URLs — prepend /storage/v1 (fix_needed/P1)
- [ ] PR #2584 — fix(budget): let deliberately-unpriced providers (openrouter:*) run under --max-cost (fix_needed/P1)
- [ ] PR #2591 — fix(list): honor explicit list_pages limit for local callers, warn on remote clamp, thread offset (fix_needed/P1)
- [ ] PR #2616 — fix(migrations): let force-retry escape completed ledger entries (fix_needed/P1)
- [ ] PR #2621 — fix(trajectory): stop negative metrics from inverting regression signals (fix_needed/P1)
- [ ] PR #2639 — fix(health): count 'entity' pages in graph health metrics (fix_needed/P1)
- [ ] PR #2649 — lint: add DEFAULT_LINT_EXCLUDES and --exclude flag for mixed-content repos (fix_needed/P1)
- [ ] PR #2650 — pricing: resolve bare and provider-prefixed model ids via fallback lookup (fix_needed/P1)
- [ ] PR #2652 — fix(mcp): treat stdio serve as a trusted local pipe (remote=false) (fix_needed/P1)
- [ ] PR #2658 — fix: clarify PGLite data-dir lock contention (fix_needed/P1)
- [ ] PR #2693 — feat(skills): harvest webgpu-threejs-tsl and playwright-cli (fix_needed/P1)
- [ ] PR #2699 — fix(cycle): drain PGLite synth subagents inline (fix_needed/P1)
- [ ] PR #2700 — fix: scope autopilot fan-out to source path (fix_needed/P1)
- [ ] PR #2708 — fix(put): refuse to overwrite a non-empty page with empty content (fix_needed/P1)
- [ ] PR #2710 — feat(skills): harvest firecrawl skill registry (fix_needed/P1)
- [ ] PR #2713 — feat(skills): motionklip target-first hybrid pipeline (fix_needed/P1)
- [ ] PR #2714 — feat(skills): trading pack + crypto-12h MoA report (fix_needed/P1)
- [ ] PR #2715 — feat(skills): AI-Trader pack + crypto-12h market-intel (fix_needed/P1)
- [ ] PR #2716 — fix(skillify): scaffold test file lands inside skillsDir, not repoRoot (fix_needed/P1)
- [ ] PR #2734 — Clear stale sync HEAD sentinels after verified recovery (fix_needed/P1)
- [ ] PR #2741 — fix(lint): only remove paired whole-document Markdown fences (fix_needed/P1)
- [ ] PR #2754 — fix(pages): preserve content_created_at through re-ingest (effective_date precedence) (fix_needed/P1)
- [ ] PR #2764 — fix(cli): reuse PGLite engine for reindex-frontmatter (fix_needed/P1)
- [ ] PR #2770 — fix(dream): require self-contained opening summary in synthesized pages (fix_needed/P1)
- [ ] PR #2776 — skills: harvest generic research workflows (fix_needed/P1)
- [ ] PR #2816 — orphan_ratio: config-driven orphan_deny_prefixes to exclude record-type pages (fix_needed/P1)
- [ ] PR #2817 — fix: categorize timeline_coverage and register auto_chronicle (fix_needed/P1)
- [ ] PR #2824 — Add correlated query profiling and safe search setup optimizations (fix_needed/P1)
- [ ] PR #2846 — fix(embed): stamp gateway-resolved model in content_chunks.model, not compiled default (fix_needed/P1)
- [ ] PR #2851 — fix(probe): gate nightly quality probe on real run outcomes only (fix_needed/P1)
- [ ] PR #2852 — fix(autopilot): give full-cycle dispatch a 30-minute timeout floor (fix_needed/P1)
- [ ] PR #2854 — fix(onboard): stop repeating the same auto-remediation within a run (fix_needed/P1)
- [ ] PR #2865 — fix(list_pages): surface truncation instead of silently capping enumeration (fix_needed/P1)
- [ ] PR #2868 — fix(links): use the real resolver on extract --stale + resolve path-style/unslugged wikilink targets (fix_needed/P1)
- [ ] PR #2869 — fix(import): post-write read-back verification with durable ingest-log record (fix_needed/P1)
- [ ] PR #2870 — fix(sync): never delete put_page pages under pruned dirs on incremental sync (fix_needed/P1)
- [ ] PR #2873 — fix(search): project email citation metadata (fix_needed/P1)
- [ ] PR #2875 — fix(search): preserve email citation metadata across result paths (fix_needed/P1)
- [ ] PR #2877 — fix(extract): derive timeline entries from effective dates (fix_needed/P1)
- [ ] PR #2879 — fix(sync): honor the embedding_disabled sentinel as implicit --no-embed (fix_needed/P1)
- [ ] PR #2881 — fix(mcp): source-scope hardening for remote callers (fix_needed/P1)

## Part 5 — Singleton P1 fix-needed issues (compact; triage when Parts 1–4 clear)

#66 #111 #200 #249 #250 #298 #390 #429 #526 #575 #630 #713 #720 #722 #814 #834 #882 #890 #953 #954
#957 #958 #968 #1038 #1040 #1067 #1075 #1102 #1118 #1152 #1174 #1178 #1198 #1221 #1223 #1235 #1237
#1241 #1260 #1272 #1301 #1303 #1304 #1315 #1318 #1359 #1384 #1390 #1413 #1459 #1492 #1499 #1515
#1516 #1517 #1531 #1606 #1617 #1642 #1710 #1720 #1752 #1773 #1847 #1892 #1915 #1933 #1955 #1958
#1995 #2036 #2037 #2055 #2076 #2136 #2162 #2177 #2196 #2229 #2264 #2306 #2334 #2346 #2347 #2364
#2367 #2369 #2394 #2397 #2417 #2445 #2504 #2511 #2536 #2538 #2539 #2540 #2553 #2554 #2575 #2579
#2580 #2581 #2594 #2626 #2633 #2645 #2646 #2662 #2663 #2667 #2671 #2682 #2703 #2704 #2729 #2753
#2772 #2775 #2860 #2863

## Part 6 — Rescued close-candidates (275 items, deprioritized-but-open)

These survived the 2026-07-16 adversarial close-verification (verdict: rescue). They stay
open; the original bucket is only a hint. Many already appear in the clusters above with a
`rescued:` tag. Do not batch-close. Relabel `duplicate`-tagged open fix PRs to `fix-needed`
when touched (the paired issue was closed in wave 3, making the label misleading).

**low_value** (203):
#232 #263 #268 #289 #353 #385 #438 #470 #493 #495 #509 #520 #557 #570 #573 #581 #582 #594 #717 #774
#782 #789 #817 #852 #853 #854 #855 #856 #894 #900 #942 #975 #977 #984 #1006 #1011 #1013 #1016 #1030
#1060 #1107 #1109 #1112 #1135 #1177 #1180 #1181 #1218 #1231 #1263 #1280 #1282 #1310 #1316 #1372
#1396 #1419 #1423 #1424 #1476 #1497 #1529 #1553 #1565 #1584 #1592 #1596 #1600 #1601 #1646 #1654
#1680 #1686 #1690 #1691 #1703 #1719 #1731 #1733 #1769 #1778 #1800 #1814 #1826 #1860 #1884 #1891
#1900 #1903 #1904 #1930 #1931 #1940 #1953 #1990 #2000 #2010 #2023 #2024 #2025 #2030 #2040 #2041
#2048 #2054 #2062 #2063 #2065 #2070 #2092 #2096 #2101 #2107 #2112 #2125 #2130 #2131 #2133 #2135
#2151 #2153 #2154 #2157 #2158 #2172 #2181 #2191 #2192 #2197 #2212 #2218 #2219 #2232 #2246 #2248
#2268 #2313 #2314 #2315 #2316 #2317 #2318 #2319 #2326 #2353 #2379 #2384 #2398 #2401 #2418 #2419
#2420 #2421 #2422 #2423 #2424 #2425 #2428 #2429 #2430 #2442 #2449 #2452 #2457 #2472 #2474 #2480
#2481 #2493 #2495 #2496 #2497 #2498 #2500 #2502 #2508 #2509 #2510 #2519 #2530 #2531 #2542 #2549
#2566 #2586 #2587 #2592 #2593 #2614 #2618 #2634 #2642 #2659 #2668 #2669 #2670 #2672 #2696 #2721
#2727 #2730 #2732 #2867

**proprietary** (34):
#124 #192 #334 #919 #1071 #1157 #1199 #1255 #1402 #1618 #1664 #1714 #1716 #1977 #1988 #2005 #2006
#2103 #2164 #2220 #2373 #2383 #2403 #2405 #2455 #2600 #2643 #2644 #2692 #2768 #2832 #2842 #2857
#2882

**duplicate** (30):
#127 #1679 #1694 #1706 #1838 #1839 #1858 #1896 #1898 #1962 #1993 #2124 #2161 #2208 #2210 #2216 #2253
#2257 #2274 #2277 #2279 #2282 #2284 #2286 #2329 #2378 #2448 #2491 #2568 #2572

**already_fixed** (8):
#11 #14 #223 #555 #1144 #1172 #1963 #2050

