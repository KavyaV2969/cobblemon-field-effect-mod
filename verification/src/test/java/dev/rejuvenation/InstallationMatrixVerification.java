package dev.rejuvenation;

import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipFile;

/**
 * Installation combinations of the two built jars, checked by linking their real classes against classpaths that contain exactly the
 * mods of each combination: core alone, core + compat with no third-party mods, and with each of Run &amp; Bun, RCT API and Battle Extras
 * present (independently, then all together). Classes that name a third-party class (the gated ones) must be the only ones that need it;
 * everything else must load and initialize without it, so an absent dependency can never cause a linkage error. Mixin classes are
 * linked (verified and resolved) without being applied, and the presence gate of every mixin is evaluated for every combination.
 * This is an offline proxy for the real game's mod discovery and Mixin application, not a live run.
 */
public final class InstallationMatrixVerification {
    private static int checks;
    private static void check(boolean ok, String message) { if (!ok) throw new AssertionError(message); checks++; }

    private static final String[] OPTIONAL = {"rbrctai-fabric", "rctapi-fabric", "cobblemon-battle-extras-fabric"};
    private static final List<String> CORE_NEVER = List.of("rejuvenation/compat", "com/gitlab/surilexa/rbrctai", "com/gitlab/srcmc/rctapi", "name/modid/");
    /** The only compat classes allowed to name a third-party class, and which mod each needs. */
    private static final java.util.Map<String, String> GATED = java.util.Map.of(
        "dev/rejuvenation/compat/RctGimmickDeclarations", "rctapi-fabric",
        "dev/rejuvenation/compat/mixin/RunBunDecisionMixin", "rbrctai-fabric",
        "dev/rejuvenation/compat/mixin/RunBunMathMixin", "rbrctai-fabric");

    private static List<String> classes(File jar) throws IOException {
        var out = new ArrayList<String>();
        try (var zip = new ZipFile(jar)) {
            zip.stream().filter(e -> e.getName().endsWith(".class")).forEach(e -> out.add(e.getName().substring(0, e.getName().length() - 6)));
        }
        return out;
    }
    private static String text(File jar, String entry) throws IOException {
        try (var zip = new ZipFile(jar)) { return new String(zip.getInputStream(zip.getEntry(entry)).readAllBytes(), java.nio.charset.StandardCharsets.UTF_8); }
    }
    private static boolean mentions(File jar, String className, String needle) throws IOException {
        try (var zip = new ZipFile(jar)) {
            return new String(zip.getInputStream(zip.getEntry(className + ".class")).readAllBytes(), java.nio.charset.StandardCharsets.ISO_8859_1).contains(needle);
        }
    }

    /** A loader for the named jars over the profile's dependencies, minus the optional mods that this combination lacks. */
    private static URLClassLoader loader(File deps, List<File> jars, Set<String> present) throws Exception {
        var urls = new ArrayList<URL>();
        for (File jar : jars) urls.add(jar.toURI().toURL());
        for (File dep : deps.listFiles((d, n) -> n.endsWith(".jar"))) {
            boolean optional = false, wanted = false;
            for (String name : OPTIONAL) if (dep.getName().startsWith(name)) { optional = true; wanted = present.contains(name); }
            if (!optional || wanted) urls.add(dep.toURI().toURL());
        }
        return new URLClassLoader(urls.toArray(URL[]::new), ClassLoader.getPlatformClassLoader());
    }

    /** True when the class links: loads, resolves its members and (if `initialize`) runs its static initializer. */
    private static boolean links(ClassLoader loader, String name, boolean initialize) {
        try {
            Class<?> c = Class.forName(name.replace('/', '.'), initialize, loader);
            c.getDeclaredMethods(); c.getDeclaredFields(); c.getDeclaredConstructors();
            return true;
        } catch (LinkageError | ReflectiveOperationException error) { return false; }
    }

    public static void main(String[] args) throws Exception {
        var repo = Layout.repo();
        var version = Files.readString(repo.resolve("gradle.properties")).lines().filter(l -> l.startsWith("version=")).findFirst().orElseThrow().substring(8).trim();
        var core = repo.resolve("dist/rejuvenation-fields-" + version + ".jar").toFile();
        var compat = repo.resolve("dist/rejuvenation-fields-compat-" + version + ".jar").toFile();
        var deps = repo.resolve("build/deps").toFile();
        check(core.isFile() && compat.isFile(), "both jars are built (run Gradle :core:jar :compat:jar)");

        // 1. Static separation of the two jars.
        var coreClasses = classes(core);
        for (String name : coreClasses) for (String never : CORE_NEVER) check(!name.contains(never) && !mentions(core, name, never), "core class " + name + " must not reference " + never);
        check(coreClasses.stream().noneMatch(n -> n.contains("AIBattleActor")), "core has no AI actor hook");
        check(!text(core, "rejuvenation.mixins.json").contains("TrainerDecisionMixin"), "the global NPC policy hook is not a core mixin");
        var coreMeta = JsonParser.parseString(text(core, "fabric.mod.json")).getAsJsonObject();
        var compatMeta = JsonParser.parseString(text(compat, "fabric.mod.json")).getAsJsonObject();
        check(coreMeta.get("id").getAsString().equals("rejuvenation_fields") && coreMeta.get("version").getAsString().equals(version), "core id and version");
        check(compatMeta.get("id").getAsString().equals("rejuvenation_fields_compat") && compatMeta.get("version").getAsString().equals(version), "compat id and version");
        check(!coreMeta.getAsJsonObject("depends").has("rejuvenation_fields_compat") && !coreMeta.has("suggests"), "core does not depend on or suggest compat or third-party mods");
        check(compatMeta.getAsJsonObject("depends").get("rejuvenation_fields").getAsString().equals(">=" + version + " <0.2"), "compat requires the matching core");
        var compatClasses = classes(compat);
        check(compatClasses.stream().allMatch(n -> n.startsWith("dev/rejuvenation/compat/")), "compat contains only compat classes");
        check(compatClasses.stream().noneMatch(n -> n.equals("dev/rejuvenation/RejuvenationFields") || n.contains("/net/") || n.contains("Catalog") || n.contains("SimulatorCatalog")), "compat has no second engine, catalog loader or registry");
        try (var zip = new ZipFile(compat)) {
            check(zip.stream().noneMatch(e -> e.getName().equals("rejuvenation-engine.js") || e.getName().startsWith("assets/") || e.getName().startsWith("data/")), "compat carries no engine, assets or data");
        }
        // Gated classes are exactly the ones that name a third-party class.
        var optionalNames = List.of("com/gitlab/surilexa/rbrctai", "com/gitlab/srcmc/rctapi", "name/modid/");
        for (String name : compatClasses) {
            boolean names = false;
            for (String needle : optionalNames) names |= mentions(compat, name, needle);
            boolean gated = GATED.containsKey(name) || name.contains("/mixin/BattleExtras") || name.equals("dev/rejuvenation/compat/client/BattleExtrasFieldAdapter") || name.equals("dev/rejuvenation/compat/client/BattleExtrasLogBounds") || name.equals("dev/rejuvenation/compat/mixin/RunBunScoreMixin");
            if (names) check(gated, name + " names a third-party class but is not a gated class");
        }

        // 2. Linkage per combination.
        var combos = new ArrayList<Set<String>>();
        combos.add(Set.of());
        for (String one : OPTIONAL) combos.add(Set.of(one));
        combos.add(Set.of(OPTIONAL));
        var report = new JsonArray();
        for (var present : combos) {
            try (var coreOnly = loader(deps, List.of(core), present)) {
                for (String name : coreClasses) {
                    boolean client = name.startsWith("dev/rejuvenation/client/") || name.startsWith("dev/rejuvenation/mixin/");
                    check(links(coreOnly, name, !client && !name.contains("$")), "core class links with only {core, " + present + "}: " + name);
                }
            }
            try (var both = loader(deps, List.of(core, compat), present)) {
                for (String name : compatClasses) {
                    String needs = GATED.get(name);
                    boolean mixin = name.contains("/mixin/");
                    boolean client = name.contains("/client/");
                    boolean available = needs == null || present.stream().anyMatch(p -> p.startsWith(needs));
                    // Classes without third-party references must always link; gated ones link when their mod is present.
                    boolean touchesThirdParty = false;
                    for (String needle : optionalNames) touchesThirdParty |= mentions(compat, name, needle);
                    if (!touchesThirdParty) check(links(both, name, !mixin && !client && !name.contains("$")), "compat class links without any third-party mod: " + name);
                    else if (needs != null && available) check(links(both, name, false), name + " links when " + needs + " is present");
                    // Negative control: the loader really lacks the absent mod, so a missing dependency is detectable.
                    if (name.equals("dev/rejuvenation/compat/RctGimmickDeclarations") && !available) check(!links(both, name, false), "RCT declarations must not link without rctapi (control)");
                }
            }
            var row = new JsonObject();
            row.add("thirdPartyMods", new GsonBuilder().create().toJsonTree(present.stream().sorted().toList()));
            row.addProperty("coreClassesLinked", coreClasses.size());
            row.addProperty("compatClassesChecked", compatClasses.size());
            report.add(row);
        }

        // 3. The presence gate of every mixin, for every combination (8 combinations of the three optional mods).
        int gates = 0;
        var mixins = JsonParser.parseString(text(compat, "rejuvenation-compat.mixins.json")).getAsJsonObject();
        var names = new ArrayList<String>();
        for (String section : List.of("mixins", "client")) mixins.getAsJsonArray(section).forEach(e -> names.add(e.getAsString()));
        for (int mask = 0; mask < 8; mask++) {
            var installed = new java.util.HashSet<String>();
            if ((mask & 1) != 0) installed.add("rbrctai"); if ((mask & 2) != 0) installed.add("rctapi"); if ((mask & 4) != 0) installed.add("cobblemon-battle-extras");
            for (String mixin : names) {
                boolean expected = mixin.startsWith("BlueNpc") ? installed.contains("rctapi")
                    : mixin.startsWith("RunBun") ? installed.contains("rbrctai") : !mixin.startsWith("BattleExtras") || installed.contains("cobblemon-battle-extras");
                check(dev.rejuvenation.compat.CompatMixinPlugin.enabled("dev.rejuvenation.compat.mixin." + mixin, installed::contains) == expected, "gate of " + mixin + " for " + installed);
                gates++;
            }
        }
        // Battle Extras mixins are client-only; the global policy and Run & Bun hooks are common.
        for (var e : mixins.getAsJsonArray("client")) check(e.getAsString().startsWith("BattleExtras"), "only Battle Extras mixins are client-side: " + e);
        for (var e : mixins.getAsJsonArray("mixins")) check(!e.getAsString().startsWith("BattleExtras"), "no Battle Extras mixin is applied on a dedicated server: " + e);
        check(compatMeta.getAsJsonObject("entrypoints").has("client") && !compatMeta.getAsJsonObject("entrypoints").has("main"), "compat registers only a client entrypoint (nothing second registers items, packets or catalogs)");

        var receipt = new JsonObject();
        receipt.addProperty("version", version);
        receipt.addProperty("checks", checks);
        receipt.addProperty("mixinGateEvaluations", gates);
        receipt.add("combinations", report);
        receipt.addProperty("scope", "Offline linkage of the built jars against classpaths of each mod combination plus static separation checks; the real game's Fabric discovery and Mixin application are not executed.");
        if (args.length > 0) Files.writeString(Path.of(args[0]), new GsonBuilder().setPrettyPrinting().create().toJson(receipt) + "\n");
        System.out.println("PASS installation matrix: " + checks + " checks over " + combos.size() + " classpath combinations and " + gates + " mixin gate evaluations");
    }
}
