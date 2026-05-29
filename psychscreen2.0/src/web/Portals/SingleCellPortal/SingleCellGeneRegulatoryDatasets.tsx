import React, { useState } from "react";
import { GridProps } from "@mui/material";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { useParams } from "react-router-dom";
import { Grid, Container } from "@mui/material";
import { DataTable } from "@weng-lab/ts-ztable";

const COLUMNS = [
  {
    header: "TF",
    value: (row) => row.tf,
  },
  {
    header: "Enhancer",
    value: (row) => row.enhancer,
  },
  {
    header: "Promoter",
    value: (row) => row.promoter,
  },
  {
    header: "TG",
    value: (row) => row.tg,
  },
  {
    header: "Edge Weight",
    value: (row) => row.edgeweight.toFixed(2),
  },
  {
    header: "Method",
    value: (row) => row.method,
  },
  {
    header: "Correlation",
    value: (row) => row.correlation.toFixed(2),
  },
  {
    header: "Regulation",
    value: (row) => row.regulation,
  },
];

const SingleCellGeneRegulatoryDatasets: React.FC<GridProps> = (props) => {
  const { celltype } = useParams();
  const [grn, setGrn] = useState<any>([]);
  //  const [grnNew, setGrnNew] = useState<any>([]);

  React.useEffect(() => {
    fetch(`https://downloads.wenglab.org/${celltype}_GRN.txt`)
      .then((x) => x.text())
      .then((x: string) => {
        const q = x.split("\n");
        const bcres = q
          .filter((a) => !a.includes("edgeWeight"))
          .filter((x) => x !== "")
          .map((a) => {
            let r = a.split("\t");

            return {
              //TF      enhancer        promoter        TG      edgeWeight      method  celltype        Correlation     Regulation
              tf: r[0],
              enhancer: r[1],
              promoter: r[2],
              tg: r[3],
              edgeweight: +r[4],
              method: r[5],

              correlation: +r[7],
              regulation: r[8],
            };
          });
        setGrn(bcres);
      });
  }, [celltype]);
  /*useEffect(() => {
    fetch(`https://downloads.wenglab.org/${celltype}.json`)
      .then((x) => x.json())
      .then(setGrn);
  }, [celltype]);*/

  return (
    <Grid
      container
      mt={6}
      mb={8}
      ml={"auto"}
      mr={"auto"}
      maxWidth={{ xl: "65%", lg: "75%", md: "85%", sm: "90%", xs: "90%" }}
    >
      <Grid item xs={12}>
        <Container>
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
          {grn.length === 0 && (
            <Grid xs={12}>
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
                Loading Gene Regulatory Networks data for {celltype}...
              </Typography>
            </Grid>
          )}
          {grn && grn.length > 0 && (
            <Grid xs={12}>
              <DataTable
                columns={COLUMNS}
                rows={grn}
                itemsPerPage={20}
                searchable
                sortColumn={3}
              />
            </Grid>
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

export default SingleCellGeneRegulatoryDatasets;
