import React from "react";
import { Grid, GridProps } from "@mui/material";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { useParams } from "react-router-dom";
import SingleCell, { DATASETS } from "../GenePortal/SingleCell";

const SingleCellDotPlot: React.FC<GridProps> = (props) => {
  const { disease, gene } = useParams();

  return (
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
          {
            DATASETS.get(
              disease === "DevBrain" ? "DevBrain-snRNAseq" : disease!!
            )!.desc
          }
        </Typography>
      </Grid>
      <Grid item sm={12} md={12} lg={12} xl={12} style={{ marginLeft: "15em" }}>
        {disease && gene && (
          <SingleCell
            selectDatasets={false}
            gene={gene || "APOE"}
            pedataset={disease === "DevBrain" ? "DevBrain-snRNAseq" : disease}
          />
        )}
      </Grid>
    </Grid>
  );
};

export default SingleCellDotPlot;
