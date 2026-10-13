package dev.rejuvenation;

import com.cobblemon.mod.common.Cobblemon;
import com.cobblemon.mod.common.api.Priority;
import com.cobblemon.mod.common.api.events.CobblemonEvents;
import com.cobblemon.mod.common.api.events.pokemon.EvGainedEvent;
import com.cobblemon.mod.common.api.pokemon.stats.BattleEvSource;
import com.cobblemon.mod.common.api.pokemon.stats.EvCalculator;
import com.cobblemon.mod.common.api.pokemon.stats.SidemodEvSource;
import com.cobblemon.mod.common.api.pokemon.stats.Stat;
import com.cobblemon.mod.common.api.pokemon.stats.Stats;
import com.cobblemon.mod.common.api.tags.CobblemonItemTags;
import com.cobblemon.mod.common.battles.pokemon.BattlePokemon;
import com.cobblemon.mod.common.pokemon.EVs;
import java.util.Map;
import java.util.function.Consumer;
import java.util.function.Supplier;
import net.minecraft.class_124;
import net.minecraft.class_1799;
import net.minecraft.class_2561;

/**
 * EV Training Cards (Rejuvenation's HP, Attack, Defense, Sp. Atk, Sp. Def and Speed Cards) and the battle-EV rules that come with them.
 *
 * <p>Cobblemon 1.7.3 awards battle EVs once per battle, in {@code PokemonBattle.end()}: for every fainted Pokémon and every surviving Pokémon
 * on the other side that faced it (or holds an Exp. Share), it calls {@code Cobblemon.evYieldCalculator.calculate(recipient, fainted)} once,
 * then {@code EVs.add(stat, amount, BattleEvSource)} once per entry of the returned map. {@code EVs.add} fires {@code EV_GAINED_EVENT_PRE}
 * per stat, then clamps to 252 per stat and 510 in total. The event alone cannot tell which knockout an EV belongs to, so a Pokémon that
 * normally yields two stats would get two events. The calculator call is the only per-knockout, per-recipient point; CaptureXP's in-battle
 * capture reward calls the same calculator.
 *
 * <p>{@link Calculator} wraps whatever calculator is installed and returns, for each call:
 * <ul><li>nothing for an Exp. Share holder (no natural yield, no card reward; its experience is untouched);</li>
 * <li>exactly {card stat: min(32, 252 - stat EVs, 510 - total EVs)} for a card holder, without consulting the natural yield;</li>
 * <li>the wrapped calculator's own result for everyone else.</li></ul>
 * Nothing is awarded and then taken back, and the decision is stateless, so a repeated call cannot stack rewards.
 *
 * <p>A LOWEST-priority {@code EV_GAINED_EVENT_PRE} guard keeps the battle EVs of card and Exp. Share holders within those rules if an earlier
 * listener (a datapack MoLang callback, another mod) raised them or added another stat. It only lowers or cancels, so it can neither add EVs
 * nor recurse. Vitamins, feathers, berries, Mochi and commands use other EV sources, which neither hook touches.
 */
public final class EvCards {
    public static final int AWARD = 32;

    /** One card: its item ID, the stat it trains and the Cobblemon Power Item it is smithed from. */
    public enum Card {
        HP("hp_ev_card", Stats.HP, "power_weight"),
        ATTACK("attack_ev_card", Stats.ATTACK, "power_bracer"),
        DEFENCE("defence_ev_card", Stats.DEFENCE, "power_belt"),
        SPECIAL_ATTACK("special_attack_ev_card", Stats.SPECIAL_ATTACK, "power_lens"),
        SPECIAL_DEFENCE("special_defence_ev_card", Stats.SPECIAL_DEFENCE, "power_band"),
        SPEED("speed_ev_card", Stats.SPEED, "power_anklet");

        public final String id, powerItem;
        public final Stats stat;

        Card(String id, Stats stat, String powerItem) { this.id = id; this.stat = stat; this.powerItem = powerItem; }
    }

    private EvCards() {}

    /** The card reward a Pokémon can still take: {@code max(0, min(32, 252 - stat EVs, 510 - total EVs))}. */
    public static int award(int statEvs, int totalEvs) {
        return Math.max(0, Math.min(AWARD, Math.min(EVs.MAX_STAT_VALUE - statEvs, EVs.MAX_TOTAL_VALUE - totalEvs)));
    }

    /**
     * The battle EVs one recipient takes for one defeated Pokémon. {@code cardStat} is null without a card; {@code natural} is only asked
     * when neither an Exp. Share nor a card decides the result.
     */
    public static <S> Map<S, Integer> reward(boolean expShare, S cardStat, int cardStatEvs, int totalEvs, Supplier<Map<S, Integer>> natural) {
        if (expShare) return Map.of();
        if (cardStat == null) return natural.get();
        int amount = award(cardStatEvs, totalEvs);
        return amount > 0 ? Map.of(cardStat, amount) : Map.of();
    }

    /** The amount a battle EV event of a card or Exp. Share holder may keep (0 cancels it); never more than it asked for. */
    public static <S> int guard(boolean expShare, S cardStat, S stat, int amount, int statEvs, int totalEvs) {
        if (expShare) return 0;
        if (cardStat == null) return amount;
        if (!cardStat.equals(stat)) return 0;
        return Math.min(amount, award(statEvs, totalEvs));
    }

    static Card card(class_1799 held) { return held.method_7909() instanceof EvCardItem item ? item.card : null; }

    static boolean expShare(class_1799 held) { return held.method_31573(CobblemonItemTags.EXPERIENCE_SHARE); }

    /** Wraps the installed EV yield calculator; see the class comment. */
    public static final class Calculator implements EvCalculator {
        final EvCalculator delegate;

        Calculator(EvCalculator delegate) { this.delegate = delegate; }

        @Override public Map<Stat, Integer> calculate(BattlePokemon recipient, BattlePokemon defeated) {
            var pokemon = recipient.getEffectedPokemon();
            var held = pokemon.heldItemNoCopy$common();
            var card = card(held);
            var evs = pokemon.getEvs();
            return reward(expShare(held), card == null ? null : (Stat) card.stat, card == null ? 0 : evs.getOrDefault(card.stat), evs.total(),
                () -> delegate.calculate(recipient, defeated));
        }
    }

    private static EvCalculator installed;

    /**
     * Wraps the current calculator unless it is already the one installed here. Called at start-up and again before every battle, so a
     * calculator another mod sets later is wrapped too (once: wrapping that mod's wrapper of ours is harmless, the decision is idempotent).
     */
    public static synchronized void install() {
        var current = Cobblemon.INSTANCE.getEvYieldCalculator();
        if (current == installed) return;
        installed = new Calculator(current);
        Cobblemon.INSTANCE.setEvYieldCalculator(installed);
    }

    public static void register() {
        install();
        CobblemonEvents.EV_GAINED_EVENT_PRE.subscribe(Priority.LOWEST, (Consumer<EvGainedEvent.Pre>) EvCards::guard);
        CobblemonEvents.EV_GAINED_EVENT_POST.subscribe(Priority.NORMAL, (Consumer<EvGainedEvent.Post>) EvCards::feedback);
    }

    private static void guard(EvGainedEvent.Pre event) {
        if (event.isCanceled() || !(event.getSource() instanceof BattleEvSource)) return;
        var pokemon = event.getPokemon();
        var held = pokemon.heldItemNoCopy$common();
        var card = card(held);
        boolean share = expShare(held);
        if (card == null && !share) return;
        var evs = pokemon.getEvs();
        int amount = guard(share, card == null ? null : (Stat) card.stat, event.getStat(), event.getAmount(), evs.getOrDefault(event.getStat()), evs.total());
        if (amount <= 0) event.cancel();
        else if (amount != event.getAmount()) event.setAmount(amount);
    }

    /** One grey chat line to the owner per card reward, saying when the stat is maxed. */
    private static void feedback(EvGainedEvent.Post event) {
        if (event.getAmount() <= 0 || !(event.getSource() instanceof BattleEvSource || event.getSource() instanceof SidemodEvSource)) return;
        var pokemon = event.getPokemon();
        var card = card(pokemon.heldItemNoCopy$common());
        if (card == null || !card.stat.equals(event.getStat())) return;
        var player = pokemon.getOwnerPlayer();
        if (player == null) return;
        int now = pokemon.getEvs().getOrDefault(card.stat);
        player.method_43496(class_2561.method_43469(now >= EVs.MAX_STAT_VALUE ? "message.rejuvenation.ev_card.maxed" : "message.rejuvenation.ev_card.gained",
            pokemon.getDisplayName(false), event.getAmount(), card.stat.getDisplayName(), now).method_27692(class_124.field_1080));
    }
}
