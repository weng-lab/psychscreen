import { parseCoordinates, parseRows } from "./rows";
import type { GenomicRegion, TrackResources } from "@weng-lab/genomebrowser";
import { fetchBigBedRows, type NamedBigBedRow } from "./bigBed";

export type GwasPoint = {
  id: string;
  chromosome: string;
  start: number;
  end: number;
  value: number;
};

export async function fetchGwasPoints(
  url: string,
  region: GenomicRegion,
  resources: TrackResources,
) {
  const rows = await fetchBigBedRows(url, region, resources);
  return parseRows(rows, parseGwasBigBedRow, "GWAS BigBed");
}

export function parseGwasBigBedRow(row: NamedBigBedRow): GwasPoint | undefined {
  const coordinates = parseCoordinates(row.chromosome, row.start, row.end);
  const separator = row.name?.lastIndexOf("_") ?? -1;
  const id = separator > 0 ? row.name?.slice(0, separator).trim() : undefined;
  const valueToken =
    separator > 0 ? row.name?.slice(separator + 1).trim() : undefined;
  const value = valueToken ? Number(valueToken) : Number.NaN;

  if (!coordinates || !id || !Number.isFinite(value)) return undefined;

  return {
    id,
    ...coordinates,
    value,
  };
}
