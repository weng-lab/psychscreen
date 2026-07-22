import type {
  BrowserRegion,
  Highlight,
} from "@weng-lab/genomebrowser";

export function combineCytobandHighlights(
  cytobandMarkers: readonly Highlight[] | undefined,
  userHighlights: readonly Highlight[],
): Highlight[] {
  return [...(cytobandMarkers ?? []), ...userHighlights];
}

export function cytobandHighlightRegion(
  highlight: Highlight,
  activeChromosome: string,
): BrowserRegion {
  return {
    chromosome: highlight.region.chromosome ?? activeChromosome,
    start: highlight.region.start,
    end: highlight.region.end,
  };
}
