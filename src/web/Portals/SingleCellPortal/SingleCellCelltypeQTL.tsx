import React, { useState, useEffect } from "react";
import { GridProps } from "@mui/material";
import { AppBar, Typography } from "@weng-lab/psychscreen-ui-components";
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { Grid, Container } from "@mui/material";
import { DataTable } from "@weng-lab/ts-ztable";
import FooterPanel from "../../HomePage/FooterPanel";

const COLUMNS = [
  {
    header: "Gene",
    value: (row) => row.gene,
  },
  {
    header: "Gene Chromosome",
    value: (row) => row.genechrom,
  },
  {
    header: "Gene Start",
    value: (row) => row.genestart,
  },
  {
    header: "Gene Strand",
    value: (row) => row.genestrand,
  },
  {
    header: "Number of variants in cis window ",
    value: (row) => row.numvariants,
  },
  {
    header: "Distance between variant and gene start position",
    value: (row) => row.distance,
  },
  {
    header: "Variant ID",
    value: (row) => row.variantid,
  },
  {
    header: "Variant Chromosome",
    value: (row) => row.variantchrom,
  },
  {
    header: "Variant start",
    value: (row) => row.variantstart,
  },
  {
    header: "P-value of association between variant and gene",
    value: (row) => row.pval,
  },
  {
    header: "R2 of linear regression",
    value: (row) => row.r2,
  },
  {
    header: "Beta (slope) of linear regression",
    value: (row) => row.slope,
  },
  {
    header: "Best Hit for Gene",
    value: (row) => row.besthit,
  },
];

const SingleCellCelltypeQTL: React.FC<GridProps> = (props) => {
  const navigate = useNavigate();
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
            {qtl.length === 0 && (
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
            {qtl && qtl.length > 0 && (
              <Grid sm={14} md={14} lg={14} xl={14}>
                <DataTable
                  columns={COLUMNS}
                  rows={qtl}
                  itemsPerPage={20}
                  searchable
                />
              </Grid>
            )}
          </Container>
        </Grid>
      </Grid>
      <FooterPanel style={{ marginTop: "160px" }} />

    </>
  );
};

export default SingleCellCelltypeQTL;
