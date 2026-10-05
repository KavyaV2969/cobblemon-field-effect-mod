package dev.rejuvenation;

import com.google.gson.JsonParser;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.Opcodes;
import org.objectweb.asm.Type;
import org.objectweb.asm.tree.*;
import java.io.InputStream;
import java.util.*;

/**
 * Offline ABI check of every mixin in rejuvenation.mixins.json and rejuvenation.compat.mixins.json against the
 * installed target bytecode on the test classpath (Cobblemon, Run & Bun, Battle Extras, Minecraft intermediary).
 * For each injector it requires the target method to exist and the handler to match it (static-ness, all or no
 * target arguments, @Coerce accepting a supertype, CallbackInfo/CallbackInfoReturnable), and every @Shadow member
 * to exist. Optional injectors (require=0) may be absent but are reported. No game, mixin environment or launch.
 */
public final class MixinAbiVerification {
    private MixinAbiVerification() {}
    private static final String MIXIN = "Lorg/spongepowered/asm/mixin/Mixin;", SHADOW = "Lorg/spongepowered/asm/mixin/Shadow;",
        COERCE = "Lorg/spongepowered/asm/mixin/injection/Coerce;", CI = "org/spongepowered/asm/mixin/injection/callback/CallbackInfo",
        CIR = "org/spongepowered/asm/mixin/injection/callback/CallbackInfoReturnable";
    private static final Set<String> INJECTORS = Set.of("Lorg/spongepowered/asm/mixin/injection/Inject;", "Lorg/spongepowered/asm/mixin/injection/ModifyVariable;",
        "Lorg/spongepowered/asm/mixin/injection/Redirect;", "Lorg/spongepowered/asm/mixin/injection/ModifyArg;", "Lorg/spongepowered/asm/mixin/injection/ModifyConstant;",
        "Lcom/llamalad7/mixinextras/injector/ModifyReturnValue;", "Lcom/llamalad7/mixinextras/injector/wrapoperation/WrapOperation;");

    public record Report(int checked, List<String> optionalAbsent, List<String> mergedTargets) {}

    public static Report run() throws Exception {
        int checked = 0;
        var optional = new ArrayList<String>();
        var merged = new ArrayList<String>();
        for (String config : List.of("rejuvenation.mixins.json", "rejuvenation.compat.mixins.json")) {
            var json = JsonParser.parseString(new String(resource(config).readAllBytes())).getAsJsonObject();
            String pkg = json.get("package").getAsString();
            var names = new ArrayList<String>();
            for (String section : List.of("mixins", "client", "server")) if (json.has(section)) json.getAsJsonArray(section).forEach(e -> names.add(e.getAsString()));
            for (String name : names) {
                var mixin = node(pkg + "." + name);
                for (String target : targets(mixin)) {
                    var t = node(target.replace('/', '.'));
                    addBattleExtrasMerged(mixin, t, merged);
                    checked += verify(mixin, t, optional);
                }
            }
        }
        return new Report(checked, optional, merged);
    }

    /** Methods Battle Extras' MoveTileMixin adds to Cobblemon's move tile that our hooks target, and the injection point. */
    private record Merged(String method, String descriptor, String at) {}
    private static final Map<String, Merged> MERGED = Map.of(
        "BattleExtrasAccuracyMixin", new Merged("calculateAdjustedAccuracy",
            "(DLjava/lang/String;Lcom/cobblemon/mod/common/client/battle/ClientBattlePokemon;Lcom/cobblemon/mod/common/api/moves/MoveTemplate;)D", "RETURN"),
        "BattleExtrasTooltipScopeMixin", new Merged("renderTooltipAtPosition", "(Lnet/minecraft/class_332;III[I)V", "HEAD/RETURN"));

    /** Certify the installed provider's merged method instead of treating the hook as an absent optional target. */
    private static void addBattleExtrasMerged(ClassNode consumer, ClassNode target, List<String> merged) throws Exception {
        var wanted = MERGED.get(consumer.name.substring(consumer.name.lastIndexOf('/') + 1));
        if (wanted == null) return;
        String config = "cobblemon-battle-extras.client.mixins.json";
        var json = JsonParser.parseString(new String(resource(config).readAllBytes())).getAsJsonObject();
        if (!json.getAsJsonArray("client").asList().stream().anyMatch(e -> e.getAsString().equals("MoveTileMixin")))
            throw new AssertionError("Battle Extras no longer registers its MoveTileMixin");
        var provider = node(json.get("package").getAsString() + ".MoveTileMixin", 0);
        if (!targets(provider).contains(target.name)) throw new AssertionError("Battle Extras MoveTileMixin targets a different class");
        var method = provider.methods.stream().filter(m -> m.name.equals(wanted.method()) && m.desc.equals(wanted.descriptor())).findFirst()
            .orElseThrow(() -> new AssertionError("Battle Extras merged method " + wanted.method() + " has changed its ABI"));
        if ((method.access & (Opcodes.ACC_STATIC | Opcodes.ACC_ABSTRACT)) != 0 ||
            annotations(method).stream().anyMatch(a -> a.desc.equals(SHADOW) || a.desc.equals("Lorg/spongepowered/asm/mixin/Unique;") ||
                a.desc.equals("Lorg/spongepowered/asm/mixin/Final;") || INJECTORS.contains(a.desc)))
            throw new AssertionError("Battle Extras no longer contributes " + wanted.method() + " as an ordinary instance method");
        boolean called = provider.methods.stream().anyMatch(m -> {
            for (var instruction : m.instructions) if (instruction instanceof MethodInsnNode call && call.owner.equals(provider.name) &&
                call.name.equals(method.name) && call.desc.equals(method.desc)) return true;
            return false;
        });
        if (!called) throw new AssertionError("Battle Extras no longer calls " + wanted.method());
        int providerPriority = priority(provider, json.has("priority") ? json.get("priority").getAsInt() : 1000);
        int consumerPriority = priority(consumer, 1000);
        // Installed Mixin 0.8.7: MethodHead and BeforeReturn.checkPriority accept merged targets at any priority. Mixins
        // of one target apply in ascending priority, so the consumer must still apply after the provider for the merged
        // method to exist when its injections are resolved.
        if (consumerPriority <= providerPriority)
            throw new AssertionError(consumer.name + " must apply after Battle Extras (" + consumerPriority + " <= " + providerPriority + ")");
        if (target.methods.stream().noneMatch(m -> m.name.equals(method.name) && m.desc.equals(method.desc))) target.methods.add(method);
        merged.add(provider.name + "." + method.name + method.desc + " -> " + target.name + "; provider priority " + providerPriority +
            ", consumer priority " + consumerPriority + "; " + wanted.at() + " permits merged targets; consumer applies after provider");
    }

    private static int priority(ClassNode mixin, int fallback) {
        for (var annotation : annotations(mixin)) if (annotation.desc.equals(MIXIN)) {
            var value = values(annotation).get("priority");
            if (value instanceof Integer p) return p;
        }
        return fallback;
    }

    private static int verify(ClassNode mixin, ClassNode target, List<String> optional) {
        int checked = 0;
        for (var field : mixin.fields) if (has(field.visibleAnnotations, SHADOW) || has(field.invisibleAnnotations, SHADOW)) {
            String owner = mixin.name;
            if (target.fields.stream().noneMatch(f -> f.name.equals(field.name) && f.desc.equals(field.desc)))
                throw new AssertionError(owner + ": @Shadow field " + field.name + " " + field.desc + " missing from " + target.name);
            checked++;
        }
        for (var method : mixin.methods) {
            if (has(method.visibleAnnotations, SHADOW) || has(method.invisibleAnnotations, SHADOW)) {
                if (target.methods.stream().noneMatch(m -> m.name.equals(method.name) && m.desc.equals(method.desc)))
                    throw new AssertionError(mixin.name + ": @Shadow method " + method.name + method.desc + " missing from " + target.name);
                checked++;
            }
            for (var annotation : annotations(method)) {
                if (!INJECTORS.contains(annotation.desc)) continue;
                var values = values(annotation);
                @SuppressWarnings("unchecked") var selectors = (List<String>) values.getOrDefault("method", List.of());
                boolean required = !Integer.valueOf(0).equals(values.get("require"));
                for (String selector : selectors) {
                    String wanted = selector.contains("(") ? selector.substring(0, selector.indexOf('(')) : selector;
                    String wantedDesc = selector.contains("(") ? selector.substring(selector.indexOf('(')) : null;
                    var candidates = target.methods.stream().filter(m -> m.name.equals(wanted) && (wantedDesc == null || m.desc.equals(wantedDesc))).toList();
                    if (candidates.isEmpty()) {
                        if (required) throw new AssertionError(mixin.name + "." + method.name + ": target " + target.name + "." + selector + " is missing");
                        optional.add(mixin.name + "." + method.name + " -> " + target.name + "." + selector);
                        continue;
                    }
                    if (annotation.desc.endsWith("/Inject;") && candidates.stream().noneMatch(m -> injectCompatible(method, m)))
                        throw new AssertionError(mixin.name + "." + method.name + method.desc + " does not match " + target.name + "." + selector + " " + candidates.stream().map(m -> m.desc).toList());
                    if (annotation.desc.endsWith("/ModifyVariable;") && candidates.stream().noneMatch(m -> Arrays.stream(Type.getArgumentTypes(m.desc)).anyMatch(a -> a.getDescriptor().equals(Type.getReturnType(method.desc).getDescriptor()))))
                        throw new AssertionError(mixin.name + "." + method.name + ": no " + Type.getReturnType(method.desc) + " argument in " + target.name + "." + selector);
                    checked++;
                }
            }
        }
        return checked;
    }

    /** @Inject handler: same static-ness; no target arguments or all of them (a @Coerce argument may be a supertype); then the callback. */
    static boolean injectCompatible(MethodNode handler, MethodNode target) {
        if (((handler.access & Opcodes.ACC_STATIC) != 0) != ((target.access & Opcodes.ACC_STATIC) != 0)) return false;
        var h = Type.getArgumentTypes(handler.desc); var t = Type.getArgumentTypes(target.desc);
        if (h.length == 0) return false;
        String callback = h[h.length - 1].getInternalName();
        boolean returns = Type.getReturnType(target.desc) != Type.VOID_TYPE;
        if (!(callback.equals(CI) || returns && callback.equals(CIR))) return false;
        if (h.length == 1) return true;
        if (h.length - 1 < t.length) return false;
        for (int i = 0; i < t.length; i++) {
            if (h[i].getDescriptor().equals(t[i].getDescriptor())) continue;
            if (coerced(handler, i) && h[i].getSort() == Type.OBJECT && t[i].getSort() == Type.OBJECT) continue;
            return false;
        }
        return true;
    }

    private static boolean coerced(MethodNode method, int parameter) {
        for (var group : new List[][]{method.visibleParameterAnnotations, method.invisibleParameterAnnotations}) {
            if (group == null || parameter >= group.length || group[parameter] == null) continue;
            for (Object a : group[parameter]) if (((AnnotationNode) a).desc.equals(COERCE)) return true;
        }
        return false;
    }

    private static List<String> targets(ClassNode mixin) {
        var out = new ArrayList<String>();
        for (var annotation : annotations(mixin)) if (annotation.desc.equals(MIXIN)) {
            var values = values(annotation);
            if (values.get("value") instanceof List<?> types) for (Object type : types) out.add(((Type) type).getInternalName());
            if (values.get("targets") instanceof List<?> names) for (Object name : names) out.add(((String) name).replace('.', '/'));
        }
        if (out.isEmpty()) throw new AssertionError(mixin.name + " has no @Mixin target");
        return out;
    }

    private static List<AnnotationNode> annotations(ClassNode c) { var out = new ArrayList<AnnotationNode>(); if (c.visibleAnnotations != null) out.addAll(c.visibleAnnotations); if (c.invisibleAnnotations != null) out.addAll(c.invisibleAnnotations); return out; }
    private static List<AnnotationNode> annotations(MethodNode m) { var out = new ArrayList<AnnotationNode>(); if (m.visibleAnnotations != null) out.addAll(m.visibleAnnotations); if (m.invisibleAnnotations != null) out.addAll(m.invisibleAnnotations); return out; }
    private static boolean has(List<AnnotationNode> list, String desc) { return list != null && list.stream().anyMatch(a -> a.desc.equals(desc)); }
    private static Map<String, Object> values(AnnotationNode a) { var out = new HashMap<String, Object>(); if (a.values != null) for (int i = 0; i + 1 < a.values.size(); i += 2) out.put((String) a.values.get(i), a.values.get(i + 1)); return out; }

    private static ClassNode node(String name) throws Exception {
        return node(name, ClassReader.SKIP_CODE);
    }
    private static ClassNode node(String name, int flags) throws Exception {
        try (InputStream in = resource(name.replace('.', '/') + ".class")) {
            var node = new ClassNode(); new ClassReader(in).accept(node, flags); return node;
        }
    }
    private static InputStream resource(String path) {
        var in = MixinAbiVerification.class.getClassLoader().getResourceAsStream(path);
        if (in == null) throw new AssertionError("Missing on the verification classpath: " + path);
        return in;
    }
}
