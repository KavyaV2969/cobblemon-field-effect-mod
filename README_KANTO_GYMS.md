# Complete Kanto league roster overrides

Installed in `rejuvenation-fields-cobbleverse-0.1.zip`, the existing COBBLEVERSE extension datapack. Updated 2026-10-08.

All 78 league Pokemon have **31 IVs in all six stats**. Every replacement team uses its trainer cap for every member. Lt. Surge keeps his existing team: level 36 except Rotom-Wash at 35. All Elite Four and Champion Pokemon are level 85. EVs, abilities, natures, moves, forms, held items and declared Tera types follow the supplied sets.

The cap before each fight equals the next required trainer's highest level (`relativeLevelCap = 0`). Sabrina precedes Koga. All trainers use singles except Giovanni, who retains the existing doubles format. Trainers retain Run & Bun AI and their existing item-use limits and Full Restore bags.

Blue's requested spreads use **252 EVs in all six stats (1512 total)**. RCT/Cobblemon normally limits total EVs to 510. The accompanying updated compat mod restores these spreads only for NPC teams tagged `kanto_champion_blue`, including copies created for battle. Player Pokemon and other trainers retain normal EV limits. The datapack and updated compat jar must be installed together for Blue's full spreads.

## Progression, level caps and fields

| Stage | Trainer | Level cap | Starting field |
|---|---|---:|---|
| 1 | Brock | 16 | Crystal Cavern |
| 2 | Misty | 28 | Water Surface → Underwater via Dive |
| 3 | Lt. Surge | 36 | Murkwater Surface |
| 4 | Erika | 44 | Warped Forest |
| 5 | Sabrina | 59 | Psychic Terrain |
| 6 | Koga | 68 | Wasteland |
| 7 | Blaine | 76 | Crimson Forest |
| 8 | Giovanni | 81 | Deep Dark |
| Elite Four | Lorelei | 85 | Frozen Dimensional Field |
| Elite Four | Bruno | 85 | Colosseum |
| Elite Four | Agatha | 85 | Haunted Field |
| Elite Four | Lance | 85 | Dragon's Den |
| Champion | Blue | 85 | New World |

## Battle mechanics

- Misty starts on Water Surface. Gyarados's Dive uses the existing field transition to pull the battle Underwater.
- Each league trainer has exactly one permitted Tera user. The corrected gyms retain Sneasler (Dark), Chien-Pao (Dark) and Ogerpon-Hearthflame (Fire). The new teams use Arctovish (Water), Terrakion (Fighting), Ceruledge (Fire), Roaring Moon (Flying) and Ursaluna-Bloodmoon (Normal). Each side still has one Tera use per battle.
- Mega holders use the existing NPC Mega policy. Kommo-o holds Kommonium Z for Clangorous Soulblaze. Ogerpon starts in its Hearthflame form and may use Fire Tera to activate Embody Aspect.
- Dynamax and Gigantamax are disabled for all league teams. Lance's Necrozma starts as Dusk Mane with Ultranecrozium Z for Ultra Burst; Blue's Kingambit has Darkinium Z.
- Lunatone explicitly has Hidden Power Ground and 31 IVs in every stat. The installed simulator accepts that typed move without reducing IVs.
- Hydreigon starts with Levitate; consuming its Magical Seed on Deep Dark applies the existing field effect that changes its active ability to Soundproof.

- New World retains its existing Multitype effects, which can change Arceus's active form and Judgment type during battle.

## Complete gym, Elite Four and Champion rosters

### Brock — Crystal Cavern — cap 16

```text
Geodude-Alola
Level: 16
Ability: Sturdy
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 HP / 124 Atk
- Stealth Rock
- Rock Tomb
- Spark
- Self-Destruct

Archen @ Berry Juice
Level: 16
Ability: Defeatist
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 Atk / 124 Spe
- Rock Tomb
- Wing Attack
- U-turn
- Quick Attack

Lileep @ Big Root
Level: 16
Ability: Storm Drain
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 HP / 124 Def
- Ancient Power
- Mega Drain
- Recover
- Stockpile

Sableye @ Roseli Berry
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
Level: 16
Ability: Levitate
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 128 SpA / 124 Spe
- Ancient Power
- Psybeam
- Icy Wind
- Hidden Power Ground

Tirtouga @ White Herb
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

### Misty — Water Surface → Underwater — cap 28

```text
Vaporeon @ Elemental Seed
Level: 28
Ability: Water Absorb
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Def / 4 SpD
- Wish
- Toxic
- Scald
- Protect

Togekiss @ Wacan Berry
Level: 28
Ability: Serene Grace
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 4 SpA / 252 Spe
- Air Slash
- Aura Sphere
- Roost
- Dazzling Gleam

Quagsire @ Rindo Berry
Level: 28
Ability: Water Absorb
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 128 Def / 128 SpD
- Muddy Water
- Recover
- Ice Beam
- Haze

Floatzel @ Mystic Water
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

Lanturn @ Sitrus Berry
Level: 28
Ability: Volt Absorb
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 SpA / 4 SpD
- Discharge
- Volt Switch
- Ice Beam
- Scald

Gyarados @ Gyaradosite
Level: 28
Ability: Intimidate
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 HP / 252 Atk / 252 Spe
- Dive
- Waterfall
- Crunch
- Dragon Dance

```

### Lt. Surge — Murkwater Surface — cap 36

```text
Raichu-Alola @ Wise Glasses
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
Level: 36
Ability: Quark Drive
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk
- Swords Dance
- Drain Punch
- Thunder Punch
- Ice Punch

Archaludon @ Power Herb
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
Level: 35
Ability: Levitate
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 SpA
- Hydro Pump
- Volt Switch
- Will-O-Wisp
- Thunderbolt

Eelektross @ eelektrossite
Level: 36
Ability: Levitate
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 252 Spe
- Wild Charge
- Drain Punch
- Knock Off
- Coil

```

### Erika — Warped Forest — cap 44

```text
Ting-Lu @ Magical Seed
Level: 44
Ability: Vessel of Ruin
Nature: Careful
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 4 Def / 252 SpD
- Stealth Rock
- Earthquake
- Ruination
- Whirlwind

Serperior @ Leftovers
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
Level: 44
Ability: Beast Boost
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Leaf Blade
- Smart Strike
- Knock Off
- Sacred Sword

Meowscarada @ Choice Scarf
Level: 44
Ability: Protean
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 Def / 252 Spe
- Knock Off
- U-turn
- Low Kick
- Flower Trick

Ogerpon-Hearthflame @ Hearthflame Mask
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

Venusaur @ Venusaurite
Level: 44
Ability: Chlorophyll
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 248 HP / 100 Def / 140 SpD / 20 Spe
- Giga Drain
- Sludge Bomb
- Leech Seed
- Earth Power

```

### Sabrina — Psychic Terrain — cap 59

```text
Delphox @ Magical Seed
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
Level: 59
Ability: Clear Body
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 4 SpD
- Psychic Fangs
- Meteor Mash
- Earthquake
- Knock Off

Armarouge @ Colbur Berry
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
Level: 59
Ability: Quark Drive
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Moonblast
- Focus Blast
- Psyshock
- Shadow Ball

Espathra @ Leftovers
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

Alakazam @ Alakazite
Level: 59
Ability: Magic Guard
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Calm Mind
- Psychic
- Focus Blast
- Recover

```

### Koga — Wasteland — cap 68

```text
Glimmora @ Focus Sash
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
Level: 68
Ability: Poison Puppeteer
Nature: Bold
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 228 Def / 28 Spe
- Parting Shot
- Recover
- Malignant Chain
- Shadow Ball

Sneasler @ Telluric Seed
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
Level: 68
Ability: Beast Boost
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 SpA / 4 SpD / 252 Spe
- Nasty Plot
- Draco Meteor
- Sludge Bomb
- Fire Blast

Cinderace @ Life Orb
Level: 68
Ability: Libero
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Gunk Shot
- Pyro Ball
- U-turn
- Sucker Punch

Gengar @ Gengarite
Level: 68
Ability: Cursed Body
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Venoshock
- Shadow Ball
- Focus Blast
- Energy Ball

```

### Blaine — Crimson Forest — cap 76

```text
Gouging Fire @ Loaded Dice
Level: 76
Ability: Protosynthesis
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 HP / 252 Atk / 252 Spe
- Dragon Dance
- Heat Crash
- Scale Shot
- Earthquake

Heatran @ Leftovers
Level: 76
Ability: Flash Fire
Nature: Calm
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 4 SpA / 252 SpD
- Magma Storm
- Earth Power
- Toxic
- Protect

Blaziken @ Focus Sash
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

Charizard @ Charizardite Y
Level: 76
Ability: Blaze
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Weather Ball
- Solar Beam
- Focus Blast
- Roost

```

### Giovanni — Deep Dark — cap 81

```text
Marshadow @ Life Orb
Level: 81
Ability: Technician
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Spectral Thief
- Close Combat
- Shadow Sneak
- Bulk Up

Rhyperior @ Assault Vest
Level: 81
Ability: Solid Rock
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 4 SpD
- Earthquake
- Stone Edge
- Megahorn
- Ice Punch

Kommo-o @ Kommonium Z
Level: 81
Ability: Soundproof
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Clanging Scales
- Aura Sphere
- Flamethrower
- Flash Cannon

Chien-Pao @ Focus Sash
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

Hydreigon @ Magical Seed
Level: 81
Ability: Levitate
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Dark Pulse
- Draco Meteor
- Flamethrower
- Earth Power

Tyranitar @ Tyranitarite
Level: 81
Ability: Sand Stream
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Crunch
- Stone Edge
- Ice Punch

```

### Lorelei — Frozen Dimensional Field — cap 85

```text
Arctovish @ Choice Band
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
Level: 85
Ability: Quark Drive
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Aurora Veil
- Freeze-Dry
- Hydro Pump
- Flip Turn

Greninja @ Life Orb
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
Level: 85
Ability: As One (Glastrier)
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Glacial Lance
- High Horsepower
- Close Combat
- Swords Dance

Baxcalibur @ baxcalibrite
Level: 85
Ability: Thermal Exchange
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Icicle Crash
- Glaive Rush
- Earthquake

```

### Bruno — Colosseum — cap 85

```text
Gallade @ Synthetic Seed
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
Level: 85
Ability: Justified
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Secret Sword
- Hydro Pump
- Icy Wind
- Air Slash

Cloyster @ White Herb
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
Level: 85
Ability: Dauntless Shield
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 Def / 252 Spe
- Body Press
- Behemoth Bash
- Crunch
- Roar

Lucario @ Lucarionite
Level: 85
Ability: Justified
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Swords Dance
- Meteor Mash
- Close Combat
- Bullet Punch

```

### Agatha — Haunted Field — cap 85

```text
Dragapult @ Choice Band
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
Level: 85
Ability: Protosynthesis
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Shadow Ball
- Moonblast
- Mystical Fire
- Psyshock

Ceruledge @ Focus Sash
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
Level: 85
Ability: As One (Spectrier)
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Nasty Plot
- Astral Barrage
- Psyshock
- Draining Kiss

Gengar @ Gengarite
Level: 85
Ability: Cursed Body
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 4 Def / 252 SpA / 252 Spe
- Hypnosis
- Hex
- Focus Blast
- Destiny Bond

Basculegion @ Choice Scarf
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

### Lance — Dragon's Den — cap 85

```text
Archaludon @ Elemental Seed
Level: 85
Ability: Stamina
Nature: Modest
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 4 Def / 252 SpA
- Draco Meteor
- Earth Power
- Flash Cannon
- Body Press

Haxorus @ Loaded Dice
Level: 85
Ability: Mold Breaker
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Scale Shot
- Earthquake
- Poison Jab

Latios @ Soul Dew
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
Level: 85
Ability: Prism Armor
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Photon Geyser
- Dragon Claw
- Earthquake

Dragonite @ dragoninite
Level: 85
Ability: Multiscale
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 Atk / 4 SpD / 252 Spe
- Dragon Dance
- Dragon Rush
- Fire Punch
- Earthquake

```

### Blue — New World — cap 85

```text
Hawlucha @ Magical Seed
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
Level: 85
Ability: Quark Drive
Nature: Timid
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe
- Moonblast
- Close Combat
- Vacuum Wave
- Knock Off

Kingambit @ Darkinium Z
Level: 85
Ability: Supreme Overlord
Nature: Adamant
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe
- Kowtow Cleave
- Iron Head
- Low Kick
- Sucker Punch

Ursaluna-Bloodmoon @ Leftovers
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
Level: 85
Ability: Clear Body
Nature: Jolly
IVs: 31 HP / 31 Atk / 31 Def / 31 SpA / 31 SpD / 31 Spe
EVs: 252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe
- Meteor Mash
- Zen Headbutt
- Bullet Punch
- Stomping Tantrum

Arceus @ Life Orb
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

The updated archive replaces the existing same-named pack in the profile's `datapacks/` folder. Keep the Rejuvenation base pack and core/compat mods enabled. Load this extension after `COBBLEVERSE-RCT-DP-v20.zip` and `COBBLEVERSE-DP-v31.zip` so its resources override the originals. Global Packs already requires the profile's datapacks folder. The saved New World enabled-pack list was read and confirms this override order.

Restart Minecraft and load the world to use the shipped definitions. `/datapack list enabled` can confirm the extension is enabled. An existing spawned trainer may have cached its old team; use a newly spawned/recreated gym NPC if necessary.

Original COBBLEVERSE archives, league progression requirements, Surge's team and gym structure, and other extension resources are preserved. All 13 team files and requested field assignments are packaged in the existing extension.

Validated offline against the installed Showdown simulator and the authored field engine: all species/forms, items, moves, abilities, natures, levels, IVs, EVs, complete teams and field starts; declared Tera choices; Mega evolution; Kommo-o's Z-Move; Misty's Dive transition. 1100 checks passed. These changes have not been tested in live Minecraft gym battles.

Validation receipt: `rejuvenation/research/test-results/kanto-gyms-simulator.json`. Installation receipt and backup location: `rejuvenation/research/test-results/kanto-gyms-install.json`.
