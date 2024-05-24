import { gql, useQuery } from "@apollo/client";
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import React, { useEffect, useMemo, useState } from "react";
import { EmptyTrack } from "umms-gb";
import { RequestError } from "umms-gb/dist/components/tracks/trackset/types";
import { ValuedPoint } from "umms-gb/dist/utils/types";
import { BBTrack } from "./SingleCellGRNBrowser";
import SingleCellGRNTracksModal from "./SingleCellGRNTracksModal";

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

export const SingleCellGRNTracks: React.FC<any> = (props) => {
  const [cTracks, setTracks] = useState<[string, string][]>([
    [
      "Astrocytes Enhancer and Promoter",
      "https://downloads.wenglab.org/Ast_GRN.bb",
    ],
    [
      "Endothelial cells Enhancer and Promoter",
      "https://downloads.wenglab.org/End_GRN.bb",
    ],
    ["Vip  Enhancer and Promoter", "https://downloads.wenglab.org/Vip_GRN.bb"],
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
  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(height);
  }, [props.onHeightChanged, height, props]);

  const [settingsMousedOver, setSettingsMousedOver] = useState(false);
  const [settingsModalShown, setSettingsModalShown] = useState(false);

  return loading || (data?.bigRequests.length || 0) < 2 ? (
    <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
  ) : (
    <>
      <SingleCellGRNTracksModal
        open={settingsModalShown}
        onCancel={() => setSettingsModalShown(false)}
        onAccept={(x) => {
          setTracks(x);
          setSettingsModalShown(false);
        }}
        initialSelection={cTracks}
      />
      {(data?.bigRequests || []).map((data, i) => (
        <BBTrack
          height={40}
          url={cTracks[i][1]}
          domain={props.domain}
          key={cTracks[i][0]}
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
        width={30}
        fill="#ffffff"
      />
      <rect
        height={height}
        width={10}
        fill="#194023"
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
        fill="#194023"
      >
        Gene Regulatory Networks
      </text>
    </>
  );
};
