/**
 * SingleCellPortal.tsx: the single cell portal page.
 */

import React from "react";
import { AppBar } from "@weng-lab/psychscreen-ui-components";
import { useNavigate } from "react-router-dom";
import { Grid, Container, GridProps } from "@mui/material";
import { TabletAppBar } from "@weng-lab/psychscreen-ui-components";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import CheckIcon from "@mui/icons-material/Check";
import { HorizontalCard } from "@weng-lab/psychscreen-ui-components";
import { useTheme, useMediaQuery } from "@material-ui/core";
import { PORTALS } from "../../../App";
import { Logo } from "../../../mobile-portrait/HomePage/HomePage";
import SingleCell from "../../../assets/single-cell.png";

export const DISEASE_CARDS = [
  {
    val: "Dataset:scATAC-Seq-peaks",
    cardLabel: "scATAC-Seq peaks",
    cardDesc: "",
  },
  {
    val: "Dataset:Gene-regulatory-networks",
    cardLabel: "Gene regulatory networks",
    cardDesc: "",
  },
  {
    val: "Dataset:Diff-expressed-genes",
    cardLabel: "Diff. expressed genes",
    cardDesc: "",
  },
  {
    val: "Dataset:Cell-type-specific-eQTLs",
    cardLabel: "Cell type specific eQTLs",
    cardDesc: "",
  },
  {
    val: "Dataset:Indiv-cohort-expression-data",
    cardLabel: "Indiv. cohort expression data",
    cardDesc: "",
  },
];

const SingleCellPortal: React.FC<GridProps> = (props: GridProps) => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <>
      {
        //show vertical app bar only for mobile view
        useMediaQuery(theme.breakpoints.down("xs")) ? (
          <TabletAppBar
            onDownloadsClicked={() => navigate("/psychscreen/downloads")}
            onHomepageClicked={() => navigate("/")}
            onPortalClicked={(index) =>
              navigate(`/psychscreen${PORTALS[index][0]}`)
            }
            style={{ marginBottom: "63px" }}
            title={(<Logo />) as any}
          />
        ) : (
          <AppBar
            centered={true}
            onDownloadsClicked={() => navigate("/psychscreen/downloads")}
            onAboutClicked={() => navigate("/psychscreen/aboutus")}
            onHomepageClicked={() => navigate("/")}
            onPortalClicked={(index) =>
              navigate(`/psychscreen${PORTALS[index][0]}`)
            }
          />
        )
      }
      <Grid container {...props}>
        <Grid item sm={0} md={1} lg={2} xl={2}></Grid>
        <Grid item sm={8} md={6} lg={5} xl={4}>
          {useMediaQuery(theme.breakpoints.down("sm")) && (
            <Container style={{ marginTop: "130px" }}>
              <img
                alt="single cell portal"
                src={SingleCell}
                style={{ width: "70%", height: "100%" }}
              />
            </Container>
          )}
          <Container style={{ width: "741px", marginTop: "147px" }} fixed>
            <Typography
              type="display"
              size="medium"
              style={{
                fontWeight: 700,
                fontSize: "48px",
                lineHeight: "57.6px",
                letterSpacing: "0.5px",
                marginBottom: "16px",
              }}
            >
              Single-Cell Portal
            </Typography>
            <br />
            <Typography
              type="body"
              size="large"
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                fontWeight: 400,
                letterSpacing: "0.3%",
                marginBottom: "16px",
                width: "414px",
              }}
            >
              Visualize the single cell composition of the human brain based on
              single cell ATAC-seq and RNA-seq from PsychENCODE and public
              sources. Identify marker genes and b-cCREs specific to particular
              cell types and states.
            </Typography>
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
              <CheckIcon style={{ marginRight: "9px" }} />
              Transcriptomes for 1,391,772 single cells
            </Typography>
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
                marginBottom: "40px",
              }}
            >
              <CheckIcon style={{ marginRight: "9px" }} /> Chromatin
              accessibility for 1,009,942 single cells
            </Typography>
            <br />
            <br />
            {/*<GeneAutoComplete navigateto="/psychscreen/single-cell/gene/" showTitle />*/}
            <br />
          </Container>
          {1>0&&
            <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
              <HorizontalCard
                width={500}
                onCardClick={(v?: string) => {
                  v!!.includes("Dataset")
                    ? navigate(
                        `/psychscreen/single-cell/datasets/${v?.replace(
                          "Dataset:",
                          ""
                        )}`,
                        { state: { searchvalue: v?.replace("Dataset:", "") } }
                      )
                    : navigate(`/psychscreen/single-cell/${v}`, {
                        state: { searchvalue: v },
                      });
                }}
                cardContentText={DISEASE_CARDS}
              />
            </Container>
          }
        </Grid>
        {useMediaQuery(theme.breakpoints.up("md")) && (
          <Grid item sm={4} md={4} lg={3} xl={3}>
            <Container style={{ marginTop: "170px" }}>
              <img
                alt="single cell portal"
                src={SingleCell}
                style={{ width: "70%", height: "70%" }}
              />
            </Container>
          </Grid>
        )}
        <Grid item sm={0} md={1} lg={2} xl={3}></Grid>
      </Grid>
    </>
  );
};
export default SingleCellPortal;
