"""Preserve explicit semantic decisions; never infer review from generated rules.

Each manual entry identifies a concrete AST lead, fingerprints its source file
and body, explains the behavior, and names focused passing tests. Updating a
generator or re-running write_docs cannot close an unreviewed branch.
"""
from pathlib import Path
import json,hashlib,collections
ROOT=Path(__file__).resolve().parents[1]
def read(name):return json.loads((ROOT/'research'/name).read_text(encoding='utf-8'))
def reviewed_audit():
    audit=read('interaction-audit.json')
    path=ROOT/'research/semantic-reviews.json'
    reviews=json.loads(path.read_text(encoding='utf-8')) if path.exists() else []
    by_key={}
    passed=set(read('test-results/simulator.json').get('passedTests',[]))
    scripts=Path(read('source-location.json')['scripts'])
    failures=[]
    for r in reviews:
        key=(r['file'],r['line'])
        if key in by_key:raise ValueError('Duplicate semantic review '+str(key))
        if r['disposition'] not in ['implemented_and_tested','excluded_custom_move','excluded_crest','unsupported']:raise ValueError('Unknown review disposition '+str(key))
        if not r.get('semantics'):raise ValueError('Missing semantic decision '+str(key))
        source=scripts/r['file']
        if hashlib.sha256(source.read_bytes()).hexdigest()!=r['sourceFileSha256']:failures.append('Source changed: '+str(key))
        if r['disposition']=='implemented_and_tested':
            if not r.get('tests'):failures.append('No focused tests: '+str(key))
            for test in r['tests']:
                if test not in passed:failures.append('Test has no passing receipt: '+test)
        if r['disposition']=='unsupported' and not r.get('limitation'):failures.append('Unsupported without concrete cause: '+str(key))
        by_key[key]=r
    seen=set()
    for lead in audit:
        key=(lead['file'],lead['line']);r=by_key.get(key)
        if r:
            seen.add(key)
            if r['bodySha256']!=lead['body_sha256']:failures.append('AST body changed: '+str(key))
            lead['status']=r['disposition'];lead['semanticReview']=r
    for key in by_key.keys()-seen:failures.append('Review lead no longer in audit: '+str(key))
    if failures:raise ValueError('\n'.join(failures))
    return audit
if __name__=='__main__':
    rows=reviewed_audit();counts=collections.Counter(r['status'] for r in rows)
    result={'sourceLeadCounts':dict(counts),'manuallyReviewed':sum(v for k,v in counts.items() if k!='requires_behavioral_comparison'),
            'ordinaryPendingNotCertified':True,'completeFields':[],
            'warning':'Nested AST leads are not unique mechanics. Explicit review evidence only; no whole-field certification.'}
    (ROOT/'research/test-results/semantic-review-validation.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print('Semantic review evidence validated:',dict(counts))
