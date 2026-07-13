import {
  bigBedModule,
  bigWigModule,
  createBrowserStore,
  createTrackStore,
  transcriptModule,
} from "@weng-lab/genomebrowser-v2";

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
