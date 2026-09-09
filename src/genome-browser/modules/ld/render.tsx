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
              opacity={0.55}
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
      </g>
    </g>
  );
}
