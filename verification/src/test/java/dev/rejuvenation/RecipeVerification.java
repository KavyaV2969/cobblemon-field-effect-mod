package dev.rejuvenation;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.mojang.serialization.JsonOps;
import net.minecraft.class_1792;
import net.minecraft.class_1799;
import net.minecraft.class_1865;
import net.minecraft.class_1869;
import net.minecraft.class_2370;
import net.minecraft.class_2378;
import net.minecraft.class_2960;
import net.minecraft.class_6862;
import net.minecraft.class_6880;
import net.minecraft.class_7923;
import net.minecraft.class_7924;
import net.minecraft.class_9694;

import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.zip.ZipFile;

/**
 * The five Rejuvenation held-item recipes and the three Reverse Candy recipes, executed through Minecraft 1.21.1's own recipe API: the real shaped-recipe codec and
 * serializer, real ingredient and tag resolution, real {@code ShapedRecipe.matches/assemble}. The packaged recipe and tag JSON are read
 * from the mod resources on the classpath. Items from other mods are stand-ins registered under their real IDs before the vanilla
 * registries freeze, because Cobblemon itself cannot be initialised offline; their existence in the installed Cobblemon jar is checked
 * separately against that jar's item constants and models.
 */
public final class RecipeVerification {
    private static final String[] SEED_CENTERS = {"cobblemon:grassy_seed", "cobblemon:misty_seed", "cobblemon:electric_seed", "cobblemon:psychic_seed"};
    private static final String[] ROCK_CENTERS = {"cobblemon:damp_rock", "cobblemon:icy_rock", "cobblemon:smooth_rock", "cobblemon:heat_rock"};
    /** output -> surrounding ingredient. */
    private static final Map<String, String> SURROUND = new LinkedHashMap<>();
    static {
        SURROUND.put("magical_seed", "minecraft:amethyst_shard");
        SURROUND.put("telluric_seed", "minecraft:gunpowder");
        SURROUND.put("synthetic_seed", "minecraft:redstone");
        SURROUND.put("elemental_seed", "minecraft:glowstone_dust");
        SURROUND.put("amplifield_rock", "cobblemon:everstone");
    }
    /** Cobblemon items that must never be accepted as a center, plus this mod's own items and common vanilla filler. */
    private static final String[] UNAUTHORIZED = {"cobblemon:miracle_seed", "cobblemon:grass_gem", "cobblemon:leftovers", "cobblemon:everstone",
        "rejuvenation:magical_seed", "rejuvenation:amplifield_rock", "rejuvenation:amulet_coin", "minecraft:wheat_seeds", "minecraft:cobblestone", "minecraft:redstone"};
    /** Reverse Candy recipe file -> output item and count. */
    private static final Map<String, Map.Entry<String, Integer>> CANDIES = new LinkedHashMap<>();
    static {
        CANDIES.put("reverse_candy", Map.entry("reverse_candy", 1));
        CANDIES.put("master_reverse_candy", Map.entry("master_reverse_candy", 1));
    }
    private static final String DIRT = "minecraft:dirt", RARE_CANDY = "cobblemon:rare_candy", FERMENTED_EYE = "minecraft:fermented_spider_eye",
        REVERSE = "rejuvenation:reverse_candy", MASTER = "rejuvenation:master_reverse_candy", STAR = "minecraft:nether_star", LAVA = "minecraft:lava_bucket",
        TEMPLATE = "minecraft:netherite_upgrade_smithing_template", NETHERITE = "minecraft:netherite_ingot";
    private static int checks;

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
        checks++;
    }

    private static JsonObject resource(String path) throws Exception {
        try (InputStream in = RecipeVerification.class.getResourceAsStream(path)) {
            if (in == null) throw new AssertionError("Missing packaged resource " + path);
            return new Gson().fromJson(new InputStreamReader(in, StandardCharsets.UTF_8), JsonObject.class);
        }
    }

    private static class_2960 id(String text) { return class_2960.method_60654(text); }

    private static class_1792 item(String text) {
        var found = class_7923.field_41178.method_10223(id(text));
        check(class_7923.field_41178.method_10250(id(text)), "Item is not registered: " + text);
        return found;
    }

    private static class_1799 stack(String text) { return text == null ? class_1799.field_8037 : new class_1799(item(text)); }

    private static class_9694 grid(String... slots) {
        var stacks = new ArrayList<class_1799>();
        for (String slot : slots) stacks.add(stack(slot));
        return class_9694.method_59986(3, 3, stacks);
    }

    private static String[] cross(String center, String... around) {
        var s = new String[9];
        s[1] = around[0]; s[3] = around[1]; s[4] = center; s[5] = around[2]; s[7] = around[3];
        return s;
    }

    private static String[] cross(String center, String around) { return cross(center, around, around, around, around); }

    private static String[] ring(String center, String around) {
        var s = new String[9];
        java.util.Arrays.fill(s, around); s[4] = center;
        return s;
    }

    /** Corners, edges and center of a full 3x3 grid. */
    private static String[] square(String corner, String edge, String center) { return new String[]{corner, edge, corner, edge, center, edge, corner, edge, corner}; }

    /** Recipe.matches for any crafting recipe; a crafting grid never matches a smithing recipe or the reverse. */
    @SuppressWarnings("unchecked")
    private static boolean matches(net.minecraft.class_1860<?> recipe, net.minecraft.class_9695 input) {
        if ((recipe instanceof net.minecraft.class_8059) != (input instanceof net.minecraft.class_9697)) return false;
        return ((net.minecraft.class_1860<net.minecraft.class_9695>) recipe).method_8115(input, null);
    }

    @SuppressWarnings("unchecked")
    private static class_1799 craft(net.minecraft.class_1860<?> recipe, net.minecraft.class_9695 input) {
        return ((net.minecraft.class_1860<net.minecraft.class_9695>) recipe).method_8116(input, null);
    }

    @SuppressWarnings("unchecked")
    private static List<class_1799> remainders(net.minecraft.class_1860<?> recipe, class_9694 input) {
        return ((net.minecraft.class_1860<class_9694>) recipe).method_8111(input);
    }

    /** The data namespaces of this mod's own packaged resources (the classpath root that holds its recipes, not Cobblemon's jar). */
    private static java.util.Set<String> packagedNamespaces() throws Exception {
        var url = RecipeVerification.class.getResource("/data/rejuvenation/recipe/magical_seed.json");
        try (var fs = url.getProtocol().equals("jar") ? java.nio.file.FileSystems.newFileSystem(url.toURI(), Map.of()) : null;
             var entries = Files.list(Path.of(url.toURI()).getParent().getParent().getParent())) {
            return entries.map(p -> p.getFileName().toString().replace("/", "")).collect(java.util.stream.Collectors.toSet());
        }
    }

    /** Every recipe JSON packaged under data/rejuvenation/recipe (from the core resources directory or jar on the classpath), by file name. */
    private static Map<String, JsonObject> packagedRecipes() throws Exception {
        var found = new java.util.TreeMap<String, JsonObject>();
        var url = RecipeVerification.class.getResource("/data/rejuvenation/recipe/magical_seed.json");
        if (url == null) throw new AssertionError("packaged recipes are not on the classpath");
        try (var fs = url.getProtocol().equals("jar") ? java.nio.file.FileSystems.newFileSystem(url.toURI(), Map.of()) : null) {
            var dir = Path.of(url.toURI()).getParent();
            try (var files = Files.list(dir)) {
                for (var file : files.filter(f -> f.toString().endsWith(".json")).toList())
                    found.put(file.getFileName().toString().replaceFirst("\\.json$", ""), new Gson().fromJson(Files.readString(file), JsonObject.class));
            }
        }
        return found;
    }

    public static void main(String[] args) throws Exception {
        // 1. Stand-ins under their real IDs, before Bootstrap freezes the item registry.
        var standIns = new java.util.LinkedHashSet<String>(List.of(SEED_CENTERS));
        standIns.addAll(List.of(ROCK_CENTERS));
        standIns.add("cobblemon:everstone");
        standIns.addAll(List.of("cobblemon:miracle_seed", "cobblemon:grass_gem", "cobblemon:leftovers"));
        for (String out : SURROUND.keySet()) standIns.add("rejuvenation:" + out);
        standIns.add("rejuvenation:amulet_coin");
        standIns.addAll(List.of(RARE_CANDY, REVERSE, MASTER));
        for (var card : EvCards.Card.values()) { standIns.add("cobblemon:" + card.powerItem); standIns.add("rejuvenation:" + card.id); }
        net.minecraft.class_155.method_36208();
        net.minecraft.class_2966.method_12851();
        // Minecraft refuses to touch its registries before Bootstrap, and Bootstrap freezes the item registry, so the stand-ins are
        // registered by temporarily lifting the freeze flag (and the intrusive-holder table that Item construction needs).
        var registry = (class_2370<class_1792>) (Object) class_7923.field_41178;
        var frozen = class_2370.class.getDeclaredField("field_36463");
        var intrusive = class_2370.class.getDeclaredField("field_40584");
        frozen.setAccessible(true); intrusive.setAccessible(true);
        frozen.setBoolean(registry, false); intrusive.set(registry, new java.util.IdentityHashMap<class_1792, Object>());
        for (String standIn : standIns)
            class_2378.method_10230(class_7923.field_41178, id(standIn), new class_1792(new class_1792.class_1793()));
        frozen.setBoolean(registry, true); intrusive.set(registry, null);

        // 2. Bind the packaged item tags exactly as the data pack loader would.
        var tags = new HashMap<class_6862<class_1792>, List<class_6880<class_1792>>>();
        for (String tag : List.of("terrain_seed_centers", "field_rock_centers")) {
            var document = resource("/data/rejuvenation/tags/item/" + tag + ".json");
            check(!document.get("replace").getAsBoolean(), tag + " must not replace other packs' tags");
            var holders = new ArrayList<class_6880<class_1792>>();
            for (JsonElement value : document.getAsJsonArray("values")) {
                check(value.isJsonPrimitive(), "plain required tag entry in " + tag);
                holders.add(class_7923.field_41178.method_40290(net.minecraft.class_5321.method_29179(class_7924.field_41197, id(value.getAsString()))));
            }
            tags.put(class_6862.method_40092(class_7924.field_41197, id("rejuvenation:" + tag)), holders);
        }
        ((class_2370<class_1792>) (Object) class_7923.field_41178).method_40257(tags);
        check(tags.get(class_6862.method_40092(class_7924.field_41197, id("rejuvenation:terrain_seed_centers"))).size() == 4, "four seed centers");
        check(tags.get(class_6862.method_40092(class_7924.field_41197, id("rejuvenation:field_rock_centers"))).size() == 4, "four rock centers");

        // 3. Parse every recipe with the real serializer codec.
        var codec = class_1865.field_9035.method_53736().codec();
        var recipes = new LinkedHashMap<String, class_1869>();
        for (var entry : SURROUND.entrySet()) {
            String out = entry.getKey();
            var json = resource("/data/rejuvenation/recipe/" + out + ".json");
            check(json.get("type").getAsString().equals("minecraft:crafting_shaped"), out + " is a shaped recipe");
            var pattern = json.getAsJsonArray("pattern");
            check(pattern.size() == 3 && pattern.get(0).getAsString().equals(" A ") && pattern.get(1).getAsString().equals("ASA") && pattern.get(2).getAsString().equals(" A "),
                out + " uses the cardinal cross pattern");
            var parsed = codec.parse(JsonOps.INSTANCE, json).getOrThrow(message -> new AssertionError(out + ": " + message));
            check(parsed instanceof class_1869, out + " decodes to a ShapedRecipe");
            recipes.put(out, (class_1869) parsed);
        }
        check(recipes.size() == 5, "five recipes");

        // 4. Positive matrix: every center option for every output, single result, five occupied ingredient slots.
        int positives = 0;
        for (var entry : recipes.entrySet()) {
            String out = entry.getKey(), surround = SURROUND.get(out);
            var recipe = entry.getValue();
            long occupied = recipe.method_8117().stream().filter(i -> !i.method_8103()).count();
            check(occupied == 5, out + " has exactly five non-empty ingredient slots, found " + occupied);
            check(recipe.method_8158() == 3 && recipe.method_8150() == 3, out + " is a 3x3 recipe");
            String[] centers = out.equals("amplifield_rock") ? ROCK_CENTERS : SEED_CENTERS;
            for (String center : centers) {
                var input = grid(cross(center, surround));
                check(recipe.method_17728(input, null), out + " accepts center " + center);
                var result = recipe.method_17727(input, null);
                check(result.method_7947() == 1 && result.method_7909() == item("rejuvenation:" + out), out + " crafts one " + out + " from " + center);
                positives++;
                // Exactly this recipe matches this input.
                for (var other : recipes.entrySet())
                    check(other.getValue().method_17728(input, null) == other.getKey().equals(out), "only " + out + " matches " + center + " + " + surround + " (not " + other.getKey() + ")");
            }
        }
        check(positives == 20, "16 seed and 4 rock center combinations, found " + positives);

        // 5. Negatives.
        int negatives = 0;
        for (var entry : recipes.entrySet()) {
            String out = entry.getKey(), surround = SURROUND.get(out);
            var recipe = entry.getValue();
            String[] centers = out.equals("amplifield_rock") ? ROCK_CENTERS : SEED_CENTERS;
            String center = centers[0];
            // Wrong surrounding material (every other recipe's surround, and a vanilla look-alike).
            for (String wrong : new java.util.LinkedHashSet<>(List.of("minecraft:amethyst_shard", "minecraft:gunpowder", "minecraft:redstone", "minecraft:glowstone_dust", "cobblemon:everstone", "minecraft:cobblestone")))
                if (!wrong.equals(surround)) { check(!recipe.method_17728(grid(cross(center, wrong)), null), out + " rejects surround " + wrong); negatives++; }
            // Unauthorized centers.
            for (String bad : UNAUTHORIZED) { check(!recipe.method_17728(grid(cross(bad, surround)), null), out + " rejects center " + bad); negatives++; }
            // A center from the other family.
            String other = out.equals("amplifield_rock") ? SEED_CENTERS[0] : ROCK_CENTERS[0];
            check(!recipe.method_17728(grid(cross(other, surround)), null), out + " rejects the other family's center " + other); negatives++;
            // One wrong ingredient among the four.
            for (int slot : new int[]{1, 3, 5, 7}) {
                var mixed = cross(center, surround); mixed[slot] = "minecraft:cobblestone";
                check(!recipe.method_17728(grid(mixed), null), out + " rejects a mixed surround at slot " + slot); negatives++;
                var missing = cross(center, surround); missing[slot] = null;
                check(!recipe.method_17728(grid(missing), null), out + " rejects a missing surround at slot " + slot); negatives++;
            }
            var noCenter = cross(center, surround); noCenter[4] = null;
            check(!recipe.method_17728(grid(noCenter), null), out + " rejects a missing center"); negatives++;
            // Corners filled (extra ingredients), diagonal X pattern, plus without a gap, and a row.
            for (int corner : new int[]{0, 2, 6, 8}) {
                var filled = cross(center, surround); filled[corner] = surround;
                check(!recipe.method_17728(grid(filled), null), out + " rejects a filled corner " + corner); negatives++;
            }
            var diagonal = new String[9]; diagonal[0] = surround; diagonal[2] = surround; diagonal[4] = center; diagonal[6] = surround; diagonal[8] = surround;
            check(!recipe.method_17728(grid(diagonal), null), out + " rejects the X pattern"); negatives++;
            var row = new String[9]; row[3] = surround; row[4] = center; row[5] = surround;
            check(!recipe.method_17728(grid(row), null), out + " rejects a single row"); negatives++;
            var column = new String[9]; column[1] = surround; column[4] = center; column[7] = surround;
            check(!recipe.method_17728(grid(column), null), out + " rejects a single column"); negatives++;
            var full = new String[9]; java.util.Arrays.fill(full, surround); full[4] = center;
            check(!recipe.method_17728(grid(full), null), out + " rejects a full ring"); negatives++;
            // The recipe is rotation-symmetric: the same cross in a 2x2 or other-sized grid cannot match.
            check(!recipe.method_17728(class_9694.method_59986(2, 2, List.of(stack(surround), stack(center), stack(surround), stack(surround))), null), out + " rejects a 2x2 grid"); negatives++;
        }
        check(negatives >= 100, "negative matrix size " + negatives);

        // 5b. Reverse Candies: Rare Candy + Fermented Spider Eye, shapeless (1 Reverse Candy), and 4 Reverse Candies + 4 Nether Stars around a
        // Lava Bucket (1 Master Reverse Candy, the bucket handed back). Parsed by Recipe.CODEC, the type-dispatching codec the data pack loader uses.
        var recipeCodec = net.minecraft.class_1860.field_47319;
        var candies = new LinkedHashMap<String, net.minecraft.class_1860<?>>();
        for (String name : CANDIES.keySet()) {
            var json = resource("/data/rejuvenation/recipe/" + name + ".json");
            var parsed = recipeCodec.parse(JsonOps.INSTANCE, json).getOrThrow(message -> new AssertionError(name + ": " + message));
            candies.put(name, parsed);
        }
        check(candies.get("reverse_candy") instanceof net.minecraft.class_1867, "reverse_candy decodes to a ShapelessRecipe");
        check(candies.get("reverse_candy").method_8117().size() == 2, "reverse_candy takes exactly two ingredients");
        check(candies.get("master_reverse_candy") instanceof class_1869, "master_reverse_candy is still a ShapedRecipe");
        var all = new LinkedHashMap<String, net.minecraft.class_1860<?>>(recipes);
        all.putAll(candies);
        // Shapeless: any two cells of the 3x3 table, and the 2x2 inventory grid.
        var candyInputs = new ArrayList<Map.Entry<String, class_9694>>();
        for (int[] cells : new int[][]{{0, 1}, {1, 0}, {4, 8}, {8, 4}, {2, 6}, {3, 5}}) {
            var slots = new String[9]; slots[cells[0]] = RARE_CANDY; slots[cells[1]] = FERMENTED_EYE;
            candyInputs.add(Map.entry("reverse_candy", grid(slots)));
        }
        candyInputs.add(Map.entry("reverse_candy", class_9694.method_59986(2, 2, List.of(stack(FERMENTED_EYE), stack(null), stack(null), stack(RARE_CANDY)))));
        candyInputs.add(Map.entry("master_reverse_candy", grid(square(REVERSE, STAR, LAVA))));
        for (var entry : candyInputs) {
            String name = entry.getKey();
            var result = craft(candies.get(name), entry.getValue());
            var expected = CANDIES.get(name);
            check(result.method_7909() == item("rejuvenation:" + expected.getKey()) && result.method_7947() == expected.getValue(),
                name + " crafts " + expected.getValue() + " " + expected.getKey() + ", got " + result.method_7947() + " " + result.method_7909());
            positives++;
            for (var other : all.entrySet())
                check(matches(other.getValue(), entry.getValue()) == other.getKey().equals(name), "only " + name + " matches its grid (not " + other.getKey() + ")");
        }
        var remainder = remainders(candies.get("master_reverse_candy"), grid(square(REVERSE, STAR, LAVA)));
        check(remainder.get(4).method_7909() == item("minecraft:bucket") && remainder.stream().filter(s -> !s.method_7960()).count() == 1,
            "the Master Reverse Candy recipe returns only the empty bucket");
        var reverseRemainder = remainders(candies.get("reverse_candy"), grid(RARE_CANDY, FERMENTED_EYE, null, null, null, null, null, null, null));
        check(reverseRemainder.stream().allMatch(class_1799::method_7960), "the Reverse Candy recipe consumes both ingredients and returns nothing");
        // Near misses: none of the recipes may accept them. The two former Reverse Candy recipes are among them.
        var nearMisses = new ArrayList<String[]>();
        nearMisses.add(cross("minecraft:sugar", DIRT));               // former recipe: Sugar in a plus of 4 Dirt
        nearMisses.add(ring(RARE_CANDY, DIRT));                      // former recipe: Rare Candy in a ring of 8 Dirt
        nearMisses.add(new String[]{RARE_CANDY, null, null, null, null, null, null, null, null});
        nearMisses.add(new String[]{FERMENTED_EYE, null, null, null, null, null, null, null, null});
        nearMisses.add(new String[]{RARE_CANDY, FERMENTED_EYE, DIRT, null, null, null, null, null, null});
        nearMisses.add(new String[]{RARE_CANDY, RARE_CANDY, FERMENTED_EYE, null, null, null, null, null, null});
        nearMisses.add(new String[]{RARE_CANDY, FERMENTED_EYE, FERMENTED_EYE, null, null, null, null, null, null});
        nearMisses.add(new String[]{RARE_CANDY, "minecraft:spider_eye", null, null, null, null, null, null, null});
        nearMisses.add(new String[]{REVERSE, FERMENTED_EYE, null, null, null, null, null, null, null});
        nearMisses.add(new String[]{MASTER, FERMENTED_EYE, null, null, null, null, null, null, null});
        nearMisses.add(new String[]{"minecraft:sugar", FERMENTED_EYE, null, null, null, null, null, null, null});
        for (int slot : new int[]{0, 1, 2, 3, 5, 6, 7, 8}) {
            var masterMissing = square(REVERSE, STAR, LAVA); masterMissing[slot] = null; nearMisses.add(masterMissing);
        }
        nearMisses.add(square(STAR, REVERSE, LAVA));                 // stars and candies swapped
        nearMisses.add(square(REVERSE, STAR, "minecraft:water_bucket"));
        nearMisses.add(square(REVERSE, STAR, "minecraft:bucket"));
        nearMisses.add(square(REVERSE, STAR, null));
        nearMisses.add(square(RARE_CANDY, STAR, LAVA));
        nearMisses.add(square(MASTER, STAR, LAVA));
        nearMisses.add(square(REVERSE, "minecraft:diamond", LAVA));
        nearMisses.add(square(REVERSE, REVERSE, LAVA));
        nearMisses.add(square(STAR, STAR, LAVA));
        int candyNegatives = 0;
        for (var input : nearMisses) {
            var label = java.util.Arrays.toString(input);
            for (var recipe : all.entrySet()) { check(!matches(recipe.getValue(), grid(input)), recipe.getKey() + " rejects " + label); candyNegatives++; }
        }
        // The seed and rock grids still craft only their own item.
        for (var entry : SURROUND.entrySet())
            for (var candy : candies.entrySet()) {
                String center = entry.getKey().equals("amplifield_rock") ? ROCK_CENTERS[0] : SEED_CENTERS[0];
                check(!matches(candy.getValue(), grid(cross(center, entry.getValue()))), candy.getKey() + " rejects the " + entry.getKey() + " grid");
                candyNegatives++;
            }
        // The former recipes are gone from the packaged data, and no other packaged recipe makes a Reverse Candy.
        check(RecipeVerification.class.getResource("/data/rejuvenation/recipe/reverse_candy_from_rare_candy.json") == null, "the Rare Candy + 8 Dirt recipe is removed");
        var packaged = packagedRecipes();
        var reverseSources = packaged.entrySet().stream().filter(e -> e.getValue().getAsJsonObject("result").get("id").getAsString().equals(REVERSE)).map(Map.Entry::getKey).toList();
        check(reverseSources.equals(List.of("reverse_candy")), "exactly one packaged recipe makes a Reverse Candy, found " + reverseSources);
        check(packaged.size() == 13, "13 packaged recipes (4 seeds, Amplifield Rock, 2 candies, 6 EV Cards; nothing stale), found " + packaged.keySet());
        check(!packagedNamespaces().contains("cobblemon"), "the mod packages no data/cobblemon files, so no Cobblemon recipe (such as the Power Items') is overridden");
        negatives += candyNegatives;

        // 5c. EV Training Cards: a vanilla Netherite smithing upgrade of the matching Cobblemon Power Item.
        var cards = new LinkedHashMap<String, net.minecraft.class_8060>();
        for (var card : EvCards.Card.values()) {
            var json = resource("/data/rejuvenation/recipe/" + card.id + ".json");
            check(json.get("type").getAsString().equals("minecraft:smithing_transform"), card.id + " is a native smithing transform");
            var parsed = recipeCodec.parse(JsonOps.INSTANCE, json).getOrThrow(message -> new AssertionError(card.id + ": " + message));
            check(parsed instanceof net.minecraft.class_8060, card.id + " decodes to a SmithingTransformRecipe");
            var recipe = (net.minecraft.class_8060) parsed;
            cards.put(card.id, recipe);
            String base = "cobblemon:" + card.powerItem;
            check(recipe.method_48453(stack(TEMPLATE)) && recipe.method_48454(stack(base)) && recipe.method_30029(stack(NETHERITE)), card.id + " takes template, " + base + " and a Netherite Ingot");
            var input = new net.minecraft.class_9697(stack(TEMPLATE), stack(base), stack(NETHERITE));
            check(recipe.method_59999(input, null), card.id + " matches its smithing input");
            var result = recipe.method_60000(input, null);
            check(result.method_7909() == item("rejuvenation:" + card.id) && result.method_7947() == 1, card.id + " smiths exactly one card, got " + result);
            positives++;
        }
        int smithingNegatives = 0;
        for (var card : EvCards.Card.values()) {
            var recipe = cards.get(card.id);
            String base = "cobblemon:" + card.powerItem;
            var wrong = new ArrayList<net.minecraft.class_9697>();
            for (var other : EvCards.Card.values()) if (other != card) wrong.add(new net.minecraft.class_9697(stack(TEMPLATE), stack("cobblemon:" + other.powerItem), stack(NETHERITE)));
            wrong.add(new net.minecraft.class_9697(class_1799.field_8037, stack(base), stack(NETHERITE)));                       // no template
            wrong.add(new net.minecraft.class_9697(stack(TEMPLATE), stack(base), class_1799.field_8037));                       // no ingot
            wrong.add(new net.minecraft.class_9697(stack(TEMPLATE), stack(base), stack("minecraft:diamond")));
            wrong.add(new net.minecraft.class_9697(stack(TEMPLATE), stack(base), stack("minecraft:netherite_scrap")));
            wrong.add(new net.minecraft.class_9697(stack("minecraft:sentry_armor_trim_smithing_template"), stack(base), stack(NETHERITE)));
            wrong.add(new net.minecraft.class_9697(stack(TEMPLATE), stack("rejuvenation:" + card.id), stack(NETHERITE)));       // a card cannot be upgraded again
            wrong.add(new net.minecraft.class_9697(stack(TEMPLATE), stack("minecraft:diamond_sword"), stack(NETHERITE)));
            for (var input : wrong) { check(!recipe.method_59999(input, null), card.id + " rejects a wrong smithing input"); smithingNegatives++; }
            // The vanilla Netherite upgrade still makes vanilla gear, and the card recipe does not take a diamond tool.
            check(!recipe.method_48454(stack("minecraft:diamond_sword")), card.id + " does not accept vanilla diamond gear as its base"); smithingNegatives++;
        }
        negatives += smithingNegatives;

        // 6. Packaged assets, registry IDs and the installed Cobblemon jar.
        var contents = installedCobblemonItems();
        for (String input : standIns) if (input.startsWith("cobblemon:"))
            check(contents.contains(input.substring("cobblemon:".length())), "installed Cobblemon jar does not define item " + input);
        var registered = registeredByMod();
        for (String out : SURROUND.keySet()) check(registered.contains(out), "RejuvenationFields does not register " + out);
        check(registered.contains("amulet_coin"), "Amulet Coin registration is unchanged");
        for (String out : List.of("reverse_candy", "master_reverse_candy")) check(registered.contains(out), "RejuvenationFields does not register " + out);
        check(registeredCards(), "RejuvenationFields registers an EvCardItem for every EvCards.Card");

        // 7. Item textures: valid PNG files that a Java image reader decodes to the exact RGBA recorded in the provenance manifest
        // (the source BMP's, or for the Master Reverse Candy the recoloured Reverse Candy's), and models that use them.
        var icons = resource("/assets/rejuvenation/item_icons.json").getAsJsonObject("items");
        check(icons.size() == 13, "13 item icons");
        var textured = new ArrayList<>(SURROUND.keySet());
        textured.addAll(List.of("reverse_candy", "master_reverse_candy"));
        for (var card : EvCards.Card.values()) textured.add(card.id);
        var pixels = new HashMap<String, java.awt.image.BufferedImage>();
        for (String out : textured) {
            byte[] png;
            try (var in = RecipeVerification.class.getResourceAsStream("/assets/rejuvenation/textures/item/" + out + ".png")) { png = in.readAllBytes(); }
            check(png.length > 8 && (png[0] & 0xFF) == 0x89 && png[1] == 'P' && png[2] == 'N' && png[3] == 'G', out + " has a PNG signature");
            var image = javax.imageio.ImageIO.read(new java.io.ByteArrayInputStream(png));
            check(image.getWidth() == 48 && image.getHeight() == 48 && image.getColorModel().hasAlpha(), out + " is 48x48 with alpha");
            pixels.put(out, image);
            var rgba = new byte[48 * 48 * 4];
            for (int y = 0; y < 48; y++) for (int x = 0; x < 48; x++) {
                int argb = image.getRGB(x, y), at = (y * 48 + x) * 4;
                rgba[at] = (byte) (argb >> 16); rgba[at + 1] = (byte) (argb >> 8); rgba[at + 2] = (byte) argb; rgba[at + 3] = (byte) (argb >>> 24);
            }
            var expected = icons.getAsJsonObject("rejuvenation:" + out);
            check(java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(rgba)).equals(expected.get("rgbaSha256").getAsString()),
                out + " pixels equal the RGBA recorded in the provenance manifest");
            check(java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(png)).equals(expected.get("sha256").getAsString()), out + " file hash matches the provenance manifest");
            var model = resource("/assets/rejuvenation/models/item/" + out + ".json");
            check(model.getAsJsonObject("textures").get("layer0").getAsString().equals("rejuvenation:item/" + out), out + " model references its texture");
        }
        check(resource("/assets/rejuvenation/models/item/amulet_coin.json").getAsJsonObject("textures").get("layer0").getAsString().equals("minecraft:item/gold_nugget"), "Amulet Coin model is unchanged");
        // The Master Reverse Candy is the Reverse Candy's shape, darker and redder.
        check(icons.getAsJsonObject("rejuvenation:master_reverse_candy").get("derivedFrom").getAsString().equals("rejuvenation:reverse_candy"), "Master Reverse Candy icon is derived from the Reverse Candy");
        var base = pixels.get("reverse_candy"); var master = pixels.get("master_reverse_candy");
        double[] baseSum = new double[4], masterSum = new double[4];
        for (int y = 0; y < 48; y++) for (int x = 0; x < 48; x++) {
            int b = base.getRGB(x, y), m = master.getRGB(x, y);
            check((b >>> 24) == (m >>> 24), "Master Reverse Candy keeps the Reverse Candy's alpha at " + x + "," + y);
            if ((b >>> 24) == 0) continue;
            for (var pair : List.of(Map.entry(b, baseSum), Map.entry(m, masterSum))) {
                int px = pair.getKey(); double r = px >> 16 & 255, g = px >> 8 & 255, bl = px & 255;
                pair.getValue()[0] += 0.2126 * r + 0.7152 * g + 0.0722 * bl; pair.getValue()[1] += r / Math.max(1, r + g + bl);
            }
        }
        check(masterSum[0] < baseSum[0] * 0.8, "Master Reverse Candy is darker (luminance " + masterSum[0] + " vs " + baseSum[0] + ")");
        check(masterSum[1] > baseSum[1] * 1.2, "Master Reverse Candy is redder (red share " + masterSum[1] + " vs " + baseSum[1] + ")");

        var receipt = new JsonObject();
        receipt.addProperty("recipes", all.size() + cards.size());
        receipt.addProperty("positiveCombinations", positives);
        receipt.addProperty("negativeCases", negatives);
        receipt.addProperty("checks", checks);
        receipt.addProperty("scope", "Real Minecraft 1.21.1 shaped-recipe codec, ingredient/tag resolution, matches/assemble. Items from other mods are same-ID stand-ins; their existence is checked against the installed Cobblemon jar. Not a live game crafting-table run.");
        if (args.length > 0) Files.writeString(Path.of(args[0]), new GsonBuilder().setPrettyPrinting().create().toJson(receipt) + "\n");
        System.out.println("PASS item recipes and textures through the real recipe API and image reader: " + (all.size() + cards.size()) + " recipes, " + positives + " craft combinations, " + negatives + " rejected cases, " + checks + " checks");
    }

    /** The entrypoint registers EvCardItem instances in a loop over EvCards.Card, whose IDs live in EvCards. */
    private static boolean registeredCards() throws Exception {
        try (var entry = RejuvenationFields.class.getResourceAsStream("RejuvenationFields.class"); var cards = EvCards.Card.class.getResourceAsStream("EvCards$Card.class")) {
            var entrypoint = new String(entry.readAllBytes(), StandardCharsets.ISO_8859_1);
            var enumeration = new String(cards.readAllBytes(), StandardCharsets.ISO_8859_1);
            boolean ids = java.util.Arrays.stream(EvCards.Card.values()).allMatch(c -> enumeration.contains((char) 1 + "" + (char) 0 + (char) c.id.length() + c.id));
            return entrypoint.contains("dev/rejuvenation/EvCardItem") && entrypoint.contains("dev/rejuvenation/EvCards$Card") && ids && EvCards.Card.values().length == 6;
        }
    }

    /** Short item names declared in the installed Cobblemon jar's CobblemonItems constants. */
    private static java.util.Set<String> installedCobblemonItems() throws Exception {
        // Locate the jar without initialising CobblemonItems (that would need a full Cobblemon bootstrap).
        var resource = RecipeVerification.class.getClassLoader().getResource("com/cobblemon/mod/common/CobblemonItems.class");
        if (resource == null || !resource.getProtocol().equals("jar")) throw new AssertionError("Installed Cobblemon jar is not on the classpath");
        var path = resource.getPath();
        var location = new java.io.File(java.net.URI.create(path.substring(0, path.indexOf("!/"))));
        var names = new java.util.HashSet<String>();
        try (var zip = new ZipFile(location)) {
            var entries = zip.entries();
            while (entries.hasMoreElements()) {
                var entry = entries.nextElement().getName();
                if (entry.startsWith("assets/cobblemon/models/item/") && entry.endsWith(".json")) names.add(entry.substring("assets/cobblemon/models/item/".length(), entry.length() - 5));
            }
            var constants = new String(zip.getInputStream(zip.getEntry("com/cobblemon/mod/common/CobblemonItems.class")).readAllBytes(), StandardCharsets.ISO_8859_1);
            names.removeIf(name -> !constants.contains(name));
        }
        return names;
    }

    /** Item paths in the registration list of the compiled entrypoint (whole constant-pool strings, so reverse_candy is not found inside master_reverse_candy). */
    private static java.util.Set<String> registeredByMod() throws Exception {
        var found = new java.util.HashSet<String>();
        try (var in = RejuvenationFields.class.getResourceAsStream("RejuvenationFields.class")) {
            var constants = new String(in.readAllBytes(), StandardCharsets.ISO_8859_1);
            for (String name : List.of("elemental_seed", "magical_seed", "telluric_seed", "synthetic_seed", "amulet_coin", "amplifield_rock", "reverse_candy", "master_reverse_candy"))
                if (constants.contains("\u0001" + (char) (name.length() >> 8) + (char) (name.length() & 255) + name)) found.add(name);
        }
        return found;
    }
}
