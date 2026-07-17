import { writeFileSync } from 'node:fs';
import a from '../data/analysis.json';
import s from '../data/snapshot.json';
import overrides from '../data/simple-overrides.json';

const snap = new Map(s.items.map((i) => [i.id, i]));
const by = (d) => a.items.filter((x) => x.disposition === d);
const low = by('low_value');
const fixed = by('already_fixed');
const prop = a.items.filter((x) => x.disposition === 'proprietary' || x.proprietary);

console.log('=== CLARIFY 94 ===');
console.log('total open', a.meta.counts.total);
console.log('actionable', a.meta.counts.actionable);
console.log('P0 total', a.meta.counts.byPriority.P0);
console.log('merge_candidate', a.meta.counts.byDisposition.merge_candidate);
console.log('simple-override rewrites', Object.keys(overrides).length);
console.log(
  'P0 OR merge_candidate actionable',
  a.items.filter((x) => x.actionable && (x.priority === 'P0' || x.disposition === 'merge_candidate'))
    .length,
);

console.log('\n=== LOW_VALUE SUMMARY ===');
console.log('count', low.length);
console.log('issues', low.filter((x) => x.kind === 'issue').length, 'prs', low.filter((x) => x.kind === 'pr').length);
const lowReasons = {};
for (const x of low) {
  for (const sig of x.lowValueSignals || ['(no signal)']) {
    const key = sig.slice(0, 90);
    lowReasons[key] = (lowReasons[key] || 0) + 1;
  }
}
console.log('top signals:');
for (const [k, v] of Object.entries(lowReasons).sort((a, b) => b[1] - a[1]).slice(0, 15)) {
  console.log(`  ${v}\t${k}`);
}

console.log('\n=== ALREADY_FIXED SUMMARY ===');
console.log('count', fixed.length);
console.log('issues', fixed.filter((x) => x.kind === 'issue').length, 'prs', fixed.filter((x) => x.kind === 'pr').length);

const out = {
  low_value: low
    .map((x) => ({
      id: x.id,
      number: x.number,
      kind: x.kind,
      title: snap.get(x.id)?.title || x.title,
      url: snap.get(x.id)?.url,
      signals: (x.lowValueSignals || []).slice(0, 3),
    }))
    .sort((a, b) => b.number - a.number),
  already_fixed: fixed
    .map((x) => ({
      id: x.id,
      number: x.number,
      kind: x.kind,
      title: snap.get(x.id)?.title || x.title,
      url: snap.get(x.id)?.url,
    }))
    .sort((a, b) => b.number - a.number),
  proprietary: prop
    .map((x) => ({
      id: x.id,
      number: x.number,
      kind: x.kind,
      title: snap.get(x.id)?.title || x.title,
      url: snap.get(x.id)?.url,
      disposition: x.disposition,
      snippet: snap.get(x.id)?.bodySnippet || '',
    }))
    .sort((a, b) => b.number - a.number),
};
writeFileSync('/tmp/gbrain-lists.json', JSON.stringify(out, null, 2));
console.log('wrote', out.low_value.length, out.already_fixed.length, out.proprietary.length);
