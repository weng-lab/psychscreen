/**
 * HomePage.tsx: the app home page.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@weng-lab/psychscreen-ui-components";

import { PORTALS } from "../../App";
import MainPanel from "./MainPanel";
import PortalsPanel from "./PortalsPanel";
import AboutUsPanel from "./AboutUsPanel";
import FooterPanel from "./FooterPanel";
import Grid2 from "@mui/material/Unstable_Grid2";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <AppBar
        onDownloadsClicked={() => navigate("/psychscreen/downloads")}
        onHomepageClicked={() => navigate("/")}
        onPortalClicked={(index) =>
          navigate(`/psychscreen${PORTALS[index][0]}`)
        }
        style={{ marginBottom: "63px" }}
        centered={true}
        onAboutClicked={() => navigate("/psychscreen/aboutus")}
      />
      <MainPanel />
      <Grid2 container pt={3} maxWidth={{ xl: "60%", lg: "75%", md: "85%", sm: "90%", xs: "95%" }} margin={"auto"}>
        <PortalsPanel />
        <AboutUsPanel />
      </Grid2>
      <FooterPanel style={{ marginTop: "160px" }} />
    </>
  );
};
export default HomePage;
