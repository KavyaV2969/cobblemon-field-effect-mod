package dev.rejuvenation;

import com.google.gson.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;

/**
 * Server side of Field Notes: the shipped documents validate against the catalog, malformed or hostile documents are rejected with a
 * named reason, a datapack can replace any field's notes, every payload fits the packet limit, and the notes a battle sends are the
 * ones of the catalog snapshot it started with.
 */
final class NotesVerification {
    private NotesVerification() {}
    private static int checks;
    private static void check(boolean value, String text) { if (!value) throw new AssertionError(text); checks++; }
    private static void rejects(JsonObject doc, JsonObject fields, String field, String why) {
        try { FieldNotes.validate(doc, fields, field); } catch (IllegalArgumentException expected) { checks++; return; }
        throw new AssertionError("Accepted: " + why);
    }

    static int run(JsonObject catalog, Path notesDir) throws Exception {
        checks = 0;
        var fields = catalog.getAsJsonObject("fields");
        var documents = new TreeMap<String, JsonObject>();
        try (var files = Files.list(notesDir)) {
            for (var file : (Iterable<Path>) files.filter(f -> f.toString().endsWith(".json")).sorted()::iterator) {
                var doc = JsonParser.parseString(Files.readString(file)).getAsJsonObject();
                documents.put(doc.get("field").getAsString(), doc);
            }
        }
        check(documents.keySet().equals(fields.keySet()), "Every field has notes and no notes name a missing field");
        var validated = FieldNotes.validateAll(documents, fields);
        check(validated.size() == 61, "All 61 documents validate");
        boolean immutable = false;
        try { validated.put("x", new JsonObject()); } catch (UnsupportedOperationException expected) { immutable = true; }
        check(immutable, "The validated catalog notes are immutable");
        var battle = UUID.fromString("00000000-0000-0000-0000-0000000000b0");
        for (var entry : validated.entrySet()) {
            String payload = FieldNotes.payload(battle, entry.getKey(), 7, validated);
            check(payload.getBytes(StandardCharsets.UTF_8).length < (1 << 15), "Notes payload within the packet limit: " + entry.getKey());
            var parsed = JsonParser.parseString(payload).getAsJsonObject();
            check(parsed.get("revision").getAsLong() == 7 && parsed.get("field").getAsString().equals(entry.getKey()) && parsed.has("notes"), "Payload names field and revision");
        }
        var missing = JsonParser.parseString(FieldNotes.payload(battle, "rejuvenation:nothing", 7, validated)).getAsJsonObject();
        check(missing.has("missing") && !missing.has("notes"), "A field without notes is reported as missing");

        // Hostile or malformed documents.
        String field = "rejuvenation:city";
        var good = documents.get(field);
        java.util.function.Supplier<JsonObject> copy = good::deepCopy;
        var d = copy.get(); d.addProperty("command", "/op"); rejects(d, fields, field, "unknown key");
        d = copy.get(); d.addProperty("title", "§4Red"); rejects(d, fields, field, "formatting code in title");
        d = copy.get(); d.addProperty("summary", "line\nbreak"); rejects(d, fields, field, "control character");
        d = copy.get(); d.addProperty("summary", "x".repeat(401)); rejects(d, fields, field, "oversized summary");
        d = copy.get(); d.addProperty("field", "rejuvenation:beach"); rejects(d, fields, field, "mismatched field");
        d = copy.get(); d.addProperty("schemaVersion", 2); rejects(d, fields, field, "unknown schema version");
        rejects(copy.get(), fields, "rejuvenation:not_a_field", "notes for an unknown field");
        d = copy.get(); d.add("sections", new JsonArray()); rejects(d, fields, field, "empty sections");
        d = copy.get(); var many = new JsonArray(); for (int i = 0; i < FieldNotes.MAX_SECTIONS + 1; i++) many.add(good.getAsJsonArray("sections").get(0)); d.add("sections", many); rejects(d, fields, field, "too many sections");
        d = copy.get(); d.getAsJsonArray("sections").get(0).getAsJsonObject().addProperty("html", "<b>"); rejects(d, fields, field, "unknown section key");
        d = copy.get(); var section = new JsonObject(); section.addProperty("heading", "H"); var lines = new JsonArray(); for (int i = 0; i < FieldNotes.MAX_LINES + 1; i++) lines.add("line"); section.add("lines", lines);
        var one = new JsonArray(); one.add(section); d.add("sections", one); rejects(d, fields, field, "too many lines");
        d = copy.get(); var big = new JsonArray(); for (int s = 0; s < 14; s++) { var sec = new JsonObject(); sec.addProperty("heading", "H" + s); var ls = new JsonArray(); for (int i = 0; i < 20; i++) ls.add("y".repeat(900)); sec.add("lines", ls); big.add(sec); }
        d.add("sections", big); rejects(d, fields, field, "document beyond the byte limit");
        for (var bad : new Object[][]{{"arbitrary", "shared", 3, "counter outside the public set"}, {"warning", "shared", 99, "counter maximum out of range"}, {"warning", "global", 3, "unknown counter scope"}}) {
            d = copy.get(); var counter = new JsonObject(); counter.addProperty("id", (String) bad[0]); counter.addProperty("label", "L"); counter.addProperty("scope", (String) bad[1]); counter.addProperty("maximum", (int) bad[2]);
            var counters = new JsonArray(); counters.add(counter); d.add("counters", counters); rejects(d, fields, field, (String) bad[3]);
        }
        d = copy.get(); var okCounter = new JsonObject(); okCounter.addProperty("id", "warning"); okCounter.addProperty("label", "L"); okCounter.addProperty("scope", "shared"); okCounter.addProperty("maximum", 3);
        var okCounters = new JsonArray(); okCounters.add(okCounter); d.add("counters", okCounters); FieldNotes.validate(d, fields, field); checks++;

        // Replaceability: a datapack's document for a field validates on its own and replaces the shipped one.
        var replacement = copy.get(); replacement.addProperty("summary", "A server's own wording.");
        var replaced = new TreeMap<>(documents); replaced.put(field, replacement);
        check(FieldNotes.validateAll(replaced, fields).get(field).get("summary").getAsString().equals("A server's own wording."), "A datapack can replace a field's notes");

        // A battle keeps the notes of the snapshot it began with; a later catalog's notes only reach battles that start after it.
        var snapshotBattle = UUID.fromString("00000000-0000-0000-0000-0000000000b1");
        var oldNotes = FieldNotes.validateAll(documents, fields);
        var newNotes = FieldNotes.validateAll(replaced, fields);
        var before = JsonParser.parseString(FieldNotes.payload(snapshotBattle, field, 1, oldNotes)).getAsJsonObject();
        var after = JsonParser.parseString(FieldNotes.payload(snapshotBattle, field, 2, newNotes)).getAsJsonObject();
        check(before.getAsJsonObject("notes").get("summary").getAsString().equals(good.get("summary").getAsString()) && after.get("revision").getAsLong() == 2
            && after.getAsJsonObject("notes").get("summary").getAsString().equals("A server's own wording."), "Revisions carry their own text");
        check(newNotes != oldNotes && !oldNotes.get(field).equals(newNotes.get(field)), "Snapshots are independent");
        return checks;
    }
}
