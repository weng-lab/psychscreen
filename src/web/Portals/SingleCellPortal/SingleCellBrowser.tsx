import {
  createDataStore,
  createBrowserStore,
  createTrackStore,
  Chromosome,
  TrackType,
  DisplayMode,
  BigBedConfig,
  BigWigConfig,
  Track,
} from "genomebrowser-test";
import { useMemo } from "react";
import BrowserView from "../../../genome-browser/browserView";
import { geneTrack } from "../../../genome-browser/tracks/tracks";
import {
  useGRNLDData,
  createGrnLDTrack,
} from "../../../genome-browser/useGRNLDData";
import {
  useQTLLDData,
  createQtlLDTrack,
} from "../../../genome-browser/useQTLLDData";
type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};

type BrowserProps = {
  coordinates: GenomicRange;
  qtltracks?: boolean;
  grntracks?: boolean;
  atactracks?: boolean;
};

export default function SingleCellBrowser(props: BrowserProps) {
  const browserStore = useMemo(
    () =>
      createBrowserStore({
        domain: {
          chromosome: props.coordinates.chromosome as Chromosome,
          start: props.coordinates.start,
          end: props.coordinates.end,
        },
        marginWidth: 100,
        trackWidth: 1400,
        multiplier: 3,
      }),
    [props.coordinates]
  );

  const dataStore = useMemo(() => createDataStore(), []);

  const trackStore = useMemo(() => {
    let allTracks: Track[] = [geneTrack(undefined)];
    if (props.atactracks) {
      allTracks.push(...ATAC_TRACKS);
    }
    if (props.grntracks) {
      // Add stable LD tracks for each GRN track
      GRN_TRACKS.forEach((track) => {
        allTracks.push(
          createGrnLDTrack(`grn-ld-${track.id}`, `${track.title} LD`)
        );
      });
    }
    if (props.qtltracks) {
      // Add stable LD tracks for each eQTL track
      QTL_TRACKS.forEach((track) => {
        allTracks.push(
          createQtlLDTrack(`qtl-ld-${track.id}`, `${track.title} LD`)
        );
      });
    }
    return createTrackStore(allTracks);
  }, [props.atactracks, props.grntracks, props.qtltracks]);

  // Hooks will update track show arrays via editTrack - no state changes here
  useGRNLDData(
    props.grntracks ? GRN_TRACKS : [],
    browserStore,
    dataStore,
    trackStore
  );

  useQTLLDData(
    props.qtltracks ? QTL_TRACKS : [],
    browserStore,
    dataStore,
    trackStore
  );

  return (
    <div style={{ paddingTop: "1rem" }}>
      <BrowserView
        browserStore={browserStore}
        trackStore={trackStore}
        dataStore={dataStore}
      />
    </div>
  );
}

const ATAC_TRACKS: BigBedConfig[] = [
  {
    id: "Astrocytes",
    title: "Astrocytes",
    url: "https://downloads.wenglab.org/Astro.PeakCalls.bb",
    color: "#9479bc",
    height: 35,
    titleSize: 16,
    displayMode: DisplayMode.Dense,
    trackType: TrackType.BigBed,
  },
  {
    id: "Endothelial Cells",
    title: "Endothelial Cells",
    url: "https://downloads.wenglab.org/Endo.PeakCalls.bb",
    color: "#9479bc",
    height: 35,
    titleSize: 16,
    displayMode: DisplayMode.Dense,
    trackType: TrackType.BigBed,
  },
  {
    id: "Oligodendrocyte Precursor Cells",
    title: "Oligodendrocyte Precursor Cells",
    url: "https://downloads.wenglab.org/OPC.PeakCalls.bb",
    color: "#9479bc",
    height: 35,
    titleSize: 16,
    displayMode: DisplayMode.Dense,
    trackType: TrackType.BigBed,
  },
];

const GRN_TRACKS: BigBedConfig[] = [
  {
    id: "Astrocytes Enhancer and Promoter",
    title: "Astrocytes Enhancer and Promoter",
    url: "https://downloads.wenglab.org/Ast_GRN.bb",
    color: "#000000",
    height: 35,
    titleSize: 16,
    displayMode: DisplayMode.Dense,
    trackType: TrackType.BigBed,
  },
  {
    id: "Endothelial cells Enhancer and Promoter",
    title: "Endothelial cells Enhancer and Promoter",
    url: "https://downloads.wenglab.org/End_GRN.bb",
    color: "#000000",
    height: 35,
    titleSize: 16,
    displayMode: DisplayMode.Dense,
    trackType: TrackType.BigBed,
  },
  {
    id: "Vip Enhancer and Promoter",
    title: "Vip Enhancer and Promoter",
    url: "https://downloads.wenglab.org/Vip_GRN.bb",
    color: "#000000",
    height: 35,
    titleSize: 16,
    displayMode: DisplayMode.Dense,
    trackType: TrackType.BigBed,
  },
];

const QTL_TRACKS: BigBedConfig[] = [
  {
    id: "Layer 2/3 Intratelencephalic projecting",
    title: "Layer 2/3 Intratelencephalic projecting",
    url: "https://downloads.wenglab.org/L2.3.IT_sig_QTLs.dat.bb",
    color: "#000000",
    height: 35,
    titleSize: 16,
    displayMode: DisplayMode.Dense,
    trackType: TrackType.BigBed,
  },
  {
    id: "Layer 4 Intratelencephalic projecting",
    title: "Layer 4 Intratelencephalic projecting",
    url: "https://downloads.wenglab.org/L4.IT_sig_QTLs.dat.bb",
    color: "#000000",
    height: 35,
    titleSize: 16,
    displayMode: DisplayMode.Dense,
    trackType: TrackType.BigBed,
  },
  {
    id: "Chandelier",
    title: "Chandelier",
    url: "https://downloads.wenglab.org/Chandelier__Pvalb_sig_QTLs.dat.bb",
    color: "#000000",
    height: 35,
    titleSize: 16,
    displayMode: DisplayMode.Dense,
    trackType: TrackType.BigBed,
  },
];
