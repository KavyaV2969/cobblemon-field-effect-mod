"""Compare the 0.2.0 monolithic jar with the 0.1 core + compat jars: the split must move code, not change it.

    python research/compare_jars.py --old "research/backups/baseline-0.2.0-*/artifacts/rejuvenation-fields-0.2.0.jar"

Classes are compared by their disassembly (`javap -c -p -constants`: members, instructions and constants, without line numbers), so a recompile
with different compiler flags is not mistaken for a change, while any real code difference is. Resources are compared byte for byte. Every
class and resource of the old jar must appear in exactly one new jar and be unchanged, except the entries changed on purpose (listed below with
the reason); entries that exist only in the new jars must be accounted for. Writes research/test-results/jar-differential.json.
"""
from pathlib import Path
import argparse, glob, hashlib, json, os, shutil, subprocess, sys, tempfile, zipfile

ROOT = Path(__file__).resolve().parents[1]
VERSION = next(l.split('=', 1)[1].strip() for l in (ROOT / 'gradle.properties').read_text(encoding='utf-8').splitlines() if l.startswith('version='))
RENAMES = (('dev/rejuvenation/client/BattleExtrasFieldAdapter', 'dev/rejuvenation/compat/client/BattleExtrasFieldAdapter'),
           ('dev/rejuvenation/mixin/TrainerDecisionMixin', 'dev/rejuvenation/compat/mixin/TrainerDecisionMixin'))
#: Entries whose content changes on purpose, with the reason.
INTENDED = {
    'fabric.mod.json': 'new version, no compat mixin config, no suggests',
    'rejuvenation.mixins.json': 'TrainerDecisionMixin moved to the compat jar',
    'assets/rejuvenation/field_backdrops.json': 'attribution text gains the redistribution-basis sentence; rows unchanged',
    'assets/rejuvenation/textures/gui/field/ATTRIBUTION.txt': 'attribution text gains the redistribution-basis sentence',
    'rejuvenation.compat.mixins.json': 'renamed rejuvenation-compat.mixins.json and moved to the compat jar',
    'dev/rejuvenation/RejuvenationFields.class': 'mapping/structure documents merge by (order, resource ID)',
    'dev/rejuvenation/client/ClientFieldState.class': 'evaluation listener hook replaces the direct Battle Extras call',
    'dev/rejuvenation/client/LogBounds.class': 'public provider hook; the Battle Extras reflection moved to compat',
    'dev/rejuvenation/client/LogBounds$Bounds.class': 'Bounds is now public (provider hook)',
    'dev/rejuvenation/client/FieldPanelRenderer.class': 'follows the public LogBounds.Bounds type',
    'dev/rejuvenation/client/BattleExtrasFieldAdapter.class': 'moved to compat/client; members used across packages are public (invalidateTooltipCache, effectivenessKey, certifiedEffectiveness); logic unchanged',
    **{f'assets/rejuvenation/models/item/{n}.json': 'items use the converted Rejuvenation icons' for n in ('magical_seed', 'telluric_seed', 'synthetic_seed', 'elemental_seed', 'amplifield_rock')},
}
#: Entries that exist only in the new jars, with the reason (prefixes end in '/' or are complete names).
NEW_ONLY = ('assets/rejuvenation/textures/item/', 'data/rejuvenation/recipe/', 'data/rejuvenation/tags/item/', 'assets/rejuvenation/item_icons.json', 'rejuvenation-compat.mixins.json',
            'dev/rejuvenation/RuleDocuments', 'dev/rejuvenation/client/LogBounds$Provider', 'dev/rejuvenation/compat/client/RejuvenationCompatClient', 'dev/rejuvenation/compat/client/BattleExtrasLogBounds')


def entries(jar):
    with zipfile.ZipFile(jar) as z: return {n: hashlib.sha256(z.read(n)).hexdigest() for n in z.namelist() if not n.endswith('/')}


def renamed(name):
    for old, new in RENAMES:
        if name.startswith(old): return new + name[len(old):]
    return name


def find_javap():
    candidates = [shutil.which('javap')] + glob.glob(os.path.join(os.environ.get('JAVA_HOME', '.'), 'bin', 'javap*')) + glob.glob('C:/Program Files/Java/*/bin/javap.exe')
    return next((c for c in candidates if c and Path(c).exists()), None)


def disassemble(jar, names, javap):
    out = {}
    with tempfile.TemporaryDirectory() as tmp, zipfile.ZipFile(jar) as z:
        files = []
        for n in names:
            target = Path(tmp) / n; target.parent.mkdir(parents=True, exist_ok=True); target.write_bytes(z.read(n)); files.append(target)
        for i in range(0, len(files), 25):
            chunk = files[i:i + 25]
            for f in chunk:
                text = subprocess.run([javap, '-c', '-p', '-constants', str(f)], capture_output=True, text=True, encoding='utf-8', errors='replace').stdout or ''
                out[f.relative_to(tmp).as_posix()[:-6]] = text.split('\n', 1)[1] if text.startswith('Compiled from') else text
    return out


def normalize(text):
    for old, new in RENAMES:
        text = text.replace(old, new).replace(old.replace('/', '.'), new.replace('/', '.'))
    return text


def main():
    ap = argparse.ArgumentParser(); ap.add_argument('--old', required=True)
    args = ap.parse_args()
    old_path = Path(sorted(glob.glob(args.old))[0])
    javap = find_javap()
    if not javap: sys.exit('javap not found (set JAVA_HOME to a JDK 21)')
    new_paths = {'core': ROOT / f'dist/rejuvenation-fields-{VERSION}.jar', 'compat': ROOT / f'dist/rejuvenation-fields-compat-{VERSION}.jar'}
    old, new = entries(old_path), {k: entries(v) for k, v in new_paths.items()}
    old_dis = disassemble(old_path, [n for n in old if n.endswith('.class')], javap)
    new_dis = {k: disassemble(new_paths[k], [n for n in new[k] if n.endswith('.class')], javap) for k in new_paths}
    problems, same_code, same_bytes, changed, moved = [], 0, 0, {}, 0
    claimed = set()
    for name, h in old.items():
        if name.startswith('META-INF/'): continue
        if name in INTENDED: changed[name] = INTENDED[name]; continue
        target_name = renamed(name)
        jar = 'compat' if target_name.startswith('dev/rejuvenation/compat/') else 'core'
        other = 'core' if jar == 'compat' else 'compat'
        if target_name not in new[jar]: problems.append(f'{name}: missing from the {jar} jar as {target_name}'); continue
        if target_name in new[other] and not name.startswith('META-INF/'): problems.append(f'{target_name}: present in both new jars')
        claimed.add((jar, target_name))
        if target_name != name: moved += 1
        if name.endswith('.class'):
            if normalize(old_dis[name[:-6]]) == new_dis[jar][target_name[:-6]]: same_code += 1
            else: problems.append(f'{name}: code differs in the {jar} jar and is not an intended change')
        elif new[jar][target_name] == h: same_bytes += 1
        else: problems.append(f'{name}: differs in the {jar} jar and is not an intended change')
    for jar in new:
        for name in new[jar]:
            if (jar, name) in claimed or name in INTENDED or name.startswith('META-INF/'): continue
            if name.startswith(NEW_ONLY): continue
            if any(renamed(o) == name for o in old): continue
            problems.append(f'{jar}:{name}: new entry not accounted for')
    receipt = {'oldJar': old_path.name, 'oldEntries': len(old), 'classesWithIdenticalDisassembly': same_code, 'resourcesByteIdentical': same_bytes, 'moved': moved,
               'intendedChanges': changed, 'problems': problems}
    out = ROOT / 'research/test-results/jar-differential.json'
    if out.exists(): out.unlink()
    out.write_text(json.dumps(receipt, indent=1) + '\n', encoding='utf-8')
    print(f'{len(old)} old entries: {same_code} classes with identical disassembly, {same_bytes} resources byte-identical, {moved} moved, {len(changed)} intentionally changed; {len(problems)} problems')
    for p in problems[:20]: print(' -', p)
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
