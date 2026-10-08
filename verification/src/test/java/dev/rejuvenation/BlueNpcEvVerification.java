package dev.rejuvenation;

import com.cobblemon.mod.common.api.pokemon.stats.Stats;
import com.cobblemon.mod.common.pokemon.EVs;
import dev.rejuvenation.compat.BlueNpcEvPolicy;
import dev.rejuvenation.compat.CompatMixinPlugin;
import java.nio.file.*;
import java.util.*;
import java.util.zip.ZipFile;
import org.objectweb.asm.ClassReader;
import org.objectweb.asm.tree.ClassNode;

/** Real EV-storage regression and exact installed RCT/Cobblemon hook ABI checks. */
public final class BlueNpcEvVerification {
    private static int checks;
    private static void check(boolean value, String message) {
        if (!value) throw new AssertionError(message);
        checks++;
    }
    private static ClassNode node(Path jar, String name) throws Exception {
        try (var zip = new ZipFile(jar.toFile())) {
            var out = new ClassNode(); new ClassReader(zip.getInputStream(zip.getEntry(name))).accept(out, 0); return out;
        }
    }
    @SuppressWarnings("unchecked")
    public static void main(String[] args) throws Exception {
        check(BlueNpcEvPolicy.matches(true, "rctmod#kanto_champion_blue"), "Exact NPC Blue tag accepted");
        check(BlueNpcEvPolicy.matches(true, "other_registry#kanto_champion_blue"), "Registry-independent trainer ID accepted");
        for (String tag : new String[] { "rctmod#kanto_brock", "rctmod#champion_blue", "rctmod#kanto_champion_blue_extra", "kanto_champion_blue", "", null })
            check(!BlueNpcEvPolicy.matches(true, tag), "Unrelated identity rejected");
        check(!BlueNpcEvPolicy.matches(false, "rctmod#kanto_champion_blue"), "Player-owned Pokemon rejected even with Blue OT tag");
        for (String mixin : new String[] { "BlueNpcStatsAccessor", "BlueNpcTeamMixin" }) {
            check(!CompatMixinPlugin.enabled(mixin, id -> false), "Optional hook disabled without RCT");
            check(CompatMixinPlugin.enabled(mixin, id -> id.equals("rctapi")), "Optional hook enabled with RCT");
        }
        var ordinary = new EVs();
        ordinary.set(Stats.HP, 252); ordinary.set(Stats.ATTACK, 252); ordinary.set(Stats.DEFENCE, 252);
        check(ordinary.total() == 504, "Normal Cobblemon EV API retains 510 total limit");
        check(ordinary.getOrDefault(Stats.DEFENCE) == 0, "Over-limit stat is normally rejected");
        var field = ordinary.getClass().getSuperclass().getDeclaredField("stats"); field.setAccessible(true);
        var championMap = (Map<com.cobblemon.mod.common.api.pokemon.stats.Stat, Integer>) field.get(ordinary);
        BlueNpcEvPolicy.applyStats(championMap);
        for (Stats stat : new Stats[] {Stats.HP, Stats.ATTACK, Stats.DEFENCE, Stats.SPECIAL_ATTACK, Stats.SPECIAL_DEFENCE, Stats.SPEED})
            check(ordinary.getOrDefault(stat) == 252, "Requested champion EV retained: " + stat);
        check(ordinary.getOrDefault(Stats.ACCURACY) == 0 && ordinary.getOrDefault(Stats.EVASION) == 0, "Battle-only stats are not modified");
        check(ordinary.total() == 1512, "Champion total is the explicit requested 1512");
        var unaffected = new EVs(); unaffected.set(Stats.HP, 252); unaffected.set(Stats.ATTACK, 252); unaffected.set(Stats.SPEED, 252);
        check(unaffected.total() == 504, "Separate ordinary EV instance remains capped");
        var rct = node(Path.of(args[0]), "com/gitlab/srcmc/rctapi/api/trainer/TrainerNPC.class");
        check(rct.methods.stream().anyMatch(m -> m.name.equals("initTeam") && m.desc.equals("(Ljava/lang/String;)V")), "RCT initTeam hook ABI exists");
        check(rct.methods.stream().anyMatch(m -> m.name.equals("copyTeam") && m.desc.equals("([Lcom/cobblemon/mod/common/pokemon/Pokemon;)[Lcom/cobblemon/mod/common/pokemon/Pokemon;") && (m.access & 8) != 0), "RCT static copyTeam hook ABI exists");
        check(rct.fields.stream().anyMatch(f -> f.name.equals("team") && f.desc.equals("[Lcom/cobblemon/mod/common/pokemon/Pokemon;")), "RCT team shadow ABI exists");
        var stats = node(Path.of(args[1]), "com/cobblemon/mod/common/pokemon/PokemonStats.class");
        check(stats.fields.stream().anyMatch(f -> f.name.equals("stats") && f.desc.equals("Ljava/util/Map;")), "Cobblemon stats accessor ABI exists");
        check(stats.methods.stream().anyMatch(m -> m.name.equals("update") && m.desc.equals("()V")), "EV change notification ABI exists");
        System.out.println(checks + " Blue NPC EV and installed-hook checks passed");
        Files.writeString(Path.of(args[2]), "{\"checksPassed\":" + checks + ",\"failed\":false,\"normalEvsCapped\":true,\"blueEvsRetained\":1512,\"exactInstalledHookAbiVerified\":true,\"liveMinecraftBattleTested\":false}\n");
    }
}
