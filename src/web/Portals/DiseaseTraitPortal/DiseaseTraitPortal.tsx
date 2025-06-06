/**
 * DiseaseTraitPortal.tsx: the disease/trait portal page.
 */

import React from "react";
import { Box } from "@mui/material";
import { PortalPanel } from "../../HomePage/PortalsPanel";

const DiseaseTraitPortal: React.FC = () => {
  return (
    <Box
      mt={10}
      mb={8}
      ml={"auto"}
      mr={"auto"}
      maxWidth={{ xl: "55%", lg: "70%", md: "85%", sm: "85%", xs: "90%" }}
    >
      <PortalPanel portal="Disease" mode="search" imagePlacement={"right"} />
    </Box>
  );
};

export default DiseaseTraitPortal;
