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
    <Grid {...props}>
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
          {grn.length === 0 && (
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
                Loading Gene Regulatory Networks data for {celltype}...
              </Typography>
            </Grid>
          )}
          {grn && grn.length > 0 && (
            <Grid sm={10} md={10} lg={9} xl={9}>
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
