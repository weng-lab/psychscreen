import React from "react";
import { GridProps } from "@mui/material";
import AboutUsPanel from "./AboutUsPanel";
import Grid2 from "@mui/material/Unstable_Grid2";

const AboutUsPage: React.FC<GridProps> = (props) => {
  return (
    <Grid2 container pt={3} maxWidth={{ xl: "60%", lg: "75%", md: "85%", sm: "90%", xs: "95%" }} margin={"auto"}>
      <AboutUsPanel />
    </Grid2>
  );
};

export default AboutUsPage;
