# Pale Garden Field

> **Entry:** “The marionettes in the woods are hunting...”

## Mapping

| Minecraft biome | Field |
|---|---|
| `minecraft:pale_garden` | Pale Garden Field |

## Base: Bewitched Woods

Pale Garden uses **Bewitched Woods** as its baseline unless overridden below.

- Fairy moves: **1.5×**; super-effective against Steel and neutral against Dark — “The supernatural aura amplified the attack's power!”
- Grass moves: **1.5×** — “Flourish!”
- Dark moves: **1.3×**; neutral against Fairy — “The dark aura amplified the attack's power!”
- Poison moves deal neutral damage to Grass.
- Grounded Grass Pokémon heal **1/16 max HP** each turn — “The woods healed the grass Pokémon on the field.”
- Sleeping Pokémon lose **1/16 max HP** each turn — “[Pokémon]'s dream is corrupted by the evil in the woods!”
- Effect Spore: **60%** activation chance.
- Flower Gift: always active.
- Flower Veil: affects all Pokémon.
- Natural Cure: additionally heals status at end of turn.
- Pastel Veil: negates the bearer's Fairy weaknesses.
- Power Spot: partner move power **1.5×**.
- Prankster can affect Dark-types.
### Retained Bewitched Woods Move Effects

- Hex, Mystical Fire, Spirit Break: **1.5×** — “Magic aura amplified the attack!”
- Aurora Beam, Bubble Beam, Charge Beam, Flash Cannon, Hyper Beam, Ice Beam, Magical Leaf, Mirror Beam, Psybeam, Signal Beam: **1.4×** — “Magic aura amplified the attack!”
- Dark Pulse, Moonblast, Night Daze: **1.2×** — “The forest is cursed with nightfall!”
- Forest's Curse additionally Curses the target.
- Grass Whistle, Poison Powder, Sleep Powder and Stun Spore: **85% accuracy**.
- Magic Powder additionally inflicts Sleep.
- Moonlight heals **75% max HP**.
- Strength Sap additionally lowers Special Attack by 1 stage.
- Magical Seed: Bewitched Woods effect (**Special Defense +1 and Ingrain**).

## Creaking Distraction

Each side has its own **Creaking Distraction** counter: **0–3**.

- A successfully executed damaging move increases that side's counter by **1**.
- A side can gain at most **one distraction tick per turn**, including doubles.
- A successfully executed status move **fully resets that side's counter to 0**.
- Status moves retain their normal effects.

### Stages

**0 → 1**  
“Something shifted between the pale trees...”

**1 → 2**  
“Wooden footsteps creaked behind "Pokemon"...”

**2 → 3**  
“The marionettes grow restless!”  
“The marionettes struck from the trees!”

At 3, active Pokémon on that side lose **40% max HP** as environmental damage, then that side's Creaking Distraction resets to **0**. "The Creaking subsided..."

### Reset by Status Move

“The marionettes froze under watchful eyes...”

## Field Identity

- Damaging repeatedly = lose track of the Creakings.
- Status move = stop attacking, regain awareness, fully reset the threat.
- The counter is **side-specific**, unlike Deep Dark's shared Sculk Warning.

## Standard Field Hooks

Use Bewitched Woods defaults:

- Mimicry / Camouflage / Terrain Pulse: **Fairy**.
- Nature Power: **Dazzling Gleam**.
- Secret Power: may inflict Sleep, Poison or Paralysis.
- Shelter: halves Fairy damage.

Magical Seed : "+6 defense, apply petrification to user"

## Reference Basis

Direct fusion of **Bewitched Woods** with a simplified warning-state mechanic inspired by Deep Dark.

## Official Rejuvenation References

- Bewitched Woods: https://rejuvenation.wiki.gg/wiki/Bewitched_Woods
- Field Effects: https://rejuvenation.wiki.gg/wiki/Field_Effects
