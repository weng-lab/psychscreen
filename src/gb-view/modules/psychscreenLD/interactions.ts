import { gql } from "@apollo/client";
import type { TrackStoreInstance } from "@weng-lab/genomebrowser-v2";
import { z } from "zod";
import { apolloClient } from "../../../graphql/client";
import { parsePsychscreenLDAnchor } from "./module";
import type { PsychscreenLDAnchor, PsychscreenLDConfig } from "./types";

const R_SQUARED_THRESHOLD = 0.7;
const HOVER_REQUEST_DELAY_MS = 200;

const PSYCHSCREEN_LD_QUERY = gql`
  query PsychscreenLD($ids: [String!]!) {
    snp: snpQuery(assembly: "hg38", snpids: $ids) {
      linkageDisequilibrium(rSquaredThreshold: 0.7, population: EUROPEAN) {
        id
        rSquared
      }
    }
  }
`;

const responseSchema = z.object({
  snp: z
    .array(
      z.object({
        linkageDisequilibrium: z
          .array(
            z.object({
              id: z.string().min(1),
              rSquared: z.coerce.number(),
            }),
          )
          .nullish(),
      }),
    )
    .nullish(),
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
  let pendingHover:
    { anchorId: string; timeout: ReturnType<typeof setTimeout> } | undefined;
  const relationshipCache = new Map<string, string[]>();

  const cancelPendingHover = () => {
    if (pendingHover) clearTimeout(pendingHover.timeout);
    pendingHover = undefined;
  };

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
    cancelPendingHover();
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
      const response = await apolloClient.query({
        query: PSYCHSCREEN_LD_QUERY,
        variables: { ids: [anchor.id] },
        context: {
          clientName: "psychscreen",
          fetchOptions: { signal: controller.signal },
          queryDeduplication: false,
        },
        fetchPolicy: "no-cache",
      });
      const data = responseSchema.parse(response.data);
      const associatedVariantIds = [
        ...new Set(
          (data.snp?.[0]?.linkageDisequilibrium ?? [])
            .filter(
              (relationship) => relationship.rSquared >= R_SQUARED_THRESHOLD,
            )
            .map((relationship) => relationship.id),
        ),
      ];
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
    updateConfig(anchor, []);
    pendingHover = {
      anchorId: anchor.id,
      timeout: setTimeout(() => {
        pendingHover = undefined;
        if (hoveredAnchor?.id === anchor.id) void show(anchor);
      }, HOVER_REQUEST_DELAY_MS),
    };
  };

  const handleLeave = (item: unknown) => {
    const anchor = parsePsychscreenLDAnchor(item);
    if (!anchor || hoveredAnchor?.id !== anchor.id) return;
    hoveredAnchor = undefined;
    cancelPendingHover();
    if (pinnedAnchor) void show(pinnedAnchor);
    else clear();
  };

  const handleClick = (item: unknown) => {
    const anchor = parsePsychscreenLDAnchor(item);
    if (!anchor) return;
    cancelPendingHover();
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
      cancelPendingHover();
      activeRequest?.controller.abort();
      activeRequest = undefined;
    },
  };
}
