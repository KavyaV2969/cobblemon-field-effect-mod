# Compatibility limits

This file records current dependency/platform differences. It does not turn unfinished porting work into an API limitation; that work is tracked in REMAINING_WORK.md and the field review ledger.

## Absent battle registry entries

The installed simulator plus inspected addon registry resources do not define these 27 referenced move IDs:

```text
aquabatics arenitewall coldtruth doomdummy eartpower feverpitch
futuredummy galestrike gildedarrow gildedhelix hexingslash magmadrift
magnetflux matrixshot mirrorbeam mudbarrage multipulse powdermove
quicksilverspear radiantclaw shadowpanic shadowsky slashandburn
spectralscream stealtrock ultramegadeath vorpalblade
```

The field rules retain the original IDs. Some are Rejuvenation-only attacks or internal dummy moves; some are misspelled source references. Silently converting `eartpower` to `earthpower`, for example, would change the actual shipped game's behavior. `reference-validation.json` gives every affected field/location. The engine cannot execute an unregistered move; a separate compatible move definition is required for those branches to trigger. Registration is technically possible and has not been implemented for these attacks.

`souleater`, `tempest`, `eelevate`, `gravitycontrol` and `hailwarning` are likewise absent from the installed ability registry. `megasol` is supplied by ZA Mega and is included in the addon-aware validation. All currently referenced held items resolve after this mod's four Seeds, Amulet Coin and Amplifield Rock are included. Amulet Coin implements its Dragon's Den field immunity. Field-dependent money handlers still require semantic review and are listed in remaining implementation work; they are not closed merely because Minecraft uses a different reward system.

## Game-specific states

The installed type chart does not register Rejuvenation's Shadow type. Fields can retain its declarations, but stock Cobblemon PokÃ©mon/moves do not possess that attacking type. Rejuvenation-specific regional/custom forms, boss shield/immunity data and story-controlled environmental states do not exist as equivalent inputs in the installed battle model. Crests and custom moves are explicitly excluded from this continuation, rather than treated as technical failures. Ordinary chess party roles are assigned by the port's party-role resolver. Their identities must be supplied by an explicit additional integration before those predicates have meaningful inputs. This is not a claim that Cobblemon can never be extended to support them.

Petrification now has a registered Java persistent status and a simulator condition. Native status/cure instructions carry client updates and party persistence; its long-lived status does not expire through native second ticks. Focused simulator and shaded Graal tests cover immunity, healing prevention, movement, damage, aura draining, source field moves and Perish Body replacement. Focused live checking of this newly added status and cure-message mixin is still verification work, not a known incompatibility.

## AI and presentation

Run & Bun's separate Java evaluator does not consume simulator pseudo-weather callbacks. A correct adapter requires a complete field evaluation context; no such public hook was found in this installed version. See TRAINER_INTEGRATION.md. Trainer definitions remain untouched and opt out by default.

Holy Silvally uses the native Dark form, and Glitch's unknown-type semantics execute without its unavailable custom form model. New World uses all 18 ordinary native forms and restores held-item forms at the next source form check. Field graphics, battle-background transformations and original RPG Maker animations are not distributed. Flavor text is dispatched through Cobblemon's ordered battle-chat mechanism. The build does not reproduce the original game's graphical effects. No local Rejuvenation game archive or unrelated game assets are packaged.

## Verification boundary

The mod compiles against the actual installed ABI and the engine boots in Cobblemon's actual shaded Graal runtime. Simulator tests include singles, doubles, complete turns, simultaneous battles and cleanup. An isolated Fabric integrated-server session applies the mixin, loads all 57 field definitions and exports 70 live biome IDs, all explicitly mapped. Five real Cobblemon battles verify natural and explicit selection, ordered original entry text, Forest Growth, the existing Minecraft Everstone bridge, custom Seed activation/consumption, field-aware Dive/Dusk capture events and state cleanup. `research/test-results/live-startup.json` fingerprints the tested jar; `live-battle.json` contains the assertions. These representative checks do not certify all field mechanics. Two-client UI/message ordering and network disconnect cases have not yet been exercised. These remain verification work, rather than proven compatibility failures.
