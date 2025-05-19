import React from "react";
import { PortalPanel } from "./PortalsPanel";
import Grid2 from "@mui/material/Unstable_Grid2";

const AboutUsPanel: React.FC = () => {
  return (
    <Grid2 container xs={12} mt={3}>
      <Grid2 xs={12}>
        <PortalPanel portal="About" mode="button" imagePlacement={"left"} />
      </Grid2>
    </Grid2>
  );
};
export default AboutUsPanel;
