#!/usr/bin/env bun
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const notes = {};
const dir = '/tmp/gbrain-pr-deep';
const analysis = JSON.parse(readFileSync('triage/data/analysis.json', 'utf8'));
const mergeIds = new Set(
  analysis.items.filter((x) => x.disposition === 'merge_candidate').map((x) => x.number),
);

for (const file of readdirSync(dir)) {
  if (!file.endsWith('.json')) continue;
  const pr = JSON.parse(readFileSync(`${dir}/${file}`, 'utf8'));
  if (!pr.number || !mergeIds.has(pr.number)) continue;
  const files = (pr.files || []).map((f) => f.path);
  const testFiles = files.filter((p) => /test\/.+\.test\.(ts|js)$/.test(p));
  const id = `pr:${pr.number}`;
  const evidence = [];
  evidence.push(`PR files changed: ${files.length}`);
  if (testFiles.length) evidence.push(`Touches tests: ${testFiles.slice(0, 6).join(', ')}`);
  else evidence.push('No test files in the PR file list.');

  const checks = pr.statusCheckRollup || [];
  if (checks.length) {
    const states = checks.map((c) => `${c.name || c.context || 'check'}:${c.conclusion || c.state}`);
    evidence.push(`Upstream checks: ${states.slice(0, 6).join(', ')}`);
  } else {
    evidence.push('Upstream checks: none visible');
  }

  const localTests = testFiles.filter((p) => existsSync(p));
  if (localTests.length && existsSync('node_modules')) {
    const r = spawnSync('bun', ['test', ...localTests], {
      encoding: 'utf8',
      timeout: 180000,
      env: process.env,
    });
    const out = `${r.stdout || ''}\n${r.stderr || ''}`;
    const summary = out
      .split('\n')
      .filter((l) => /pass|fail|error|Ran /.test(l))
      .slice(-6)
      .join(' | ');
    evidence.push(`Local re-run of overlapping test paths on this checkout: exit=${r.status}. ${summary.slice(0, 300)}`);
    notes[id] = {
      testsEvidence: evidence,
      note:
        r.status === 0
          ? 'Overlapping local tests PASSED on this workspace checkout (not a full PR-branch CI).'
          : 'Overlapping local tests FAILED/timed out on this checkout (PR branch may differ).',
      deepTestStatus: r.status === 0 ? 'pass' : 'fail',
    };
  } else if (localTests.length && !existsSync('node_modules')) {
    evidence.push('Skipped local re-run: node_modules missing in this environment.');
    notes[id] = {
      testsEvidence: evidence,
      note: 'Deps not installed here; recorded PR file/check signals only.',
      deepTestStatus: 'skipped_no_deps',
    };
  } else {
    notes[id] = {
      testsEvidence: evidence,
      note: 'Could not re-run PR tests here (paths missing on checkout or PR has no tests). Author claims + CI signals only.',
      deepTestStatus: 'skipped',
    };
  }
  console.log(id, notes[id].deepTestStatus, `tests=${testFiles.length}`, `local=${localTests.length}`);
}

writeFileSync('triage/data/testing-notes.json', JSON.stringify(notes, null, 2));
console.log('wrote', Object.keys(notes).length, 'testing notes');
