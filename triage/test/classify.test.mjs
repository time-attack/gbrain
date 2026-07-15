import { describe, expect, test } from 'bun:test';
import {
  buildExactTitleClusters,
  buildSoftDupClusters,
  classifyItem,
  extractTestEvidence,
  isProprietaryFeature,
  isSecurityOrDataLoss,
  normalizeTitle,
  summarizeChecks,
} from '../lib/classify.mjs';

describe('normalizeTitle', () => {
  test('collapses punctuation and case', () => {
    expect(normalizeTitle('Bug(CLI): book-mirror dispatcher!')).toBe(
      'bug cli book mirror dispatcher',
    );
  });
});

describe('isProprietaryFeature', () => {
  test('flags niche provider in title', () => {
    expect(isProprietaryFeature('Add Kimi / Moonshot AI provider recipe')).toBe(true);
  });
  test('does not flag DeepSeek-only repro of a gateway bug', () => {
    expect(
      isProprietaryFeature(
        'gateway.chat(): incorrect tool schema format breaks non-Anthropic providers',
        'Repro on DeepSeek via agent.use_gateway_loop',
      ),
    ).toBe(false);
  });
  test('flags proposal integrations', () => {
    expect(
      isProprietaryFeature(
        'Recipe proposal: email-archive-to-brain (historical email import from Google Takeout)',
      ),
    ).toBe(true);
  });
});

describe('security / data loss', () => {
  test('detects mass-delete language', () => {
    expect(isSecurityOrDataLoss('Windows sync mass-delete of pages')).toBe(true);
  });
  test('detects token leak', () => {
    expect(isSecurityOrDataLoss('Admin token leakage in response')).toBe(true);
  });
});

describe('summarizeChecks', () => {
  test('green clean', () => {
    const s = summarizeChecks({
      isDraft: false,
      mergeStateStatus: 'CLEAN',
      statusCheckRollup: [{ conclusion: 'SUCCESS' }, { conclusion: 'NEUTRAL' }],
    });
    expect(s.greenClean).toBe(true);
    expect(s.ci).toBe('green');
  });
  test('dirty is not greenClean', () => {
    const s = summarizeChecks({
      isDraft: false,
      mergeStateStatus: 'DIRTY',
      statusCheckRollup: [{ conclusion: 'SUCCESS' }],
    });
    expect(s.greenClean).toBe(false);
  });
});

describe('clusters', () => {
  test('exact title clusters pick lowest number as canonical', () => {
    const map = buildExactTitleClusters([
      { kind: 'issue', number: 2814, title: 'extract_atoms slug hyphen' },
      { kind: 'issue', number: 2810, title: 'extract_atoms slug hyphen' },
    ]);
    expect(map.get('issue:2814').canonical).toEqual({ kind: 'issue', number: 2810 });
    expect(map.get('issue:2810').canonical.number).toBe(2810);
  });

  test('soft dup clusters connect high cosine pairs', () => {
    const map = buildSoftDupClusters(
      [
        { aKind: 'issue', a: 1, bKind: 'issue', b: 2, cosine: 0.9 },
        { aKind: 'issue', a: 2, bKind: 'issue', b: 3, cosine: 0.88 },
      ],
      0.85,
    );
    expect(map.get('issue:3').members.map((m) => m.number).sort()).toEqual([1, 2, 3]);
  });
});

describe('classifyItem', () => {
  test('duplicate non-canonical', () => {
    const r = classifyItem({
      kind: 'issue',
      number: 2814,
      title: 'dup',
      exactDup: {
        reason: 'Exact normalized title match',
        canonical: { kind: 'issue', number: 2810 },
        members: [
          { kind: 'issue', number: 2810 },
          { kind: 'issue', number: 2814 },
        ],
      },
    });
    expect(r.disposition).toBe('duplicate');
    expect(r.proposedSolution).toContain('#2810');
  });

  test('curated override wins', () => {
    const r = classifyItem({
      kind: 'pr',
      number: 472,
      title: 'whatever',
      curated: {
        disposition: 'merge_candidate',
        priority: 'P1',
        explanation: 'curated',
        proposedSolution: 'merge',
        flags: ['curated_strong'],
      },
    });
    expect(r.disposition).toBe('merge_candidate');
    expect(r.explanation).toBe('curated');
  });

  test('green clean PR becomes merge_candidate', () => {
    const r = classifyItem({
      kind: 'pr',
      number: 9999,
      title: 'fix: something',
      checks: { greenClean: true, ci: 'green', mergeState: 'CLEAN', draft: false },
      testEvidence: ['Author claims `bun test` was run.'],
    });
    expect(r.disposition).toBe('merge_candidate');
    expect(r.priority).toBe('P1');
  });
});

describe('extractTestEvidence', () => {
  test('finds bun test and files', () => {
    const lines = extractTestEvidence(
      '## Tests\nRan bun test test/foo.test.ts\nalso typecheck',
    );
    expect(lines.some((l) => /bun test/i.test(l))).toBe(true);
    expect(lines.some((l) => /foo\.test\.ts/.test(l))).toBe(true);
  });
});
