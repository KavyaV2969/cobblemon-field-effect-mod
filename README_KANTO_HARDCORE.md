# Kanto League: Hardcore roster

Install `rejuvenation-fields-cobbleverse-hardcore-0.1.zip` **instead of** the Classic pack. It is the original roster override, unchanged: 13 fights with highly optimised teams. It does not contain the field assignments, mappings or the Lt. Surge gym, which come from `rejuvenation-fields-cobbleverse-0.1.zip`; install that as well. Updated 2026-10-09.

Hardcore is for players who want the maximum-difficulty version. Most players should start with the [Classic](README_KANTO_CLASSIC.md) roster, which keeps the same fields and gimmicks but is more balanced.

**Install only one league roster pack at a time.** Classic and Hardcore define the same 13 trainer files, so with both installed whichever loads last would silently win and you would not know which one you are fighting.

All 78 league Pokemon have **31 IVs in all six stats**. Every replacement team uses its trainer cap for every member. Lt. Surge keeps his existing team: level 36 except Rotom-Wash at 35. All Elite Four and Champion Pokemon are level 85. EVs, abilities, natures, moves, forms, held items and declared Tera types are listed exactly below.

The cap before each fight equals the next required trainer's highest level (`relativeLevelCap = 0`). Sabrina precedes Koga. All trainers use singles except Giovanni, who uses doubles. Trainers use Run & Bun AI with their original item-use limits and Full Restore bags. Dynamax and Gigantamax are disabled for every trainer.

Blue's spreads use **252 EVs in all six stats (1512 total)**. RCT/Cobblemon normally limits total EVs to 510. The compat mod restores these spreads only for NPC teams tagged `kanto_champion_blue`, including copies created for battle. Player Pokemon and other trainers keep normal EV limits. The Hardcore pack and the compat jar must be installed together for Blue's full spreads.

## Progression, level caps and fields

| Stage | Trainer | Level cap | Format | Starting field | Team order |
|---|---|---:|---|---|---|
| 1 | Brock | 16 | Singles | Crystal Cavern | 1. Geodude-Alola, 2. Archen, 3. Lileep, 4. Sableye, 5. Lunatone, 6. Tirtouga |
| 2 | Misty | 28 | Singles | Water Surface → Underwater via Dive | 1. Vaporeon, 2. Togekiss, 3. Quagsire, 4. Floatzel, 5. Lanturn, 6. Gyarados |
| 3 | Lt. Surge | 36 | Singles | Murkwater Surface | 1. Raichu-Alola, 2. Magnezone, 3. Iron Hands, 4. Archaludon, 5. Rotom-Wash, 6. Eelektross |
| 4 | Erika | 44 | Singles | Warped Forest | 1. Ting-Lu, 2. Serperior, 3. Kartana, 4. Meowscarada, 5. Ogerpon-Hearthflame, 6. Venusaur |
| 5 | Sabrina | 59 | Singles | Psychic Terrain | 1. Delphox, 2. Metagross, 3. Armarouge, 4. Iron Valiant, 5. Espathra, 6. Alakazam |
| 6 | Koga | 68 | Singles | Wasteland | 1. Glimmora, 2. Pecharunt, 3. Sneasler, 4. Naganadel, 5. Cinderace, 6. Gengar |
| 7 | Blaine | 76 | Singles | Crimson Forest | 1. Gouging Fire, 2. Heatran, 3. Blaziken, 4. Gholdengo, 5. Chi-Yu, 6. Charizard |
| 8 | Giovanni | 81 | Doubles | Deep Dark | 1. Marshadow, 2. Rhyperior, 3. Kommo-o, 4. Chien-Pao, 5. Hydreigon, 6. Tyranitar |
| Elite Four | Lorelei | 85 | Singles | Frozen Dimensional Field | 1. Arctovish, 2. Kyurem, 3. Iron Bundle, 4. Greninja, 5. Calyrex-Ice, 6. Baxcalibur |
| Elite Four | Bruno | 85 | Singles | Colosseum | 1. Gallade, 2. Keldeo, 3. Cloyster, 4. Terrakion, 5. Zamazenta-Crowned, 6. Lucario |
| Elite Four | Agatha | 85 | Singles | Haunted Field | 1. Dragapult, 2. Flutter Mane, 3. Ceruledge, 4. Calyrex-Shadow, 5. Gengar, 6. Basculegion |
| Elite Four | Lance | 85 | Singles | Dragon's Den | 1. Archaludon, 2. Haxorus, 3. Latios, 4. Roaring Moon, 5. Necrozma-Dusk-Mane, 6. Dragonite |
| Champion | Blue | 85 | Singles | New World | 1. Hawlucha, 2. Iron Valiant, 3. Kingambit, 4. Ursaluna-Bloodmoon, 5. Metagross, 6. Arceus |

## Mega, Tera and Z-Move users

| Trainer | Mega Evolution | Terastallization (one per trainer) | Z-Move / Ultra Burst |
|---|---|---|---|
| Brock | none | Sableye, Tera Steel | none |
| Misty | Gyarados (Gyaradosite) | Floatzel, Tera Water | none |
| Lt. Surge | Eelektross (Eelektrossite) | Magnezone, Tera Flying | none |
| Erika | Venusaur (Venusaurite) | Ogerpon-Hearthflame, Tera Fire | none |
| Sabrina | Alakazam (Alakazite) | Espathra, Tera Fairy | none |
| Koga | Gengar (Gengarite) | Sneasler, Tera Dark | none |
| Blaine | Charizard (Charizardite Y) | Chi-Yu, Tera Grass | none |
| Giovanni | Tyranitar (Tyranitarite) | Chien-Pao, Tera Dark | Kommo-o (Clangorous Soulblaze) |
| Lorelei | Baxcalibur (Baxcalibrite) | Arctovish, Tera Water | none |
| Bruno | Lucario (Lucarionite) | Terrakion, Tera Fighting | none |
| Agatha | Gengar (Gengarite) | Ceruledge, Tera Fire | none |
| Lance | Dragonite (Dragoninite) | Roaring Moon, Tera Flying | Necrozma-Dusk-Mane (Ultra Burst) |
| Blue | Metagross (Metagrossite) | Ursaluna-Bloodmoon, Tera Normal | Kingambit (Black Hole Eclipse) |

Mega Evolution happens on the first legal move. Only the declared Tera user ever Terastallizes. Each side has one Tera use per battle. Dynamax and Gigantamax are disabled. Brock has no Mega Evolution.

## Field-specific interactions

The trainer's field is fixed by `datapack/cobbleverse/.../trainers/kanto.json` and is the same in both variants. Full rules: [Field Notes](field-notes/FIELD_NOTES.md).

- **Brock — Crystal Cavern.** Crystal Cavern: Rock- and Dragon-type moves gain 1.5x power, and Rock moves take on a cycling Fire / Water / Grass / Psychic crystal type. Stealth Rock deals crystal-type damage. Ancient Power and Rock Tomb are boosted.
- **Misty — Water Surface → Underwater via Dive.** Water Surface becomes Underwater when Gyarados uses Dive, through the existing field transition.
- **Lt. Surge — Murkwater Surface.** Murkwater Surface: Water moves gain Poison typing and 1.5x power, Poison moves 1.5x and Electric moves 1.3x. Ground moves fail. Grounded non-Poison, non-Steel Pokémon lose 1/8 of their HP each turn. Elemental Seed raises Speed and Aqua Rings the holder but poisons it.
- **Erika — Warped Forest.** Warped Forest: Grass, Dark and special Bug moves gain 1.5x power, damaging Grass moves also count as Dark for type effectiveness, Power Whip gains a further 1.5x (2.25x in all) and Leech Seed drains 1/4. Weather cannot start and nothing can be frozen. Magical Seed raises Defense and Special Defense but lowers Speed and applies Ingrain.
- **Sabrina — Psychic Terrain.** Psychic Terrain: grounded Psychic moves gain 1.5x power, and Aura Sphere, Focus Blast, Hex, Moonblast and Mystical Fire gain 1.5x. Priority attacks fail against grounded Pokémon. Calm Mind raises Special Attack and Special Defense by 2 stages. Magical Seed raises Special Attack by 2 stages but confuses the holder.
- **Koga — Wasteland.** Wasteland: Spikes and Stealth Rock are consumed at the end of the turn and hit harder (1/3 per Spikes layer, doubled Stealth Rock damage). Sludge Bomb and Gunk Shot gain 1.2x and a chance of a random Burn, Freeze, Paralysis or Poison; Dire Claw always rolls a status. Earthquake is cut to 0.25x. Telluric Seed raises Attack and Special Attack and lays Stealth Rock on both sides.
- **Blaine — Crimson Forest.** Crimson Forest: Fire, Grass and Poison moves gain 1.3x power. Positive-priority damaging moves lose 20% accuracy and crash on a miss. Knocking out a Pokémon raises the user's Attack by 1 stage (Piglin Bloodlust). Hail and Snow cannot last and nothing can be frozen. Good as Gold raises Speed and Special Attack on entry.
- **Giovanni — Deep Dark.** Deep Dark: Dark and Ghost moves gain 1.5x power. Sound moves (such as Boomburst and Clanging Scales) and earthquake-style moves raise the shared Sculk Warning by 2; at Warning 4 every Pokémon that is not Ghost-type, Soundproof, Punk Rock or Solid Rock loses 20% of its HP. Magical Seed turns Hydreigon's ability into Soundproof. Giovanni fights in doubles. Hydreigon starts with Levitate; consuming its Magical Seed on Deep Dark applies the existing field effect that changes its active ability to Soundproof. Chien-Pao (Sword of Ruin) is the Tera user.
- **Lorelei — Frozen Dimensional Field.** Frozen Dimensional Field: Dark moves gain 1.5x power and Ice moves 1.2x; Dark Pulse, Night Slash, Hydro Pump and Surf gain Ice typing. Ice and Ghost Pokémon gain 1.2x defenses and Fire Pokémon lose 20%. Pressure lowers the opponent's defenses on entry. Elemental Seed raises Speed by 2 stages but applies Torment.
- **Bruno — Colosseum.** Colosseum: switches resolve in attack order, forced-switch moves and Encore fail, Swords Dance gives +3, and Reversal, Sacred Sword, Secret Sword, Meteor Mash, Bullet Punch and Leaf Blade gain power. Justified raises Attack and Special Attack on entry. A knockout boosts the user's best-matching stat. Synthetic Seed raises Attack by 2 stages but applies Taunt.
- **Agatha — Haunted Field.** Haunted Field: Ghost moves gain 1.5x power and hit Normal-types neutrally; sleeping non-Ghost Pokémon take 1/16 each turn. Phantom Force and Shadow Force take one turn, Hypnosis and Will-O-Wisp are 90% accurate, Destiny Bond can be repeated. Magical Seed raises Defense and Special Defense but burns the holder.
- **Lance — Dragon's Den.** Dragon's Den: Dragon and Fire moves gain 1.5x power and Rock moves 1.3x. Dragon Dance raises Attack and Speed by 2 stages. Earthquake gains Fire typing, Earth Power is boosted, Dragon Rush has 100% accuracy and Scale Shot does not lower defenses. Multiscale always negates Dragon weaknesses. Fields cannot be generated. Haxorus, Roaring Moon, Necrozma-Dusk-Mane and Mega Dragonite all carry Dragon Dance, which gives +2 Attack and Speed here.
- **Blue — New World.** New World: Dark moves gain 1.5x power; Draco Meteor, Meteor Mash, Moonblast, Vacuum Wave, Spacial Rend and Ancient Power gain 2x, Earth Power and Judgment 1.5x. Earthquake is 0.25x. Grounded Pokémon move at 0.75x Speed. Moonlight heals 75%. Multitype randomises Arceus's type on entry and each turn. Weather and fields cannot be set. Arceus keeps Multitype and can change form and Judgment type during battle. Blue's requested 252 EVs in every stat (1512 total) are restored by the compat mod for the NPC tagged kanto_champion_blue only.

- Lunatone (Brock) explicitly has Hidden Power Ground and 31 IVs in every stat. The installed simulator accepts that typed move without reducing IVs.
- New World keeps its existing Multitype effects, which can change Arceus's active form and Judgment type during battle.

## Complete gym, Elite Four and Champion rosters

### Gym 1: Brock — Crystal Cavern — cap 16

Singles. Team order (lead first): 1. Geodude-Alola, 2. Archen, 3. Lileep, 4. Sableye, 5. Lunatone, 6. Tirtouga.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Geodude-Alola | — | Sturdy | — |
| 2 | Archen | Berry Juice | Defeatist | — |
| 3 | Lileep | Big Root | Storm Drain | — |
| 4 | Sableye | Roseli Berry | Prankster | Tera Steel |
| 5 | Lunatone | Passho Berry | Levitate | — |
| 6 | Tirtouga | White Herb | Solid Rock | — |

```text
Geodude-Alola (M)
Slot: 1 (lead)
Level: 16
Ability: Sturdy
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 HP / 124 Atk
- Stealth Rock
- Rock Tomb
- Spark
- Self-Destruct

Archen @ Berry Juice (M)
Slot: 2
Level: 16
Ability: Defeatist
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 Atk / 124 Spe
- Rock Tomb
- Wing Attack
- U-turn
- Quick Attack

Lileep @ Big Root (M)
Slot: 3
Level: 16
Ability: Storm Drain
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 HP / 124 Def
- Ancient Power
- Mega Drain
- Recover
- Stockpile

Sableye @ Roseli Berry (M)
Slot: 4
Level: 16
Ability: Prankster
Tera Type: Steel
Nature: Impish
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 HP / 124 Def
- Will-O-Wisp
- Shadow Sneak
- Recover
- Parting Shot

Lunatone @ Passho Berry
Slot: 5
Level: 16
Ability: Levitate
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 SpA / 124 Spe
- Ancient Power
- Psybeam
- Icy Wind
- Hidden Power Ground

Tirtouga @ White Herb (M)
Slot: 6
Level: 16
Ability: Solid Rock
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 Atk / 124 Spe
- Shell Smash
- Smack Down
- Liquidation
- Aqua Jet

```

### Gym 2: Misty — Water Surface → Underwater via Dive — cap 28

Singles. Team order (lead first): 1. Vaporeon, 2. Togekiss, 3. Quagsire, 4. Floatzel, 5. Lanturn, 6. Gyarados.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Vaporeon | Elemental Seed | Water Absorb | — |
| 2 | Togekiss | Wacan Berry | Serene Grace | — |
| 3 | Quagsire | Rindo Berry | Water Absorb | — |
| 4 | Floatzel | Mystic Water | Swift Swim | Tera Water |
| 5 | Lanturn | Sitrus Berry | Volt Absorb | — |
| 6 | Gyarados | Gyaradosite | Intimidate | Mega Evolution (Gyaradosite) |

```text
Vaporeon @ Elemental Seed (M)
Slot: 1 (lead)
Level: 28
Ability: Water Absorb
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Def / 4 SpD
- Wish
- Toxic
- Scald
- Protect

Togekiss @ Wacan Berry (M)
Slot: 2
Level: 28
Ability: Serene Grace
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 4 SpA / 252 Spe
- Air Slash
- Aura Sphere
- Roost
- Dazzling Gleam

Quagsire @ Rindo Berry (M)
Slot: 3
Level: 28
Ability: Water Absorb
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 128 Def / 128 SpD
- Muddy Water
- Recover
- Ice Beam
- Haze

Floatzel @ Mystic Water (M)
Slot: 4
Level: 28
Ability: Swift Swim
Tera Type: Water
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 HP / 252 Atk / 252 Spe
- Liquidation
- Flip Turn
- Ice Punch
- Brick Break

Lanturn @ Sitrus Berry (M)
Slot: 5
Level: 28
Ability: Volt Absorb
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 SpA / 4 SpD
- Discharge
- Volt Switch
- Ice Beam
- Scald

Gyarados @ Gyaradosite (M)
Slot: 6
Level: 28
Ability: Intimidate
Gimmick: Mega Evolution (Gyaradosite)
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 HP / 252 Atk / 252 Spe
- Dive
- Waterfall
- Crunch
- Dragon Dance

```

### Gym 3: Lt. Surge — Murkwater Surface — cap 36

Singles. Team order (lead first): 1. Raichu-Alola, 2. Magnezone, 3. Iron Hands, 4. Archaludon, 5. Rotom-Wash, 6. Eelektross.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Raichu-Alola | Wise Glasses | Surge Surfer | — |
| 2 | Magnezone | Choice Specs | Sturdy | Tera Flying |
| 3 | Iron Hands | Booster Energy | Quark Drive | — |
| 4 | Archaludon | Power Herb | Stamina | — |
| 5 | Rotom-Wash | Rindo Berry | Levitate | — |
| 6 | Eelektross | Eelektrossite | Levitate | Mega Evolution (Eelektrossite) |

```text
Raichu-Alola @ Wise Glasses (M)
Slot: 1 (lead)
Level: 36
Ability: Surge Surfer
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 SpA / 252 Spe
- Thunderbolt
- Psychic
- Volt Switch
- Focus Blast

Magnezone @ Choice Specs
Slot: 2
Level: 36
Ability: Sturdy
Tera Type: Flying
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 SpA
- Thunderbolt
- Flash Cannon
- Volt Switch
- Tera Blast

Iron Hands @ Booster Energy
Slot: 3
Level: 36
Ability: Quark Drive
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk
- Swords Dance
- Drain Punch
- Thunder Punch
- Ice Punch

Archaludon @ Power Herb (M)
Slot: 4
Level: 36
Ability: Stamina
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 SpA
- Electro Shot
- Flash Cannon
- Draco Meteor
- Body Press

Rotom-Wash @ Rindo Berry
Slot: 5
Level: 35
Ability: Levitate
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 SpA
- Hydro Pump
- Volt Switch
- Will-O-Wisp
- Thunderbolt

Eelektross @ Eelektrossite (M)
Slot: 6
Level: 36
Ability: Levitate
Gimmick: Mega Evolution (Eelektrossite)
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 252 Spe
- Wild Charge
- Drain Punch
- Knock Off
- Coil

```

### Gym 4: Erika — Warped Forest — cap 44

Singles. Team order (lead first): 1. Ting-Lu, 2. Serperior, 3. Kartana, 4. Meowscarada, 5. Ogerpon-Hearthflame, 6. Venusaur.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Ting-Lu | Magical Seed | Vessel of Ruin | — |
| 2 | Serperior | Leftovers | Contrary | — |
| 3 | Kartana | Life Orb | Beast Boost | — |
| 4 | Meowscarada | Choice Scarf | Protean | — |
| 5 | Ogerpon-Hearthflame | Hearthflame Mask | Mold Breaker | Tera Fire |
| 6 | Venusaur | Venusaurite | Chlorophyll | Mega Evolution (Venusaurite) |

```text
Ting-Lu @ Magical Seed
Slot: 1 (lead)
Level: 44
Ability: Vessel of Ruin
Nature: Careful
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 4 Def / 252 SpD
- Stealth Rock
- Earthquake
- Ruination
- Whirlwind

Serperior @ Leftovers (M)
Slot: 2
Level: 44
Ability: Contrary
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 4 SpA / 252 Spe
- Leaf Storm
- Substitute
- Leech Seed
- Tera Blast

Kartana @ Life Orb
Slot: 3
Level: 44
Ability: Beast Boost
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Leaf Blade
- Smart Strike
- Knock Off
- Sacred Sword

Meowscarada @ Choice Scarf (M)
Slot: 4
Level: 44
Ability: Protean
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 Def / 252 Spe
- Knock Off
- U-turn
- Low Kick
- Flower Trick

Ogerpon-Hearthflame @ Hearthflame Mask (F)
Slot: 5
Level: 44
Ability: Mold Breaker
Tera Type: Fire
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Swords Dance
- Ivy Cudgel
- Power Whip
- U-turn

Venusaur @ Venusaurite (M)
Slot: 6
Level: 44
Ability: Chlorophyll
Gimmick: Mega Evolution (Venusaurite)
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 248 HP / 100 Def / 140 SpD / 20 Spe
- Giga Drain
- Sludge Bomb
- Leech Seed
- Earth Power

```

### Gym 5: Sabrina — Psychic Terrain — cap 59

Singles. Team order (lead first): 1. Delphox, 2. Metagross, 3. Armarouge, 4. Iron Valiant, 5. Espathra, 6. Alakazam.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Delphox | Magical Seed | Magician | — |
| 2 | Metagross | Assault Vest | Clear Body | — |
| 3 | Armarouge | Colbur Berry | Flash Fire | — |
| 4 | Iron Valiant | Life Orb | Quark Drive | — |
| 5 | Espathra | Leftovers | Speed Boost | Tera Fairy |
| 6 | Alakazam | Alakazite | Magic Guard | Mega Evolution (Alakazite) |

```text
Delphox @ Magical Seed (M)
Slot: 1 (lead)
Level: 59
Ability: Magician
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 SpA / 4 SpD / 252 Spe
- Hypnosis
- Mystical Fire
- Psychic
- Focus Blast

Metagross @ Assault Vest
Slot: 2
Level: 59
Ability: Clear Body
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 4 SpD
- Psychic Fangs
- Meteor Mash
- Earthquake
- Knock Off

Armarouge @ Colbur Berry (M)
Slot: 3
Level: 59
Ability: Flash Fire
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 SpA / 4 SpD
- Expanding Force
- Armor Cannon
- Aura Sphere
- Energy Ball

Iron Valiant @ Life Orb
Slot: 4
Level: 59
Ability: Quark Drive
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Moonblast
- Focus Blast
- Psyshock
- Shadow Ball

Espathra @ Leftovers (M)
Slot: 5
Level: 59
Ability: Speed Boost
Tera Type: Fairy
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Def / 4 Spe
- Calm Mind
- Stored Power
- Dazzling Gleam
- Protect

Alakazam @ Alakazite (M)
Slot: 6
Level: 59
Ability: Magic Guard
Gimmick: Mega Evolution (Alakazite)
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Calm Mind
- Psychic
- Focus Blast
- Recover

```

### Gym 6: Koga — Wasteland — cap 68

Singles. Team order (lead first): 1. Glimmora, 2. Pecharunt, 3. Sneasler, 4. Naganadel, 5. Cinderace, 6. Gengar.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Glimmora | Focus Sash | Toxic Debris | — |
| 2 | Pecharunt | Leftovers | Poison Puppeteer | — |
| 3 | Sneasler | Telluric Seed | Unburden | Tera Dark |
| 4 | Naganadel | Life Orb | Beast Boost | — |
| 5 | Cinderace | Life Orb | Libero | — |
| 6 | Gengar | Gengarite | Cursed Body | Mega Evolution (Gengarite) |

```text
Glimmora @ Focus Sash (M)
Slot: 1 (lead)
Level: 68
Ability: Toxic Debris
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Spikes
- Stealth Rock
- Sludge Bomb
- Earth Power

Pecharunt @ Leftovers
Slot: 2
Level: 68
Ability: Poison Puppeteer
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 228 Def / 28 Spe
- Parting Shot
- Recover
- Malignant Chain
- Shadow Ball

Sneasler @ Telluric Seed (M)
Slot: 3
Level: 68
Ability: Unburden
Tera Type: Dark
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dire Claw
- Close Combat
- Acrobatics
- Swords Dance

Naganadel @ Life Orb
Slot: 4
Level: 68
Ability: Beast Boost
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 SpA / 4 SpD / 252 Spe
- Nasty Plot
- Draco Meteor
- Sludge Bomb
- Fire Blast

Cinderace @ Life Orb (M)
Slot: 5
Level: 68
Ability: Libero
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Gunk Shot
- Pyro Ball
- U-turn
- Sucker Punch

Gengar @ Gengarite (M)
Slot: 6
Level: 68
Ability: Cursed Body
Gimmick: Mega Evolution (Gengarite)
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Venoshock
- Shadow Ball
- Focus Blast
- Energy Ball

```

### Gym 7: Blaine — Crimson Forest — cap 76

Singles. Team order (lead first): 1. Gouging Fire, 2. Heatran, 3. Blaziken, 4. Gholdengo, 5. Chi-Yu, 6. Charizard.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Gouging Fire | Loaded Dice | Protosynthesis | — |
| 2 | Heatran | Leftovers | Flash Fire | — |
| 3 | Blaziken | Focus Sash | Speed Boost | — |
| 4 | Gholdengo | White Herb | Good as Gold | — |
| 5 | Chi-Yu | Life Orb | Beads of Ruin | Tera Grass |
| 6 | Charizard | Charizardite Y | Blaze | Mega Evolution (Charizardite Y) |

```text
Gouging Fire @ Loaded Dice
Slot: 1 (lead)
Level: 76
Ability: Protosynthesis
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 HP / 252 Atk / 252 Spe
- Dragon Dance
- Heat Crash
- Scale Shot
- Earthquake

Heatran @ Leftovers (M)
Slot: 2
Level: 76
Ability: Flash Fire
Nature: Calm
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 4 SpA / 252 SpD
- Magma Storm
- Earth Power
- Toxic
- Protect

Blaziken @ Focus Sash (M)
Slot: 3
Level: 76
Ability: Speed Boost
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Swords Dance
- Flare Blitz
- Close Combat
- Thunder Punch

Gholdengo @ White Herb
Slot: 4
Level: 76
Ability: Good as Gold
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Make It Rain
- Shadow Ball
- Focus Blast
- Recover

Chi-Yu @ Life Orb
Slot: 5
Level: 76
Ability: Beads of Ruin
Tera Type: Grass
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 SpA / 4 SpD / 252 Spe
- Flamethrower
- Dark Pulse
- Tera Blast
- Psychic

Charizard @ Charizardite Y (M)
Slot: 6
Level: 76
Ability: Blaze
Gimmick: Mega Evolution (Charizardite Y)
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Weather Ball
- Solar Beam
- Focus Blast
- Roost

```

### Gym 8: Giovanni — Deep Dark — cap 81

Doubles. Team order (lead first): 1. Marshadow, 2. Rhyperior, 3. Kommo-o, 4. Chien-Pao, 5. Hydreigon, 6. Tyranitar.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Marshadow | Life Orb | Technician | — |
| 2 | Rhyperior | Assault Vest | Solid Rock | — |
| 3 | Kommo-o | Kommonium Z | Soundproof | Z-Move: Clangorous Soulblaze |
| 4 | Chien-Pao | Focus Sash | Sword of Ruin | Tera Dark |
| 5 | Hydreigon | Magical Seed | Levitate | — |
| 6 | Tyranitar | Tyranitarite | Sand Stream | Mega Evolution (Tyranitarite) |

```text
Marshadow @ Life Orb
Slot: 1 (lead)
Level: 81
Ability: Technician
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Spectral Thief
- Close Combat
- Shadow Sneak
- Bulk Up

Rhyperior @ Assault Vest (M)
Slot: 2
Level: 81
Ability: Solid Rock
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 4 SpD
- Earthquake
- Stone Edge
- Megahorn
- Ice Punch

Kommo-o @ Kommonium Z (M)
Slot: 3
Level: 81
Ability: Soundproof
Gimmick: Z-Move: Clangorous Soulblaze
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Clanging Scales
- Aura Sphere
- Flamethrower
- Flash Cannon

Chien-Pao @ Focus Sash
Slot: 4
Level: 81
Ability: Sword of Ruin
Tera Type: Dark
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Swords Dance
- Crunch
- Icicle Crash
- Sacred Sword

Hydreigon @ Magical Seed (M)
Slot: 5
Level: 81
Ability: Levitate
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Dark Pulse
- Draco Meteor
- Flamethrower
- Earth Power

Tyranitar @ Tyranitarite (M)
Slot: 6
Level: 81
Ability: Sand Stream
Gimmick: Mega Evolution (Tyranitarite)
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Crunch
- Stone Edge
- Ice Punch

```

### Elite Four: Lorelei — Frozen Dimensional Field — cap 85

Singles. Team order (lead first): 1. Arctovish, 2. Kyurem, 3. Iron Bundle, 4. Greninja, 5. Calyrex-Ice, 6. Baxcalibur.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Arctovish | Choice Band | Slush Rush | Tera Water |
| 2 | Kyurem | Loaded Dice | Pressure | — |
| 3 | Iron Bundle | Light Clay | Quark Drive | — |
| 4 | Greninja | Life Orb | Protean | — |
| 5 | Calyrex-Ice | Elemental Seed | As One (Glastrier) | — |
| 6 | Baxcalibur | Baxcalibrite | Thermal Exchange | Mega Evolution (Baxcalibrite) |

```text
Arctovish @ Choice Band
Slot: 1 (lead)
Level: 85
Ability: Slush Rush
Tera Type: Water
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Fishious Rend
- Icicle Crash
- Crunch
- Psychic Fangs

Kyurem @ Loaded Dice
Slot: 2
Level: 85
Ability: Pressure
Nature: Naive
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpA / 252 Spe
- Icicle Spear
- Scale Shot
- Earth Power
- Roost

Iron Bundle @ Light Clay
Slot: 3
Level: 85
Ability: Quark Drive
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Aurora Veil
- Freeze-Dry
- Hydro Pump
- Flip Turn

Greninja @ Life Orb (M)
Slot: 4
Level: 85
Ability: Protean
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Hydro Pump
- Dark Pulse
- Ice Beam
- U-turn

Calyrex-Ice @ Elemental Seed
Slot: 5
Level: 85
Ability: As One (Glastrier)
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Glacial Lance
- High Horsepower
- Close Combat
- Swords Dance

Baxcalibur @ Baxcalibrite (M)
Slot: 6
Level: 85
Ability: Thermal Exchange
Gimmick: Mega Evolution (Baxcalibrite)
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Icicle Crash
- Glaive Rush
- Earthquake

```

### Elite Four: Bruno — Colosseum — cap 85

Singles. Team order (lead first): 1. Gallade, 2. Keldeo, 3. Cloyster, 4. Terrakion, 5. Zamazenta-Crowned, 6. Lucario.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Gallade | Synthetic Seed | Justified | — |
| 2 | Keldeo | Choice Specs | Justified | — |
| 3 | Cloyster | White Herb | Skill Link | — |
| 4 | Terrakion | Focus Sash | Justified | Tera Fighting |
| 5 | Zamazenta-Crowned | Rusted Shield | Dauntless Shield | — |
| 6 | Lucario | Lucarionite | Justified | Mega Evolution (Lucarionite) |

```text
Gallade @ Synthetic Seed (M)
Slot: 1 (lead)
Level: 85
Ability: Justified
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Sacred Sword
- Psycho Cut
- Night Slash
- Leaf Blade

Keldeo @ Choice Specs
Slot: 2
Level: 85
Ability: Justified
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Secret Sword
- Hydro Pump
- Icy Wind
- Air Slash

Cloyster @ White Herb (M)
Slot: 3
Level: 85
Ability: Skill Link
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Shell Smash
- Icicle Spear
- Rock Blast
- Liquidation

Terrakion @ Focus Sash
Slot: 4
Level: 85
Ability: Justified
Tera Type: Fighting
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Swords Dance
- Reversal
- Sacred Sword
- Stone Edge

Zamazenta-Crowned @ Rusted Shield
Slot: 5
Level: 85
Ability: Dauntless Shield
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 Def / 252 Spe
- Body Press
- Behemoth Bash
- Crunch
- Roar

Lucario @ Lucarionite (M)
Slot: 6
Level: 85
Ability: Justified
Gimmick: Mega Evolution (Lucarionite)
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Swords Dance
- Meteor Mash
- Close Combat
- Bullet Punch

```

### Elite Four: Agatha — Haunted Field — cap 85

Singles. Team order (lead first): 1. Dragapult, 2. Flutter Mane, 3. Ceruledge, 4. Calyrex-Shadow, 5. Gengar, 6. Basculegion.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Dragapult | Choice Band | Cursed Body | — |
| 2 | Flutter Mane | Booster Energy | Protosynthesis | — |
| 3 | Ceruledge | Focus Sash | Weak Armor | Tera Fire |
| 4 | Calyrex-Shadow | Magical Seed | As One (Spectrier) | — |
| 5 | Gengar | Gengarite | Cursed Body | Mega Evolution (Gengarite) |
| 6 | Basculegion | Choice Scarf | Mold Breaker | — |

```text
Dragapult @ Choice Band (M)
Slot: 1 (lead)
Level: 85
Ability: Cursed Body
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Phantom Force
- Dragon Darts
- U-turn
- Sucker Punch

Flutter Mane @ Booster Energy
Slot: 2
Level: 85
Ability: Protosynthesis
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Shadow Ball
- Moonblast
- Mystical Fire
- Psyshock

Ceruledge @ Focus Sash (M)
Slot: 3
Level: 85
Ability: Weak Armor
Tera Type: Fire
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Swords Dance
- Bitter Blade
- Poltergeist
- Shadow Sneak

Calyrex-Shadow @ Magical Seed
Slot: 4
Level: 85
Ability: As One (Spectrier)
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Nasty Plot
- Astral Barrage
- Psyshock
- Draining Kiss

Gengar @ Gengarite (M)
Slot: 5
Level: 85
Ability: Cursed Body
Gimmick: Mega Evolution (Gengarite)
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Hypnosis
- Hex
- Focus Blast
- Destiny Bond

Basculegion @ Choice Scarf (M)
Slot: 6
Level: 85
Ability: Mold Breaker
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Last Respects
- Wave Crash
- Aqua Jet
- Psychic Fangs

```

### Elite Four: Lance — Dragon's Den — cap 85

Singles. Team order (lead first): 1. Archaludon, 2. Haxorus, 3. Latios, 4. Roaring Moon, 5. Necrozma-Dusk-Mane, 6. Dragonite.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Archaludon | Elemental Seed | Stamina | — |
| 2 | Haxorus | Loaded Dice | Mold Breaker | — |
| 3 | Latios | Soul Dew | Levitate | — |
| 4 | Roaring Moon | Booster Energy | Protosynthesis | Tera Flying |
| 5 | Necrozma-Dusk-Mane | Ultranecrozium Z | Prism Armor | Ultra Burst (Ultra Necrozma) |
| 6 | Dragonite | Dragoninite | Multiscale | Mega Evolution (Dragoninite) |

```text
Archaludon @ Elemental Seed (M)
Slot: 1 (lead)
Level: 85
Ability: Stamina
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 4 Def / 252 SpA
- Draco Meteor
- Earth Power
- Flash Cannon
- Body Press

Haxorus @ Loaded Dice (M)
Slot: 2
Level: 85
Ability: Mold Breaker
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Scale Shot
- Earthquake
- Poison Jab

Latios @ Soul Dew (M)
Slot: 3
Level: 85
Ability: Levitate
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Luster Purge
- Draco Meteor
- Aura Sphere
- Recover

Roaring Moon @ Booster Energy
Slot: 4
Level: 85
Ability: Protosynthesis
Tera Type: Flying
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Acrobatics
- Dragon Rush
- Knock Off

Necrozma-Dusk-Mane @ Ultranecrozium Z
Slot: 5
Level: 85
Ability: Prism Armor
Gimmick: Ultra Burst (Ultra Necrozma)
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Photon Geyser
- Dragon Claw
- Earthquake

Dragonite @ Dragoninite (M)
Slot: 6
Level: 85
Ability: Multiscale
Gimmick: Mega Evolution (Dragoninite)
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Dragon Rush
- Fire Punch
- Earthquake

```

### Champion: Blue — New World — cap 85

Singles. Team order (lead first): 1. Hawlucha, 2. Iron Valiant, 3. Kingambit, 4. Ursaluna-Bloodmoon, 5. Metagross, 6. Arceus.

| # | Pokémon | Item | Ability | Gimmick |
|---:|---|---|---|---|
| 1 | Hawlucha | Magical Seed | Unburden | — |
| 2 | Iron Valiant | Life Orb | Quark Drive | — |
| 3 | Kingambit | Darkinium Z | Supreme Overlord | Z-Move: Black Hole Eclipse |
| 4 | Ursaluna-Bloodmoon | Leftovers | Mind's Eye | Tera Normal |
| 5 | Metagross | Metagrossite | Clear Body | Mega Evolution (Metagrossite) |
| 6 | Arceus | Life Orb | Multitype | — |

```text
Hawlucha @ Magical Seed (M)
Slot: 1 (lead)
Level: 85
Ability: Unburden
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe
- Acrobatics
- Close Combat
- Stone Edge
- Encore

Iron Valiant @ Life Orb
Slot: 2
Level: 85
Ability: Quark Drive
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe
- Moonblast
- Close Combat
- Vacuum Wave
- Knock Off

Kingambit @ Darkinium Z (M)
Slot: 3
Level: 85
Ability: Supreme Overlord
Gimmick: Z-Move: Black Hole Eclipse
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe
- Kowtow Cleave
- Iron Head
- Low Kick
- Sucker Punch

Ursaluna-Bloodmoon @ Leftovers (M)
Slot: 4
Level: 85
Ability: Mind's Eye
Tera Type: Normal
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe
- Blood Moon
- Earth Power
- Vacuum Wave
- Moonlight

Metagross @ Metagrossite
Slot: 5
Level: 85
Ability: Clear Body
Gimmick: Mega Evolution (Metagrossite)
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe
- Meteor Mash
- Zen Headbutt
- Bullet Punch
- Stomping Tantrum

Arceus @ Life Orb
Slot: 6
Level: 85
Ability: Multitype
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe
- Judgment
- Spacial Rend
- Earth Power
- Recover

```

## Installation and verification

Use the Modrinth App's instance folder (see the main [README](README.md)). Put `rejuvenation-fields-base-0.1.zip`, `rejuvenation-fields-cobbleverse-0.1.zip` and **one** of `rejuvenation-fields-cobbleverse-classic-0.1.zip` / `rejuvenation-fields-cobbleverse-hardcore-0.1.zip` in `datapacks`. To switch variant, delete the one you have and add the other, then restart the world. The league roster zip must sort after `COBBLEVERSE-RCT-DP-v20.zip` so its trainer files override the originals; Global Packs' alphabetical order does that. An already spawned trainer may keep its old team; use a newly spawned gym NPC or a new world.

Validated offline against the installed Showdown simulator and the field engine: every species and form, item, move, ability, nature, level, IV and EV spread, complete teams and field starts; the declared Tera choices; Mega Evolution; Z-Moves and Ultra Burst; Misty's Dive transition; and that every file is identical to the pre-split roster override. 1208 checks passed. These rosters have not been tested in live Minecraft battles.

Validation receipt: `research/test-results/kanto-gyms-simulator-hardcore.json`. Full-battle simulation: `research/test-results/kanto-fights-simulation-hardcore.json`.
