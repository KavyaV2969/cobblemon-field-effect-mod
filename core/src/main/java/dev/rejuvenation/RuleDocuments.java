package dev.rejuvenation;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Set;

/**
 * Merges the rule documents of one directory ({@code rejuvenation/mappings} or {@code rejuvenation/structures}) into the single ordered
 * list the resolver walks. Precedence is the row order, so the order must never depend on pack, file-system or hash-map iteration order:
 * documents are sorted by their optional integer {@code order} (default 0, lower is checked first) and then by their resource ID, and rows
 * keep their order inside a document. A pack that must sit between another pack's rows names an {@code order}; everything else is
 * deterministic by path.
 */
public final class RuleDocuments {
    private RuleDocuments() {}
    /** One resource: its ID ({@code namespace:path}) and parsed JSON. */
    public record Doc(String id, JsonObject json) {}
    public static final int MAX_ORDER = 1_000_000;
    private static final Set<String> KEYS = Set.of("schemaVersion", "order", "rules", "description");

    public static int order(Doc doc) {
        JsonObject json = doc.json();
        for (String key : json.keySet()) if (!KEYS.contains(key)) throw new IllegalArgumentException(doc.id() + ": unknown rule document key " + key);
        if (!json.has("rules") || !json.get("rules").isJsonArray()) throw new IllegalArgumentException(doc.id() + ": rules must be an array");
        if (!json.has("order")) return 0;
        JsonElement value = json.get("order");
        if (!value.isJsonPrimitive() || !value.getAsJsonPrimitive().isNumber()) throw new IllegalArgumentException(doc.id() + ": order must be an integer");
        double number = value.getAsDouble();
        if (number != Math.rint(number) || Math.abs(number) > MAX_ORDER) throw new IllegalArgumentException(doc.id() + ": order must be an integer within +/-" + MAX_ORDER);
        return (int) number;
    }

    /** Rows of all documents, ordered by (order, id), each document's rows in file order. Input order is irrelevant. Every document is validated, even a lone one. */
    public static JsonArray merge(List<Doc> docs) {
        record Keyed(int order, Doc doc) {}
        var keyed = new ArrayList<Keyed>();
        for (Doc doc : docs) keyed.add(new Keyed(order(doc), doc));
        keyed.sort(Comparator.<Keyed>comparingInt(Keyed::order).thenComparing(k -> k.doc().id()));
        JsonArray rows = new JsonArray();
        for (Keyed k : keyed) for (JsonElement row : k.doc().json().getAsJsonArray("rules")) rows.add(row);
        return rows;
    }
}
