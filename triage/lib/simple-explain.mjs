/**
 * Plain-English explanations (short words, no jargon dump).
 * Templates first; optional LLM rewrites land in data/simple-overrides.json.
 */

/** @param {string} kind @param {number} number */
function ref(kind, number) {
  return kind === 'issue' ? `issue #${number}` : `PR #${number}`;
}

/**
 * @param {object} row
 * @param {Record<string, {explanation?: string, proposedSolution?: string}>} [overrides]
 */
export function simpleExplain(row, overrides = {}) {
  const o = overrides[row.id];
  if (o?.explanation) {
    return {
      explanation: o.explanation,
      proposedSolution: o.proposedSolution || row.proposedSolution || '',
    };
  }

  const title = String(row.title || '').slice(0, 120);
  const canon = row.canonical;

  switch (row.disposition) {
    case 'duplicate':
      return {
        explanation: canon
          ? `This is the same problem as ${ref(canon.kind, canon.number)}. Keep one thread.`
          : 'This is a duplicate of another open item. Keep one thread.',
        proposedSolution: canon
          ? `Close this. Put any extra details on ${ref(canon.kind, canon.number)}.`
          : 'Close as duplicate after a quick glance.',
      };
    case 'already_fixed':
      return {
        explanation: 'Master already mentions this. It may already be fixed.',
        proposedSolution: 'Try it on today’s master. If it works, close. If not, say what still breaks.',
      };
    case 'low_value':
      return {
        explanation: `Looks noisy or low value: ${title || 'weak signal'}. Not worth first-pass review time.`,
        proposedSolution: 'Skip for Wave 1. Close later only with explicit maintainer OK.',
      };
    case 'proprietary':
      return {
        explanation:
          'This adds a niche / non-mainstream tool or API. Fine for a personal fork, not core gbrain.',
        proposedSolution: 'Do not merge into mainstream unless it is a tiny, safe recipe with real tests.',
      };
    case 'merge_candidate':
      return {
        explanation:
          row.priority === 'P0'
            ? `Promising fix for a serious bug: ${title}`
            : `This PR looks ready enough to skim: ${title}`,
        proposedSolution:
          'Read the diff. Confirm the claimed tests. Merge only through the normal ship path.',
      };
    case 'fix_needed':
      return {
        explanation:
          row.priority === 'P0'
            ? `Serious bug (security or data loss risk): ${title}`
            : `Real bug report: ${title}`,
        proposedSolution:
          row.priority === 'P0'
            ? 'Reproduce first. Ship a small safe fix with a test. Do this before polish work.'
            : 'Confirm on master. Add a failing test. Ship a narrow fix.',
      };
    case 'feature_consider':
      return {
        explanation: `Feature idea: ${title}. Only keep if it helps lots of users’ memory/search.`,
        proposedSolution: 'Accept only with clear tests and broad value. Otherwise park or close.',
      };
    case 'close_wontfix':
      return {
        explanation: 'Out of scope for mainstream gbrain.',
        proposedSolution: 'Close with a short note after maintainer approval.',
      };
    default:
      return {
        explanation: `Needs a human glance: ${title}`,
        proposedSolution: 'Skim the first paragraph. Then file as fix, feature, close, or duplicate.',
      };
  }
}

/**
 * True if the item should appear in the default "actionable" dashboard view.
 * @param {{disposition: string}} row
 */
export function isActionable(row) {
  return !['duplicate', 'already_fixed', 'low_value', 'proprietary', 'close_wontfix'].includes(
    row.disposition,
  );
}
