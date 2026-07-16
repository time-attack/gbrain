#!/usr/bin/env bun
/**
 * Apply triage labels on garrytan/gbrain from triage/data/analysis.json.
 * Uses `gh` CLI. Read-only against local JSON; mutates GitHub labels only.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const REPO = process.env.GBRAIN_TRIAGE_REPO || 'garrytan/gbrain';
const DRY = process.argv.includes('--dry-run');
const LIMIT = Number(process.env.LABEL_LIMIT || '0'); // 0 = all

const LABELS = [
  { name: 'duplicate', color: 'cfd3d7', description: 'Duplicate of another issue or PR' },
  { name: 'already-fixed', color: '0e8a16', description: 'Likely fixed on master; verified or candidate' },
  { name: 'proprietary', color: 'd4c5f9', description: 'Niche / non-mainstream API or tool integration' },
  { name: 'low-value', color: 'fbca04', description: 'Low signal: conflicts, no CI, noise — not Wave 1' },
  { name: 'p0', color: 'b60205', description: 'P0: security or data-loss risk' },
  { name: 'p1', color: 'e99695', description: 'P1: important bug / high-priority fix' },
  { name: 'p2', color: 'f9d0c4', description: 'P2: feature or medium priority' },
  { name: 'p3', color: 'fef2c0', description: 'P3: low priority / needs glance' },
  { name: 'merge-candidate', color: '1d76db', description: 'Promising PR to skim for merge' },
  { name: 'fix-needed', color: 'd93f0b', description: 'Confirmed/likely bug worth fixing' },
  { name: 'needs-review', color: 'bfd4f2', description: 'Needs a human skim to classify' },
  { name: 'feature-consider', color: '5319e7', description: 'Feature/proposal to consider' },
];

function gh(args, { ignoreFail = false } = {}) {
  const r = spawnSync('gh', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (r.status !== 0 && !ignoreFail) {
    return { ok: false, err: (r.stderr || r.stdout || '').trim(), out: '' };
  }
  return { ok: true, out: (r.stdout || '').trim(), err: (r.stderr || '').trim() };
}

function ensureLabels() {
  for (const l of LABELS) {
    if (DRY) {
      console.error(`[dry] ensure label ${l.name}`);
      continue;
    }
    const create = gh(
      [
        'label',
        'create',
        l.name,
        '-R',
        REPO,
        '--color',
        l.color,
        '--description',
        l.description,
        '--force',
      ],
      { ignoreFail: true },
    );
    // --force upserts on modern gh
    if (!create.ok) {
      console.error(`label upsert ${l.name}: ${create.err || create.out}`);
    } else {
      console.error(`label ok: ${l.name}`);
    }
  }
}

function labelsFor(item, opts = {}) {
  /** @type {string[]} */
  const out = [];
  const d = item.disposition;
  if (d === 'duplicate') out.push('duplicate');
  // Only tag already-fixed when verify agent closed it (or no verify log yet).
  if (d === 'already_fixed' && !opts.skipAlreadyFixed?.has(item.id)) {
    out.push('already-fixed');
  }
  if (d === 'proprietary' || item.proprietary) out.push('proprietary');
  if (d === 'low_value') out.push('low-value');
  if (d === 'merge_candidate') out.push('merge-candidate');
  if (d === 'fix_needed') out.push('fix-needed');
  if (d === 'needs_review') out.push('needs-review');
  if (d === 'feature_consider') out.push('feature-consider');
  if (d === 'close_wontfix') out.push('low-value');

  if (item.priority === 'P0') out.push('p0');
  else if (item.priority === 'P1') out.push('p1');
  else if (item.priority === 'P2') out.push('p2');
  else if (item.priority === 'P3') out.push('p3');

  // Every item must get at least a disposition or priority label.
  if (!out.length) out.push('needs-review');
  return [...new Set(out)];
}

function loadSkipAlreadyFixed() {
  /** @type {Set<string>} */
  const skip = new Set();
  try {
    const rows = JSON.parse(readFileSync('/tmp/gbrain-already-fixed-results.json', 'utf8'));
    for (const r of rows) {
      if (r.action === 'left_open' || r.action === 'skipped') {
        if (r.id) skip.add(r.id);
        else if (r.kind && r.number) skip.add(`${r.kind}:${r.number}`);
      }
    }
  } catch {
    // optional
  }
  return skip;
}

function main() {
  const analysis = JSON.parse(readFileSync(new URL('../data/analysis.json', import.meta.url), 'utf8'));
  ensureLabels();
  const skipAlreadyFixed = loadSkipAlreadyFixed();
  if (skipAlreadyFixed.size) {
    console.error(`skip already-fixed label for ${skipAlreadyFixed.size} verify left_open/skipped items`);
  }

  const jobs = [];
  for (const item of analysis.items) {
    const labs = labelsFor(item, { skipAlreadyFixed });
    if (!labs.length) continue;
    jobs.push({ number: item.number, kind: item.kind, id: item.id, labels: labs, disposition: item.disposition, priority: item.priority });
  }
  jobs.sort((a, b) => b.number - a.number);
  const work = LIMIT > 0 ? jobs.slice(0, LIMIT) : jobs;
  console.error(`jobs=${jobs.length} applying=${work.length} dry=${DRY} repo=${REPO}`);

  const results = [];
  let ok = 0;
  let fail = 0;
  for (let i = 0; i < work.length; i++) {
    const j = work[i];
    if (DRY) {
      console.error(`[dry] #${j.number} <- ${j.labels.join(',')}`);
      results.push({ ...j, status: 'dry' });
      continue;
    }
    // gh label can take multiple labels; edit for issues and PRs uses same endpoint via `gh issue edit` / `gh pr edit`
    const cmd =
      j.kind === 'pr'
        ? ['pr', 'edit', String(j.number), '-R', REPO, ...j.labels.flatMap((l) => ['--add-label', l])]
        : ['issue', 'edit', String(j.number), '-R', REPO, ...j.labels.flatMap((l) => ['--add-label', l])];
    const r = gh(cmd, { ignoreFail: true });
    if (r.ok) {
      ok++;
      results.push({ ...j, status: 'ok' });
      if ((i + 1) % 25 === 0) console.error(`progress ${i + 1}/${work.length} ok=${ok} fail=${fail}`);
    } else {
      // Closed PRs sometimes need issue edit; try issue edit as fallback for both
      const r2 = gh(
        ['issue', 'edit', String(j.number), '-R', REPO, ...j.labels.flatMap((l) => ['--add-label', l])],
        { ignoreFail: true },
      );
      if (r2.ok) {
        ok++;
        results.push({ ...j, status: 'ok_via_issue_edit' });
      } else {
        fail++;
        results.push({ ...j, status: 'fail', err: r.err || r2.err });
        console.error(`FAIL #${j.number}: ${r.err || r2.err}`);
      }
    }
    // gentle pacing
    if (i % 10 === 9) Bun.sleepSync(200);
  }

  const summary = {
    repo: REPO,
    dry: DRY,
    totalJobs: jobs.length,
    applied: work.length,
    ok,
    fail,
    byLabel: {},
  };
  for (const j of work) {
    for (const l of j.labels) summary.byLabel[l] = (summary.byLabel[l] || 0) + 1;
  }
  writeFileSync('/tmp/gbrain-label-results.json', JSON.stringify({ summary, results }, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  console.error('wrote /tmp/gbrain-label-results.json');
  if (fail > 0) process.exitCode = 1;
}

main();
