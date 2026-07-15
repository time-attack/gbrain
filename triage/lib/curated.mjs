/**
 * Hand-curated dispositions from the maintainer backlog audit.
 * These override heuristics. Keep explanations generic (no real contact names).
 */

/** @type {Record<string, object>} */
export const CURATED = {
  // --- P0 issues ---
  'issue:2828': {
    disposition: 'fix_needed',
    priority: 'P0',
    confidence: 0.95,
    flags: ['security_or_data_loss', 'windows', 'sync'],
    explanation:
      'Windows sync path can mass-delete pages. Data-loss class — confirm and harden before anything cosmetic.',
    proposedSolution:
      'Add a dry-run / delete-budget guard on sync prune; regression test with Windows path separators; document the safe recovery path.',
  },
  'issue:2836': {
    disposition: 'duplicate',
    priority: 'none',
    confidence: 0.9,
    flags: ['duplicate', 'security_or_data_loss'],
    explanation: 'Same Windows sync mass-delete theme as #2828. Treat #2828 as canonical unless this has unique repro steps.',
    proposedSolution: 'Close as duplicate of #2828 after checking for unique details.',
  },
  'pr:2836': {
    disposition: 'merge_candidate',
    priority: 'P0',
    confidence: 0.9,
    flags: ['security_or_data_loss', 'windows', 'sync'],
    explanation:
      'PR that claims to fix Windows path separators + mass-delete safety for sync. Pair with issue #2828 — high priority if the diff is tight and tested.',
    proposedSolution:
      'Review the safety valve + path normalization; require a regression test; do not merge on title alone if CI is empty.',
  },
  'issue:2624': {
    disposition: 'fix_needed',
    priority: 'P0',
    confidence: 0.95,
    flags: ['security_or_data_loss', 'admin'],
    explanation: 'Admin token / credential leakage risk. Security hardening — fail closed.',
    proposedSolution: 'Scrub tokens from logs/responses; add a regression test that asserts secrets never appear in admin payloads.',
  },
  'issue:2625': {
    disposition: 'fix_needed',
    priority: 'P0',
    confidence: 0.9,
    flags: ['security_or_data_loss', 'admin'],
    explanation: 'Related admin auth/token exposure. Bundle with #2624 if the root cause is shared.',
    proposedSolution: 'Same pass as #2624; keep one PR if the fix is one code path.',
  },
  'pr:2625': {
    disposition: 'merge_candidate',
    priority: 'P0',
    confidence: 0.9,
    flags: ['security_or_data_loss', 'admin'],
    explanation:
      'PR to stop leaking the admin bootstrap token to non-admin surfaces. Security fix — review carefully, prefer merging over re-implementing.',
    proposedSolution:
      'Adversarial review of who can read the token; add a test that non-admin responses never include it; ship via /ship.',
  },
  'issue:2825': {
    disposition: 'fix_needed',
    priority: 'P0',
    confidence: 0.9,
    flags: ['security_or_data_loss', 'cache'],
    explanation: 'Cache / hard-exclude interaction can hide or drop content unexpectedly.',
    proposedSolution: 'Pin knobs_hash / exclude semantics with a unit test; document operator escape hatches.',
  },
  'issue:2098': {
    disposition: 'fix_needed',
    priority: 'P0',
    confidence: 0.9,
    flags: ['thin_client', 'source_isolation'],
    explanation: 'Thin-client source drop — cross-source / routing integrity issue.',
    proposedSolution: 'Fail closed on missing source scope; add an e2e that asserts remote callers cannot see dropped sources.',
  },
  'issue:2684': {
    disposition: 'fix_needed',
    priority: 'P0',
    confidence: 0.9,
    flags: ['source_isolation', 'takes'],
    explanation: 'Takes path may leak or mix sources. Source isolation invariant.',
    proposedSolution: 'Route all take reads through sourceScopeOpts; add a cross-source negative test.',
  },
  'issue:2706': {
    disposition: 'fix_needed',
    priority: 'P0',
    confidence: 0.9,
    flags: ['source_isolation', 'images'],
    explanation: 'Image / file path may skip source isolation. Same class as #2684.',
    proposedSolution: 'Tighten remote file confinement; test that foreign-source blobs are denied.',
  },
  'issue:2855': {
    disposition: 'fix_needed',
    priority: 'P1',
    confidence: 0.85,
    flags: ['ci', 'verify'],
    explanation:
      'Unit parallel runners record the wrong exit code when gtimeout/timeout is missing — false-fail CI on some machines.',
    proposedSolution: 'Fix sentinel rc handling; add a test for the no-timeout fallback path.',
  },

  // --- Strongest green+CLEAN skim-ready PRs ---
  'pr:472': {
    disposition: 'merge_candidate',
    priority: 'P1',
    confidence: 0.92,
    flags: ['green_ci', 'merge_ready_signal', 'curated_strong'],
    explanation: 'Green+CLEAN fix for bigint JSON serialization on files. Small, concrete, high confidence skim.',
    proposedSolution: 'Short review of the normalize path + existing tests; merge via /ship if still applies on HEAD.',
  },
  'pr:2440': {
    disposition: 'merge_candidate',
    priority: 'P1',
    confidence: 0.92,
    flags: ['green_ci', 'merge_ready_signal', 'curated_strong', 'oom'],
    explanation: 'Import OOM fix — skip marked.lexer on fence-less pages. Prevents bulk-import blowups.',
    proposedSolution: 'Confirm issue #2437 still open on master; verify the guard + test; merge.',
  },
  'pr:2632': {
    disposition: 'merge_candidate',
    priority: 'P1',
    confidence: 0.9,
    flags: ['green_ci', 'merge_ready_signal', 'curated_strong', 'config'],
    explanation: 'Registers documented Life Chronicle config keys so the enable command actually works.',
    proposedSolution: 'Confirm key names match docs; merge if tests cover unknown-key rejection.',
  },
  'pr:2801': {
    disposition: 'merge_candidate',
    priority: 'P1',
    confidence: 0.9,
    flags: ['green_ci', 'merge_ready_signal', 'curated_strong', 'flake'],
    explanation: 'Doctor test flake fix (embedding dims / shard order). Improves CI trust.',
    proposedSolution: 'Merge early — unblocks other reviews by stabilizing the suite.',
  },
  'pr:2068': {
    disposition: 'merge_candidate',
    priority: 'P1',
    confidence: 0.9,
    flags: ['green_ci', 'merge_ready_signal', 'curated_strong'],
    explanation: 'Orphans command excludes generated corpus roots — reduces false orphan noise.',
    proposedSolution: 'Skim the exclude list; ensure user content is not over-excluded; merge.',
  },
  'pr:2820': {
    disposition: 'merge_candidate',
    priority: 'P1',
    confidence: 0.88,
    flags: ['green_ci', 'merge_ready_signal', 'supersedes'],
    explanation: 'Gateway tool-loop consolidation that claims to supersede many smaller PRs — high leverage if true.',
    proposedSolution: 'Verify supersession list; prefer this over merging the superseded stack one-by-one.',
  },

  // --- Known exact duplicate clusters (non-canonical) ---
  'issue:2773': {
    disposition: 'duplicate',
    priority: 'none',
    confidence: 0.99,
    flags: ['duplicate'],
    explanation: 'Exact duplicate of book-mirror dispatcher unreachable (#2772).',
    proposedSolution: 'Close as duplicate of #2772.',
  },
  'issue:2774': {
    disposition: 'duplicate',
    priority: 'none',
    confidence: 0.99,
    flags: ['duplicate'],
    explanation: 'Exact duplicate of book-mirror dispatcher unreachable (#2772).',
    proposedSolution: 'Close as duplicate of #2772.',
  },
  'issue:2814': {
    disposition: 'duplicate',
    priority: 'none',
    confidence: 0.99,
    flags: ['duplicate'],
    explanation: 'Exact duplicate of extract_atoms trailing-hyphen slug bug (#2810).',
    proposedSolution: 'Close as duplicate of #2810.',
  },
  'issue:2815': {
    disposition: 'duplicate',
    priority: 'none',
    confidence: 0.99,
    flags: ['duplicate'],
    explanation: 'Exact duplicate of grade_takes placeholder retriever (#2811).',
    proposedSolution: 'Close as duplicate of #2811.',
  },
  'issue:2813': {
    disposition: 'duplicate',
    priority: 'none',
    confidence: 0.99,
    flags: ['duplicate'],
    explanation: 'Exact duplicate of dream tick-level budget cap (#2809).',
    proposedSolution: 'Close as duplicate of #2809.',
  },
  'issue:2812': {
    disposition: 'duplicate',
    priority: 'none',
    confidence: 0.99,
    flags: ['duplicate'],
    explanation: 'Exact duplicate of synthesize_concepts / extract_atoms concepts field (#2808).',
    proposedSolution: 'Close as duplicate of #2808.',
  },
  'issue:2390': {
    disposition: 'duplicate',
    priority: 'none',
    confidence: 0.99,
    flags: ['duplicate'],
    explanation: 'Exact duplicate of Life Chronicle feature proposal (#2388).',
    proposedSolution: 'Close as duplicate of #2388.',
  },
  'issue:2198': {
    disposition: 'duplicate',
    priority: 'none',
    confidence: 0.99,
    flags: ['duplicate'],
    explanation: 'Exact duplicate of dream migration v0.32.2 wedge (#2196).',
    proposedSolution: 'Close as duplicate of #2196.',
  },
  'issue:1861': {
    disposition: 'already_fixed',
    priority: 'none',
    confidence: 0.85,
    flags: ['already_fixed_candidate', 'duplicate'],
    explanation:
      'Same malformed array literal extract-links crash as #1859; master already has related engine fixes. Verify and close.',
    proposedSolution: 'Confirm on current master; close both #1859 and #1861 if the jsonb_to_recordset path landed.',
  },
  'issue:1859': {
    disposition: 'already_fixed',
    priority: 'none',
    confidence: 0.85,
    flags: ['already_fixed_candidate'],
    explanation: 'extract links --stale malformed array literal — likely fixed by later engine batch-insert work on master.',
    proposedSolution: 'Reproduce once on HEAD; close if gone.',
  },
};
