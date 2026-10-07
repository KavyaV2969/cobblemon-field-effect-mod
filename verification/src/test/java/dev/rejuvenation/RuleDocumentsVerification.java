package dev.rejuvenation;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Random;

/** Mapping and structure documents merge by (order, resource ID) regardless of the order the resource manager lists them in. */
public final class RuleDocumentsVerification {
    private static int checks;
    private static void check(boolean ok, String message) { if (!ok) throw new AssertionError(message); checks++; }
    private static RuleDocuments.Doc doc(String id, String json) { return new RuleDocuments.Doc(id, JsonParser.parseString(json).getAsJsonObject()); }
    private static String names(JsonArray rows) {
        var out = new StringBuilder();
        for (var row : rows) out.append(row.getAsJsonObject().get("n").getAsString());
        return out.toString();
    }
    private static void rejects(RuleDocuments.Doc doc, String why) {
        try { RuleDocuments.merge(List.of(doc)); } catch (IllegalArgumentException expected) { checks++; return; }
        throw new AssertionError("Accepted " + why);
    }

    public static int run() {
        var docs = List.of(
            doc("rejuvenation:rejuvenation/mappings/zz_base.json", "{\"schemaVersion\":1,\"order\":100,\"rules\":[{\"n\":\"E\"},{\"n\":\"F\"}]}"),
            doc("cobbleverse:rejuvenation/mappings/aa_ext.json", "{\"schemaVersion\":1,\"order\":50,\"rules\":[{\"n\":\"C\"},{\"n\":\"D\"}]}"),
            doc("rejuvenation:rejuvenation/mappings/late.json", "{\"schemaVersion\":1,\"order\":200,\"rules\":[{\"n\":\"G\"}]}"),
            doc("rejuvenation:rejuvenation/mappings/b_tie.json", "{\"schemaVersion\":1,\"rules\":[{\"n\":\"B\"}]}"),
            doc("rejuvenation:rejuvenation/mappings/a_tie.json", "{\"schemaVersion\":1,\"rules\":[{\"n\":\"A\"}]}"),
            doc("rejuvenation:rejuvenation/mappings/negative.json", "{\"schemaVersion\":1,\"order\":-5,\"rules\":[{\"n\":\"0\"}]}"));
        // Negative and lowest orders first, then the default 0 documents by resource ID, then ascending order.
        check(names(RuleDocuments.merge(docs)).equals("0ABCDEFG"), "order then resource ID: " + names(RuleDocuments.merge(docs)));
        var random = new Random(20261007);
        for (int i = 0; i < 200; i++) {
            var shuffled = new ArrayList<>(docs);
            Collections.shuffle(shuffled, random);
            check(names(RuleDocuments.merge(shuffled)).equals("0ABCDEFG"), "merge is independent of listing order");
        }
        // Rows keep file order inside a document, and the same-order tie is decided by the resource ID's namespace, then path.
        var tie = List.of(doc("zeta:rejuvenation/mappings/x.json", "{\"rules\":[{\"n\":\"2\"}]}"), doc("alpha:rejuvenation/mappings/x.json", "{\"rules\":[{\"n\":\"1\"}]}"));
        check(names(RuleDocuments.merge(tie)).equals("12"), "namespace breaks ties deterministically");
        // Malformed documents are rejected, never ignored.
        rejects(doc("p:x", "{\"rules\":[],\"order\":1.5}"), "a fractional order");
        rejects(doc("p:x", "{\"rules\":[],\"order\":\"1\"}"), "a string order");
        rejects(doc("p:x", "{\"rules\":[],\"order\":2000000}"), "an out-of-range order");
        rejects(doc("p:x", "{\"rules\":[],\"priority\":1}"), "an unknown document key");
        rejects(doc("p:x", "{\"order\":1}"), "a document without rules");
        rejects(doc("p:x", "{\"rules\":{}}"), "rules that are not an array");
        check(RuleDocuments.merge(List.of()).isEmpty(), "no documents, no rows");
        return checks;
    }
}
