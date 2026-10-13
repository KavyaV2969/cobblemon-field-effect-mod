package dev.rejuvenation;

import com.cobblemon.mod.common.CobblemonSounds;
import com.cobblemon.mod.common.api.item.PokemonSelectingItem;
import com.cobblemon.mod.common.item.CobblemonItem;
import com.cobblemon.mod.common.item.battle.BagItem;
import com.cobblemon.mod.common.pokemon.Pokemon;
import java.util.function.IntUnaryOperator;
import net.minecraft.class_1268;
import net.minecraft.class_1271;
import net.minecraft.class_1657;
import net.minecraft.class_1792;
import net.minecraft.class_1799;
import net.minecraft.class_1814;
import net.minecraft.class_1937;
import net.minecraft.class_3222;

/**
 * Rejuvenation's Reverse Candy (one level down) and Master Reverse Candy (straight to level 1). Cobblemon's Rare Candy class is final,
 * so this mirrors it: the same party-selection flow, out of battle only, one candy consumed, the same candy sound, but the level is
 * lowered through Cobblemon's own level setter (experience reset to the new level's floor, HP ratio kept) and friendship drops as in
 * Rejuvenation. A level-1 Pokémon is
 * greyed out in the selection and rejected when the candy is used on it directly.
 */
public final class ReverseCandyItem extends CobblemonItem implements PokemonSelectingItem {
    private final IntUnaryOperator targetLevel;

    public ReverseCandyItem(class_1814 rarity, IntUnaryOperator targetLevel) {
        super(new class_1792.class_1793().method_7894(rarity));
        this.targetLevel = targetLevel;
    }

    @Override public class_1271<class_1799> method_7836(class_1937 world, class_1657 user, class_1268 hand) {
        if (user instanceof class_3222 player) return use(player, user.method_5998(hand));
        return class_1271.method_22427(user.method_5998(hand));
    }

    /** No battle use, like Rare Candy. */
    @Override public BagItem getBagItem() { return null; }

    @Override public boolean canUseOnPokemon(class_1799 stack, Pokemon pokemon) { return pokemon.isPlayerOwned() && pokemon.getLevel() > 1; }

    @Override public class_1271<class_1799> applyToPokemon(class_3222 player, class_1799 stack, Pokemon pokemon) {
        // Right-clicking one's own sent-out Pokémon reaches here without the selection filter, so check again.
        if (pokemon.getLevel() <= 1) return class_1271.method_22431(stack);
        pokemon.setLevel(Math.max(1, targetLevel.applyAsInt(pokemon.getLevel())));
        // Rejuvenation's :BadCandy friendship loss (Pokemon.rb changeHappiness), once per candy; clamped at 0.
        int friendship = pokemon.getFriendship();
        pokemon.decrementFriendship(friendship < 100 ? 5 : friendship < 200 ? 4 : 3, true);
        stack.method_57008(1, player);
        var entity = pokemon.getEntity();
        if (entity != null) entity.method_5783(CobblemonSounds.MEDICINE_CANDY_USE, 1f, 1f);
        return class_1271.method_22427(stack);
    }
}
