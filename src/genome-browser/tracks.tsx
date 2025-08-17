import {
  BigBedConfig,
  BigWigConfig,
  DisplayMode,
  Track,
  TrackType,
  TranscriptConfig,
} from "@weng-lab/genomebrowser";

const titleSize = 12;
export const geneTrack = (gene: string | undefined) => {
  const geneTrack: TranscriptConfig = {
    id: "gene-track",
    trackType: TrackType.Transcript,
    assembly: "GRCh38",
    displayMode: DisplayMode.Squish,
    title: "Genes",
    titleSize,
    height: 50,
    version: 40,
    geneName: gene,
    color: "#000000",
  };
  return geneTrack;
};

const regulatoryColor = "#9479bc";
const regulatoryFeatures: Track[] = [
  {
    id: "c-ccre-track",
    title: "Adult candidate brain cis-Regulatory Elements (b-cCREs)",
    trackType: TrackType.BigBed,
    url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/adult_bCREs.bigBed",
    displayMode: DisplayMode.Dense,
    titleSize,
    height: 30,
    color: regulatoryColor,
  } as BigBedConfig,
  {
    id: "neun-plus-track",
    title: "all brain regions, aggregated NeuN+ ATAC signal",
    trackType: TrackType.BigWig,
    url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/ACC-NeuN+-healthy-ATAC.bigWig",
    displayMode: DisplayMode.Full,
    titleSize,
    height: 50,
    color: regulatoryColor,
  } as BigWigConfig,
  {
    id: "neun-minus-track",
    title: "all brain regions, aggregated NeuN- ATAC signal",
    trackType: TrackType.BigWig,
    url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/ACC-NeuN--healthy-ATAC.bigWig",
    displayMode: DisplayMode.Full,
    titleSize,
    height: 50,
    color: regulatoryColor,
  } as BigWigConfig,
];

const deepLearnedModels: Track[] = [
  {
    id: "vlpfc-neurons-atac",
    title: "VLPFC neurons ATAC signal",
    url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_neurons/predictions_VLPFC_neurons_chrombpnet_nobias.bw",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize,
    height: 50,
    color: "#758c7b",
  } as BigWigConfig,
  {
    id: "vlpfc-glia-atac",
    title: "VLPFC glia ATAC signal",
    url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_glia/predictions_VLPFC_glia_chrombpnet_nobias.bw",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize,
    height: 50,
    color: "#758c7b",
  } as BigWigConfig,
];
const evoConservation: Track[] = [
  {
    id: "240-mammalian-phylo-p",
    title:
      "240-mammal phyloP conservation score (Vertical Viewing Range [-2 to 9])",
    url: "https://downloads.wenglab.org/241-mammalian-2020v2.bigWig",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize,
    height: 50,
    color: "#c0a9e2",
  } as BigWigConfig,
];

export const diseaseTracks = [
  ...regulatoryFeatures,
  ...deepLearnedModels,
  ...evoConservation,
];
