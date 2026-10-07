package dev.rejuvenation.net;

import net.fabricmc.fabric.api.networking.v1.PayloadTypeRegistry;
import net.minecraft.class_2540;
import net.minecraft.class_2960;
import net.minecraft.class_8710;
import net.minecraft.class_9139;

/**
 * Field payloads. All carry JSON text so the wire format can grow without a protocol bump.
 * Common code: registered on both sides; the client receives state/evaluations, the server evaluation requests.
 */
public final class FieldPayloads {
    private FieldPayloads() {}
    private static final int MAX_LENGTH = 1 << 18;

    /** The battle's current field state, as the simulator's ordered {@code rejuvenationstate} instruction reports it. */
    public record FieldState(String json) implements class_8710 {
        public static final class_8710.class_9154<FieldState> ID = new class_8710.class_9154<>(class_2960.method_60655("rejuvenation", "field_state"));
        public static final class_9139<class_2540, FieldState> CODEC = class_8710.method_56484(
            (value, buf) -> buf.method_10788(value.json(), MAX_LENGTH), buf -> new FieldState(buf.method_10800(MAX_LENGTH)));
        @Override public class_8710.class_9154<? extends class_8710> method_56479() { return ID; }
    }

    /**
     * One field's player-facing notes (or {@code missing}) with the revision of the battle's catalog snapshot, sent by the server with the
     * field state the first time the field is shown to a player. Plain text only; the client never requests anything.
     */
    public record Notes(String json) implements class_8710 {
        private static final int MAX_NOTES = 1 << 15;
        public static final class_8710.class_9154<Notes> ID = new class_8710.class_9154<>(class_2960.method_60655("rejuvenation", "field_notes"));
        public static final class_9139<class_2540, Notes> CODEC = class_8710.method_56484(
            (value, buf) -> buf.method_10788(value.json(), MAX_NOTES), buf -> new Notes(buf.method_10800(MAX_NOTES)));
        @Override public class_8710.class_9154<? extends class_8710> method_56479() { return ID; }
    }

    /** Field-aware evaluations of the receiving player's moves for the current decision. */
    public record MoveEvaluations(String json) implements class_8710 {
        public static final class_8710.class_9154<MoveEvaluations> ID = new class_8710.class_9154<>(class_2960.method_60655("rejuvenation", "move_evaluations"));
        public static final class_9139<class_2540, MoveEvaluations> CODEC = class_8710.method_56484(
            (value, buf) -> buf.method_10788(value.json(), MAX_LENGTH), buf -> new MoveEvaluations(buf.method_10800(MAX_LENGTH)));
        @Override public class_8710.class_9154<? extends class_8710> method_56479() { return ID; }
    }

    /**
     * Client-to-server: evaluations the choice packet does not carry eagerly (gimmick variants and benched Pokémon
     * for Battle Extras' switch screen). The server validates every query against the requesting player's own
     * team, the current request and the opposing actives, and answers with a merging {@link MoveEvaluations}.
     */
    public record EvaluationRequest(String json) implements class_8710 {
        private static final int MAX_REQUEST = 1 << 14;
        public static final class_8710.class_9154<EvaluationRequest> ID = new class_8710.class_9154<>(class_2960.method_60655("rejuvenation", "evaluation_request"));
        public static final class_9139<class_2540, EvaluationRequest> CODEC = class_8710.method_56484(
            (value, buf) -> buf.method_10788(value.json(), MAX_REQUEST), buf -> new EvaluationRequest(buf.method_10800(MAX_REQUEST)));
        @Override public class_8710.class_9154<? extends class_8710> method_56479() { return ID; }
    }

    public static void register() {
        PayloadTypeRegistry.playS2C().register(FieldState.ID, FieldState.CODEC);
        PayloadTypeRegistry.playS2C().register(Notes.ID, Notes.CODEC);
        PayloadTypeRegistry.playS2C().register(MoveEvaluations.ID, MoveEvaluations.CODEC);
        PayloadTypeRegistry.playC2S().register(EvaluationRequest.ID, EvaluationRequest.CODEC);
    }
}
