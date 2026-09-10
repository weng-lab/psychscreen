import { parseRows } from "../shared/rows";
import { fetchBigBedRows } from "../shared/bigBed";
import type { GenomicRegion, TrackResources } from "@weng-lab/genomebrowser";
import {
  deduplicateInteractions,
  type InteractionRowParser,
} from "./normalize";

export async function fetchInteractions(
  url: string,
  region: GenomicRegion,
  parseRow: InteractionRowParser,
  resources: TrackResources,
) {
  const rows = await fetchBigBedRows(url, region, resources);
  return deduplicateInteractions(
    parseRows(rows, parseRow, "Interaction BigBed"),
  );
}
