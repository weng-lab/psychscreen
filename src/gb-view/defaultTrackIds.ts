const SHARED_EPIGENETIC_PREDICTION_TRACK_IDS = [
  "human-psychscreen::human-psychscreen/epigenetic/adult-bcres",
  "human-psychscreen::human-psychscreen/epigenetic/fans-all-neun-plus",
  "human-psychscreen::human-psychscreen/epigenetic/fans-all-neun-minus",
  "human-psychscreen::human-psychscreen/deep-learned/vlpfc-neurons-atac-signal",
  "human-psychscreen::human-psychscreen/deep-learned/vlpfc-glia-atac-signal",
] as const;

const GENE_PSEUDOBULK_TRACK_IDS = [
  "human-psychscreen::human-psychscreen/pseudobulk-atac/microglia",
  "human-psychscreen::human-psychscreen/pseudobulk-atac/astrocytes",
  "human-psychscreen::human-psychscreen/pseudobulk-atac/excitatory-neurons",
  "human-psychscreen::human-psychscreen/pseudobulk-atac/oligodendrocytes",
  "human-psychscreen::human-psychscreen/pseudobulk-atac/inhibitory-neurons",
  "human-psychscreen::human-psychscreen/pseudobulk-atac/opcs",
  "human-psychscreen::human-psychscreen/pseudobulk-atac/nigral-neurons",
] as const;

const CONSERVATION_TRACK_ID =
  "human-psychscreen::human-psychscreen/conservation/240-mammal-phylop-vertical-range";

export const GENE_PORTAL_DEFAULT_TRACK_IDS = [
  ...SHARED_EPIGENETIC_PREDICTION_TRACK_IDS,
  ...GENE_PSEUDOBULK_TRACK_IDS,
  CONSERVATION_TRACK_ID,
] as const;

export const DISEASE_TRAIT_DEFAULT_TRACK_IDS = [
  ...SHARED_EPIGENETIC_PREDICTION_TRACK_IDS,
  CONSERVATION_TRACK_ID,
] as const;

export const SINGLE_CELL_GENE_DEFAULT_TRACK_IDS =
  DISEASE_TRAIT_DEFAULT_TRACK_IDS;

export const SINGLE_CELL_ATAC_DEFAULT_TRACK_IDS = [
  "human-psychscreen::human-psychscreen/atac-seq-peaks/astrocytes",
  "human-psychscreen::human-psychscreen/atac-seq-peaks/endothelial-cells",
  "human-psychscreen::human-psychscreen/atac-seq-peaks/opcs",
] as const;

export const SINGLE_CELL_GRN_DEFAULT_TRACK_IDS = [
  "single-cell-interactions::grn-astrocytes",
  "single-cell-interactions::grn-endothelial",
  "single-cell-interactions::grn-vip",
] as const;

export const SINGLE_CELL_QTL_DEFAULT_TRACK_IDS = [
  "single-cell-interactions::qtl-l2-3-it",
  "single-cell-interactions::qtl-l4-it",
  "single-cell-interactions::qtl-chandelier",
] as const;
