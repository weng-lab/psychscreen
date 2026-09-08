import { bed3Schema, createBigBedFile } from "@weng-lab/genomic-reader";
import type { GenomicRegion, TrackResources } from "@weng-lab/genomebrowser";

export type NamedBigBedRow = {
  chromosome: string;
  start: number;
  end: number;
  name?: string;
};

export async function fetchBigBedRows(
  url: string,
  region: GenomicRegion,
  resources: TrackResources,
): Promise<NamedBigBedRow[]> {
  let cached = resources.get<{
    url: string;
    file: ReturnType<typeof createBigBedFile<typeof bed3Schema>>;
  }>("bigbed");
  if (!cached || cached.url !== url) {
    cached = { url, file: createBigBedFile({ url, schema: bed3Schema }) };
    resources.set("bigbed", cached);
  }
  const rows = await cached.file.read(region);
  return rows.map(({ chromosome, start, end, fields }) => ({
    chromosome,
    start,
    end,
    name: fields[0],
  }));
}
