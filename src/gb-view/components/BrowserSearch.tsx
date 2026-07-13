import { Search } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";
import type { ButtonProps } from "@mui/material";
import { Box } from "@mui/system";
import { GenomeSearch, Result } from "@weng-lab/ui-components";
import { useBrowserStore } from "../stores";

const ASSEMBLY = "GRCh38";
const GENE_VERSION = [29, 40];

function SearchButton(props: ButtonProps) {
  return (
    <IconButton {...props} sx={{ color: "primary.main" }}>
      <Search />
    </IconButton>
  );
}

export default function BrowserSearch() {
  const theme = useTheme();
  const setRegion = useBrowserStore((state) => state.setRegion);

  const handleSearchSubmit = (result: Result) => {
    if (!result.domain) return;
    setRegion({
      chromosome: result.domain.chromosome,
      start: result.domain.start,
      end: result.domain.end,
    });
  };

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "auto" },
        minWidth: { md: 300 },
        maxWidth: { md: 450 },
        flex: { md: 1 },
      }}
    >
      <GenomeSearch
        size="small"
        assembly={ASSEMBLY}
        geneVersion={GENE_VERSION}
        graphqlUrl="/api/screen-graphql"
        onSearchSubmit={handleSearchSubmit}
        queries={["Gene", "SNP", "cCRE", "Coordinate"]}
        limit={3}
        sx={{ width: "100%" }}
        slots={{
          button: SearchButton,
        }}
        slotProps={{
          input: {
            label: "Change Browser Region",
            sx: {
              backgroundColor: "white",
              "& label.Mui-focused": {
                color: theme.palette.primary.main,
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: theme.palette.primary.main,
                },
              },
            },
          },
        }}
      />
    </Box>
  );
}
