/**
 * BrainBench continuity — writer fixture replays through harness A, its
 * decision persists via the production write-back pipeline, reader fixture
 * replays through harness B on the SAME brain, and the decision must be
 * recallable. Scores land on the reader's cell.
 */
import { beforeAll, describe, expect, test } from 'bun:test';
import { loadCorpus } from '../src/eval/brainbench/fixtures.ts';
import { runBrainBench } from '../src/eval/brainbench/harness.ts';
import type { LoadedCorpus } from '../src/eval/brainbench/types.ts';

let pairCorpus: LoadedCorpus;

beforeAll(async () => {
  const corpus = await loadCorpus('evals/brainbench/fixtures', 'evals/brainbench/gold');
  const pair = corpus.fixtures.filter(
    (f) => f.fixture.continuity?.pair_id === 'cont-001',
  );
  expect(pair.length).toBe(2);
  pairCorpus = { ...corpus, fixtures: pair };
});

describe('writer openclaw → reader codex (and reverse) on a shared brain', () => {
  test('decision recalled in both directions; cells assigned to the READER harness', async () => {
    const out = await runBrainBench(pairCorpus, {
      harnesses: ['openclaw', 'codex'],
      suites: ['continuity', 'write-back'],
      includeHoldout: true,
      llm: false,
    });
    expect(out.seed_failures).toEqual([]);
    const contCells = out.cells.filter((c) => c.suite === 'continuity');
    expect(contCells.map((c) => c.harness).sort()).toEqual(['codex', 'openclaw']);
    for (const c of contCells) {
      expect(c.gold_total).toBe(1); // one decision probe per reader direction
      expect(c.gold_failed).toBe(0);
      expect(c.metrics.continuity_rate).toBe(1);
    }
    // Reader turn rows exist and carry the continuity suite tag.
    const readerRows = out.turn_rows.filter((r) => r.suite === 'continuity');
    expect(readerRows.length).toBeGreaterThan(0);
    expect(readerRows.every((r) => r.fixture_id === 'cont-001-widget-pass-reader')).toBe(true);
  });

  test('single-harness run falls back to the diagonal (writer == reader) instead of vanishing', async () => {
    const out = await runBrainBench(pairCorpus, {
      harnesses: ['openclaw'],
      suites: ['continuity'],
      includeHoldout: true,
      llm: false,
    });
    const cell = out.cells.find((c) => c.suite === 'continuity' && c.harness === 'openclaw');
    expect(cell).toBeDefined();
    expect(cell!.metrics.continuity_rate).toBe(1);
  });
});
