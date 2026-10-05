package dev.rejuvenation.client;

import com.cobblemon.mod.common.api.moves.MoveTemplate;
import com.cobblemon.mod.common.api.moves.categories.DamageCategories;
import com.cobblemon.mod.common.api.moves.categories.DamageCategory;
import com.cobblemon.mod.common.api.pokemon.stats.Stats;
import com.cobblemon.mod.common.api.types.ElementalType;
import com.cobblemon.mod.common.api.types.ElementalTypes;
import com.cobblemon.mod.common.client.CobblemonClient;
import com.cobblemon.mod.common.client.battle.ClientBattlePokemon;
import net.minecraft.class_124;
import net.minecraft.class_2561;
import java.util.*;

/**
 * Client logic behind the Cobblemon Battle Extras integration (its jar is neither modified nor bundled).
 *
 * Battle Extras estimates move damage on the client from base stats. The server measures the same move with the
 * field engine and sends exact complete-hit ranges, HP denominators and critical policy. The displayed damage
 * and KO labels use those authoritative measurements; the field/native ratio is supplemental tooltip metadata.
 * Effective type, category, priority, accuracy and field-transition facts are shown from the same measurement.
 * Gimmick variants and benched Pokémon in the switch screen are requested from the server when they are shown;
 * while a measurement is pending nothing is shown instead of a field-unaware estimate. Battles without a field
 * keep Battle Extras' own values.
 */
public final class BattleExtrasFieldAdapter {
    private BattleExtrasFieldAdapter() {}
    /** The move tile being drawn: whose move it is. Set by the MoveTile render hook on the render thread. */
    private static UUID tileUser;
    private static String tileMove;
    private static String tileGimmick;
    private static MoveTemplate tileTemplate;
    private static int switchPreviewDepth;
    private static final ThreadLocal<Boolean> reentry = ThreadLocal.withInitial(() -> false);

    public static void tile(UUID user, String move, MoveTemplate template, String gimmick) {
        String normalized = move == null ? null : ClientFieldState.normalize(move);
        // Battle Extras keys its tooltip cache by the move, not the toggled gimmick (Mega/Tera keep the same template),
        // so lines computed for the previous selection must not survive a toggle on the same tile.
        if (user != null && user.equals(lastUser) && Objects.equals(normalized, lastMove) && !Objects.equals(gimmick, lastGimmick)) invalidateTooltipCache();
        if (user != null) { lastUser = user; lastMove = normalized; lastGimmick = gimmick; }
        accuracyShown = false; tileUser = user; tileMove = normalized; tileTemplate = template; tileGimmick=gimmick; tooltipScope = false;
    }
    /** Set while Battle Extras builds the drawn tile's tooltip, the only place its type chart is replaced. */
    private static boolean tooltipScope;
    public static void tooltip(boolean building) { tooltipScope = building; }

    /**
     * Battle Extras' type-chart effectiveness for the tooltip being built, replaced by the simulator's measured
     * effectiveness (field type changes and charts, added types, ability and field immunities), or NaN to keep it.
     * The same value gates whether Battle Extras asks for a damage range at all.
     */
    public static float effectivenessLabel(float original) {
        if (!tooltipScope) return Float.NaN;
        var measured = measuredEffectiveness();
        return measured.isPresent() && Math.abs(measured.get() - original) > 1e-4 ? measured.get() : Float.NaN;
    }
    /** The hovered tile's measured effectiveness when every opposing target's measurement is certain and agrees. */
    static Optional<Float> measuredEffectiveness() {
        if (switchPreviewDepth > 0 || tileUser == null || tileMove == null || ClientFieldState.current().isEmpty()) return Optional.empty();
        return certifiedEffectiveness(ClientFieldState.evaluations(tileUser, tileMove, tileGimmick));
    }
    /** Pure rule: blocked or immune is 0, otherwise 2^typeMod; an uncertain (random-type) or disagreeing set has no value. */
    public static Optional<Float> certifiedEffectiveness(List<ClientFieldState.Evaluation> all) {
        Float value = null;
        for (var e : all) {
            Float v = e.immune() || e.fieldBlocks() ? Float.valueOf(0f) : e.typeMod().isPresent() ? Float.valueOf((float) Math.pow(2, e.typeMod().getAsInt())) : null;
            if (v == null || value != null && !value.equals(v)) return Optional.empty();
            value = v;
        }
        return Optional.ofNullable(value);
    }
    /** The label Battle Extras' MoveTileMixin chooses for an effectiveness value (its thresholds 0, 0.25, 1, 4). */
    static String effectivenessKey(float value) {
        if (value == 0f) return "move.battleinfo.immune";
        if (value <= 0.25f) return "move.battleinfo.mostly_ineffective";
        if (value < 1f) return "move.battleinfo.not_effective";
        if (value == 1f) return "move.battleinfo.normal_effective";
        return value >= 4f ? "move.battleinfo.extremely_effective" : "move.battleinfo.super_effective";
    }
    /** Battle Extras' effectiveness label keys (its MoveTileMixin), removed when no certified value exists. */
    static final Set<String> EFFECTIVENESS_KEYS = Set.of("move.battleinfo.immune", "move.battleinfo.mostly_ineffective", "move.battleinfo.not_effective",
        "move.battleinfo.normal_effective", "move.battleinfo.super_effective", "move.battleinfo.extremely_effective");
    /**
     * A field battle's tile whose effectiveness is pending, uncertain or target-dependent shows no effectiveness
     * claim: the label is removed and any appended authoritative damage range is kept. Status moves without a
     * measured immunity make no effectiveness claim either way and keep Battle Extras' line.
     */
    public static List<class_2561> stripUncertifiedEffectiveness(List<class_2561> lines, List<ClientFieldState.Evaluation> all) {
        var certified = certifiedEffectiveness(all);
        if (certified.isEmpty() && !all.isEmpty() && all.stream().allMatch(e -> "Status".equals(e.category()) && !e.immune() && !e.fieldBlocks())) return lines;
        // A certified value keeps Battle Extras' label only when that label states it (it was built with the measured
        // value); a label from a stale cache or an unhooked type chart is removed instead of contradicting it.
        String expected = certified.map(BattleExtrasFieldAdapter::effectivenessKey).orElse(null);
        var out = new ArrayList<class_2561>(lines.size());
        for (var line : lines) {
            if (line.method_10851() instanceof net.minecraft.class_2588 translatable && EFFECTIVENESS_KEYS.contains(translatable.method_11022())
                && !translatable.method_11022().equals(expected)) {
                if (line.method_10855().isEmpty()) continue;
                var kept = class_2561.method_43473();
                for (var sibling : line.method_10855()) kept.method_10852(sibling);
                out.add(kept);
            } else out.add(line);
        }
        return out;
    }
    private static UUID lastUser;
    private static String lastMove, lastGimmick;
    public static void tile(UUID user,String move,MoveTemplate template) { tile(user,move,template,null); }
    public static void switchPreview(boolean entering) { switchPreviewDepth = Math.max(0, switchPreviewDepth + (entering ? 1 : -1)); }
    public static boolean reentering() { return reentry.get(); }

    /**
     * Battle Extras caches a hovered move's tooltip lines for the turn. Evaluations can arrive just after the
     * prompt opens, so its cache (a static field it adds to Cobblemon's move tile) is cleared when they do.
     */
    static void invalidateTooltipCache() {
        if (!net.fabricmc.loader.api.FabricLoader.getInstance().isModLoaded("cobblemon-battle-extras")) return;
        try {
            var field = com.cobblemon.mod.common.client.gui.battle.subscreen.BattleMoveSelection.MoveTile.class.getDeclaredField("cachedMoveTooltipTemplate");
            field.setAccessible(true); field.set(null, null);
        } catch (ReflectiveOperationException | RuntimeException ignored) { /* Cache layout changed: tooltips refresh next turn. */ }
    }
    public static void reentry(boolean value) { reentry.set(value); }

    /**
     * The effectiveness Battle Extras should use for this preview, or NaN to keep its own.
     * {@code defenderLevel}/{@code defenderBaseHp} identify the target among several opposing Pokémon.
     */
    public static float effectiveness(MoveTemplate move, float effectiveness, int defenderLevel, int defenderBaseHp) {
        if (switchPreviewDepth > 0 || move == null || tileUser == null || !ClientFieldState.normalize(move.getName()).equals(tileMove)) return Float.NaN;
        var evaluation = target(move, defenderLevel, defenderBaseHp);
        if (evaluation.isEmpty()) return Float.NaN;
        return adjustEffectiveness(effectiveness, evaluation.get());
    }

    /** Exact simulator range for the drawn tile. An ambiguous doubles target has no safe exact answer. */
    public static Optional<ClientFieldState.Evaluation> preview(MoveTemplate move, int level, int hp) {
        if (switchPreviewDepth > 0 || move == null || tileUser == null || tileMove==null) return Optional.empty();
        // Gimmick variants are measured on demand: ask once for the toggled gimmick against each opposing active.
        if (tileGimmick != null && ClientFieldState.evaluations(tileUser, tileMove, tileGimmick).isEmpty())
            for (UUID foe : opposingActives(tileUser)) ClientFieldState.evaluationOrRequest(tileUser, tileMove, foe, tileGimmick, false);
        return target(move, level, hp).filter(e -> e.minDamage().isPresent() && e.maxDamage().isPresent() && e.targetMaxHp() > 0);
    }

    /** What the switch screen should show for a benched Pokemon's move against one opponent. */
    public sealed interface BenchPreview permits BenchPreview.Exact, BenchPreview.Pending, BenchPreview.Native {
        record Exact(ExactPreview preview) implements BenchPreview {}
        /** Requested from the server; nothing is shown until the measurement arrives. */
        record Pending() implements BenchPreview {}
        /** No field in this battle: Battle Extras keeps its own estimate. */
        record Native() implements BenchPreview {}
    }
    public static BenchPreview benchPreview(UUID attacker, String move, UUID target) {
        if (attacker == null || move == null || target == null || ClientFieldState.current().isEmpty()) return new BenchPreview.Native();
        var e = ClientFieldState.evaluationOrRequest(attacker, move, target, null, true);
        if (e.isPresent() && (e.get().fieldBlocks() || e.get().minDamage().isPresent() && e.get().maxDamage().isPresent() && e.get().targetMaxHp() > 0))
            return new BenchPreview.Exact(exact(e.get()));
        return new BenchPreview.Pending();
    }

    /** The active opposing Pokemon of the side that does not contain {@code user}. */
    static List<UUID> opposingActives(UUID user) {
        var battle = CobblemonClient.INSTANCE.getBattle();
        if (battle == null) return List.of();
        var out = new ArrayList<UUID>();
        for (var side : battle.getSides()) {
            boolean own = false;
            var ids = new ArrayList<UUID>();
            for (var actor : side.getActors()) for (var active : actor.getActivePokemon()) {
                ClientBattlePokemon p = active.getBattlePokemon();
                if (p == null) continue;
                if (p.getUuid().equals(user)) own = true;
                if (p.getHpValue() > 0) ids.add(p.getUuid());
            }
            if (!own) out.addAll(ids);
        }
        return out;
    }
    public static boolean fieldPreviewContext() { return switchPreviewDepth==0 && tileUser!=null && tileMove!=null && ClientFieldState.current().isPresent(); }

    public record ExactPreview(int minPercent, int maxPercent, String koKey, int koColor, int minHits, int maxHits) {}
    /** Pure presentation of server measurements; no client damage calculations. */
    public static ExactPreview exact(ClientFieldState.Evaluation e) {
        int hp = e.targetHp(), maxHp = e.targetMaxHp();
        int min = e.fieldBlocks() ? 0 : e.minDamage().orElse(0), max = e.fieldBlocks() ? 0 : e.maxDamage().orElse(0);
        int lo = percent(Math.min(min, hp), hp, maxHp), hi = percent(Math.min(max, hp), hp, maxHp);
        String key; int color;
        if (min >= hp && hp > 0) { key = "one_hit"; color = -43691; }
        else if (max >= hp && hp > 0) { key = "possible"; color = -22016; }
        else if (max * 2 >= hp && hp > 0) { key = "two_hit_range"; color = -470992; }
        else { key = "unlikely"; color = -7829368; }
        return new ExactPreview(lo, hi, "move.battleinfo.ko." + key, color, Math.max(1,e.minHits()), Math.max(1,e.maxHits()));
    }
    private static int percent(int damage, int hp, int maxHp) { return maxHp <= 0 ? 0 : (int)(damage == hp ? Math.ceil(damage * 100.0 / maxHp) : Math.round(damage * 100.0 / maxHp)); }

    /** The pure correction: Battle Extras' effectiveness input scaled by the measured field effect, or NaN to keep it. */
    public static float adjustEffectiveness(float effectiveness, ClientFieldState.Evaluation e) {
        if (e.fieldBlocks()) return effectiveness == 0f ? Float.NaN : 0f;
        if (e.factor().isEmpty()) return Float.NaN;
        double factor = e.factor().getAsDouble();
        // A native immunity (effectiveness 0) the field removes: the ratio is relative to the immunity-free baseline.
        float adjusted = effectiveness > 0 ? (float) (effectiveness * factor) : (float) factor;
        return Math.abs(adjusted - effectiveness) < 1e-4 ? Float.NaN : adjusted;
    }

    static Optional<ClientFieldState.Evaluation> target(MoveTemplate move, int level, int baseHp) {
        var all = ClientFieldState.evaluations(tileUser, tileMove, tileGimmick);
        if (all.size() <= 1) return all.stream().findFirst();
        var battle = CobblemonClient.INSTANCE.getBattle();
        if (battle == null) return Optional.empty();
        var matches = new ArrayList<ClientFieldState.Evaluation>();
        for (var e : all) for (var side : battle.getSides()) for (var actor : side.getActors()) for (var active : actor.getActivePokemon()) {
            ClientBattlePokemon p = active.getBattlePokemon();
            if (p == null || !p.getUuid().equals(e.target())) continue;
            Integer hp = p.getSpecies().getBaseStats().get(Stats.HP);
            if (hp != null && hp == baseHp && (level <= 0 || p.getLevel() == level)) matches.add(e);
        }
        return matches.size()==1?Optional.of(matches.getFirst()):Optional.empty();
    }

    private static Optional<ClientFieldState.Evaluation> hovered() {
        if (switchPreviewDepth > 0 || tileUser == null || tileMove == null) return Optional.empty();
        return ClientFieldState.evaluations(tileUser, tileMove, tileGimmick).stream().findFirst();
    }

    private static boolean accuracyShown;
    /** Battle Extras' displayed accuracy for the hovered tile, replaced by the measured field accuracy. */
    public static double accuracy(double original) {
        var e = hovered();
        if (e.isEmpty() || e.get().accuracy().isEmpty() || e.get().accuracy().getAsDouble() < 0) return original;
        accuracyShown = true;
        return e.get().accuracy().getAsDouble();
    }

    /** The tooltip's type icon/colour follows the type the move will actually have. */
    public static ElementalType type(ElementalType original) {
        return hovered().map(e -> e.type() == null ? null : ElementalTypes.get(e.type().toLowerCase(Locale.ROOT))).filter(Objects::nonNull).orElse(original);
    }
    public static DamageCategory category(DamageCategory original) {
        return hovered().map(e -> e.category() == null ? null : switch (e.category()) {
            case "Physical" -> DamageCategories.INSTANCE.getPHYSICAL(); case "Special" -> DamageCategories.INSTANCE.getSPECIAL(); case "Status" -> DamageCategories.INSTANCE.getSTATUS(); default -> null; }).orElse(original);
    }
    public static int typeColour(int original, ElementalType original0) {
        var type = type(original0);
        return type != null && type != original0 ? type.getHue() : original;
    }

    /** One line naming the field and what it changes for the hovered move. */
    public static List<class_2561> lines(List<class_2561> lines) {
        var template = tileTemplate;
        if (fieldPreviewContext()) lines = stripUncertifiedEffectiveness(lines, ClientFieldState.evaluations(tileUser, tileMove, tileGimmick));
        var evaluation = hovered();
        var state = ClientFieldState.current();
        if (evaluation.isEmpty() || state.isEmpty()) return lines;
        var e = evaluation.get();
        List<String> parts = new ArrayList<>();
        if (e.fieldBlocks()) parts.add(e.category() != null && e.category().equals("Status") ? "fails" : "blocked");
        else {
            if (e.factor().isPresent() && Math.abs(e.factor().getAsDouble() - 1) > 0.005) parts.add(String.format(Locale.ROOT, "×%.2f damage", e.factor().getAsDouble()));
            if (e.type() != null && e.nativeType() != null && !e.type().equals(e.nativeType())) parts.add(e.type() + "-type");
            if (e.category() != null && e.nativeCategory() != null && !e.category().equals(e.nativeCategory())) parts.add(e.category());
            if (template != null && e.priority().isPresent() && e.priority().getAsInt() != template.getPriority())
                parts.add("priority " + (e.priority().getAsInt() > 0 ? "+" : "") + e.priority().getAsInt());
            if (!accuracyShown && template != null && e.accuracy().isPresent() && e.accuracy().getAsDouble() >= 0 && template.getAccuracy() > 0 && Math.abs(e.accuracy().getAsDouble() - template.getAccuracy()) > 0.5)
                parts.add(String.format(Locale.ROOT, "%.0f%% accuracy", e.accuracy().getAsDouble()));
            if (e.statusApplies().isPresent() && !e.statusApplies().get()) parts.add("status fails");
        }
        if (e.changesFieldTo() != null) parts.add("→ " + e.changesFieldTo());
        if (parts.isEmpty()) return lines;
        var out = new ArrayList<>(lines);
        out.add(class_2561.method_43470(state.get().name() + ": " + String.join(" · ", parts)).method_27692(e.fieldBlocks() ? class_124.field_1061 : class_124.field_1075));
        return out;
    }
}
