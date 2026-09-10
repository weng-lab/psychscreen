import { manhattanModule } from "./modules/manhattan/module";
import { ldModule } from "./modules/ld/module";

export const DISEASE_MANHATTAN_TRACK_ID = "disease-trait-manhattan";
export const DISEASE_LD_TRACK_ID = "disease-trait-ld";

import {
  createBrowserStore,
  createTrackStore,
  hg38,
  type GenomicRegion,
  type BrowserStoreInstance,
  type TrackStoreInstance,
} from "@weng-lab/genomebrowser";
import { geneModule } from "@weng-lab/genomebrowser-tracks/gene";
import { rulerModule } from "@weng-lab/genomebrowser-tracks/ruler";
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
    pinnedTrackIds: [`${trackIdPrefix}-ruler`, `${trackIdPrefix}-genes`],
    tracks: [
      rulerModule.create({
        id: `${trackIdPrefix}-ruler`,
        title: "Genomic ruler",
        source: "host",
        config: {},
      }),
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

export function createDiseaseTraitBrowserSession(
  region: GenomicRegion,
  gwas?: { url: string; title: string },
) {
  const session = createPortalBrowserSession(region, "disease-trait");
  if (gwas) {
    const result = session.trackStore
      .getState()
      .applyTrackChanges({
        add: [
          manhattanModule.create({
            id: DISEASE_MANHATTAN_TRACK_ID,
            title: `${gwas.title} GWAS`,
            source: "host",
            config: { url: gwas.url },
          }),
          ldModule.create({
            id: DISEASE_LD_TRACK_ID,
            title: "Linkage disequilibrium",
            source: "host",
            config: { url: gwas.url },
          }),
        ],
      });
    if (!result.ok) throw new Error(result.error);
  }
  return session;
}

export function createSingleCellGeneBrowserSession(region: GenomicRegion) {
  return createPortalBrowserSession(region, "single-cell-gene");
}

export function createSingleCellBrowserSession(region: GenomicRegion) {
  return createPortalBrowserSession(region, "single-cell");
}
