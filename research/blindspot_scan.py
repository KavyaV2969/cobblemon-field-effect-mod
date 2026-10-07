"""List field-symbol references the AST audit cannot see.

`when` clauses inside `case true` blocks are not emitted as interaction-audit
leads. This scan reports every `:FIELD` reference in the local scripts (except
Battle_AI.rb) that falls outside all audit lead ranges, semantic review ranges
and rule/test `File.rb:line` citations. A citation covers its enclosing method
or class. Output is a review list, never evidence of review; dispositions are
recorded in audit-worklist.md.

Usage: python research/blindspot_scan.py [lines-per-file] [File.rb ...]
"""
import json,re,glob,os,collections,sys
sys.path.insert(0,'research')
from source_path import scripts
S=str(scripts()); N=int(sys.argv[1]) if len(sys.argv)>1 else 6; ONLY=set(sys.argv[2:])
syms=set(json.load(open('research/field-id-map.json',encoding='utf-8')))
cov=collections.defaultdict(list)
for a in json.load(open('research/interaction-audit.json',encoding='utf-8')): cov[a['file'].lower()].append((a['line'],a['end_line']))
for a in json.load(open('research/semantic-reviews.json',encoding='utf-8')): cov[a['file'].lower()].append((a['line'],a.get('endLine',a['line'])))
cite=re.compile(r'([A-Za-z_]+\.rb):(\d+)(?:-(\d+))?')
cited=collections.defaultdict(list)
for p in glob.glob('datapack/**/*.json',recursive=True)+glob.glob('research/*.py')+glob.glob('core/src/**/*.*',recursive=True)+glob.glob('compat/src/**/*.*',recursive=True):
    try: txt=open(p,encoding='utf-8').read()
    except Exception: continue
    for m in cite.finditer(txt):
        a=int(m[2]); cited[m[1].lower()].append((a,int(m[3] or a)))
def blocks(lines):
    st=[];out=[]
    for i,l in enumerate(lines,1):
        m=re.match(r'^(\s*)def\b',l)
        if m: st.append((len(m[1]),i)); continue
        m=re.match(r'^(\s*)end\b',l)
        if m and st and len(m[1])==st[-1][0]: out.append((st.pop()[1],i))
    return out
pat=re.compile(r':('+'|'.join(sorted(syms,key=len,reverse=True))+r')\b')
out=collections.defaultdict(list)
for p in sorted(glob.glob(os.path.join(glob.escape(S),'*.rb'))):
    fn=os.path.basename(p)
    if fn=='Battle_AI.rb' or (ONLY and fn not in ONLY): continue
    lines=open(p,encoding='utf-8',errors='replace').read().split('\n')
    c=cov[fn.lower()]+cited[fn.lower()]
    # a citation anywhere inside a method covers that whole method
    c+=[(a,b) for a,b in blocks(lines) if b-a<600 and any(a-12<=x<=b for x,_ in cited[fn.lower()])]
    for i,line in enumerate(lines,1):
        code=line.split('#')[0]
        if pat.search(code) and not any(a<=i<=b for a,b in c): out[fn].append((i,line.strip()[:140]))
for fn,v in sorted(out.items(),key=lambda x:-len(x[1])):
    print(f'== {fn} ({len(v)})')
    for i,l in v[:N]: print(f'  {i}: {l}')
print('TOTAL',sum(map(len,out.values())))
