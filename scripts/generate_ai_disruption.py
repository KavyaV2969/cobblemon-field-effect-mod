"""Port Battle_AI.rb getFieldDisruptScore (the source AI's field-preference score), not battle formulas.

The generated function reads a plain "view" of the matchup (types, abilities, raw stats, moves, roles, party
types, weather, field counter), so research/ai_disruption_oracle.rb can run the original Ruby method on exactly
the same inputs. Only `when` branches naming fields of the Rejuvenation catalog are generated; unknown Ruby
syntax fails the build instead of being guessed.
"""
from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'Rejuvenation 14 copy/Scripts/Battle_AI.rb'
ENGINE = ROOT / 'core/src/main/resources/rejuvenation-engine.js'
FIELDS = set(json.loads((ROOT / 'research/field-id-map.json').read_text(encoding='utf-8')))

def ident(symbol):
    return symbol.lower()

def who(name):
    return {'attacker': 'A', 'opponent': 'O', 'opponent.pbPartner': 'OP', 'attacker.pbPartner': 'AP'}[name]

def condition(text):
    t = text.strip()
    # Crests do not exist in Cobblemon; Castform-crest forms are therefore unreachable.
    t = re.sub(r'\(?(attacker|opponent)\.crested == :\w+( && \1\.form == \d+)?\)?', 'false', t)
    t = re.sub(r'(opponent\.pbPartner|attacker\.pbPartner|opponent|attacker)\.hasType\?\(:(\w+)\)', lambda m: f'type({who(m[1])},"{m[2].title()}")', t)
    t = re.sub(r'pbPartyHasType\?\(:(\w+)\)', lambda m: f'party("{m[1].title()}")', t)
    t = re.sub(r'(opponent|attacker)\.ability == :(\w+)', lambda m: f'ability({who(m[1])},"{ident(m[2])}")', t)
    t = re.sub(r'(opponent|attacker)\.ability != :(\w+)', lambda m: f'!ability({who(m[1])},"{ident(m[2])}")', t)
    t = re.sub(r'(attacker)\.pbHasMove\?\(([^)]*)\)', lambda m: f'hasMove(A,[{",".join(json.dumps(ident(s)) for s in re.findall(r":(\w+)", m[2]))}])', t)
    t = re.sub(r'checkAImoves\(\[([^\]]*)\], aimem\)', lambda m: f'hasMove(O,[{",".join(json.dumps(ident(s)) for s in re.findall(r":(\w+)", m[1]))}])', t)
    t = re.sub(r'(aroles|oroles)\.include\?\(:(\w+)\)', lambda m: f'role({"A" if m[1] == "aroles" else "O"},"{m[2]}")', t)
    t = re.sub(r'!\[:HAIL, :SNOW\]\.include\?\(@battle\.pbWeather\(nil\)\)', '!["hail","snow"].includes(V.weather)', t)
    t = re.sub(r'@battle\.pbWeather\(nil\) (==|!=) :(\w+)', lambda m: f'V.weather{"===" if m[1] == "==" else "!=="}"{ident(m[2])}"', t)
    t = t.replace('@battle.field.counter == 1', 'V.counter===1')
    t = re.sub(r'(attacker|opponent)\.(spatk|attack|spdef|defense)\b', lambda m: f'{who(m[1])}.{ {"spatk":"spa","attack":"atk","spdef":"spd","defense":"def"}[m[2]] }', t)
    t = t.replace('attacker.pbSpeed > opponent.pbSpeed', 'A.speed>O.speed')
    t = t.replace('attacker.hp.to_f / attacker.totalhp', 'A.hp/A.maxhp')
    t = t.replace('opponent.pbNonActivePokemonCount == 0', 'V.opponentReserves===0')
    t = t.replace('!opponent.effects[:Protect]', '!O.protect').replace('!opponent.effects[:SkyDrop]', '!O.skyDrop')
    t = t.replace('PBStuff::SEMIINVULMOVE.include?(opponent.effects[:TwoTurnAttack]) && pbAIfaster?(nil, nil, attacker, opponent)', 'O.semiInvulnerable && V.attackerFaster')
    t = t.replace('!attacker.isAirborne?', '!A.airborne')
    t = t.replace('attacker.isAirborne?', 'A.airborne')
    t = t.replace(' && ', ' && ').replace(' || ', ' || ')
    if re.search(r'@|::|\?\(|\bopponent\b|\battacker\b|\.to_f|\bnil\b|:[A-Z]', t):
        raise ValueError('Unconverted condition: ' + text + ' -> ' + t)
    return t

def factor(text):
    t = text.strip()
    m = re.fullmatch(r'(.+) \? ([\d.]+) : ([\d.]+)', t)
    if m:
        return f'({condition(m[1])}?{m[2]}:{m[3]})'
    if not re.fullmatch(r'[\d.]+|ratio1|ratio2|oratio1|oratio2', t):
        raise ValueError('Unconverted factor: ' + text)
    return t

def main():
    lines = SOURCE.read_text(encoding='utf-8').splitlines()
    start = next(i for i, l in enumerate(lines) if l.strip().startswith('def getFieldDisruptScore('))
    case = next(i for i in range(start, len(lines)) if lines[i].strip() == 'case fieldeffect')
    stop = next(i for i in range(case, len(lines)) if lines[i].strip() == 'fieldscore *= 0.01')
    out, records, skipping, depth, cases = [], [], False, 0, []
    joined, i = {}, case + 1
    while i < stop:
        # Ruby continues a condition onto the next line after a trailing && or ||.
        text, first = lines[i].split(' # ')[0].strip(), i
        while text.endswith(('&&', '||')):
            i += 1
            text += ' ' + lines[i].split(' # ')[0].strip()
        joined[first] = text
        i += 1
    for i in sorted(joined):
        text = joined[i]
        if text.startswith('#') or not text:
            continue
        if text.startswith('when '):
            if depth:
                raise ValueError(f'unbalanced block before line {i + 1}')
            if cases and not skipping:
                out.append('  break;')
            symbols = re.findall(r':(\w+)', text)
            if '*' in text or not symbols:
                raise ValueError('Unsupported when: ' + text)
            known = [s for s in symbols if s in FIELDS]
            skipping = not known
            if not skipping:
                out.extend(f'case "{s}":' for s in known)
                cases.extend(known)
            continue
        if skipping:
            continue
        if text == 'end' and depth == 0:
            # The `end` that closes `case fieldeffect`.
            break
        indent = '  ' * (depth + 1)
        m = re.fullmatch(r'fieldscore \*= (.+?) if (.+)', text)
        if m:
            out.append(f'{indent}if({condition(m[2])})score*={factor(m[1])}; // Battle_AI.rb:{i + 1}')
            records.append({'line': i + 1, 'factor': m[1], 'condition': m[2]})
            continue
        m = re.fullmatch(r'fieldscore \*= (.+)', text)
        if m:
            out.append(f'{indent}score*={factor(m[1])}; // Battle_AI.rb:{i + 1}')
            records.append({'line': i + 1, 'factor': m[1], 'condition': 'always'})
            continue
        m = re.fullmatch(r'(o?ratio[12]) = (attacker|opponent)\.(spatk|spdef) / attacker\.(spatk|spdef)\.to_f', text)
        if m:
            src = {'spatk': 'spa', 'spdef': 'spd'}
            out.append(f'{indent}{m[1]}={who(m[2])}.{src[m[3]]}/A.{src[m[4]]}; // Battle_AI.rb:{i + 1}')
            continue
        if text == 'unless overlay':
            out.append(f'{indent}if(!overlay){{'); depth += 1; continue
        if text == 'if violent':
            out.append(f'{indent}if(violent){{'); depth += 1; continue
        m = re.fullmatch(r'if (.+)', text)
        if m:
            cond = re.sub(r'(o?ratio[12]) ([<>]) 1', r'\1\2 1', m[1])
            cond = cond if re.fullmatch(r'o?ratio[12]\s?[<>] 1', cond) else condition(m[1])
            out.append(f'{indent}if({cond.replace(" ", "")}){{' if 'ratio' in cond else f'{indent}if({cond}){{'); depth += 1; continue
        m = re.fullmatch(r'elsif (.+)', text)
        if m:
            cond = m[1] if re.fullmatch(r'o?ratio[12] [<>] 1', m[1]) else condition(m[1])
            out.append(f'{"  " * depth}}}else if({cond}){{'); continue
        if text == 'else':
            out.append(f'{"  " * depth}}}else{{'); continue
        if text == 'end':
            depth -= 1
            out.append(f'{"  " * (depth + 1)}}}'); continue
        raise ValueError(f'Unconverted line {i + 1}: {text}')
    out.append('  break;')
    code = '\n'.join([
        '  // BEGIN GENERATED SOURCE AI DISRUPTION',
        '  // Battle_AI.rb getFieldDisruptScore: field preference of the current matchup (1 is neutral, higher favours the',
        '  // opponent). Strategic weights only; every battle mechanic still comes from the simulator.',
        '  function sourceDisruptionScore(V,original,overlay=false,violent=false){',
        '    const A=V.attacker,O=V.opponent,AP=V.attackerPartner,OP=V.opponentPartner;',
        '    const type=(p,t)=>!!p && p.types.includes(t),party=t=>V.partyTypes.includes(t);',
        '    const ability=(p,a)=>!!p && p.ability===a,hasMove=(p,moves)=>!!p && moves.some(m=>p.moves.includes(m));',
        '    const role=(p,r)=>!!p && p.roles.includes(r);',
        '    let score=100,ratio1=0,ratio2=0,oratio1=0,oratio2=0;',
        '    switch(original){',
        *['    ' + l for l in out],
        '    }',
        '    return score*0.01;',
        '  }',
        '  // END GENERATED SOURCE AI DISRUPTION',
    ])
    engine = ENGINE.read_text(encoding='utf-8')
    pattern = r'  // BEGIN GENERATED SOURCE AI DISRUPTION.*?  // END GENERATED SOURCE AI DISRUPTION'
    if re.search(pattern, engine, re.S):
        engine = re.sub(pattern, lambda _: code, engine, flags=re.S)
    else:
        engine = engine.replace('  // END GENERATED SOURCE AI AFFINITY', '  // END GENERATED SOURCE AI AFFINITY\n' + code, 1)
    ENGINE.write_text(engine, encoding='utf-8')
    (ROOT / 'research/ai-disruption-source.json').write_text(json.dumps({'source': str(SOURCE.relative_to(ROOT)), 'method': 'getFieldDisruptScore',
        'fields': sorted(set(cases)), 'rules': records}, indent=2) + '\n', encoding='utf-8')
    print(f'{len(records)} source disruption rules generated for {len(set(cases))} fields')

if __name__ == '__main__':
    main()
