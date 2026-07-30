import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GenomeSearch, Result } from "@weng-lab/ui-components";
import { SCREEN_GRAPHQL_PATH } from "../../../graphql/client";

export const DEFAULT_SNP_RESULTS: Result[] = ["rs11669173", "rs7690700"].map(
  (id) => ({
    title: id,
    type: "SNP",
  }),
);

export const SnpAutoComplete = (props) => {
  const navigate = useNavigate();

  const onSearchSubmit = (result: Result) => {
    if (!result.title) return;
    props.onSelected &&
      props.onSelected({
        snpid: result.title,
        chromosome: result.domain?.chromosome,
        start: result.domain?.start,
        end: result.domain?.end,
      });
    props.navigateto &&
      navigate(props.navigateto + result.title, {
        state: {
          snpid: result.title,
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
          <Typography>Search a SNP of interest:</Typography>
          <br />
        </Grid>
      )}
      <GenomeSearch
        assembly="GRCh38"
        graphqlUrl={SCREEN_GRAPHQL_PATH}
        queries={["SNP"]}
        defaultResults={DEFAULT_SNP_RESULTS}
        onSearchSubmit={onSearchSubmit}
        size="small"
        sx={{ width: 400 }}
        slotProps={{
          box: { alignItems: "center" },
          input: {
            label: "e.g. rs11669173",
          },
          button: { children: "Search", size: "medium" },
        }}
      />
    </Stack>
  );
};
