"""Preserve explicit semantic decisions; never infer review from generated rules.

Each manual entry identifies a concrete AST lead, fingerprints its source file
and body, explains the behavior, and names focused passing tests. Updating a
generator or re-running write_docs cannot close an unreviewed branch.
"""
from pathlib import Path
import json,hashlib,collections
from source_path import scripts as source_scripts
ROOT=Path(__file__).resolve().parents[1]
AI_DISPOSITIONS=['implemented_strategy','ai_mechanic_measured','ai_rollout_consequence','ai_source_weights_ported','ai_strategy_gap','ai_review_pending']
def read(name):return json.loads((ROOT/'research'/name).read_text(encoding='utf-8'))
def reviewed_audit():
    audit=read('interaction-audit.json')
    path=ROOT/'research/semantic-reviews.json'
    reviews=json.loads(path.read_text(encoding='utf-8')) if path.exists() else []
    by_key={}
    passed=set(read('test-results/simulator.json').get('passedTests',[]))
    scripts=source_scripts()
    failures=[]
    for r in reviews:
        key=(r['file'],r['line'],r['bodySha256'])
        if key in by_key:raise ValueError('Duplicate semantic review '+str(key))
        if r['disposition'] not in ['implemented_and_tested','excluded_custom_move','excluded_crest','unsupported','presentation_only','unreachable_in_build',*AI_DISPOSITIONS]:raise ValueError('Unknown review disposition '+str(key))
        # Battle_AI.rb strategy reviews are recorded by research/ai_review.py from research/ai-review-decisions.json.
        if r['disposition'] in AI_DISPOSITIONS and r['file']!='Battle_AI.rb':raise ValueError('AI strategy disposition used on a runtime mechanic '+str(key))
        if r['disposition'] in ['ai_strategy_gap','ai_review_pending'] and not r.get('limitation'):failures.append('AI gap without a stated limitation: '+str(key))
        if r['disposition'] in ['implemented_strategy','ai_mechanic_measured','ai_rollout_consequence','ai_source_weights_ported']:
            if not r.get('tests'):failures.append('No focused tests: '+str(key))
            for test in r['tests']:
                if test not in passed:failures.append('Test has no passing receipt: '+test)
        # presentation_only: the branch only draws Rejuvenation's own menus; unreachable_in_build: a constant of this build (Rejuv, Gen, Overlays) disables it.
        if r['disposition'] in ['presentation_only','unreachable_in_build'] and not r.get('limitation'):failures.append('Scope decision without a stated reason: '+str(key))
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
        key=(lead['file'],lead['line'],lead['body_sha256']);r=by_key.get(key)
        if r:
            seen.add(key)
            if r['bodySha256']!=lead['body_sha256']:failures.append('AST body changed: '+str(key))
            lead['status']=r['disposition'];lead['semanticReview']=r
    for key in by_key.keys()-seen:failures.append('Review lead no longer in audit: '+str(key))
    if failures:raise ValueError('\n'.join(failures))
    return audit
if __name__=='__main__':
    rows=reviewed_audit();counts=collections.Counter(r['status'] for r in rows)
    fields=json.loads((ROOT/'research/field-id-map.json').read_text(encoding='utf-8'))
    pending={s for r in rows if r['file']!='Battle_AI.rb' and r['status']=='requires_behavioral_comparison' for s in r['fields']}
    result={'sourceLeadCounts':dict(counts),'manuallyReviewed':sum(v for k,v in counts.items() if k!='requires_behavioral_comparison'),
            'ordinaryPending':sorted(pending),'completeFields':[s for s in fields if s not in pending],
            'completionMeaning':'Every runtime AST lead naming the field is implemented with a passing named test, or recorded as a custom-move/Crest exclusion, unreachable, unsupported with a concrete cause, or presentation-only. Battle_AI.rb strategy leads carry the per-lead review of research/ai_review.py (measured mechanics, rollout consequences, ported source weights, explicit strategy gaps, exclusions). Not an exhaustive live or multiplayer certification.',
            'warning':'Nested AST leads are not unique mechanics. Blind-spot references found by blindspot_scan.py are triaged in audit-worklist.md.'}
    (ROOT/'research/test-results/semantic-review-validation.json').write_text(json.dumps(result,indent=2)+'\n',encoding='utf-8')
    print('Semantic review evidence validated:',dict(counts))
