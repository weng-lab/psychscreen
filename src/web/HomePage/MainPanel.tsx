import React, { useState } from "react";
import { Box, Stack } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import BRAIN from "../../assets/brain.png";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { GeneAutoComplete } from "../Portals/GenePortal/GeneAutocomplete";
import { DiseaseTraitAutoComplete } from "../Portals/DiseaseTraitPortal/DiseaseTraitAutoComplete";
import { SnpAutoComplete } from "../Portals/SnpPortal/SnpAutoComplete";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2"
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const MainPanel: React.FC = () => {
  const [selectedPortal, setSelectedPortal] = useState<string>("Disease/Trait");
  const handleChange = (event: SelectChangeEvent) => {
    setSelectedPortal(event.target.value);
  };

  const theme = useTheme();
  const betweenSmLg = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  
  /**
   * xs, extra-small: 0px
   * sm, small: 600px
   * md, medium: 900px
   * lg, large: 1200px
   * xl, extra-large: 1536px
   */


  return (
    <div>
      <Grid2 container xs={12} justifyContent={"space-between"} spacing={3} mb={4}>
        <Grid2 display={betweenSmLg ? "block" : "none"}>
          <Typography
            type="display"
            size="medium"
            style={{
              fontWeight: 700,
              fontSize: "44px",
              lineHeight: "54px",
              letterSpacing: "0.5px",
            }}
          >
            Explore the genetics and epigenetics of human brain development, function, and pathophysiology.
          </Typography>
        </Grid2>
        <Grid2 xs={12} sm={6} order={{ xs: 2, sm: 1 }} alignSelf={"flex-start"}>
          <Stack spacing={3} alignItems={"flex-start"}>
          {!betweenSmLg && <Typography
            type="display"
            size="medium"
            style={{
              fontWeight: 700,
              fontSize: "44px",
              lineHeight: "54px",
              letterSpacing: "0.5px",
            }}
          >
            Explore the genetics and epigenetics of human brain development, function, and pathophysiology.
          </Typography>}
          <div>
            <Typography
            type="body"
            size="large"
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "19px",
            }}
          >
            <BoltIcon style={{ marginRight: "9px" }} />
            Powered by the PsychENCODE Consortium
          </Typography>
          <Typography
            type="body"
            size="large"
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "19px",
            }}
          >
            <AccessibilityNewIcon style={{ marginRight: "9px" }} />
            Accessible to all
          </Typography>
          </div>
          <FormControl variant="standard">
            <Select
              value={selectedPortal}
              onChange={handleChange}
            >
              <MenuItem value={"Disease/Trait"}>Disease/Trait</MenuItem>
              <MenuItem value={"Gene/b-cCRE"}>Gene/b-cCRE</MenuItem>
              <MenuItem value={"SNP/QTL"}>SNP/QTL</MenuItem>
            </Select>
          </FormControl>
          {selectedPortal === "Disease/Trait" ? (
            <DiseaseTraitAutoComplete navigateto="/psychscreen/traits/" />
          ) : selectedPortal === "Gene/b-cCRE" ? (
            <GeneAutoComplete navigateto="/psychscreen/gene/" />
          ) : (
            <SnpAutoComplete navigateto="/psychscreen/snp/" />
          )}
          </Stack>
        </Grid2>
        <Grid2 xs={12} sm={6} 
          order={{ xs: 1, sm: 2 }}
          minHeight={250}
          display={{xs: 'none', sm: 'inherit'}} //hide on mobile,
        >
          <Box 
            position={"relative"} 
            height={"100%"} 
            width={'100%'} 
            sx={{ 
              objectPosition: { lg: 'right center',  md: "center center", xs: "right center" }
            }}>
            <img
              style={{ 
                objectFit: "contain", 
                objectPosition: "inherit",
                position: "absolute",
              }}
              height={"100%"}
              width={"100%"}
              src={BRAIN}
              alt={"psychSCREEN Brain"}
            />
          </Box>
        </Grid2>
      </Grid2>
    </div>
       
  );
};
export default MainPanel;
