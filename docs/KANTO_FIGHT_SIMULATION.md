# Kanto league fight simulation (offline)

`node research/simulate_kanto_fights.cjs --variant classic --seeds 3 --parallel` (and `--variant hardcore`) plays complete battles for all 13 Kanto league fights (eight Gym Leaders, the Elite Four and Champion Blue) of one roster variant and writes `research/test-results/kanto-fights-simulation-<variant>.json`. It is the full-battle companion to `node research/verify_kanto_gyms.cjs --variant <variant>`, which checks each Pokémon and plays one turn. The two variants are always simulated separately.

## What is simulated

- The real trainer files of the chosen roster pack (`datapack/kanto-classic/data/rctmod/trainers/` or `datapack/kanto-hardcore/data/rctmod/trainers/`) on the field assigned in the shared extension's `trainers/kanto.json`, in the trainer's own format (Giovanni in doubles), in the installed Pokémon Showdown simulator with the Rejuvenation field engine attached.
- The trainer side is driven by the field engine's consequence scoring (`RejuvenationEngine.strategy`) with the same decision rule as `compat/RunBunStrategy.java`: score minus resource cost, Mega mandatory on the first legal move, Tera only for the member the trainer file declares (in whatever form it is in), Dynamax/Gmax never. Z-Moves and Ultra Burst are offered when the held crystal allows them.
- Challengers are three generic teams at the trainer's level cap (balanced, offense, stall), three seeds each, so the same battle can be replayed.
- Extra fights lead with each Mega/Z/Ultra/Tera holder, so those policies are reached in every roster even when ordinary fights end before the holder appears.
- The receipt records the SHA-256 of every trainer file that was played; `research/package.py` refuses to certify a package whose roster files differ from them.

## What a failure means

A fight fails if it crashes, does not finish within 250 turns, starts on the wrong field, makes an illegal trainer choice, uses more than one Mega or Tera, uses Tera on an undeclared member, uses Dynamax, fails to Mega Evolve a Mega holder that leads, or if the engine returns an error for any scored candidate. Run it after any engine, roster or field change.

## Results (2026-10-09)

Both variants were run against the current engine (`0c0207c7f908…`): **Classic** 173 fights in 124 s and **Hardcore** 173 fights in 127 s, each with 0 problems: every fight finished, no crash, no illegal trainer choice, no policy violation. Every Mega holder that led evolved exactly once, Tera was only ever used by the declared member, and Dynamax never occurred. The roster-file checks passed too: Classic 1209 checks, Hardcore 1208 checks (`kanto-gyms-simulator-<variant>.json`).

### Classic

| Trainer | Format | Fights | Finished | Trainer won | Median turns | Fights with Mega | Fights with Tera (who) | Fights with Z/Ultra | Decision ms (median / max) |
|---|---|---:|---:|---:|---:|---:|---|---:|---:|
| Brock | singles | 11 | 11 | 0 | 22 | 0 | 1 (sableye) | 0 | 152 / 403 |
| Misty | singles | 13 | 13 | 13 | 20 | 8 | 1 (floatzel) | 0 | 99 / 325 |
| Lt. Surge | singles | 13 | 13 | 12 | 20 | 5 | 2 (magnezone) | 0 | 137 / 407 |
| Erika | singles | 13 | 13 | 13 | 29 | 4 | 0 | 0 | 120 / 397 |
| Sabrina | singles | 13 | 13 | 13 | 17 | 2 | 1 (espathra) | 0 | 101 / 262 |
| Koga | singles | 13 | 13 | 13 | 42 | 11 | 5 (sneasler) | 0 | 71 / 328 |
| Blaine | singles | 13 | 13 | 12 | 16 | 7 | 2 (typhlosionhisui) | 0 | 94 / 313 |
| Giovanni | doubles | 15 | 15 | 13 | 8 | 10 | 3 (toxtricitylowkey) | 2 | 194 / 723 |
| Lorelei | singles | 13 | 13 | 13 | 13 | 4 | 8 (arctovish) | 0 | 134 / 401 |
| Bruno | singles | 13 | 13 | 13 | 10 | 2 | 2 (terrakion) | 0 | 105 / 373 |
| Agatha | singles | 13 | 13 | 13 | 12 | 2 | 1 (ceruledge) | 0 | 83 / 287 |
| Lance | singles | 15 | 15 | 15 | 17 | 7 | 0 | 6 | 130 / 411 |
| Blue | singles | 15 | 15 | 15 | 12 | 5 | 1 (ursalunabloodmoon) | 1 | 107 / 352 |

### Hardcore

| Trainer | Format | Fights | Finished | Trainer won | Median turns | Fights with Mega | Fights with Tera (who) | Fights with Z/Ultra | Decision ms (median / max) |
|---|---|---:|---:|---:|---:|---:|---|---:|---:|
| Brock | singles | 11 | 11 | 0 | 22 | 0 | 1 (sableye) | 0 | 147 / 504 |
| Misty | singles | 13 | 13 | 13 | 20 | 8 | 1 (floatzel) | 0 | 97 / 389 |
| Lt. Surge | singles | 13 | 13 | 13 | 20 | 3 | 2 (magnezone) | 0 | 138 / 415 |
| Erika | singles | 13 | 13 | 13 | 27 | 3 | 0 | 0 | 119 / 412 |
| Sabrina | singles | 13 | 13 | 13 | 17 | 2 | 1 (espathra) | 0 | 104 / 349 |
| Koga | singles | 13 | 13 | 13 | 36 | 6 | 5 (sneasler) | 0 | 86 / 370 |
| Blaine | singles | 13 | 13 | 12 | 16 | 9 | 1 (chiyu) | 0 | 90 / 372 |
| Giovanni | doubles | 15 | 15 | 13 | 8 | 7 | 2 (chienpao) | 6 | 201 / 593 |
| Lorelei | singles | 13 | 13 | 13 | 14 | 2 | 2 (arctovish) | 0 | 108 / 392 |
| Bruno | singles | 13 | 13 | 13 | 10 | 2 | 2 (terrakion) | 0 | 105 / 285 |
| Agatha | singles | 13 | 13 | 13 | 12 | 2 | 1 (ceruledge) | 0 | 86 / 417 |
| Lance | singles | 15 | 15 | 15 | 17 | 7 | 0 | 8 | 126 / 490 |
| Blue | singles | 15 | 15 | 15 | 14 | 6 | 0 | 2 | 109 / 402 |

Decision times were measured in Node on a laptop, not in the game's Graal runtime, and are not a performance claim.

### Variant-specific results

- **Giovanni's Tera moved to Toxtricity.** In Classic, Tera was used in 3 Giovanni fights, only ever by toxtricitylowkey; Chien-Pao is not on the team. In Hardcore it is Chien-Pao's.
- **Blaine's Tera is Typhlosion-Hisui's** (Classic): used by typhlosionhisui, never by anyone else.
- **Koga's team order** is checked in the roster validation (Classic: Glimmora, Dragalge, Pecharunt, Sneasler, Naganadel, Cinderace) and Mega Dragalge evolved when leading in 2 of 2 of the fights that led with it (the lead scenarios start the simulation with that Pokémon in front).
- **Z-Moves and Ultra Burst** behave the same in both variants: Kommo-o's Clangorous Soulblaze, Necrozma's Ultra Burst and Kingambit's Black Hole Eclipse are available and execute (`verify_kanto_gyms.cjs`), and were used in the full fights above (Z/Ultra column).

## Findings

1. **Engine defect, found and fixed (2026-10-09, before the split): field-changing moves could not be scored against some foes.** Misty's Gyarados `Dive` (Water Surface to Underwater) failed with `TypeError: Cannot read properties of null (reading 'atk')` in `sourceDisruptionScore` against foes such as Blissey, Hippowdon and Magikarp. Cause: `Battle_AI.rb:1908` values a field change from the *decision-time* matchup, and the engine's comment says the view is taken once per opponent before any rollout, but it was built lazily, after the rollout. When the rolled-out foe had already fainted its view had no opponent. The fix (`rejuvenation-engine.js`, in `strategy`) builds the view of every current opponent before the rollouts. Scores that already worked are unchanged. Regression test: "a field-changing move is scored against foes that faint during the rollout" in `strategy-regression.cjs`; `node research/repro_dive_scoring_error.cjs` prints a score for every foe.
2. **Simulation harness defect, found and fixed: a declared Tera user in a named form was never offered Tera.** The harness compared the declaration (`toxtricity`) with the Showdown species ID of the form (`toxtricitylowkey`), so a member such as Toxtricity-Low-Key or Typhlosion-Hisui could not Terastallize in the simulation, and neither could the existing Ogerpon-Hearthflame and Ursaluna-Bloodmoon. The compat mod decides from the member's own declaration, so the harness now does the same. Erika and Lance (both variants) and Hardcore's Blue still show 0 Tera fights: those members are offered Tera now, and the decision rule's resource cost keeps declining it in these fights (Classic's Blue did use it once). Their Tera is covered by the roster validation, which executes it for every declared member. This changes no roster and no shipped code.
3. **Brock won 0 of 11 fights in both variants** (his roster is the same). His team is unevolved (Geodude-Alola, Archen, Lileep, Tirtouga) and the challengers are fully evolved level-16 Pokémon, so this says more about the stand-in teams than about a bug, but it is the weakest roster by a wide margin.
4. **Brock has no Mega Evolution.** Sableye holds Roseli Berry, so the roster does not satisfy "every Gym Leader has one Mega Evolution". Every other Gym Leader and the Elite Four and Champion hold a Mega Stone, a Z-Crystal or (Lance's Necrozma) the Ultranecrozium Z.
5. Tera and Z-Moves are used selectively. The decision rule charges 8 points plus 4 per extra surviving party member, so they are only chosen when the gain is large; Mega, which is mandatory, always fires.

## Not covered

- Run & Bun's own move-family scores and item use (Full Restore bags, `maxItemUses`) live in the Java mods and Cobblemon, not in the simulator. They are checked statically (the trainer files keep their original bag and rules) but not played.
- Forced switches use a simple best-move heuristic rather than Run & Bun's switch logic.
- The challenger side is the same scorer, not a human.
- Win rates describe these generic challengers only. They say nothing about how hard a real player will find either variant.
- Nothing here has been played in live Minecraft.
