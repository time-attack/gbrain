const STORAGE_KEY = 'gbrain.triage.selected.v1';

const dispositionOrder = [
  'fix_needed',
  'merge_candidate',
  'feature_consider',
  'needs_review',
  'proprietary',
  'already_fixed',
  'duplicate',
  'low_value',
  'close_wontfix',
];

const state = {
  snapshot: null,
  analysis: null,
  byId: new Map(),
  selected: loadSelected(),
  filters: {
    q: '',
    kind: 'all',
    disposition: 'all',
    priority: 'all',
    dup: false,
    low: false,
    prop: false,
    green: false,
    selectedOnly: false,
    sort: 'priority',
  },
};

function loadSelected() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function saveSelected() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.selected]));
}

async function boot() {
  const [snapshot, analysis] = await Promise.all([
    fetch('./data/snapshot.json').then((r) => r.json()),
    fetch('./data/analysis.json').then((r) => r.json()),
  ]);
  state.snapshot = snapshot;
  state.analysis = analysis;
  const snapById = new Map(snapshot.items.map((i) => [i.id, i]));
  for (const a of analysis.items) {
    state.byId.set(a.id, { ...a, ...(snapById.get(a.id) || {}) });
  }
  fillDispositionSelect();
  renderStats();
  bind();
  render();
  document.getElementById('metaLine').textContent =
    `${analysis.meta.generatedAt} · ${analysis.meta.repo} · ${analysis.meta.source} · ${analysis.meta.counts.total} items`;
}

function fillDispositionSelect() {
  const sel = document.getElementById('disposition');
  for (const d of dispositionOrder) {
    const opt = document.createElement('option');
    opt.value = d;
    opt.textContent = d;
    sel.appendChild(opt);
  }
}

function renderStats() {
  const c = state.analysis.meta.counts;
  const cells = [
    ['Issues', c.issues],
    ['PRs', c.prs],
    ['P0', c.byPriority?.P0 || 0],
    ['Merge cand.', c.byDisposition?.merge_candidate || 0],
    ['Duplicates', c.byDisposition?.duplicate || 0],
    ['Proprietary', c.proprietary || 0],
    ['Low-value', c.byDisposition?.low_value || 0],
    ['Green+CLEAN', c.greenCleanPrs || 0],
  ];
  document.getElementById('statGrid').innerHTML = cells
    .map(([l, n]) => `<div class="stat"><div class="n">${n}</div><div class="l">${l}</div></div>`)
    .join('');
}

function bind() {
  const map = {
    search: (e) => (state.filters.q = e.target.value.trim().toLowerCase()),
    kind: (e) => (state.filters.kind = e.target.value),
    disposition: (e) => (state.filters.disposition = e.target.value),
    priority: (e) => (state.filters.priority = e.target.value),
    sort: (e) => (state.filters.sort = e.target.value),
  };
  for (const [id, fn] of Object.entries(map)) {
    document.getElementById(id).addEventListener('input', (e) => {
      fn(e);
      render();
    });
    document.getElementById(id).addEventListener('change', (e) => {
      fn(e);
      render();
    });
  }
  for (const [id, key] of [
    ['fDup', 'dup'],
    ['fLow', 'low'],
    ['fProp', 'prop'],
    ['fGreen', 'green'],
    ['fSelected', 'selectedOnly'],
  ]) {
    document.getElementById(id).addEventListener('change', (e) => {
      state.filters[key] = e.target.checked;
      render();
    });
  }
  document.getElementById('btnSelectVisible').addEventListener('click', () => {
    for (const row of filtered()) state.selected.add(row.id);
    saveSelected();
    render();
  });
  document.getElementById('btnClearSelection').addEventListener('click', () => {
    state.selected.clear();
    saveSelected();
    render();
  });
  document.getElementById('btnExport').addEventListener('click', exportSelected);
}

function filtered() {
  const f = state.filters;
  let rows = [...state.byId.values()];
  if (f.kind !== 'all') rows = rows.filter((r) => r.kind === f.kind);
  if (f.disposition !== 'all') rows = rows.filter((r) => r.disposition === f.disposition);
  if (f.priority !== 'all') rows = rows.filter((r) => r.priority === f.priority);
  if (f.dup) rows = rows.filter((r) => r.disposition === 'duplicate' || r.flags?.includes('duplicate'));
  if (f.low) rows = rows.filter((r) => r.disposition === 'low_value' || r.flags?.includes('low_value'));
  if (f.prop) rows = rows.filter((r) => r.proprietary || r.disposition === 'proprietary');
  if (f.green) rows = rows.filter((r) => r.checks?.greenClean);
  if (f.selectedOnly) rows = rows.filter((r) => state.selected.has(r.id));
  if (f.q) {
    rows = rows.filter((r) => {
      const blob = `${r.number} ${r.title} ${r.author} ${r.explanation} ${r.proposedSolution} ${r.disposition}`.toLowerCase();
      return blob.includes(f.q);
    });
  }
  const pri = { P0: 0, P1: 1, P2: 2, P3: 3, none: 4 };
  rows.sort((a, b) => {
    if (f.sort === 'number') return b.number - a.number;
    if (f.sort === 'updated') return String(b.updatedAt || '').localeCompare(String(a.updatedAt || ''));
    if (f.sort === 'confidence') return (b.confidence || 0) - (a.confidence || 0);
    const d = (pri[a.priority] ?? 9) - (pri[b.priority] ?? 9);
    if (d !== 0) return d;
    return b.number - a.number;
  });
  return rows;
}

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render() {
  const rows = filtered();
  const tbody = document.getElementById('rows');
  tbody.innerHTML = rows
    .map((r) => {
      const checked = state.selected.has(r.id) ? 'checked' : '';
      const idLabel = r.kind === 'issue' ? `I#${r.number}` : `P#${r.number}`;
      const sub = [
        r.author,
        r.kind === 'pr' ? r.mergeStateStatus || '' : '',
        r.checks?.ci && r.checks.ci !== 'none' ? `ci:${r.checks.ci}` : '',
        r.clusterId ? `cluster` : '',
      ]
        .filter(Boolean)
        .join(' · ');
      const tests = (r.testsEvidence || []).slice(0, 2).join(' ');
      return `<tr data-id="${esc(r.id)}">
        <td class="col-check"><input type="checkbox" data-sel="${esc(r.id)}" ${checked} /></td>
        <td class="col-id"><a href="${esc(r.url)}" target="_blank" rel="noopener">${idLabel}</a></td>
        <td class="col-title">
          <button type="button" class="btn-link title-main" data-open="${esc(r.id)}">${esc(r.title)}</button>
          <div class="title-sub">${esc(sub)}</div>
        </td>
        <td class="col-disp"><span class="badge ${esc(r.disposition)}">${esc(r.disposition)}</span></td>
        <td class="col-pri pri-${esc(r.priority)}">${esc(r.priority)}</td>
        <td class="col-explain">${esc(r.explanation)}</td>
        <td class="col-tests">${esc(tests)}</td>
        <td class="col-sol">${esc(r.proposedSolution)}</td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('input[data-sel]').forEach((el) => {
    el.addEventListener('change', () => {
      const id = el.getAttribute('data-sel');
      if (el.checked) state.selected.add(id);
      else state.selected.delete(id);
      saveSelected();
      document.getElementById('footer').textContent =
        `${rows.length} shown · ${state.selected.size} selected`;
    });
  });
  tbody.querySelectorAll('button[data-open]').forEach((el) => {
    el.addEventListener('click', () => openDetail(el.getAttribute('data-open')));
  });

  document.getElementById('footer').textContent =
    `${rows.length} shown · ${state.selected.size} selected · checkboxes saved in localStorage`;
}

function openDetail(id) {
  const r = state.byId.get(id);
  if (!r) return;
  document.getElementById('detailTitle').textContent =
    `${r.kind === 'issue' ? 'Issue' : 'PR'} #${r.number}: ${r.title}`;
  const related = (r.related || [])
    .map((x) => `${x.kind === 'issue' ? 'I' : 'P'}#${x.number}`)
    .join(', ');
  document.getElementById('detailBody').innerHTML = `
    <div class="block"><h3>Explanation</h3><p>${esc(r.explanation)}</p></div>
    <div class="block"><h3>Proposed solution</h3><p>${esc(r.proposedSolution)}</p></div>
    <div class="block"><h3>What was tested</h3><p>${esc((r.testsEvidence || []).join('\n'))}</p></div>
    <div class="block"><h3>Snippet</h3><p>${esc(r.bodySnippet || '')}</p></div>
    <div class="block"><h3>Meta</h3><p>${esc(
      [
        `disposition=${r.disposition}`,
        `priority=${r.priority}`,
        `confidence=${r.confidence}`,
        `flags=${(r.flags || []).join(',') || '-'}`,
        `canonical=${r.canonical ? `${r.canonical.kind}:${r.canonical.number}` : '-'}`,
        `related=${related || '-'}`,
        `proprietary=${Boolean(r.proprietary)}`,
        `url=${r.url}`,
      ].join('\n'),
    )}</p></div>
  `;
  document.getElementById('detail').showModal();
}

function exportSelected() {
  const items = [...state.selected]
    .map((id) => state.byId.get(id))
    .filter(Boolean)
    .map((r) => ({
      id: r.id,
      kind: r.kind,
      number: r.number,
      title: r.title,
      url: r.url,
      disposition: r.disposition,
      priority: r.priority,
      explanation: r.explanation,
      proposedSolution: r.proposedSolution,
      testsEvidence: r.testsEvidence,
      flags: r.flags,
    }));
  const blob = new Blob(
    [
      JSON.stringify(
        {
          exportedAt: new Date().toISOString(),
          note: 'Approval manifest draft — do not apply to GitHub without explicit human approval.',
          count: items.length,
          items,
        },
        null,
        2,
      ),
    ],
    { type: 'application/json' },
  );
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `gbrain-triage-selection-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

boot().catch((err) => {
  document.getElementById('metaLine').textContent = `Failed to load data: ${err.message}`;
  console.error(err);
});
