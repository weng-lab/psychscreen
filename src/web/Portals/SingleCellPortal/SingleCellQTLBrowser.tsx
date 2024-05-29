/**
 * Is this entire file really not used at all?
 */
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ValuedPoint } from "umms-gb/dist/utils/types";
import { RequestError } from "umms-gb/dist/components/tracks/trackset/types";

import { GridProps } from "@mui/material";
import { GenomeBrowser, RulerTrack, UCSCControls, EmptyTrack } from "umms-gb";
import CytobandView from "../GenePortal/Browser/Explorer/Cytobands";
import { gql, useQuery } from "@apollo/client";
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import { Arcs } from "./Arcs";

type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};

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

const qtls = [
  ["Astrocytes", "https://downloads.wenglab.org/Astro_sig_QTLs.dat.bb"],

  [
    "Chandelier",
    "https://downloads.wenglab.org/Chandelier__Pvalb_sig_QTLs.dat.bb",
  ],

  ["Vip", "https://downloads.wenglab.org/Vip_sig_QTLs.dat.bb"],

  ["Sst", "https://downloads.wenglab.org/Sst__Sst.Chodl_sig_QTLs.dat.bb"],

  ["Pericytes", "https://downloads.wenglab.org/PC_sig_QTLs.dat.bb"],

  [
    "Layer 2/3 Intratelencephalic projecting",
    "https://downloads.wenglab.org/L2.3.IT_sig_QTLs.dat.bb",
  ],

  [
    "Layer 4 Intratelencephalic projecting ",
    "https://downloads.wenglab.org/L4.IT_sig_QTLs.dat.bb",
  ],

  [
    "Layer 5/6 Near projecting ",
    "https://downloads.wenglab.org/L5.6.NP_sig_QTLs.dat.bb",
  ],

  [
    "Layer 5 Intratelencephalic projecting",
    "https://downloads.wenglab.org/L5.IT_sig_QTLs.dat.bb",
  ],

  [
    "Layer 6 Corticothalamic projecting ",
    "https://downloads.wenglab.org/L6.CT_sig_QTLs.dat.bb",
  ],
  [
    "Layer 6 Intratelencephalic projecting ",
    "https://downloads.wenglab.org/L6.IT_sig_QTLs.dat.bb",
  ],

  ["L6b", "https://downloads.wenglab.org/L6b_sig_QTLs.dat.bb"],

  ["Lamp5.Lhx6", "https://downloads.wenglab.org/Lamp5.Lhx6_sig_QTLs.dat.bb"],
  ["Lamp5", "https://downloads.wenglab.org/Lamp5_sig_QTLs.dat.bb"],
  ["Microglia", "https://downloads.wenglab.org/Micro.PVM_sig_QTLs.dat.bb"],
  ["Oligodendrocytes", "https://downloads.wenglab.org/Oligo_sig_QTLs.dat.bb"],
  [
    "Oligodendrocyte Precursor Cells",
    "https://downloads.wenglab.org/OPC_sig_QTLs.dat.bb",
  ],
];

const SingleCellQTLBrowser: React.FC<GridProps> = (props) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [coordinates, setCoordinates] = useState<GenomicRange>({
    chromosome: "chr11",
    start: 6169295,
    end: 6215251,
  });

  const onDomainChanged = useCallback((d: GenomicRange) => {
    const chr =
      d.chromosome === undefined ? coordinates.chromosome : d.chromosome;
    if (Math.round(d.end) - Math.round(d.start) > 10) {
      setCoordinates({
        chromosome: chr,
        start: Math.round(d.start),
        end: Math.round(d.end),
      });
    }
  }, []);
  return (
    <>
      <br />
      <div style={{ marginTop: "1em", width: "100%", textAlign: "center" }}>
        {`${coordinates.chromosome}:${coordinates.start}-${coordinates.end}`}{" "}
      </div>
      <br />
      <CytobandView
        innerWidth={1400}
        height={15}
        chromosome={coordinates.chromosome!}
        assembly="hg38"
        position={coordinates}
      />
      <br />
      <div style={{ textAlign: "center" }}>
        <UCSCControls
          onDomainChanged={onDomainChanged}
          domain={coordinates}
          withInput={false}
        />
         <br/>
        {"Hold shift and drag to select a region"}
      </div>
      <br />
      <GenomeBrowser
        svgRef={svgRef}
        domain={coordinates}
        innerWidth={1400}
        width="100%"
        noMargin
        onDomainChanged={(x) => {
          if (Math.ceil(x.end) - Math.floor(x.start) > 10) {
            setCoordinates({
              chromosome: coordinates.chromosome,
              start: Math.floor(x.start),
              end: Math.ceil(x.end),
            });
          }
        }}
      >
        <RulerTrack domain={coordinates} height={40} width={1400} />
        <Trackset coordinates={coordinates} tracks={qtls} />
      </GenomeBrowser>
    </>
  );
};

const BBTrack: React.FC<{
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

  const re = data as BigBedData[];
  let linkdata = re && re.map((r) => {
    return {
      regionA: {
        chromosome: r.chr,
        start: +r.start,
        end: +r.end + 1, //Why is 1 being added here? -Jonathan 5/23/24
      },
      regionB: {
        chromosome: r.name?.split(":")[0]!!,
        start: +r.name?.split(":")[1].split("-")[0]!!,
        end: +r.name?.split(":")[1].split("-")[1]!! + 1, //Why is 1 being added here? -Jonathan 5/23/24
      
      },
      score: 30,
      targetGene: r.name?.split(":")[2] || 'Target Gene not identified'
    };
  });

  return (
    <g transform={transform}>
      <EmptyTrack
        height={40}
        width={1400}
        transform="translate(0,8)"
        id=""
        text={title}
      />
      <Arcs
        width={1400}
        height={height}
        domain={domain}
        id="atc"
        arcOpacity={1}
        transform="translate(0,40)"
        data={linkdata}
        svgRef={svgRef}
      />
    </g>
  );
};

const Trackset: React.FC<any> = (props) => {
  const height = useMemo(
    () => props.tracks.length * 80,
    [props.tracks, props.coordinates]
  );
  const bigRequests = useMemo(
    () =>
      props.tracks.map((url) => ({
        chr1: props.coordinates.chromosome,
        start: props.coordinates.start,
        end: props.coordinates.end,
        chr2: props.coordinates.chromosome,
        url: url[1],
        preRenderedWidth: 1400,
      })),
    [props.coordinates]
  );
  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(height);
  }, [props.onHeightChanged, height, props]);
  const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, {
    variables: { bigRequests },
  });

  return loading || (data?.bigRequests.length || 0) < 2 ? (
    <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
  ) : (
    <>
      {(data?.bigRequests || []).map((data, i) => (
        <BBTrack
          height={40}
          key={props.tracks[i][0]}
          url={props.tracks[i][1]}
          domain={props.coordinates}
          title={props.tracks[i][0]}
          svgRef={props.svgRef}
          data={data.data}
          transform={`translate(0,${i * 70})`}
        />
      ))}
    </>
  );
};
