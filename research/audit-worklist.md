# Source audit worklist

Working notes for the branch-by-branch audit. A line here is a lead to
implement or verify, never evidence of review; closed decisions live in
`semantic-reviews.json`. Line numbers are the local Rejuvenation 14 scripts.

Status: `[ ]` open, `[x]` implemented+tested+reviewed, `[~]` deliberately deferred (reason given).

## Closed (2026-10-04, commit 210bb61)

The AST lead audit is complete: all 1,736 leads in `interaction-audit.json`
have a review entry and zero remain `requires_behavioral_comparison`. Every item
previously listed here maps to an `implemented_and_tested` review. Earlier
numbers drifted, so the current review ranges are given:

- [x] Battler.rb entry abilities: Chess Stall flavor (2051-2067), Starlight Illuminate (2197-2213),
      Dimensional family Pressure/Unnerve (2252-2312), Haunted Shadow Tag (2313-2333), Sky (2335-2355),
      Deep Earth (2389-2424), Concert growth/reduction (2443-2452), Back Alley (2454-2487), City (2488-2516),
      Psychic/Misty overlay entry (2644-2661), Neutralizing Gas (2765-2772), Primordial Sea/Desolate Land
      (2787-2807), Hadron Engine (2822-2840), Grassy Surge (2841-2849), Misty Surge (2850-2857),
      Curious Medicine (2883-2900), ability weather/Gravity durations (2926-2983), Orichalcum Pulse (2960-2975),
      Comatose (3014), City Frisk (3294-3304), King's Rock/Razor Fang/Stench (3545)
- [x] Battle_Move.rb: smart damage category (367-390), Volcanic Top Blaze (1540-1564), Glitch special-stat
      pool (1629-1692), Concert 4 consecutive use (1820), Frozen Dimension Ice Face (2079-2087), Concert critical
      growth (2215-2217), Chess Kowtow Cleave (1185-1196), 'c' leads 258-2336
- [x] Custom abilities referenced by ordinary branches: Eelevate, Gravity Control, Soul Eater, Tempest,
      Fire Mane, Wildfire, Dragonize, Chi Focus, Sworn Duty, Solar Idol, Lunar Idol (`registered_abilities.py`)
- [x] PBMove.rb:140 Liquid Voice turns sound moves Ice on Icy (not an AST lead; field passed as a value)

## Open: AST blind spot

`when` clauses inside `case true` blocks are not emitted as leads. Found and implemented so far:
- [x] Battle.rb 1728-1738
- [x] Battle_Move.rb 764, 1532
- [x] Rescan with `research/blindspot_scan.py` (2026-10-04): 112 references remain outside lead ranges,
      reviews and citations. Each was triaged:
  - [x] Implemented in this pass (tests "Ion Deluge and Plasma Fists create a three-turn Electric Terrain..." and
        "Stoked Sparksurfer and Genesis Supernova create fixed-duration terrains..."): Ion Deluge (MoveEffects
        7500-7519) and Plasma Fists (8306-8320) Electric Terrain 3/6 turns with Everstone block; Stoked Sparksurfer
        (ZMove 290-301) 3 turns and Genesis Supernova (ZMove 322-332) a flat 5 turns, both ignoring held items.
        Z-moves are reachable through Mega Showdown's Z-crystals.
  - [x] Already implemented and tested, but cited by another line or method: Secret Power field effects
        (MoveEffects 3502-3600), terrain moves 134/135/136/168 (7089-8012, Amplifield extension), Deep Earth Gravity/Magnet Rise/Topsy-Turvy, Bewitched Flower Veil stat
        guard (Effects 716/761), Colosseum forced switch (Effects 1307), Deux Finalis aura multiplier (Move 1208,
        cited as "1215,1230"), Jungle Beat (Move 1827), Inverse (Battle 7927), terrain end and return messages
        (Field 483-493), Quark Drive overlay end (Field 474), Pledge pairs (Field 1239-1241), field rolls (Field 892-893).
  - [x] Corrected: the native terrain hook blocked Electric/Grassy/Misty/Psychic Terrain for an Everstone
        holder, but the source classes check only canChangeFE?. Everstone guards only Mist, Ion Deluge, Plasma
        Fists and Conversion/Conversion 2. Test renamed "terrain moves ignore Everstone and Amplifield Rock extends them".
  - [x] Unreachable: Misty blocks Frenzy (Effects 552), since nothing in the scripts inflicts the Frenzy status;
        Topsy-Turvy creating Inverse (MoveEffects 7387) is `!Rejuv`; Reborn flower garden layering (Field 391-395).
  - [x] Unsupported, recorded in LIMITATIONS.md: post-battle Ball Fetch Snowball / Honey Gather on
        Snowy Mountain/Forest (Field.rb 1468-1474); Murkwater puddle overworld selection (Field 1221).
  - [x] Out of scope or presentation: Multi-Attack animation (MoveEffects 3403), FieldNotes, Battle_Inspect,
        Battle_Scene, field graphics/compilers/cache (Field 60-196, 1275-1280, Compilers, Cache), BattleSwap,
        PBStuff constants, OrgBattle Battle Factory bosses, Trainers.rb trainer AI.

## Deferred
- [~] Unregistered abilities of forms absent from the pack (Coal Furnace, World of Nightmares, Mega Sol and
      26 others): recorded unsupported/unreachable; revisit if those forms are added
- [~] 763 Battle_AI.rb leads: wait for the Run & Bun AI adapter
