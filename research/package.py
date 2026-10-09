"""Package and verify the six runtime artifacts of a release, with reproducible archives and a hash manifest.

    python research/package.py          (after `gradlew build` produced dist/rejuvenation-fields[-compat]-<version>.jar)

Artifacts (version from gradle.properties):
  dist/rejuvenation-fields-<v>.jar               core mod        (built by Gradle :core:jar)
  dist/rejuvenation-fields-compat-<v>.jar        compat mod      (built by Gradle :compat:jar)
  dist/rejuvenation-fields-base-<v>.zip          portable field data pack   (datapack/base)
  dist/rejuvenation-fields-cobbleverse-<v>.zip   COBBLEVERSE extension pack (datapack/cobbleverse): mappings, Kanto field assignments, Lt. Surge gym
  dist/rejuvenation-fields-cobbleverse-classic-<v>.zip    Kanto league rosters, Classic (datapack/kanto-classic); the recommended variant
  dist/rejuvenation-fields-cobbleverse-hardcore-<v>.zip   Kanto league rosters, Hardcore (datapack/kanto-hardcore); the original override
  The two roster packs define the same 13 trainer files, so they are mutually exclusive: a world uses exactly one of them.
  dist/manifest.json                             SHA-256 hashes, versions, dependencies and the receipts this build is certified by

Every check below runs against the packaged files, not the development classes. The archives are written from an explicit allowlist (the two
pack source directories), with fixed timestamps and sorted entries, so building twice yields identical bytes.
"""
from pathlib import Path
import hashlib, json, re, sys, zipfile

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'; DIST.mkdir(exist_ok=True)
VERSION = next(l.split('=', 1)[1].strip() for l in (ROOT / 'gradle.properties').read_text(encoding='utf-8').splitlines() if l.startswith('version='))
CORE, COMPAT = DIST / f'rejuvenation-fields-{VERSION}.jar', DIST / f'rejuvenation-fields-compat-{VERSION}.jar'
BASE_ZIP, EXT_ZIP = DIST / f'rejuvenation-fields-base-{VERSION}.zip', DIST / f'rejuvenation-fields-cobbleverse-{VERSION}.zip'
CLASSIC_ZIP, HARDCORE_ZIP = DIST / f'rejuvenation-fields-cobbleverse-classic-{VERSION}.zip', DIST / f'rejuvenation-fields-cobbleverse-hardcore-{VERSION}.zip'
LEAGUE = ['brock', 'misty', 'ltsurge', 'erika', 'sabrina', 'koga', 'blaine', 'giovanni', 'league_lorelei', 'league_bruno', 'league_agatha', 'league_lance', 'champion_blue']
LEAGUE_RE = r'data/rctmod/trainers/kanto_(' + '|'.join(LEAGUE) + r')\.json'
SAME_IN_BOTH = {'brock', 'misty'}   # the only rosters Classic leaves untouched
STAMP = (2026, 10, 7, 0, 0, 0)
failures = []


def check(ok, message):
    if not ok: failures.append(message)


def digest(p): return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def read(p): return json.loads(Path(p).read_text(encoding='utf-8'))


def write_zip(target, source):
    """Deterministic archive of every file under `source`, with `pack.mcmeta` and `data/` at the archive root."""
    if target.exists(): target.unlink()
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for p in sorted(source.rglob('*')):
            if not p.is_file(): continue
            info = zipfile.ZipInfo(p.relative_to(source).as_posix(), STAMP)
            info.compress_type = zipfile.ZIP_DEFLATED; info.external_attr = 0o644 << 16
            z.writestr(info, p.read_bytes())


CLIENT_ONLY = [rb'net/minecraft/class_310(?![0-9])', rb'net/minecraft/class_332(?![0-9])', rb'com/cobblemon/mod/common/client/', rb'net/fabricmc/fabric/api/client/', rb'dev/rejuvenation/client/', rb'dev/rejuvenation/compat/client/']
THIRD_PARTY = [rb'com/gitlab/surilexa/rbrctai', rb'com/gitlab/srcmc/rctapi', rb'name/modid/']


def jar_checks(path, core):
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        check(len(names) == len(set(names)), f'{path.name}: duplicate entries')
        check(not any(n.endswith('.jar') for n in names), f'{path.name}: a dependency jar is bundled')
        classes = [n for n in names if n.endswith('.class')]
        check(all(n.startswith('dev/rejuvenation/') for n in classes), f'{path.name}: classes outside dev/rejuvenation')
        check(not any(n.startswith(('com/cobblemon/', 'net/minecraft/', 'org/spongepowered/', 'net/fabricmc/')) for n in names), f'{path.name}: third-party classes bundled')
        check(not any(re.search(r'(\.log|\.json\.bak|\.nbt|world|saves|backup|credential|secret|token)', n, re.I) and not n.startswith('assets/rejuvenation/textures') for n in names if not n.endswith('.class') and 'lang/' not in n), f'{path.name}: unexpected resource names')
        meta = json.loads(z.read('fabric.mod.json'))
        check(meta['version'] == VERSION, f'{path.name}: fabric.mod.json version {meta["version"]} != {VERSION}')
        for n in classes:
            data = z.read(n)
            in_client_package = n.startswith(('dev/rejuvenation/client/', 'dev/rejuvenation/compat/client/', 'dev/rejuvenation/compat/mixin/BattleExtras'))
            if not in_client_package:
                leaked = [c.decode() for c in CLIENT_ONLY if re.search(c, data)]
                check(not leaked, f'{path.name}: {n} references client-only classes {leaked} (dedicated-server safety)')
        if core:
            check(meta['id'] == 'rejuvenation_fields' and meta['entrypoints']['client'] == ['dev.rejuvenation.client.RejuvenationFieldsClient'], 'core metadata')
            check(not any(n.startswith('dev/rejuvenation/compat/') for n in classes), 'core jar contains compat classes')
            for n in classes:
                data = z.read(n)
                check(not any(re.search(c, data) for c in THIRD_PARTY), f'core class {n} references a third-party integration class')
            for need in ['rejuvenation-engine.js', 'rejuvenation-types.json', 'rejuvenation.mixins.json', 'dev/rejuvenation/RejuvenationFields.class', 'dev/rejuvenation/mixin/ShowdownMixin.class',
                         'assets/rejuvenation/textures/gui/field/ATTRIBUTION.txt', 'assets/rejuvenation/field_backdrops.json', 'assets/rejuvenation/item_icons.json', 'assets/rejuvenation/textures/item/ATTRIBUTION.txt',
                         'assets/rejuvenation/lang/en_us.json', 'dev/rejuvenation/FieldNotes.class', 'dev/rejuvenation/client/FieldNotesOverlay.class']:
                check(need in names, f'core jar is missing {need}')
            check(z.read('rejuvenation-engine.js') == (ROOT / 'core/src/main/resources/rejuvenation-engine.js').read_bytes(), 'core jar has a stale engine')
            check(len([n for n in names if n.startswith('assets/rejuvenation/textures/gui/field/') and n.endswith('.png')]) == 61, 'core jar must hold 61 field backdrops')
            for item in ['magical_seed', 'telluric_seed', 'synthetic_seed', 'elemental_seed', 'amplifield_rock']:
                check(f'assets/rejuvenation/textures/item/{item}.png' in names and f'data/rejuvenation/recipe/{item}.json' in names and f'assets/rejuvenation/models/item/{item}.json' in names, f'core jar item resources for {item}')
            check(f'assets/rejuvenation/textures/item/amulet_coin.png' not in names, 'Amulet Coin keeps its vanilla visual')
            check({'terrain_seed_centers', 'field_rock_centers'} <= {Path(n).stem for n in names if n.startswith('data/rejuvenation/tags/item/')}, 'core jar item tags')
            mixins = json.loads(z.read('rejuvenation.mixins.json'))
            check('TrainerDecisionMixin' not in mixins['mixins'] and mixins['package'] == 'dev.rejuvenation.mixin', 'core mixin config')
        else:
            check(meta['id'] == 'rejuvenation_fields_compat' and meta['depends']['rejuvenation_fields'] == f'>={VERSION} <0.2', 'compat metadata / core dependency range')
            check(all(n.startswith('dev/rejuvenation/compat/') for n in classes), 'compat jar classes outside the compat package')
            check('rejuvenation-engine.js' not in names and not any(n.startswith(('assets/', 'data/')) for n in names), 'compat jar must not carry the engine, assets or data')
            mixins = json.loads(z.read('rejuvenation-compat.mixins.json'))
            check(mixins['plugin'] == 'dev.rejuvenation.compat.CompatMixinPlugin' and all(m.startswith('BattleExtras') for m in mixins['client']) and not any(m.startswith('BattleExtras') for m in mixins['mixins']), 'compat mixin sections')
            check(set(meta['suggests']) == {'rbrctai', 'rctapi', 'cobblemon-battle-extras'}, 'compat suggests exactly the three integrations')
    return meta


def pack_checks(path, source, expect):
    with zipfile.ZipFile(path) as z:
        names = z.namelist()
        check('pack.mcmeta' in names and any(n.startswith('data/') for n in names), f'{path.name}: pack.mcmeta and data/ must be at the archive root')
        check(not any(n.startswith(('assets/', f'{path.stem}/', 'datapack/')) or n.endswith('.png') for n in names), f'{path.name}: graphics or a nested project directory in a data pack')
        check(len(names) == len(set(names)), f'{path.name}: duplicate entries')
        mc = json.loads(z.read('pack.mcmeta'))
        check(mc['pack']['pack_format'] == 48, f'{path.name}: pack_format must be 48 for Minecraft 1.21.1')
        check(VERSION in mc['pack']['description'], f'{path.name}: description names the version')
        for n in names:
            if n == 'pack.mcmeta': continue
            check(read_zip(z, n) == (source / n).read_bytes(), f'{path.name}: {n} differs from its source')
        for pattern, count in expect.items():
            got = len([n for n in names if re.fullmatch(pattern, n)])
            check(got == count, f'{path.name}: expected {count} files matching {pattern}, found {got}')
    return names


def read_zip(z, n): return z.read(n)


ALL_ZIPS = (BASE_ZIP, EXT_ZIP, CLASSIC_ZIP, HARDCORE_ZIP)


def write_all():
    for target, source in ((BASE_ZIP, 'datapack/base'), (EXT_ZIP, 'datapack/cobbleverse'), (CLASSIC_ZIP, 'datapack/kanto-classic'), (HARDCORE_ZIP, 'datapack/kanto-hardcore')):
        write_zip(target, ROOT / source)


def league_checks(classic_names, hardcore_names, other_names):
    """The two roster packs must be interchangeable but never combinable: same file set, no overlap with any other pack, clearly labelled."""
    check(set(classic_names) == set(hardcore_names), 'Classic and Hardcore must define exactly the same files, so installing both is a visible conflict and installing one never leaves a stray file of the other')
    check(not ((set(classic_names) | set(hardcore_names)) & set(other_names) - {'pack.mcmeta'}), 'a roster pack shares a resource path with the base or the extension')
    with zipfile.ZipFile(CLASSIC_ZIP) as c, zipfile.ZipFile(HARDCORE_ZIP) as h:
        for label, z, other in (('Classic', c, 'Hardcore'), ('Hardcore', h, 'Classic')):
            desc = json.loads(z.read('pack.mcmeta'))['pack']['description']
            check(label in desc and 'only one' in desc.lower() and other in desc, f'{label} pack description must name the variant and say to install only one roster pack')
            check(label.lower() in z.read('README.md').decode('utf-8').splitlines()[0].lower(), f'{label} pack README is not the {label} roster document')
        differing = sorted(Path(n).stem.removeprefix('kanto_') for n in c.namelist() if n.startswith('data/rctmod/trainers/') and c.read(n) != h.read(n))
        same = sorted(Path(n).stem.removeprefix('kanto_') for n in c.namelist() if n.startswith('data/rctmod/trainers/') and c.read(n) == h.read(n))
        check(set(same) == SAME_IN_BOTH and len(differing) == len(LEAGUE) - len(SAME_IN_BOTH), f'only Brock and Misty may be identical in both variants (identical: {same})')
        baseline = read(ROOT / 'research/baseline/kanto-hardcore-sha256.json')['files']
        for n in h.namelist():
            if n.startswith('data/rctmod/trainers/'):
                check(hashlib.sha256(h.read(n).replace(b'\r\n', b'\n')).hexdigest() == baseline[Path(n).name], f'Hardcore {n} differs from the pre-split roster override')
    # Overlay the packs the way Global Packs does (zips in file-name order, a later pack overrides an earlier one) and see which pack each trainer file comes from.
    packs = {'base': BASE_ZIP, 'extension': EXT_ZIP, 'classic': CLASSIC_ZIP, 'hardcore': HARDCORE_ZIP}

    def overlay(chosen):
        view = {}
        for pack in sorted(chosen, key=lambda k: packs[k].name.lower()):
            with zipfile.ZipFile(packs[pack]) as z:
                for n in z.namelist():
                    if n.startswith('data/') and not n.endswith('/'): view[n] = (pack, hashlib.sha256(z.read(n)).hexdigest())
        return {n: v for n, v in view.items() if n.startswith('data/rctmod/')}, view

    with zipfile.ZipFile(CLASSIC_ZIP) as c2, zipfile.ZipFile(HARDCORE_ZIP) as h2:
        own = {'classic': {n: hashlib.sha256(c2.read(n)).hexdigest() for n in c2.namelist() if n.startswith('data/rctmod/')},
               'hardcore': {n: hashlib.sha256(h2.read(n)).hexdigest() for n in h2.namelist() if n.startswith('data/rctmod/')}}
    scenarios = {}
    for name, chosen in (('base+extension+classic', ['base', 'extension', 'classic']), ('base+extension+hardcore', ['base', 'extension', 'hardcore']), ('base+extension+classic+hardcore (not supported)', ['base', 'extension', 'classic', 'hardcore']),
                         ('base+extension (no roster)', ['base', 'extension'])):
        rosters, view = overlay(chosen)
        winners = sorted({v[0] for v in rosters.values()})
        scenarios[name] = {'trainerFiles': len(rosters), 'wonBy': winners, 'nonTrainerFilesFromRosterPacks': sorted(n for n, v in view.items() if v[0] in ('classic', 'hardcore') and not n.startswith('data/rctmod/'))}
        if len(chosen) <= 3 and 'classic' in chosen: check(winners == ['classic'] and {n: v[1] for n, v in rosters.items()} == own['classic'], 'with the extension and Classic installed, every Kanto trainer file is Classic\'s')
        if len(chosen) <= 3 and 'hardcore' in chosen: check(winners == ['hardcore'] and {n: v[1] for n, v in rosters.items()} == own['hardcore'], 'with the extension and Hardcore installed, every Kanto trainer file is Hardcore\'s')
        if name.endswith('no roster)'): check(not rosters, 'without a roster pack no pack supplies a Kanto trainer file (the stock COBBLEVERSE teams apply)')
        check(not scenarios[name]['nonTrainerFilesFromRosterPacks'], f'{name}: a roster pack supplies a data file other than a trainer file')
    result = {'differingTrainers': differing, 'identicalTrainers': same, 'scenarios': scenarios,
              'bothInstalled': 'every trainer file resolves silently to hardcore (the later file name); nothing detects it, so the pack descriptions and the READMEs tell users to install only one'}
    (ROOT / 'research/test-results/league-package-isolation.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    return result


def main():
    for p in (CORE, COMPAT):
        if not p.is_file(): sys.exit(f'Missing {p.name}: run Gradle :core:jar :compat:jar first')
    core_meta = jar_checks(CORE, True); compat_meta = jar_checks(COMPAT, False)
    write_all()
    base_names = pack_checks(BASE_ZIP, ROOT / 'datapack/base', {r'data/rejuvenation/rejuvenation/fields/[a-z0-9_]+\.json': 61, r'data/rejuvenation/rejuvenation/notes/[a-z0-9_]+\.json': 61,
                             r'data/rejuvenation/rejuvenation/items/.*\.json': 1, r'data/rejuvenation/rejuvenation/abilities/.*\.json': 1})
    ext_names = pack_checks(EXT_ZIP, ROOT / 'datapack/cobbleverse', {r'data/rejuvenation/rejuvenation/trainers/.*\.json': 1, r'data/cobbleverse/structure/ltsurge\.nbt': 1,
                             r'data/rejuvenation/rejuvenation/mappings/.*\.json': 2, r'data/rejuvenation/rejuvenation/structures/.*\.json': 4})
    check(not any('/fields/' in n for n in ext_names), 'the extension must not redefine fields (shared definitions live in the base only)')
    check(not (set(base_names) & set(ext_names) - {'pack.mcmeta'}), 'the two packs share a resource path (duplicate definition)')
    check(not any(n.startswith('data/rctmod/') for n in base_names + ext_names), 'rosters live only in the Classic and Hardcore packs, never in the base or the extension')
    classic_names = pack_checks(CLASSIC_ZIP, ROOT / 'datapack/kanto-classic', {LEAGUE_RE: 13})
    hardcore_names = pack_checks(HARDCORE_ZIP, ROOT / 'datapack/kanto-hardcore', {LEAGUE_RE: 13})
    league = league_checks(classic_names, hardcore_names, base_names + ext_names)
    # Reproducibility: rebuilding yields the same bytes.
    before = {p: digest(p) for p in ALL_ZIPS}
    write_all()
    check(all(digest(p) == before[p] for p in before), 'data pack archives are not reproducible')
    # The byte-exact gym assets: the Surge structure and the Surge team of the baseline are unchanged. Classic deliberately changes Surge's Iron Hands
    # item, so the baseline Surge team is checked against Hardcore (whose files are all checked against the pre-split baseline in league_checks).
    baseline = ROOT / 'research/baseline/gym-sha256.json'
    if baseline.exists():
        for rel, h in read(baseline).items():
            for gym in ((ROOT / 'datapack/kanto-hardcore',) if rel.startswith('data/rctmod/') else (ROOT / 'datapack/cobbleverse',)):
                check(digest(gym / rel) == h, f'gym asset {rel} in {gym.name} changed from the 0.2.0 baseline')

    receipts_dir = ROOT / 'research/test-results'
    def receipt(name): p = receipts_dir / name; return read(p) if p.exists() else None
    kanto = {}
    for variant in ('classic', 'hardcore'):
        gyms, fights = receipt(f'kanto-gyms-simulator-{variant}.json'), receipt(f'kanto-fights-simulation-{variant}.json')
        roster = ROOT / 'datapack' / f'kanto-{variant}'
        current = {p.relative_to(roster).as_posix(): digest(p) for p in sorted(roster.rglob('*')) if p.is_file()}
        trainers = {k: v for k, v in current.items() if k.startswith('data/rctmod/trainers/')}
        kanto[variant] = {'validation': bool(gyms) and gyms['variant'] == variant and not gyms['failures'] and gyms['sourceHashes'] == current,
                          'fights': bool(fights) and fights.get('variant') == variant and not fights['problems'] and fights['fightCount'] >= 170 and fights.get('rosterSha256') == {Path(k).name: v for k, v in trainers.items()}}
    simulator, java, graal, recipes, matrix, pack_eq, unit, kit = (receipt(n) for n in ['simulator.json', 'java-verification.json', 'graal-performance.json', 'recipe-verification.json', 'installation-matrix.json', 'pack-equivalence.json', 'custom-fields-unit.json', 'authoring-kit.json'])
    engine_sha = digest(ROOT / 'core/src/main/resources/rejuvenation-engine.js')
    evidence = {
        'simulator': bool(simulator) and simulator['engineSha256'] == engine_sha and not simulator['failed'] and simulator['passed'] + len(simulator.get('skippedTests', [])) >= 656,
        'java': bool(java) and java['engineSha256'] == engine_sha, 'graal': bool(graal) and graal['engineSha256'] == engine_sha and graal['runtimeAssertions'] == 110,
        'recipes': bool(recipes) and recipes['positiveCombinations'] == 20, 'installationMatrix': bool(matrix) and matrix['version'] == VERSION,
        'packEquivalence': bool(pack_eq) and not pack_eq['differences'], 'customFieldUnit': bool(unit) and not unit['failed'], 'authoringKit': bool(kit) and not kit['failed'],
        'kantoClassicValidation': kanto['classic']['validation'], 'kantoClassicFights': kanto['classic']['fights'],
        'kantoHardcoreValidation': kanto['hardcore']['validation'], 'kantoHardcoreFights': kanto['hardcore']['fights']}
    manifest = {'version': VERSION, 'releaseStatus': 'first-public-release-candidate', 'minecraft': '1.21.1', 'loader': 'Fabric Loader >=0.17.2 (built against 0.18.4)', 'fabricApi': '>=0.116.6 (built against 0.116.14+1.21.1)',
        'cobblemon': '1.7.3+1.21.1', 'java': '>=21',
        'artifacts': [{'path': p.name, 'bytes': p.stat().st_size, 'sha256': digest(p)} for p in (CORE, COMPAT, BASE_ZIP, EXT_ZIP, CLASSIC_ZIP, HARDCORE_ZIP)],
        'leagueVariants': {'recommended': 'classic', 'mutuallyExclusive': True, 'classic': CLASSIC_ZIP.name, 'hardcore': HARDCORE_ZIP.name, 'shared': EXT_ZIP.name, 'isolationReceipt': 'research/test-results/league-package-isolation.json'},
        'mods': {'rejuvenation_fields': {'version': core_meta['version'], 'role': 'core'}, 'rejuvenation_fields_compat': {'version': compat_meta['version'], 'requires': compat_meta['depends']['rejuvenation_fields']}},
        'fields': {'original': 57, 'custom': 4, 'total': 61}, 'engineSha256': engine_sha,
        'verification': {name: ok for name, ok in evidence.items()}, 'verificationSkipped': (simulator or {}).get('skippedTests', []), 'verified': all(evidence.values()) and not failures,
        'optionalIntegrations': {'rbrctai': 'Run & Bun AI scoring (compat)', 'rctapi': 'RCT trainer gimmick declarations (compat)', 'cobblemon-battle-extras': 'exact move previews and tooltips (compat, client)'}}
    out = DIST / 'manifest.json'
    if out.exists(): out.unlink()
    out.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
    for a in manifest['artifacts']: print(f"{a['sha256']}  {a['path']}")
    if failures:
        print('\nPACKAGE CHECKS FAILED:'); print('\n'.join(' - ' + f for f in failures)); sys.exit(1)
    missing = [k for k, v in evidence.items() if not v]
    print(f'Packaged {VERSION}; verification evidence: ' + ('complete' if not missing else 'MISSING/STALE: ' + ', '.join(missing)))
    if missing: sys.exit(2)


if __name__ == '__main__':
    main()
