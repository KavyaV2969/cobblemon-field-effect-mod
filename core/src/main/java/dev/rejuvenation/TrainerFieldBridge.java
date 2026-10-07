package dev.rejuvenation;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.actor.PlayerBattleActor;
import com.cobblemon.mod.common.pokemon.OriginalTrainerType;

/**
 * Starts league trainer battles on their assigned field (datapack rejuvenation/trainers/*.json).
 * Radical Cobblemon Trainers stamps "&lt;registry&gt;#&lt;trainer id&gt;" as the NPC original trainer of every
 * team Pokemon (TrainerNPC.initTeam). Reading that tag needs no RCT dependency and leaves trainer
 * teams, AI and series files untouched. An EXPLICIT selection still overrides it.
 */
public final class TrainerFieldBridge {
    private TrainerFieldBridge() {}

    /** The RCT trainer ID inside an original-trainer tag, or null when the tag is not an RCT one. */
    public static String trainerId(String originalTrainer) {
        if (originalTrainer == null) return null;
        int separator = originalTrainer.lastIndexOf('#');
        return separator < 0 || separator == originalTrainer.length() - 1 ? null : originalTrainer.substring(separator + 1);
    }

    public static void select(PokemonBattle battle) {
        var trainers = RejuvenationFields.catalog.data().getAsJsonObject("trainers");
        if (trainers == null || trainers.isEmpty()) return;
        for (var actor : battle.getActors()) {
            if (actor instanceof PlayerBattleActor) continue;
            for (var pokemon : actor.getPokemonList()) {
                var original = pokemon.getOriginalPokemon();
                if (original.getOriginalTrainerType() != OriginalTrainerType.NPC) continue;
                String id = trainerId(original.getOriginalTrainer());
                if (id == null || !trainers.has(id)) continue;
                String field = trainers.getAsJsonObject(id).get("field").getAsString();
                FieldApi.select(battle.getBattleId(), FieldApi.Priority.TRAINER, field);
                RejuvenationFields.LOG.info("Trainer {} battles on {}", id, field);
                return;
            }
        }
    }
}
