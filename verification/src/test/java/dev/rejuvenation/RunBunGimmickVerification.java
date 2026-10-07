package dev.rejuvenation;

import com.cobblemon.mod.common.battles.*;
import com.google.gson.*;
import dev.rejuvenation.compat.RunBunGimmickPolicy;
import dev.rejuvenation.compat.RunBunStrategy;
import dev.rejuvenation.compat.TrainerBattlePolicy;
import java.nio.file.*;
import java.util.*;

/** Real Cobblemon request regression: disabled Max Moves must disappear before native and field AI decisions. */
public final class RunBunGimmickVerification {
    private static int checks;
    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
        checks++;
    }
    private static ShowdownMoveset offered() {
        var request = new ShowdownMoveset();
        var move = new InBattleMove(); move.setId("thunderbolt"); move.setMove("Thunderbolt");
        move.setPp(15);move.setMaxpp(15);move.setTarget(MoveTarget.normal);
        request.setMoves(List.of(move));
        var max = new InBattleGimmickMove(); max.setMove("Max Lightning");
        request.setCanDynamax(true); request.setMaxMoves(List.of(max));
        request.setCanTerastallize("Flying"); request.setGimmickMapping();
        return request;
    }
    public static void main(String[] args) throws Exception {
        var trainer = JsonParser.parseString(Files.readString(Path.of(args[0]))).getAsJsonObject();
        var config = trainer.getAsJsonObject("ai").getAsJsonObject("data");
        check(!config.get("canDynamax").getAsBoolean() && !config.get("canGmax").getAsBoolean(), "Surge disables Dynamax and Gmax");
        check(config.get("canTera").getAsBoolean() && config.get("teraTarget").getAsString().equals("magnezone"), "Surge targets Magnezone for Tera");
        for (var entry : trainer.getAsJsonArray("team")) {
            var member = entry.getAsJsonObject(); var species = member.get("species").getAsString();
            var request = offered(); request.setCanMegaEvo(species.equals("eelektross"));
            check(request.getMoves().getFirst().getGimmickMove() != null, "Raw request has a Max Move mapping");
            var declaration=member.getAsJsonObject("gimmicks");
            RunBunGimmickPolicy.restrictDeclarations(request,declaration.get("tera").isJsonNull()?null:declaration.get("tera").getAsString(),declaration.get("dynamax").getAsBoolean());
            RunBunGimmickPolicy.restrictSelectors(request,species,config.get("teraTarget").getAsString(),config.get("dynamaxTarget").getAsString());
            check(!request.getCanDynamax() && request.getMaxMoves() == null, species + " cannot Dynamax");
            check(request.getMoves().getFirst().getGimmickMove() == null, species + " has no stale Max Move");
            check(!request.getGimmicks().contains(ShowdownMoveset.Gimmick.DYNAMAX), species + " native AI cannot see Dynamax");
            check((request.getCanTerastallize() != null) == species.equals("magnezone"), species + " Tera permission");
            check(request.getCanMegaEvo() == species.equals("eelektross"), species + " Mega permission preserved");
            var gimmicks = member.getAsJsonObject("gimmicks");
            check(!gimmicks.get("dynamax").getAsBoolean() && !gimmicks.get("gmax").getAsBoolean(), species + " explicit trainer flags");
            check(gimmicks.get("tera").isJsonNull() == !species.equals("magnezone"), species + " explicit Tera target");
        }
        var allowed = offered();
        RunBunGimmickPolicy.restrictDeclarations(allowed,"flying",true);
        check(allowed.getCanDynamax() && allowed.getMaxMoves() != null && allowed.getCanTerastallize() != null, "Other trainers' enabled gimmicks preserved");
        var targeted = offered();
        RunBunGimmickPolicy.restrictDeclarations(targeted,"flying",true);
        RunBunGimmickPolicy.restrictSelectors(targeted,"charizard","magnezone","gyarados");
        check(!targeted.getCanDynamax() && targeted.getCanTerastallize() == null, "Targets restrict globally enabled flags");
        var unavailable = offered(); unavailable.setCanTerastallize(null); unavailable.setCanDynamax(false); unavailable.setMaxMoves(null);
        RunBunGimmickPolicy.restrictDeclarations(unavailable,"flying",true);
        check(!unavailable.getCanDynamax() && unavailable.getCanTerastallize() == null, "Policy never grants unavailable or spent resources");
        var active = offered(); active.setCanDynamax(false);
        RunBunGimmickPolicy.restrictDeclarations(active,null,false);
        check(active.hasActiveGimmick() && active.getMaxMoves() != null && active.getMoves().getFirst().getGimmickMove() != null, "Already active Dynamax retains its mandatory moves");
        var z = offered(); var zmove = new InBattleGimmickMove(); zmove.setMove("Gigavolt Havoc"); z.setCanZMove(List.of(zmove));
        RunBunGimmickPolicy.restrictDeclarations(z,null,false);
        check(z.getMoves().getFirst().getGimmickMove() == zmove, "Allowed Z Move remapped after Max Move removal");
        RunBunGimmickPolicy.restrictDeclarations(null,"flying",true);
        RunBunGimmickPolicy.restrictSelectors(null,"magnezone","magnezone","");
        var megaRequest = offered(); megaRequest.setCanMegaEvo(true);
        check(RunBunGimmickPolicy.requiresMega(true, false, megaRequest, false), "Surge's first legal Mega is required");
        for (String species : List.of("raichu", "magnezone", "ironhands", "archaludon", "rotom", "eelektrossmega"))
            check(RunBunGimmickPolicy.requiresMega(true, false, megaRequest, false), species + " uses actual availability without a species whitelist");
        check(!RunBunGimmickPolicy.requiresMega(true, true, megaRequest, false), "Player-owned NPC-origin Pokemon unchanged");
        check(RunBunGimmickPolicy.requiresMega(true, false, megaRequest, false), "Policy applies to other trainers");
        check(!RunBunGimmickPolicy.requiresMega(false, false, megaRequest, false), "Original trainer type must be NPC");
        check(RunBunGimmickPolicy.requiresMega(true, false, megaRequest, false), "Policy does not depend on trainer tag syntax");
        check(!RunBunGimmickPolicy.requiresMega(true, false, megaRequest, true), "Forced switches remain legal");
        check(!RunBunGimmickPolicy.requiresMega(true, false, null, false), "Missing request never forces activation");
        for (String move : List.of("wildcharge", "drainpunch", "knockoff", "coil")) {
            var normal = new MoveActionResponse(move, "p2a", null);
            var upgraded = RunBunGimmickPolicy.megaVariant(normal, megaRequest, response -> true);
            check(upgraded != null && upgraded.getGimmickID().equals("mega") && upgraded.getMoveName().equals(move) && upgraded.getTargetPnx().equals("p2a"), move + " fallback preserves move and target");
            check(!RunBunStrategy.candidatePermitted(normal, true) && RunBunStrategy.candidatePermitted(upgraded, true), move + " normal action cannot outscore mandatory Mega");
        }
        for (String gimmick : List.of("terastallize", "dynamax", "zmove", "ultra"))
            check(!RunBunStrategy.candidatePermitted(new MoveActionResponse("drainpunch", "p2a", gimmick), true), gimmick + " cannot replace designated Mega");
        var voluntarySwitch = new SwitchActionResponse(UUID.randomUUID());
        check(!RunBunStrategy.candidatePermitted(voluntarySwitch, true) && RunBunStrategy.candidatePermitted(voluntarySwitch, false), "Voluntary switch cannot defer an available NPC Mega");
        check(RunBunGimmickPolicy.megaVariant(new MoveActionResponse("drainpunch", "p2a", null), megaRequest, response -> false) == null, "Illegal Mega move is never forced");
        megaRequest.setCanMegaEvo(false);
        check(!RunBunGimmickPolicy.requiresMega(true, false, megaRequest, false), "Spent or unavailable Mega never forced");
        check(RunBunGimmickPolicy.megaVariant(new MoveActionResponse("drainpunch", "p2a", null), megaRequest, response -> { throw new AssertionError("Unavailable resource validated"); }) == null, "Fallback cannot create spent Mega availability");
        // Per-member declarations apply across AI types; AI-wide flags cannot grant undeclared gimmicks.
        var declared=offered();
        RunBunGimmickPolicy.restrictDeclarations(declared,"flying",true);
        check(declared.getCanDynamax() && declared.getCanTerastallize()!=null,"Declared Tera and Dynamax survive");
        RunBunGimmickPolicy.restrictSelectors(declared,"magnezone","Magnezone","");
        check(declared.getCanTerastallize()!=null && declared.getCanDynamax(),"Case insensitive selector and absent selector preserve declarations");
        RunBunGimmickPolicy.restrictSelectors(declared,"magnezone","charizard","gyarados");
        check(declared.getCanTerastallize()==null && !declared.getCanDynamax() && declared.getMaxMoves()==null,"Selectors can only narrow declarations");
        var undeclared=offered();
        RunBunGimmickPolicy.restrictDeclarations(undeclared,null,false);
        RunBunGimmickPolicy.restrictSelectors(undeclared,"magnezone","magnezone","magnezone");
        check(!undeclared.getCanDynamax() && undeclared.getCanTerastallize()==null,"AI-wide targets cannot enable an undeclared member");
        check(!TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,"dynamax"),undeclared),"Native Dynamax rejected after per-member denial");
        check(!TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,"terastallize"),undeclared),"Native Tera rejected after per-member denial");
        var saved=new TrainerBattlePolicy.Availability(undeclared);
        undeclared.setCanDynamax(true);undeclared.setCanTerastallize("Water");undeclared.setCanMegaEvo(true);undeclared.setMaxMoves(offered().getMaxMoves());
        saved.restore(undeclared);
        check(!undeclared.getCanDynamax() && undeclared.getCanTerastallize()==null && !undeclared.getCanMegaEvo() && undeclared.getMaxMoves()==null,"Native mutations cannot invent permission or availability");
        var full=offered();full.setCanMegaEvo(true);full.setCanUltraBurst(true);full.setCanZMove(List.of(zmove));
        for(String gimmick:List.of("mega","ultra","terastallize","zmove","dynamax")) {
            check(TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,gimmick),full),gimmick+" real offer accepted");
            check(!TrainerBattlePolicy.available(new MoveActionResponse("unknownmove",null,gimmick),full),gimmick+" nonexistent move rejected");
            var snapshot=new TrainerBattlePolicy.Availability(full);
            TrainerBattlePolicy.restrictReserved(full,Set.of(gimmick));
            check(!TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,gimmick),full),gimmick+" earlier allied choice reserves resource");
            snapshot.restore(full);
        }
        check(!TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,"unknown"),full),"Unknown gimmick rejected");
        check(!TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,"mega"),null),"Missing request does not offer Mega");
        check(TrainerBattlePolicy.available(voluntarySwitch,null),"Null forced-switch request permits switch validation");
        var spent=offered();spent.setCanDynamax(false);spent.setMaxMoves(null);spent.setCanTerastallize(null);
        RunBunGimmickPolicy.restrictDeclarations(spent,"flying",true);
        for(String gimmick:List.of("mega","ultra","terastallize","zmove","dynamax"))
            check(!TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,gimmick),spent),gimmick+" spent/unavailable resource stays unavailable");
        var running=offered();running.setCanDynamax(false);var runningSnapshot=new TrainerBattlePolicy.Availability(running);
        running.setMaxMoves(null);runningSnapshot.restore(running);
        check(running.hasActiveGimmick() && running.getMoves().getFirst().getGimmickMove()!=null,"Active Dynamax restored after native request mutation");
        check(!TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,"dynamax"),running),"Active Dynamax cannot be initiated again");
        var disabled=offered();disabled.getMaxMoves().getFirst().setDisabled(true);
        check(!TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,"dynamax"),disabled),"Disabled Max Move rejected");
        var blank=offered();RunBunGimmickPolicy.restrictDeclarations(blank," ",false);
        check(blank.getCanTerastallize()==null,"Blank declaration does not enable Tera");
        check(!TrainerBattlePolicy.scorable(PassActionResponse.INSTANCE),"Mandatory native pass is preserved");
        check(TrainerBattlePolicy.scorable(voluntarySwitch) && TrainerBattlePolicy.scorable(new MoveActionResponse("coil",null,null)),"Moves and switches receive shared consequence scoring");
        var disabledMega=offered();disabledMega.setCanMegaEvo(true);disabledMega.getMoves().getFirst().setDisabled(true);
        check(!TrainerBattlePolicy.available(new MoveActionResponse("thunderbolt",null,"mega"),disabledMega),"Disabled ordinary move cannot be smuggled into a Mega via cached Max mapping");
        System.out.println("Run & Bun gimmick permission checks passed: " + checks);
    }
}
