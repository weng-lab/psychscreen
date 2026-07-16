import type { BrowserRegion } from "@weng-lab/genomebrowser-v2";
import type { GwasPoint } from "../shared/gwasBigBed";
import type { LDConfig, LDConnection, LDData, LDVariant } from "./types";

export function createLDBaseline(
  points: GwasPoint[],
  region: BrowserRegion,
): LDData {
  const variantsById = new Map<string, LDVariant>();

  for (const point of points) {
    if (!isVisible(point, region)) continue;
    variantsById.set(point.id, {
      id: point.id,
      chromosome: region.chromosome,
      start: point.start,
      end: point.end,
    });
  }

  return { variants: [...variantsById.values()], connections: [] };
}

export function applyLDConfig(data: LDData, config: LDConfig): LDData {
  const anchorId = config.anchor?.id;
  if (!anchorId) return data;

  const visibleIds = new Set(data.variants.map((variant) => variant.id));
  if (!visibleIds.has(anchorId)) return data;

  const connections: LDConnection[] = [];
  for (const targetId of config.associatedVariantIds) {
    if (targetId !== anchorId && visibleIds.has(targetId)) {
      connections.push({ sourceId: anchorId, targetId });
    }
  }

  return {
    variants: data.variants.map((variant) =>
      variant.id === anchorId ? { ...variant, isLead: true } : variant,
    ),
    connections,
  };
}

function isVisible(
  interval: { chromosome: string; start: number; end: number },
  region: BrowserRegion,
) {
  return (
    chromosomeKey(interval.chromosome) === chromosomeKey(region.chromosome) &&
    interval.end >= region.start &&
    interval.start <= region.end
  );
}

function chromosomeKey(chromosome: string) {
  return chromosome.toLowerCase().replace(/^chr/, "");
}
