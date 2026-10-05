"""Record the semantic review of every Battle_AI.rb field lead for the Run & Bun strategy integration.

Decisions are authored by hand in research/ai-review-decisions.json: each group names its leads (explicit line
numbers or inclusive ranges, optionally restricted to an enclosing method), states what the source branch does,
how the strategy covers it (or why it cannot), the disposition and the focused tests. This script never infers a
review: a lead matched by no decision stays `ai_review_pending`, a lead matched twice is an error, and every cited
test must have a passing receipt. Mechanical evidence is attached automatically:
  * research/test-results/ai-prediction-audit.json - prediction-versus-mechanic rows keyed by source line;
  * research/test-results/ai-source-oracle.json   - Ruby oracle comparison of the generated ports.
Outputs: the Battle_AI.rb rows of research/semantic-reviews.json and research/ai-coverage.json.
"""
from pathlib import Path
import bisect, collections, hashlib, json, re
from source_path import scripts

ROOT = Path(__file__).resolve().parents[1]
DISPOSITIONS = {
    'implemented_strategy': 'Source strategic intent implemented by bounded consequence, party-context or opponent-policy scoring with named decision tests.',
    'ai_mechanic_measured': 'Predicts a battle mechanic; the strategy uses the simulator/field engine outcome instead.',
    'ai_rollout_consequence': 'Scores a field-dependent consequence; the rollout produces it and a named term values it.',
    'ai_source_weights_ported': 'Source strategy weights generated from the source and verified by the Ruby oracle.',
    'ai_strategy_gap': 'Strategic intent not represented by the strategy; the limitation is stated.',
    'unreachable_in_build': 'Disabled by a constant of this build or unreachable for the named move/field.',
    'excluded_custom_move': 'Names a move or ability absent from the installed Cobblemon registry.',
    'excluded_crest': 'Crest-only branch; Crests do not exist in Cobblemon.',
    'ai_review_pending': 'Not yet semantically reviewed.',
}
NEEDS_TESTS = {'implemented_strategy', 'ai_mechanic_measured', 'ai_rollout_consequence', 'ai_source_weights_ported'}
NEEDS_LIMITATION = {'ai_strategy_gap', 'unreachable_in_build', 'excluded_custom_move', 'excluded_crest', 'ai_review_pending'}

def read(name):
    return json.loads((ROOT / 'research' / name).read_text(encoding='utf-8'))

def expand(spec):
    out = set()
    for item in spec:
        if isinstance(item, int):
            out.add(item)
        else:
            a, b = item.split('-')
            out.update(range(int(a), int(b) + 1))
    return out

def main():
    source_file = scripts() / 'Battle_AI.rb'
    source = source_file.read_text(encoding='utf-8', errors='replace').split('\n')
    sha = hashlib.sha256(source_file.read_bytes()).hexdigest()
    defs = [(i + 1, m.group(1)) for i, l in enumerate(source) for m in [re.match(r'\s*def\s+([A-Za-z0-9_?!]+)', l)] if m]
    starts = [d[0] for d in defs]
    method_of = lambda line: defs[bisect.bisect_right(starts, line) - 1][1]
    audit = [a for a in read('interaction-audit.json') if a['file'] == 'Battle_AI.rb']
    leads, seen = [], set()
    for a in audit:
        key = (a['line'], a['body_sha256'])
        if key in seen:
            continue
        seen.add(key)
        leads.append(a)
    decisions = read('ai-review-decisions.json')['decisions']
    passed = set(read('test-results/simulator.json').get('passedTests', []))
    receipt = read('test-results/ai-prediction-audit.json')['rows']
    by_line = collections.defaultdict(list)
    for row in receipt:
        by_line[row['line']].append(row)
    oracle = read('test-results/ai-source-oracle.json')
    failures = []
    for d in decisions:
        if d['disposition'] not in DISPOSITIONS:
            failures.append(f"{d['id']}: unknown disposition {d['disposition']}")
        if d['disposition'] in NEEDS_TESTS and not d.get('tests'):
            failures.append(f"{d['id']}: no focused tests")
        if d['disposition'] in NEEDS_LIMITATION and not d.get('limitation'):
            failures.append(f"{d['id']}: no stated limitation/reason")
        for test in d.get('tests', []):
            if test not in passed:
                failures.append(f"{d['id']}: test has no passing receipt: {test}")
        d['_lines'] = expand(d.get('lines', []))
    rows, matched = [], collections.Counter()
    for lead in leads:
        method = method_of(lead['line'])
        hits = [d for d in decisions if lead['line'] in d['_lines'] and (not d.get('method') or d['method'] == method)]
        if len(hits) > 1:
            failures.append(f"lead {lead['line']} matched by {[d['id'] for d in hits]}")
        d = hits[0] if hits else None
        evidence = {}
        audit_rows = by_line.get(lead['line'], [])
        if audit_rows:
            statuses = collections.Counter(r['status'] for r in audit_rows)
            evidence['predictionAudit'] = dict(statuses)
            if statuses.get('differs'):
                failures.append(f"lead {lead['line']}: prediction audit differs")
        if d and d.get('oracle'):
            evidence['rubyOracle'] = {k: oracle[k] for k in ('disruptionCases', 'affinityCases', 'differences')}
            if oracle['differences']:
                failures.append(f"lead {lead['line']}: Ruby oracle differences")
        if d and d.get('requiresAudit') and not audit_rows:
            failures.append(f"lead {lead['line']}: decision {d['id']} requires prediction-audit rows")
        disposition = d['disposition'] if d else 'ai_review_pending'
        matched[d['id'] if d else None] += 1
        row = {'file': 'Battle_AI.rb', 'line': lead['line'], 'endLine': lead['end_line'], 'bodySha256': lead['body_sha256'],
               'sourceFileSha256': sha, 'disposition': disposition, 'method': method, 'decision': d['id'] if d else None,
               'semantics': d['semantics'] if d else 'Not yet semantically reviewed for the strategy integration: ' + lead['condition'],
               'tests': d.get('tests', []) if d else [], 'exclusions': d.get('exclusions', []) if d else [],
               'reviewScope': 'Battle_AI.rb strategy branch: the named lead and its enclosing guards.'}
        if d and d.get('limitation'):
            row['limitation'] = d['limitation']
        if not d:
            row['limitation'] = 'Pending semantic review.'
        if evidence:
            row['evidence'] = evidence
        rows.append(row)
    for d in decisions:
        if not matched[d['id']]:
            failures.append(f"decision {d['id']} matches no lead")
    if failures:
        raise SystemExit('AI review failed:\n' + '\n'.join(failures))
    reviews = [r for r in read('semantic-reviews.json') if r['file'] != 'Battle_AI.rb'] + rows
    (ROOT / 'research/semantic-reviews.json').write_text(json.dumps(reviews, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    counts = collections.Counter(r['disposition'] for r in rows)
    if counts['ai_strategy_gap'] or counts['ai_review_pending']:
        raise SystemExit('Ordinary AI strategy is incomplete: '+str(dict(counts)))
    by_method = collections.Counter((r['method'], r['disposition']) for r in rows)
    report = {'source': 'Battle_AI.rb', 'sourceFileSha256': sha, 'leads': len(rows), 'dispositions': dict(counts),
              'meaning': DISPOSITIONS, 'classification': 'per-lead semantic review from research/ai-review-decisions.json',
              'decisions': [{'id': d['id'], 'disposition': d['disposition'], 'leads': matched[d['id']]} for d in decisions],
              'methods': [{'method': m, 'disposition': c, 'leads': n} for (m, c), n in sorted(by_method.items())],
              'predictionAudit': dict(collections.Counter(f"{r['kind']}:{r['status']}" for r in receipt)),
              'rubyOracle': oracle,
              'leadsByLine': [{k: r[k] for k in ('line', 'endLine', 'method', 'disposition', 'decision')} for r in rows]}
    (ROOT / 'research/ai-coverage.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print('AI leads:', len(rows), dict(counts))

if __name__ == '__main__':
    main()
