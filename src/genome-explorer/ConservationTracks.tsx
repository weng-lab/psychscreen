import { gql, useQuery } from "@apollo/client";
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import React, { RefObject, useEffect, useMemo, useState } from "react";
import { EmptyTrack, FullBigWig } from "umms-gb";
import { RequestError } from "umms-gb/dist/components/tracks/trackset/types";
import { ValuedPoint } from "umms-gb/dist/utils/types";
import { ConservationTrackModal } from "./SettingsModals";
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

type ConservationTrackProps = {
  //tracks: BigRequest[];
  onSettingsClick?: () => void;
  domain: GenomicRange;
  onHeightChanged?: (i: number) => void;
  svgRef?: RefObject<SVGSVGElement>;
  assembly: string;
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
      {
        <FullBigWig
          transform="translate(0,40)"
          width={1400}
          height={height}
          domain={domain}
          range={{ min: -2, max: 9 }}
          id="NeuN+"
          color={color}
          data={data as BigWigData[]}
          noTransparency
        />
      }
    </g>
  );
};

const ConservationTracks: React.FC<ConservationTrackProps> = (props) => {
  const [cTracks, setTracks] = useState<[string, string][]>([
    //        [ "100-vertebrate phyloP conservation score", "https://downloads.wenglab.org/hg38.phyloP100way.bw" ],
    [
      "240-mammal phyloP conservation score (Vertical Viewing Range [-2 to 9])",
      "https://downloads.wenglab.org/241-mammalian-2020v2.bigWig",
    ],
    //  [ "43-primate conservation score", "https://downloads.wenglab.org/hg38_43primates_phastCons.bw" ]
  ]);
  const height = useMemo(() => cTracks.length * 150, [cTracks]);
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
  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(height);
  }, [props.onHeightChanged, height, props]);

  const [settingsModalShown, setSettingsModalShown] = useState(false);
  const [settingsMousedOver, setSettingsMousedOver] = useState(false);

  return loading || (data?.bigRequests.length || 0) < 1 ? (
    <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
  ) : (
    <>
      <ConservationTrackModal
        open={settingsModalShown}
        onCancel={() => setSettingsModalShown(false)}
        onAccept={(x) => {
          setTracks(x);
          setSettingsModalShown(false);
        }}
        initialSelection={cTracks}
      />
      {(data?.bigRequests || []).map((data, i) => (
        <TitledTrack
          height={100}
          key={cTracks[i][1]}
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
        fill="#9670cf"
        stroke="#000000"
        strokeWidth={1}
        transform="translate(20,0)"
        fillOpacity={settingsMousedOver ? 1 : 0.6}
        onMouseOver={() => setSettingsMousedOver(true)}
        onMouseOut={() => setSettingsMousedOver(false)}
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
        Evo. Conservation 
      </text>
    </>
  );
};
export default ConservationTracks;
