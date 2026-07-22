import {
  useInteraction,
  useTooltip,
  type BrowserRegion,
  type TrackRendererProps,
} from "@weng-lab/genomebrowser";
import {
  createElement,
  useEffect,
  useEffectEvent,
  useMemo,
  useState,
} from "react";
import { createXScale } from "../shared/scale";
import { isEndpointInRegion, isSameChromosome } from "./normalize";
import type {
  GenomicInteraction,
  InteractionConfig,
  InteractionEndpoint,
  InteractionTooltipItem,
} from "./types";

type RenderedEndpoint = {
  endpoint: InteractionEndpoint;
  centerX: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

type InteractionRendererProps = TrackRendererProps<
  InteractionConfig,
  GenomicInteraction[]
>;

export function InteractionRenderer({
  color = "#000000",
  data,
  region,
  width,
  height,
}: InteractionRendererProps) {
  const [hoveredEndpointId, setHoveredEndpointId] = useState<string | null>(
    null,
  );
  const [pinnedEndpointId, setPinnedEndpointId] = useState<string | null>(null);
  const interaction = useInteraction<InteractionTooltipItem>();
  const tooltip = useTooltip<InteractionTooltipItem, InteractionConfig>();
  const hideTooltip = useEffectEvent(tooltip.hide);
  const { endpoints, relationships } = layoutInteractions(
    data,
    region,
    width,
    height,
  );
  const relationshipsByEndpoint = useMemo(
    () => indexRelationshipsByEndpoint(data),
    [data],
  );
  const visibleEndpointIds = new Set(endpoints.keys());
  const visiblePinnedEndpointId =
    pinnedEndpointId && visibleEndpointIds.has(pinnedEndpointId)
      ? pinnedEndpointId
      : null;
  const visibleHoveredEndpointId =
    hoveredEndpointId && visibleEndpointIds.has(hoveredEndpointId)
      ? hoveredEndpointId
      : null;
  const activeEndpointIds = new Set(
    [visiblePinnedEndpointId, visibleHoveredEndpointId].filter(
      (id): id is string => id !== null,
    ),
  );

  useEffect(() => {
    hideTooltip();
  }, [data]);

  return createElement(
    "g",
    null,
    createElement("rect", {
      width,
      height,
      fill: "#ffffff",
      pointerEvents: "none",
    }),
    ...relationships.map((relationship) => {
      const source = endpoints.get(relationship.source.id);
      const target = relationship.target
        ? endpoints.get(relationship.target.id)
        : undefined;
      if (!source || !target) return null;

      const isActive =
        activeEndpointIds.has(source.endpoint.id) ||
        activeEndpointIds.has(target.endpoint.id);
      const hasActiveEndpoint = activeEndpointIds.size > 0;

      return createElement("path", {
        key: relationship.id,
        d: createArcPath(source, target, height),
        fill: "none",
        stroke: color,
        strokeWidth: 2,
        opacity: isActive ? 0.9 : hasActiveEndpoint ? 0.1 : 0.24,
        pointerEvents: "none",
      });
    }),
    ...[...endpoints.values()].map((rendered) => {
      const { endpoint } = rendered;
      const item: InteractionTooltipItem = {
        endpoint,
        relationships: relationshipsByEndpoint.get(endpoint.id) ?? [],
      };
      const isPinned = visiblePinnedEndpointId === endpoint.id;
      const isActive = activeEndpointIds.has(endpoint.id);

      return createElement("rect", {
        key: endpoint.id,
        x: rendered.x,
        y: rendered.y,
        width: rendered.width,
        height: rendered.height,
        fill: color,
        fillOpacity: isActive ? 0.95 : 0.65,
        stroke: isPinned ? "#d32f2f" : "none",
        strokeWidth: isPinned ? 1.5 : 0,
        style: { cursor: "pointer" },
        onClick: () => {
          setPinnedEndpointId((current) =>
            current === endpoint.id ? null : endpoint.id,
          );
          interaction?.onClick?.(item);
        },
        onMouseEnter: (event) => {
          setHoveredEndpointId(endpoint.id);
          interaction?.onHover?.(item);
          tooltip.show(item, event);
        },
        onMouseLeave: () => {
          setHoveredEndpointId(null);
          interaction?.onLeave?.(item);
          tooltip.hide();
        },
      });
    }),
  );
}

function layoutInteractions(
  data: GenomicInteraction[],
  region: BrowserRegion,
  width: number,
  height: number,
) {
  const relationships = data.filter(
    (relationship) =>
      relationship.target &&
      isSameChromosome(relationship.source, relationship.target) &&
      isEndpointInRegion(relationship.source, region) &&
      isEndpointInRegion(relationship.target, region),
  );
  const visibleEndpoints = new Map<string, InteractionEndpoint>();

  for (const relationship of data) {
    if (isEndpointInRegion(relationship.source, region)) {
      visibleEndpoints.set(relationship.source.id, relationship.source);
    }
  }
  for (const relationship of relationships) {
    if (relationship.target) {
      visibleEndpoints.set(relationship.target.id, relationship.target);
    }
  }

  return {
    relationships,
    endpoints: new Map(
      [...visibleEndpoints.values()].map((endpoint) => [
        endpoint.id,
        layoutEndpoint(endpoint, region, width, height),
      ]),
    ),
  };
}

function layoutEndpoint(
  endpoint: InteractionEndpoint,
  region: BrowserRegion,
  width: number,
  trackHeight: number,
): RenderedEndpoint {
  const xScale = createXScale(region, width);
  const startX = xScale(endpoint.start);
  const endX = xScale(endpoint.end);
  const centerX = (startX + endX) / 2;
  const blockWidth = Math.max(3.25, Math.abs(endX - startX));
  const isSource = endpoint.role === "enhancer" || endpoint.role === "variant";
  const blockHeight = isSource ? 10 : 7;

  return {
    endpoint,
    centerX,
    x: centerX - blockWidth / 2,
    y: trackHeight - blockHeight - 1,
    width: blockWidth,
    height: blockHeight,
  };
}

function createArcPath(
  source: RenderedEndpoint,
  target: RenderedEndpoint,
  trackHeight: number,
) {
  const controlX = (source.centerX + target.centerX) / 2;
  const controlY = Math.max(
    2,
    Math.min(source.y, target.y) - trackHeight * 0.7,
  );
  return `M ${source.centerX} ${source.y} Q ${controlX} ${controlY} ${target.centerX} ${target.y}`;
}

function indexRelationshipsByEndpoint(data: GenomicInteraction[]) {
  const index = new Map<string, GenomicInteraction[]>();

  for (const relationship of data) {
    addToIndex(index, relationship.source.id, relationship);
    if (
      relationship.target &&
      relationship.target.id !== relationship.source.id
    ) {
      addToIndex(index, relationship.target.id, relationship);
    }
  }

  return index;
}

function addToIndex(
  index: Map<string, GenomicInteraction[]>,
  endpointId: string,
  relationship: GenomicInteraction,
) {
  const relationships = index.get(endpointId);
  if (relationships) {
    relationships.push(relationship);
  } else {
    index.set(endpointId, [relationship]);
  }
}
