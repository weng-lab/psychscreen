import React from "react";
import { PortalPanel } from "./PortalsPanel";
import logo from "../../assets/umass.png"
import Grid2 from "@mui/material/Unstable_Grid2";

const AboutUsPanel: React.FC = () => {
  return (
    <Grid2 container xs={12} mt={3}>
      <Grid2 xs={12}>
        <PortalPanel
          title={"About Us"}
          description={`
            PsychSCREEN is a comprehensive catalog of genetic and epigenetic
            knowledge about the human brain. It was designed and built by Dr.
            Zhiping Weng's lab in collaboration with the Moore Lab and Colubri Lab 
            at UMass Chan Medical School as a product of the PsychENCODE Consortium.
          `}
          buttonText={"Learn More"}
          buttonLink={"/psychscreen/aboutus"}
          imageSRC={logo}
          imagePlacement={"left"}
          imgAltText={"UMass Chan Medical School Logo"}
        />
      </Grid2>
    </Grid2>
  )
};
export default AboutUsPanel;
