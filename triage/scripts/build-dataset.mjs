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

import { mkdir, readFile, writeFile, access, copyFile } from 'node:fs/promises';
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
import { isActionable, simpleExplain } from '../lib/simple-explain.mjs';

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

function parseId(id) {
  const [kind, num] = String(id).split(':');
  return { kind, number: Number(num) };
}

/**
 * Merge extra duplicate signals (body hash, jaccard, tfidf) into softDup map.
 */
function mergeExtraDups(softDup, extra) {
  const put = (members, reason, clusterPrefix) => {
    if (!members || members.length < 2) return;
    const sorted = [...members].sort((a, b) => a.number - b.number);
    const canonical = { kind: sorted[0].kind, number: sorted[0].number };
    const clusterId = `${clusterPrefix}:${canonical.kind}${canonical.number}`;
    for (const m of sorted) {
      const id = `${m.kind}:${m.number}`;
      if (softDup.has(id)) continue;
      softDup.set(id, {
        clusterId,
        members: sorted.map((x) => ({ kind: x.kind, number: x.number })),
        canonical,
        reason,
      });
    }
  };

  for (const g of extra.exact_body_groups || []) {
    put(g.members, 'Exact duplicate body text', 'body');
  }

  const jaccPairs = [];
  for (const p of extra.title_jaccard_pairs || []) {
    if ((p.jaccard || 0) < 0.75) continue;
    const a = parseId(p.a);
    const b = parseId(p.b);
    jaccPairs.push({
      aKind: a.kind,
      a: a.number,
      bKind: b.kind,
      b: b.number,
      cosine: p.jaccard,
    });
  }
  const fromJacc = buildSoftDupClusters(jaccPairs, 0.75);
  for (const [id, info] of fromJacc) {
    if (!softDup.has(id)) {
      softDup.set(id, { ...info, reason: 'Near-duplicate titles (token overlap ≥ 0.75)' });
    }
  }

  // Also fold tfidf from extra file if present (open-only pairs)
  const tfPairs = [];
  for (const p of extra.tfidf_pairs || []) {
    if ((p.cosine || 0) < 0.55) continue;
    const a = parseId(p.a);
    const b = parseId(p.b);
    tfPairs.push({ aKind: a.kind, a: a.number, bKind: b.kind, b: b.number, cosine: p.cosine });
  }
  const fromTf = buildSoftDupClusters(tfPairs, 0.55);
  for (const [id, info] of fromTf) {
    if (!softDup.has(id)) {
      softDup.set(id, { ...info, reason: 'Near-duplicate (similarity ≥ 0.55)' });
    }
  }
}

async function main() {
  await mkdir(DATA, { recursive: true });

  let openIssues;
  let openPrs;

  if (LIVE) {
    console.error(`Fetching open issues/PRs from ${REPO} (read-only)…`);
    openIssues = ghJson([
      'issue', 'list', '-R', REPO, '--state', 'open', '--limit', '1000',
      '--json', 'number,title,url,updatedAt,labels,createdAt,author,body',
    ]);
    openPrs = ghJson([
      'pr', 'list', '-R', REPO, '--state', 'open', '--limit', '1000',
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

  const extraPath = (await exists('/tmp/gbrain-triage-extra-dups.json'))
    ? '/tmp/gbrain-triage-extra-dups.json'
    : join(DATA, 'extra-dups.json');
  const extra = (await exists(extraPath)) ? await loadJson(extraPath) : {};

  // competing PRs that close the same issue
  /** @type {Map<number, number[]>} */
  const competingByPr = new Map();
  const multiClose = extra.multi_close_prs || {};
  for (const [, prs] of Object.entries(multiClose)) {
    for (const n of prs) competingByPr.set(Number(n), prs.map(Number));
  }
  // Also derive from audit closingIssuesReferences among open PRs
  const byIssueClosers = new Map();
  for (const it of openPrs) {
    const full = byPr.get(it.number) || it;
    const refs = full.closingIssuesReferences || [];
    for (const r of refs) {
      const num = typeof r === 'object' ? r.number : null;
      if (!num) continue;
      if (!byIssueClosers.has(num)) byIssueClosers.set(num, []);
      byIssueClosers.get(num).push(it.number);
    }
  }
  for (const [, prs] of byIssueClosers) {
    if (prs.length < 2) continue;
    for (const n of prs) competingByPr.set(n, prs);
  }

  const forClusters = [];
  for (const it of openIssues) forClusters.push({ kind: 'issue', number: it.number, title: it.title });
  for (const it of openPrs) forClusters.push({ kind: 'pr', number: it.number, title: it.title });

  const exactDup = buildExactTitleClusters(forClusters);
  const softDup = buildSoftDupClusters(softPairs, 0.55);
  mergeExtraDups(softDup, extra);

  const overrides = (await exists(join(DATA, 'simple-overrides.json')))
    ? await loadJson(join(DATA, 'simple-overrides.json'))
    : {};

  const testingNotes = (await exists(join(DATA, 'testing-notes.json')))
    ? await loadJson(join(DATA, 'testing-notes.json'))
    : {};

  const snapshotItems = [];
  const analysisItems = [];

  const pushIssue = (it) => {
    const full = byIssue.get(it.number) || it;
    const authorLogin = full.author?.login || it.author?.login || 'unknown';
    const body = full.body || it.body || '';
    const id = itemId('issue', it.number);
    const testEvidence = testingNotes[id]?.testsEvidence || ['N/A for issues — reproduce on current master.'];
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
      checks: null,
      testEvidence,
      lowValue: low,
      curated: CURATED[id],
    });

    const cluster = exactDup.get(id) || softDup.get(id) || null;
    const row = {
      id,
      kind: 'issue',
      number: it.number,
      title: it.title,
      disposition: classified.disposition,
      priority: classified.priority,
      confidence: classified.confidence,
      flags: classified.flags,
      explanation: classified.explanation,
      proposedSolution: classified.proposedSolution,
      testsEvidence: testEvidence,
      clusterId: cluster?.clusterId || null,
      canonical: cluster?.canonical || null,
      related: (cluster?.members || []).filter((m) => !(m.kind === 'issue' && m.number === it.number)),
      lowValueSignals: low,
      proprietary,
      checks: null,
    };
    // Prefer: LLM override > curated text > plain template
    if (overrides[id]) {
      row.explanation = overrides[id].explanation || row.explanation;
      row.proposedSolution = overrides[id].proposedSolution || row.proposedSolution;
    } else if (!CURATED[id]) {
      const plain = simpleExplain(row, {});
      row.explanation = plain.explanation;
      row.proposedSolution = plain.proposedSolution;
    }
    row.actionable = isActionable(row);
    if (testingNotes[id]?.note) {
      row.testsEvidence = [...row.testsEvidence, testingNotes[id].note];
    }

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
    analysisItems.push(row);
  };

  const pushPr = (it) => {
    const full = byPr.get(it.number) || it;
    const authorLogin = full.author?.login || it.author?.login || 'unknown';
    const body = full.body || it.body || '';
    const id = itemId('pr', it.number);
    const checks = summarizeChecks(it);
    let testEvidence = extractTestEvidence(body);
    if (testingNotes[id]?.testsEvidence) testEvidence = testingNotes[id].testsEvidence;
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
      changedFiles: it.changedFiles ?? full.changedFiles ?? null,
      additions: it.additions ?? null,
      deletions: it.deletions ?? null,
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
      competingPrs: competingByPr.get(it.number) || null,
    });

    const cluster = exactDup.get(id) || softDup.get(id) || null;
    const row = {
      id,
      kind: 'pr',
      number: it.number,
      title: it.title,
      disposition: classified.disposition,
      priority: classified.priority,
      confidence: classified.confidence,
      flags: classified.flags,
      explanation: classified.explanation,
      proposedSolution: classified.proposedSolution,
      testsEvidence: testEvidence,
      clusterId: cluster?.clusterId || null,
      canonical: cluster?.canonical || null,
      related: (cluster?.members || []).filter((m) => !(m.kind === 'pr' && m.number === it.number)),
      lowValueSignals: low,
      proprietary,
      checks,
    };
    if (overrides[id]) {
      row.explanation = overrides[id].explanation || row.explanation;
      row.proposedSolution = overrides[id].proposedSolution || row.proposedSolution;
    } else if (!CURATED[id]) {
      const plain = simpleExplain(row, {});
      row.explanation = plain.explanation;
      row.proposedSolution = plain.proposedSolution;
    }
    row.actionable = isActionable(row);
    if (testingNotes[id]?.note) {
      row.testsEvidence = [...row.testsEvidence, testingNotes[id].note];
    }

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
    analysisItems.push(row);
  };

  for (const it of openIssues) pushIssue(it);
  for (const it of openPrs) pushPr(it);

  const byDisp = {};
  const byPri = {};
  let actionable = 0;
  for (const a of analysisItems) {
    byDisp[a.disposition] = (byDisp[a.disposition] || 0) + 1;
    byPri[a.priority] = (byPri[a.priority] || 0) + 1;
    if (a.actionable) actionable += 1;
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
      actionable,
      filteredOut: analysisItems.length - actionable,
      byDisposition: byDisp,
      byPriority: byPri,
      exactDupItems: [...exactDup.keys()].length,
      softDupItems: [...softDup.keys()].length,
      masterReferenced: [...masterRefs].filter((id) => analysisItems.some((a) => a.id === id)).length,
      proprietary: analysisItems.filter((a) => a.proprietary || a.disposition === 'proprietary').length,
      greenCleanPrs: analysisItems.filter((a) => a.checks?.greenClean).length,
    },
    disclaimer:
      'Read-only recommendations. Do not close/label/merge/comment on GitHub until a human explicitly approves. Explanations are plain-English templates (+ optional small-model overrides).',
  };

  const snapshot = { meta, items: snapshotItems.sort((a, b) => b.number - a.number) };
  const analysis = {
    meta,
    items: analysisItems.sort((a, b) => {
      const pr = { P0: 0, P1: 1, P2: 2, P3: 3, none: 4 };
      const d = (pr[a.priority] ?? 9) - (pr[b.priority] ?? 9);
      if (d !== 0) return d;
      if (a.actionable !== b.actionable) return a.actionable ? -1 : 1;
      return b.number - a.number;
    }),
  };

  await writeFile(join(DATA, 'snapshot.json'), JSON.stringify(snapshot));
  await writeFile(join(DATA, 'analysis.json'), JSON.stringify(analysis));
  await writeFile(join(DATA, 'open-issues.cache.json'), JSON.stringify(openIssues));
  await writeFile(join(DATA, 'open-prs.cache.json'), JSON.stringify(openPrs));
  if (await exists('/tmp/gbrain-triage-extra-dups.json')) {
    await copyFile('/tmp/gbrain-triage-extra-dups.json', join(DATA, 'extra-dups.json'));
  }

  // Consolidation manifest (duplicates + competing PRs)
  const consolidations = analysisItems
    .filter((a) => a.disposition === 'duplicate' || a.flags?.includes('consolidate'))
    .map((a) => ({
      id: a.id,
      canonical: a.canonical,
      related: a.related,
      explanation: a.explanation,
      proposedSolution: a.proposedSolution,
    }));
  await writeFile(join(DATA, 'consolidations.json'), JSON.stringify({ meta: { generatedAt, count: consolidations.length }, items: consolidations }, null, 2));

  console.log(JSON.stringify(meta.counts, null, 2));
  console.error(`Wrote ${DATA}/snapshot.json and analysis.json (${analysisItems.length} items, actionable=${actionable})`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
