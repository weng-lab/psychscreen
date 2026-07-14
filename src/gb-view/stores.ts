import {
  bigBedModule,
  bigWigModule,
  createBrowserStore,
  createTrackStore,
  manhattanModule,
  transcriptModule,
  type BrowserRegion,
  type BrowserStoreInstance,
  type TrackStoreInstance,
} from "@weng-lab/genomebrowser-v2";
import { attachPsychscreenLDInteractions } from "./modules/psychscreenLD/interactions";
import { psychscreenLDModule } from "./modules/psychscreenLD/module";

const GWAS_SUMMARY_STATISTICS_URL =
  "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Alzheimers_Bellenguez_meta.formatted.bigBed";

export const useBrowserStore = createBrowserStore({
  region: "chr11:6,192,271-6,680,547",
  marginWidth: 55,
  trackWidth: 1445,
});

export const modules = [bigWigModule, bigBedModule, transcriptModule];
export const useTrackStore = createTrackStore({
  modules,
  tracks: [
    transcriptModule.create({
      id: "genes",
      title: "GENCODE Genes",
      display: "squish",
      color: "#444444",
      config: {
        assembly: "GRCh38",
        version: 40,
      },
    }),
  ],
});

export type GenomeBrowserSession = {
  useBrowserStore: BrowserStoreInstance;
  useTrackStore: TrackStoreInstance;
  setRegion: (region: BrowserRegion) => void;
  dispose: () => void;
};

export function createGeneBrowserSession(
  region: BrowserRegion,
): GenomeBrowserSession {
  const useBrowserStore = createBrowserStore({
    region,
    marginWidth: 55,
    trackWidth: 1445,
  });

  const manhattanTrack = manhattanModule.create({
    id: "gene-gwas-associations",
    title: "Alzheimer's GWAS associations",
    color: "#7c97c4",
    height: 75,
    config: {
      url: GWAS_SUMMARY_STATISTICS_URL,
      yDomain: { min: 0 },
    },
  });
  const ldTrack = psychscreenLDModule.create({
    id: "gene-gwas-ld",
    title: "European LD (r² ≥ 0.7)",
    color: "#7c97c4",
    height: 60,
    config: { url: GWAS_SUMMARY_STATISTICS_URL },
  });

  const useTrackStore = createTrackStore({
    modules: [
      bigWigModule,
      bigBedModule,
      transcriptModule,
      manhattanModule,
      psychscreenLDModule,
    ],
    tracks: [
      transcriptModule.create({
        id: "gene-transcripts",
        title: "GENCODE Genes",
        display: "squish",
        color: "#444444",
        config: {
          assembly: "GRCh38",
          version: 40,
        },
      }),
      manhattanTrack,
      ldTrack,
    ],
  });
  // LD interactions keep hover/pin/cache state, so attach them per browser session.
  const interactions = attachPsychscreenLDInteractions({
    useTrackStore,
    manhattanTrackId: manhattanTrack.base.id,
    ldTrackId: ldTrack.base.id,
  });

  return {
    useBrowserStore,
    useTrackStore,
    setRegion(nextRegion) {
      interactions.reset();
      useBrowserStore.getState().setRegion(nextRegion);
    },
    dispose: interactions.dispose,
  };
}
