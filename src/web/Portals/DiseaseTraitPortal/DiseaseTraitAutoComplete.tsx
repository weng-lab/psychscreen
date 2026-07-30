import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GenomeSearch, Result, StaticListOption } from "@weng-lab/ui-components";
import { DISEASE_CARDS } from "./config/constants";
import { SCREEN_GRAPHQL_PATH } from "../../../graphql/client";

export const DISEASE_OPTIONS: StaticListOption[] = DISEASE_CARDS.map((d) => ({
  label: d.cardLabel,
  value: d.val,
  description: d.cardDesc,
  keywords: d.aliases,
}));

export const DEFAULT_DISEASE_RESULTS: Result[] = DISEASE_OPTIONS.filter((o) =>
  ["Schizophrenia", "Insomnia"].includes(o.label),
).map((o) => ({
  title: o.label,
  description: o.description,
  type: "Disease",
  id: o.value,
}));

export const DiseaseTraitAutoComplete = (props) => {
  const navigate = useNavigate();

  const onSearchSubmit = (result: Result) => {
    if (!result.id) return;
    const trait = DISEASE_CARDS.find((d) => d.val === result.id);
    navigate(props.navigateto + result.id, {
      state: {
        searchvalue: result.id,
        diseaseDesc: trait?.diseaseDesc,
      },
    });
  };

  return (
    <Stack>
      {props.showTitle && (
        <Grid size={12}>
          <Typography>Search a trait of interest:</Typography>
          <br />
        </Grid>
      )}
      <GenomeSearch
        assembly="GRCh38"
        graphqlUrl={SCREEN_GRAPHQL_PATH}
        queries={[]}
        staticLists={{ Disease: DISEASE_OPTIONS }}
        limit={10}
        defaultResults={DEFAULT_DISEASE_RESULTS}
        onSearchSubmit={onSearchSubmit}
        size="small"
        sx={{ width: 400 }}
        slotProps={{
          box: { alignItems: "center" },
          input: {
            label: "e.g., Schizophrenia, Insomnia",
          },
          button: { children: "Search", size: "medium" },
        }}
      />
    </Stack>
  );
};
