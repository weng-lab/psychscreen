import React from "react";
import { GridProps } from "@mui/material";
import AboutUsPanel from "./AboutUsPanel";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@weng-lab/psychscreen-ui-components";
import { PORTALS } from "../../App";
import FooterPanel from "./FooterPanel";
import Grid2 from "@mui/material/Unstable_Grid2";
const AboutUsPage: React.FC<GridProps> = (props) => {
  const navigate = useNavigate();
  return (
    <>
      <AppBar
        onDownloadsClicked={() => navigate("/psychscreen/downloads")}
        onHomepageClicked={() => navigate("/")}
        onAboutClicked={() => navigate("/psychscreen/aboutus")}
        onPortalClicked={(index) =>
          navigate(`/psychscreen${PORTALS[index][0]}`)
        }
        style={{ marginBottom: "183px" }}
        centered={true}
      />
      <Grid2 container pt={3} maxWidth={{ xl: "60%", lg: "75%", md: "85%", sm: "90%", xs: "95%" }} margin={"auto"}>
        <AboutUsPanel />
      </Grid2>
      <FooterPanel style={{ marginTop: "160px" }} />
    </>
  );
};

export default AboutUsPage;
