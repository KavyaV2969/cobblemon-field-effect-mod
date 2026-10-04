# Sources and discrepancies

## Primary local source

```text
C:\Users\Lenovo\AppData\Roaming\ModrinthApp\profiles\Test (1)\rejuvenation\Rejuvenation 14 copy
```

`Scripts/Rejuv/Bootstrap.rb` identifies version **14.0.14**. Inspected reference areas include `Rejuv/Definitions/fieldtext.rb`, `Data/fields.dat`, `Cache.rb`, `PBConstants.rb`, `PBStuff.rb`, `Battle.rb`, `Battle_Field.rb`, `Battle_Move.rb`, `Battle_MoveEffects.rb`, `Battle_Effects.rb`, `Battler.rb`, `Battle_DamageState.rb`, `Battle_AI.rb`, other battle handlers, move/ability/item definitions and field-related global references. `Cache.rb:94` loads `fields.dat` when present; compiled effective entries therefore take precedence over orphan definition text.

`source-hashes.json` fingerprints the inspected Ruby files. `source-reference-index.json` lists 2,162 textual references. `interaction-audit.json` records 1,736 AST field-condition blocks (1,727 in the first pass) and body hashes without copying the game scripts. `compiled-field-specification.json` and `field-specification.json` contain field data needed for the mechanical specification, not unrelated game assets. The extractor uses Rejuv=true, Reborn=false, Gen=9.5 and Champs=9.5 for constant data; every distributed handler lead now has an individual review in `semantic-reviews.json`, and `blindspot_scan.py` covers references the AST cannot see.

## Installed technical source

The installed `mods/Cobblemon-fabric-1.7.3+1.21.1.jar`, its shaded Graal classes, the profile's `showdown/` scripts, actual remapped Minecraft jar, Fabric API jars, RCT/Run & Bun jars and mod/datapack biome resources were inspected directly. API signatures were checked with Java bytecode inspection. Runtime tests execute the profile's simulator and Cobblemon's shaded Graal rather than relying on a different downloaded version.

Supporting public technical references consulted include [Fabric resource loading](https://wiki.fabricmc.net/tutorial:custom_resources), [Fabric synchronous reload listener API](https://maven.fabricmc.net/docs/fabric-api-0.100.1%2B1.21/net/fabricmc/fabric/api/resource/SimpleSynchronousResourceReloadListener.html), and [Cobblemon source discussion](https://gitlab.com/cable-mc/cobblemon/-/merge_requests/329). These are secondary architecture references; no wiki is treated as the authoritative field rule catalogue.

## Source discrepancies and traps

- `fieldtext.rb` has a duplicate change-condition key around lines 2872Ã¢â‚¬â€œ2873. Ruby keeps the final value; extraction preserves that behavior.
- Eight message-only definition rows are absent from the compiled move table. They are recorded in `unused-source-definition-rows.json` and are not turned into active rules. A flavor-list entry does not establish runtime behavior.
- Source typos such as `mooblast`, `eartpower` and `stealtrock` are not silently repaired or aliased. Active and inactive references are distinguished through compiled data.
- Flower Garden's Secret Power implementation uses positive stat-stage amounts despite descriptions suggesting decreases. Current data follows the executing handler.
- Colosseum contains `MIRORARMOR` in a source ability case. It does not match the actual `MIRRORARMOR` identifier; current porting does not invent that missing activation.
- Mist-explosion change effects execute after field replacement, while water pollution is applied earlier. This changes which field-specific protection branch runs; current transition operators preserve that ordering for the reviewed cases.
- Rejuvenation's `QMARKS` becomes Showdown's supported `???` type. In the Rejuv branch, only Fairy is in `PBFields::GlitchTypes`; importing the Reborn Dark/Steel conversion would be incorrect.
- Source Snow weather is represented by the installed simulator's `snow` condition. The move ID `snowscape` is not the weather ID. A complete-turn test verifies this distinction.
- Field-note pipe markers are retained in definition data and removed when dispatching battle text. They are not treated as line breaks.
- Run & Bun's jar filename and metadata disagree on version; documentation reports both and relies on the installed class signatures.
- Terralith is present as an optional datapack and disabled in the inspected existing world. Static discovery of its 95 biomes does not prove they are live registry entries.

The source definition comparison checks all 57 entries and 4,494 compiled properties with zero differences. Besides moves, types, messages and transitions, it covers Mimicry, Burmy cloaks, seeds, status highlights and field-change targets. Distributed runtime behavior is covered by the semantic review register, not this comparison.

Salt Cure on Holy/Deux Finalis is a deliberate project deviation. The shipped Champions build uses divisor 8 (4 for Water/Steel); this port uses the source's pre-Champions Holy divisor 6 (3 for Water/Steel), so 1/6 and 1/3 per turn.


Further source traps preserved during the second pass:

- Chess Merciless checks HP below 80% before its below-60%/40% branches. The latter are unreachable in this version; the implementation applies only the reachable +1 stage.
- Haunted Night Shade calls `HauntedNightSHade`, while its feedback handler is named `HauntedNightShade`. Its level multiplier applies, but that mismatched message does not emit. Bewitched Night Shade and Deep Earth Seismic Toss retain their working original text.
- MultiTurn Binding Band is captured when trapping starts, not read from the attacker's current item every residual. Damage divisors are indexed by Band plus field increments. Trapping reads the current field, so changing a field changes subsequent binding damage.
- Pledge and Conversion memory belong to the whole battle and are not reset at turn boundaries. Native Showdown Pledge combos instead combine within one turn and create side conditions; those native callbacks are removed in opted-in battles.
- Native Focus Energy duration and critical stages are different concepts. Ashen Beach's value of three is a persistent critical stage, not three turns. Rejuvenation's binding Seed duration of four yields three residual ticks because the source decrements before applying damage.
- The isolated launch initially used an offline test name over Minecraft's 16-character login limit. The fixture now uses `FieldCheck`; the failed login was a test harness error, not a field-engine compatibility failure.
- Sky Flying Press checks the opponent's first type twice at `Battle_Move.rb:778Ã¢â‚¬â€œ781`, applies only advantageous Flying modifiers and ignores Flying resistances. The port preserves that behavior with a reusable first-type bonus recipe. This does not apply to the separate field-added secondary-type calculation.
- `Battle_Field.rb:938Ã¢â‚¬â€œ954` chooses the first matching move-flag message before ordinary type flavor. Conditions determine the multiplier, not that message lookup. `Battle_Move.rb:1348Ã¢â‚¬â€œ1367` selects hard-field type flavor ahead of overlay flavor when both factors apply; weather-suppressed Starlight factors do not enqueue boost flavor.
- Native Showdown condition initialization inserts Magic Room before invoking its duration callback. Rejuvenation checks Amplifield Rock first. The guarded initialization wrapper evaluates clock choices before insertion so this item extends the room without ignoring Klutz or an existing Magic Room.
- `Battle_Field.rb:1179` explicitly preserves added types during Mimicry. Native Showdown `setType` clears them, so the port preserves and reapplies the separate added type; unchanged base typing does not repeat flavor.
- `Battle_Field.rb:1095Ã¢â‚¬â€œ1128` queries `pbWeather(attacker)`, which interprets Mega Sol as sunny before Cloud Nine/Air Lock suppression (`Battle.rb:360Ã¢â‚¬â€œ367`). The executed Ruby oracle exposed an initial hail-defense mismatch. The reusable `weatherFor` predicate now matches the original method in the bounded oracle contexts, including Deux Finalis rain exceptions.
- `Battle_MoveEffects.rb:5266Ã¢â‚¬â€œ5294` permits already-asleep Rest only when Sleep Talk calls it on Glitch. `Battle_Effects.rb:165Ã¢â‚¬â€œ190` refreshes its clock without clearing Nightmare or rolling a new duration. The port revalidates immunity/field restrictions and retains the existing volatile; native status Start would remove Nightmare and consume an extra random roll.
- `Battle_MoveEffects.rb:5563Ã¢â‚¬â€œ5570` exempts Haunted from Destiny Bond's repeated-use failure. Refreshing the native volatile before hit preserves its fainting behavior while allowing consecutive uses; removing only the native gate would still fail to add an already-present volatile.
- The live harness requires both actors' validated responses to be stored before dispatch. Automatically dispatching the player response early clears the wild request and can stall a fixture; the corrected harness batches both responses. A flee radius of one also made the test end immediately; the fixture uses 32. These were harness errors.

## Local file safety evidence

The authored mod, datapack, documentation, tests and isolated game are under `rejuvenation/`. The read-only protected-file audit compares 1,254 original files against the initial hashes. It currently detects one difference in `config/iris.properties`, preserves it, and reports its timestamp and hashes. No original configuration was manually restored or edited by this implementation. The other 1,253 protected files, including trainer/content archives, retain their baseline hashes. This observed settings difference prevents an unqualified claim that every original file is unchanged.


The continuation inspected distributed `Battler.rb` form, entry, contact and stat handlers, `Battle_Effects.rb` status predicates, `Battle_Field.rb` field-change/form helpers, `Balls.rb`, `Time.rb`, and nested `Rejuv/Battle/*` handlers. `research/semantic-reviews.json` fingerprints each reviewed source file and records the exact AST lead and focused regression evidence. The review found that Holy Silvally uses Dark form 17, that Gulp Missile's Underwater damage uses the raw Water matchup, and that source field-change checks differ from actual switch-in form checks. The engine implements these behaviors from the local scripts. No online reference was needed for these decisions.

The local-list-aware AST audit adds `Battler.rb:1770` (Zen Mode) and `Battle_Move.rb:1828` (sound abilities), raising leads from 1,727 to 1,729. `extract_calling_pools.rb` loads only PB constants and move definition data to derive 265 ordinary Glitch Metronome candidates using the shipped blacklist, Shadow exclusion and source power threshold. No unrelated move descriptions/assets are exported. The source sound list contains dormant `:CONCERT`, which does not select any shipped CONCERT1–4 field; Punk Rock therefore uses its ordinary multiplier on those stages. The Jungle Beat clause remains pending.

`Battle.rb:718–726,5392–5397,6992–7005` governs Gravity-created Starlight, sun-created Crystal Cavern, hard clocks and overlay clocks. Duration conditions terminate a clock when false; they do not pause its normal decrement. Infinite sun has no temporary hard-field duration. Hard clocks resolve before overlay clocks, and Frozen Dimension pauses only the overlay. `Battle_Field.rb:63–69,437` resets counters and releases the locked move roll but preserves the shared sequential roll index.
