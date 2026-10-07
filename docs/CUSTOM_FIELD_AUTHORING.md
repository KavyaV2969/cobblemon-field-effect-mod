# Authoring a custom field

This guide takes you from an idea to a field that loads, is mapped to a biome or structure, passes validation, is tested in the real simulator and is packaged as a data pack. It uses only what the engine already offers: **no Java or JavaScript is edited and no scripts are written**. If a mechanic needs something the engine does not have (see [Limits](#limits)), the guide says so instead of working around it.

Files used below, all relative to the repository root:

| Path | What it is |
|---|---|
| `research/custom-fields/_template/my_field.json` | Copy-and-edit template (valid, loadable) |
| `research/custom-fields/_examples/mossy_ruins.json` | Complete worked example (types, moves, rules, counter + transition, composition, inheritance, seed, biome, structure, notes) |
| `research/schema/custom-field.schema.json` | Schema of the **canonical input** (not of the runtime field) |
| `research/custom_fields.py` | Builds a runtime field from a canonical input |
| `research/build_custom_pack.py` | Builds a loadable data pack from a folder of inputs |
| `research/verify_custom_pack.cjs` | Loads packs over the shipped catalog in the real field engine and plays a turn |
| `verification/src/test/js/authoring-kit.test.cjs` | Tests that prove the example's rules, seed and mapping behaviour |

## 1. Choose identity: ID, file name, display name, base field

* **ID**: `namespace:path`, lowercase, e.g. `mypack:mossy_ruins`. Use your own namespace for anything that is not part of this project; `rejuvenation:` is reserved for the 61 shipped fields. The ID is permanent: saved battles, trainer bindings and mappings refer to it.
* **File name**: `<path>.json`, so `mossy_ruins.json`. The generator rejects a file whose name differs from the ID's path.
* **`originalId`**: an internal upper-case key, unique across all inputs (`MYPACKMOSSYRUINS`). Shipped fields use their Ruby symbol (`FOREST`, `BEWITCHED`); `base` and `inherit` blocks refer to a field by this key.
* **`name`** and **`entryMessage`**: the display name and the line announced when the field starts. `specification` is the document your field implements; it must end in `_Field.md`.
* **`base`**: the field your field is built on. `INDOOR` is an empty slate (no field rules, only the universal ones). Any other `originalId` (for example `BEWITCHED`) copies that whole field, and every guard on the parent's own ID is retargeted to the new field. Pick `INDOOR` unless your field really is "that field plus a few changes". `baseExpect` pins facts about the base (`{"naturePower": "dazzlinggleam"}`): generation stops if the base drifts.

## 2. What you edit and what is generated

* **Edit**: the canonical input (`research/custom-fields/*.json` for fields shipped with the project, or any folder of your own for a separate pack).
* **Generated, never edited**: everything under `datapack/` produced by `research/generate.py`, and every pack built by `research/build_custom_pack.py`. A change made there is lost at the next build.

Two ways to ship a field:

| | Separate pack (recommended) | Shipped with the project |
|---|---|---|
| Where | any folder, built with `build_custom_pack.py` | `research/custom-fields/<path>.json` |
| Output | `<out>/pack.mcmeta`, `data/<ns>/rejuvenation/{fields,notes,mappings,structures}/…` | the base pack (`datapack/base`) |
| Effect on the project | none; the shipped catalog stays 57 + 4 = 61 | changes the shipped count; counts in tests and manifests must be updated deliberately |

The template and example live in `_template/` and `_examples/` so the generator's input glob (`research/custom-fields/*.json`, top level only) never picks them up: they cannot join the shipped catalog by accident.

## 3. Reuse parent rules without inheriting everything

`base` copies *all* of a field. For a selective fusion use `base: "INDOOR"` and an `inherit` block that names exactly the rules, ability handlers or keys you want:

```json
"inherit": [{
  "from": "FOREST",
  "rules": [{"event": "residual", "contains": ["sapsipper"], "expect": 1}],
  "abilityHandlers": ["effectspore"]
}]
```

* `contains` are texts that must all occur in the rule's compact JSON; `event` must match. **`expect` is mandatory and exact**: if the parent later gains or loses a matching rule, generation stops, so a parent change can never silently alter your field.
* Rules are copied in the parent's own order, blocks in the order you list them, then your own `rules`, then the generated Terrain Pulse rule: the result is deterministic.
* A guard such as `{"field": "rejuvenation:forest"}` inside a copied rule is **retargeted** to your field, so it still fires. Anything else that names the parent (an action that changes *to* the parent, a pledge destination) is left alone, and generation stops until you acknowledge it with `"keepParentReferences": <count>` on that selector.
* `requireGrounded: true` wraps a copied rule's condition in a grounded-user check. `abilityHandlers`, `keys` (whole parent keys such as `trapping`) and `moveRows` (`{"moves": [...], "keys": [...]}`) copy those parts verbatim, each failing loudly if the parent lacks them.

`research/test_custom_fields.py` covers the retargeting, the exact-count drift check and the declared-reference check.

## 4. Move multipliers, secondary types and STAB: do not double-count

Three different things can make a move stronger or change how it hits, and they are independent:

| Data | What it changes | Same-type bonus (STAB)? |
|---|---|---|
| `types: [{"type": "Grass", "multiplier": 1.3, …}]` | Power of every move of that type (optionally `"category": "Physical"` or `"Special"`) | no |
| `moves: {"powerwhip": {"multiplier": 1.5, …}}` | Power of one move; multiplies with the type multiplier (Power Whip above is 1.5 × 1.3 = 1.95) | no |
| `typeComposition: [{"whenTypes": ["Rock"], "add": "Grass", "condition": {...}}]` | Adds an *effectiveness-only* secondary type: the move keeps its primary type, is announced once, and is evaluated by the type chart as if it also had the added type | **never** |

STAB depends only on the move's primary type and the user's types. An added type can make a move super effective, never give its user a same-type bonus, and is never added twice (composition runs once, in order, against the types accumulated so far, at most 16 entries). The shipped Crimson Forest test `added Poison and Fire components never add same-type bonus` and the example's test show the pattern.

## 5. Hooks, seeds, messages, counters and transitions

* **Standard hooks** (`hooks`): `naturePower`, `secretPower` (move IDs), `mimicry` (a type), `secretPowerEffects` (a list such as `{"status": "brn"}`, `{"volatileStatus": "flinch"}` or `{"boosts": {"accuracy": -1}, "message": "…{1}…"}`), plus `terrainPulse: {"type": "Rock"}` which also turns Terrain Pulse into that type at 100 power. `{1}` in a message is the Pokémon's name, `{2}` the other one.
* **Rules** (`rules`): `{event, condition, actions, source}`. `event` is one of the engine's events (`residual`, `damage`, `modifyMove`, `afterMove`, `accuracy`, `priority`, `switchIn`, `setStatus`, `setWeather`, …). `condition` uses the closed condition algebra (`all`/`any`/`not`, `move`, `moveType`, `category`, `type`, `grounded`, `ability`, `item`, `field`, `overlay`, `counter`, `priority`, …) and `actions` the closed operator set (`multiply`, `heal`, `boost`, `status`, `volatile`, `message`, …). The engine **rejects an unknown event, operator or condition** at load; `verify_custom_pack.cjs` shows the exact message. `source` is mandatory text saying where the behaviour comes from.
* **Seeds** (`seed`): `item` is one of `magicalseed`, `telluricseed`, `syntheticseed`, `elementalseed`; `stats` are stage changes (−6…+6); `effect`/`duration`/`message` apply a native volatile; `seedActions` are rules' actions that run when the seed is consumed (for example `{"op": "status", "status": "ptr"}`). A seed is used on entry or when the field starts, only by a matching holder, and is not consumed while the holder is suppressed.
* **Counters and transitions** are move-row data: `"counter": {"index": 1, "amount": 1, "maximum": 3, "message": "…"}` increments one of five counters (1–5) and `"transition": {"field": "rejuvenation:swamp", "condition": {"counter": {"index": 1, "op": ">", "value": 2}}, "push": false, "message": "…"}` replaces the field when the condition holds. The example floods into a swamp after the third Surf.
* **Configured mechanics** (`mechanics`): only `sculkWarning`, `creakingDistraction` and `bloodlust` exist, with the closed set of keys the three validators accept. Field Notes counters (`notes.counters`) can only describe those (`warning` shared, `distraction` per side, maximum 1–8).

## 6. Field Notes and artwork

* **Notes** (`notes`): `summary`, `sections` (heading + lines, at most 14 sections, 40 lines each, lines up to 960 characters, plain text, no `§`, no developer vocabulary) and optional `counters`. A "Where it appears" section is added for you from your biomes and structures. Shipped notes are validated by the server and the client overlay shows them.
* **Artwork** is a client resource, not part of a data pack. For a field of your own, ship a resource pack file `assets/<namespace>/textures/gui/field/<path>.png` (512 × 288); without it the panel uses the Indoor backdrop. For a field shipped with the project, put the source image in `research/custom-artwork/originals/` and name it in the input's `artwork`; `research/custom_artwork.py` crops, resizes and records it with its hash (`REJUVENATION_ARTWORK_DIR` may point at another folder).

## 7. Map the field to a biome or structure

`biomes` lists exact biome IDs and becomes `{"biome": "…", "field": "…", "reason": "…"}` rows in `mappings/<ns>_<path>.json`. `structures` lists `{"structure": "ns:id"}` or `{"tag": "ns:tag"}` rows. A mapping row may also use `dimension`, `minDepth` (blocks below the surface), `skyVisible`, `maxY`, `submerged`, `tag` and `substrate` (a dormant layer under an ice or snow surface) if you author the mapping documents by hand. Structure rows may carry `containment`: `{"mode": "pieces"}` (inside a generated piece) or `{"mode": "footprint", "horizontal": 8, "above": 12, "below": 4}` (within that margin of the piece boxes; villages use this so streets and plazas count).

Unknown biome, structure and tag IDs are harmless: they simply never match. A row naming a field that does not exist rejects the whole reload.

## 8. Selection precedence and overlapping mappings

For a wild battle the field is chosen in this order, and the first stage that applies wins:

1. an explicit override or a trainer binding (`FieldApi`, `datapack/…/trainers`);
2. **underwater** rows (`"submerged": true`) in every dimension;
3. a **configured structure** the battle position is inside, checked row by row in document order;
4. the **biome** rows: the first row whose predicates all match, in document order;
5. the default, `rejuvenation:indoor`.

That is why an Ancient City overrides its enclosing Deep Dark biome row, and any other biome, with the Ancient City's field: structures are stage 3, biomes stage 4. Overlapping structures are resolved by row order, so the shipped structure rows are grouped Ancient City → Colosseum → Back Alley → City (most specific first). A village matches when the battle is inside the village's *footprint* (each piece's box grown by the containment margins), so a street gap two blocks from every building still selects City while a cave 15 blocks below does not.

**Row order is precedence, and rows from different files are merged deterministically**: every mapping or structure document may carry an integer `"order"` (default 0, lower is checked first); documents merge by `(order, resource ID)`, never by pack or file-system order, and rows keep their order inside a document. Give your document an `order` whenever it must sit between others: for example an exact-biome row must precede the shipped tag rows (order 300), so use a value below 300. `build_custom_pack.py --order N` sets it. If your row is *shadowed*, an earlier row matches first (see [Troubleshooting](#troubleshooting)).

## 9. Where a mapping belongs after the split

The project ships two data packs: the portable **base** (`rejuvenation-fields-base`, all 61 field definitions and every mapping that vanilla Minecraft 1.21.1, Cobblemon and Fabric API support) and the **COBBLEVERSE extension** (`rejuvenation-fields-cobbleverse`, mappings for other mods and for backported content, trainer bindings, the Lt. Surge gym). A mapping belongs to the pack of the mod that **provides** the biome or structure, not to the namespace in its ID:

* `minecraft:pale_garden` and `minecraft:sulfur_caves` are *not* in vanilla 1.21.1; this profile gets them from VanillaBackport, so their rows are in the extension even though the field definitions (Pale Garden) are in the base.
* `minecraft:deep_dark`, `crimson_forest`, `warped_forest`, `minecraft:ancient_city` and every other row in `research/vanilla-1.21.1-registry.json` are base.
* `c:is_snowy` and the other `c:` convention tags come from Fabric API, a hard dependency, so they are base. Terralith, LumyMon, Legendary Monuments, Raid Dens, Cobblemon Additions (`bca:`) and Repurposed Structures rows are extension.

`research/provider_map.py` encodes this and `research/validate.py` refuses a row in the wrong pack. Your own field's mappings go in **your** pack with the right `order`; they do not need to be in either shipped pack. Field definitions must exist exactly once: do not copy a shipped definition into another pack.

## 10. Generate, validate, test, package, reload

Prerequisites: Python 3.10+, Node 20+, Java 21, and a game profile for the installed Showdown (see [BUILDING.md](BUILDING.md)); set `REJUVENATION_PROFILE` or run from a checkout inside the profile.

```bash
# A separate pack from your own inputs (no repository files change)
cp research/custom-fields/_template/my_field.json my-fields/<path>.json    # edit identity, rules, seed, biomes, notes
python research/build_custom_pack.py my-fields build/my-pack               # --order 40 to set the mapping order
node research/verify_custom_pack.cjs build/my-pack                          # engine validation + one simulated turn per field

# The authoring kit's own tests (example behaviour, rejection cases, 61 still shipped, retargeting, schema)
python research/test_custom_fields.py
node verification/src/test/js/authoring-kit.test.cjs

# A field shipped with the project: put the input in research/custom-fields/, then
python research/generate.py && python research/validate.py
gradlew check            # full simulator, Graal and Java suites (update the 61-field counts deliberately)
python research/package.py
```

To install: zip `build/my-pack` with `pack.mcmeta` and `data/` at the **root** of the archive and place it in the world's `datapacks/` (or the Global Packs data-pack folder); `/reload` or restarting the world reloads it. The reload is atomic: a malformed pack logs the error and the previous catalog stays.

## 11. Troubleshooting

| Symptom | Cause and fix |
|---|---|
| `Unknown event X` / `Unknown action X` / `Malformed condition …` when loading | The engine's vocabulary is closed. Use only the events, operators and conditions in the shipped fields; there is no scripting. If you need a new one, it needs engine code (see Limits). |
| `Mapping references missing field` | A row names a field ID that no loaded pack defines. Check the ID, and that the pack with the definition is enabled. |
| `custom field input keys … unknown` / schema errors | A canonical input has a misspelled or unsupported key; compare with `research/schema/custom-field.schema.json` and the template. |
| `selector … matched N rules, expected M` | The parent field changed (or the selector text is wrong). Re-check the parent and update `expect` deliberately. |
| `selected … rules still mention <parent>` | A copied rule has a reference to the parent that is not a guard; decide whether it should stay and set `keepParentReferences`. |
| My biome row never applies | An earlier row matches first: an exact-biome row of a shipped document with a lower `order`, a tag row, or your `order` is above 300. Give your document a lower `order`, and check with `research/test-results/example-pack` style tests. A biome that is not registered in the running world (an uninstalled mod, an absent backport) simply never matches. |
| The field does not start in an Ancient City / village | Structure rows are checked before biomes but need the position inside the structure (or its footprint); the structure ID/tag must be the real registry ID; Repurposed Structures variants are matched by their collection tag. |
| `missing biome provider` in the notes or a validation warning | The biome comes from a mod or a backport that is not installed; this is not an error, and the row belongs in a pack that documents that dependency. |
| Notes rejected | A line exceeds the limits, contains `§`, JSON braces or developer words; fix the text. |
| A reload keeps the old catalog | The new pack was rejected; read the log line `Rejected field reload; previous revision retained` for the reason. |

## Limits

* No new events, operators, conditions, counters or mechanics without engine changes. Counters 1–5 and the three configured mechanics are the whole stateful vocabulary available to data.
* Datapack scripts, `eval` and arbitrary property paths are deliberately impossible.
* Artwork and sounds are resource-pack content; the data pack cannot carry them.
* Mechanics that depend on a move or ability that is absent from the installed simulator are reported as unavailable content; they are never aliased to a similar one.
