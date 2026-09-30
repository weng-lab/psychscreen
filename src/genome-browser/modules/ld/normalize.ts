import type { GenomicRegion } from "@weng-lab/genomebrowser";
import type { GwasPoint } from "../shared/gwasBigBed";
import type { LDSelection, LDConnection, LDData, LDVariant } from "./types";

export function createLDBaseline(
  points: GwasPoint[],
  region: GenomicRegion,
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

export function applyLDSelection(data: LDData, selection: LDSelection): LDData {
  const anchorId = selection.anchor?.id;
  if (!anchorId) return data;

  const visibleIds = new Set(data.variants.map((variant) => variant.id));
  if (!visibleIds.has(anchorId)) return data;

  const connectionsById = new Map<string, LDConnection>();
  for (const { id: targetId, rSquared } of selection.relationships) {
    if (targetId !== anchorId && visibleIds.has(targetId)) {
      const previous = connectionsById.get(targetId);
      if (!previous || rSquared > previous.rSquared) {
        connectionsById.set(targetId, {
          sourceId: anchorId,
          targetId,
          rSquared,
        });
      }
    }
  }

  return {
    variants: data.variants.map((variant) =>
      variant.id === anchorId ? { ...variant, isSelected: true } : variant,
    ),
    connections: [...connectionsById.values()],
  };
}

function isVisible(
  interval: { chromosome: string; start: number; end: number },
  region: GenomicRegion,
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
