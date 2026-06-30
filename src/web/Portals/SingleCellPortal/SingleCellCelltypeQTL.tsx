import React, { useState, useEffect } from "react";
import { Typography } from "@mui/material";

import { useParams } from "react-router-dom";
import Grid, { GridProps } from "@mui/material/Grid";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { GridSortModel } from "@mui/x-data-grid-premium";

type CelltypeQtlRow = {
  gene: string;
  genechrom: string;
  genestart: string;
  genestrand: string;
  numvariants: string;
  distance: string;
  variantid: string;
  variantchrom: string;
  variantstart: string;
  pval: string;
  r2: string;
  slope: string;
  besthit: string;
};

const columns: TableColDef<CelltypeQtlRow>[] = [
  { field: "gene", headerName: "Gene" },
  { field: "genechrom", headerName: "Gene Chromosome" },
  { field: "genestart", headerName: "Gene Start" },
  { field: "genestrand", headerName: "Gene Strand" },
  { field: "numvariants", headerName: "Number of variants in cis window " },
  { field: "distance", headerName: "Distance between variant and gene start position" },
  { field: "variantid", headerName: "Variant ID" },
  { field: "variantchrom", headerName: "Variant Chromosome" },
  { field: "variantstart", headerName: "Variant start" },
  { field: "pval", headerName: "P-value of association between variant and gene" },
  { field: "r2", headerName: "R2 of linear regression" },
  { field: "slope", headerName: "Beta (slope) of linear regression" },
  { field: "besthit", headerName: "Best Hit for Gene" },
];

const initialSort: GridSortModel = [{ field: "gene", sort: "desc" }];

const SingleCellCelltypeQTL: React.FC<GridProps> = (props) => {
  const { celltype } = useParams();
  const [qtl, setQtl] = useState<any>([]);

  useEffect(() => {
    fetch(`https://downloads.wenglab.org/${celltype}_sig_QTLs.dat`)
      .then((x) => x.text())
      .then((x: string) => {
        const q = x.split("\n");
        const r = q
          .filter((x) => x !== "")
          .map((d) => {
            const val = d.split(" ");
            return {
              gene: val[0],
              genechrom: val[1],
              genestart: val[2],
              genestrand: val[4],
              numvariants: val[5],
              distance: val[6],
              variantid: val[7],
              variantchrom: val[8],
              variantstart: val[9],
              pval: val[11],
              r2: val[12],
              slope: val[13],
              besthit: val[14],
            };
          });
        setQtl(r);
      });
  }, [celltype]);

  return (
    <Grid
      container
      mt={6}
      mb={8}
      ml={"auto"}
      mr={"auto"}
      maxWidth={{ xl: "95%", lg: "90%", md: "95%", sm: "95%", xs: "95%" }}
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
        {qtl.length === 0 && (
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
        )}
        {qtl && qtl.length > 0 && (
          <Table
            columns={columns}
            rows={qtl}
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

export default SingleCellCelltypeQTL;
