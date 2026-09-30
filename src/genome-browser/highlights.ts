import type { GenomicRegion, Highlight } from "@weng-lab/genomebrowser";

export function combineCytobandHighlights(
  cytobandMarkers: readonly Highlight[] | undefined,
  userHighlights: readonly Highlight[],
): Highlight[] {
  return [...(cytobandMarkers ?? []), ...userHighlights];
}

export function cytobandHighlightRegion(
  highlight: Highlight,
  activeChromosome: string,
): GenomicRegion {
  return {
    chromosome: highlight.region.chromosome ?? activeChromosome,
    start: highlight.region.start,
    end: highlight.region.end,
  };
}
