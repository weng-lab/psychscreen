import React from "react";
import { GridProps } from "@mui/material";
import {
  AppBar,
  HorizontalCard,
  Typography,
} from "@weng-lab/psychscreen-ui-components";
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { Grid, Container, Slide } from "@mui/material";
import FooterPanel from "../../HomePage/FooterPanel";
/*

L2.3.IT
L4.IT
L5.IT










*/
const diseaseCT = {
  ASD: [
    { val: "Astro", cardLabel: "Astrocytes", cardDesc: "" },
    //{ val: "Chandelier", cardLabel: "Chandelier", cardDesc: "" },
    { val: "Endo", cardLabel: "Endothelial cells", cardDesc: "" },
    { val: "Sncg", cardLabel: "Sncg", cardDesc: "" },
    { val: "Vip", cardLabel: "Vip", cardDesc: "" },
    { val: "Sst", cardLabel: "Sst", cardDesc: "" },
    { val: "Pvalb", cardLabel: "Pvalb", cardDesc: "" },
    { val: "Oligo", cardLabel: "Oligodendrocytes", cardDesc: "" },
    { val: "OPC", cardLabel: "Oligodendrocyte Precursor Cells", cardDesc: "" },
    { val: "Micro", cardLabel: "Microglia", cardDesc: "" },
   // { val: "Lamp5.Lhx6", cardLabel: "Lamp5.Lhx6", cardDesc: "" },
    { val: "Lamp5", cardLabel: "Lamp5", cardDesc: "" },
   // { val: "L6b", cardLabel: "L6b", cardDesc: "" },
    {
      val: "L6.IT",
      cardLabel: "Layer 6 Intratelencephalic projecting",
      cardDesc: "",
    },
    /*{
      val: "L6.IT.Car3",
      cardLabel: "Layer 6 Intratelencephalic projecting Car3",
      cardDesc: "",
    },*/
    {
      val: "L6.CT",
      cardLabel: "Layer 6 Corticothalamic projecting",
      cardDesc: "",
    },
    {
      val: "L5.IT",
      cardLabel: "Layer 5 Intratelencephalic projecting",
      cardDesc: "",
    },
    //{ val: "L5.6.NP", cardLabel: "Layer 5/6 Near projecting", cardDesc: "" },
    {
      val: "L4.IT",
      cardLabel: "Layer 4 Intratelencephalic projecting",
      cardDesc: "",
    },
    {
      val: "L2.3.IT",
      cardLabel: "Layer 2/3 Intratelencephalic projecting",
      cardDesc: "",
    },
  ],
 
  Age: [
    { val: "Astro", cardLabel: "Astrocytes", cardDesc: "" },
    { val: "Chandelier", cardLabel: "Chandelier", cardDesc: "" },
    //{ val: "Pax6", cardLabel: "Pax6", cardDesc: "" },
    { val: "Sncg", cardLabel: "Sncg", cardDesc: "" },
    { val: "Vip", cardLabel: "Vip", cardDesc: "" },
    { val: "Sst", cardLabel: "Sst", cardDesc: "" },
    { val: "Pvalb", cardLabel: "Pvalb", cardDesc: "" },
    { val: "Oligo", cardLabel: "Oligodendrocytes", cardDesc: "" },
    { val: "OPC", cardLabel: "Oligodendrocyte Precursor Cells", cardDesc: "" },
    { val: "Micro", cardLabel: "Microglia", cardDesc: "" },
    { val: "Lamp5.Lhx6", cardLabel: "Lamp5.Lhx6", cardDesc: "" },
    { val: "Lamp5", cardLabel: "Lamp5", cardDesc: "" },
    { val: "L6b", cardLabel: "L6b", cardDesc: "" },
    {
      val: "L6.IT",
      cardLabel: "Layer 6 Intratelencephalic projecting",
      cardDesc: "",
    },
    {
      val: "L6.IT.Car3",
      cardLabel: "Layer 6 Intratelencephalic projecting Car3",
      cardDesc: "",
    },
    {
      val: "L6.CT",
      cardLabel: "Layer 6 Corticothalamic projecting",
      cardDesc: "",
    },
    {
      val: "L5.IT",
      cardLabel: "Layer 5 Intratelencephalic projecting",
      cardDesc: "",
    },
    { val: "L5.6.NP", cardLabel: "Layer 5/6 Near projecting", cardDesc: "" },
    {
      val: "L4.IT",
      cardLabel: "Layer 4 Intratelencephalic projecting",
      cardDesc: "",
    },
    {
      val: "L2.3.IT",
      cardLabel: "Layer 2/3 Intratelencephalic projecting",
      cardDesc: "",
    },
  ],
  Bipolar_Disorder: [
    { val: "Astro", cardLabel: "Astrocytes", cardDesc: "" },
    { val: "Chandelier", cardLabel: "Chandelier", cardDesc: "" },
    { val: "Sncg", cardLabel: "Sncg", cardDesc: "" },
    { val: "Vip", cardLabel: "Vip", cardDesc: "" },
    { val: "Sst", cardLabel: "Sst", cardDesc: "" },
    { val: "Pvalb", cardLabel: "Pvalb", cardDesc: "" },
    { val: "Oligo", cardLabel: "Oligodendrocytes", cardDesc: "" },
    { val: "OPC", cardLabel: "Oligodendrocyte Precursor Cells", cardDesc: "" },
    { val: "Micro", cardLabel: "Microglia", cardDesc: "" },
    { val: "Lamp5.Lhx6", cardLabel: "Lamp5.Lhx6", cardDesc: "" },
    { val: "Lamp5", cardLabel: "Lamp5", cardDesc: "" },
    { val: "L6b", cardLabel: "L6b", cardDesc: "" },
    {
      val: "L6.IT",
      cardLabel: "Layer 6 Intratelencephalic projecting",
      cardDesc: "",
    },
    {
      val: "L6.IT.Car3",
      cardLabel: "Layer 6 Intratelencephalic projecting Car3",
      cardDesc: "",
    },
    {
      val: "L6.CT",
      cardLabel: "Layer 6 Corticothalamic projecting",
      cardDesc: "",
    },
    {
      val: "L5.IT",
      cardLabel: "Layer 5 Intratelencephalic projecting",
      cardDesc: "",
    },
    { val: "L5.6.NP", cardLabel: "Layer 5/6 Near projecting", cardDesc: "" },
    {
      val: "L4.IT",
      cardLabel: "Layer 4 Intratelencephalic projecting",
      cardDesc: "",
    },
    {
      val: "L2.3.IT",
      cardLabel: "Layer 2/3 Intratelencephalic projecting",
      cardDesc: "",
    },
  ],
 
  Schizophrenia: [
    { val: "Astro", cardLabel: "Astrocytes", cardDesc: "" },
    { val: "Chandelier", cardLabel: "Chandelier", cardDesc: "" },
    { val: "Sncg", cardLabel: "Sncg", cardDesc: "" },
    { val: "Vip", cardLabel: "Vip", cardDesc: "" },
    { val: "Sst", cardLabel: "Sst", cardDesc: "" },
    { val: "Pvalb", cardLabel: "Pvalb", cardDesc: "" },
    { val: "Oligo", cardLabel: "Oligodendrocytes", cardDesc: "" },
    { val: "OPC", cardLabel: "Oligodendrocyte Precursor Cells", cardDesc: "" },
    { val: "Micro", cardLabel: "Microglia", cardDesc: "" },
    { val: "Lamp5.Lhx6", cardLabel: "Lamp5.Lhx6", cardDesc: "" },
    { val: "Lamp5", cardLabel: "Lamp5", cardDesc: "" },
    { val: "L6b", cardLabel: "L6b", cardDesc: "" },
    {
      val: "L6.IT",
      cardLabel: "Layer 6 Intratelencephalic projecting",
      cardDesc: "",
    },
    {
      val: "L6.IT.Car3",
      cardLabel: "Layer 6 Intratelencephalic projecting Car3",
      cardDesc: "",
    },
    {
      val: "L6.CT",
      cardLabel: "Layer 6 Corticothalamic projecting",
      cardDesc: "",
    },
    {
      val: "L5.IT",
      cardLabel: "Layer 5 Intratelencephalic projecting",
      cardDesc: "",
    },
    { val: "L5.6.NP", cardLabel: "Layer 5/6 Near projecting", cardDesc: "" },
    {
      val: "L4.IT",
      cardLabel: "Layer 4 Intratelencephalic projecting",
      cardDesc: "",
    },
    {
      val: "L2.3.IT",
      cardLabel: "Layer 2/3 Intratelencephalic projecting",
      cardDesc: "",
    },
  ],
};

const SingleCelldegdisease: React.FC<GridProps> = (props) => {
  const navigate = useNavigate();
  const { disease } = useParams();

  return (
    <>
      <AppBar
        centered
        onDownloadsClicked={() => navigate("/psychscreen/downloads")}
        onHomepageClicked={() => navigate("/")}
        onPortalClicked={(index) =>
          navigate(`/psychscreen${PORTALS[index][0]}`)
        }
        onAboutClicked={() => navigate("/psychscreen/aboutus")}
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
              {disease}
            </Typography>
            <br />
            <Grid sm={10} md={10} lg={9} xl={9}>
              <Slide direction="up" in timeout={1000}>
                <Container style={{ marginLeft: "30px", marginTop: "10px" }}>
                  <HorizontalCard
                    width={500}
                    onCardClick={(v?: string) => {
                      navigate(
                        `/psychscreen/single-cell/datasets/Diff-expressed-genes/${disease}/${v}`,
                        { state: { searchvalue: v } }
                      );
                    }}
                    cardContentText={diseaseCT[disease!]}
                  />
                </Container>
              </Slide>
            </Grid>
          </Container>
        </Grid>
      </Grid>
      <FooterPanel style={{ marginTop: "160px" }} />

    </>
  );
};

export default SingleCelldegdisease;
