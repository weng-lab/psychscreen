import React from "react";
import { GridProps } from "@mui/material";
import AboutUsPanel from "./AboutUsPanel";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@weng-lab/psychscreen-ui-components";
import { PORTALS } from "../../App";
import FooterPanel from "./FooterPanel";
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
      <AboutUsPanel />
     
      <FooterPanel style={{ marginTop: "160px" }} />
    </>
  );
};

export default AboutUsPage;
