# Rejuvenation Fields

A Cobblemon mod that brings the **Field Effect system from Pokémon Rejuvenation** into Minecraft.

<img width="1920" height="1080" alt="06-mountains-wind-boost" src="https://github.com/user-attachments/assets/8f464a3e-1093-4c20-ad74-5fe33bcea811" />
<img width="1920" height="1080" alt="05-lt-surge-murkwater" src="https://github.com/user-attachments/assets/78fce346-c501-4595-adf6-7976adb33a27" />
<img width="1920" height="1080" alt="04-warped-forest-leaf-blade" src="https://github.com/user-attachments/assets/5f939aa4-099c-4725-807c-b8a1ebc25500" />
<img width="1920" height="1080" alt="03-deep-dark-sculk-retaliation" src="https://github.com/user-attachments/assets/9248799f-0c7c-4c63-a38b-55dfaf702633" />
<img width="1920" height="1080" alt="02-end-shiny-rayquaza" src="https://github.com/user-attachments/assets/4d296b88-6f67-411e-9f66-ca38634edd0c" />
<img width="1920" height="1080" alt="01-underwater-water-pulse" src="https://github.com/user-attachments/assets/18bd3eb9-26a8-417c-addc-c301b5918285" />


Where a battle takes place now matters. Forests, caves, oceans, villages, Ancient Cities, Nether biomes, and other environments can assign different battle fields, modifying moves, abilities, types, weather, terrain, status effects, and other battle mechanics.

The mod currently implements **all 57 fields from Pokémon Rejuvenation 14.0.14**, alongside **4 custom Minecraft-inspired fields**, for a total of **61 fields**.

This is the first public release. The mod is mostly complete and functional, but there may still be bugs, so think of this release as a sort of public playtest.



*The active field is displayed above the battle log. Clicking it opens the Field Notes.*



---

## Features

### 61 Battle Fields

All **57 existing Pokémon Rejuvenation fields** have been implemented and mapped across Minecraft environments where possible.

The mod also adds four custom fields for Minecraft biomes that didn't really fit any existing Rejuvenation field:

- Deep Dark
- Pale Garden
- Crimson Forest
- Warped Forest

Fields can affect things such as:

- Move power
- Move typing
- Abilities
- Weather
- Terrain
- Status effects
- Field transformations
- Held items
- Field-specific counters and mechanics

The original Rejuvenation battle messages and flavor text are also included where applicable.

More detailed implementation and coverage information can be found in [FIELD_COVERAGE.md](docs/FIELD_COVERAGE.md).

---

## Field Selection

Natural battles automatically determine their field based on where the battle starts.

Field selection follows roughly this priority:

**Explicit/Trainer Field → Underwater → Structure → Biome → Default**

Structures such as villages, Woodland Mansions, Bastions, Nether Fortresses, and Ancient Cities can have their own mappings separate from the surrounding biome.

Some environments also use layered fields. For example, frozen oceans can begin as an icy surface that can melt and reveal the field underneath.

See:

- [Field Selection](docs/FIELD_SELECTION.md)
- [Biome Mappings](docs/BIOME_MAPPING.md)
- [Environment Layers](docs/ENVIRONMENT_LAYERS.md)

---

## Field Panel and Field Notes

The mod adds a small panel above the battle log showing the currently active field.

Clicking the panel opens **Field Notes**, which displays the mechanics of that field.

The notes for the original 57 fields are based on the Pokémon Rejuvenation Wiki and are included under its CC BY-SA 4.0 license.

See:

- [Field Panel](docs/FIELD_PANEL.md)
- [Field Notes](docs/FIELD_NOTES.md)
- [Full Field Notes](field-notes/FIELD_NOTES.md)

---

# Installation

While the mod and accompanying datapack should work with normal Cobblemon, it is primarily intended to be played with the **COBBLEVERSE modpack**.

The currently targeted version is:

**COBBLEVERSE 1.7.42**

### Required

Install:

- `rejuvenation-fields-0.1.jar`
- `rejuvenation-fields-base-0.1.zip`

Place the mod inside your `mods/` folder.

Place the datapack inside the world's `datapacks/` folder, or load it using your datapack loader.

Make sure the datapack is actually enabled in-game. The field engine requires the datapack definitions to function.

The log should show:

```text
Loaded 61 fields
```

---

## COBBLEVERSE Setup

For the intended COBBLEVERSE experience, also install:

- `rejuvenation-fields-cobbleverse-0.1.zip`
- `rejuvenation-fields-compat-0.1.jar`

The COBBLEVERSE datapack adds mappings for the additional biomes, structures, and content included by the modpack.

The compatibility mod allows the field system to work properly with:

- Run & Bun AI (needs to be installed, does not come with cobbleverse)
- RCT trainers
- Cobblemon Battle Extras

I also recommend installing the included **gym roster override** if you want the updated Kanto Gym Challenge described below.

---

## Files

| File                                      | Purpose                                                    | Required |
| ----------------------------------------- | ---------------------------------------------------------- | -------- |
| `rejuvenation-fields-0.1.jar`             | Core field engine, UI, items and recipes                   | Yes      |
| `rejuvenation-fields-base-0.1.zip`        | All 61 fields and standard mappings                        | Yes      |
| `rejuvenation-fields-compat-0.1.jar`      | Run & Bun AI, RCT and Battle Extras compatibility          | Optional |
| `rejuvenation-fields-cobbleverse-0.1.zip` | COBBLEVERSE biome/structure mappings and trainer additions | Optional |

The core mod does **not** depend on the compatibility mod.

Each compatibility integration only loads if its corresponding mod is installed.

---

# New Items

The four Rejuvenation Seeds and the **Amplifield Rock** have been added.

I couldn't really program in proper crop logic for growing the four seeds, so they are craftable instead.

Any vanilla Cobblemon terrain seed can be surrounded by:

| Material          | Result         |
| ----------------- | -------------- |
| 4 Glowstone       | Elemental Seed |
| 4 Redstone        | Synthetic Seed |
| 4 Gunpowder       | Telluric Seed  |
| 4 Amethyst Shards | Magical Seed   |

The **Amplifield Rock** can also be crafted by surrounding any weather-extending rock with **4 Everstones**.

Supported base rocks include:

- Damp Rock
- Heat Rock
- Icy Rock
- Smooth Rock

The original Rejuvenation item icons are used.

---

# Custom Minecraft Fields

Most Minecraft biomes map surprisingly well to existing Rejuvenation fields.

There were, however, four environments that I wasn't really satisfied with using existing fields for, so I made custom ones.

## Deep Dark

The Deep Dark uses an incrementing **warning system**, similar to Minecraft's Sculk Shrieker mechanic.

The warning level increases from things such as:

- High base-power attacks
- Sound-based moves
- Seismic attacks

Calming moves such as **Calm Mind** and **Meditate** reduce the warning level.

Reaching the final warning causes the field itself to respond, dealing max HP-based damage to Pokémon before resetting the warning system.

Certain Pokémon are protected, including Pokémon that are:

- Ghost-type
- Soundproof
- Solid Rock
- Punk Rock

The field also:

- Boosts Ghost moves
- Boosts Dark moves
- Slightly boosts Rock moves
- Slightly boosts Ground moves
- Halves Fairy-type moves

The main idea is essentially turning the **Sculk Shrieker/Warden warning system into a battle mechanic**.

---

## Pale Garden

The Pale Garden is primarily based on the existing **Bewitched Woods Field**, but adds another warning mechanic.

Continuously using attacking moves causes the Pokémon to become increasingly distracted by the surrounding forest.

Eventually, the forest attacks back.

Using status moves lets the Pokémon regain focus and reduce or reset the warning.

The mechanic is basically meant to imitate the **Creaking/Weeping Angel-style idea of needing to remain aware of your surroundings**.

---

## Crimson Forest

The Crimson Forest combines elements of:

- Forest Field
- Volcanic Field
- Corrosive Field
- Colosseum Field

The central mechanic is based around the Piglins spectating the battle.

Getting a knockout causes the crowd to roar in approval, boosting the Pokémon's **Attack**.

Pokémon with **Good as Gold** receive an additional **Special Attack and Speed** boost.

---

## Warped Forest

The Warped Forest combines elements of:

- Dimensional Field
- Volcanic Field
- Forest Field

One of its main unique effects is that **Grass-type attacks gain a secondary Dark typing**.

Full specifications and validation for the custom fields can be found in:

[Custom Fields](docs/CUSTOM_FIELDS.md)

---

# Updated Kanto Gym Challenge

The main reason I started this project in the first place was because I found the existing Cobbleverse gym challenge really easy.

Alongside the field mod, I will also be releasing my **Kanto Gym roster override**, containing stronger teams and field assignments for every Kanto Gym Leader and League member.

## Gym Leaders

| Trainer   | Field             |
| --------- | ----------------- |
| Brock     | Crystal Cavern    |
| Misty     | Water Surface     |
| Lt. Surge | Murkwater Surface |
| Erika     | Warped Forest     |
| Koga      | Wasteland Field   |
| Sabrina   | Psychic Terrain   |
| Blaine    | Crimson Forest    |
| Giovanni  | Deep Dark         |

## Elite Four

| Trainer | Field                              |
| ------- | ---------------------------------- |
| Lorelei | Icy Field / Water Surface sublayer |
| Bruno   | Colosseum Field                    |
| Agatha  | Haunted Field                      |
| Lance   | Dragon's Den                       |

## Champion

| Trainer | Field     |
| ------- | --------- |
| Blue    | New World |

Every Gym Leader has:

- **One Mega Evolution**
- **One Tera Pokémon**

The intention is to make the Kanto Gym Challenge significantly closer to the sort of fights you would encounter in Rejuvenation, Reborn, or difficulty-focused Pokémon fangames.

I probably won't be making updated teams for the other four regions, but the existing trainer configs can be edited relatively easily if you want to make them yourself.

I also really can't be bothered to rebuild every gym structure to physically resemble its corresponding field, so there is unfortunately some loss of immersion during these battles.

---

# Trainer AI Integration

When the compatibility mod is installed, supported trainers using **Run & Bun AI** or **RCT** evaluate moves using the active field.

This means the AI can actually account for things such as:

- Field damage modifiers
- Move type changes
- Field interactions
- Terrain
- Weather
- Secondary effects

Rather than simply having harder teams placed onto complicated fields the AI doesn't understand.

Cobblemon Battle Extras can also use the same field engine when calculating move previews.

See:

- [Integrations](docs/INTEGRATIONS.md)
- [Trainer Integration](docs/TRAINER_INTEGRATION.md)
- [Battle AI Policy](docs/BATTLE_AI_POLICY.md)

---

# Making Your Own Fields

You can also create and assign your own fields.

The system is data-driven, so you generally don't need to modify the field engine itself as long as the mechanics you want already exist somewhere within another field.

I recommend taking an existing field as a base template and modifying it from there rather than starting entirely from scratch.

A template is available at:

```text
research/custom-fields/_template/my_field.json
```

Custom fields can define things such as:

- Move boosts
- Move reductions
- Secondary typings
- Ability interactions
- Field counters
- Field transformations
- Seeds
- Messages
- Biome mappings
- Structure mappings
- Trainer assignments

See the full guide:

[Custom Field Authoring](docs/CUSTOM_FIELD_AUTHORING.md)

---

# Requirements

### Required

- Minecraft **1.21.1**
- Fabric Loader **0.17.2+**
- Fabric API **0.116.6+**
- Cobblemon **1.7.3+1.21.1**
- Java **21**

### Optional Compatibility

The compatibility mod supports:

- Run & Bun AI (`rbrctai`)
- RCT API (`rctapi`)
- Cobblemon Battle Extras

### COBBLEVERSE

The COBBLEVERSE extension contains mappings for content from mods used by the pack, including things such as:

- Terralith
- Vanilla Backport
- Repurposed Structures
- Cobblemon Additions
- LumyMon
- Legendary Monuments
- Cobblemon Raid Dens

No Pokémon Rejuvenation game files are required at runtime.

---

# Building

Build the project using:

```bash
./gradlew check
```

or on Windows:

```powershell
./build.ps1
```

Packaging can be run with:

```bash
python research/package.py
```

More information about the repository structure, environment variables, and reproducible builds can be found in:

[BUILDING.md](docs/BUILDING.md)

The general architecture is documented in:

[ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

# Testing and Coverage

The original Rejuvenation field scripts were used as the reference implementation when reproducing the field mechanics.

Every ordinary field-dependent branch identified during the source audit is either:

- Implemented and covered by regression tests
- A custom Rejuvenation move
- Crest-related
- Unreachable in Cobblemon
- Unsupported
- Presentation-only

See:

- [Field Coverage](docs/FIELD_COVERAGE.md)
- [Testing](docs/TESTING.md)
- [Limitations](docs/LIMITATIONS.md)

This does **not** mean every possible interaction has been exhaustively tested in a live Minecraft environment.

If you encounter something behaving differently from Rejuvenation, please report it.

---

# Known Limitations

- Multiplayer has not been properly tested yet. Use it on servers at your own risk.
- There may still be bugs or unusual interactions that weren't caught by the automated tests.
- Custom Rejuvenation moves are not implemented.
- Crests and other Rejuvenation-only mechanics that do not exist in Cobblemon are not implemented.
- Some presentation-only effects from Rejuvenation cannot be reproduced exactly.
- COBBLEVERSE datapack load ordering is currently relied on rather than exhaustively verified.
- Gym structures themselves have not been redesigned around their assigned fields.

This release should therefore be treated as a **public playtest rather than a completely finished release**.

---

# Download

Download the mod, datapacks, compatibility mod, and optional gym roster override from the repository releases.

For the intended experience, I recommend:

**COBBLEVERSE 4.4.2 + Rejuvenation Fields + Run and Bun AI mod + Compatibility Mod + COBBLEVERSE Datapack + Gym Override**

---

# Bug Reports and Suggestions

If you encounter a bug, incorrect field interaction, or something that behaves differently from Pokémon Rejuvenation, feel free to open an issue.

Suggestions for field mappings, custom fields, compatibility, balance, or other improvements are also welcome.
