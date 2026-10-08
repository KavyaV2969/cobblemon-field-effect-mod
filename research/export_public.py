"""Stage a clean, sanitized, inspectable public source tree from the working repository (nothing is published).

    python research/export_public.py --out <dir> [--zip <file>] [--author "Name <email>"]

* Copies an explicit allowlist (never "everything minus a few things"), so a stray private file cannot slip in.
* Sanitizes every text file: user names, home-directory paths, the profile's folder name, account names and e-mail addresses become
  placeholders; JSON stays valid and is re-parsed.
* Writes FILE_INVENTORY.md (every file with its size and SHA-256) and CLEANUP_SUMMARY.md (retained, excluded, relocated).
* Initialises a brand-new Git repository in <out> with ONE commit under a neutral placeholder author (override with --author). The working
  repository, its history and its remote are never touched, and nothing is pushed.
* Scans the staged tree and the new repository history for private strings and fails if any remain.
"""
from pathlib import Path
import argparse, fnmatch, hashlib, json, os, re, shutil, subprocess, sys, zipfile

ROOT = Path(__file__).resolve().parents[1]
ALLOW_FILES = ['README.md', 'README_KANTO_LEAGUE.md', 'CHANGELOG.md', 'CONTRIBUTING.md', 'THIRD_PARTY.md', 'LICENSE-STATUS.md', 'build.gradle', 'settings.gradle', 'gradle.properties',
               'gradlew', 'gradlew.bat', 'build.ps1', '.gitignore']
ALLOW_TREES = ['gradle', 'config-overrides', 'core/src', 'compat/src', 'verification/src', 'datapack', 'docs', 'field-notes', 'scripts', 'research/custom-fields', 'research/wiki-notes', 'research/custom-artwork', 'research/schema', 'research/baseline']
#: research/ top-level tools and canonical inputs (generated or private files are left out on purpose).
RESEARCH_TOOLS = ['*.py', '*.cjs', '*.rb']
RESEARCH_TOOLS_EXCLUDE = ['debug-eval*.cjs', 'apply_gym_to_world.py', 'live_check.py', 'export_public.py']
RESEARCH_DATA = ['field-specification.json', 'compiled-field-specification.json', 'interaction-audit.json', 'semantic-reviews.json', 'ai-affinity-source.json', 'ai-disruption-source.json',
                 'ai-review-decisions.json', 'ai-coverage.json', 'calling-pools.json', 'display-names.json', 'field-id-map.json', 'biome-mapping.json', 'biome-inventory.json', 'biome-tags.json',
                 'source-hashes.json', 'source-reference-index.json', 'source-shot-moves.json', 'trainer-field-scores.json', 'vanilla-1.21.1-registry.json', 'source-comparison.json',
                 'reference-validation.json', 'audit-worklist.md']
RECEIPTS = ['simulator.json', 'java-verification.json', 'mixin-abi.json', 'graal-performance.json', 'recipe-verification.json', 'installation-matrix.json', 'pack-equivalence.json',
            'jar-differential.json', 'authoring-kit.json', 'custom-fields-unit.json', 'custom-field-traceability.json', 'datapack-validation.json', 'datapack-validation-base.json',
            'strategy-benchmark.json', 'strategy-benchmark-candidate.json', 'latency-comparison.json', 'runtime-oracle.json', 'ai-source-oracle.json', 'ai-prediction-audit.json',
            'integration-completion.json', 'global-battle-ai.json']
EXCLUDE_NAMES = ['docs/CODING_AGENT_BRIEF*', '*/__pycache__/*', '*.log', '*.pyc']

#: Strings that must not survive. Patterns are applied to every text file; the same patterns scan the result.
SANITIZE = [
    (re.compile(r'[A-Za-z]:(?:\\\\|\\|/)+Users(?:\\\\|\\|/)+[^\\/"\'\s`<>|]+', re.I), '<home>'),
    (re.compile(r'COBBLEVERSE - Pokemon Adventure \[Cobblemon\]'), '<profile>'),
    (re.compile(r'Test \(1\)'), '<profile>'),
    (re.compile(r'<home>(?:\\\\|\\|/)+AppData(?:\\\\|\\|/)+Roaming(?:\\\\|\\|/)+ModrinthApp(?:\\\\|\\|/)+profiles(?:\\\\|\\|/)+<profile>'), '<profile>'),
    (re.compile(r'[A-Za-z]:[\\/]+Ruby[0-9A-Za-z-]*[\\/]+bin[\\/]+ruby\.exe'), 'ruby'),
    (re.compile(r'KavyaV2969|kavyavkanteti|megatimate', re.I), '<owner>'),
    (re.compile(r'\bLenovo\b', re.I), '<user>'),
    (re.compile(r'[A-Za-z0-9._%+-]+@(?:gmail|outlook|hotmail|yahoo|proton|icloud)\.[a-z.]+', re.I), '<email>'),
]
TEXT_SUFFIXES = {'.md', '.txt', '.json', '.py', '.cjs', '.js', '.java', '.gradle', '.properties', '.ps1', '.rb', '.sh', '.toml', '.mcmeta', '.xml', '.yml', '.yaml', '.csv', '.gitignore', ''}
#: Binary assets are copied unchanged; nothing in them is scanned except by hash.


def is_text(path):
    return path.suffix.lower() in TEXT_SUFFIXES and path.name not in ('gradlew',) or path.name == 'gradlew'


def sanitize(text):
    for pattern, repl in SANITIZE: text = pattern.sub(repl, text)
    return text


def excluded(rel):
    return any(fnmatch.fnmatch(rel, pat) for pat in EXCLUDE_NAMES)


def collect():
    files = []
    for name in ALLOW_FILES:
        if (ROOT / name).is_file(): files.append(name)
    for tree in ALLOW_TREES:
        for p in sorted((ROOT / tree).rglob('*')):
            if p.is_file(): files.append(p.relative_to(ROOT).as_posix())
    for pattern in RESEARCH_TOOLS:
        for p in sorted((ROOT / 'research').glob(pattern)):
            if not any(fnmatch.fnmatch(p.name, ex) for ex in RESEARCH_TOOLS_EXCLUDE): files.append(p.relative_to(ROOT).as_posix())
    files += [f'research/{n}' for n in RESEARCH_DATA if (ROOT / 'research' / n).is_file()]
    files += [f'research/test-results/{n}' for n in RECEIPTS if (ROOT / 'research/test-results' / n).is_file()]
    files += [f'verification/src/{n}' for n in () ]
    seen, out = set(), []
    for f in files:
        if f not in seen and not excluded(f): seen.add(f); out.append(f)
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--out', required=True); ap.add_argument('--zip'); ap.add_argument('--author', default='Rejuvenation Fields <noreply@example.invalid>')
    args = ap.parse_args()
    out = Path(args.out).resolve()
    if out.exists(): shutil.rmtree(out, onerror=lambda f, p, e: (os.chmod(p, 0o700), f(p)))
    out.mkdir(parents=True)
    files = collect()
    sanitized = {}
    for rel in files:
        src, dst = ROOT / rel, out / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if is_text(src):
            try: text = src.read_text(encoding='utf-8', newline='')
            except UnicodeDecodeError: shutil.copyfile(src, dst); continue
            clean = sanitize(text)
            if clean != text: sanitized[rel] = sum(len(p.findall(text)) for p, _ in SANITIZE)
            if rel.endswith('.json'):
                try: json.loads(clean)
                except ValueError as error: sys.exit(f'{rel}: sanitizing broke the JSON: {error}')
            dst.write_text(clean, encoding='utf-8', newline='')
        else: shutil.copyfile(src, dst)
        if src.stat().st_mode & 0o111: dst.chmod(src.stat().st_mode)
    # The league summary keeps only what the documentation generator reads; the full team data belongs to the COBBLEVERSE RCT pack.
    teams = ROOT / 'research/kanto-league-teams.json'
    if teams.is_file():
        full = json.loads(teams.read_text(encoding='utf-8'))
        reduced = {'source': full['source'], 'trainers': {k: {'name': v['name'], 'battleFormat': v['battleFormat']} for k, v in full['trainers'].items()}, 'note': 'Summary only: the teams themselves are in the COBBLEVERSE RCT data pack (not redistributed).'}
        (out / 'research/kanto-league-teams.json').write_text(json.dumps(reduced, indent=1) + '\n', encoding='utf-8')
    # Inventory and cleanup summary.
    rows = []
    for p in sorted(out.rglob('*')):
        if p.is_file() and '.git' not in p.relative_to(out).parts: rows.append((p.relative_to(out).as_posix(), p.stat().st_size, hashlib.sha256(p.read_bytes()).hexdigest()))
    (out / 'FILE_INVENTORY.md').write_text('# File inventory\n\n' + f'{len(rows)} files. Generated by `research/export_public.py`; hashes are of the staged (sanitized) files.\n\n| Path | Bytes | SHA-256 |\n|---|---:|---|\n' +
        '\n'.join(f'| `{r[0]}` | {r[1]} | `{r[2]}` |' for r in rows) + '\n', encoding='utf-8')
    summary = ['# Cleanup and privacy summary', '', 'Method: an explicit allowlist is copied from the working repository, every text file is sanitized (home-directory paths, user, profile and account names, e-mail addresses become placeholders), JSON is re-parsed, and the staged tree and the fresh Git history are scanned for the same strings.', '',
        '## Retained (public source)', '', '- both mods (`core/`, `compat/`), the verification project, build scripts and Gradle wrapper', '- editable data-pack sources (`datapack/base`, `datapack/cobbleverse`), the authoring kit, generators, validators and canonical inputs (`research/`)', '- maintained documentation (`docs/`, README, CHANGELOG, CONTRIBUTING, THIRD_PARTY, LICENSE-STATUS), the custom-field specifications with hashes, sanitized summary receipts',
        '- the Pokémon Rejuvenation backdrops and item icons used as client assets, with attribution and provenance (see THIRD_PARTY.md for their unresolved redistribution status)', '',
        '## Excluded (private or not redistributable; kept locally, never exported)', '',
        '- the original game installation (`Rejuvenation 14 copy`), the isolated live-check game (`integration/`), the live-check and showcase harnesses and raw gameplay logs', '- Gradle caches, build output, the compile-time copy of installed jars (`build/deps`), `dist/` artifacts (release assets, not source)', '- research backups, bytecode dumps, ai worklists that quote script bodies, profile and world inventories (`mod-inventory`, `pack-inventory`, `protected-*`, `world-datapack-metadata`), `runtime-biomes.json`, generated `catalog.json`',
        '- the full Kanto team data (derived from the COBBLEVERSE RCT pack; only a name/format summary is kept)', '- working documents: coding-agent briefs, handoffs and prompts, duplicate completion reports, the profile mod inventory', '',
        '## Relocated locally', '', '- handoff and duplicate-report documents moved to `research/backups/private-docs/`; the `0.2.0` baseline artifacts, sources and receipts are in `research/backups/baseline-0.2.0-*` for rollback and comparison', '',
        '## Sanitized files', '', f'{len(sanitized)} files had private strings replaced:', ''] + [f'- `{k}` ({v} replacements)' for k, v in sorted(sanitized.items())]
    (out / 'CLEANUP_SUMMARY.md').write_text('\n'.join(summary) + '\n', encoding='utf-8')
    # Scan the staged tree.
    leaks = []
    for p in sorted(out.rglob('*')):
        if not p.is_file(): continue
        rel = p.relative_to(out).as_posix()
        if rel in ('CLEANUP_SUMMARY.md',): continue
        try: text = p.read_text(encoding='utf-8')
        except UnicodeDecodeError: continue
        for pattern, _ in SANITIZE:
            for m in pattern.finditer(text):
                if m.group(0) not in ('<home>',): leaks.append((rel, m.group(0)))
    if leaks:
        for rel, hit in leaks[:20]: print('LEAK', rel, hit)
        sys.exit(f'{len(leaks)} private strings remain in the staged tree')
    # A brand-new repository with one commit; no remote.
    env = {**os.environ, 'GIT_AUTHOR_NAME': args.author.split('<')[0].strip(), 'GIT_AUTHOR_EMAIL': args.author.split('<')[1].strip('> '), 'GIT_COMMITTER_NAME': args.author.split('<')[0].strip(), 'GIT_COMMITTER_EMAIL': args.author.split('<')[1].strip('> ')}
    run = lambda *a: subprocess.run(['git', *a], cwd=out, env=env, check=True, capture_output=True, text=True)
    run('init', '-q', '-b', 'main'); run('config', 'core.autocrlf', 'false'); run('add', '-A'); run('commit', '-q', '-m', 'Rejuvenation Fields 0.1 (sanitized source export)')
    history = run('log', '--format=%an <%ae>|%cn <%ce>|%s').stdout + run('ls-files').stdout
    for pattern, _ in SANITIZE:
        if pattern.search(history): sys.exit('private string in the new repository history: ' + pattern.pattern)
    if run('remote').stdout.strip(): sys.exit('the export must have no remote')
    if args.zip:
        target = Path(args.zip)
        if target.exists(): target.unlink()
        with zipfile.ZipFile(target, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
            for p in sorted(out.rglob('*')):
                if p.is_file() and '.git' not in p.relative_to(out).parts:
                    info = zipfile.ZipInfo(('rejuvenation-fields-source-0.1/' + p.relative_to(out).as_posix()), (2026, 10, 7, 0, 0, 0)); info.compress_type = zipfile.ZIP_DEFLATED
                    info.external_attr = (0o755 if p.name in ('gradlew',) else 0o644) << 16; z.writestr(info, p.read_bytes())
    print(f'Staged {len(rows)} files in {out}; {len(sanitized)} sanitized; history clean; zip: {args.zip or "-"}')


if __name__ == '__main__':
    main()
