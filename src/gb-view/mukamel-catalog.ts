import type { TrackSelectCatalog } from "@weng-lab/genomebrowser-ui-v2";

const MUKAMEL_BASE_URL =
  "https://users.wenglab.org/phanh/PsychENCODE/hg38/data/Mukamel_2024/binsize1/level3/";

export const MUKAMEL_CELL_TYPES = [
  "CGE_ADARB2_ADAM33",
  "CGE_LAMP5_FREM1",
  "CGE_LAMP5_LHX6",
  "CGE_LAMP5_NDNF",
  "CGE_PAX6",
  "CGE_VIP_DPF3",
  "CGE_VIP_FGD5",
  "CGE_VIP_ZBTB20",
  "Glia_Astro",
  "Glia_Micro",
  "Glia_Oligo",
  "L2-4IT_CUX2_LINC01331",
  "L3-5IT_RORB_PLCH1",
  "L4-5IT_RORB_ARHGAP15",
  "L4-5IT_RORB_GSN",
  "L4-5IT_RORB_TSHZ2",
  "L4-5IT_RORB_WHRN",
  "L56NP_TLE4_TSHZ2",
  "L5ET_FEZF2_ADRA1A",
  "L6CT_TLE4_FAM95C",
  "L6IT_THEMIS_CUX1",
  "L6IT_THEMIS_LINC00343",
  "L6b_TLE4_NXPH4",
  "MGE_PVALB_COL15A1",
  "MGE_PVALB_MYO5B",
  "MGE_SST_CDH12",
  "MGE_SST_CLMP",
  "MGE_SST_NPY",
  "MGE_SST_RAB31",
] as const;

const MUKAMEL_VARIANTS = [
  { suffix: "", sex: "All", age: "All" },
  { suffix: ".female", sex: "Female", age: "All" },
  { suffix: ".female.old", sex: "Female", age: "Old" },
  { suffix: ".female.young", sex: "Female", age: "Young" },
  { suffix: ".male", sex: "Male", age: "All" },
  { suffix: ".male.old", sex: "Male", age: "Old" },
  { suffix: ".male.young", sex: "Male", age: "Young" },
  { suffix: ".old", sex: "All", age: "Old" },
  { suffix: ".young", sex: "All", age: "Young" },
] as const;

function createMukamelTrack(
  cellType: (typeof MUKAMEL_CELL_TYPES)[number],
  variant: (typeof MUKAMEL_VARIANTS)[number],
) {
  const name = `${cellType}${variant.suffix}`;
  const channelUrl = (channel: string) =>
    `${MUKAMEL_BASE_URL}${name}.${channel}.bw`;

  return {
    type: "methylc",
    id: name,
    title: `Mukamel ${name}`,
    height: 50,
    color: "#000000",
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
      cellType,
      sex: variant.sex,
      age: variant.age,
    },
  };
}

export const MUKAMEL_TRACK_CATALOG = {
  id: "mukamel-2024",
  label: "Mukamel 2024 Methylation",
  description: "Mukamel 2024 DNA methylation tracks",
  views: [
    {
      id: "cell-type",
      label: "By Cell Type",
      columns: [
        { field: "cellType", label: "Cell Type" },
        { field: "sex", label: "Sex" },
        { field: "age", label: "Age" },
      ],
      grouping: ["cellType", "sex"],
      leaf: "age",
    },
    {
      id: "demographics",
      label: "By Demographics",
      columns: [
        { field: "sex", label: "Sex" },
        { field: "age", label: "Age" },
        { field: "cellType", label: "Cell Type" },
      ],
      grouping: ["sex", "age"],
      leaf: "cellType",
    },
  ],
  tracks: MUKAMEL_CELL_TYPES.flatMap((cellType) =>
    MUKAMEL_VARIANTS.map((variant) => createMukamelTrack(cellType, variant)),
  ),
} satisfies TrackSelectCatalog;
