# Deep Dark Field

> **Entry:** “The Deep Dark is listening...”

## Mapping

| Minecraft location | Field |
|---|---|
| `minecraft:deep_dark` | Deep Dark Field |
| Ancient City structures | Deep Dark Field |

## Core Effects

- Dark-type damaging moves: **1.5×** — “The Deep Dark empowered the attack!”
- Ghost-type damaging moves: **1.5×** — “The Deep Dark empowered the attack!”
- Fairy-type damaging moves: **0.5×** — “The Deep Dark swallowed up the purity...”
- Rock-type damaging moves: **1.3×** — “The cavern strengthened the attack!”
- Ground-type damaging moves: **1.3×** — “The cavern strengthened the attack!”
- Mimicry / Camouflage / Terrain Pulse: **Dark**.
- Nature Power: **Dark Pulse**.
- Secret Power: may lower Accuracy — “The darkness obscured [Pokémon]'s vision!”

## Sculk Warning

Shared battlefield counter: **0–4**.

Each side may change the counter **once per turn**. Increasing and calming effects share this allowance. Warning sources from one move are **exclusive, never additive**.

| Action | Warning |
|---|---:|
| Ordinary damaging move below 90 BP | +0 |
| Ordinary damaging move, 90–149 BP | +1 |
| Ordinary damaging move, 150+ BP | +2 |
| Sound-based move | +2 |
| Explicit seismic / explosive move | +2 |
| Calming move | -1 |
| Magical Seed activation | +1 |

### Generic Warning Text

- 90–149 BP: “The force of the attack disturbed the sculk!”
- 150+ BP: “The overwhelming attack sent vibrations through the Deep Dark!”
- Sound move: “The sculk reacted heavily to the noise!”
- Seismic move: “The vibration spread violently through the sculk!”
- Major impact: “The Deep Dark trembled from the impact!”

### Explicit +2 Moves

At minimum: Earth Power, Earthquake, Bulldoze, Magnitude, Fissure, Stomping Tantrum, High Horsepower, Headlong Rush, Precipice Blades, Rock Slide, Stone Edge, Smack Down, Meteor Beam, Explosion and Self-Destruct.

Special text overrides generic text:

- Boomburst: “The deafening blast sent the sculk into a frenzy!”
- Clanging Scales: “The clang echoed throughout the Ancient City!”
- Clangorous Soulblaze: “The ancient city rang with Kommo-o's war cry!”
- Uproar: “The relentless noise enraged the sculk!”
- Earthquake: “The ancient city shook violently!”
- Explosion / Self-Destruct: “The explosion reverberated through the Deep Dark!”

## Warning Stages

1. **Warning 1** — “A sculk sensor stirred...”
2. **Warning 2** — “Something stirred beneath the darkness...”
3. **Warning 3** — “An ancient shriek echoed a warning!” then “Darkness engulfed the battlefield!”
   - While Warning ≥3, normal accuracy checks are multiplied by **0.9**.
   - Keen Eye, Compound Eyes and Illuminate ignore this penalty.
4. **Warning 4** — “The earth began to tremble...” then “The Deep Dark struck back!”
   - Every active non-immune Pokémon loses **20% max HP** as environmental damage.
   - Retaliation occurs at most **once per turn**.
   - After retaliation, Warning resets to **1** — “Silence returned to the Deep Dark...”

If calming lowers Warning from ≥3 to <3: “The darkness receded...”

## Calming

Calming moves reduce Warning by **1**, minimum 0, if that side has not already changed Warning this turn.

- Calm Mind — “The Pokémon's composure quieted the surrounding sculk...”
- Meditate — “Stillness returned briefly to the Deep Dark...”
- Other tagged calming moves — “A soothing calm settled over the sculk...”
- Flash also reduces Warning by 1 — “The sudden light pushed back the darkness!”

## Retaliation Immunities

- **Soundproof** — “[Pokémon]'s Soundproof shut out the sonic assault!”
- **Punk Rock** — “[Pokémon] endured the violent resonance!”
- **Solid Rock** — “[Pokémon]'s Solid Rock absorbed the violent resonance!”
- **Current Ghost typing** — “[Pokémon]'s spectral form let the resonance pass through it!”

Immunity does **not** prevent the Pokémon's moves from generating Warning.

## Other Ability / Item Effects

- Rattled: when Warning crosses into 3, Speed +1 — “[Pokémon] was rattled by the ancient shriek!”
- Magical Seed: grants **Soundproof**, then attempts Warning +1.
  - “The Magical Seed muffled [Pokémon]'s presence!”
  - “But the disturbance stirred the sculk...”

## Reference Basis

Custom field using Rejuvenation's stateful-field design conventions, particularly Cave/Dimensional-style counters and standard field-dependent move hooks.

## Official Rejuvenation References

- Field Effects: https://rejuvenation.wiki.gg/wiki/Field_Effects
- Dimensional Field: https://rejuvenation.wiki.gg/wiki/Dimensional_Field
