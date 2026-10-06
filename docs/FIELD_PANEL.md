# Field panel

A compact panel shows the active field during a battle: the field's Rejuvenation battle background as a thumbnail, framed like Cobblemon's battle log, with the field's full name underneath. The Minecraft world remains the actual battle backdrop; the artwork only identifies the mechanical field.

```text
┌───────────────────────────┐
│  Rejuvenation backdrop    │
│  (16:9 thumbnail)         │
│ ░ Electric Terrain · 4 ░  │  <- only while an overlay or temporary field is active
├───────────────────────────┤
│      Grassy Terrain       │
└───────────────────────────┘
```

## Placement and look

- Above the battle log, right-aligned with it. The log is located where it is actually drawn: Battle Extras' enhanced or classic log (its widgets publish their bounds, read without modifying that mod) or Cobblemon's message pane. The panel is clamped below the opponent's battle tiles (Cobblemon: 10 px inset, 40 px per tile) and shrinks to fit; it is not drawn when there is no room, while the battle is minimised, or with the HUD hidden.
- The frame is cut from Cobblemon's own `textures/gui/battle/battle_log_expanded.png` (outline, light header band, grey body, footer, chamfered corner), so it matches the log and follows resource packs that restyle Cobblemon's battle GUI. The thumbnail sits in a dark inset like the log's text box.
- The name uses Cobblemon's battle font (`CobblemonResources.DEFAULT_LARGE`), bold, centred and shadowed, shrinking to fit long names. Progressive fields show their stage (`Flower Garden 3`).
- It is drawn on the HUD layer, so it never intercepts clicks on Cobblemon's controls by itself. Layout is computed by `FieldPanelRenderer.layout`; `FieldPanelRenderer.currentLayout` returns the bounds it is drawn at, which is what the clickable [Field Notes](FIELD_NOTES.md) overlay attaches to: while a screen with a free mouse is open (Cobblemon's battle screen, or chat) a click on the panel opens the notes, and hovering shows a "Click for field notes" tooltip.

## Live updates

The server forwards the simulator's ordered `rejuvenationstate` snapshots (the same state `FieldApi.current` exposes) as `rejuvenation:field_state` payloads to the battle's players and spectators whenever the visible state changes; nothing on the client derives field state itself. Covered changes: battle start, field transformations and destruction, temporary fields (a "N turns left" strip), terrain overlays (an "Overlay · N" strip over the thumbnail, the hard field's backdrop and name remain), expiry back to the underlying field, and battle end (the panel disappears). A field change crossfades the thumbnail for 0.4 s.

The panel always shows the engine's current *hard* field; an overlay is shown as the strip, consistent with the engine's semantics (rules of the hard field apply, the overlay adds its own).

## Artwork

57 PNG files, one per original field, copied unmodified from the local Pokémon Rejuvenation V14 installation (`Graphics/Battlebacks/battlebg<graphic>.png`, where `graphic` is the field definition's first graphic, i.e. what `Battle_Field.rb#backdrop` shows outside story maps). `research/extract_backdrops.py` copies exactly these files and records their source names and SHA-256 in `assets/rejuvenation/field_backdrops.json`; nothing else from the game is copied. The four custom fields have their own backdrops (`deep_dark.png`, `pale_garden.png`, `warped_forest.png`, `crimson_forest.png`, 512x288): user-supplied Minecraft screenshots, centre-cropped to 16:9 and resized without distortion by `research/custom_artwork.py`; the originals are preserved byte for byte in `research/custom-artwork/originals/` with their SHA-256 in `sources.json`, the manifest rows record their provenance, and `extract_backdrops.py` re-creates them after re-extracting the 57. No artwork is generated.

Credit: Pokémon Rejuvenation V14, a fan game by Janichroma (lead developer) and the Rejuvenation team; art credited in the game's `ReadMe_Credits.txt` to Zumi (Honnojis), Janichroma, Crimson, CeriseBlossome, Winter, Azeria, Dallas, Soulja, IronicOmens and MoonPaw. Pokémon is © Nintendo, Creatures Inc. and GAME FREAK inc. The same text ships as `assets/rejuvenation/textures/gui/field/ATTRIBUTION.txt`.

The images are client resources in the mod jar (`assets/rejuvenation/textures/gui/field/`); the datapack contains no graphics. All panel code lives in `dev.rejuvenation.client` and is loaded only through the client entrypoint; the packaging step fails if any common class references client-only classes, so a dedicated server never loads it.

## Limitations

- One panel per client battle (the battle Cobblemon's client is showing).
- A spectator who starts watching mid-battle receives the state with the next field update.
- Fields added by other datapacks without matching artwork show the No Field backdrop with their own name.
- The notes overlay needs a screen with a free mouse (Cobblemon's battle screen or chat); with only the HUD showing there is nothing to click. See [FIELD_NOTES.md](FIELD_NOTES.md).
