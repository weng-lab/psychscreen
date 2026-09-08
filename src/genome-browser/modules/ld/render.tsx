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

export function FullLD({
  color = "#7c97c4",
  data: baselineData,
  region,
  width,
  height,
}: TrackRendererProps<LDConfig, LDData>) {
  const selection = useLDSelection();
  const data = applyLDSelection(baselineData, selection);
  const pinnedId = selection.pinnedVariantId ?? null;
  const renderedVariants = layoutLDVariants(
    data.variants,
    region,
    width,
    height,
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
  const interaction = useInteraction<LDVariant>();
  const tooltip = useTooltip<LDVariant, LDConfig>();
  const hideTooltip = useEffectEvent(tooltip.hide);

  useEffect(() => {
    hideTooltip();
  }, [baselineData]);

  return (
    <g>
      <rect width={width} height={height} fill="#ffffff" pointerEvents="none" />
      {activeConnections.map((connection) => {
        const source = renderedById.get(connection.sourceId);
        const target = renderedById.get(connection.targetId);
        if (!source || !target) return null;

        return (
          <path
            key={`${connection.sourceId}-${connection.targetId}`}
            d={createLDArcPath(source, target, height)}
            fill="none"
            stroke={color}
            strokeWidth={2}
            opacity={0.55}
            pointerEvents="none"
          />
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
            fillOpacity={variant.isLead ? 1 : 0.65}
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
  );
}
