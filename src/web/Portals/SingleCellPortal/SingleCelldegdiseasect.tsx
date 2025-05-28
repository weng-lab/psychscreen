import React from "react";
import { GridProps } from "@mui/material";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { useParams } from "react-router-dom";
import { Grid, Container } from "@mui/material";
import { DataTable } from "@weng-lab/ts-ztable";
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
const COLUMNS = [
  {
    header: "Gene",
    value: (row) => row.gene,
    HeaderRender: (row) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/psychscreen/gene/${row.name}`}
      >
        <i>{row.name}</i>
      </a>
    ),
  },
  {
    header: "Base mean",
    value: (row) => row.base_mean.toFixed(2),
  },
  {
    header: "log2(fc)",
    value: (row) => row.log2_fc.toFixed(2),
  },
  {
    header: "Std Error",
    value: (row) => row.lfc_se.toFixed(2),
  },
  {
    header: "Stat",
    value: (row) => row.stat.toFixed(2),
  },
  {
    header: "Pvalue",
    value: (row) => row.pvalue.toFixed(2),
  },
  {
    header: "Ajdusted-P",
    value: (row) => row.padj.toExponential(2),
  },
];

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
      <Grid item xs={12}>
        <Typography
          type="display"
          size="medium"
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
            Loading Differential Gene Expression for {celltype}...
          </Typography>
        )}
        {data && data.degQuery.length > 0 && (
          <DataTable
            columns={COLUMNS}
            rows={data.degQuery}
            itemsPerPage={20}
            sortDescending
            searchable
            sortColumn={6}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default SingleCelldegdiseasect;
