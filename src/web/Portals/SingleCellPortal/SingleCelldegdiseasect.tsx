import React from "react";
import { Typography } from "@mui/material";

import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import Grid, { GridProps } from "@mui/material/Grid";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";
import { gql, useQuery } from "@apollo/client";

const DEG_BYCT_QUERY = gql`
  query degQuery($gene: String, $disease: String!, $celltype: String) {
    degQuery(gene: $gene, disease: $disease, celltype: $celltype) {
      padj
      base_mean
      lfc_se
      stat
      pvalue
      gene
      celltype
      log2_fc
    }
  }
`;

type DegRow = {
  gene: string;
  base_mean: number;
  log2_fc: number;
  lfc_se: number;
  stat: number;
  pvalue: number;
  padj: number;
};

const columns: TableColDef<DegRow>[] = [
  { field: "gene", headerName: "Gene" },
  {
    field: "base_mean",
    headerName: "Base mean",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "log2_fc",
    headerName: "log2(fc)",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "lfc_se",
    headerName: "Std Error",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "stat",
    headerName: "Stat",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "pvalue",
    headerName: "Pvalue",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "padj",
    headerName: "Ajdusted-P",
    type: "number",
    valueFormatter: (value: number) => value.toExponential(2),
  },
];

const initialSort: GridSortModel = [{ field: "padj", sort: "desc" }];

const SingleCelldegdiseasect: React.FC<GridProps> = (props) => {
  const { disease } = useParams();
  const { celltype } = useParams();

  const { data, loading } = useQuery(DEG_BYCT_QUERY, {
    variables: {
      celltype,
      disease,
    },
  });

  return (
    <Grid
      container
      spacing={3}
      mt={6}
      mb={8}
      ml={"auto"}
      mr={"auto"}
      maxWidth={{ xl: "65%", lg: "75%", md: "85%", sm: "90%", xs: "90%" }}
    >
      <Grid size={12}>
        <Typography variant="h2"
          style={{
            fontWeight: 700,
            fontSize: "36px",
            lineHeight: "57.6px",
            letterSpacing: "0.5px",
            marginBottom: "16px",
          }}
        >
          {celltype}
        </Typography>
        <br />
        {!data && (
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
            Loading Differential Gene Expression for {celltype}...
          </Typography>
        )}
        {data && data.degQuery.length > 0 && (
          <Table
            columns={columns}
            rows={data.degQuery}
            initialState={{
              sorting: { sortModel: initialSort },
              pagination: { paginationModel: { pageSize: 20 } },
            }}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default SingleCelldegdiseasect;
