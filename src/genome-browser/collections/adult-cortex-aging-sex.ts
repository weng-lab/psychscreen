import type { TrackCollection } from "@weng-lab/genomebrowser";

const BASE_URL =
  "https://users.wenglab.org/phanh/PsychENCODE/hg38/data/Mukamel_2024/binsize1/level3/";

// Source codes are kept as track IDs and file names; labels are display-only.
export const ADULT_CORTEX_CELL_TYPES = [
  {
    code: "L2-4IT_CUX2_LINC01331",
    label: "L2–4 IT CUX2 LINC01331 neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L3-5IT_RORB_PLCH1",
    label: "L3–5 IT RORB PLCH1 neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L4-5IT_RORB_ARHGAP15",
    label: "L4–5 IT RORB ARHGAP15 neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L4-5IT_RORB_GSN",
    label: "L4–5 IT RORB GSN neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L4-5IT_RORB_TSHZ2",
    label: "L4–5 IT RORB TSHZ2 neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L4-5IT_RORB_WHRN",
    label: "L4–5 IT RORB WHRN neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L5ET_FEZF2_ADRA1A",
    label: "L5 ET FEZF2 ADRA1A neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L56NP_TLE4_TSHZ2",
    label: "L5–6 NP TLE4 TSHZ2 neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L6CT_TLE4_FAM95C",
    label: "L6 CT TLE4 FAM95C neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L6IT_THEMIS_CUX1",
    label: "L6 IT THEMIS CUX1 neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L6IT_THEMIS_LINC00343",
    label: "L6 IT THEMIS LINC00343 neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "L6b_TLE4_NXPH4",
    label: "L6b TLE4 NXPH4 neurons",
    cellClass: "Excitatory neurons",
  },
  {
    code: "CGE_ADARB2_ADAM33",
    label: "CGE ADARB2 ADAM33 interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "CGE_LAMP5_FREM1",
    label: "CGE LAMP5 FREM1 interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "CGE_LAMP5_LHX6",
    label: "CGE LAMP5 LHX6 interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "CGE_LAMP5_NDNF",
    label: "CGE LAMP5 NDNF interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "CGE_PAX6",
    label: "CGE PAX6 interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "CGE_VIP_DPF3",
    label: "CGE VIP DPF3 interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "CGE_VIP_FGD5",
    label: "CGE VIP FGD5 interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "CGE_VIP_ZBTB20",
    label: "CGE VIP ZBTB20 interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "MGE_PVALB_COL15A1",
    label: "MGE PVALB COL15A1 interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "MGE_PVALB_MYO5B",
    label: "MGE PVALB MYO5B interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "MGE_SST_CDH12",
    label: "MGE SST CDH12 interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "MGE_SST_CLMP",
    label: "MGE SST CLMP interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "MGE_SST_NPY",
    label: "MGE SST NPY interneurons",
    cellClass: "Inhibitory neurons",
  },
  {
    code: "MGE_SST_RAB31",
    label: "MGE SST RAB31 interneurons",
    cellClass: "Inhibitory neurons",
  },
  { code: "Glia_Astro", label: "Astrocytes", cellClass: "Glia" },
  { code: "Glia_Micro", label: "Microglia", cellClass: "Glia" },
  { code: "Glia_Oligo", label: "Oligodendrocytes", cellClass: "Glia" },
] as const;

const SEXES = [
  { suffix: "", label: "all sexes" },
  { suffix: ".female", label: "female" },
  { suffix: ".male", label: "male" },
] as const;

const AGES = [
  { suffix: "", label: "all ages" },
  { suffix: ".young", label: "young" },
  { suffix: ".old", label: "aged" },
] as const;

function createTrack(
  cellType: (typeof ADULT_CORTEX_CELL_TYPES)[number],
  sex: (typeof SEXES)[number],
  age: (typeof AGES)[number],
) {
  const name = `${cellType.code}${sex.suffix}${age.suffix}`;
  const channelUrl = (channel: string) => `${BASE_URL}${name}.${channel}.bw`;

  return {
    type: "methylc",
    base: {
      id: name,
      title: `${cellType.label} · ${sex.label} · ${age.label} · DNA methylation`,
      height: 50,
      color: "#000000",
    },
    config: {
      colors: {
        cpg: "#648bd8",
        chg: "#ff944d",
        chh: "#ff00ff",
        depth: "#525252",
      },
      urls: {
        plusStrand: {
          cpg: { url: channelUrl("CGN-Watson.frac") },
          chg: { url: channelUrl("CHN-Watson.frac") },
          chh: { url: "" },
          depth: { url: channelUrl("CGN-Watson.cov") },
        },
        minusStrand: {
          cpg: { url: channelUrl("CGN-Crick.frac") },
          chg: { url: channelUrl("CHN-Crick.frac") },
          chh: { url: "" },
          depth: { url: channelUrl("CGN-Crick.cov") },
        },
      },
    },
    metadata: {
      cellClass: cellType.cellClass,
      cellType: cellType.label,
      sourceLabel: cellType.code,
      sex: sex.label,
      age: age.label,
    },
  };
}

export const ADULT_CORTEX_AGING_SEX_COLLECTION = {
  assembly: "hg38",
  id: "mukamel-2024",
  label: "Adult Cortex Aging & Sex",
  description:
    "DNA methylation by cell type, sex, and age in adult prefrontal cortex. Chien et al., Mukamel, *Neuron* (2024) · doi:10.1016/j.neuron.2024.05.013",
  views: [
    {
      id: "cell-type",
      label: "By cell type",
      columns: [
        { field: "cellClass", label: "Cell class" },
        { field: "cellType", label: "Cell type" },
        { field: "sex", label: "Sex" },
        { field: "age", label: "Age" },
        { field: "sourceLabel", label: "Source label" },
      ],
      grouping: ["cellClass", "cellType", "sex"],
      leaf: "age",
    },
    {
      id: "demographics",
      label: "By sex and age",
      columns: [
        { field: "sex", label: "Sex" },
        { field: "age", label: "Age" },
        { field: "cellClass", label: "Cell class" },
        { field: "cellType", label: "Cell type" },
        { field: "sourceLabel", label: "Source label" },
      ],
      grouping: ["sex", "age", "cellClass"],
      leaf: "cellType",
    },
  ],
  tracks: ADULT_CORTEX_CELL_TYPES.flatMap((cellType) =>
    SEXES.flatMap((sex) => AGES.map((age) => createTrack(cellType, sex, age))),
  ),
} satisfies TrackCollection;
