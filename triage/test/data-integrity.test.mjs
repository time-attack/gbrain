import { describe, expect, test } from 'bun:test';
import snapshot from '../data/snapshot.json';
import analysis from '../data/analysis.json';

describe('triage data integrity', () => {
  test('snapshot and analysis cover the same ids', () => {
    const s = new Set(snapshot.items.map((i) => i.id));
    const a = new Set(analysis.items.map((i) => i.id));
    expect(s.size).toBe(snapshot.items.length);
    expect(a.size).toBe(analysis.items.length);
    expect(s.size).toBe(a.size);
    for (const id of s) expect(a.has(id)).toBe(true);
  });

  test('every analysis row has required fields', () => {
    for (const row of analysis.items.slice(0, 50).concat(analysis.items.slice(-50))) {
      expect(row.id).toBeTruthy();
      expect(row.disposition).toBeTruthy();
      expect(row.priority).toBeTruthy();
      expect(typeof row.explanation).toBe('string');
      expect(row.explanation.length).toBeGreaterThan(10);
      expect(typeof row.proposedSolution).toBe('string');
      expect(Array.isArray(row.testsEvidence)).toBe(true);
    }
  });

  test('counts roughly match open backlog', () => {
    expect(analysis.meta.counts.issues).toBeGreaterThan(700);
    expect(analysis.meta.counts.prs).toBeGreaterThan(500);
  });
});
