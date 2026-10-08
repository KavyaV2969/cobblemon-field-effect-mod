# Configuration overrides

Files here are copied into a modpack's `config/` folder to change two base-COBBLEVERSE behaviours that no mod or data pack can change: the **level cap system** and which Pokémon **Poké Snacks** can attract. They are not part of the mod jars or data packs.

| File | Copy to | What it sets |
|---|---|---|
| `rctmod-server.toml` | `config/rctmod-server.toml` | The Radical Cobblemon Trainers (RCT API) server settings, including the level cap |
| `lumymon.json` | `config/lumymon.json` | LumyMon's Poké Snack spawn blacklist (switched off) |

## Level cap settings (`[Players]` section)

* `initialLevelCap = 16` is the cap a player starts with. Pokémon at or above the cap gain no experience. RCT never lets it go below the level cap of the first trainer of the series.
* `relativeLevelCap = 0` is the **level cap offset**. A player's cap is the level of the strongest Pokémon of their next required trainer in the series, plus this value (it can be negative). For example, with a Pikachu at level 50 on the next trainer's team and an offset of `0`, the cap is 50.
* `initialSeries = "kanto"` is the series new players start in, and `allowOverLeveling = false` keeps the cap enforced.

The rest of the file is the pack's RCT tuning (trainer spawning and forced battles); keep it as is, or copy only the `[Players]` section into an existing `rctmod-server.toml`. The trainer series themselves come from the COBBLEVERSE RCT data pack, not from this repository.

Restart the server after changing the file.

## Poké Snack settings (`lumymon.json`)

LumyMon ships Poké Snack blacklist groups (`custom`, `legendary`, `mythical`, `paradox` and `ultrabeast`; they are data files inside the jar). `enablePokeSnackBlacklist` turns the blacklist on or off, and `blacklistedPokeSnackSpawns` names the groups that Poké Snacks may **not** attract while it is on.

This file sets `enablePokeSnackBlacklist = false`, so **the blacklist is off and legendary, mythical, ultra beast, paradox and custom Pokémon are no longer blocked from Poké Snack spawns**. Set it back to `true` to block the groups listed in `blacklistedPokeSnackSpawns` (`custom` and `paradox`; add `"legendary"` and so on to block those too). The other values in the file are LumyMon's own settings, copied unchanged.

Restart the game after changing the file.
