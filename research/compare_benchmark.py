"""Compare two strategy-benchmark receipts (baseline vs candidate) and record the bounded latency comparison.

    python research/compare_benchmark.py [--baseline research/baseline/strategy-benchmark.json] [--candidate research/test-results/strategy-benchmark-candidate.json]

Both receipts come from the same fixtures and runtime (StrategyBenchmark in the shaded Graal interpreter). The comparison is only meaningful
when both were taken pinned to the same cores (processorAffinity); that is reported. A candidate warm median more than 15% over the baseline
is flagged for investigation. Writes research/test-results/latency-comparison.json.
"""
from pathlib import Path
import argparse, json

ROOT = Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser()
ap.add_argument('--baseline', default=str(ROOT / 'research/baseline/strategy-benchmark.json'))
ap.add_argument('--candidate', default=str(ROOT / 'research/test-results/strategy-benchmark-candidate.json'))
args = ap.parse_args()
b, c = (json.loads(Path(p).read_text(encoding='utf-8')) for p in (args.baseline, args.candidate))
key = lambda r: ('doubles' if r.get('doubles') else str(r['teamSize'])) + (f"-turn{r['turn']}" if r.get('turn') else '')
base = {key(r): r for r in b['strategy']}
rows, flagged = [], []
for r in c['strategy']:
    k = key(r); o = base[k]
    change = r['warmMedianMillis'] / o['warmMedianMillis'] - 1
    rows.append({'fixture': k, 'baselineWarmMedianMillis': o['warmMedianMillis'], 'candidateWarmMedianMillis': r['warmMedianMillis'], 'warmChangePercent': round(change * 100, 1),
                 'baselineColdMillis': o['coldMillis'], 'candidateColdMillis': r['coldMillis']})
    if change > 0.15: flagged.append(k)
out = {'baselineAffinity': b.get('processorAffinity'), 'candidateAffinity': c.get('processorAffinity'), 'publicationWarmupMillis': {'baseline': b.get('publicationWarmupMillis'), 'candidate': c.get('publicationWarmupMillis')},
       'sameAffinity': b.get('processorAffinity') == c.get('processorAffinity'), 'fixtures': rows, 'flaggedOver15Percent': flagged}
target = ROOT / 'research/test-results/latency-comparison.json'
if target.exists(): target.unlink()
target.write_text(json.dumps(out, indent=1) + '\n', encoding='utf-8')
for r in rows: print(f"{r['fixture']:10} warm {r['baselineWarmMedianMillis']:>6} -> {r['candidateWarmMedianMillis']:>6} ms ({r['warmChangePercent']:+.1f}%)  cold {r['baselineColdMillis']} -> {r['candidateColdMillis']}")
print('affinity', out['baselineAffinity'], '->', out['candidateAffinity'], '| flagged:', flagged or 'none')
