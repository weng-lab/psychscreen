import type { TrackFetchContext } from "@weng-lab/genomebrowser-v2";
import { fetchGwasPoints } from "../shared/gwasBigBed";
import type { ManhattanConfig, ManhattanData } from "./types";

export function fetchManhattan({
  config,
  region,
}: TrackFetchContext<ManhattanConfig>): Promise<ManhattanData> {
  return fetchGwasPoints(config.url, region);
}
