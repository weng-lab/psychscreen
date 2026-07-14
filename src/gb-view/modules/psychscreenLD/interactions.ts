import type { TrackStoreInstance } from "@weng-lab/genomebrowser-v2";
import { z } from "zod";
import { parsePsychscreenLDAnchor } from "./module";
import type { PsychscreenLDAnchor, PsychscreenLDConfig } from "./types";

const responseSchema = z.object({
  associatedVariantIds: z.array(z.string().min(1)),
});

export function attachPsychscreenLDInteractions({
  useTrackStore,
  manhattanTrackId,
  ldTrackId,
}: {
  useTrackStore: TrackStoreInstance;
  manhattanTrackId: string;
  ldTrackId: string;
}) {
  // The genome browser calls these handlers outside React, so keep interaction state here.
  let hoveredAnchor: PsychscreenLDAnchor | undefined;
  let pinnedAnchor: PsychscreenLDAnchor | undefined;
  let activeRequest:
    { anchorId: string; controller: AbortController } | undefined;
  const relationshipCache = new Map<string, string[]>();

  const updateConfig = (
    anchor: PsychscreenLDAnchor | undefined,
    associatedVariantIds: string[],
  ) => {
    const result = useTrackStore
      .getState()
      .updateConfig<PsychscreenLDConfig>(ldTrackId, {
        anchor,
        associatedVariantIds,
        pinnedVariantId: pinnedAnchor?.id,
      });
    if (!result.ok) console.error(result.error);
  };

  const clear = () => {
    activeRequest?.controller.abort();
    activeRequest = undefined;
    updateConfig(undefined, []);
  };

  const show = async (anchor: PsychscreenLDAnchor) => {
    const cached = relationshipCache.get(anchor.id);
    if (cached) {
      activeRequest?.controller.abort();
      activeRequest = undefined;
      updateConfig(anchor, cached);
      return;
    }

    updateConfig(anchor, []);
    if (activeRequest?.anchorId === anchor.id) return;

    activeRequest?.controller.abort();
    const controller = new AbortController();
    const request = { anchorId: anchor.id, controller };
    activeRequest = request;

    try {
      const response = await fetch("/api/genome-browser/ld", {
        method: "POST",
        headers: { "content-type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ id: anchor.id }),
      });
      if (!response.ok)
        throw new Error(`LD request failed with ${response.status}`);

      const { associatedVariantIds } = responseSchema.parse(
        await response.json(),
      );
      // Hover/selection can change while the request is in flight; ignore stale data.
      if (controller.signal.aborted || activeRequest !== request) return;

      relationshipCache.set(anchor.id, associatedVariantIds);
      const currentAnchor = hoveredAnchor ?? pinnedAnchor;
      if (currentAnchor?.id === anchor.id)
        updateConfig(currentAnchor, associatedVariantIds);
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error(error);
        const currentAnchor = hoveredAnchor ?? pinnedAnchor;
        if (currentAnchor?.id === anchor.id) updateConfig(currentAnchor, []);
      }
    } finally {
      if (activeRequest === request) activeRequest = undefined;
    }
  };

  const handleHover = (item: unknown) => {
    const anchor = parsePsychscreenLDAnchor(item);
    if (!anchor) return;
    hoveredAnchor = anchor;
    void show(anchor);
  };

  const handleLeave = (item: unknown) => {
    const anchor = parsePsychscreenLDAnchor(item);
    if (!anchor || hoveredAnchor?.id !== anchor.id) return;
    hoveredAnchor = undefined;
    if (pinnedAnchor) void show(pinnedAnchor);
    else clear();
  };

  const handleClick = (item: unknown) => {
    const anchor = parsePsychscreenLDAnchor(item);
    if (!anchor) return;
    pinnedAnchor = pinnedAnchor?.id === anchor.id ? undefined : anchor;
    const activeAnchor = hoveredAnchor ?? pinnedAnchor;
    if (activeAnchor) void show(activeAnchor);
    else clear();
  };

  const manhattanResult = useTrackStore
    .getState()
    .updateInteraction(manhattanTrackId, {
      onHover: handleHover,
      onLeave: handleLeave,
    });
  if (!manhattanResult.ok) throw new Error(manhattanResult.error);

  const ldResult = useTrackStore.getState().updateInteraction(ldTrackId, {
    onClick: handleClick,
    onHover: handleHover,
    onLeave: handleLeave,
  });
  if (!ldResult.ok) throw new Error(ldResult.error);

  return {
    reset() {
      hoveredAnchor = undefined;
      pinnedAnchor = undefined;
      relationshipCache.clear();
      clear();
    },
    dispose() {
      activeRequest?.controller.abort();
      activeRequest = undefined;
    },
  };
}
