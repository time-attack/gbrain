import a from '../data/analysis.json';
import s from '../data/snapshot.json';

const snap = new Map(s.items.map((i) => [i.id, i]));

const dups = a.items
  .filter((x) => x.disposition === 'duplicate' && (x.confidence ?? 0) >= 0.85)
  .sort((x, y) => x.number - y.number);

console.log('=== DUPLICATES conf>=0.85 ===', dups.length);
for (const x of dups) {
  const t = snap.get(x.id)?.title || x.title;
  const url = snap.get(x.id)?.url;
  const canon = x.canonical ? `${x.canonical.kind} #${x.canonical.number}` : '?';
  const isCanon =
    x.canonical && x.canonical.kind === x.kind && x.canonical.number === x.number;
  console.log(
    JSON.stringify({
      id: x.id,
      close: !isCanon,
      keep: canon,
      conf: x.confidence,
      url,
      title: t,
      why: x.explanation,
    }),
  );
}

const fixed = a.items
  .filter((x) => x.disposition === 'already_fixed')
  .sort((x, y) => y.number - x.number);

console.log('\n=== ALREADY_FIXED ===', fixed.length);
for (const x of fixed) {
  console.log(
    JSON.stringify({
      id: x.id,
      conf: x.confidence,
      url: snap.get(x.id)?.url,
      title: snap.get(x.id)?.title || x.title,
      why: x.explanation,
    }),
  );
}
