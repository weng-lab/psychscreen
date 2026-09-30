import type { TrackFetchContext } from "@weng-lab/genomebrowser";
import { fetchGwasPoints } from "../shared/gwasBigBed";
import type { ManhattanConfig, ManhattanData } from "./types";

export function fetchManhattan({
  track,
  demand,
  resources,
}: TrackFetchContext<ManhattanConfig>): Promise<ManhattanData> {
  return fetchGwasPoints(track.config.url, demand.region, resources);
}
