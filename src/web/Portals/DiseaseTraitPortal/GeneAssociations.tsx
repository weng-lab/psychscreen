import React, { useMemo } from "react";
import { Container, CircularProgress, Typography } from "@mui/material";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { GridProps } from "@mui/material/Grid";

type GeneAssociation = {
  hsq: number;
  twas_p: number;
  twas_bonferroni: number;
  dge_log2fc: number;
  gene_id: string;
  gene_name: string;
  dge_fdr: number;
};

export type GeneAssociationsProps = GridProps & {
  disease: string;
  data: GeneAssociation[];
};

const formatEntry: TableColDef<GeneAssociation>[] = [
  { field: "gene_id", headerName: "Gene ID" },
  {
    field: "gene_name",
    headerName: "Gene Name",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/gene/${params.value}`}
        style={{ color: "#0000EE" }}
      >
        <i>{params.value}</i>
      </a>
    ),
  },
  {
    field: "hsq",
    headerName: "Hsq",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "twas_p",
    headerName: "P",
    type: "number",
    renderHeader: () => (
      <Typography>
        <i>P</i>
      </Typography>
    ),
    valueFormatter: (value: number) =>
      value < 0.01 ? value.toExponential(2) : value.toFixed(2),
  },
  {
    field: "twas_bonferroni",
    headerName: "Q",
    type: "number",
    renderHeader: () => (
      <Typography>
        <i>Q</i>
      </Typography>
    ),
    valueFormatter: (value: number) =>
      value < 0.01 ? value.toExponential(2) : value.toFixed(2),
  },
  {
    field: "dge_fdr",
    headerName: "FDR",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "dge_log2fc",
    headerName: "log2(fold change)",
    type: "number",
    renderHeader: () => (
      <Typography>
        Log<sub>2</sub>(fold change)
      </Typography>
    ),
    valueFormatter: (value: number) => value.toFixed(2),
  },
];

const GeneAssociations: React.FC<GeneAssociationsProps> = (props) => {
  const tabledata = useMemo(
    () =>
      props.data &&
      [...props.data].sort((a, b) => a.twas_bonferroni - b.twas_bonferroni),
    [props.data]
  );

  return props.data && tabledata ? (
    <Table
      label="Gene Associations"
      columns={formatEntry}
      rows={tabledata}
      getRowId={(row) => row.gene_id}
      initialState={{
        pagination: { paginationModel: { pageSize: 10 } },
      }}
      divHeight={{ maxHeight: 750 }}
      emptyTableFallback="No gene associations found"
    />
  ) : (
    <CircularProgress color="inherit" />
  );
};
export default GeneAssociations;
