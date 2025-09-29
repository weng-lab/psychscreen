import {
  BigBedConfig,
  BigWigConfig,
  DisplayMode,
  Track,
  TrackType,
  TranscriptConfig,
} from "genomebrowser-test";

const TITLE_SIZE = 12;
export const geneTrack = (gene: string | undefined) => {
  const geneTrack: TranscriptConfig = {
    id: "gene-track",
    trackType: TrackType.Transcript,
    assembly: "GRCh38",
    displayMode: DisplayMode.Squish,
    title: "Genes",
    titleSize: TITLE_SIZE,
    height: 50,
    version: 40,
    geneName: gene,
    color: "#aaaaaa",
  };
  return geneTrack;
};

export const regulatoryColor = "#9479bc";
export const regulatoryFeatures: Track[] = [
  {
    id: "Adult candidate brain cis-Regulatory Elements (b-cCREs)",
    title: "Adult candidate brain cis-Regulatory Elements (b-cCREs)",
    trackType: TrackType.BigBed,
    url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/adult_bCREs.bigBed",
    displayMode: DisplayMode.Dense,
    titleSize: TITLE_SIZE,
    height: 30,
    color: regulatoryColor,
  } as BigBedConfig,
  {
    id: "all brain regions, aggregated NeuN+",
    title: "all brain regions, aggregated NeuN+",
    trackType: TrackType.BigWig,
    url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/ACC-NeuN+-healthy-ATAC.bigWig",
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: regulatoryColor,
  } as BigWigConfig,
  {
    id: "all brain regions, aggregated NeuN-",
    title: "all brain regions, aggregated NeuN-",
    trackType: TrackType.BigWig,
    url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/ACC-NeuN--healthy-ATAC.bigWig",
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: regulatoryColor,
  } as BigWigConfig,
];

export const deepLearnedModels: Track[] = [
  {
    id: "VLPFC neurons ATAC signal",
    title: "VLPFC neurons ATAC signal",
    url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_neurons/predictions_VLPFC_neurons_chrombpnet_nobias.bw",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: "#758c7b",
  } as BigWigConfig,
  {
    id: "VLPFC glia ATAC signal",
    title: "VLPFC glia ATAC signal",
    url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_glia/predictions_VLPFC_glia_chrombpnet_nobias.bw",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: "#758c7b",
  } as BigWigConfig,
];
export const evoConservation: Track[] = [
  {
    id: "240-mammal phyloP conservation score (Vertical Viewing Range [-2 to 9])",
    title:
      "240-mammal phyloP conservation score (Vertical Viewing Range [-2 to 9])",
    url: "https://downloads.wenglab.org/241-mammalian-2020v2.bigWig",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: "#c0a9e2",
  } as BigWigConfig,
];

export const pseudobulkAtacColor = "#cd8c66";
export const pseudobulkAtac: Track[] = [
  {
    id: "Microglia",
    title: "Microglia",
    url: "https://downloads.wenglab.org/pseudobulkatac/Microglia.bigWig",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: pseudobulkAtacColor,
  } as BigWigConfig,
  {
    id: "Astrocytes",
    title: "Astrocytes",
    url: "https://downloads.wenglab.org/pseudobulkatac/Astrocytes.bigWig",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: pseudobulkAtacColor,
  } as BigWigConfig,
  {
    id: "ExcitatoryNeurons",
    title: "ExcitatoryNeurons",
    url: "https://downloads.wenglab.org/pseudobulkatac/ExcitatoryNeurons.bigWig",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: pseudobulkAtacColor,
  } as BigWigConfig,
  {
    id: "Oligodendrocytes",
    title: "Oligodendrocytes",
    url: "https://downloads.wenglab.org/pseudobulkatac/Oligodendrocytes.bigWig",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: pseudobulkAtacColor,
  } as BigWigConfig,
  {
    id: "InhibitoryNeurons",
    title: "InhibitoryNeurons",
    url: "https://downloads.wenglab.org/pseudobulkatac/InhibitoryNeurons.bigWig",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: pseudobulkAtacColor,
  } as BigWigConfig,
  {
    id: "OPCs",
    title: "OPCs",
    url: "https://downloads.wenglab.org/pseudobulkatac/OPCs.bigWig",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: pseudobulkAtacColor,
  } as BigWigConfig,
  {
    id: "NigralNeurons",
    title: "NigralNeurons",
    url: "https://downloads.wenglab.org/pseudobulkatac/NigralNeurons.bigWig",
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: TITLE_SIZE,
    height: 50,
    color: pseudobulkAtacColor,
  } as BigWigConfig,
];
