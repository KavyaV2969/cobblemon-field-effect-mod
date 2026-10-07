# Battle-start performance

## Symptom

Starting a wild battle sometimes took 10–15 seconds before the battle began.

## Evidence

The profile's own game logs show the server thread stalling exactly when the field engine first touched the simulator in a session:

```text
2026-10-05 00:34:55 [Server thread] Simulator field reference diagnostics: {"moves":[...]}
2026-10-05 00:34:56 [Server thread] Can't keep up! Is the server overloaded? Running 17889ms or 357 ticks behind
2026-10-05 06:43:17 [Server thread] Simulator field reference diagnostics: {"moves":[...]}
2026-10-05 06:43:17 [Server thread] Can't keep up! Is the server overloaded? Running 31956ms or 639 ticks behind
```

Later battles in the same session started without such stalls, which matches "sometimes": the first wild battle after each world load (and after each `/reload`).

## Measurement

`GraalShowdownService.startBattle` runs on the server thread. Its HEAD hook published the field catalog (5.1 MB of JSON: 57 fields, 2,997 rules) into Cobblemon's Graal simulator whenever the catalog revision had changed, i.e. on the first battle after a load. On this profile's Zulu JRE, Graal runs interpreter-only. Timed in Cobblemon's shaded Graal runtime (`EvalProbe`/`Probe` harnesses, then `GraalVerification`):

| Step of `RejuvenationEngine.load` (first call) | Before | After |
|---|---:|---:|
| `JSON.parse` | 435 ms | 589 ms |
| `validate` | 2,014 ms | 2,205 ms |
| `installDeclaredFieldAssets` | **17,762 ms** | 7 ms |
| `installDeclaredAbilities` (incl. sound aliases) | 46 ms* | 58 ms |
| `freeze` | 605 ms | 622 ms |
| reference diagnostics | 1,139 ms | on demand (DEBUG) |
| **total, first publication** | **22,151 ms** | **3,752 ms** (probe); 7.9–9.0 s in the colder test JVM |
| total, later publication | 2,467 ms | 925–1,228 ms |
| Showdown dex mods loaded by publication | 39 | 3 |

\* Once the asset step was fixed, `installDeclaredAbilities` became the next bottleneck (22,178 ms): its sound-alias step called `dex.conditions.get` on every dex, which loads it.

**Cause.** `installDeclaredFieldAssets` iterated `RegistryDex.dexes` and read `dex.data` on every registered Showdown mod (gen1…gen9, `ssb`, `gennext` and ~30 more) to add the Shadow type and Shadow Sky weather; reading `data` forces a full load of that mod's dex. Cobblemon battles use three of them. The sound-alias installer did the same through `conditions.get`. All of it happened synchronously on the server thread at the first battle start, so the battle (and the whole server) waited.

Checked and ruled out as causes: biome lookup (269 rows, microseconds), JSON or datapack reading per battle (none — reload only), registry enumeration per battle (none — `RuntimeInventory` enumerates biomes once at server start), resource or file access per battle (none), trainer/held-item bridges (map lookups), network waits (none in the path), per-battle field attach (≈25–70 ms warm in interpreted Graal, ≈0.3–0.5 s for the first battle of a JVM).

## Fixes

1. **Lazy dex patching.** Declared types/weathers and sound aliases are applied only to dexes already loaded, and to any other dex when it loads, through a guarded `loadData` wrapper. This also keeps the Shadow type present when Cobblemon replaces its dex objects after species initialisation.
2. **No diagnostics on the load path.** Reference diagnostics are computed by `RejuvenationEngine.references()` only when DEBUG logging is on (offline validation already reports them).
3. **Publication off the battle path.** `SimulatorCatalog` publishes the catalog on the server thread at `SERVER_STARTED` and after every successful datapack reload (`END_DATA_PACK_RELOAD`, forced, because Cobblemon's reload resets the simulator's ability registry). Battle start only compares revisions; publishing there is a logged fallback.
4. **Indexed environment.** Biome/underwater/structure rules are compiled once per datapack revision; structures are indexed once per server and revision (see [FIELD_SELECTION.md](FIELD_SELECTION.md)).

## Instrumentation and regression guards

- `BattleStartTimings` logs every field battle start at DEBUG with the environment-capture and simulator-hook times, the chosen field and its source; it logs at **WARN** when field work exceeds `-Drejuvenation.slowStartMillis` (default 50 ms) or when the catalog had to be published at battle start.
- `SimulatorCatalog` logs each publication with its duration (`Published field catalog revision N to the simulator in X ms (server start)`).
- `FieldEvaluator` logs evaluation calls (DEBUG; WARN above `-Drejuvenation.slowEvaluationMillis`, default 1000 ms) and keeps per-purpose totals.
- `GraalVerification` fails the build if catalog publication loads more than three simulator dex mods, and writes `research/test-results/graal-performance.json`.
- The live integration run (`live_check.py --integration`) asserts that no battle start published the catalog and that field work per battle start stays below 0.5 s, and records each start's timings in `research/test-results/live-mode-integration.json`.

## Cost moved elsewhere

Publication now happens while the world loads (once) and after `/reload`. The successful 2026-10-05 integration run recorded **864 ms at server start** and **13.4242 ms worst field work at battle start** across seven battles, with no catalog publication at any battle start. Run & Bun evaluated 60 queries in 1,867 ms; move previews evaluated 40 queries in 1,196 ms (totals, including cache reuse). The final standalone shaded-Graal build benchmark recorded 3,560 ms cold and 388 ms warm publication, with only three dexes loaded, and 102 ms for four evaluation queries. These are different workloads and JVM warm-up states, not interchangeable end-to-end battle timings. See `research/test-results/live-mode-integration.json`, `graal-performance.json` and [INTEGRATIONS.md](INTEGRATIONS.md).

## Current strategic decision benchmark

The `strategyBenchmark` receipt measures complete strategy decisions, including opponent utility forecasts and a production-shaped worst-case doubles lead. Historical startup measurements above are separate workloads. Cold: first decision after the publication warm-up, as in production; publication warm-up 1482 ms. The receipt was taken with processor affinity `0xFFF` (performance cores of this hybrid CPU) at high priority.

| Decision | Candidates / screened | Rollouts | Cold ms | Warm median ms | Warm max ms |
|---|---:|---:|---:|---:|---:|
| 1 fresh | 8 / 2 | 8 | 635 | 389 | 440 |
| 6 fresh | 13 / 5 | 10 | 619 | 546 | 686 |
| 6 turn 1 | 13 / 5 | 10 | 591 | 495 | 826 |
| 6 turn 2 | 13 / 5 | 10 | 665 | 602 | 651 |
| 6 turn 3 | 13 / 5 | 10 | 546 | 608 | 617 |
| 6v6 doubles fresh | 24 / 16 | 17 | 2085 | 2110 | 2216 |

5 warm repetitions; real Cobblemon shaded Graal, interpreter only. Receipt: `research/test-results/strategy-benchmark.json`. Engine SHA-256: `3baedc5f731a23f2d49f0c5f9e52e1cbc111de9646218c9fc376b72ff1dda9ad`.
