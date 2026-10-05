"""Append explicit semantic review decisions for audited source leads.

Usage from another script: from add_review import review; review(file,line,...).
Fingerprints come from the current audit and local source, so a decision can
only be recorded against an existing AST lead. Receipts are checked later by
review_registry.py; this helper never marks anything reviewed by inference.
"""
from pathlib import Path
import json,hashlib
from source_path import scripts as source_scripts
ROOT=Path(__file__).resolve().parents[1]
PATH=ROOT/'research/semantic-reviews.json'
SCOPE='Named branch and enclosing guards only; no whole-field certification.'
def review(file,line,disposition,semantics,tests=(),exclusions=(),limitation=None,replace=False,body_sha256=None):
    audit=json.loads((ROOT/'research/interaction-audit.json').read_text(encoding='utf-8'))
    lead=next((l for l in audit if l['file']==file and l['line']==line and (body_sha256 is None or l['body_sha256']==body_sha256)),None)
    if lead is None:raise ValueError(f'No audit lead at {file}:{line}')
    reviews=json.loads(PATH.read_text(encoding='utf-8'))
    existing=next((r for r in reviews if r['file']==file and r['line']==line and r['bodySha256']==lead['body_sha256']),None)
    if existing and not replace:raise ValueError(f'Already reviewed: {file}:{line}')
    row={'file':file,'line':line,'endLine':lead['end_line'],'bodySha256':lead['body_sha256'],
         'sourceFileSha256':hashlib.sha256((source_scripts()/file).read_bytes()).hexdigest(),
         'disposition':disposition,'semantics':semantics,'tests':list(tests),'exclusions':list(exclusions),'reviewScope':SCOPE}
    if limitation:row['limitation']=limitation
    if existing:reviews[reviews.index(existing)]=row
    else:reviews.append(row)
    PATH.write_text(json.dumps(reviews,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
    return row
