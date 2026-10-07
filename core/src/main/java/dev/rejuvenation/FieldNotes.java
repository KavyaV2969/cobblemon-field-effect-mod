package dev.rejuvenation;

import com.google.gson.*;
import java.util.*;

/**
 * Player-facing Field Notes: plain-text documents, one per field, loaded from {@code data/<ns>/rejuvenation/notes/<field>.json}.
 *
 * <p>The datapack is the editable source. Documents are validated when the catalog loads (closed keys, bounded sizes, plain text only:
 * no control characters or formatting codes, so a note can never carry markup, commands or JSON into the client) and each battle keeps
 * the notes of the catalog snapshot it started with, exactly like its mechanics, so a mid-battle reload cannot make the notes describe
 * rules the battle is not using. The server sends a field's notes with the field state; the client never asks for anything.
 */
public final class FieldNotes {
    private FieldNotes() {}
    public static final int MAX_SECTIONS = 14, MAX_LINES = 40, MAX_LINE = 240, MAX_COUNTERS = 3, MAX_THRESHOLDS = 4, MAX_BYTES = 16_000;
    private static final Set<String> KEYS = Set.of("schemaVersion", "field", "title", "summary", "sections", "overlay", "counters", "substrateText");
    private static final Set<String> COUNTER_IDS = Set.of("warning", "distraction");

    /** Plain display text: no control characters, no section sign (Minecraft formatting), bounded length. */
    static boolean plain(JsonElement e, int max) {
        if (e == null || !e.isJsonPrimitive() || !e.getAsJsonPrimitive().isString()) return false;
        String s = e.getAsString();
        if (s.isEmpty() || s.length() > max) return false;
        for (int i = 0; i < s.length(); i++) { char c = s.charAt(i); if (c < 0x20 || c == 0x7f || c == '§') return false; }
        return true;
    }
    private static void require(boolean ok, String where, String detail) { if (!ok) throw new IllegalArgumentException(where + ": " + detail); }

    /** Validates one document against the catalog's fields; returns it unchanged. */
    public static JsonObject validate(JsonObject doc, JsonObject fields, String expectedField) {
        String where = "notes/" + expectedField;
        require(KEYS.containsAll(doc.keySet()) && doc.has("schemaVersion") && doc.has("field") && doc.has("title") && doc.has("summary") && doc.has("sections"), where, "Unknown or missing keys");
        require(doc.get("schemaVersion").isJsonPrimitive() && doc.get("schemaVersion").getAsInt() == 1, where, "Unsupported schema");
        require(plain(doc.get("field"), 80) && doc.get("field").getAsString().equals(expectedField) && fields.has(expectedField), where, "Notes name an unknown or mismatched field");
        require(plain(doc.get("title"), 80) && plain(doc.get("summary"), 400), where, "Invalid title or summary");
        if (doc.has("substrateText")) require(plain(doc.get("substrateText"), MAX_LINE), where, "Invalid substrate text");
        require(doc.get("sections").isJsonArray() && !doc.getAsJsonArray("sections").isEmpty() && doc.getAsJsonArray("sections").size() <= MAX_SECTIONS, where, "Invalid sections");
        for (var section : doc.getAsJsonArray("sections")) {
            require(section.isJsonObject() && section.getAsJsonObject().keySet().equals(Set.of("heading", "lines")), where, "Invalid section");
            var s = section.getAsJsonObject();
            require(plain(s.get("heading"), 60) && s.get("lines").isJsonArray() && !s.getAsJsonArray("lines").isEmpty() && s.getAsJsonArray("lines").size() <= MAX_LINES, where, "Invalid section lines");
            for (var line : s.getAsJsonArray("lines")) require(plain(line, MAX_LINE * 4), where, "Invalid line");
        }
        if (doc.has("overlay")) {
            require(doc.get("overlay").isJsonArray() && !doc.getAsJsonArray("overlay").isEmpty() && doc.getAsJsonArray("overlay").size() <= MAX_LINES, where, "Invalid overlay lines");
            for (var line : doc.getAsJsonArray("overlay")) require(plain(line, MAX_LINE * 4), where, "Invalid overlay line");
        }
        if (doc.has("counters")) {
            var counters = doc.getAsJsonArray("counters");
            require(counters.size() <= MAX_COUNTERS, where, "Too many counters");
            for (var element : counters) {
                require(element.isJsonObject() && Set.of("id", "label", "scope", "maximum", "thresholds").containsAll(element.getAsJsonObject().keySet()), where, "Invalid counter");
                var c = element.getAsJsonObject();
                require(c.has("id") && COUNTER_IDS.contains(c.get("id").getAsString()) && plain(c.get("label"), 60) && c.has("scope") && Set.of("shared", "perSide").contains(c.get("scope").getAsString()), where, "Invalid counter identity");
                require(c.has("maximum") && c.get("maximum").isJsonPrimitive() && c.get("maximum").getAsInt() >= 1 && c.get("maximum").getAsInt() <= 8, where, "Invalid counter maximum");
                if (c.has("thresholds")) {
                    require(c.get("thresholds").isJsonArray() && c.getAsJsonArray("thresholds").size() <= MAX_THRESHOLDS, where, "Invalid thresholds");
                    for (var t : c.getAsJsonArray("thresholds")) {
                        require(t.isJsonObject() && t.getAsJsonObject().keySet().equals(Set.of("at", "text")) && plain(t.getAsJsonObject().get("text"), MAX_LINE) && t.getAsJsonObject().get("at").getAsInt() >= 1 && t.getAsJsonObject().get("at").getAsInt() <= 8, where, "Invalid threshold");
                    }
                }
            }
        }
        require(doc.toString().getBytes(java.nio.charset.StandardCharsets.UTF_8).length <= MAX_BYTES, where, "Notes exceed " + MAX_BYTES + " bytes");
        return doc;
    }

    /** A catalog's notes: field ID to validated document. Immutable. */
    public static Map<String, JsonObject> validateAll(Map<String, JsonObject> documents, JsonObject fields) {
        var out = new TreeMap<String, JsonObject>();
        for (var entry : documents.entrySet()) out.put(entry.getKey(), validate(entry.getValue(), fields, entry.getKey()));
        return Collections.unmodifiableMap(out);
    }

    /**
     * The payload for one field: its notes (or {@code missing}) with the catalog revision of the battle's snapshot, so the client can
     * cache by (field, revision) and a reload or server edit is never mistaken for older text. Always within the packet limit.
     */
    public static String payload(UUID battle, String field, long revision, Map<String, JsonObject> notes) {
        var json = new JsonObject();
        json.addProperty("battle", battle.toString());
        json.addProperty("field", field);
        json.addProperty("revision", revision);
        var doc = notes.get(field);
        if (doc == null) json.addProperty("missing", true); else json.add("notes", doc);
        return json.toString();
    }
}
