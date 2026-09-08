import {
  createBrowserStore,
  createTrackStore,
  hg38,
  type GenomicRegion,
  type BrowserStoreInstance,
  type TrackStoreInstance,
} from "@weng-lab/genomebrowser";
import { geneModule } from "@weng-lab/genomebrowser-tracks/gene";
import { TRACK_MODULES } from "./registry";

export type GenomeBrowserSession = {
  browserStore: BrowserStoreInstance;
  trackStore: TrackStoreInstance;
  setRegion: ReturnType<BrowserStoreInstance["getState"]>["setRegion"];
};

function createPortalBrowserSession(
  initialRegion: GenomicRegion,
  trackIdPrefix: string,
): GenomeBrowserSession {
  const useBrowserStore = createBrowserStore({
    assembly: hg38,
    region: initialRegion,
    marginWidth: 50,
    trackWidth: 1250,
  });
  const useTrackStore = createTrackStore({
    modules: TRACK_MODULES,
    tracks: [
      geneModule.create({
        id: `${trackIdPrefix}-genes`,
        title: "GENCODE Genes",
        source: "host",
        display: "merged",
        color: "#444444",
        config: {
          url: "https://users.wenglab.org/niship/gencodefiles/human.gencode.v40.comprehensive.annotation.bb",
        },
      }),
    ],
  });
  return {
    browserStore: useBrowserStore,
    trackStore: useTrackStore,
    setRegion: (region) => useBrowserStore.getState().setRegion(region),
  };
}

export function createGenePortalBrowserSession(region: GenomicRegion) {
  return createPortalBrowserSession(region, "gene-portal");
}

export function createDiseaseTraitBrowserSession(region: GenomicRegion) {
  return createPortalBrowserSession(region, "disease-trait");
}

export function createSingleCellGeneBrowserSession(region: GenomicRegion) {
  return createPortalBrowserSession(region, "single-cell-gene");
}

export function createSingleCellBrowserSession(region: GenomicRegion) {
  return createPortalBrowserSession(region, "single-cell");
}
