import React, { useState } from "react";
import { CircularProgress, Grid, GridProps } from "@mui/material";
import { AppBar, Typography } from "@weng-lab/psychscreen-ui-components";
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { useQuery } from "@apollo/client";
import DotPlot from "./DotPlot";
import { StyledButton } from "../DiseaseTraitPortal/DiseaseTraitDetails";
import SingleCell, {
    DATASETS,
  GET_PEDATASET_VALS_BYCT_QUERY,
  GET_PEDATASET_VALS_BYSC_QUERY,
  PedatasetValuesbyCelltypeResponse,
  PedatasetValuesbySubclassResponse,
} from "../GenePortal/SingleCell";
import FooterPanel from "../../HomePage/FooterPanel";

const SingleCellDotPlot: React.FC<GridProps> = (props) => {
  const navigate = useNavigate();
  const { disease, gene } = useParams();
 
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
      <Grid container>
      <Grid
        item
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{ marginBottom: "2em" }}
      >
        <Typography
          style={{ marginLeft: "15em", marginTop: "0.1em" }}
          type="body"
          size="large"
        >
          {DATASETS.get(disease === "DevBrain" ? "DevBrain-snRNAseq" : disease!!)!.desc}
        </Typography>
      </Grid>
        <Grid
          item
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ marginLeft: "15em" }}
        >
          {disease && gene && (
           <SingleCell selectDatasets={false} gene={gene || "APOE"} pedataset={ disease === "DevBrain" ? "DevBrain-snRNAseq" : disease} />
          )}
        </Grid>
      </Grid>
      <FooterPanel style={{ marginTop: "160px" }} />

    </>
  );
};

export default SingleCellDotPlot;
