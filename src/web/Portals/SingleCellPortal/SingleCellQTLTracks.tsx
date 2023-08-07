import { gql, useQuery } from "@apollo/client";
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import React, { RefObject, useEffect, useMemo, useState } from "react";
import { DenseBigBed, EmptyTrack, FullBigWig } from "umms-gb";
import {
  BigRequest,
  RequestError,
} from "umms-gb/dist/components/tracks/trackset/types";
import { ValuedPoint } from "umms-gb/dist/utils/types";
import { BBTrack } from "./SingleCellGRNBrowser";
import SingleCellQTLTracksModal from "./SingleCellQTLTracksModal";


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



export const SingleCellQTLTracks: React.FC<any> = (props) =>{
    const [cTracks, setTracks] = useState<[string, string][]>([
        [
            "Layer 2/3 Intratelencephalic projecting",
            "https://downloads.wenglab.org/L2.3.IT_sig_QTLs.dat.bb",
          ],
        
          [
            "Layer 4 Intratelencephalic projecting ",
            "https://downloads.wenglab.org/L4.IT_sig_QTLs.dat.bb",
          ],

        [
          "Chandelier",
          "https://downloads.wenglab.org/Chandelier__Pvalb_sig_QTLs.dat.bb",
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
      useEffect(() => {
        props.onHeightChanged && props.onHeightChanged(height);
      }, [props.onHeightChanged, height, props]);
    
      const [settingsMousedOver, setSettingsMousedOver] = useState(false);
      const [settingsModalShown, setSettingsModalShown] = useState(false);
    
    return loading || (data?.bigRequests.length || 0) < 2 ? (
        <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
      ) : (
        <>
        <SingleCellQTLTracksModal
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
            width={40}
            fill="#ffffff"
          />
          <rect
            height={height}
            width={15}
            fill="#24529c"
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
            fill="#24529c"
          >
            eQTLs
          </text>
        </>
      );
}