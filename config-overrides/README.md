# Configuration overrides

Files here are copied into a modpack's `config/` folder to set up the **level cap system** for a fresh COBBLEVERSE-style modpack. They are not part of the mod jars or data packs.

| File | Copy to | What it sets |
|---|---|---|
| `rctmod-server.toml` | `config/rctmod-server.toml` | The Radical Cobblemon Trainers (RCT API) server settings, including the level cap |

## Level cap settings (`[Players]` section)

* `initialLevelCap = 16` is the cap a player starts with. Pokémon at or above the cap gain no experience. RCT never lets it go below the level cap of the first trainer of the series.
* `relativeLevelCap = 0` is the **level cap offset**. A player's cap is the level of the strongest Pokémon of their next required trainer in the series, plus this value (it can be negative). For example, with a Pikachu at level 50 on the next trainer's team and an offset of `0`, the cap is 50.
* `initialSeries = "kanto"` is the series new players start in, and `allowOverLeveling = false` keeps the cap enforced.

The rest of the file is the pack's RCT tuning (trainer spawning and forced battles); keep it as is, or copy only the `[Players]` section into an existing `rctmod-server.toml`. The trainer series themselves come from the COBBLEVERSE RCT data pack, not from this repository.

Restart the server after changing the file.
