# Verification results and scope

The latest build targets the actual installed Minecraft 1.21.1, Fabric Loader 0.18.4 and Cobblemon 1.7.3 ABI. Gradle's `build` and `integrationFixtureJar` tasks passed. `research/test-results/build.log` records the result; `dist/manifest.json` fingerprints the built artifacts and the exact live-tested jar.

| Verification | Result | Boundary |
|---|---|---|
| Closed datapack schema, references and transitions | Passed: 57 fields, 1,327 additional rule rows, 1,647 core move entries, 517 transitions | Reports 27 absent moves and five absent abilities; no absent held items |
| Compiled source definition comparison | Passed: 3,963 properties, zero differences across 57 fields | Does not certify distributed Ruby handlers |
| Executed local Ruby method oracle | 171,396 defense contexts and 120 difficulty/Frenzy contexts match | Loads the original `Battle_Field.rb`; tests two methods with bounded type/ability/weather inputs, not complete fields |
| Installed simulator regression suite | 153 checks passed | Representative singles/doubles, complete turns, simultaneous state and cleanup; not every source branch |
| Cobblemon shaded Graal | All 57 fields attach/destroy; 17 battle-runtime assertions passed | Includes Growth, room/weather timing, Stance Change, forbidden-type flavor, Mimicry, Glitch Rest and Haunted Destiny Bond |
| Java verification | Passed | Parser, malformed data, duplicate keys, priorities, opt-in boundary, pending options, late packets, held-item packing and capture snapshots/rounding |
| Actual Fabric/Cobblemon integration | Five battles passed | Natural/explicit fields, ordered entry chat, Growth, Everstone, Seed, Dive/Dusk capture events, cleanup |
| Runtime biome registry | 70 entries, 70 explicitly mapped, zero fallback | Optional disabled Terralith content has 95 additional candidate entries |
| Full behavioral source certification | Pending: zero fields certified complete | All 57 remain partially implemented/verified |
| Two-client multiplayer/disconnect verification | Not executed | Simulator doubles/concurrency and single-client integrated-server checks do not replace this |

The five live battles use a separate fixture mod, guarded to `rejuvenation/integration/game`, and generated fresh test chunks. The original world's region files are not copied or changed. Capture checks invoke the actual Cobblemon catch-rate event during active battles and verify floored 3.5x bonuses without stacking native bonuses; they do not assert a random capture succeeds. The anonymous test player does not use account credentials. The runner terminates only its owned process after verification; its termination exit code is not a crash assertion.

Run `rejuvenation/build.ps1` to regenerate, validate, compare, compile and run the simulator/Java/Graal checks. Build the additional `integrationFixtureJar` Gradle task and run `python rejuvenation/research/live_check.py --battle` for the isolated Minecraft check. Read `README.md` for installation and the dependency cache requirements.

The explicit Gradle `sourceOracleTest` task requires Ruby and the local reference path in `research/source-location.json`. `build.ps1` also invokes it. The oracle executes original method bodies without packaging them. Its battler/battle stubs supply the methods' type, ability, airborne and weather inputs; dependency semantics outside those methods remain separately reviewable. It found and corrected Mega Sol's attacker-relative weather behavior in the icy defense and Deux Finalis defense predicates. Source-only Crests, Shadow/Stellar types, boss immunities and compound ability suppression are outside this bounded comparison. Defense checks exercise the same condition/action interpreter used by live stat events; difficulty checks execute real Showdown power events with native fixed-point rounding. `runtime-oracle.json` fingerprints the exact original file and records the scope.

The profile has no Git repository, so `git status` cannot produce a diff. `research/audit_protected.py` compares 1,254 original files against initial hashes instead. It reports one preserved Iris settings difference, no additions/deletions, and unchanged hashes for the other 1,253 protected files. Authored work remains under `rejuvenation/`; trainer, Gym, League and progression definitions were intentionally left untouched.
