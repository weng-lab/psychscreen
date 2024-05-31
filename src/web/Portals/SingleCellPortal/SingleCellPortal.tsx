/**
 * SingleCellPortal.tsx: the single cell portal page.
 */

import React from "react";
import { Box } from "@mui/material";
import { PortalPanel } from "../../HomePage/PortalsPanel";

const SingleCellPortal: React.FC = () => {
  return (
    <Box mt={10} mb={8} ml={"auto"} mr={"auto"} maxWidth={{ xl: "55%", lg: "70%", md: "85%", sm: "85%", xs: "90%" }}>
      <PortalPanel
        portal="SingleCell"
        mode="search"
        imagePlacement={"right"}
      />
    </Box>
  )
};
export default SingleCellPortal;
