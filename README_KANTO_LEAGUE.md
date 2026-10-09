# The Kanto challenge: Classic and Hardcore

The rebuilt Kanto league (eight Gym Leaders, the Elite Four and the Champion, 13 fights) comes in two difficulty variants. Both use the same fields, level caps, trainer AI (Run & Bun) and Mega / Tera / Z-Move / Ultra Burst gimmicks; only the teams differ.

| | **Classic** (recommended) | **Hardcore** |
|---|---|---|
| Roster pack | `rejuvenation-fields-cobbleverse-classic-0.1.zip` | `rejuvenation-fields-cobbleverse-hardcore-0.1.zip` |
| Complete rosters | [README_KANTO_CLASSIC.md](README_KANTO_CLASSIC.md) | [README_KANTO_HARDCORE.md](README_KANTO_HARDCORE.md) |
| Intent | Still a hard, Rejuvenation-style challenge, but with less setup stacking, fewer Uber picks and no inflated statistics. | The original roster override: the maximum-difficulty version with its highly optimised teams. |
| Blue's EVs | Normal legal spreads (508 each) | 252 in every stat (the compat mod allows this for him only) |

**Install only one roster pack.** Both replace the same 13 trainer files, so they cannot be combined. Put the base pack, the COBBLEVERSE extension pack (`rejuvenation-fields-cobbleverse-0.1.zip`, which holds the fields, mappings and Lt. Surge gym shared by both) and exactly one of the two roster zips in `datapacks`. To switch, delete one, add the other and restart the world.

## Where Classic differs from Hardcore

Everything else (fields, level caps, the remaining team members, IVs, AI, battle rules, bags, formats, gimmick policy) is identical.

| Trainer | Classic change |
|---|---|
| Brock, Misty | none |
| Lt. Surge | Iron Hands: Booster Energy → Expert Belt |
| Erika | Kartana → Adamant Ferrothorn (Rocky Helmet; Power Whip, Gyro Ball, Leech Seed, Knock Off) |
| Sabrina | Mega Alakazam: Calm Mind → Shadow Ball |
| Koga | Naganadel: Nasty Plot → Dark Pulse. Sneasler: Swords Dance → Knock Off. Mega Gengar → Mega Dragalge, now second in the team order |
| Blaine | Chi-Yu → Timid Typhlosion-Hisui (Eruption, Flamethrower, Extrasensory, Tera Blast); Blaine's Tera user is now Typhlosion-Hisui, Tera Grass |
| Giovanni | Chien-Pao → Timid Toxtricity (Boomburst, Overdrive, Sludge Bomb, Protect); Giovanni's Tera user is now Toxtricity, Tera Normal |
| Lorelei | Calyrex-Ice: Swords Dance → Crunch. Arctovish: Choice Band → Chople Berry |
| Bruno | Terrakion: Swords Dance → Poison Jab. Mega Lucario: Swords Dance → Crunch |
| Agatha | Basculegion: Choice Scarf → Clear Amulet, Jolly → Adamant, 252 Atk / 4 SpD / 252 Spe → 252 HP / 252 Atk / 4 SpD |
| Lance | Only Mega Dragonite keeps Dragon Dance. Haxorus → Close Combat, Roaring Moon → Earthquake, Necrozma-Dusk-Mane → Sunsteel Strike |
| Blue | Normal EV spreads instead of 252 in all six stats; team, moves, items and gimmicks unchanged |

## Fields and level caps

Both variants: [Kanto league fields](docs/KANTO_LEAGUE_FIELDS.md). Fight simulations and validation: [Kanto fight simulation](docs/KANTO_FIGHT_SIMULATION.md).

## How the two stay separate

- Hardcore is byte-for-byte the roster override that shipped before the split (checked against a recorded SHA-256 of each file). Classic is generated from it by `research/classic_league.py`, and `research/verify_kanto_gyms.cjs --variant classic` fails if Classic differs anywhere except the table above.
- The two packs hold exactly the same 13 file names and no other pack contains a trainer file (`research/package.py`), so installing one never leaves a stray file of the other. Installing both is not detected by the mod; the later file name (Hardcore) would win silently.
