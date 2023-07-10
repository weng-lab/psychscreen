import { useQuery } from "@apollo/client";
import React, { useMemo, useState } from "react";
import { BIG_QUERY, BigQueryResponse } from "./DefaultTracks";
import CircularProgress from "@mui/material/CircularProgress";
import { BigBedData } from "bigwig-reader";
import {
  ManhattanTrack,
  ManhattanTrackProps,
  LDTrack,
  EmptyTrack,
} from "umms-gb";
import { ManhattanSNP } from "umms-gb/dist/components/tracks/manhattan/types";
import { Typography } from "@weng-lab/psychscreen-ui-components";

export type EQTL = {
  snp: string;
  fdr: number;
  nominal_pval: number;
  slope: number;
};

export type LDEntry = {
  id: string;
  rSquared: number;
  coordinates: GenomicRange;
};

export type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};

type ManhattanPlotTrackProps = {
  url: string;
  domain: GenomicRange;
  onHeightChanged?: (height: number) => void;
  onSNPMousedOver?: (snp: ManhattanSNP) => void;
  snpProps: (
    snp: ManhattanSNP,
    props: ManhattanTrackProps
  ) => React.SVGProps<SVGCircleElement>;
  className?: string;
  anchor: string;
  ld: LDEntry[];
  groupedQTLs: Map<string, EQTL>;
  allQTLs: any[];
  sortOrder?: (a: ManhattanSNP, b: ManhattanSNP) => number;
  svgRef?: any;
  onSettingsClick?: () => void;
};

const tracks = (url: string, pos: GenomicRange) => ({
  chr1: pos.chromosome!,
  start: pos.start,
  end: pos.end,
  url,
});

const Tooltip: React.FC<ManhattanSNP> = (snp) => (
  <div style={{ marginTop: "-5em", marginLeft: "-4em", background: "#ffffff" }}>
    <Typography
      type="body"
      size="small"
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "19px",
      }}
    >
      {snp.data.rsId}
    </Typography>
    {snp.data.score.toExponential(3)}
  </div>
);

const ManhattanPlotTrack: React.FC<ManhattanPlotTrackProps> = (props) => {
  const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, {
    variables: { bigRequests: tracks(props.url, props.domain) },
  });
  const inView = useMemo(
    () =>
      ((data?.bigRequests[0]?.data || []) as BigBedData[]).map(
        (xx: BigBedData) => ({
          rsId: xx.name?.split("_")[0] || "",
          score: +(xx.name?.split("_")[1] || "0"),
          coordinates: {
            start: xx.start,
            end: xx.end,
            chromosome: xx.chr,
          },
        })
      ),
    [data]
  );
  const allQTLs = useMemo(
    () =>
      inView
        ?.filter((x) => props.groupedQTLs.get(x.rsId))
        .map((x) => ({ ...x, eQTL: props.groupedQTLs.get(x.rsId)! })) || [],
    [inView, props]
  );
  const [settingsMousedOver, setSettingsMousedOver] = useState(false);
  return loading ? (
    <>
      <Typography
        type="body"
        size="large"
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "19px",
        }}
      >
        Loading...
      </Typography>
      <br />
      <CircularProgress color="inherit" />
    </>
  ) : (
    <g>
      <ManhattanTrack
        height={150}
        data={inView}
        width={1400}
        domain={props.domain}
        tooltipContent={Tooltip}
        onHeightChanged={(height) =>
          props.onHeightChanged && props.onHeightChanged(height + 120)
        }
        onSNPMousedOver={props.onSNPMousedOver}
        snpProps={props.snpProps}
        className={props.className}
        sortOrder={props.sortOrder}
        svgRef={props.svgRef}
      />
      <EmptyTrack
        height={25}
        text="Fetal brain eQTLs (red) and other SNPs (black)"
        width={1400}
        transform="translate(0,170)"
        id=""
      />
      <LDTrack
        width={1400}
        height={50}
        domain={props.domain}
        anchor={props.anchor}
        data={{
          snps: [
            ...(inView || []).map((x) => ({
              id: x.rsId,
              domain: x.coordinates,
            })),
          ].sort((a, b) => a.domain.start - b.domain.start),
          ld: props.ld,
        }}
        onVariantMouseOver={(data) =>
          props.onSNPMousedOver &&
          props.onSNPMousedOver({
            data: {
              score: 0,
              rsId: data.id,
              coordinates: {
                chromosome: props.domain.chromosome!,
                start: data.domain.start,
                end: data.domain.end,
              },
            },
            x: 0,
            y: 0,
          })
        }
        ldThreshold={0.1}
        highlighted={new Set(allQTLs.map((x) => x.rsId))}
        highlightColor="#ff0000"
        transform="translate(0,190)"
      />
      {settingsMousedOver && (
        <rect
          width={1400}
          height={300}
          transform="translate(0,-40)"
          fill="#24529c"
          fillOpacity={0.1}
        />
      )}
      <rect
        transform="translate(0,-40)"
        height={300}
        width={40}
        fill="#ffffff"
      />
      <rect
        height={300}
        width={15}
        fill="#24529c"
        stroke="#000000"
        fillOpacity={settingsMousedOver ? 1 : 0.6}
        onMouseOver={() => setSettingsMousedOver(true)}
        onMouseOut={() => setSettingsMousedOver(false)}
        strokeWidth={1}
        transform="translate(20,-40)"
        onClick={props.onSettingsClick}
      />
      <text transform="rotate(270) translate(-170,10)" fill="#24529c">
        Variants and GWAS
      </text>
    </g>
  );
};
export default ManhattanPlotTrack;
