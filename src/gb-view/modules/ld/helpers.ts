import type { BrowserRegion } from "@weng-lab/genomebrowser-v2";
import { createXScale } from "../shared/scale";
import type { LDConnection, LDVariant } from "./types";

export type RenderedLDVariant = {
  variant: LDVariant;
  centerX: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

export function layoutLDVariants(
  variants: LDVariant[],
  region: BrowserRegion,
  width: number,
  height: number,
  prominentId?: string,
): RenderedLDVariant[] {
  const x = createXScale(region, width);

  return variants.map((variant) => {
    const start = x(variant.start);
    const end = x(variant.end);
    const centerX = (start + end) / 2;
    const rectWidth = Math.max(3.25, Math.abs(end - start));
    const isProminent = variant.isLead || variant.id === prominentId;
    const rectHeight = isProminent ? (height * 2) / 3 : height / 3;

    return {
      variant,
      centerX,
      x: centerX - rectWidth / 2,
      y: height - rectHeight,
      width: rectWidth,
      height: rectHeight,
    };
  });
}

export function getActiveLDConnections(
  connections: LDConnection[],
  activeId: string | null,
) {
  if (activeId === null) return [];
  return connections.filter(
    (connection) =>
      connection.sourceId === activeId || connection.targetId === activeId,
  );
}

export function createLDArcPath(
  source: RenderedLDVariant,
  target: RenderedLDVariant,
  trackHeight: number,
) {
  const controlX = (source.centerX + target.centerX) / 2;
  const controlY = Math.max(
    2,
    Math.min(source.y, target.y) - trackHeight * 0.6,
  );
  return `M ${source.centerX} ${source.y} Q ${controlX} ${controlY} ${target.centerX} ${target.y}`;
}
