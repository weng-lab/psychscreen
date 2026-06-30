import React, { useState } from "react";
import { Typography } from "@mui/material";

import { useParams } from "react-router-dom";
import { Container } from "@mui/material";
import Grid, { GridProps } from "@mui/material/Grid";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";

type GeneRegulatoryRow = {
  tf: string;
  enhancer: string;
  promoter: string;
  tg: string;
  edgeweight: number;
  method: string;
  correlation: number;
  regulation: string;
};

const columns: TableColDef<GeneRegulatoryRow>[] = [
  { field: "tf", headerName: "TF" },
  { field: "enhancer", headerName: "Enhancer" },
  { field: "promoter", headerName: "Promoter" },
  { field: "tg", headerName: "TG" },
  {
    field: "edgeweight",
    headerName: "Edge Weight",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  { field: "method", headerName: "Method" },
  {
    field: "correlation",
    headerName: "Correlation",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  { field: "regulation", headerName: "Regulation" },
];

const initialSort: GridSortModel = [{ field: "tg", sort: "desc" }];

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
      <Grid size={12}>
        <Container>
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
          {grn.length === 0 && (
            <Grid size={12}>
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
                Loading Gene Regulatory Networks data for {celltype}...
              </Typography>
            </Grid>
          )}
          {grn && grn.length > 0 && (
            <Grid size={12}>
              <Table
                columns={columns}
                rows={grn}
                initialState={{
                  sorting: { sortModel: initialSort },
                  pagination: { paginationModel: { pageSize: 20 } },
                }}
              />
            </Grid>
          )}
        </Container>
      </Grid>
    </Grid>
  );
};

export default SingleCellGeneRegulatoryDatasets;
