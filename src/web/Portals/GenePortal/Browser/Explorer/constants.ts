export const DEFAULT_TRACKS_HG38: Map<string, { url: string }> = new Map([
  ["rDHSs", { url: "gs://gcp.wenglab.org/GRCh38-rDHSs.bigBed" }],
  ["cCREs", { url: "gs://gcp.wenglab.org/GRCh38-cCREs.bigBed" }],
  ["DNase", { url: "gs://gcp.wenglab.org/dnase.GRCh38.sum.bigWig" }],
]);

export const DEFAULT_TRACKS_MM10: Map<string, { url: string }> = new Map([
  ["rDHSs", { url: "gs://gcp.wenglab.org/mm10-rDHSs.bigBed" }],
  ["cCREs", { url: "gs://gcp.wenglab.org/mm10-ccREs.bigBed" }],
  ["DNase", { url: "gs://data.genomealmanac.org/dnase.mm10.sum.bigWig" }],
]);

export const DEFAULT_TRACKS = new Map([
  ["mm10", DEFAULT_TRACKS_MM10],
  ["grch38", DEFAULT_TRACKS_HG38],
]);

export const TRACK_ORDER = new Map([
  ["GRCh38", ["DNase"]],
  ["mm10", ["DNase"]],
]);

export const COLOR_MAP: Map<string, string> = new Map([
  ["DNase", "#06DA93"],
  ["H3K4me3", "#ff0000"],
  ["H3K27ac", "#ffcd00"],
  ["CTCF", "#00b0f0"],
]);
