<div align="center">

# Rejuvenation Fields

**The Field Effect system from Pokémon Rejuvenation, brought to Cobblemon.**

![Minecraft 1.21.1](https://img.shields.io/badge/Minecraft-1.21.1-62b47a?style=flat-square)
![Fabric](https://img.shields.io/badge/Loader-Fabric-dbd0b4?style=flat-square)
![Cobblemon 1.7.3](https://img.shields.io/badge/Cobblemon-1.7.3-e8554e?style=flat-square)
![COBBLEVERSE 1.7.42](https://img.shields.io/badge/COBBLEVERSE-1.7.42-7e57c2?style=flat-square)
![61 fields](https://img.shields.io/badge/Fields-61-3f8fd2?style=flat-square)

[Install it](#install-guide-for-everyone) · [Everything you need](#everything-you-need) · [The Kanto challenge](#the-updated-kanto-challenge) · [Fields](#61-battle-fields) · [Known issues](#known-limitations)

</div>

---

A mod porting the field system from rejuvenation into cobblemon. Forests, caves, oceans, villages, Ancient Cities, Nether biomes and other environments assign different **battle fields**, which modify moves, abilities, types, weather, terrain, status effects and other battle mechanics.

The mod implements **all 57 fields from Pokémon Rejuvenation 14.0.14** plus **4 custom Minecraft-inspired fields**, **61 fields** in total. It also ships a much harder **Kanto Gym, Elite Four and Champion challenge** built on those fields, and a trainer AI that actually understands them.

This is the first public release. It is mostly complete and functional, but treat it as a **public playtest**: there may still be bugs.

<table>
  <tr>
    <td width="50%"><img src="https://github.com/user-attachments/assets/18bd3eb9-26a8-417c-addc-c301b5918285" alt="Underwater" /><br /><sub><b>Underwater.</b> Water Pulse gets "Jet-streamed!" in a naturally submerged battle.</sub></td>
    <td width="50%"><img src="https://github.com/user-attachments/assets/4d296b88-6f67-411e-9f66-ca38634edd0c" alt="The End" /><br /><sub><b>The End.</b> New World, with a shiny Rayquaza's Air Lock message.</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="https://github.com/user-attachments/assets/9248799f-0c7c-4c63-a38b-55dfaf702633" alt="Deep Dark" /><br /><sub><b>Deep Dark.</b> Two Boombursts and the sculk retaliates.</sub></td>
    <td width="50%"><img src="https://github.com/user-attachments/assets/5f939aa4-099c-4725-807c-b8a1ebc25500" alt="Warped Forest" /><br /><sub><b>Warped Forest.</b> Leaf Blade gains the field's altered typing.</sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="https://github.com/user-attachments/assets/78fce346-c501-4595-adf6-7976adb33a27" alt="Lt. Surge" /><br /><sub><b>Lt. Surge.</b> Murkwater Surface boosts Water Pulse, then poisons the swimmer.</sub></td>
    <td width="50%"><img src="https://github.com/user-attachments/assets/8f464a3e-1093-4c20-ad74-5fe33bcea811" alt="Mountain" /><br /><sub><b>Mountain.</b> Tailwind's Strong Winds boost Icy Wind.</sub></td>
  </tr>
</table>

---

## Install guide for everyone

You do **not** need to know anything technical. This takes about ten minutes and uses only the [Modrinth App](https://modrinth.com/app) (a free launcher) and your file explorer.

> **What you will end up with:** COBBLEVERSE 1.7.42, plus three extra mods, two data packs and two small settings files. The full list with links is in [Everything you need](#everything-you-need).

### Step 1. Install COBBLEVERSE 1.7.42

1. Open the Modrinth App and install **[COBBLEVERSE – Pokémon Adventure [Cobblemon]](https://modrinth.com/modpack/cobbleverse)**. Choose **version [1.7.42](https://modrinth.com/modpack/cobbleverse/version/1.7.42)**.
2. Start it once and let it reach the title screen, then close the game. This creates all the folders used below.

### Step 2. Open the instance folder

In the Modrinth App, open your COBBLEVERSE instance and click the **folder icon** (Open folder) at the top. A file-explorer window opens. This is your *instance folder*; every folder named below is inside it. It contains folders called `mods`, `config` and `datapacks`.

### Step 3. Download the files

Everything of mine is on the **[Releases page](https://github.com/KavyaV2969/cobblemon-field-effect-mod/releases/latest)**. Download these four files:

| File | What it is |
|---|---|
| `rejuvenation-fields-0.1.jar` | The mod itself |
| `rejuvenation-fields-compat-0.1.jar` | Makes the trainer AI understand fields |
| `rejuvenation-fields-base-0.1.zip` | The 61 fields (a data pack) |
| `rejuvenation-fields-cobbleverse-0.1.zip` | COBBLEVERSE mappings and the Kanto challenge (a data pack) |

Also download the trainer AI mod, which is **not** part of COBBLEVERSE:

| File | Download |
|---|---|
| `rbrctai-fabric-1.21.1-0.16.0-beta.jar` | **[Cobblemon: Run & Bun (Advanced Trainer AI)](https://modrinth.com/mod/KWljXemF/version/0.16.0-beta)**, the Fabric 1.21.1 file |

And the two settings files from this repository: [`rctmod-server.toml`](config-overrides/rctmod-server.toml) and [`lumymon.json`](config-overrides/lumymon.json). On each page click the **download** icon at the top right of the file.

### Step 4. Put each file in its folder

Do **not** unzip anything. Drag the files as they are.

| Put this file... | ...in this folder of your instance |
|---|---|
| `rejuvenation-fields-0.1.jar` | `mods` |
| `rejuvenation-fields-compat-0.1.jar` | `mods` |
| `rbrctai-fabric-1.21.1-0.16.0-beta.jar` | `mods` |
| `rejuvenation-fields-base-0.1.zip` | `datapacks` |
| `rejuvenation-fields-cobbleverse-0.1.zip` | `datapacks` |
| `rctmod-server.toml` | `config` (say **Replace** when asked) |
| `lumymon.json` | `config` (say **Replace** when asked) |

When you are done it looks like this:

```text
COBBLEVERSE instance folder
├── mods
│   ├── rejuvenation-fields-0.1.jar
│   ├── rejuvenation-fields-compat-0.1.jar
│   ├── rbrctai-fabric-1.21.1-0.16.0-beta.jar
│   └── ... (the rest of COBBLEVERSE)
├── datapacks
│   ├── COBBLEVERSE-DP-v31.zip            (came with COBBLEVERSE)
│   ├── COBBLEVERSE-RCT-DP-v20.zip        (came with COBBLEVERSE)
│   ├── rejuvenation-fields-base-0.1.zip
│   └── rejuvenation-fields-cobbleverse-0.1.zip
└── config
    ├── rctmod-server.toml
    └── lumymon.json
```

COBBLEVERSE uses the *Global Packs* mod, which loads every zip in `datapacks` for **all** worlds, old and new. You do not need to enable anything inside Minecraft. The data pack names sort after COBBLEVERSE's own packs, which is the load order they need.

### Step 5. Start the game and check

1. Launch COBBLEVERSE and open or create a world.
2. Enter a Pokémon battle. A small **field panel** appears above the battle log. Click it to read the **Field Notes**.
3. To double-check, press `T` and type `/datapack list enabled` (this needs cheats on in a single-player world). You should see both `rejuvenation-fields` zips in the list. The game log (`logs/latest.log`) contains `Loaded 61 fields`.

> **Already-spawned gym trainers** keep the team they were created with. If a Kanto trainer still has an old team, let a fresh one spawn or use a new world.

### If something goes wrong

- **The game crashes on start.** Check that all three jars are in `mods` and that you used the Fabric 1.21.1 build of Run & Bun AI.
- **No field panel.** The mod jar is missing, or the base data pack is not in `datapacks` (and not unzipped).
- **Trainers feel unchanged.** The `cobbleverse` data pack and the compat jar must both be present.
- **Updating COBBLEVERSE later** can replace the two settings files. Copy them in again afterwards.
- **Running a server?** Do the same on the server: the same folders, then restart. Every player also needs the three mods.
- **Used the old private 0.2.0 build?** Delete its jar, its field data pack and its `rejuvenation-gym-overrides` pack first ([migration notes](docs/MIGRATION.md)).

---

## Everything you need

### Mods

| Mod | Version | You add it? | What it does here | Link |
|---|---|---|---|---|
| COBBLEVERSE (modpack) | 1.7.42 | Install first | The base game | [Modrinth](https://modrinth.com/modpack/cobbleverse) |
| **Rejuvenation Fields** | 0.1 | **Yes** → `mods` | Field engine, field panel, Field Notes, items, recipes | [Releases](https://github.com/KavyaV2969/cobblemon-field-effect-mod/releases/latest) |
| **Rejuvenation Fields: Compat** | 0.1 | **Yes** → `mods` | Trainer AI scoring, NPC Mega/Tera policy, Battle Extras previews | [Releases](https://github.com/KavyaV2969/cobblemon-field-effect-mod/releases/latest) |
| **Cobblemon: Run & Bun (Advanced Trainer AI)** | 0.16.0-beta | **Yes** → `mods` | The Run & Bun trainer AI the gym trainers use | [Modrinth](https://modrinth.com/mod/KWljXemF/version/0.16.0-beta) |
| Cobblemon | 1.7.3+1.21.1 | Included | The Pokémon mod | [Modrinth](https://modrinth.com/mod/cobblemon) |
| Fabric API | 0.116.6 or newer | Included | Required by Fabric mods | [Modrinth](https://modrinth.com/mod/fabric-api) |
| Radical Cobblemon Trainers | 0.18.1-beta | Included | Trainers, series and the level cap | [Modrinth](https://modrinth.com/mod/rctmod) |
| Radical Cobblemon Trainers API | 0.15.2-beta | Included | Trainer registry and battle AI base | [Modrinth](https://modrinth.com/mod/rctapi) |
| Cobblemon: Mega Showdown | 1.8.4 | Included | Mega Stones, Z-Moves and more | [Modrinth](https://modrinth.com/mod/cobblemon-mega-showdown) |
| Global Packs | 21.0.6 | Included | Loads the `datapacks` folder in every world | [Modrinth](https://modrinth.com/mod/globalpacks) |
| Cobblemon Battle Extras | 1.13.45 | Included, optional | Field-aware move previews when present | [Modrinth](https://modrinth.com/mod/cobblemon-battle-extras) |

"Included" means the COBBLEVERSE 1.7.42 install this was built and tested against already contains it, so there is nothing to do. The links are only for reference. Keep the **Radical Cobblemon Trainers**, **API** and **Run & Bun** versions shown: the compat mod was checked against exactly those files, and a newer one may stop it from attaching.

### Data packs

| Data pack | You add it? | What it does | Link |
|---|---|---|---|
| `rejuvenation-fields-base-0.1.zip` | **Yes** → `datapacks` | The 61 fields, Field Notes, items, and every biome and structure mapping that plain Minecraft and Cobblemon support. **Required.** | [Releases](https://github.com/KavyaV2969/cobblemon-field-effect-mod/releases/latest) |
| `rejuvenation-fields-cobbleverse-0.1.zip` | **Yes** → `datapacks` | Mappings for COBBLEVERSE's other mods, the 13 rebuilt Kanto league teams and their fields, and the Lt. Surge gym. Needs the base pack. | [Releases](https://github.com/KavyaV2969/cobblemon-field-effect-mod/releases/latest) |
| `COBBLEVERSE-DP-v31.zip`, `COBBLEVERSE-RCT-DP-v20.zip` and the other COBBLEVERSE packs | Included | COBBLEVERSE's own content and trainer series | [Modrinth](https://modrinth.com/modpack/cobbleverse) |

### Settings changed from stock COBBLEVERSE

Two behaviours of the base pack cannot be changed by a mod or data pack, so they are changed in a settings file. Both files are in [`config-overrides`](config-overrides/README.md) and go in your `config` folder (Step 4).

| Change | File | Setting |
|---|---|---|
| **Starting level cap.** Pokémon at or above the cap gain no experience. | `config/rctmod-server.toml`, `[Players]` | `initialLevelCap = 16` (stock: 20), `relativeLevelCap = 0` (stock: 5; your cap is the level of your next required trainer's strongest Pokémon plus this value), `initialSeries = "kanto"`, `allowOverLeveling = false` |
| **Poké Snacks are no longer restricted by LumyMon's blacklist.** | `config/lumymon.json` | `enablePokeSnackBlacklist = false` (stock: `true`). Stock COBBLEVERSE blocks the `custom` and `paradox` groups from Poké Snack spawns; with the blacklist off, nothing is blocked. Legendary, mythical and ultra beast Pokémon were not on that list. Set it back to `true` to restore the blocking. |

Both files are identical to COBBLEVERSE 1.7.42's own copies apart from the lines above (checked against the pack file), so replacing them only changes those settings. If you have edited either file yourself, copy just those lines instead. Details: [config-overrides](config-overrides/README.md).

### Requirements

- Minecraft **1.21.1**, Fabric Loader **0.17.2+**, Fabric API **0.116.6+**, Cobblemon **1.7.3+1.21.1**, Java **21** (the Modrinth App sets this up for you).
- Without COBBLEVERSE the mod and base data pack still work with plain Cobblemon, but the Kanto challenge and trainer features need the COBBLEVERSE setup above.
- No Pokémon Rejuvenation game files are needed.

---

## 61 Battle Fields

All **57 existing Pokémon Rejuvenation fields** are implemented and mapped across Minecraft environments where possible, plus four custom fields for biomes that did not fit an existing one: **Deep Dark, Pale Garden, Crimson Forest and Warped Forest**.

Fields can affect move power, move typing, abilities, weather, terrain, status effects, field transformations, held items and field-specific counters. The original Rejuvenation battle messages and flavor text are included where they apply. Coverage details: [FIELD_COVERAGE.md](docs/FIELD_COVERAGE.md).

### Field selection

Natural battles pick their field from where the battle starts, in roughly this order:

**Explicit/Trainer field → Underwater → Structure → Biome → Default**

Structures such as villages, Woodland Mansions, Bastions, Nether Fortresses and Ancient Cities can have their own mappings. Some environments are layered: a frozen ocean starts as an icy surface that can melt and reveal the field underneath.

See [Field Selection](docs/FIELD_SELECTION.md), [Biome Mappings](docs/BIOME_MAPPING.md) and [Environment Layers](docs/ENVIRONMENT_LAYERS.md).

### Field panel and Field Notes

A panel above the battle log shows the active field. Clicking it opens **Field Notes** with that field's mechanics. The notes for the original 57 fields are based on the Pokémon Rejuvenation Wiki and are used under CC BY-SA 4.0.

<table>
  <tr>
    <td width="50%"><img src="docs/images/field-panel-city.png" alt="Field panel showing the City field" /><br /><sub><b>The field panel</b> sits above the battle log.</sub></td>
    <td width="50%"><img src="docs/images/field-notes-back-alley.png" alt="Field Notes for Back Alley" /><br /><sub><b>Field Notes</b> open on click and explain the field right now.</sub></td>
  </tr>
</table>

See [Field Panel](docs/FIELD_PANEL.md), [Field Notes](docs/FIELD_NOTES.md) and the [full notes](field-notes/FIELD_NOTES.md).

### New items

The four Rejuvenation Seeds and the **Amplifield Rock** are added with their original icons. I could not program proper crop growth for the seeds, so they are crafted instead. Surround any vanilla Cobblemon terrain seed with:

| Material | Result |
|---|---|
| 4 Glowstone | Elemental Seed |
| 4 Redstone | Synthetic Seed |
| 4 Gunpowder | Telluric Seed |
| 4 Amethyst Shards | Magical Seed |

Surround any weather-extending rock (Damp Rock, Heat Rock, Icy Rock or Smooth Rock) with **4 Everstones** to make the **Amplifield Rock**.

### Custom Minecraft fields

<details>
<summary><b>Deep Dark</b>: a Sculk Shrieker warning system as a battle mechanic</summary>

The warning level rises from high base-power attacks, sound-based moves and seismic attacks. Calming moves such as **Calm Mind** and **Meditate** lower it. Reaching the final warning makes the field deal max-HP-based damage and reset. Ghost-types, Soundproof, Solid Rock and Punk Rock Pokémon are protected. The field boosts Ghost and Dark moves, slightly boosts Rock and Ground moves, and halves Fairy moves.
</details>

<details>
<summary><b>Pale Garden</b>: based on Bewitched Woods, with a "keep your eyes open" warning</summary>

Using attacking moves over and over distracts the Pokémon and eventually the forest attacks back. Status moves restore focus and lower or reset the warning. It imitates the Creaking idea of needing to stay aware of your surroundings.
</details>

<details>
<summary><b>Crimson Forest</b>: Forest, Volcanic, Corrosive and Colosseum, with Piglin spectators</summary>

Getting a knockout makes the crowd roar, boosting the Pokémon's **Attack**. Pokémon with **Good as Gold** also gain Special Attack and Speed.
</details>

<details>
<summary><b>Warped Forest</b>: Dimensional, Volcanic and Forest</summary>

**Grass-type attacks gain a secondary Dark typing.**
</details>

Full specifications: [Custom Fields](docs/CUSTOM_FIELDS.md).

---

## The updated Kanto challenge

I started this project because I found the existing COBBLEVERSE gym challenge too easy. The COBBLEVERSE data pack replaces the teams of **all 13 Kanto league fights** with stronger sets and gives each its own field.

**👉 [Complete rosters, level caps and fields for every trainer](README_KANTO_LEAGUE.md)**

| Stage | Trainer | Field | Level cap |
|---|---|---|---:|
| 1 | Brock | Crystal Cavern | 16 |
| 2 | Misty | Water Surface → Underwater (via Dive) | 28 |
| 3 | Lt. Surge | Murkwater Surface | 36 |
| 4 | Erika | Warped Forest | 44 |
| 5 | Sabrina | Psychic Terrain | 59 |
| 6 | Koga | Wasteland | 68 |
| 7 | Blaine | Crimson Forest | 76 |
| 8 | Giovanni | Deep Dark | 81 |
| Elite Four | Lorelei | Frozen Dimensional Field | 85 |
| Elite Four | Bruno | Colosseum | 85 |
| Elite Four | Agatha | Haunted Field | 85 |
| Elite Four | Lance | Dragon's Den | 85 |
| Champion | Blue | New World | 85 |

- Every Gym Leader except Brock has **one Mega Evolution** and every trainer has **one Tera Pokémon**.
- All 78 Pokémon have 31 IVs and sets with exact EVs, natures, items and moves. Blue's team uses 252 EVs in every stat; the compat mod allows that for him only.
- Trainers use **Run & Bun AI**, keep their original Full Restore bags and item limits, and all fights are singles except Giovanni's doubles.
- Gym buildings were not rebuilt to look like their fields, so some immersion is lost.

The rosters have been played offline end to end: all 13 fights, 173 full battles, with no crashes, illegal choices or Mega/Tera policy violations. It also caught a trainer-AI bug (field-changing moves like Misty's Dive could not be scored against some foes), which is fixed. See [Kanto fight simulation](docs/KANTO_FIGHT_SIMULATION.md). They have **not** been tested in live Minecraft battles yet.

I probably will not make updated teams for the other four regions, but the trainer files are plain JSON and easy to edit ([Trainer Integration](docs/TRAINER_INTEGRATION.md)).

---

## Trainer AI integration

With the compat mod installed, trainers that use **Run & Bun AI** or **RCT** score moves using the active field. The AI accounts for field damage modifiers, move type changes, field interactions, terrain, weather and secondary effects, rather than just placing harder teams on fields the AI cannot read. NPC trainers also follow a shared gimmick policy: only declared Tera users use Tera, Mega Evolution happens on the first legal move, and Dynamax is off.

Cobblemon Battle Extras can use the same field engine for exact move previews.

See [Integrations](docs/INTEGRATIONS.md), [Trainer Integration](docs/TRAINER_INTEGRATION.md) and [Battle AI Policy](docs/BATTLE_AI_POLICY.md).

---

## Making your own fields

Fields are data-driven, so you usually do not need to touch the engine as long as the mechanics you want already exist in another field. Start from an existing field or the template at `research/custom-fields/_template/my_field.json`. Custom fields can define move boosts and reductions, secondary typings, ability interactions, counters, transformations, seeds, messages, and biome, structure and trainer mappings.

Guide: [Custom Field Authoring](docs/CUSTOM_FIELD_AUTHORING.md).

---

## Testing and coverage

The original Rejuvenation field scripts were the reference implementation. Every ordinary field-dependent branch found in the source audit is implemented and tested, or is a custom Rejuvenation move, crest-related, unreachable in Cobblemon, unsupported or presentation-only. This does **not** mean every interaction has been tested in live Minecraft. If something behaves differently from Rejuvenation, please report it.

See [Field Coverage](docs/FIELD_COVERAGE.md), [Testing](docs/TESTING.md), [Kanto fight simulation](docs/KANTO_FIGHT_SIMULATION.md) and [Limitations](docs/LIMITATIONS.md).

### Building from source

```bash
./gradlew check
python research/package.py
```

On Windows use `./build.ps1` instead of the first line. More in [BUILDING.md](docs/BUILDING.md) and [ARCHITECTURE.md](docs/ARCHITECTURE.md).

---

## Known limitations

- Multiplayer has not been properly tested yet. Use it on servers at your own risk.
- There may be bugs or unusual interactions the automated tests did not catch.
- Custom Rejuvenation moves, crests and other Rejuvenation-only mechanics that do not exist in Cobblemon are not implemented.
- Some presentation-only effects cannot be reproduced exactly.
- COBBLEVERSE data pack load order is relied on rather than exhaustively verified.
- Gym structures were not redesigned around their fields, apart from minor changes to Surge's Gym.

---

## Bug reports and suggestions

If you find a bug, an incorrect field interaction or something that differs from Pokémon Rejuvenation, please [open an issue](https://github.com/KavyaV2969/cobblemon-field-effect-mod/issues). Suggestions for mappings, custom fields, compatibility and balance are welcome too.

---

## License

The code and data I wrote are released under [the Unlicense](LICENSE): do whatever you want with them, no credit needed.

That does **not** cover anything that isn't mine, which stays with its original owners: Pokémon Rejuvenation's artwork and game data, the Pokémon Rejuvenation Wiki text behind the Field Notes (CC BY-SA 4.0), COBBLEVERSE's own files, and Pokémon itself. See [LICENSE-STATUS.md](LICENSE-STATUS.md) and [THIRD_PARTY.md](THIRD_PARTY.md) for the exact split.
