
import React, {
  RefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import { GenomicRange } from "../web/Portals/GenePortal/AssociatedxQTL";
import TitledImportanceTrack from "./TitledImportanceTrack";
import { BigBedData } from "bigwig-reader";


type PseudobulkAtacTrackProps = {
  trait?: string;
  domain: GenomicRange;
  onHeightChanged?: (i: number) => void;
  svgRef?: RefObject<SVGSVGElement>;
  onSettingsClicked?: () => void;
  onImportantRegionsLoaded?: (regions: BigBedData[]) => void;
  defaultTrackset?: string;
};

const TRACKSETS:[string, string][] = 
  [
    
    [
      "Microglia",
      "https://downloads.wenglab.org/pseudobulkatac/Microglia.bigWig",
    ],
    [
        "Astrocytes",
        "https://downloads.wenglab.org/pseudobulkatac/Astrocytes.bigWig",
      ],
      [
        "ExcitatoryNeurons",
        "https://downloads.wenglab.org/pseudobulkatac/ExcitatoryNeurons.bigWig",
      ],
      [
        "Oligodendrocytes",
        "https://downloads.wenglab.org/pseudobulkatac/Oligodendrocytes.bigWig",
      ],
      [
        "InhibitoryNeurons",
        "https://downloads.wenglab.org/pseudobulkatac/InhibitoryNeurons.bigWig",
      ],
      [
        "OPCs",
        "https://downloads.wenglab.org/pseudobulkatac/OPCs.bigWig",
      ],
      [
        "NigralNeurons",
        "https://downloads.wenglab.org/pseudobulkatac/NigralNeurons.bigWig",
      ]
  ];


export const PseudobulkAtacTracks: React.FC<PseudobulkAtacTrackProps> = ({
  domain,
  onHeightChanged,
  onSettingsClicked,
  onImportantRegionsLoaded,
  defaultTrackset,
}) => {
  // manage displayed tracks, compute height, and pass height back to parent
  const [displayedTracks, setDisplayedTracks] = useState<[string, string][]>(TRACKSETS);
  const height = useMemo(
    () =>
      130 +
      (displayedTracks.length * 130) - 130,
    [displayedTracks, domain]
  );
  useEffect(() => {
    onHeightChanged && onHeightChanged(height);
  }, [onHeightChanged, height]);

  // manage settings modal
  const [settingsMousedOver, setSettingsMousedOver] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);

  return (
    <>
      {displayedTracks
        .map((x, i) => (
            <TitledImportanceTrack            
            key={`${i}_${domain.start}`}
            transform={`translate(0,${130 * i})`}
            title={x[0]}
            height={130}
            width={1400}
            signalURL={`https://downloads.wenglab.org/pseudobulkatac/${x[0]}.profile_scores.bw`}
            imputedSignalURL={x[1]}
            domain={domain}            
            neutralRegions={[]}
          />
        ))}
      {settingsMousedOver && (
        <rect
          width={1400}
          height={height}
          transform="translate(0,-0)"
          fill="#ab3f00"
          fillOpacity={0.1}
        />
      )}
      <rect
        transform="translate(0,0)"
        height={height}
        width={40}
        fill="#ffffff"
      />
      <rect
        height={height}
        width={15}
        fill="#ab3f00"
        stroke="#000000"
        fillOpacity={settingsMousedOver ? 1 : 0.6}
        onMouseOver={() => setSettingsMousedOver(true)}
        onMouseOut={() => setSettingsMousedOver(false)}
        strokeWidth={1}
        transform="translate(20,0)"
        onClick={() => {
          onSettingsClicked && onSettingsClicked();
          setSettingsModalShown(true);
        }}
      />
      <text
        transform={`rotate(270) translate(-${height / 2},12)`}
        textAnchor="middle"
        fill="#ab3f00"
      >
        Pseudo Bulk ATAC Tracks
      </text>
    </>
  );
};
