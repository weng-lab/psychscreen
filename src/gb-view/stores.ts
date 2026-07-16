import {
  bigBedModule,
  bigWigModule,
  createBrowserStore,
  createTrackStore,
  transcriptModule,
  type BrowserRegion,
  type BrowserStoreInstance,
  type TrackStoreInstance,
} from "@weng-lab/genomebrowser-v2";
import { attachLDInteractions } from "./modules/ld/interactions";
import { ldModule } from "./modules/ld/module";
import { manhattanModule } from "./modules/manhattan/module";

const BELLENGUEZ_SUMMARY_STATISTICS_URL =
  "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Alzheimers_Bellenguez_meta.formatted.bigBed";

const PORTAL_MODULES = [
  bigWigModule,
  bigBedModule,
  transcriptModule,
  manhattanModule,
  ldModule,
];

export type GenomeBrowserSession = {
  browserStore: BrowserStoreInstance;
  trackStore: TrackStoreInstance;
  setRegion: (region: BrowserRegion) => void;
  dispose: () => void;
};

type PortalBrowserSessionOptions = {
  initialRegion: BrowserRegion;
  trackIdPrefix: string;
  summaryStatisticsUrl?: string;
};

function createPortalBrowserSession({
  initialRegion,
  trackIdPrefix,
  summaryStatisticsUrl,
}: PortalBrowserSessionOptions): GenomeBrowserSession {
  const browserStore = createBrowserStore({
    region: initialRegion,
    marginWidth: 55,
    trackWidth: 1445,
  });
  const geneTrack = transcriptModule.create({
    id: `${trackIdPrefix}-transcripts`,
    title: "GENCODE Genes",
    display: "squish",
    height: 50,
    color: "#444444",
    config: {
      assembly: "GRCh38",
      version: 40,
    },
  });

  const manhattanTrack = summaryStatisticsUrl
    ? manhattanModule.create({
        id: `${trackIdPrefix}-gwas-associations`,
        title: "GWAS associations",
        color: "#7c97c4",
        height: 75,
        config: {
          url: summaryStatisticsUrl,
          yDomain: { min: 0 },
        },
      })
    : undefined;
  const ldTrack = summaryStatisticsUrl
    ? ldModule.create({
        id: `${trackIdPrefix}-gwas-ld`,
        title: "European LD (r² ≥ 0.7)",
        color: "#7c97c4",
        height: 50,
        config: { url: summaryStatisticsUrl },
      })
    : undefined;

  const trackStore = createTrackStore({
    modules: PORTAL_MODULES,
    tracks:
      manhattanTrack && ldTrack
        ? [geneTrack, manhattanTrack, ldTrack]
        : [geneTrack],
  });
  const interactions =
    manhattanTrack && ldTrack
      ? attachLDInteractions({
          useTrackStore: trackStore,
          manhattanTrackId: manhattanTrack.base.id,
          ldTrackId: ldTrack.base.id,
        })
      : undefined;

  return {
    browserStore,
    trackStore,
    setRegion(nextRegion) {
      interactions?.reset();
      browserStore.getState().setRegion(nextRegion);
    },
    dispose() {
      interactions?.dispose();
    },
  };
}

export function createGenePortalBrowserSession(
  initialRegion: BrowserRegion,
): GenomeBrowserSession {
  return createPortalBrowserSession({
    initialRegion,
    trackIdPrefix: "gene-portal",
    summaryStatisticsUrl: BELLENGUEZ_SUMMARY_STATISTICS_URL,
  });
}

export function createDiseaseTraitBrowserSession(
  initialRegion: BrowserRegion,
  summaryStatisticsUrl?: string,
): GenomeBrowserSession {
  return createPortalBrowserSession({
    initialRegion,
    trackIdPrefix: "disease-trait",
    summaryStatisticsUrl,
  });
}

export function createSingleCellGeneBrowserSession(
  initialRegion: BrowserRegion,
): GenomeBrowserSession {
  return createPortalBrowserSession({
    initialRegion,
    trackIdPrefix: "single-cell-gene",
    summaryStatisticsUrl: BELLENGUEZ_SUMMARY_STATISTICS_URL,
  });
}

export function createSingleCellBrowserSession(
  initialRegion: BrowserRegion,
): GenomeBrowserSession {
  return createPortalBrowserSession({
    initialRegion,
    trackIdPrefix: "single-cell",
  });
}
