import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GenomeSearch, Result } from "@weng-lab/ui-components";
import { SCREEN_GRAPHQL_PATH } from "../../../graphql/client";

export const DEFAULT_GENE_RESULTS: Result[] = ["APOE", "MBP", "PCP4"].map(
  (name) => ({
    title: name,
    type: "Gene",
  }),
);

export const GeneAutoComplete = (props) => {
  const navigate = useNavigate();

  const onSearchSubmit = (result: Result) => {
    if (!result.title) return;
    props.onSelected &&
      props.onSelected({
        name: result.title,
        chromosome: result.domain?.chromosome,
        start: result.domain?.start,
        end: result.domain?.end,
      });
    props.navigateto &&
      navigate(props.navigateto + result.title, {
        state: {
          chromosome: result.domain?.chromosome,
          start: result.domain?.start,
          end: result.domain?.end,
        },
      });
  };

  return (
    <Stack>
      {props.showTitle && (
        <Grid size={12}>
          <Typography>Search a gene of interest:</Typography>
          <br />
        </Grid>
      )}
      <GenomeSearch
        assembly="GRCh38"
        geneVersion={40}
        graphqlUrl={SCREEN_GRAPHQL_PATH}
        queries={["Gene"]}
        defaultResults={DEFAULT_GENE_RESULTS}
        onSearchSubmit={onSearchSubmit}
        size="small"
        sx={{ width: 400 }}
        slotProps={{
          box: { alignItems: "center" },
          input: {
            label: "e.g., PCP4, APOE, MBP",
          },
          button: { children: "Search", size: "medium" },
        }}
      />
    </Stack>
  );
};
