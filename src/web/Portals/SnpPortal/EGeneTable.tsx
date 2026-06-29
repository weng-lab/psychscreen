import { gql, useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { associateBy } from "queryz";
import React, { useMemo } from "react";
import { EGene } from "./SNPDetails";
import CircularProgress from "@mui/material/CircularProgress";
import { Table, TableColDef } from "@weng-lab/ui-components";


import { useNavigate } from "react-router-dom";
import { toScientificNotation } from "../DiseaseTraitPortal/utils";
const QUERY = gql`
  query q($id: [String!]) {
    gene(name_prefix: $id, assembly: "GRCh38", version: 40) {
      name
      id
    }
  }
`;

type QueryResponse = {
  gene: {
    name: string;
    id: string;
  }[];
};
const DECONQTL_QUERY = gql`
  query deconqtlsQuery($geneid: String, $snpid: String) {
    deconqtlsQuery(geneid: $geneid, snpid: $snpid) {
      celltype
      snpid
      slope
      nom_val
      geneid
      adj_beta_pval
      r_squared
      snp_chrom
      snp_start
    }
  }
`;

const QTLSIGASSOC_QUERY = gql`
  query qtlsigassocQuery($geneid: String, $snpid: String) {
    qtlsigassocQuery(geneid: $geneid, snpid: $snpid) {
      snpid
      slope
      qtltype
      dist
      geneid
      npval
      fdr
    }
  }
`;

const GENE_NAME_QUERY = gql`
  query ($assembly: String!, $name_prefix: [String!]) {
    gene(assembly: $assembly, name_prefix: $name_prefix, version: 40) {
      name
      id
    }
  }
`;
const TRANSCRIPT_NAME_QUERY = gql`
  query ($assembly: String!, $name_prefix: [String!]) {
    transcript(assembly: $assembly, name_prefix: $name_prefix) {
      name
      id
    }
  }
`;

const qtlsigColumns: TableColDef[] = [
  {
    field: "geneid",
    headerName: "Gene ID",
    renderCell: (params) =>
      params.row.qtltype === "eQTL" ? (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/psychscreen/gene/${params.value}`}
          style={{ color: "#0000EE" }}
        >
          <i>{params.value}</i>
        </a>
      ) : (
        params.value
      ),
  },
  { field: "dist", headerName: "Distance", type: "number" },
  {
    field: "slope",
    headerName: "Slope",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "fdr",
    headerName: "FDR",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "npval",
    headerName: "P",
    type: "number",
    renderHeader: () => (
      <Typography>
        <i>P</i>
      </Typography>
    ),
    valueFormatter: (value: number) => value.toFixed(2),
  },
  { field: "qtltype", headerName: "Type" },
];

const deconqtlColumns: TableColDef[] = [
  { field: "geneid", headerName: "Gene ID" },
  {
    field: "slope",
    headerName: "Slope",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "nom_val",
    headerName: "eQTL nominal P",
    type: "number",
    renderHeader: () => (
      <Typography>
        eQTL nominal <i>P</i>
      </Typography>
    ),
    valueFormatter: (value: number) => toScientificNotation(value, 2),
  },
  {
    field: "adj_beta_pval",
    headerName: "Adjusted beta pvalue",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "r_squared",
    headerName: "R Squared",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "coordinates",
    headerName: "Coordinates",
    valueGetter: (_, row) =>
      `chr${row.snp_chrom}:${row.snp_start.toLocaleString()}`,
  },
  { field: "celltype", headerName: "Cell Type" },
];

const egenesColumns: TableColDef[] = [
  {
    field: "name",
    headerName: "Gene",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/psychscreen/gene/${params.value}`}
        style={{ color: "#0000EE" }}
      >
        <i>{params.value}</i>
      </a>
    ),
  },
  {
    field: "nominal_pval",
    headerName: "p",
    type: "number",
    valueFormatter: (value: number) =>
      value < 0.001 ? value.toExponential(2) : value.toFixed(2),
  },
  {
    field: "fdr",
    headerName: "FDR",
    type: "number",
    valueFormatter: (value: number) =>
      value < 0.001 ? value.toExponential(2) : value.toFixed(2),
  },
  {
    field: "slope",
    headerName: "slope",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
];

const EGeneTable: React.FC<{ genes: EGene[]; snp: string }> = (props) => {
  const navigate = useNavigate();
  const { data, loading } = useQuery<QueryResponse>(QUERY, {
    variables: { id: props.genes.map((x) => x.gene.split(".")[0]) },
  });
  const { data: eqtlData, loading: eqtlLoading } = useQuery(DECONQTL_QUERY, {
    variables: {
      snpid: props.snp,
    },
  });

  const { data: qtlsigassocData, loading: qtlsigassocLoading } = useQuery(
    QTLSIGASSOC_QUERY,
    {
      variables: {
        snpid: props.snp,
      },
    }
  );

  const { data: geneNameData } = useQuery(GENE_NAME_QUERY, {
    variables: {
      name_prefix:
        qtlsigassocData &&
        qtlsigassocData.qtlsigassocQuery
          .map((x) => x.geneid.split(".")[0])
          .filter((x) => x.includes("ENSG")),
      assembly: "GRCh38",
    },
    skip: qtlsigassocLoading || !qtlsigassocData,
  });

  const { data: transcriptNameData } = useQuery(TRANSCRIPT_NAME_QUERY, {
    variables: {
      name_prefix:
        qtlsigassocData &&
        qtlsigassocData.qtlsigassocQuery
          .map((x) => x.geneid.split(".")[0])
          .filter((x) => x.includes("ENST")),
      assembly: "GRCh38",
    },
    skip: qtlsigassocLoading || !qtlsigassocData,
  });

  const deconqtlData = eqtlData && eqtlData.deconqtlsQuery;

  const genemap = useMemo(
    () =>
      associateBy(
        props.genes,
        (x) => x.gene,
        (x) => x
      ),
    [props]
  );
  const genes = useMemo(
    () =>
      associateBy(
        data?.gene || [],
        (x) => x.id,
        (x) =>
          ({ ...genemap.get(x.id.split(".")[0]), name: x.name } as EGene & {
            name: string;
          })
      ),
    [data, genemap]
  );

  const egeneData =
    data && data.gene && [...genes.keys()].map((k) => genes.get(k)!);

  return loading || !egeneData || qtlsigassocLoading || eqtlLoading ? (
    <>
      <Typography variant="body1"
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
      {" "}
      {egeneData && egeneData.length > 0 ? (
        <>
          <Typography variant="subtitle1">
            eGenes for {props.snp}:
          </Typography>

          <Table
            label="eGenes"
            columns={egenesColumns}
            rows={egeneData}
            getRowId={(row) => row.name}
            divHeight={{ maxHeight: 750 }}
            emptyTableFallback="No eGenes found"
          />
        </>
      ) : (
        <>
          <Typography variant="subtitle1">
            {" "}
            No eGenes have been identified for this SNP.
          </Typography>
          <br />
          <br />
        </>
      )}
      {deconqtlData && deconqtlData.length > 0 && (
        <>
          <Typography variant="subtitle1">
            {`The following decon-eQTLs have been identified for ${props.snp} by PsychENCODE:`}
          </Typography>
          <Table
            label="Decon-eQTLs (PsychENCODE)"
            rows={deconqtlData}
            columns={deconqtlColumns}
            getRowId={(row) => `${row.geneid}-${row.celltype}`}
            divHeight={{ maxHeight: 750 }}
            emptyTableFallback="No decon-eQTLs found"
          />
        </>
      )}
      <br />
      {qtlsigassocData && qtlsigassocData.qtlsigassocQuery.length > 0 && (
        <>
          <Typography variant="subtitle1">
            {`The following eQTLs/isoQTLs (Gandal lab) have been identified for ${props.snp} by PsychENCODE:`}
          </Typography>
          <Table
            label="eQTLs/isoQTLs (Gandal Lab)"
            columns={qtlsigColumns}
            rows={qtlsigassocData.qtlsigassocQuery.map((x) => {
              return {
                ...x,
                geneid: x.geneid.includes("ENSG")
                  ? (geneNameData &&
                      geneNameData.gene.find(
                        (g) => g.id.split(".")[0] === x.geneid
                      )?.name) ||
                    x.geneid
                  : (transcriptNameData &&
                      transcriptNameData.transcript.find(
                        (g) => g.id.split(".")[0] === x.geneid.split(".")[0]
                      )?.name) ||
                    x.geneid,
              };
            })}
            getRowId={(row) => `${row.geneid}-${row.qtltype}`}
            initialState={{
              sorting: { sortModel: [{ field: "geneid", sort: "desc" }] },
            }}
            divHeight={{ height: 750 }}
            emptyTableFallback="No eQTLs/isoQTLs found"
          />
        </>
      )}
    </>
  );
};
export default EGeneTable;
