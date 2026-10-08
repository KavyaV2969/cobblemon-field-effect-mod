package dev.rejuvenation.compat;

import com.cobblemon.mod.common.api.pokemon.stats.Stat;
import com.cobblemon.mod.common.api.pokemon.stats.Stats;
import com.cobblemon.mod.common.pokemon.Pokemon;
import com.cobblemon.mod.common.pokemon.OriginalTrainerType;
import dev.rejuvenation.compat.mixin.BlueNpcStatsAccessor;
import java.util.Map;

/** The user-authored Blue NPC encounter has 252 EVs in every stat. No global EV-limit change. */
public final class BlueNpcEvPolicy {
    private BlueNpcEvPolicy() {}
    public static boolean matches(boolean npc, String tag) {
        return npc && tag != null && tag.endsWith("#kanto_champion_blue");
    }
    public static void applyStats(Map<Stat, Integer> stats) {
        for (Stats stat : new Stats[] {Stats.HP, Stats.ATTACK, Stats.DEFENCE, Stats.SPECIAL_ATTACK, Stats.SPECIAL_DEFENCE, Stats.SPEED})
            stats.put(stat, 252);
    }
    public static boolean matches(Pokemon pokemon) {
        return matches(pokemon.getOriginalTrainerType() == OriginalTrainerType.NPC, pokemon.getOriginalTrainer());
    }
    public static void apply(Pokemon pokemon) {
        var evs = pokemon.getEvs();
        applyStats(((BlueNpcStatsAccessor) (Object) evs).rejuvenation$stats());
        evs.update();
    }
}
