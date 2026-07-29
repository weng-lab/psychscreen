import type { BrowserRegion } from "@weng-lab/genomebrowser";

export function createXScale(region: BrowserRegion, width: number) {
  const span = region.end - region.start;
  return (value: number) => ((value - region.start) * width) / span;
}
