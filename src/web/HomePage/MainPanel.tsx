import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import BoltIcon from "@mui/icons-material/Bolt";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";

import { useNavigate } from "react-router-dom";
import { GenomeSearch, Result } from "@weng-lab/ui-components";
import { SCREEN_GRAPHQL_PATH } from "../../graphql/client";
import {
  DISEASE_OPTIONS,
  DEFAULT_DISEASE_RESULTS,
} from "../Portals/DiseaseTraitPortal/DiseaseTraitAutoComplete";
import { DISEASE_CARDS } from "../Portals/DiseaseTraitPortal/config/constants";
import {
  CELLTYPE_OPTIONS,
  DEFAULT_CELLTYPE_RESULTS,
} from "../Portals/SingleCellPortal/CelltypeAutoComplete";
import { DEFAULT_GENE_RESULTS } from "../Portals/GenePortal/GeneAutocomplete";
import { DEFAULT_SNP_RESULTS } from "../Portals/SnpPortal/SnpAutoComplete";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const DEFAULT_SEARCH_RESULTS: Result[] = [
  ...DEFAULT_DISEASE_RESULTS,
  ...DEFAULT_GENE_RESULTS,
  ...DEFAULT_SNP_RESULTS,
  ...DEFAULT_CELLTYPE_RESULTS,
];

const MainPanel: React.FC = () => {
  const navigate = useNavigate();

  const onSearchSubmit = (result: Result) => {
    switch (result.type) {
      case "Gene":
        navigate("/gene/" + result.title, {
          state: {
            chromosome: result.domain?.chromosome,
            start: result.domain?.start,
            end: result.domain?.end,
          },
        });
        break;
      case "SNP":
        navigate("/snp/" + result.title, {
          state: {
            snpid: result.title,
            chromosome: result.domain?.chromosome,
            start: result.domain?.start,
            end: result.domain?.end,
          },
        });
        break;
      case "Disease": {
        const trait = DISEASE_CARDS.find((d) => d.val === result.id);
        navigate("/traits/" + result.id, {
          state: { searchvalue: result.id, diseaseDesc: trait?.diseaseDesc },
        });
        break;
      }
      case "CellType":
        navigate("/single-cell/celltype/" + result.id, {
          state: { searchvalue: result.id },
        });
        break;
    }
  };

  const theme = useTheme();
  const betweenSmLg = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  /**
   * xs, extra-small: 0px
   * sm, small: 600px
   * md, medium: 900px
   * lg, large: 1200px
   * xl, extra-large: 1536px
   */

  return (
    <div>
      <Grid
        container
        size={12}
        justifyContent={"space-between"}
        spacing={3}
        mb={4}
      >
        <Grid display={betweenSmLg ? "block" : "none"}>
          <Typography variant="h2"
            style={{
              fontWeight: 700,
              fontSize: "44px",
              lineHeight: "54px",
              letterSpacing: "0.5px",
            }}
          >
            Explore the genetics and epigenetics of human brain development,
            function, and pathophysiology.
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }} order={{ xs: 2, sm: 1 }} alignSelf={"flex-start"}>
          <Stack spacing={3} alignItems={"flex-start"}>
            {!betweenSmLg && (
              <Typography variant="h2"
                style={{
                  fontWeight: 700,
                  fontSize: "44px",
                  lineHeight: "54px",
                  letterSpacing: "0.5px",
                }}
              >
                Explore the genetics and epigenetics of human brain development,
                function, and pathophysiology.
              </Typography>
            )}
            <div>
              <Typography variant="body1"
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
              <Typography variant="body1"
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
            <Typography variant="body1" >
              Search a gene, SNP, disease/trait, or cell type:
            </Typography>
            <GenomeSearch
              assembly="GRCh38"
              geneVersion={40}
              graphqlUrl={SCREEN_GRAPHQL_PATH}
              queries={["Gene", "SNP"]}
              staticLists={{ Disease: DISEASE_OPTIONS, CellType: CELLTYPE_OPTIONS }}
              defaultResults={DEFAULT_SEARCH_RESULTS}
              onSearchSubmit={onSearchSubmit}
              size="small"
              sx={{ width: 400 }}
              slotProps={{
                box: { alignItems: "center" },
                input: {
                  label: "e.g., APOE, rs2836883, Schizophrenia, Astrocytes",
                },
                button: { children: "Search", size: "medium" },
              }}
            />
          </Stack>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 6 }}
          order={{ xs: 1, sm: 2 }}
          minHeight={250}
          display={{ xs: "none", sm: "inherit" }} //hide on mobile,
        >
          <Box
            position={"relative"}
            height={"100%"}
            width={"100%"}
            sx={{
              objectPosition: {
                lg: "right center",
                md: "center center",
                xs: "right center",
              },
            }}
          >
            <img
              style={{
                objectFit: "contain",
                objectPosition: "inherit",
                position: "absolute",
              }}
              height={"100%"}
              width={"100%"}
              src="/brain.png"
              alt={"psychSCREEN Brain"}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};
export default MainPanel;
