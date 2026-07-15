import {
  fetchBigBedRows,
  type BigBedRow,
  type BrowserRegion,
} from "@weng-lab/genomebrowser-v2";

export type GwasPoint = {
  id: string;
  chromosome: string;
  start: number;
  end: number;
  value: number;
};

export async function fetchGwasPoints(url: string, region: BrowserRegion) {
  const rows = await fetchBigBedRows({ url, region });
  return rows.map(parseGwasBigBedRow);
}

function parseGwasBigBedRow(row: BigBedRow): GwasPoint {
  const chromosome = row.chr ?? row.chrom;
  const separator = row.name?.lastIndexOf("_") ?? -1;
  const id = separator > 0 ? row.name?.slice(0, separator).trim() : undefined;
  const valueToken =
    separator > 0 ? row.name?.slice(separator + 1).trim() : undefined;
  const value = valueToken ? Number(valueToken) : Number.NaN;

  if (!chromosome || !id || !Number.isFinite(value)) {
    throw new Error(
      `GWAS BigBed row at ${chromosome ?? "unknown"}:${row.start}-${row.end} must have a name formatted as <id>_<numeric value>`,
    );
  }

  return {
    id,
    chromosome,
    start: row.start,
    end: row.end,
    value,
  };
}
