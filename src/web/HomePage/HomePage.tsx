/**
 * HomePage.tsx: the app home page.
 */

import React from "react";
import MainPanel from "./MainPanel";
import PortalsPanel from "./PortalsPanel";
import AboutUsPanel from "./AboutUsPanel";
import Grid2 from "@mui/material/Unstable_Grid2";

const HomePage: React.FC = () => {
  return (
    <Grid2 container mt={10} mb={8} ml={"auto"} mr={"auto"} maxWidth={{ xl: "60%", lg: "75%", md: "85%", sm: "90%", xs: "90%" }}>
      <MainPanel />
      <PortalsPanel />
      <AboutUsPanel />
    </Grid2>
  );
};
export default HomePage;
