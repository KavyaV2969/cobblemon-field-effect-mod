package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.pokemon.stats.Stat;
import com.cobblemon.mod.common.pokemon.PokemonStats;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.gen.Accessor;
import java.util.Map;

@Mixin(value = PokemonStats.class, remap = false)
public interface BlueNpcStatsAccessor {
    @Accessor("stats")
    Map<Stat, Integer> rejuvenation$stats();
}
