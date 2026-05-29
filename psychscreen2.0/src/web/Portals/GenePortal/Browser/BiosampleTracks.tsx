import { gql, useQuery } from "@apollo/client";
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import React, { RefObject, useEffect, useMemo } from "react";
import { DenseBigBed, EmptyTrack, FullBigWig } from "umms-gb";
import { RequestError } from "umms-gb/dist/components/tracks/trackset/types";
import { ValuedPoint } from "umms-gb/dist/utils/types";
import CCRETooltip from "../../../../genome-explorer/CCRETooltip";

export type BiosampleEntry = {
  name: string;
  tissue?: string;
  dnase: string | null;
  h3k4me3: string | null;
  h3k27ac: string | null;
  ctcf: string | null;
  dnase_signal: string | null;
  h3k4me3_signal: string | null;
  h3k27ac_signal: string | null;
  ctcf_signal: string | null;
};
export type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};

function url(accession: string): string {
  return `https://www.encodeproject.org/files/${accession}/@@download/${accession}.bigWig`;
}

export const tracks = (pos: GenomicRange, x: BiosampleEntry) =>
  [
    sevenGroupTrack(pos, x),
    x.dnase_signal && {
      chr1: pos.chromosome!,
      start: pos.start,
      end: pos.end,
      url: url(x.dnase_signal),
      preRenderedWidth: 1400,
    },
    x.h3k4me3_signal && {
      chr1: pos.chromosome!,
      start: pos.start,
      end: pos.end,
      url: url(x.h3k4me3_signal),
      preRenderedWidth: 1400,
    },
    x.h3k27ac_signal && {
      chr1: pos.chromosome!,
      start: pos.start,
      end: pos.end,
      url: url(x.h3k27ac_signal),
      preRenderedWidth: 1400,
    },
    x.ctcf_signal && {
      chr1: pos.chromosome!,
      start: pos.start,
      end: pos.end,
      url: url(x.ctcf_signal),
      preRenderedWidth: 1400,
    },
  ].filter((x) => !!x);

const sevenGroupTrack = (pos: GenomicRange, x: BiosampleEntry) => {
  const r = [
    x.dnase_signal,
    x.h3k4me3_signal,
    x.h3k27ac_signal,
    x.ctcf_signal,
  ].filter((x) => !!x);
  return {
    chr1: pos.chromosome!,
    start: pos.start,
    end: pos.end,
    url: `http://gcp.wenglab.org/hubs/integrative1/data/seven-group/${r.join(
      "_"
    )}.7group.bigBed`,
    preRenderedWidth: 1400,
  };
};

const colors = (x: BiosampleEntry) =>
  [
    x.dnase_signal && COLOR_ORDER[0],
    x.h3k4me3_signal && COLOR_ORDER[1],
    x.h3k27ac_signal && COLOR_ORDER[2],
    x.ctcf_signal && COLOR_ORDER[3],
  ].filter((x) => !!x);

const QUERY = gql`
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

type QueryResponse = {
  bigRequests: BigResponse[];
};

type BiosampleTrackProps = {
  biosample: BiosampleEntry;
  domain: GenomicRange;
  onHeightChanged?: (i: number) => void;
  svgRef?: RefObject<SVGSVGElement>;
  oncCREClicked?: (accession: string) => void;
};

const COLOR_ORDER = ["#06da93", "#ff0000", "#ffcd00", "#00b0f0"];

const BiosampleTracks: React.FC<BiosampleTrackProps> = (props) => {
  const ttracks = useMemo(() => tracks(props.domain, props.biosample), [props]);
  const ccolors = useMemo(() => colors(props.biosample), [props]);
  const { data, loading } = useQuery<QueryResponse>(QUERY, {
    variables: { bigRequests: ttracks },
  });
  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(35 * ttracks.length + 40);
  }, [props, ttracks]);
  return loading ? (
    <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
  ) : (
    <>
      <EmptyTrack
        height={40}
        width={1400}
        transform=""
        id=""
        text={`Epigenetic signal and cCREs colored by activity in ${props.biosample.name}`}
      />
      {ttracks.map((_, i) =>
        i === 0 ? (
          <DenseBigBed
            transform={`translate(0,${35 * i + 40})`}
            width={1400}
            height={30}
            domain={props.domain}
            id={"" + i}
            data={data!.bigRequests[i].data as BigBedData[]}
            tooltipContent={(rect) => (
              <CCRETooltip
                {...rect}
                assembly="grch38"
                biosample={props.biosample}
              />
            )}
            key={i}
            svgRef={props.svgRef}
            onClick={(x) =>
              props.oncCREClicked && x.name && props.oncCREClicked(x.name)
            }
          />
        ) : (
          <FullBigWig
            transform={`translate(0,${35 * i + 40})`}
            width={1400}
            height={30}
            domain={props.domain}
            id={"" + i}
            color={ccolors[i - 1]!}
            data={data!.bigRequests[i].data as BigWigData[]}
            key={i}
          />
        )
      )}
    </>
  );
};
export default BiosampleTracks;
