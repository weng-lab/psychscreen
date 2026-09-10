import type { TrackStoreInstance } from "@weng-lab/genomebrowser";
import { fetchLDRelationships } from "./fetchRelationships";
import { parseLDAnchor } from "./anchor";
import type { LDAnchor, LDRelationship, LDSelection } from "./types";
import type { LDSelectionStore } from "./selection";

const HOVER_REQUEST_DELAY_MS = 200;

export function attachLDInteractions({
  useTrackStore,
  manhattanTrackId,
  ldTrackId,
  selectionStore,
  fetchRelationships = fetchLDRelationships,
}: {
  useTrackStore: TrackStoreInstance;
  manhattanTrackId: string;
  ldTrackId: string;
  selectionStore: LDSelectionStore;
  fetchRelationships?: typeof fetchLDRelationships;
}) {
  // Browser interaction callbacks run outside React, so this state is session-local.
  let disposed = false;
  let hoveredAnchor: LDAnchor | undefined;
  let pinnedAnchor: LDAnchor | undefined;
  let activeRequest:
    { anchorId: string; controller: AbortController } | undefined;
  let pendingHover:
    { anchorId: string; timeout: ReturnType<typeof setTimeout> } | undefined;
  const relationshipCache = new Map<string, LDRelationship[]>();

  const cancelPendingHover = () => {
    if (pendingHover) clearTimeout(pendingHover.timeout);
    pendingHover = undefined;
  };

  const updateSelection = (
    anchor: LDAnchor | undefined,
    relationships: LDRelationship[],
    status: LDSelection["status"],
  ) => {
    selectionStore.set({
      anchor,
      relationships,
      status,
      pinnedVariantId: pinnedAnchor?.id,
    });
  };

  const clear = () => {
    cancelPendingHover();
    activeRequest?.controller.abort();
    activeRequest = undefined;
    updateSelection(undefined, [], "idle");
  };

  const show = async (anchor: LDAnchor) => {
    const cached = relationshipCache.get(anchor.id);
    if (cached) {
      activeRequest?.controller.abort();
      activeRequest = undefined;
      updateSelection(anchor, cached, "success");
      return;
    }

    updateSelection(anchor, [], "loading");
    if (activeRequest?.anchorId === anchor.id) return;

    activeRequest?.controller.abort();
    const controller = new AbortController();
    const request = { anchorId: anchor.id, controller };
    activeRequest = request;

    try {
      const relationships = await fetchRelationships(
        anchor.id,
        controller.signal,
      );
      // Hover or selection can change while a request is in flight.
      if (controller.signal.aborted || activeRequest !== request) return;

      relationshipCache.set(anchor.id, relationships);
      const currentAnchor = hoveredAnchor ?? pinnedAnchor;
      if (currentAnchor?.id === anchor.id) {
        updateSelection(currentAnchor, relationships, "success");
      }
    } catch (error) {
      if (!controller.signal.aborted && activeRequest === request) {
        console.error(error);
        const currentAnchor = hoveredAnchor ?? pinnedAnchor;
        if (currentAnchor?.id === anchor.id)
          updateSelection(currentAnchor, [], "error");
      }
    } finally {
      if (activeRequest === request) activeRequest = undefined;
    }
  };

  const handleHover = (item: unknown) => {
    if (disposed) return;
    const anchor = parseLDAnchor(item);
    if (!anchor) return;
    hoveredAnchor = anchor;

    if (
      relationshipCache.has(anchor.id) ||
      activeRequest?.anchorId === anchor.id
    ) {
      cancelPendingHover();
      void show(anchor);
      return;
    }
    if (pendingHover?.anchorId === anchor.id) return;

    cancelPendingHover();
    updateSelection(anchor, [], "loading");
    pendingHover = {
      anchorId: anchor.id,
      timeout: setTimeout(() => {
        pendingHover = undefined;
        if (hoveredAnchor?.id === anchor.id) void show(anchor);
      }, HOVER_REQUEST_DELAY_MS),
    };
  };

  const handleLeave = (item: unknown) => {
    if (disposed) return;
    const anchor = parseLDAnchor(item);
    if (!anchor || hoveredAnchor?.id !== anchor.id) return;
    hoveredAnchor = undefined;
    cancelPendingHover();
    if (pinnedAnchor) void show(pinnedAnchor);
    else clear();
  };

  const handleClick = (item: unknown) => {
    if (disposed) return;
    const anchor = parseLDAnchor(item);
    if (!anchor) return;
    cancelPendingHover();
    pinnedAnchor = pinnedAnchor?.id === anchor.id ? undefined : anchor;
    const activeAnchor = hoveredAnchor ?? pinnedAnchor;
    if (activeAnchor) void show(activeAnchor);
    else clear();
  };

  const manhattanResult = useTrackStore
    .getState()
    .updateTrack(manhattanTrackId, {
      interaction: {
        onHover: handleHover,
        onLeave: handleLeave,
      },
    });
  if (!manhattanResult.ok) throw new Error(manhattanResult.error);

  const ldResult = useTrackStore.getState().updateTrack(ldTrackId, {
    interaction: {
      onClick: handleClick,
      onHover: handleHover,
      onLeave: handleLeave,
    },
  });
  if (!ldResult.ok) throw new Error(ldResult.error);

  return {
    clearHover() {
      if (disposed) return;
      hoveredAnchor = undefined;
      cancelPendingHover();
      if (pinnedAnchor) void show(pinnedAnchor);
      else clear();
    },
    reset() {
      if (disposed) return;
      hoveredAnchor = undefined;
      pinnedAnchor = undefined;
      relationshipCache.clear();
      clear();
    },
    dispose() {
      disposed = true;
      cancelPendingHover();
      activeRequest?.controller.abort();
      activeRequest = undefined;
      hoveredAnchor = undefined;
      pinnedAnchor = undefined;
      relationshipCache.clear();
      selectionStore.set({ relationships: [], status: "idle" });
    },
  };
}
