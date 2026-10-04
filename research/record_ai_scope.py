"""Record the user's explicit no-AI-adapter scope without certifying mechanics.

This is a scope decision for the prediction/scoring code, not evidence that the
matching battle mechanics are implemented. Runtime leads keep their own status.
"""
from pathlib import Path
import json,hashlib
from source_path import scripts
ROOT=Path(__file__).resolve().parents[1]
path=ROOT/'research/semantic-reviews.json'
reviews=json.loads(path.read_text(encoding='utf-8'))
unique={}
for row in reviews:
 key=(row['file'],row['line'],row['bodySha256'])
 if key in unique and row['file']!='Battle_AI.rb':raise ValueError('Duplicate runtime review '+str(key))
 unique[key]=row
reviews=list(unique.values())
audit=json.loads((ROOT/'research/interaction-audit.json').read_text(encoding='utf-8'))
existing={(r['file'],r['line'],r['bodySha256']) for r in reviews}
sha=hashlib.sha256((scripts()/'Battle_AI.rb').read_bytes()).hexdigest()
count=0
for lead in audit:
 if lead['file']!='Battle_AI.rb' or (lead['file'],lead['line'],lead['body_sha256']) in existing:continue
 reviews.append({'file':lead['file'],'line':lead['line'],'endLine':lead['end_line'],
  'bodySha256':lead['body_sha256'],'sourceFileSha256':sha,'disposition':'excluded_ai_adapter',
  'semantics':'AI prediction/scoring branch for '+lead['condition']+'. The continuation explicitly requests no Run & Bun AI adapter. This branch is deferred by scope; it provides no implementation or verification credit for battle mechanics.',
  'tests':[],'exclusions':['AI adapter explicitly deferred by the continuation attachment'],
  'reviewScope':'AI adapter scope only; independent runtime mechanics remain subject to source comparison.'})
 count+=1
path.write_text(json.dumps(reviews,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print('Explicitly deferred AI-adapter leads:',count)
