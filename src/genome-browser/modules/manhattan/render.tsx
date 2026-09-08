import { useOptionalLDSelection } from "../ld/selection";
import {
  useInteraction,
  useTooltip,
  type TrackRendererProps,
} from "@weng-lab/genomebrowser";
import { useEffect, useEffectEvent } from "react";
import { createXScale } from "../shared/scale";
import {
  createManhattanYScale,
  resolveManhattanYDomain,
  DEFAULT_P_VALUE_THRESHOLD,
  pValueToScore,
} from "./helpers";
import type { ManhattanConfig, ManhattanData, ManhattanPoint } from "./types";

const POINT_RADIUS = 3.25;
const HOVER_STYLE = `
  .gb-manhattan-points:has(.gb-manhattan-point:hover) .gb-manhattan-point:not(:hover) {
    opacity: 0.15;
  }
`;

export function FullManhattan({
  config,
  color = "#c43d3d",
  data,
  region,
  visibleRegion,
  width,
  height,
}: TrackRendererProps<ManhattanConfig, ManhattanData>) {
  const x = createXScale(region, width);
  const selection = useOptionalLDSelection();
  const activeId = selection.anchor?.id ?? selection.pinnedVariantId;
  const activePoint = data.find((point) => point.id === activeId);
  const pValueThreshold = config.pValueThreshold ?? DEFAULT_P_VALUE_THRESHOLD;
  const thresholdScore = pValueToScore(pValueThreshold);
  const domain = resolveManhattanYDomain(data, config.yDomain, thresholdScore);
  const y = createManhattanYScale(domain, height);
  const showThreshold =
    thresholdScore >= domain.min && thresholdScore <= domain.max;
  const interaction = useInteraction<ManhattanPoint>();
  const tooltip = useTooltip<ManhattanPoint, ManhattanConfig>();
  const hideTooltip = useEffectEvent(tooltip.hide);

  useEffect(() => {
    hideTooltip();
  }, [data]);

  return (
    <g>
      <rect width={width} height={height} fill="#ffffff" pointerEvents="none" />
      <style>{HOVER_STYLE}</style>
      {showThreshold && (
        <g pointerEvents="none">
          <line
            className="gb-manhattan-threshold"
            x1={0}
            x2={width}
            y1={y(thresholdScore)}
            y2={y(thresholdScore)}
            stroke="#666666"
            strokeDasharray="2 4"
          />
          <text
            x={x(visibleRegion.start) + 5}
            y={Math.max(11, y(thresholdScore) - 4)}
            fontSize={10}
            fill="#555555"
          >
            P ≤ {pValueThreshold.toExponential()} (−log10 P ={" "}
            {thresholdScore.toFixed(2)})
          </text>
        </g>
      )}
      <g className="gb-manhattan-points">
        {data.map((point, index) => (
          <circle
            className="gb-manhattan-point"
            key={`${point.id}-${point.start}-${point.end}-${index}`}
            cx={x((point.start + point.end) / 2)}
            cy={y(point.value)}
            data-variant-id={point.id}
            data-active={point.id === activePoint?.id ? "true" : undefined}
            r={point.id === activePoint?.id ? 5 : POINT_RADIUS}
            stroke={point.id === activePoint?.id ? "#111111" : "none"}
            strokeWidth={2}
            opacity={activePoint && point.id !== activePoint.id ? 0.15 : 1}
            fill={color}
            style={{ cursor: interaction?.onClick ? "pointer" : "default" }}
            onClick={() => interaction?.onClick?.(point)}
            onMouseEnter={(event) => {
              interaction?.onHover?.(point);
              tooltip.show(point, event);
            }}
            onMouseLeave={() => {
              interaction?.onLeave?.(point);
              tooltip.hide();
            }}
          />
        ))}
      </g>
      {activePoint && (
        <text
          className="gb-manhattan-active-label"
          x={x((activePoint.start + activePoint.end) / 2) + 7}
          y={Math.max(12, y(activePoint.value) - 7)}
          fontSize={12}
          fill="#111111"
          stroke="#ffffff"
          strokeWidth={3}
          paintOrder="stroke"
          pointerEvents="none"
        >
          {activePoint.id}
        </text>
      )}
    </g>
  );
}
