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
 * The five Rejuvenation held-item recipes, executed through Minecraft 1.21.1's own recipe API: the real shaped-recipe codec and
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

    public static void main(String[] args) throws Exception {
        // 1. Stand-ins under their real IDs, before Bootstrap freezes the item registry.
        var standIns = new java.util.LinkedHashSet<String>(List.of(SEED_CENTERS));
        standIns.addAll(List.of(ROCK_CENTERS));
        standIns.add("cobblemon:everstone");
        standIns.addAll(List.of("cobblemon:miracle_seed", "cobblemon:grass_gem", "cobblemon:leftovers"));
        for (String out : SURROUND.keySet()) standIns.add("rejuvenation:" + out);
        standIns.add("rejuvenation:amulet_coin");
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

        // 6. Packaged assets, registry IDs and the installed Cobblemon jar.
        var contents = installedCobblemonItems();
        for (String input : standIns) if (input.startsWith("cobblemon:"))
            check(contents.contains(input.substring("cobblemon:".length())), "installed Cobblemon jar does not define item " + input);
        var registered = registeredByMod();
        for (String out : SURROUND.keySet()) check(registered.contains(out), "RejuvenationFields does not register " + out);
        check(registered.contains("amulet_coin"), "Amulet Coin registration is unchanged");

        // 7. Item textures: valid PNG files that a Java image reader decodes to the exact RGBA recorded from the source BMP, and models that use them.
        var icons = resource("/assets/rejuvenation/item_icons.json").getAsJsonObject("items");
        check(icons.size() == 5, "five converted icons");
        for (String out : SURROUND.keySet()) {
            byte[] png;
            try (var in = RecipeVerification.class.getResourceAsStream("/assets/rejuvenation/textures/item/" + out + ".png")) { png = in.readAllBytes(); }
            check(png.length > 8 && (png[0] & 0xFF) == 0x89 && png[1] == 'P' && png[2] == 'N' && png[3] == 'G', out + " has a PNG signature");
            var image = javax.imageio.ImageIO.read(new java.io.ByteArrayInputStream(png));
            check(image.getWidth() == 48 && image.getHeight() == 48 && image.getColorModel().hasAlpha(), out + " is 48x48 with alpha");
            var rgba = new byte[48 * 48 * 4];
            for (int y = 0; y < 48; y++) for (int x = 0; x < 48; x++) {
                int argb = image.getRGB(x, y), at = (y * 48 + x) * 4;
                rgba[at] = (byte) (argb >> 16); rgba[at + 1] = (byte) (argb >> 8); rgba[at + 2] = (byte) argb; rgba[at + 3] = (byte) (argb >>> 24);
            }
            var expected = icons.getAsJsonObject("rejuvenation:" + out);
            check(java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(rgba)).equals(expected.get("rgbaSha256").getAsString()),
                out + " pixels equal the source icon's decoded RGBA");
            check(java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(png)).equals(expected.get("sha256").getAsString()), out + " file hash matches the provenance manifest");
            var model = resource("/assets/rejuvenation/models/item/" + out + ".json");
            check(model.getAsJsonObject("textures").get("layer0").getAsString().equals("rejuvenation:item/" + out), out + " model references its texture");
        }
        check(resource("/assets/rejuvenation/models/item/amulet_coin.json").getAsJsonObject("textures").get("layer0").getAsString().equals("minecraft:item/gold_nugget"), "Amulet Coin model is unchanged");

        var receipt = new JsonObject();
        receipt.addProperty("recipes", recipes.size());
        receipt.addProperty("positiveCombinations", positives);
        receipt.addProperty("negativeCases", negatives);
        receipt.addProperty("checks", checks);
        receipt.addProperty("scope", "Real Minecraft 1.21.1 shaped-recipe codec, ingredient/tag resolution, matches/assemble. Items from other mods are same-ID stand-ins; their existence is checked against the installed Cobblemon jar. Not a live game crafting-table run.");
        if (args.length > 0) Files.writeString(Path.of(args[0]), new GsonBuilder().setPrettyPrinting().create().toJson(receipt) + "\n");
        System.out.println("PASS item recipes and textures through the real recipe API and image reader: 5 recipes, " + positives + " craft combinations, " + negatives + " rejected cases, " + checks + " checks");
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

    /** Item paths in the registration list of the compiled entrypoint. */
    private static java.util.Set<String> registeredByMod() throws Exception {
        var found = new java.util.HashSet<String>();
        try (var in = RejuvenationFields.class.getResourceAsStream("RejuvenationFields.class")) {
            var constants = new String(in.readAllBytes(), StandardCharsets.ISO_8859_1);
            for (String name : List.of("elemental_seed", "magical_seed", "telluric_seed", "synthetic_seed", "amulet_coin", "amplifield_rock"))
                if (constants.contains(name)) found.add(name);
        }
        return found;
    }
}
