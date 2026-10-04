# Source audit worklist

Working notes for the branch-by-branch audit. A line here is a lead to
implement or verify, never evidence of review; closed decisions live in
`semantic-reviews.json`. Line numbers are the local Rejuvenation 14 scripts.

Status: `[ ]` open, `[x]` implemented+tested+reviewed, `[~]` deliberately deferred (reason given).

## Battler.rb entry abilities (pbAbilitiesOnField / pbAbilitiesOnSwitchIn)
- [ ] 2040 Chess Stall flavor "{1} is playing defensively!"
- [ ] 2203 Starlight Illuminate puts Follow Me on a Mirror Armor partner
- [ ] 2288-2300 Dimensional/Frozen Dimension/Deux Finalis: Pressure lowers foes' Def+SpD, Unnerve family lowers foes' Speed
- [ ] 2321 Haunted Shadow Tag frisks foes' items (player-owned holder only)
- [ ] 2343 Sky: Levitate-family +1 Speed; 2346 Cloud Nine ends weather on Sky
- [ ] 2417-2424 Deep Earth Magnet Pull / Unaware / Oblivious / Contrary entry flavor
- [ ] 2445 Concert growth (Plus, Galvanize, Heavy Metal, Solid Rock, Punk Rock; not stage 4); 2448 reduction (Minus, Klutz; not stage 1)
- [ ] 2454-2487 Back Alley: Pickpocket/Merciless +Atk, Magician +SpA, Anticipation/Forewarn +Def/SpD, Rattled +Spe (each with flavor)
- [ ] 2488-2516 City: Early Bird +Atk, Big Pecks +Def, Rattled/Pickup +Spe
- [ ] 2533-2545 overlay entry: Psychic overlay Anticipation/Forewarn +1 SpA, Misty overlay Water Compaction +2 Def (verify overlayIn)
- [ ] 2765 Neutralizing Gas clears every stat stage on Deux Finalis
- [ ] 2787 Primordial Sea floods Deux Finalis into Dimensional while heavy rain lasts; 2804 Desolate Land dries Grassy into Desert
- [ ] 2822-2826 Hadron Engine: New World flavor and no terrain; Electric Terrain flavor; otherwise sets terrain with flavor
- [ ] 2841-2843 Grassy Surge lasts 8 on Forest/Bewitched (Overlays is true); existing test asserts 5
- [ ] 2850 Misty Surge blocked on Corrosive Mist
- [ ] 2883 Curious Medicine clears all stat changes on Bewitched
- [ ] 2926-2983 weather/Gravity ability durations per field, Dimensional random 3-8 (verify conditionDurations)
- [ ] 2960 Orichalcum Pulse: New World flavor and no sun
- [ ] 3014 Comatose "is drowsing!" suppressed on Electric Terrain
- [ ] 3297 City Frisk lowers foes' SpD "Just a routine inspection."; Back Alley Frisk steals (verify)
- [ ] 3545 King's Rock/Razor Fang flinch 20% on Rainbow (hard or overlay); Stench 20% on Wasteland, Murkwater, Back Alley, City

## Battle_Move.rb
- [ ] 367-390 smartDamageCategory field terms (Battery/Flare Boost/Glitch) for Photon Geyser-style category choice
- [ ] 1540 Volcanic Top Blaze uses the Blazed effect and must not stack with low-HP Blaze
- [ ] 1629-1645, 1692-1701 Glitch special-stat pool: verify ability terms against statPools
- [ ] 1820 Concert 4 Metronome-style consecutive-use multiplier
- [ ] 2079 Ice Face also breaks to special moves on Frozen Dimension
- [ ] 2215 Concert grows on a critical hit
- [ ] 1185 Kowtow Cleave hits through protection at 0.25 on Chess (verify)
- [ ] 'c' leads 258-2336: verify existing rules and add receipts

## Custom abilities referenced by ordinary field branches (register like Defragment/Jungle Beat)
- [ ] Eelevate, Gravity Control, Soul Eater, Tempest, Fire Mane, Wildfire, Dragonize, Chi Focus, Sworn Duty, Solar Idol/Lunar Idol (Levitate list)

## Not in the AST audit (field passed as a value)
- [ ] PBMove.rb:140 Liquid Voice turns sound moves Ice on Icy
