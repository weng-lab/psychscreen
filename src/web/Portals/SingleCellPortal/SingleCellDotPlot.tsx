import React from "react";
import { Typography } from "@mui/material";
import Grid, { GridProps } from "@mui/material/Grid";

import { useParams } from "react-router-dom";
import SingleCell, { DATASETS } from "../GenePortal/SingleCell";

const SingleCellDotPlot: React.FC<GridProps> = (props) => {
  const { disease, gene } = useParams();

  return (
    <Grid container>
      <Grid
        size={12}
        style={{ marginBottom: "2em" }}
      >
        <Typography variant="body1"
          style={{ marginLeft: "15em", marginTop: "0.1em" }}
        >
          {
            DATASETS.get(
              disease === "DevBrain" ? "DevBrain-snRNAseq" : disease!!
            )!.desc
          }
        </Typography>
      </Grid>
      <Grid size={12} style={{ marginLeft: "15em" }}>
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
