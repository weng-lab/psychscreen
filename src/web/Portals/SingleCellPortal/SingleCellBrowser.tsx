import {
  createDataStore,
  createBrowserStore,
  createTrackStore,
  Chromosome,
  TrackType,
  DisplayMode,
  BigBedConfig,
  BigWigConfig,
} from "genomebrowser-test";
import { SingleCellBrowserLegacy } from "./SingleCellBrowserLegacy";
import { useMemo } from "react";
import BrowserView from "../../../genome-browser/browserView";
import { color } from "html2canvas/dist/types/css/types/color";
import { geneTrack } from "../../../genome-browser/tracks/tracks";
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

  const tracks = useMemo(() => {
    if (props.atactracks) {
      return ATAC_TRACKS;
    }
    if (props.grntracks) {
      return GRN_TRACKS;
    }
    if (props.qtltracks) {
      return QTL_TRACKS;
    }
    return [];
  }, [props.atactracks, props.grntracks, props.qtltracks]);

  const trackStore = useMemo(
    () => createTrackStore([geneTrack(undefined), ...tracks]),
    [tracks]
  );
  const dataStore = useMemo(() => createDataStore(), []);
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
    title: "Vip  Enhancer and Promoter",
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
