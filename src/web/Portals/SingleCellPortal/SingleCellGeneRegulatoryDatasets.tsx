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
    header: "TF",
    value: (row) => row.TF,
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
    value: (row) => row.TG,
  },
  {
    header: "CRE",
    value: (row) => row.CRE,
  },
];

const SingleCellGeneRegulatoryDatasets: React.FC<GridProps> = (props) => {
  const navigate = useNavigate();
  const { celltype } = useParams();
  const [grn, setGrn] = useState<any>([]);

  useEffect(() => {
    fetch(`https://downloads.wenglab.org/${celltype}.json`)
      .then((x) => x.json())
      .then(setGrn);
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

export default SingleCellGeneRegulatoryDatasets;
