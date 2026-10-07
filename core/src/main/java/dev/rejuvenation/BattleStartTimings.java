package dev.rejuvenation;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Battle-start instrumentation for the field engine's two server-thread steps: the environment capture at
 * Cobblemon's pre-start event and the simulator start hook (catalog fallback publication, resolution and the
 * {@code >start} option rewrite). Each battle start is logged at DEBUG; a start whose field work exceeds
 * {@code -Drejuvenation.slowStartMillis} (default 50 ms) is logged at WARN with the breakdown, so a pathological
 * lookup is visible in an ordinary game log. The last records are kept for the live verification fixture.
 */
public final class BattleStartTimings {
    private BattleStartTimings() {}
    public record Record(UUID battle, long environmentNanos, long simulatorNanos, boolean publishedCatalog, String field, String source) {
        public double totalMillis() { return (environmentNanos + simulatorNanos) / 1e6; }
    }
    private record Environment(long nanos, EnvironmentResolver.Result result) {}
    private static final long SLOW_NANOS = Long.getLong("rejuvenation.slowStartMillis", 50L) * 1_000_000L;
    private static final Map<UUID, Environment> environments = new ConcurrentHashMap<>();
    private static final Deque<Record> recent = new ArrayDeque<>();

    static void environment(UUID battle, long nanos, EnvironmentResolver.Result result) { environments.put(battle, new Environment(nanos, result)); }

    public static void simulator(UUID battle, long nanos, boolean published, String field, String source) {
        var environment = environments.remove(battle);
        var record = new Record(battle, environment == null ? 0 : environment.nanos(), nanos, published, field, source);
        synchronized (recent) { recent.addLast(record); while (recent.size() > 32) recent.removeFirst(); }
        if (environment != null && RejuvenationFields.LOG.isDebugEnabled())
            RejuvenationFields.LOG.debug("Environment field {} via {} ({})", environment.result().field(), environment.result().source(), environment.result().reason());
        String text = String.format(Locale.ROOT, "Battle %s field start: %s via %s; environment %.2f ms, simulator hook %.2f ms%s",
            battle, field, source, record.environmentNanos() / 1e6, nanos / 1e6, published ? " (catalog published at battle start)" : "");
        if (record.environmentNanos() + nanos > SLOW_NANOS || published) RejuvenationFields.LOG.warn(text);
        else RejuvenationFields.LOG.debug(text);
    }
    public static void discard(UUID battle) { environments.remove(battle); }
    public static List<Record> recent() { synchronized (recent) { return List.copyOf(recent); } }
}
