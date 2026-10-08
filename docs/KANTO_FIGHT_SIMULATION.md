# Kanto league fight simulation (offline)

`node research/simulate_kanto_fights.cjs --seeds 3 --parallel` plays complete battles for all 13 Kanto league fights (eight Gym Leaders, the Elite Four and Champion Blue) and writes `research/test-results/kanto-fights-simulation.json`. It is the full-battle companion to `research/verify_kanto_gyms.cjs`, which checks each Pokémon and plays one turn.

## What is simulated

- The real trainer files from `datapack/cobbleverse/data/rctmod/trainers/` on the field assigned in `trainers/kanto.json`, in the trainer's own format (Giovanni in doubles), in the installed Pokémon Showdown simulator with the Rejuvenation field engine attached.
- The trainer side is driven by the field engine's consequence scoring (`RejuvenationEngine.strategy`) with the same decision rule as `compat/RunBunStrategy.java`: score minus resource cost, Mega mandatory on the first legal move, Tera only for the member the trainer file declares, Dynamax/Gmax never. Z-Moves and Ultra Burst are offered when the held crystal allows them.
- Challengers are three generic teams at the trainer's level cap (balanced, offense, stall), three seeds each, so the same battle can be replayed.
- Extra fights lead with each Mega/Z/Ultra/Tera holder, so those policies are reached in every roster even when ordinary fights end before the holder appears.

## What a failure means

A fight fails if it crashes, does not finish within 250 turns, starts on the wrong field, makes an illegal trainer choice, uses more than one Mega or Tera, uses Tera on an undeclared member, uses Dynamax, fails to Mega Evolve a Mega holder that leads, or if the engine returns an error for any scored candidate. Run it after any engine, roster or field change.

## Result (2026-10-09)

173 fights, 104 s, 0 problems, run against the fixed engine. All finished, no crashes, no illegal trainer choices, no policy violations: every Mega holder that led evolved exactly once, Tera was only ever used by the declared member, and Dynamax never occurred. The first run, before the Dive fix, found one engine defect (finding 1).

| Trainer | Format | Fights | Finished | Trainer won | Median turns | Fights with Mega | Fights with Tera | Fights with Z/Ultra | Decision ms (median / max) |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Brock | singles | 11 | 11 | 0 | 22 | 0 | 1 | 0 | 120 / 340 |
| Misty | singles | 13 | 13 | 13 | 20 | 8 | 1 | 0 | 80 / 262 |
| Lt. Surge | singles | 13 | 13 | 13 | 20 | 3 | 2 | 0 | 110 / 314 |
| Erika | singles | 13 | 13 | 13 | 27 | 2 | 0 | 0 | 97 / 327 |
| Sabrina | singles | 13 | 13 | 13 | 17 | 2 | 1 | 0 | 81 / 242 |
| Koga | singles | 13 | 13 | 13 | 36 | 6 | 5 | 0 | 71 / 263 |
| Blaine | singles | 13 | 13 | 12 | 16 | 9 | 1 | 0 | 73 / 289 |
| Giovanni | doubles | 15 | 15 | 13 | 8 | 7 | 2 | 6 | 165 / 461 |
| Lorelei | singles | 13 | 13 | 13 | 14 | 2 | 2 | 0 | 89 / 304 |
| Bruno | singles | 13 | 13 | 13 | 10 | 2 | 2 | 0 | 79 / 210 |
| Agatha | singles | 13 | 13 | 13 | 12 | 2 | 1 | 0 | 66 / 234 |
| Lance | singles | 15 | 15 | 15 | 17 | 7 | 0 | 8 | 102 / 284 |
| Blue | singles | 15 | 15 | 15 | 14 | 6 | 0 | 2 | 85 / 342 |

Decision times were measured in Node on a laptop, not in the game's Graal runtime, and are not a performance claim.

## Findings

1. **Engine defect, found and fixed: field-changing moves could not be scored against some foes.** Misty's Gyarados `Dive` (Water Surface to Underwater) failed with `TypeError: Cannot read properties of null (reading 'atk')` in `sourceDisruptionScore` against foes such as Blissey, Hippowdon and Magikarp. Cause: `Battle_AI.rb:1908` values a field change from the *decision-time* matchup, and the engine's comment says the view is taken once per opponent before any rollout, but it was built lazily, after the rollout. When the rolled-out foe had already fainted its view had no opponent. The fix (`rejuvenation-engine.js`, in `strategy`) builds the view of every current opponent before the rollouts. Scores that already worked are unchanged (Dive vs Garchomp, Slowbro, Corviknight, Skarmory and Ferrothorn are identical before and after). Regression test: "a field-changing move is scored against foes that faint during the rollout" in `strategy-regression.cjs`; it fails on the old engine. `node research/repro_dive_scoring_error.cjs` now prints a score for every foe. Before the fix, 8 of Misty's fights logged these errors and her median fight lasted 54 turns; after it she has no errors, uses Dive in 8 fights (all ending Underwater) and her median fight lasts 20 turns.
2. **Brock is the only trainer who never won** (0 of 11; he knocked out 1.6 of 6 challengers on average). His team is unevolved (Geodude-Alola, Archen, Lileep, Tirtouga) and the challengers are fully evolved level-16 Pokémon, so this says more about the stand-in teams than about a bug, but it is the weakest roster by a wide margin.
3. **Brock has no Mega Evolution.** Sableye holds Roseli Berry, so the roster does not satisfy "every Gym Leader has one Mega Evolution". Every other Gym Leader, Lorelei, Bruno, Agatha, Lance and Blue hold a Mega Stone.
4. Tera and Z-Moves are used selectively. The decision rule charges 8 points plus 4 per extra surviving party member, so they are only chosen when the gain is large; Mega, which is mandatory, always fires.

## Not covered

- Run & Bun's own move-family scores and item use (Full Restore bags, `maxItemUses`) live in the Java mods and Cobblemon, not in the simulator. They are checked statically (the trainer files keep their original bag and rules) but not played.
- Forced switches use a simple best-move heuristic rather than Run & Bun's switch logic.
- The challenger side is the same scorer, not a human.
- Nothing here has been played in live Minecraft.
