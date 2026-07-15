import {
  useInteraction,
  useTooltip,
  type TrackRendererProps,
} from "@weng-lab/genomebrowser-v2";
import { useEffect, useEffectEvent } from "react";
import { createXScale } from "../shared/scale";
import { createManhattanYScale, resolveManhattanYDomain } from "./helpers";
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
  width,
  height,
}: TrackRendererProps<ManhattanConfig, ManhattanData>) {
  const x = createXScale(region, width);
  const y = createManhattanYScale(
    resolveManhattanYDomain(data, config.yDomain),
    height,
  );
  const interaction = useInteraction<ManhattanPoint>();
  const tooltip = useTooltip<ManhattanPoint, ManhattanConfig>({
    type: "manhattan",
    config,
  });
  const hideTooltip = useEffectEvent(tooltip.hide);

  useEffect(() => {
    hideTooltip();
  }, [data]);

  return (
    <g>
      <rect width={width} height={height} fill="#ffffff" pointerEvents="none" />
      <style>{HOVER_STYLE}</style>
      <g className="gb-manhattan-points">
        {data.map((point, index) => (
          <circle
            className="gb-manhattan-point"
            key={`${point.id}-${point.start}-${point.end}-${index}`}
            cx={x((point.start + point.end) / 2)}
            cy={y(point.value)}
            r={POINT_RADIUS}
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
    </g>
  );
}
