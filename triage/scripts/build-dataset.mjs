#!/usr/bin/env bun
/**
 * Build triage/data/snapshot.json + analysis.json from local audit caches
 * (or optional live `gh` refresh).
 *
 * Usage:
 *   bun triage/scripts/build-dataset.mjs
 *   bun triage/scripts/build-dataset.mjs --live   # refresh open lists via gh
 *
 * Never mutates GitHub (read-only).
 */

import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import {
  buildExactTitleClusters,
  buildSoftDupClusters,
  classifyItem,
  extractTestEvidence,
  isProprietaryFeature,
  itemId,
  lowValueSignals,
  summarizeChecks,
} from '../lib/classify.mjs';
import { CURATED } from '../lib/curated.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA = join(ROOT, 'data');
const LIVE = process.argv.includes('--live');

const REPO = process.env.GBRAIN_TRIAGE_REPO || 'garrytan/gbrain';

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function loadJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

function ghJson(args) {
  const r = spawnSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0) {
    throw new Error(`gh ${args.join(' ')} failed: ${r.stderr || r.stdout}`);
  }
  return JSON.parse(r.stdout);
}

function parseTfidfPairs(text) {
  const pairs = [];
  const re = /([IP])#(\d+) <> ([IP])#(\d+) cosine=([0-9.]+)/g;
  let m;
  while ((m = re.exec(text))) {
    pairs.push({
      aKind: m[1] === 'I' ? 'issue' : 'pr',
      a: Number(m[2]),
      bKind: m[3] === 'I' ? 'issue' : 'pr',
      b: Number(m[4]),
      cosine: Number(m[5]),
    });
  }
  return pairs;
}

function parseMasterRefs(text) {
  const refs = new Set();
  const re = /([IP])#(\d+)/g;
  let m;
  while ((m = re.exec(text))) {
    refs.add(`${m[1] === 'I' ? 'issue' : 'pr'}:${m[2]}`);
  }
  return refs;
}

function snippet(body, n = 420) {
  const s = String(body || '').replace(/\s+/g, ' ').trim();
  return s.length <= n ? s : s.slice(0, n - 1) + '…';
}

function simpleExplainFallback(row) {
  // Already set by classifyItem; keep for schema completeness.
  return row.explanation;
}

async function main() {
  await mkdir(DATA, { recursive: true });

  let openIssues;
  let openPrs;

  if (LIVE) {
    console.error(`Fetching open issues/PRs from ${REPO} (read-only)…`);
    openIssues = ghJson([
      'issue',
      'list',
      '-R',
      REPO,
      '--state',
      'open',
      '--limit',
      '1000',
      '--json',
      'number,title,url,updatedAt,labels,createdAt,author,body',
    ]);
    openPrs = ghJson([
      'pr',
      'list',
      '-R',
      REPO,
      '--state',
      'open',
      '--limit',
      '1000',
      '--json',
      'number,title,url,updatedAt,isDraft,mergeStateStatus,reviewDecision,statusCheckRollup,author,body,createdAt,additions,deletions,changedFiles',
    ]);
  } else {
    const issuePath = (await exists('/tmp/gbrain-open-issues.json'))
      ? '/tmp/gbrain-open-issues.json'
      : join(DATA, 'open-issues.cache.json');
    const prPath = (await exists('/tmp/gbrain-open-prs.json'))
      ? '/tmp/gbrain-open-prs.json'
      : join(DATA, 'open-prs.cache.json');
    if (!(await exists(issuePath)) || !(await exists(prPath))) {
      throw new Error('Missing open issue/PR caches. Re-run with --live or place JSON under /tmp.');
    }
    openIssues = await loadJson(issuePath);
    openPrs = await loadJson(prPath);
  }

  // Enrich from backlog audit (authors + bodies)
  const auditIssues = (await exists('/tmp/gbrain-backlog-audit/all_issues.json'))
    ? await loadJson('/tmp/gbrain-backlog-audit/all_issues.json')
    : (await exists('/tmp/gbrain-all-issues.json'))
      ? await loadJson('/tmp/gbrain-all-issues.json')
      : [];
  const auditPrs = (await exists('/tmp/gbrain-backlog-audit/all_prs.json'))
    ? await loadJson('/tmp/gbrain-backlog-audit/all_prs.json')
    : (await exists('/tmp/gbrain-all-prs.json'))
      ? await loadJson('/tmp/gbrain-all-prs.json')
      : [];

  const byIssue = new Map(auditIssues.map((x) => [x.number, x]));
  const byPr = new Map(auditPrs.map((x) => [x.number, x]));

  const authorIssueCount = new Map();
  const authorPrCount = new Map();
  for (const it of openIssues) {
    const full = byIssue.get(it.number) || it;
    const login = full.author?.login || it.author?.login || 'unknown';
    authorIssueCount.set(login, (authorIssueCount.get(login) || 0) + 1);
  }
  for (const it of openPrs) {
    const full = byPr.get(it.number) || it;
    const login = full.author?.login || it.author?.login || 'unknown';
    authorPrCount.set(login, (authorPrCount.get(login) || 0) + 1);
  }

  const tfidfPath = '/tmp/gbrain-tfidf-neighbors.txt';
  const softPairs = (await exists(tfidfPath))
    ? parseTfidfPairs(await readFile(tfidfPath, 'utf8'))
    : [];
  const masterPath = '/tmp/gbrain-open-items-in-master.txt';
  const masterRefs = (await exists(masterPath))
    ? parseMasterRefs(await readFile(masterPath, 'utf8'))
    : new Set();

  /** @type {Array<{kind:'issue'|'pr', number:number, title:string}>} */
  const forClusters = [];
  for (const it of openIssues) forClusters.push({ kind: 'issue', number: it.number, title: it.title });
  for (const it of openPrs) forClusters.push({ kind: 'pr', number: it.number, title: it.title });

  const exactDup = buildExactTitleClusters(forClusters);
  const softDup = buildSoftDupClusters(softPairs, 0.85);

  const snapshotItems = [];
  const analysisItems = [];

  const pushIssue = (it) => {
    const full = byIssue.get(it.number) || it;
    const authorLogin = full.author?.login || it.author?.login || 'unknown';
    const body = full.body || it.body || '';
    const id = itemId('issue', it.number);
    const checks = null;
    const testEvidence = ['N/A for issues'];
    const proprietary = isProprietaryFeature(it.title, body);
    const low = lowValueSignals({
      kind: 'issue',
      title: it.title,
      body,
      authorLogin,
      authorIssueCount: authorIssueCount.get(authorLogin) || 0,
      authorPrCount: authorPrCount.get(authorLogin) || 0,
    });
    const classified = classifyItem({
      kind: 'issue',
      number: it.number,
      title: it.title,
      body,
      exactDup: exactDup.get(id),
      softDup: softDup.get(id),
      masterReferenced: masterRefs.has(id),
      proprietary,
      checks,
      testEvidence,
      lowValue: low,
      curated: CURATED[id],
    });

    snapshotItems.push({
      id,
      kind: 'issue',
      number: it.number,
      title: it.title,
      url: it.url || `https://github.com/${REPO}/issues/${it.number}`,
      author: authorLogin,
      createdAt: full.createdAt || it.createdAt || null,
      updatedAt: it.updatedAt || full.updatedAt || null,
      labels: (it.labels || full.labels || []).map((l) => (typeof l === 'string' ? l : l.name)).filter(Boolean),
      bodySnippet: snippet(body),
    });

    const cluster = exactDup.get(id) || softDup.get(id) || null;
    analysisItems.push({
      id,
      kind: 'issue',
      number: it.number,
      disposition: classified.disposition,
      priority: classified.priority,
      confidence: classified.confidence,
      flags: classified.flags,
      explanation: simpleExplainFallback(classified),
      proposedSolution: classified.proposedSolution,
      testsEvidence: testEvidence,
      clusterId: cluster?.clusterId || null,
      canonical: cluster?.canonical || null,
      related: (cluster?.members || []).filter((m) => !(m.kind === 'issue' && m.number === it.number)),
      lowValueSignals: low,
      proprietary,
      checks: null,
    });
  };

  const pushPr = (it) => {
    const full = byPr.get(it.number) || it;
    const authorLogin = full.author?.login || it.author?.login || 'unknown';
    const body = full.body || it.body || '';
    const id = itemId('pr', it.number);
    const checks = summarizeChecks(it);
    const testEvidence = extractTestEvidence(body);
    const proprietary = isProprietaryFeature(it.title, body);
    const low = lowValueSignals({
      kind: 'pr',
      title: it.title,
      body,
      authorLogin,
      authorIssueCount: authorIssueCount.get(authorLogin) || 0,
      authorPrCount: authorPrCount.get(authorLogin) || 0,
      checks,
      testEvidence,
    });
    const classified = classifyItem({
      kind: 'pr',
      number: it.number,
      title: it.title,
      body,
      exactDup: exactDup.get(id),
      softDup: softDup.get(id),
      masterReferenced: masterRefs.has(id),
      proprietary,
      checks,
      testEvidence,
      lowValue: low,
      curated: CURATED[id],
    });

    snapshotItems.push({
      id,
      kind: 'pr',
      number: it.number,
      title: it.title,
      url: it.url || `https://github.com/${REPO}/pull/${it.number}`,
      author: authorLogin,
      createdAt: full.createdAt || it.createdAt || null,
      updatedAt: it.updatedAt || full.updatedAt || null,
      labels: (it.labels || full.labels || []).map((l) => (typeof l === 'string' ? l : l.name)).filter(Boolean),
      bodySnippet: snippet(body),
      isDraft: Boolean(it.isDraft),
      mergeStateStatus: it.mergeStateStatus || null,
      reviewDecision: it.reviewDecision || null,
      additions: it.additions ?? null,
      deletions: it.deletions ?? null,
      changedFiles: it.changedFiles ?? null,
    });

    const cluster = exactDup.get(id) || softDup.get(id) || null;
    analysisItems.push({
      id,
      kind: 'pr',
      number: it.number,
      disposition: classified.disposition,
      priority: classified.priority,
      confidence: classified.confidence,
      flags: classified.flags,
      explanation: simpleExplainFallback(classified),
      proposedSolution: classified.proposedSolution,
      testsEvidence: testEvidence,
      clusterId: cluster?.clusterId || null,
      canonical: cluster?.canonical || null,
      related: (cluster?.members || []).filter((m) => !(m.kind === 'pr' && m.number === it.number)),
      lowValueSignals: low,
      proprietary,
      checks,
    });
  };

  for (const it of openIssues) pushIssue(it);
  for (const it of openPrs) pushPr(it);

  // Stats
  const byDisp = {};
  const byPri = {};
  for (const a of analysisItems) {
    byDisp[a.disposition] = (byDisp[a.disposition] || 0) + 1;
    byPri[a.priority] = (byPri[a.priority] || 0) + 1;
  }

  const generatedAt = new Date().toISOString();
  const meta = {
    generatedAt,
    repo: REPO,
    source: LIVE ? 'live-gh' : 'local-cache',
    masterShaHint: 'see audit snapshot date; verify against current master before acting',
    counts: {
      issues: openIssues.length,
      prs: openPrs.length,
      total: analysisItems.length,
      byDisposition: byDisp,
      byPriority: byPri,
      exactDupItems: [...exactDup.keys()].length,
      softDupItems: [...softDup.keys()].length,
      masterReferenced: [...masterRefs].filter((id) => analysisItems.some((a) => a.id === id)).length,
      proprietary: analysisItems.filter((a) => a.proprietary).length,
      greenCleanPrs: analysisItems.filter((a) => a.checks?.greenClean).length,
    },
    disclaimer:
      'Read-only recommendations. Do not close/label/merge/comment on GitHub until a human explicitly approves. Explanations are heuristic + curated overrides, not legal review.',
  };

  const snapshot = { meta, items: snapshotItems.sort((a, b) => b.number - a.number) };
  const analysis = {
    meta,
    items: analysisItems.sort((a, b) => {
      const pr = { P0: 0, P1: 1, P2: 2, P3: 3, none: 4 };
      const d = (pr[a.priority] ?? 9) - (pr[b.priority] ?? 9);
      if (d !== 0) return d;
      return b.number - a.number;
    }),
  };

  await writeFile(join(DATA, 'snapshot.json'), JSON.stringify(snapshot));
  await writeFile(join(DATA, 'analysis.json'), JSON.stringify(analysis));
  // Keep caches for offline rebuild without /tmp
  await writeFile(join(DATA, 'open-issues.cache.json'), JSON.stringify(openIssues));
  await writeFile(join(DATA, 'open-prs.cache.json'), JSON.stringify(openPrs));

  console.log(JSON.stringify(meta.counts, null, 2));
  console.error(`Wrote ${DATA}/snapshot.json and analysis.json (${analysisItems.length} items)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
