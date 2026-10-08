# Kanto league fields

Complete gym, Elite Four and Champion sets: [README_KANTO_LEAGUE.md](../README_KANTO_LEAGUE.md).

All trainer fields follow the user-authored rosters dated 2026-10-08. Earlier win-share scores in research/trainer-field-scores.json describe the prior teams and are historical; they are not performance claims for these replacements.

| Trainer | Cap | Format | Starting field |
|---|---:|---|---|
| Brock | 16 | GEN_9_SINGLES | Crystal Cavern |
| Misty | 28 | GEN_9_SINGLES | Water Surface → Underwater via Dive |
| Lt. Surge | 36 | GEN_9_SINGLES | Murkwater Surface |
| Erika | 44 | GEN_9_SINGLES | Warped Forest |
| Sabrina | 59 | GEN_9_SINGLES | Psychic Terrain |
| Koga | 68 | GEN_9_SINGLES | Wasteland |
| Blaine | 76 | GEN_9_SINGLES | Crimson Forest |
| Giovanni | 81 | GEN_9_DOUBLES | Deep Dark |
| Lorelei | 85 | GEN_9_SINGLES | Frozen Dimensional Field |
| Bruno | 85 | GEN_9_SINGLES | Colosseum |
| Agatha | 85 | GEN_9_SINGLES | Haunted Field |
| Lance | 85 | GEN_9_SINGLES | Dragon's Den |
| Blue | 85 | GEN_9_SINGLES | New World |

Bindings live in `datapack/cobbleverse/data/rejuvenation/rejuvenation/trainers/kanto.json`. TrainerFieldBridge selects these on battle pre-start at TRAINER priority; an EXPLICIT selection still takes precedence.
