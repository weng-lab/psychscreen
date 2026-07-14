import type {
  BrowserRegion,
  LDData,
  LDVariant,
  ManhattanPoint,
} from "@weng-lab/genomebrowser-v2";
import type { PsychscreenLDConfig } from "./types";

export function createPsychscreenLDBaseline(
  points: ManhattanPoint[],
  region: BrowserRegion,
): LDData {
  const variantsById = new Map<string, LDVariant>();

  // Start with the visible GWAS points; LD edges are added after an anchor is chosen.
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

export function applyPsychscreenLDConfig(
  data: LDData,
  config: PsychscreenLDConfig,
): LDData {
  const anchorId = config.anchor?.id;
  if (!anchorId) return data;

  const visibleIds = new Set(data.variants.map((variant) => variant.id));
  if (!visibleIds.has(anchorId)) return data;

  return {
    variants: data.variants.map((variant) =>
      variant.id === anchorId ? { ...variant, isLead: true } : variant,
    ),
    connections: config.associatedVariantIds
      .filter((targetId) => targetId !== anchorId && visibleIds.has(targetId))
      .map((targetId) => ({ sourceId: anchorId, targetId })),
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
