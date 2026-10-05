"""Port the source switch-affinity table, not battle formulas. Fail on unknown Ruby syntax."""
from pathlib import Path
import re
import json

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Rejuvenation 14 copy/Scripts/Battle_AI.rb'
ENGINE = ROOT / 'mod/src/main/resources/rejuvenation-engine.js'

def condition(text):
    text = text.replace('Rejuv', 'true')
    text = re.sub(r'i\.hasType\?\(:(\w+)\)', lambda m: f'p.hasType("{m[1].title()}")', text)
    text = re.sub(r'(i|nonmegaform)\.ability == :(\w+)', lambda m: f'{"ability" if m[1] == "i" else "baseAbility"}("{m[2].lower().replace("persihbody", "perishbody")}")', text)
    text = re.sub(r'i\.crested == :\w+', 'false', text)
    text = re.sub(r'\[([^]]+)\]\.include\?\(i.ability\)', lambda m: f'[{symbols(m[1])}].some(ability)', text)
    text = text.replace('[i.ability, nonmegaform.ability].intersect?([:SNOWWARNING, :HAILWARNING])', '["snowwarning","hailwarning"].some(a=>ability(a)||baseAbility(a))')
    text = text.replace('[:PRESSURE, *PBStuff::UnnerveAbilities].intersect?([i.ability, nonmegaform.ability])', '["pressure","unnerve","asonechilling","asonegrim"].some(a=>ability(a)||baseAbility(a))')
    text = text.replace('PBStuff::LevitateAbilities.include?(i.ability)', '["levitate","eelevate","solaridol","lunaridol","gravitycontrol"].some(ability)')
    text = text.replace('PBStuff::LevitateAbilities.intersect?([i.ability, nonmegaform.ability])', '["levitate","eelevate","solaridol","lunaridol","gravitycontrol"].some(a=>ability(a)||baseAbility(a))')
    text = text.replace('PBTypes.typesEff(:WATER, i.types, inverse: @battle.inverse?).superEffective?', 'b.dex.getEffectiveness("Water",p)>0')
    text = text.replace('@battle.doublebattle', 'b.gameType!=="singles"')
    text = text.replace('@battle.pbWeather(nil) == :STRONGWINDS', 'b.field.isWeather("deltastream")')
    text = text.replace('@battle.weather == :RAINDANCE', 'b.field.isWeather("raindance")')
    text = text.replace('@battle.weather == :HAIL', 'b.field.isWeather(["hail","snow"])')
    text = re.sub(r'@battle.ProgressiveFieldCheck\(PBFields::CONCERT, (\d), (\d)\)', lambda m: f'(stage>={m[1]} && stage<={m[2]})', text)
    if any(token in text for token in ('@', ':', 'i.', 'nonmegaform', 'PBStuff', 'PBTypes', '?')):
        raise ValueError('Unconverted condition: '+text)
    return text

def symbols(text):
    return ','.join(json.dumps(s.lower()) for s in re.findall(r':(\w+)', text))

def main():
    lines = SOURCE.read_text(encoding='utf-8').splitlines()
    start = next(i for i,line in enumerate(lines) if line.strip()=='fieldscore = 0')
    stop = next(i for i in range(start,len(lines)) if lines[i].strip()=='monscore += fieldscore')
    rows = []
    current = None
    parent = None
    records = []
    for i in range(start,stop):
        text = lines[i].strip()
        if text.startswith('when '):
            current = text[5:]
            parent = None
            if current.startswith('*PBFields::'):
                name = current.split('::')[1]
                rows.extend(f'case "{name}{stage}":' for stage in range(1,6 if name=='FLOWERGARDEN' else 5))
            else:
                rows.append(f'case {json.dumps(current[1:])}:')
        elif text.startswith('if i.ability'):
            parent = condition(text[3:])
        elif text=='end' and parent:
            parent = None
        elif current and text.startswith('fieldscore '):
            match = re.fullmatch(r'fieldscore ([+-])= (\d+) if (.+)',text)
            if not match: raise ValueError(text)
            expr = condition(match[3])
            if parent: expr = f'{parent} && ({expr})'
            rows.append(f'  if({expr})score{match[1]}={match[2]}; // Battle_AI.rb:{i+1}')
            records.append({'line':i+1,'field':current,'weight':int(match[2])*(1 if match[1]=='+' else -1),'condition':match[3]})
        # End each case explicitly; Ruby does not fall through.
        if current and i+1<stop and lines[i+1].strip().startswith('when '): rows.append('  break;')
    rows.append('  break;')
    code = '\n'.join([
        '  // BEGIN GENERATED SOURCE AI AFFINITY',
        '  // Rejuvenation switch strategy weights; mechanics continue to come exclusively from the simulator.',
        '  function sourceAffinity(b,p,field=current(b)){',
        '    const original=field?.originalId || "INDOOR",stage=Number(original.match(/\\d+$/)?.[0] || 0);',
        '    const effective=p.hasAbility(p.ability)?p.ability:"",unsuppressed=!!effective;',
        '    const ability=a=>effective===a,baseAbility=a=>unsuppressed && p.baseAbility===a;let score=0;',
        '    switch(original){',*['    '+line for line in rows],
        '    }return score/100;',
        '  }',
        '  // END GENERATED SOURCE AI AFFINITY',
    ])
    engine = ENGINE.read_text(encoding='utf-8')
    pattern = r'  // BEGIN GENERATED SOURCE AI AFFINITY.*?  // END GENERATED SOURCE AI AFFINITY'
    if re.search(pattern,engine,re.S): engine = re.sub(pattern,lambda _:code,engine,flags=re.S)
    else: engine = engine.replace('  function strategy(b,request){',code+'\n  function strategy(b,request){')
    ENGINE.write_text(engine,encoding='utf-8')
    (ROOT/'research/ai-affinity-source.json').write_text(json.dumps({'source':str(SOURCE.relative_to(ROOT)),'rules':records},indent=2)+'\n',encoding='utf-8')
    print(f'{len(records)} source affinity rules generated')

if __name__=='__main__': main()
