import * as React from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { GenomeSearch, Result, StaticListOption } from "@weng-lab/ui-components";
import { CELLTYPE_CARDS } from "./consts";
import { SCREEN_GRAPHQL_PATH } from "../../../graphql/client";

export const CELLTYPE_OPTIONS: StaticListOption[] = CELLTYPE_CARDS.map((d) => ({
  label: d.cardLabel,
  value: d.cardLabel,
  description: d.cardDesc,
}));

export const DEFAULT_CELLTYPE_RESULTS: Result[] = CELLTYPE_OPTIONS.map((o) => ({
  title: o.label,
  description: o.description,
  type: "CellType",
  id: o.value,
}));

export const CelltypeAutoComplete = (props) => {
  const navigate = useNavigate();

  const onSearchSubmit = (result: Result) => {
    if (!result.id) return;
    navigate(props.navigateto + result.id, {
      state: { searchvalue: result.id },
    });
  };

  return (
    <Stack>
      {props.showTitle && (
        <Grid size={12}>
          <Typography>Search a cell type of interest:</Typography>
          <br />
        </Grid>
      )}
      <GenomeSearch
        assembly="GRCh38"
        graphqlUrl={SCREEN_GRAPHQL_PATH}
        queries={[]}
        staticLists={{ CellType: CELLTYPE_OPTIONS }}
        limit={10}
        defaultResults={DEFAULT_CELLTYPE_RESULTS}
        onSearchSubmit={onSearchSubmit}
        size="small"
        sx={{ width: 400 }}
        slotProps={{
          box: { alignItems: "center" },
          input: {
            label: "e.g., Astrocytes, Chandelier",
          },
          button: { children: "Search", size: "medium" },
        }}
      />
    </Stack>
  );
};
