import React from "react";
import { PortalPanel } from "./PortalsPanel";
import Grid from "@mui/material/Grid";

const AboutUsPanel: React.FC = () => {
  return (
    <Grid container size={12} mt={3}>
      <Grid size={12}>
        <PortalPanel portal="About" mode="button" imagePlacement={"left"} />
      </Grid>
    </Grid>
  );
};
export default AboutUsPanel;
