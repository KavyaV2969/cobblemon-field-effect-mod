# Environment layers

A real frozen sea is ice over water, not ice over nothing. Some biome rows therefore start the battle with a **substrate**: a dormant field beneath the visible one. The visible field supplies every rule; the substrate only decides what the surface turns into when it is removed.

## Model

- The simulator's field stack (`b.rejuvenation.stack`, bottom first) is initialised from the environment, not just the UI: `ShowdownMixin` passes `layers` in the battle's field options and `attach` builds `[...substrate frames, visible field]`. A substrate frame is a *context frame* (`context: true`); an ordinary backup (a temporary field's predecessor) is not.
- Only the visible field supplies mechanics: multipliers, move rules, counters, seeds, abilities and hooks of a dormant frame never run.
- **Surface removal is not transformation.** Moves that melt or break the surface (`removesSurface` on the transition) expose the frame beneath instead of moving to the transition's ordinary destination. Genuine transformations (a move that turns the whole field into something else, or a field-ending effect) are unchanged and replace the stack as before. With no substrate, the original Rejuvenation transition applies exactly as before (Icy → Cave, and so on), which keeps the oracle fixtures valid.
- Frames are bounded and validated before any battle state exists: unknown or Indoor fields, repeated fields (cycles) and more than three layers are rejected in the engine, in the Java reload and in `validate.py`.
- Whenever the visible field changes, its counters, durations, overlay-dependent state and custom state are reset exactly as for any other field change; restoration reaches the exposed field with fresh state.
- The public state sent to clients carries the stack and the substrate directly beneath the visible field, so the HUD panel, the notes overlay and the previews follow it.
- Hypothetical evaluations (previews, strategy rollouts) start from the same stack and roll back completely; the strategy and cache fingerprints include the stack, so a layered Icy never shares a cache entry with a plain one.

## Starting layers

| Biome | Field | Substrate | Why |
|---|---|---|---|
| Frozen Ocean, Deep Frozen Ocean, Frozen River | Icy | Water Surface | Ice sheet over water |
| Snowy Plains | Icy | Grassy Terrain | Snow over plains grass (the existing Plains allocation) |
| Snowy Beach | Icy | Beach | Snow over sand |
| Snowy Taiga | Icy | Forest | Taiga forest floor |
| Frozen Peaks, Snowy Slopes | Snowy Mountain | Mountain | Snow over bare rock |
| Terralith: Alpha Islands Winter, Cold Shrubland, Wintry Lowlands | Icy | Grassy Terrain | The same allocation each biome already has |
| Terralith: Snowy Cherry Grove, Snowy Maple Forest, Snowy Shield, Wintry Forest | Icy | Forest | likewise |
| Terralith: Ice Marsh | Icy | Swamp | Marsh ground under the ice |
| Terralith: Snowy Badlands | Icy | Desert | Mesa sand under the snow |
| Terralith: Frozen Cliffs, Glacial Chasm | Snowy Mountain | Mountain | Bare rock |
| any of the above, 12 or more blocks underground with no sky | Icy / Snowy Mountain | Cave | Rock around a frozen underground |

### Not layered, and why

| Biome | Reason |
|---|---|
| `minecraft:ice_spikes` | Snow blocks and packed ice run all the way down, so melting exposes no distinct ground: Icy keeps the source transition. |
| `terralith:cave/frostfire_caves` | Frozen Dimension is a combined anomaly, not an ice surface; its own Purify transition returns to Icy. |

Every other biome row is unlayered: only Icy and Snowy Mountain are surfaces laid over something else. `generate.py` refuses a frozen biome that has neither a layer nor an explicit exemption, so new rows cannot silently skip the decision. The complete rows are in [BIOME_MAPPING.md](BIOME_MAPPING.md) (the `substrate` key).

## What melts and what breaks

| Visible field | Move group | With a substrate | Without one (unchanged) |
|---|---|---|---|
| Icy | Heat Wave, Searing Shot, Flame Burst, Lava Plume, Fire Pledge, Mind Blown, Incinerate, Inferno Overdrive, Burning Jealousy, Raging Fury, Eruption, Magma Drift | exposes the substrate | Cave |
| Icy | Scald, Steam Eruption, Hydro Steam, Matcha Gotcha (counted uses) | exposes the substrate | Water Surface |
| Icy over Water Surface / Murkwater / Cave | Dive, Earthquake, Bulldoze, Fissure, Magnitude, Tectonic Rage | breaks the ice, exposing what lay beneath it | as before |
| Snowy Mountain | the heat group | exposes Mountain | Mountain |

Temporary fields and overlays started over a layered Icy restore through the same stack, and repeated freezing and melting returns to the same substrate each time (both are regression-tested).

## Battle snapshots and reloads

A battle keeps the catalog it started with (mechanics, layer frames, notes). A datapack reload mid-battle changes nothing about running battles: their stacks are plain state in the simulator, which already holds the substrate's field ID, and the next battle uses the new rows. If a reload removes a field a running battle's stack mentions, the battle's own catalog snapshot still defines it; nothing is looked up in the new catalog.

## Tests

`layer-regression.cjs` plays real moves: biome rows start the right substrate (including underground), Frozen Ocean → Water Surface and Snowy Plains → Grassy Terrain through heat and Scald, ice-breaking over water, genuine transformations that are not redirected, the original Icy → Cave unchanged, dormant frames that supply no mechanics, restoration that resets counters, clocks and custom state, temporary fields and overlays over a layered Icy, repeated freeze/melt, doubles, public state, hypothetical evaluation with full rollback, cache fingerprints, malformed stacks (unknown, Indoor, cycles, depth) and a reload fixture. `graal-regression.js` repeats the layered start, strategy rollback and melt in Cobblemon's shaded Graal.
