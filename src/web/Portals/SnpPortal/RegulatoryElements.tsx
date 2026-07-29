import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import { Table, TableColDef } from "@weng-lab/ui-components";
import React, { useMemo } from "react";
import { GenomicRange } from "./SNPDetails";

export const CCRE_FIELDS = gql`
  fragment CCREFields on CCRE {
    accession
    coordinates {
      chromosome
      start
      end
    }
    rDHS
    group
    dnaseZ: maxZ(assay: "dnase")
    h3k4me3Z: maxZ(assay: "h3k4me3")
    h3k27acZ: maxZ(assay: "h3k27ac")
    ctcfZ: maxZ(assay: "ctcf")
  }
`;

export const SEARCH_QUERY = gql`
  ${CCRE_FIELDS}
  query ccre(
    $assembly: String!
    $coordinates: [GenomicRangeInput!]
    $accession: [String!]
  ) {
    cCREQuery(
      assembly: "GRCh38"
      coordinates: $coordinates
      accession: $accession
    ) {
      ...CCREFields
    }
    rDHSQuery(
      assembly: $assembly
      coordinates: $coordinates
      accession: $accession
    ) {
      accession
      coordinates {
        chromosome
        start
        end
      }
      dnaseZ: maxZ(assay: "dnase")
      h3k4me3Z: maxZ(assay: "h3k4me3")
      h3k27acZ: maxZ(assay: "h3k27ac")
      ctcfZ: maxZ(assay: "ctcf")
    }
  }
`;
export type RegulatoryElementsProps = {
  coordinates: GenomicRange;
  assembly: string;
};

export type CCREEntry = {
  accession: string;
  coordinates: GenomicRange;
  rDHS: string;
  group?: string;
  dnaseZ?: number;
  h3k4me3Z?: number;
  h3k27acZ?: number;
  ctcfZ?: number;
  zScores?: {
    score: number;
  }[];
};

export type SearchQueryResponse = {
  cCREQuery: CCREEntry[];
  rDHSQuery: CCREEntry[];
};

export const COLORS: Map<string, string> = new Map([
  ["PLS", "#ff0000"],
  ["pELS", "#ffa700"],
  ["dELS", "#ffcd00"],
  ["DNase-H3K4me3", "#ffaaaa"],
  ["CTCF-only", "#00b0f0"],
]);

export const GROUPS: Map<string, string> = new Map([
  ["CA-CTCF", "Chromatin Accessible with CTCF"],
  ["CA-TF", "Chromatin Accessible with TF"],
  ["CA-H3K4me3", "Chromatin Accessible with H3K4me3"],
  ["TF", "TF"],
  ["CA", "Chromatin Accessible Only"],
  ["pELS", "Proximal Enhancer-Like Signature"],
  ["dELS", "Distal Enhancer-Like Signature"],
  ["PLS", "Promoter-Like Signature"],
  ["ylowdnase", "Low DNase"],
  ["zunclassified", "zunclassified"],
]);

const regulatoryElementsColumns: TableColDef<CCREEntry>[] = [
  { field: "accession", headerName: "cCRE ID" },
  {
    field: "group",
    headerName: "cCRE Class",
    renderCell: (params) => (
      <svg height={18}>
        <rect
          width={10}
          height={10}
          y={3}
          fill={COLORS.get(params.row.group || "") || "#06da93"}
        />
        <text x={16} y={12}>
          {GROUPS.get(params.row.group || "") || params.row.group || "rDHS"}
        </text>
      </svg>
    ),
  },
  {
    field: "dnaseZ",
    headerName: "DNase Z-score in fetal brain",
    type: "number",
    renderCell: (params) =>
      params.value ? (
        <span style={{ fontWeight: params.value > 1.64 ? "bold" : "normal" }}>
          {params.value.toFixed(2)}
        </span>
      ) : (
        <span>--</span>
      ),
  },
  {
    field: "chromosome",
    headerName: "Chromosome",
    valueGetter: (_, row) => row.coordinates.chromosome,
  },
  {
    field: "start",
    headerName: "Start",
    type: "number",
    valueGetter: (_, row) => row.coordinates.start,
    valueFormatter: (value: number) => value.toLocaleString(),
  },
  {
    field: "length",
    headerName: "Length",
    type: "number",
    valueGetter: (_, row) => row.coordinates.end - row.coordinates.start,
  },
];

const RegulatoryElements: React.FC<RegulatoryElementsProps> = (props) => {
  const { data, loading } = useQuery<SearchQueryResponse>(SEARCH_QUERY, {
    variables: {
      assembly: props.assembly,
      coordinates: props.coordinates,
    },
    context: { clientName: "staging" },
  });
  const ur = useMemo(
    () => new Set((data?.cCREQuery || []).map((x) => x.rDHS)),
    [data],
  );
  const allResults = useMemo(
    () => [
      ...(data?.cCREQuery || []),
      ...(data?.rDHSQuery || []).filter((x) => !ur.has(x.accession)),
    ],
    [data, ur],
  );
  const combinedResults = useMemo(() => [...allResults], [allResults]);

  return loading ? (
    <>
      <Typography
        variant="body1"
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "19px",
        }}
      >
        Loading Data...
      </Typography>
      <br />
      <CircularProgress color="inherit" />
    </>
  ) : (
    <>
      <Typography variant="subtitle1">
        {" "}
        Your search returned {combinedResults.length.toLocaleString() || 0}{" "}
        cCREs and rDHSs.
      </Typography>
      {combinedResults.length > 0 && (
        <Table
          label="Regulatory Elements"
          columns={regulatoryElementsColumns}
          rows={combinedResults}
          getRowId={(row) => row.accession}
          divHeight={{ maxHeight: 750 }}
          emptyTableFallback="No regulatory elements found"
        />
      )}
    </>
  );
};

export default RegulatoryElements;
