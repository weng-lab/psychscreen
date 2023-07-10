/**
 * DiseaseTraitPortal.tsx: the disease/trait portal page.
 */

import React from "react";
import { AppBar } from "@weng-lab/psychscreen-ui-components";
import { useNavigate } from "react-router-dom";

const DiseaseTraitPortal: React.FC = () => {
  const navigate = useNavigate();
  return (
    <>
      <AppBar
        onDownloadsClicked={() => navigate("/psychscreen/downloads")}
        onHomepageClicked={() => navigate("/")}
        onAboutClicked={() => navigate("/psychscreen/aboutus")}
      />
    </>
  );
};
export default DiseaseTraitPortal;
