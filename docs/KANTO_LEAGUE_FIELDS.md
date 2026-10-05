# Kanto league fields

Every Kanto series trainer of the installed RCT datapack starts its battles on the field below. Trainer teams, AI and series files are read, never edited. The mod recognises the trainer from the original-trainer tag RCT stamps on its team (`<registry>#<trainer id>`) and selects the field at TRAINER priority before the battle starts; an EXPLICIT selection still overrides it.

## How the field was chosen

Each of the 56 non-Indoor fields was scored with the real engine (`research/trainer_fields.cjs`, about 80,000 simulated battles). For every team member, exactly as RCT defines it (species, level, nature, IVs, ability, item, moves), and each of 18 single-type reference opponents with Mew base stats at the same level, a fresh battle was started on the field and measured:

- the best expected damage per turn the member deals and takes, after every field rule, ability, item, weather and entry effect;
- end-of-round residual damage or healing for both sides;
- action speed after entry effects.

The member wins the pairing if it needs fewer turns to knock out (ties go to the faster side). A field's score is the share of the 6x18 pairings the team wins; the mean log damage ratio breaks ties. The assigned field has the highest score.

Assumptions: Mega Stones evolve on turn one; item and ability forms (plates, masks, Rusted Sword, As One, Primal orbs) are their battle forms; Average damage roll, no critical hits; accuracy after field and ability modifiers; multi-hit expectation 3.1 hits (Skill Link 5, Loaded Dice 4.5); Charge moves count half unless Power Herb or sun-boosted Solar Beam/Blade; recharge moves count half; status and self-KO moves add no damage; Doubles trainers are scored as 1v1 pairings without spread reduction; set-up, status, hazards and switching are outside the metric.

## Assignments

| Trainer | RCT ID | Format | Field | Win share | With no field | Runners-up |
|---|---|---|---|---:|---:|---|
| Blaine | kanto_blaine | GEN_9_SINGLES | [Corrupted Cave](fields/corrupted.md) | 89% | 80% | Flower Garden 5 (87%), Flower Garden 4 (87%) |
| Brock | kanto_brock | GEN_9_SINGLES | [Crystal Cavern](fields/crystal_cavern.md) | 44% | 24% | Desert Field (36%), Rocky Field (35%) |
| Blue | kanto_champion_blue | GEN_9_SINGLES | [Starlight Arena](fields/starlight.md) | 98% | 96% | Dark Crystal Cavern (98%), Rainbow Field (98%) |
| Erika | kanto_erika | GEN_9_SINGLES | [Big Top Arena](fields/big_top.md) | 74% | 69% | Flower Garden 5 (74%), Flower Garden 4 (73%) |
| Giovanni | kanto_giovanni | GEN_9_DOUBLES | [Glitch Field](fields/glitch.md) | 83% | 73% | Fairy Tale Field (80%), Starlight Arena (79%) |
| Koga | kanto_koga | GEN_9_SINGLES | [Dimensional Field](fields/dimensional.md) | 73% | 60% | Psychic Terrain (71%), Glitch Field (71%) |
| Agatha | kanto_league_agatha | GEN_9_SINGLES | [Volcanic Field](fields/volcanic.md) | 93% | 75% | Psychic Terrain (90%), Starlight Arena (89%) |
| Bruno | kanto_league_bruno | GEN_9_SINGLES | [Starlight Arena](fields/starlight.md) | 82% | 73% | Misty Terrain (81%), Glitch Field (81%) |
| Lance | kanto_league_lance | GEN_9_SINGLES | [Dragon's Den](fields/dragons_den.md) | 94% | 85% | Rocky Field (92%), New World (91%) |
| Lorelei | kanto_league_lorelei | GEN_9_SINGLES | [Underwater](fields/underwater.md) | 90% | 72% | Water Surface (90%), Murkwater Surface (88%) |
| Lt. Surge | kanto_ltsurge | GEN_9_SINGLES | [Murkwater Surface](fields/murkwater_surface.md) | 74% | 51% | Underwater (72%), Glitch Field (72%) |
| Misty | kanto_misty | GEN_9_SINGLES | [Underwater](fields/underwater.md) | 74% | 46% | Murkwater Surface (70%), Water Surface (66%) |
| Sabrina | kanto_sabrina | GEN_9_SINGLES | [Water Surface](fields/water_surface.md) | 89% | 85% | Deep Earth (88%), Corrosive Field (88%) |

## Who benefits

Per-member win share with no field and on the assigned field.

- **Blaine** (Corrupted Cave): sandyshocks 89%→89%, greattusk 72%→83%, walkingwake 94%→100%, venusaur 28%→67%, hooh 94%→94%, charizard 100%→100%
- **Brock** (Crystal Cavern): hippopotas 39%→72%, cacnea 22%→22%, lunatone 33%→67%, lileep 0%→33%, archen 22%→39%, varoom 28%→28%
- **Blue** (Starlight Arena): kyogre 100%→100%, swampert 94%→94%, eternatus 100%→100%, necrozma 83%→94%, arceus 100%→100%, walkingwake 100%→100%
- **Erika** (Big Top Arena): ogerpon 94%→94%, hawlucha 67%→100%, sceptile 78%→72%, toxtricity 89%→94%, slowbro 11%→11%, kartana 72%→72%
- **Giovanni** (Glitch Field): shuckle 0%→67%, roaringmoon 78%→78%, magearna 89%→72%, necrozma 83%→94%, eternatus 100%→100%, archaludon 89%→89%
- **Koga** (Dimensional Field): tapulele 89%→83%, hoopa 22%→89%, krookodile 67%→67%, chiyu 61%→86%, nidoking 78%→67%, toxtricity 44%→44%
- **Agatha** (Volcanic Field): krookodile 67%→83%, mewtwo 89%→100%, yveltal 94%→100%, fluttermane 39%→78%, victini 67%→94%, calyrex 94%→100%
- **Bruno** (Starlight Arena): infernape 78%→72%, zeraora 83%→78%, ironvaliant 28%→67%, necrozma 50%→78%, zacian 100%→100%, lucario 100%→100%
- **Lance** (Dragon's Den): glimmora 50%→72%, melmetal 100%→94%, arceus 94%→94%, dragonite 83%→100%, dialga 89%→100%, rayquaza 94%→100%
- **Lorelei** (Underwater): ludicolo 28%→78%, ironbundle 33%→83%, genesect 94%→94%, dragonite 83%→89%, palkia 100%→100%, swampert 94%→94%
- **Lt. Surge** (Murkwater Surface): rotom 44%→89%, electrode 28%→83%, raichu 39%→61%, hitmonlee 28%→39%, pawmot 83%→89%, ampharos 83%→83%
- **Misty** (Underwater): politoed 28%→78%, ludicolo 17%→83%, mantine 39%→89%, clodsire 39%→67%, starmie 100%→94%, toxicroak 56%→33%
- **Sabrina** (Water Surface): tapufini 72%→83%, camerupt 94%→89%, glastrier 78%→78%, magearna 89%→94%, ironhands 83%→100%, jellicent 94%→89%

Source snapshot: `COBBLEVERSE-RCT-DP-v20.zip` SHA-256 `b61d830c049f68eff42782fb78fbb1250b9bbb39bfcdca06bc5cc11b5704ae79`. Re-run `python rejuvenation/research/trainer_fields.py` after the RCT datapack or the field rules change.

Run & Bun AI combines its native scoring with the shared field-aware evaluator, strategic turn lookahead, team field utility and legal gimmick comparisons through optional adapters (see [INTEGRATIONS.md](INTEGRATIONS.md)). All 762 AI source leads have reviewed dispositions with zero ordinary applicable strategy pending. Trainer teams and progression files remain unchanged.
