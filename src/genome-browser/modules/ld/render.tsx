import { useLDSelection } from "./selection";
import {
  useInteraction,
  useTooltip,
  type TrackRendererProps,
} from "@weng-lab/genomebrowser";
import { useEffect, useEffectEvent } from "react";
import {
  createLDArcPath,
  getActiveLDConnections,
  layoutLDVariants,
} from "./helpers";
import { applyLDSelection } from "./normalize";
import type { LDConfig, LDData, LDVariant } from "./types";
import { LD_CONTEXT, LD_REQUEST } from "./requestConfig";
import { createXScale } from "../shared/scale";

export function FullLD({
  color = "#7c97c4",
  data: baselineData,
  region,
  visibleRegion,
  width,
  height,
}: TrackRendererProps<LDConfig, LDData>) {
  const selection = useLDSelection();
  const data = applyLDSelection(baselineData, selection);
  const pinnedId = selection.pinnedVariantId ?? null;
  const plotHeight = Math.max(1, height - 18);
  const x = createXScale(region, width);
  const headerX = x(visibleRegion.start);
  const headerWidth = Math.max(0, x(visibleRegion.end) - headerX);
  const renderedVariants = layoutLDVariants(
    data.variants,
    region,
    width,
    plotHeight,
    pinnedId ?? undefined,
  );
  const renderedById = new Map(
    renderedVariants.map(
      (rendered) => [rendered.variant.id, rendered] as const,
    ),
  );
  const visiblePinnedId =
    pinnedId && renderedById.has(pinnedId) ? pinnedId : null;
  const anchorId = selection.anchor?.id;
  const visibleAnchorId =
    anchorId && renderedById.has(anchorId) ? anchorId : null;
  const activeId = visibleAnchorId ?? visiblePinnedId;
  const activeConnections = getActiveLDConnections(data.connections, activeId);
  const requestStatus =
    selection.status === "loading"
      ? "Loading…"
      : selection.status === "error"
        ? "LD unavailable; hover again to retry"
        : selection.status === "success"
          ? selection.relationships.length === 0
            ? "No LD partners"
            : activeConnections.length === 0
              ? "No partners in view"
              : ""
          : "";
  const interaction = useInteraction<LDVariant>();
  const tooltip = useTooltip<LDVariant, LDConfig>();
  const hideTooltip = useEffectEvent(tooltip.hide);

  useEffect(() => {
    hideTooltip();
  }, [baselineData]);

  return (
    <g>
      <rect width={width} height={height} fill="#ffffff" pointerEvents="none" />
      <svg x={headerX} width={headerWidth} height={16}>
        <text
          x={4}
          y={12}
          fontSize={11}
          fill={selection.status === "error" ? "#a32d2d" : "#555555"}
        >
          <title>{`${LD_REQUEST.assembly} · ${LD_CONTEXT}${requestStatus ? ` · ${requestStatus}` : ""}. Pin a variant, then hover an arc for r².`}</title>
          {LD_CONTEXT}
          {requestStatus ? ` · ${requestStatus}` : ""}
        </text>
      </svg>
      {pinnedId && selection.anchor && (
        <foreignObject
          x={headerX + Math.max(0, headerWidth - 230)}
          y={0}
          width={Math.min(230, headerWidth)}
          height={18}
        >
          <button
            type="button"
            onClick={() => interaction?.onClick?.(selection.anchor!)}
            title={`Clear pinned SNP ${pinnedId}`}
            style={{
              float: "right",
              background: "white",
              border: "1px solid #aaa",
              borderRadius: 3,
              fontSize: 11,
              cursor: "pointer",
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Pinned: {pinnedId} ×
          </button>
        </foreignObject>
      )}
      <g transform="translate(0, 18)">
        {activeConnections.map((connection) => {
          const source = renderedById.get(connection.sourceId);
          const target = renderedById.get(connection.targetId);
          if (!source || !target) return null;

          return (
            <path
              key={`${connection.sourceId}-${connection.targetId}`}
              d={createLDArcPath(source, target, plotHeight)}
              fill="none"
              stroke={color}
              strokeWidth={2}
              opacity={
                0.2 + 0.8 * Math.max(0, Math.min(1, connection.rSquared))
              }
              pointerEvents="stroke"
            >
              <title>{`${connection.sourceId} ↔ ${connection.targetId}: r² = ${connection.rSquared} (${LD_REQUEST.assembly} · ${LD_CONTEXT})`}</title>
            </path>
          );
        })}
        {renderedVariants.map((rendered) => {
          const { variant } = rendered;
          const isPinned = pinnedId === variant.id;

          return (
            <rect
              key={variant.id}
              x={rendered.x}
              y={rendered.y}
              width={rendered.width}
              height={rendered.height}
              fill={color}
              fillOpacity={variant.isSelected ? 1 : 0.65}
              stroke={isPinned ? "#111111" : "none"}
              strokeWidth={isPinned ? 1 : 0}
              style={{ cursor: "pointer" }}
              onClick={() => interaction?.onClick?.(variant)}
              onMouseEnter={(event) => {
                interaction?.onHover?.(variant);
                tooltip.show(variant, event);
              }}
              onMouseLeave={() => {
                interaction?.onLeave?.(variant);
                tooltip.hide();
              }}
            />
          );
        })}
        {activeId && renderedById.has(activeId) && (
          <text
            x={Math.max(
              headerX + 4,
              Math.min(
                headerX + headerWidth - activeId.length * 7 - 4,
                renderedById.get(activeId)!.centerX + 7,
              ),
            )}
            y={Math.max(12, renderedById.get(activeId)!.y - 5)}
            fontSize={12}
            fill="#111111"
            stroke="white"
            strokeWidth={3}
            paintOrder="stroke"
            pointerEvents="none"
          >
            {activeId}
          </text>
        )}
      </g>
    </g>
  );
}
