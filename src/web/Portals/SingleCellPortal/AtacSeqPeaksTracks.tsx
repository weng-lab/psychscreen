import { gql, useQuery } from "@apollo/client";
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import React, { RefObject, useEffect, useMemo, useState } from "react";
import { DenseBigBed, EmptyTrack, FullBigWig } from "umms-gb";
import {
  BigRequest,
  RequestError,
} from "umms-gb/dist/components/tracks/trackset/types";
import { ValuedPoint } from "umms-gb/dist/utils/types";
import CCRETooltip from "../../../web/cCREDetails/CCRETooltip";
import AtacSeaPeaksTrackModal from "./AtacSeaPeaksTrackModal";

export const DEFAULT_TRACKS = (
  
): Map<string, { url: string }> =>
  new Map([
    [
      "Astrocytes",
      {
        url: "https://downloads.wenglab.org/Astro.PeakCalls.bb",
      }
    ],
    [
      "Endothelial Cells",
      {
        url: "https://downloads.wenglab.org/Endo.PeakCalls.bb",
      },
    ],
    [
      "Oligodendrocyte Precursor Cells",
      {
        url: "https://downloads.wenglab.org/OPC.PeakCalls.bb",
      },
    ]
  ]);

export const TRACK_ORDER = [
    "Astrocytes",
    "Endothelial Cells",
    "Oligodendrocyte Precursor Cells"
  
];

export const tracks = (assembly: string, pos: GenomicRange) =>
  TRACK_ORDER.map((x) => ({
    chr1: pos.chromosome!,
    start: pos.start,
    end: pos.end,
    ...DEFAULT_TRACKS().get(x)!,
    preRenderedWidth: 1400,
  }));

export const BIG_QUERY = gql`
  query BigRequests($bigRequests: [BigRequest!]!) {
    bigRequests(requests: $bigRequests) {
      data
      error {
        errortype
        message
      }
    }
  }
`;

type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};

export type BigResponseData =
  | BigWigData[]
  | BigBedData[]
  | BigZoomData[]
  | ValuedPoint[];

export type BigResponse = {
  data: BigResponseData;
  error: RequestError;
};

export type BigQueryResponse = {
  bigRequests: BigResponse[];
};

type AtacSeqPeaksTracksProps = {
  tracks: BigRequest[];
  domain: GenomicRange;
  onHeightChanged?: (i: number) => void;
  cCREHighlight?: GenomicRange;
  cCREHighlights?: Set<string>;
  svgRef?: RefObject<SVGSVGElement>;
  assembly: string;
  oncCREClicked?: (accession: string) => void;
  oncCREMousedOver?: (coordinates?: GenomicRange) => void;
  oncCREMousedOut?: () => void;
  onSettingsClick?: () => void;
};

export const TitledTrack: React.FC<{
  data: BigResponseData;
  url: string;
  title: string;
  color?: string;
  height: number;
  transform?: string;
  onHeightChanged?: (height: number) => void;
  domain: GenomicRange;
  svgRef?: React.RefObject<SVGSVGElement>;
}> = ({
  data,
  url,
  title,
  height,
  domain,
  transform,
  onHeightChanged,
  svgRef,
  color,
}) => {
  useEffect(
    () => onHeightChanged && onHeightChanged(height + 40),
    [height, onHeightChanged]
  );
  return (
    <g transform={transform}>
      <EmptyTrack
        height={40}
        width={1400}
        transform="translate(0,8)"
        id=""
        text={title}
      />
      {(url.endsWith(".bigBed") || url.endsWith(".bb") || url.endsWith(".bigbed")) ? (
        <DenseBigBed
          width={1400}
          height={height}
          domain={domain}
          id={url}
          transform="translate(0,40)"
          data={data as BigBedData[]}
          svgRef={svgRef}
          tooltipContent={(rect) => <CCRETooltip {...rect} assembly="grch38" />}
        />
      ) : (
        <FullBigWig
          transform="translate(0,40)"
          width={1400}
          height={height}
          domain={domain}
          id={url}
          color={color}
          data={data as BigWigData[]}
          noTransparency
        />
      )}
    </g>
  );
};

const AtacSeqPeaksTracks: React.FC<AtacSeqPeaksTracksProps> = (props) => {
  const [cTracks, setTracks] = useState<[string, string][]>([
    [
        "Astrocytes",
        "https://downloads.wenglab.org/Astro.PeakCalls.bb",
      ],
      [
        "Endothelial Cells",
        "https://downloads.wenglab.org/Endo.PeakCalls.bb",
      ],
      [
        "Oligodendrocyte Precursor Cells",
        "https://downloads.wenglab.org/OPC.PeakCalls.bb",
      ]
  ]);
  const height = useMemo(() => cTracks.length * 80, [cTracks]);
  const bigRequests = useMemo(
    () =>
      cTracks.map((x) => ({
        chr1: props.domain.chromosome!,
        start: props.domain.start,
        end: props.domain.end,
        preRenderedWidth: 1400,
        url: x[1],
      })),
    [cTracks, props]
  );
  const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, {
    variables: { bigRequests },
  });
  console.log(data,"data")
  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(height);
  }, [props.onHeightChanged, height, props]);

  const [settingsMousedOver, setSettingsMousedOver] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);

  return loading || (data?.bigRequests.length || 0) < 2 ? (
    <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
  ) : (
    <>
      <AtacSeaPeaksTrackModal
        open={settingsModalShown}
        onCancel={() => setSettingsModalShown(false)}
        onAccept={(x) => {
          setTracks(x);
          setSettingsModalShown(false);
        }}
        initialSelection={cTracks}
      />
      <g className="encode-fetal-brain">
        <rect y={10} height={55} fill="none" width={1400} />
      </g>
      {(data?.bigRequests || []).map((data, i) => (
        <TitledTrack
          height={40}
          url={cTracks[i][1]}
          domain={props.domain}
          title={cTracks[i][0]}
          svgRef={props.svgRef}
          data={data.data}
          transform={`translate(0,${i * 70})`}
        />
      ))}
      <g className="tf-motifs">
        <rect y={110} height={55} fill="none" width={1400} />
      </g>
      {settingsMousedOver && (
        <rect
          width={1400}
          height={height}
          transform="translate(0,-0)"
          fill="#4c1f8f"
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
        fill="#4c1f8f"
        stroke="#000000"
        fillOpacity={settingsMousedOver ? 1 : 0.6}
        onMouseOver={() => setSettingsMousedOver(true)}
        onMouseOut={() => setSettingsMousedOver(false)}
        strokeWidth={1}
        transform="translate(20,0)"
        onClick={() => {
          props.onSettingsClick && props.onSettingsClick();
          setSettingsModalShown(true);
        }}
      />
      <text
        transform={`rotate(270) translate(-${height / 2},12)`}
        textAnchor="middle"
        fill="#4c1f8f"
      >
        scATAC-Seq Peaks
      </text>
    </>
  );
};
export default AtacSeqPeaksTracks;
