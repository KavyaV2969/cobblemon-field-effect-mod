package dev.rejuvenation;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.runner.ShowdownService;
import com.cobblemon.mod.common.battles.runner.graal.GraalShowdownService;
import com.google.gson.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Field-aware move evaluation for AI and UI consumers.
 *
 * Every answer comes from the simulator's own pipeline through {@code RejuvenationEngine.evaluate}, measured with
 * the battle's field state attached and detached, inside a transaction that leaves the battle untouched. Consumers
 * therefore apply exactly the field effect the battle will apply, without re-implementing any field rule.
 *
 * The simulator is driven by the server thread; calls from any other thread return no results. Answers are
 * cached per battle for the current turn and field state, and each engine call is timed.
 */
public final class FieldEvaluator {
    private FieldEvaluator() {}
    /** {@code bench}: the user is a benched Pokémon, measured as it would attack after switching in. */
    public record Query(UUID user, String move, UUID target, String gimmick, boolean range, boolean bench) {
        public Query(UUID user, String move, UUID target) { this(user, move, target, null, false, false); }
        public Query(UUID user, String move, UUID target, String gimmick, boolean range) { this(user, move, target, gimmick, range, false); }
        public Query { move = move.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", ""); }
        JsonObject json() { var o = new JsonObject(); o.addProperty("user", user.toString()); o.addProperty("move", move); o.addProperty("target", target.toString()); if (gimmick != null) o.addProperty("gimmick", gimmick); if (range) o.addProperty("range", true); if (bench) o.addProperty("bench", true); return o; }
    }

    /** One measurement (with or without the field). Missing values mean "not applicable". */
    public record Measurement(JsonObject data) {
        public boolean fails() { return bool("fails"); }
        public boolean immune() { return bool("immune"); }
        public OptionalInt maxDamage() { return integer("maxDamage"); }
        public OptionalInt maxDamageIgnoringImmunity() { return integer("maxDamageIgnoringImmunity"); }
        public OptionalInt priority() { return integer("priority"); }
        public OptionalInt basePower() { return integer("basePower"); }
        public OptionalInt typeMod() { return integer("typeMod"); }
        public OptionalInt userSpeed() { return integer("userSpeed"); }
        public OptionalInt targetSpeed() { return integer("targetSpeed"); }
        public OptionalInt critRatio() { return integer("critRatio"); }
        public Optional<String> type() { return string("type"); }
        public Optional<String> category() { return string("category"); }
        public Optional<Boolean> statusApplies() { return data.has("statusApplies") && !data.get("statusApplies").isJsonNull() ? Optional.of(data.get("statusApplies").getAsBoolean()) : Optional.empty(); }
        /** Accuracy percentage, or empty when the move cannot miss. */
        public OptionalDouble accuracy() { return data.has("accuracy") && data.get("accuracy").isJsonPrimitive() && data.get("accuracy").getAsJsonPrimitive().isNumber() ? OptionalDouble.of(data.get("accuracy").getAsDouble()) : OptionalDouble.empty(); }
        public boolean alwaysHits() { return data.has("accuracy") && data.get("accuracy").isJsonPrimitive() && data.get("accuracy").getAsJsonPrimitive().isBoolean(); }
        boolean bool(String key) { return data.has(key) && !data.get(key).isJsonNull() && data.get(key).getAsBoolean(); }
        OptionalInt integer(String key) { return data.has(key) && data.get(key).isJsonPrimitive() && data.get(key).getAsJsonPrimitive().isNumber() ? OptionalInt.of(data.get(key).getAsInt()) : OptionalInt.empty(); }
        Optional<String> string(String key) { return data.has(key) && data.get(key).isJsonPrimitive() ? Optional.of(data.get(key).getAsString()) : Optional.empty(); }
    }

    public record Result(Query query, Measurement field, Measurement nativeRules) {
        /** The field makes the move fail, makes the target immune, or makes its status effect fail. */
        public boolean fieldBlocks() { return field.fails() || field.immune() || field.statusApplies().map(b -> !b).orElse(false); }
        public boolean nativeBlocks() { return nativeRules.fails() || nativeRules.immune() || nativeRules.statusApplies().map(b -> !b).orElse(false); }
        /**
         * Multiplier that turns a native damage estimate into the field's, from the simulator's highest rolls.
         * When the native rules make the target immune by type, the native roll ignoring that immunity is the baseline.
         */
        public OptionalDouble damageFactor() {
            if (fieldBlocks()) return OptionalDouble.of(0);
            var f = field.maxDamage(); if (f.isEmpty()) return OptionalDouble.empty();
            var n = nativeRules.maxDamage().isPresent() && nativeRules.maxDamage().getAsInt() > 0 ? nativeRules.maxDamage() : nativeRules.maxDamageIgnoringImmunity();
            if (n.isEmpty() || n.getAsInt() <= 0) return OptionalDouble.empty();
            return OptionalDouble.of((double) f.getAsInt() / n.getAsInt());
        }
        /** Speed multiplier the field applies to a Pokémon, from the user's measured Speed. */
        public OptionalDouble userSpeedFactor() {
            var f = field.userSpeed(); var n = nativeRules.userSpeed();
            return f.isPresent() && n.isPresent() && n.getAsInt() > 0 ? OptionalDouble.of((double) f.getAsInt() / n.getAsInt()) : OptionalDouble.empty();
        }
        public OptionalDouble targetSpeedFactor() {
            var f = field.targetSpeed(); var n = nativeRules.targetSpeed();
            return f.isPresent() && n.isPresent() && n.getAsInt() > 0 ? OptionalDouble.of((double) f.getAsInt() / n.getAsInt()) : OptionalDouble.empty();
        }
    }

    private record TurnKey(int turn, String state) {}
    private static final class Cache { TurnKey key; final Map<Query, Result> results = new HashMap<>(); }
    private static final Map<UUID, Cache> caches = new ConcurrentHashMap<>();
    private static volatile Thread serverThread;
    private static volatile boolean warnedThread;
    private static final long SLOW_MILLIS = Long.getLong("rejuvenation.slowEvaluationMillis", 1000L);
    /** Totals for instrumentation: engine calls, queries and milliseconds, overall and per purpose. */
    private static final long[] totals = new long[3];
    private static final Map<String, long[]> byPurpose = new ConcurrentHashMap<>();

    public static void serverStarted(Thread thread) { serverThread = thread; caches.clear(); }
    public static void forget(UUID battle) { caches.remove(battle); }
    public static long[] totals() { synchronized (totals) { return totals.clone(); } }
    public static Map<String, long[]> totalsByPurpose() { synchronized (totals) { var copy = new TreeMap<String, long[]>(); byPurpose.forEach((k, v) -> copy.put(k, v.clone())); return copy; } }

    /** Cached results only; never calls the simulator. */
    public static Optional<Result> cached(UUID battle, Query query) {
        var cache = caches.get(battle);
        if (cache == null) return Optional.empty();
        synchronized (cache) { return Optional.ofNullable(cache.results.get(query)); }
    }

    /**
     * Evaluates the queries (cached ones are reused) and returns every requested result that is available.
     * Battles without an active field state return nothing, so consumers keep their native behaviour.
     */
    public static Map<Query, Result> evaluate(PokemonBattle battle, Collection<Query> queries, String purpose) {
        if (queries.isEmpty()) return Map.of();
        var state = FieldApi.current(battle.getBattleId());
        if (state.isEmpty()) return Map.of();
        if (serverThread != null && Thread.currentThread() != serverThread) {
            if (!warnedThread) { warnedThread = true; RejuvenationFields.LOG.warn("Field evaluation requested off the server thread by {}; native behaviour is kept", purpose); }
            return Map.of();
        }
        var key = new TurnKey(battle.getTurn(), state.get().toString());
        var cache = caches.computeIfAbsent(battle.getBattleId(), id -> new Cache());
        var out = new LinkedHashMap<Query, Result>();
        List<Query> missing = new ArrayList<>();
        synchronized (cache) {
            if (!key.equals(cache.key)) { cache.key = key; cache.results.clear(); }
            for (var query : new LinkedHashSet<>(queries)) { var hit = cache.results.get(query); if (hit != null) out.put(query, hit); else missing.add(query); }
        }
        if (missing.isEmpty()) return out;
        if (!(ShowdownService.Companion.getService() instanceof GraalShowdownService service) || service.context == null) return out;
        var request = new JsonArray(); for (var query : missing) request.add(query.json());
        long start = System.nanoTime();
        String text;
        try {
            text = service.getContext().getBindings("js").getMember("RejuvenationEngine").getMember("evaluate")
                .execute(battle.getBattleId().toString(), request.toString()).asString();
        } catch (Exception error) {
            RejuvenationFields.LOG.error("Field evaluation failed for {} ({} queries); native behaviour is kept", purpose, missing.size(), error);
            return out;
        }
        long millis = (System.nanoTime() - start) / 1_000_000;
        synchronized (totals) {
            totals[0]++; totals[1] += missing.size(); totals[2] += millis;
            var p = byPurpose.computeIfAbsent(purpose, k -> new long[3]); p[0]++; p[1] += missing.size(); p[2] += millis;
        }
        if (millis > SLOW_MILLIS) RejuvenationFields.LOG.warn("Field evaluation for {}: {} queries took {} ms", purpose, missing.size(), millis);
        else RejuvenationFields.LOG.debug("Field evaluation for {}: {} queries in {} ms", purpose, missing.size(), millis);
        var response = JsonParser.parseString(text).getAsJsonObject();
        var results = response.getAsJsonArray("results");
        synchronized (cache) {
            for (int i = 0; i < results.size() && i < missing.size(); i++) {
                var row = results.get(i).getAsJsonObject();
                if (row.has("error") || !row.has("withField")) continue;
                var result = new Result(missing.get(i), new Measurement(row.getAsJsonObject("withField")), new Measurement(row.getAsJsonObject("native")));
                if (key.equals(cache.key)) cache.results.put(missing.get(i), result);
                out.put(missing.get(i), result);
            }
        }
        return out;
    }
}
