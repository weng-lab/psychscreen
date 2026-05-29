import { gql, useQuery } from "@apollo/client";
import React, { useMemo } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export const COLORS: Map<string, string> = new Map([
  ["PLS", "#ff0000"],
  ["pELS", "#ffa700"],
  ["dELS", "#ffcd00"],
  ["DNase-H3K4me3", "#ffaaaa"],
  ["CTCF-only", "#00b0f0"],
]);

export const GROUPS: Map<string, string> = new Map([
  ["PLS", "promoter-like"],
  ["pELS", "proximal enhancer-like"],
  ["dELS", "distal enhancer-like"],
  ["DNase-H3K4me3", "DNase-H3K4me3"],
  ["CTCF-only", "CTCF-only"],
]);

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

type CCRETooltipProps = {
  start: number;
  end: number;
  name?: string;
  assembly?: string;
  biosample?: BiosampleEntry;
};

const QUERY = gql`
  query cCRE(
    $assembly: String!
    $accession: [String!]
    $experiments: [String!]
  ) {
    cCREQuery(assembly: $assembly, accession: $accession) {
      group
      zScores(experiments: $experiments) {
        experiment
        score
      }
    }
  }
`;

type QueryResponse = {
  cCREQuery: {
    group: string;
    zScores: {
      experiment: string;
      score: number;
    }[];
  }[];
};

const biosampleExperiments = (x: BiosampleEntry) =>
  [x.dnase, x.h3k4me3, x.h3k27ac, x.ctcf].filter((xx) => !!xx);

const MARKS = ["DNase", "H3K4me3", "H3K27ac", "CTCF"];
const marks = (x: BiosampleEntry) =>
  [x.dnase, x.h3k4me3, x.h3k27ac, x.ctcf]
    .map((x, i) => x && MARKS[i])
    .filter((xx) => !!xx);

const CCRETooltip: React.FC<CCRETooltipProps> = (props) => {
  const experiments = useMemo(
    () =>
      props.biosample
        ? biosampleExperiments(props.biosample)
        : ["dnase", "h3k4me3", "h3k27ac", "ctcf"],
    [props]
  );
  const { data, loading } = useQuery<QueryResponse>(QUERY, {
    variables: {
      assembly: props.assembly!,
      accession: props.name!,
      experiments,
    },
  });

  return (
    <div
      style={{ border: "1px solid", padding: "0.75em", background: "#ffffff" }}
    >
      {loading || !data?.cCREQuery[0] ? (
        <CircularProgress color="inherit" />
      ) : (
        <>
          <svg height={18}>
            <rect
              width={10}
              height={10}
              y={3}
              fill={COLORS.get(data.cCREQuery[0].group || "") || "#06da93"}
            />
            <text x={16} y={12}>
              {props.name} ⸱ {GROUPS.get(data.cCREQuery[0].group || "")}
            </text>
          </svg>
          Click for details about this cCRE
          <br />
          <br />
          <strong>
            {props.biosample
              ? "Z-scores in " + props.biosample.name
              : "Max Z-scores across all biosamples:"}
          </strong>
          <br />
          {(props.biosample ? marks(props.biosample) : MARKS).map((x, i) => (
            <React.Fragment key={i}>
              <strong>{x}</strong>:{" "}
              {data.cCREQuery[0].zScores
                .find((xx) => xx.experiment === experiments[i])
                ?.score.toFixed(2)}
              <br />
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};
export default CCRETooltip;
