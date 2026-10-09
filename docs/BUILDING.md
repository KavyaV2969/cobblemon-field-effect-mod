# Building and testing

## Prerequisites

* **Java 21** (a JDK; set `JAVA_HOME` if `java` is not on `PATH`).
* **Gradle 8.13**, either through `gradlew`/`gradlew.bat` (downloads it once) or any 8.13 install. On Windows the wrapper script can hang in some shells; run the cached launcher directly instead: `java -cp <gradle-8.13>/lib/gradle-launcher-8.13.jar org.gradle.launcher.GradleMain …` (what `build.ps1` does).
* **Python 3.10+** (`pip install jsonschema` additionally enables the canonical-schema test; without it that one test is reported as skipped, not passed; `pip install Pillow` is needed only to regenerate the four custom backdrops), **Node 20+**.
* **A game profile** that has the exact versions the mods target in `mods/`: `Cobblemon-fabric-1.7.3+1.21.1.jar`, `fabric-api-0.116.14+1.21.1.jar`, `fabric-language-kotlin-…jar`, and, to build the compat mod, `rbrctai-fabric-*.jar`, `rctapi-fabric-*.jar` and `cobblemon-battle-extras-fabric-*.jar`; the launcher's remapped Minecraft jar (`.fabric/remappedJars/minecraft-1.21.1-0.18.4/client-intermediary.jar`) and library cache (Modrinth App: `<app data>/ModrinthApp/meta`); and the installed Pokémon Showdown in `showdown/` (Cobblemon's tests run against it). None of these is redistributed; the build copies what it compiles against into `build/deps`.
* *Optional*, only for the source-fidelity oracles: the original Pokémon Rejuvenation 14 installation (`REJUVENATION_REFERENCE`) and Ruby 3+ (`RUBY` if not on `PATH`). The item icons are also converted from it.

## Where things are found (no machine-specific paths)

| Input | How it is located |
|---|---|
| Game profile (`mods/`, `showdown/`, `.fabric/`) | `--profile` / `-Profile`, else `REJUVENATION_PROFILE`, else this repository's parent directory |
| Launcher library cache | `--meta` / `-Meta`, else `REJUVENATION_META`, else `<profile>/../../meta`, else the Modrinth App folder under your home |
| Original Rejuvenation installation | `REJUVENATION_REFERENCE` (a folder with `Graphics/` and `Scripts/`); `REJUVENATION_SCRIPTS` may point at its `Scripts` |
| Custom backdrop originals | `research/custom-artwork/originals/` (kept in the repository), or `REJUVENATION_ARTWORK_DIR` |
| Ruby / Python / Node | `RUBY`, `PYTHON`, `-Ppython=`/`-Pnode=` Gradle properties, else `PATH` |

## Layout

```
core/            Fabric mod rejuvenation_fields (engine, loader, UI, items, recipes, textures)
compat/          Fabric mod rejuvenation_fields_compat (Run & Bun / RCT / Battle Extras integrations)
verification/    tests of both mods together: Java verifiers, the Node simulator suites, the live-game fixture (never distributed)
datapack/base/ and datapack/cobbleverse/   generated pack sources (see below)
datapack/kanto-classic/ and kanto-hardcore/ the two Kanto roster packs (hand-authored; Classic is derived from Hardcore by research/classic_league.py)
research/        generators, validators, canonical inputs (custom-fields/), audits, receipts
docs/            maintained documentation; docs/spec/ holds the custom-field specifications with hashes
```

## Commands

```bash
python research/prepare_build.py --profile <profile>     # once: copy compile-time jars to build/deps
./gradlew check                                           # compile both mods and run every test gate
python research/package.py                                # dist/: two jars, four packs (base, COBBLEVERSE extension, Kanto Classic, Kanto Hardcore), manifest.json (verified: true when all gates are current)
```

or the whole pipeline (regenerate content, validate, compare, test, benchmark, document, package): `./build.ps1 -Profile <profile>` (`-AffinityMask 0xFFF` pins to performance cores for latency receipts).

Generated content (`datapack/`, item models, `lang`, notes, `docs/fields`, `docs/*` marked generated) is rewritten by `python research/generate.py` and `python research/write_docs.py`; edit the canonical inputs and generators, not the output. `python research/generate.py` needs `research/field-specification.json` (committed) and the installed Showdown registry (`research/inspect_registry.cjs`).

Gradle tasks (`verification` project): `simulatorTest`, `validateDatapack`, `customFieldUnitTest`, `authoringKitTest`, `graalTest`, `javaVerification`, `gimmickPolicyTest`, `recipeTest`, `installationMatrix`, `reviewEvidence`, `strategyBenchmark`, `sourceOracleTest` (needs the original scripts and Ruby), `integrationFixtureJar`.

## Reproducibility

Jars are built without timestamps and in stable order; the data-pack archives are written from the two pack source directories with fixed timestamps; `package.py` rebuilds the packs and fails if the bytes differ. Building from a fresh source export with the same profile yields the same hashes (checked for the release; see `release/0.1/RELEASE_NOTES.md`).

## Live-game checks

`python research/live_check.py --battle|--abilities|--extended|--integration` runs an isolated Minecraft client with the verification fixture jar (`./gradlew integrationFixtureJar`) in `integration/game`, copying a configuration and generating fresh chunks; it never touches your worlds. Those checks need a full profile with a working launcher and are not part of `check`.
