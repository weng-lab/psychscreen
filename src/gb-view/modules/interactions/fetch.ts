import {
  fetchBigBedRows,
  type BrowserRegion,
} from "@weng-lab/genomebrowser-v2";
import {
  deduplicateInteractions,
  type InteractionRowParser,
} from "./normalize";

export async function fetchInteractions(
  url: string,
  region: BrowserRegion,
  parseRow: InteractionRowParser,
) {
  const rows = await fetchBigBedRows({ url, region });
  return deduplicateInteractions(rows.map(parseRow));
}
