package dev.rejuvenation.client;

import dev.rejuvenation.RejuvenationFields;
import dev.rejuvenation.net.FieldPayloads;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.fabric.api.client.networking.v1.ClientPlayConnectionEvents;
import net.fabricmc.fabric.api.client.networking.v1.ClientPlayNetworking;
import net.fabricmc.fabric.api.client.rendering.v1.HudRenderCallback;

/** Client-only: the field panel, its notes overlay and the field-aware move previews. Never loaded on a dedicated server. */
public final class RejuvenationFieldsClient implements ClientModInitializer {
    private static boolean panelFailed;
    @Override public void onInitializeClient() {
        ClientPlayNetworking.registerGlobalReceiver(FieldPayloads.FieldState.ID, (payload, context) ->
            context.client().execute(() -> accept(() -> ClientFieldState.acceptState(payload.json()))));
        ClientPlayNetworking.registerGlobalReceiver(FieldPayloads.Notes.ID, (payload, context) ->
            context.client().execute(() -> accept(() -> ClientFieldState.acceptNotes(payload.json()))));
        ClientPlayNetworking.registerGlobalReceiver(FieldPayloads.MoveEvaluations.ID, (payload, context) ->
            context.client().execute(() -> accept(() -> ClientFieldState.acceptEvaluations(payload.json()))));
        ClientPlayConnectionEvents.DISCONNECT.register((handler, client) -> { ClientFieldState.reset(); FieldNotesRenderer.reset(); FieldPanelRenderer.clearTextureCache(); panelFailed=false; });
        FieldNotesRenderer.register();
        // Previews ask for on-demand measurements while drawing; requests leave once per tick, in server-sized chunks.
        net.fabricmc.fabric.api.client.event.lifecycle.v1.ClientTickEvents.END_CLIENT_TICK.register(client -> accept(() -> {
            if (!ClientPlayNetworking.canSend(FieldPayloads.EvaluationRequest.ID)) return;
            for (String json; (json = ClientFieldState.drainRequest()) != null; ) ClientPlayNetworking.send(new FieldPayloads.EvaluationRequest(json));
        }));
        HudRenderCallback.EVENT.register((context, tickCounter) -> {
            if (panelFailed) return;
            try { FieldPanelRenderer.render(context); }
            catch (RuntimeException error) { panelFailed = true; RejuvenationFields.LOG.error("Field panel rendering failed; the panel is disabled for this session", error); }
        });
    }
    private static void accept(Runnable action) {
        try { action.run(); } catch (RuntimeException error) { RejuvenationFields.LOG.error("Malformed field payload ignored", error); }
    }
}
