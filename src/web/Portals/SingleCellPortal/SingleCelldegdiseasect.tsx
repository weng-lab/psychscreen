import React from "react";
import { GridProps } from "@mui/material";
import { AppBar, Typography } from "@weng-lab/psychscreen-ui-components";
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { Grid, Container } from "@mui/material";
import { DataTable } from "@weng-lab/ts-ztable";
import { gql, useQuery } from "@apollo/client";


const DEG_BYCT_QUERY = gql`
  query degQuery(
    $gene: String, $disease: String!,$celltype: String
  ) {
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
  const navigate = useNavigate();
  const { disease } = useParams();
  const { celltype } = useParams();
  

  const {data, loading} = useQuery(DEG_BYCT_QUERY, { variables: {
    celltype,
    disease
  }})
  console.log(data,loading)


  return (
    <>
      <AppBar
        centered
        onDownloadsClicked={() => navigate("/psychscreen/downloads")}
        onHomepageClicked={() => navigate("/")}
        onAboutClicked={() => navigate("/psychscreen/aboutus")}
        onPortalClicked={(index) =>
          navigate(`/psychscreen${PORTALS[index][0]}`)
        }
        style={{ marginBottom: "63px" }}
      />
      <Grid>
        <Grid item sm={1} md={1} lg={1.5} xl={1.5} />
        <Grid item sm={10} md={10} lg={9} xl={9}>
          <Container style={{ marginTop: "-10px", marginLeft: "100px" }}>
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
              <Grid sm={10} md={10} lg={9} xl={9}>
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
                  Loading Diff. Expressed genes for {celltype}...
                </Typography>
              </Grid>
            )}
            { data && data.degQuery.length>0 && (
              <Grid sm={10} md={10} lg={9} xl={9}>
                <DataTable
                  columns={COLUMNS}
                  rows={data.degQuery}
                  itemsPerPage={20}
                  sortDescending
                  searchable
                  sortColumn={6}
                />
              </Grid>
            )}
          </Container>
        </Grid>
      </Grid>
    </>
  );
};

export default SingleCelldegdiseasect;
