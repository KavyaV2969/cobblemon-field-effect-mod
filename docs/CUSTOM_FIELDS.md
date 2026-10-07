# Custom fields

Four fields beyond Rejuvenation's 57 originals: `rejuvenation:deep_dark`, `rejuvenation:pale_garden`, `rejuvenation:warped_forest` and `rejuvenation:crimson_forest`. They have **no Ruby source**: their specifications are the four documents supplied with the project (`Deep_Dark_Field.md`, `Pale_Garden_Field.md`, `Warped_Forest_Field.md`, `Crimson_Forest_Field.md`) together with the written resolutions recorded below. They are outside the Ruby comparison, the source audit and the oracle counts (those stay at 57), and every report that counts fields says "57 original + 4 custom = 61".

They are ordinary fields of the same engine: closed declarative rules (`rules`, `types`, `moves`, `seed`, `seedActions`), the same lifecycle (`change`/`destroy`/residual), the same evaluator, strategy and preview paths. Where a mechanic needed a new primitive, the primitive is data-configured and validated like every other rule (`mechanics`, `typeComposition`, `accuracyCrash`, the `finalAccuracy` event and the `accuracyPenalty` op). Datapacks remain data only.

## Source of the definitions

`research/custom-fields/<field>.json` holds each field's canonical input: identity, entry text, the base field it inherits from (selected rules are copied with exact expected counts, so a change in the base fails generation, and guards on the parent's own ID are retargeted), its own rules, seed, mechanics, artwork and notes. [CUSTOM_FIELD_AUTHORING.md](CUSTOM_FIELD_AUTHORING.md) explains how to write one. `research/custom_fields.py` builds the field definitions that `generate.py` writes to `datapack/.../fields/` and the biome rows; `research/field_notes.py` writes the player notes. Nothing is hand-edited in the generated JSON.

Where the mappings live: the four field definitions are in the base pack; the biome row for `minecraft:pale_garden` is in the COBBLEVERSE extension because that biome is provided by VanillaBackport, not by vanilla 1.21.1 (the other three biomes and the vanilla Ancient City are in the base; Repurposed Structures' Ancient City variants are in the extension).

Biomes: `minecraft:deep_dark`, `minecraft:pale_garden`, `minecraft:warped_forest`, `minecraft:crimson_forest` select the matching field in every dimension. Structures: Ancient Cities (and Repurposed Structures' variants) select Deep Dark and are checked before every other structure row. Availability is reported honestly: `minecraft:pale_garden` exists only through the VanillaBackport mod installed in this profile; the three others are vanilla 1.21.1.

## Deep Dark

Entry text and type table per the specification (Dark and Ghost ×1.5, Rock and Ground ×1.3, Fairy ×0.5; Mimicry, Camouflage and Terrain Pulse become Dark; Nature Power becomes Dark Pulse).

- **Sculk Warning** is one shared counter, 0 to 4 (`field.mechanics.sculkWarning`, stored in the field's public counters). Each action belongs to exactly one class, in this order: calming move (−1), an explicit override entry (Earthquake, Boomburst, Uproar, Explosion, Self-Destruct, Clanging Scales, Clangorous Soulblaze, +2), a sound-flag move (+2), the seismic list (+2), otherwise the resolved Base Power: 90 to 149 +1, 150 or more +2. Sources never add together. "Resolved Base Power" is the highest Base Power event value the damage calculation received, before field, STAB, item and ability amplification; moves that never calculate damage ask the simulator's own `basePowerCallback` on a cloned PRNG. Spread and multi-hit moves count once.
- **Allowance:** each side may change the Warning once per turn (keyed to the simulator's turn counter). A change that would do nothing (calming at 0, raising at 4) does not consume it.
- **Execution** means the move passed `TryMove`: a miss, Protect, immunity or absorbing ability still counts; sleep, paralysis, flinch and a charging turn do not.
- **Darkness** at 3: every accuracy check is multiplied by 0.9 after stage handling (`finalAccuracy`); Keen Eye, Compound Eyes and Illuminate ignore it. A Pokémon with Rattled gains Speed +1 when the Warning crosses into 3 (once per crossing).
- **Retaliation** at 4: once per turn, at the first processing point after the move that reached 4 (after the action, an entry or seed, or the end-of-turn residual), every active Pokémon without an exemption loses 20% of its maximum HP through `directDamage` (so Protect, Substitute and Focus Sash do not stop it), then the Warning resets to 1. Exempt: Soundproof, Punk Rock, Solid Rock, Ghost types. Fainted and Commander-hidden Pokémon are not on the field.
- **Calming** below 3 lifts the Darkness. Switching and fainting never reset the Warning.
- **Magical Seed:** the holder's ability becomes Soundproof, then the seed tries to raise the Warning by 1 (it uses the holder's side allowance).

## Pale Garden

Plays like Bewitched Woods (selected Bewitched rules are inherited, and any rule keyed to the base field's own ID is retargeted to Pale Garden so it still fires) with the Creaking added.

- **Creaking Distraction** is a per-side counter, 0 to 3 (`field.mechanics.creakingDistraction`). A damaging move that connects adds 1 to its side's counter, at most once per side per turn (doubles included); a succeeding status move resets that side's counter and never renews the tick. At 3, every active Pokémon of that side loses 40% of its maximum HP (`directDamage`) and the counter returns to 0.
- Type table: Fairy ×1.5 (hits Steel super effectively, Dark neutrally), Grass ×1.5, Dark ×1.3 (hits Fairy neutrally), Poison hits Grass neutrally. Mimicry, Camouflage and Terrain Pulse become Fairy; Nature Power Dazzling Gleam. Shelter halves Fairy damage to its user.
- **Seed conflict, resolved:** the specification's two seed statements conflict. The final statement wins: Magical Seed raises Defense by 6 stages and petrifies the holder.

## Warped Forest

A selective fusion of Forest, Dimensional, Wasteland and a little Volcanic (rules copied from those fields with exact counts).

- Typing: Grass, Dark and special Bug ×1.5; Ghost ×1.2; Fire ×1.3; Water ×0.8; Ice and Fairy ×0.5. Move boosts multiply with the type boost (Power Whip, Vine Whip ×2.25 total; Dark Pulse, Night Daze ×1.8 total and never miss).
- **Additional types** (`typeComposition`): a bounded, one-pass, ordered list evaluated against the types accumulated so far. Damaging Grass moves (including the forest cutters that gain Grass here) also count as Dark for effectiveness. Added types never add same-type bonus.
- Weather cannot start and existing weather ends when the field begins; Pokémon cannot be frozen. Trick Room, Magic Room, Wonder Room and Gravity last a random 3 to 8 turns. Leech Seed drains 1/4 instead of 1/8.
- Magical Seed: Defense +1, Special Defense +1, Speed −1 and Ingrain. Shelter halves Dark damage.

## Crimson Forest

- Typing: Fire, Grass and Poison ×1.3, special Bug ×1.2, Water ×0.8, Ice ×0.5; special Flying moves count as Poison; Power Whip and Vine Whip also count as Fire (×1.95 total with the Grass bonus).
- **Piglin Bloodlust** (`field.mechanics.bloodlust`): a knockout counts when a Pokémon directly knocks out an opposing Pokémon with a move, attributed to the attacker; the Attack stage is paid once the simulator announces the batch of faints is finished, so a double knockout gives +2 and stacks with Moxie. Poison, burn, weather, recoil, field damage and ally knockouts do not count. The message only appears when the boost line does.
- **Crimson Vines:** damaging moves with positive priority have their final accuracy multiplied by 0.8 (native `modify` rounding; moves that never miss are exempt). A miss caused by this penalty alone (the same native roll would have hit at the unscaled accuracy; attributed by a probe on the move's accuracy roll, using a cloned PRNG) crashes the user like High Jump Kick for 1/2 of its maximum HP. Ordinary misses, Protect, immunity and moves that already crash never crash from the field.
- **Good as Gold** gains Speed +1 and Special Attack +1 on entry. Weather Hail and Snow end immediately; no freezing. Inherited ability handlers (Corrosive Mist, Forest): Merciless, Poison Heal, Toxic Boost, Magma Armor, Flash Fire, Well-Baked Body, Steam Engine, Grass Pelt, Leaf Guard, Overgrow, Swarm, Effect Spore.
- Elemental Seed: Attack +1, Special Attack +1, Speed +1, then the holder is taunted.

## Strategy, previews and gimmicks

All custom-field state (counters, allowances, retaliation turn, distraction counts, Bloodlust batches, probe flags) lives in the battle-local `custom` state, which is reset whenever the visible field changes and is captured and restored by the evaluator with the rest of the battle.

- **Previews** show only the move's own damage. Retaliation and Distraction strikes are environmental: a preview records what *would* be lost (`fieldStrike`) instead of dealing it, so a displayed range and its KO label never count the strike as the move's damage.
- **Strategy** rolls out the real turn, so strikes that happen this turn are priced as the HP they cost. On top of that it prices what is still pending: the standing risk of the public counters (the next strike's cost to each side's present Pokémon, with exemptions decided by the simulator's immunity rules, times the chance the counter gets there) so calming the Warning or resetting a Distraction has a value that depends on who is exposed; the dormant substrate of a layered field (30% of its affinity for the team); Crimson's field-attributed crash risk (chance × crash fraction, added to the deciding move's cost); and a declared affinity for the custom fields (the always-on type multipliers for a Pokémon's own types, and exemption from the strike). Reserves enter through the real switch-in pipeline, so a Ghost entering a Deep Dark that is about to strike takes no damage in the rollout.
- **Gimmicks:** Mega, Z, Dynamax, Ultra and Terastallization candidates run through the same rollouts and the same field rules; `custom-fusion-regression.cjs` and `custom-strategy-regression.cjs` include differential fixtures for each family.

## Tests

`custom-field-regression.cjs`, `custom-fusion-regression.cjs` and `custom-strategy-regression.cjs` (node, actual simulator moves, doubles, rollback and cache fixtures, a 400-seed scan of Crimson's crash attribution with zero violations), `graal-regression.js` (the four fields attach, run mechanics and clean up in Cobblemon's shaded Graal), and the Java/validator checks of every data key. See [TESTING.md](TESTING.md).

## Audit findings (0.1)

The specification documents are kept, with their SHA-256 hashes, in [spec/custom-fields](spec/custom-fields) and every statement is traced to a test in [reports/custom-field-validation.md](reports/custom-field-validation.md). The audit found the data and engine behaviour consistent with the specifications and the resolutions above; it recorded these points for the maintainers rather than changing behaviour:

- **Leech Seed in Warped Forest** doubles the simulator's native eighth (the Wasteland source rule), so the drain is twice the *floored* eighth. Against a literal quarter of maximum HP that is at most 1 HP less when the maximum HP leaves a remainder of 4 to 7 when divided by 8. Left as is (documented resolution, covered by `playtest Warped Forest` tests); an exact quarter would need a new engine operator.
- **Piglin Bloodlust and binding damage.** A move's own binding damage (for example a Fire Spin residual) is move-caused in the simulator: native Moxie reacts to such a knockout, and Bloodlust follows the same attribution. Poison, burn, weather, recoil and ally knockouts do not count.
- **Crimson Forest's entry text** is ambiguous in the specification: the Entry line reads "The red flora preying..." and the flavor pool "The red flora is preying...". The project owner chose the grammatical form for 0.1, so the field announces "The red flora is preying..." (the 0.2.0 build announced the Entry line as written). A maintainer who prefers the other form changes `entryMessage` in `research/custom-fields/crimson_forest.json`.
- **Mirror Beam** (retained from Bewitched Woods for Pale Garden) does not exist in the installed Showdown, so its 1.4x row is verified as data only and reported as unavailable content, never as a pass.
- **Pastel Veil** in Pale Garden follows the Bewitched implementation: a Fairy-typed bearer is neutral to Poison and Steel.
- **Creaking Distraction** counts a damaging move that connects (a hit on a Substitute connects); misses, Protect, immunity, absorption, flinch, sleep and charging turns do not tick it; any successful status move resets the side.
