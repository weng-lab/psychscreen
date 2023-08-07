import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ValuedPoint } from "umms-gb/dist/utils/types";
import { RequestError } from "umms-gb/dist/components/tracks/trackset/types";
import { GridProps } from "@mui/material";
import {
  GenomeBrowser,
  RulerTrack,
  UCSCControls,
  EmptyTrack,
  DenseBigBed,
  LinkTrack,
} from "umms-gb";
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

const grns = [
  [
    "Astrocytes Enhancer and Promoter ",
    "https://downloads.wenglab.org/Ast.bb",
  ],
  [
    "Endothelial cells Enhancer and Promoter",
    "https://downloads.wenglab.org/End.bb",
  ],
  ["Vip  Enhancer and Promoter",
   "https://downloads.wenglab.org/Vip.bb"
  ],
  [
    "Oligodendrocytes Enhancer and Promoter",
    "https://downloads.wenglab.org/Oli.bb",
  ],
  [
    "Chandelier Enhancer and Promoter",
    "https://downloads.wenglab.org/Chandelier.bb",
  ],
  [
    "Immune Cells  Enhancer and Promoter",
    "https://downloads.wenglab.org/Immune.bb",
  ],

  [
    "Vascular Leptomeningeal Cells Enhancer and Promoter",
    "https://downloads.wenglab.org/VLMC.bb",
  ],
  ["Sncg Enhancer and Promoter", "https://downloads.wenglab.org/Sncg.bb"],
  ["Sst  Enhancer and Promoter", "https://downloads.wenglab.org/Sst.bb"],
  ["Pvalb  Enhancer and Promoter", "https://downloads.wenglab.org/Pvalb.bb"],
  ["Pax6  Enhancer and Promoter", "https://downloads.wenglab.org/Pax6.bb"],
  [
    "Oligodendrocyte Precursor Cells  Enhancer and Promoter",
    "https://downloads.wenglab.org/OPC.bb",
  ],
  ["Microglia Enhancer and Promoter", "https://downloads.wenglab.org/Mic.bb"],
  [
    "Lamp5.Lhx6  Enhancer and Promoter",
    "https://downloads.wenglab.org/Lamp5.Lhx6.bb",
  ],
  ["Lamp5 Enhancer and Promoter", "https://downloads.wenglab.org/Lamp5.bb"],
  ["L6b  Enhancer and Promoter", "https://downloads.wenglab.org/L6b.bb"],
  [
    "Layer 6 Intratelencephalic projecting  Enhancer and Promoter",
    "https://downloads.wenglab.org/L6.IT.bb",
  ],
  [
    "Layer 5 Intratelencephalic projecting Enhancer and Promoter",
    "https://downloads.wenglab.org/L5.IT.bb",
  ],
  [
    "Layer 4 Intratelencephalic projecting Enhancer and Promoter",
    "https://downloads.wenglab.org/L4.IT.bb",
  ],
  [
    "Layer 2/3 Intratelencephalic projecting Enhancer and Promoter",
    "https://downloads.wenglab.org/L2.3.IT.bb",
  ],
  [
    "Layer 5 Extratelencephalic projecting Enhancer and Promoter",
    "https://downloads.wenglab.org/L5.ET.bb",
  ],
  [
    "Layer 5/6 Near projecting Enhancer and Promoter",
    "https://downloads.wenglab.org/L5.6.NP.bb",
  ],
  [
    "Layer 6 Intratelencephalic projecting Car3 Enhancer and Promoter",
    "https://downloads.wenglab.org/L6.IT.Car3.bb",
  ],
  [
    "Layer 6 Corticothalamic projecting  Enhancer and Promoter",
    "https://downloads.wenglab.org/L6.CT.bb",
  ],
  /*
    
    [ "Lamp5 Enhancer and Promoter", "https://downloads.wenglab.org/Lamp5.bb" ],
    [ "Lamp5 Promoter", "https://downloads.wenglab.org/Lamp5.bb" ],
    
    [ "L6b Enhancer and Promoter", "https://downloads.wenglab.org/L6b.bb" ],
    [ "L6b Promoter", "https://downloads.wenglab.org/L6b.bb" ],
    
    [ "Layer 6 Intratelencephalic projecting Enhancer and Promoter", "https://downloads.wenglab.org/L6.IT.bb" ],
    [ "Layer 6 Intratelencephalic projecting Promoter", "https://downloads.wenglab.org/L6.IT.bb" ],
    
    [ "Layer 5 Intratelencephalic projecting Enhancer and Promoter", "https://downloads.wenglab.org/L5.IT.bb" ],
    [ "Layer 5 Intratelencephalic projecting Promoter", "https://downloads.wenglab.org/L5.IT.bb" ],
    
    [ "Layer 4 Intratelencephalic projecting Enhancer and Promoter", "https://downloads.wenglab.org/L4.IT.bb" ],
    [ "Layer 4 Intratelencephalic projecting Promoter", "https://downloads.wenglab.org/L4.IT.bb" ],
    
    [ "Layer 2/3 Intratelencephalic projecting Enhancer and Promoter", "https://downloads.wenglab.org/L2.3.IT.bb" ],
    [ "Layer 2/3 Intratelencephalic projecting Promoter", "https://downloads.wenglab.org/L2.3.IT.bb" ],
    
    [ "Layer 5 Extratelencephalic projecting Enhancer and Promoter", "https://downloads.wenglab.org/L5.ET.bb" ],
    [ "Layer 5 Extratelencephalic projecting Promoter", "https://downloads.wenglab.org/L5.ET.bb" ],
    
    [ "Layer 5/6 Near projecting Enhancer and Promoter", "https://downloads.wenglab.org/L5.6.NP.bb" ],
    [ "Layer 5/6 Near projecting Promoter", "https://downloads.wenglab.org/L5.6.NP.bb" ],
    
    [ "Layer 6 Intratelencephalic projecting Car3 Enhancer and Promoter", "https://downloads.wenglab.org/L6.IT.Car3.bb" ],
    [ "Layer 6 Intratelencephalic projecting Car3 Promoter", "https://downloads.wenglab.org/L6.IT.Car3.bb" ],
    
    [ "Layer 6 Corticothalamic projecting Enhancer and Promoter", "https://downloads.wenglab.org/L6.CT.bb" ],
    [ "Layer 6 Corticothalamic projecting Promoter", "https://downloads.wenglab.org/L6.CT.bb" ],*/
];

const SingleCellGRNBrowser: React.FC<GridProps> = (props) => {
  const svgRef = React.useRef<SVGSVGElement>(null);
  //chr11:6920218-6930665
  const [coordinates, setCoordinates] = useState<GenomicRange>({
    chromosome: "chr11",
    start: 6080547,
    end: 6680547,
  });

  const onDomainChanged = useCallback((d: GenomicRange) => {
    const chr =
      d.chromosome === undefined ? coordinates.chromosome : d.chromosome;
    let st = d.start < 0 ? 1 : d.start;
    if (Math.round(d.end) - Math.round(st) > 10) {
      setCoordinates({
        chromosome: chr,
        start: Math.round(st),
        end: Math.round(d.end),
      });
    }
  }, []);
  return (
    <>
      <>
        <br />
        <div style={{ marginTop: "1em", width: "100%", textAlign: "center" }}>
          {`${coordinates.chromosome}:${coordinates.start}-${coordinates.end}`}{" "}
        </div>
        <br />
        <CytobandView
          innerWidth={1000}
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
                start: Math.floor(x.start) < 0 ? 1 : Math.floor(x.start),
                end: Math.ceil(x.end),
              });
            }
          }}
        >
          <RulerTrack domain={coordinates} height={30} width={1400} />
          <Trackset coordinates={coordinates} tracks={grns} />
        </GenomeBrowser>
      </>
    </>
  );
};

export const BBTrack: React.FC<{
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
  let linkdata = re.map((r) => {
    if (r.name?.includes("NA:")) {
      return {
        regionA: { chromosome: r.chr, start: r.start, end: r.end },
        regionB: { chromosome: r.chr, start: +r.start, end: +r.end },
        score: 30,
      };
    } else {
      return {
        regionA: { chromosome: r.chr, start: +r.start, end: +r.end },
        regionB: {
          chromosome: r.name?.split(":")[0]!!,
          start: +r.name?.split(":")[1].split("-")[0]!!,
          end: +r.name?.split(":")[1].split("-")[1]!!,
        },
        score: 30,
      };
    }
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
        color="black"
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

  return loading ? (
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

export default SingleCellGRNBrowser;
