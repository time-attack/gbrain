/**
 * Pure classification helpers for the gbrain backlog triage dashboard.
 * No network I/O — safe to unit-test.
 */

/** @typedef {'issue'|'pr'} ItemKind */
/** @typedef {'P0'|'P1'|'P2'|'P3'|'none'} Priority */
/**
 * @typedef {'duplicate'|'already_fixed'|'low_value'|'proprietary'|
 *   'merge_candidate'|'fix_needed'|'feature_consider'|'needs_review'|'close_wontfix'} Disposition
 */

export const DISPOSITIONS = [
  'duplicate',
  'already_fixed',
  'low_value',
  'proprietary',
  'merge_candidate',
  'fix_needed',
  'feature_consider',
  'needs_review',
  'close_wontfix',
];

export const PRIORITIES = ['P0', 'P1', 'P2', 'P3', 'none'];

/** Niche / non-mainstream product surfaces (feature integrations). */
export const PROPRIETARY_FEATURE_RE =
  /\b(minimax|zhipu|glm-4|kimi|moonshot|comet[\s-]?ecc|yika|multica|google\s*takeout|notion\s*api|obsidian\s*plugin|telegram\s*bot|whatsapp|wechat|discord\s*bot|slack\s*bot|linear\s*api|hubspot|salesforce|zapier|\bn8n\b|make\.com|coze|dify|langflow|flowise|siliconflow|fireworks\.ai|together\.ai|groq\s*only|ollama\s*only|claude-cli|gemini-cli|dashscope|qwen)\b/i;

/**
 * Mentions that are often repro context for mainstream gateway bugs —
 * do NOT treat as proprietary by themselves when the title is a generic
 * OpenAI-compatible / gateway / subagent fix.
 */
export const PROVIDER_REPRO_RE =
  /\b(deepseek|llama-server|openrouter|litellm|openai-compatible)\b/i;

export const SECURITY_RE =
  /\b(?:security(?:\s+(?:bug|issue|hole|hardening))?|rls\b|anon\s*key|token\s*leak\w*|leaks?\s+(?:admin\s+)?(?:token|secret|credential)\w*|credential\s*leak\w*|auth\s*bypass|cross[- ]source\s*(?:leak|read|write|isolat)\w*|source\s*isolation|exfiltrat\w*|sql\s*injection|path\s*traversal|ssrf\b|xss\b|priv(?:acy|ilege)\s*escalat\w*)/i;

export const DATA_LOSS_RE =
  /\b(?:mass[- ]?delet\w*|data\s*loss|wip(?:e|ed|ing)\s+(?:pages?|brain|source|db|database)|destroy\s+(?:pages?|brain|source)|corrupt(?:ion|ed)?\s+(?:db|database|pages?|brain)|drop\s*source|hard[- ]?exclude|prune\s*all|delete\s*all|silent\s*delet\w*)/i;

export const LOW_VALUE_TITLE_RE =
  /\b(bump\s+deps?|chore:\s*deps?|update\s+dependencies|dependabot|renovate|typo\s+fix|fix\s+typo|readme\s+typo|add\s+badge|star\s+history)\b/i;

export const FEATURE_TITLE_RE =
  /^(feat|feature)(\(|:|\s)|^(proposal|rfc|idea|enhancement)\b/i;

export const BUG_TITLE_RE =
  /^(fix|bug)(\(|:|\s)|\bbug\b|\bcrash\b|\bbroken\b|\bfails?\b|\berror\b/i;

/**
 * Normalize a title for exact duplicate grouping.
 * @param {string} title
 */
export function normalizeTitle(title) {
  return String(title || '')
    .toLowerCase()
    .replace(/[`"'*_~]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {string} title
 * @param {string} [body]
 */
export function isProprietaryFeature(title, body = '') {
  const t = String(title || '');
  const blob = `${t}\n${body || ''}`;
  // Title-primary: niche product named as the subject.
  if (PROPRIETARY_FEATURE_RE.test(t)) return true;
  // Body-only: require a feature/proposal framing, not a bug report that
  // merely mentions a provider as repro.
  if (!FEATURE_TITLE_RE.test(t) && !/\b(proposal|recipe|integration|add support)\b/i.test(t)) {
    return false;
  }
  if (PROPRIETARY_FEATURE_RE.test(blob)) return true;
  // DeepSeek/llama-server as a new recipe/feature (not gateway bug)
  if (/\b(add|support|recipe|provider)\b/i.test(t) && PROVIDER_REPRO_RE.test(t)) {
    return true;
  }
  return false;
}

/**
 * @param {string} title
 * @param {string} [body]
 */
export function isSecurityOrDataLoss(title, body = '') {
  const blob = `${title || ''}\n${body || ''}`;
  return SECURITY_RE.test(blob) || DATA_LOSS_RE.test(blob);
}

/**
 * Score CI / merge readiness for a PR.
 * @param {{ mergeStateStatus?: string, isDraft?: boolean, statusCheckRollup?: any[] }} pr
 */
export function summarizeChecks(pr) {
  const mergeState = pr.mergeStateStatus || 'UNKNOWN';
  const draft = Boolean(pr.isDraft);
  const roll = Array.isArray(pr.statusCheckRollup) ? pr.statusCheckRollup : [];
  const states = roll
    .filter((c) => c && typeof c === 'object')
    .map((c) => String(c.conclusion || c.state || '').toUpperCase());
  let ci = 'none';
  if (states.length) {
    if (states.every((s) => ['SUCCESS', 'NEUTRAL', 'SKIPPED'].includes(s))) ci = 'green';
    else if (states.some((s) => ['FAILURE', 'ERROR', 'CANCELLED', 'TIMED_OUT', 'ACTION_REQUIRED'].includes(s)))
      ci = 'red';
    else ci = 'pending';
  }
  return {
    mergeState,
    draft,
    ci,
    greenClean: !draft && mergeState === 'CLEAN' && ci === 'green',
  };
}

/**
 * Claimed tests from PR body (author-reported; not verified).
 * @param {string} body
 */
export function extractTestEvidence(body) {
  const b = String(body || '');
  const lines = [];
  if (/bun\s+test/i.test(b)) lines.push('Author claims `bun test` was run.');
  if (/bun\s+run\s+typecheck|typecheck/i.test(b)) lines.push('Author claims typecheck was run.');
  if (/test\/[\w./-]+\.test\.ts/i.test(b)) {
    const m = b.match(/test\/[\w./-]+\.test\.ts/g) || [];
    const uniq = [...new Set(m)].slice(0, 5);
    lines.push(`Mentions test files: ${uniq.join(', ')}`);
  }
  if (/verification|test plan|##\s*tests/i.test(b) && lines.length === 0) {
    lines.push('Has a Verification/Test Plan section (contents not verified).');
  }
  if (lines.length === 0) lines.push('No clear test evidence in the body.');
  return lines;
}

/**
 * Build exact-title duplicate clusters.
 * @param {Array<{ kind: ItemKind, number: number, title: string }>} items
 * @returns {Map<string, { clusterId: string, members: Array<{kind: ItemKind, number: number}>, canonical: {kind: ItemKind, number: number} }>}
 */
export function buildExactTitleClusters(items) {
  /** @type {Map<string, Array<{kind: ItemKind, number: number, title: string}>>} */
  const byNorm = new Map();
  for (const it of items) {
    const key = normalizeTitle(it.title);
    if (!key) continue;
    if (!byNorm.has(key)) byNorm.set(key, []);
    byNorm.get(key).push(it);
  }
  /** @type {Map<string, any>} */
  const out = new Map();
  for (const [key, group] of byNorm) {
    if (group.length < 2) continue;
    const sorted = [...group].sort((a, b) => a.number - b.number);
    const canonical = { kind: sorted[0].kind, number: sorted[0].number };
    const clusterId = `exact:${key.slice(0, 60)}`;
    for (const m of sorted) {
      out.set(`${m.kind}:${m.number}`, {
        clusterId,
        members: sorted.map((x) => ({ kind: x.kind, number: x.number })),
        canonical,
        reason: 'Exact normalized title match',
      });
    }
  }
  return out;
}

/**
 * Soft duplicate clusters from precomputed cosine pairs.
 * @param {Array<{ aKind: ItemKind, a: number, bKind: ItemKind, b: number, cosine: number }>} pairs
 * @param {number} threshold
 */
export function buildSoftDupClusters(pairs, threshold = 0.85) {
  /** @type {Map<string, Set<string>>} */
  const adj = new Map();
  const key = (k, n) => `${k}:${n}`;
  const add = (x, y) => {
    if (!adj.has(x)) adj.set(x, new Set());
    adj.get(x).add(y);
  };
  for (const p of pairs) {
    if (p.cosine < threshold) continue;
    const a = key(p.aKind, p.a);
    const b = key(p.bKind, p.b);
    add(a, b);
    add(b, a);
  }
  /** @type {Map<string, any>} */
  const out = new Map();
  const seen = new Set();
  for (const start of adj.keys()) {
    if (seen.has(start)) continue;
    const stack = [start];
    const comp = [];
    seen.add(start);
    while (stack.length) {
      const cur = stack.pop();
      comp.push(cur);
      for (const n of adj.get(cur) || []) {
        if (!seen.has(n)) {
          seen.add(n);
          stack.push(n);
        }
      }
    }
    if (comp.length < 2) continue;
    const members = comp
      .map((s) => {
        const [kind, num] = s.split(':');
        return { kind: /** @type {ItemKind} */ (kind), number: Number(num) };
      })
      .sort((a, b) => a.number - b.number);
    const canonical = members[0];
    const clusterId = `soft:${canonical.kind}${canonical.number}`;
    for (const m of members) {
      const k = key(m.kind, m.number);
      if (out.has(k)) continue;
      out.set(k, {
        clusterId,
        members,
        canonical,
        reason: `Near-duplicate (title/body similarity ≥ ${threshold})`,
      });
    }
  }
  return out;
}

/**
 * Heuristic low-value signals.
 * @param {{ kind: ItemKind, title: string, body?: string, authorLogin?: string, authorIssueCount?: number, authorPrCount?: number, checks?: ReturnType<typeof summarizeChecks>, testEvidence?: string[] }} item
 */
export function lowValueSignals(item) {
  const signals = [];
  if (LOW_VALUE_TITLE_RE.test(item.title || '')) signals.push('Title looks like a dependency bump or typo chore.');
  const body = item.body || '';
  if (item.kind === 'pr') {
    if ((item.testEvidence || []).some((t) => /No clear test evidence/i.test(t))) {
      signals.push('PR body has no clear test evidence.');
    }
    if (item.checks?.draft) signals.push('Still a draft.');
    if (item.checks?.mergeState === 'DIRTY') signals.push('Has merge conflicts (DIRTY).');
    if (item.checks?.ci === 'none' && !item.checks?.greenClean) {
      signals.push('No CI status visible (common for fork PRs).');
    }
    if (/Generated with|codesmith|@codesmith|Claude Code/i.test(body) && body.length < 400) {
      signals.push('Short AI-generated body with little substance.');
    }
  }
  const vol = (item.authorIssueCount || 0) + (item.authorPrCount || 0);
  if (vol >= 12) signals.push(`Author has ${vol} open items in this backlog (high volume).`);
  return signals;
}

/**
 * Pick disposition + priority for one item.
 * @param {object} ctx
 * @returns {{ disposition: Disposition, priority: Priority, confidence: number, flags: string[], explanation: string, proposedSolution: string }}
 */
export function classifyItem(ctx) {
  const {
    kind,
    number,
    title,
    body = '',
    override,
    exactDup,
    softDup,
    masterReferenced,
    proprietary,
    checks,
    testEvidence = [],
    lowValue = [],
    curated,
  } = ctx;

  if (override) {
    return {
      disposition: override.disposition,
      priority: override.priority || 'none',
      confidence: override.confidence ?? 0.95,
      flags: override.flags || [],
      explanation: override.explanation,
      proposedSolution: override.proposedSolution || '',
    };
  }

  if (curated) {
    return {
      disposition: curated.disposition,
      priority: curated.priority || 'none',
      confidence: curated.confidence ?? 0.9,
      flags: curated.flags || [],
      explanation: curated.explanation,
      proposedSolution: curated.proposedSolution || '',
    };
  }

  const flags = [];
  const isDup = exactDup || softDup;
  if (isDup) {
    const canon = isDup.canonical;
    const isCanon = canon.kind === kind && canon.number === number;
    if (!isCanon) {
      flags.push('duplicate');
      return {
        disposition: 'duplicate',
        priority: 'none',
        confidence: exactDup ? 0.98 : 0.85,
        flags,
        explanation: `Likely duplicate of ${canon.kind === 'issue' ? 'issue' : 'PR'} #${canon.number}. ${isDup.reason}. Keep one canonical thread; close the rest after a human glance.`,
        proposedSolution: `Close as duplicate of #${canon.number}; fold any unique repro details into the canonical thread.`,
      };
    }
    flags.push('cluster_canonical');
  }

  if (proprietary) {
    flags.push('proprietary');
    return {
      disposition: 'proprietary',
      priority: 'P3',
      confidence: 0.8,
      flags,
      explanation:
        'Looks like a niche or non-mainstream API/tool integration (or a recipe for one). Fine for a fork; low priority for the mainstream gbrain product unless it also fixes a generic gateway bug.',
      proposedSolution:
        'Defer unless it lands as a tiny, well-tested recipe with no core-path risk. Prefer generic OpenAI-compatible/gateway fixes over single-vendor stacks.',
    };
  }

  if (masterReferenced) {
    flags.push('already_fixed_candidate');
    return {
      disposition: 'already_fixed',
      priority: 'none',
      confidence: 0.7,
      flags,
      explanation:
        'This open item is referenced from commits already on master. It may already be fixed or superseded — verify before spending review time.',
      proposedSolution:
        'Reproduce on current master. If fixed, close with the fixing SHA/PR. If not, retitle to what’s still broken.',
    };
  }

  if (kind === 'pr' && checks?.greenClean) {
    flags.push('green_ci', 'merge_ready_signal');
    const strongTests = testEvidence.some((t) => /Mentions test files|bun test/i.test(t));
    return {
      disposition: 'merge_candidate',
      priority: strongTests ? 'P1' : 'P2',
      confidence: 0.75,
      flags,
      explanation:
        'PR is CLEAN with green checks and not a draft — rare in this backlog. Worth a focused human skim before anything else.',
      proposedSolution:
        'Do a short adversarial review of the diff + claimed tests; if scope is tight, cherry-pick or merge via the normal /ship path.',
    };
  }

  if (kind === 'pr' && (checks?.mergeState === 'DIRTY' || checks?.draft) && lowValue.length >= 2) {
    flags.push('low_value');
    return {
      disposition: 'low_value',
      priority: 'none',
      confidence: 0.65,
      flags,
      explanation: `Low-signal PR: ${lowValue.slice(0, 3).join(' ')}`,
      proposedSolution: 'Close or ask the author to rebase + add tests. Do not spend first-pass review budget here.',
    };
  }

  if (lowValue.length >= 3 || LOW_VALUE_TITLE_RE.test(title)) {
    flags.push('low_value');
    return {
      disposition: 'low_value',
      priority: 'none',
      confidence: 0.7,
      flags,
      explanation: `Looks low-value or noisy: ${lowValue.slice(0, 3).join(' ') || 'chore/dep bump pattern.'}`,
      proposedSolution: 'Filter out of Wave 1. Optionally batch-close with a polite template after maintainer approval.',
    };
  }

  if (isSecurityOrDataLoss(title, body)) {
    flags.push('security_or_data_loss');
    return {
      disposition: 'fix_needed',
      priority: 'P0',
      confidence: 0.8,
      flags,
      explanation:
        'Title/body suggests security exposure or data-loss risk. Treat as P0 until disproven.',
      proposedSolution:
        'Reproduce, confirm blast radius, land a minimal fail-closed fix with regression tests. Do not debate product polish first.',
    };
  }

  if (BUG_TITLE_RE.test(title) || /\brepro\b|\bcrash\b|\bfails?\b/i.test(body.slice(0, 800))) {
    return {
      disposition: 'fix_needed',
      priority: 'P1',
      confidence: 0.6,
      flags,
      explanation: 'Reads as a concrete bug report. Likely worth fixing if still reproducible on current master.',
      proposedSolution: 'Confirm on HEAD; write a failing test; ship a narrow fix. Link any open PR that already addresses it.',
    };
  }

  if (FEATURE_TITLE_RE.test(title)) {
    return {
      disposition: 'feature_consider',
      priority: 'P2',
      confidence: 0.55,
      flags,
      explanation: 'Feature / proposal. Judge against the north-star (memory system for many users), not novelty.',
      proposedSolution: 'Accept only if it helps mainstream retrieval/memory ops with clear tests; otherwise park or close.',
    };
  }

  return {
    disposition: 'needs_review',
    priority: 'P3',
    confidence: 0.4,
    flags,
    explanation: 'No strong automatic signal. Needs a quick human read to place it.',
    proposedSolution: 'Skim title + first paragraph; then refile into fix / feature / close / duplicate.',
  };
}

/**
 * Stable item id.
 * @param {ItemKind} kind
 * @param {number} number
 */
export function itemId(kind, number) {
  return `${kind}:${number}`;
}
