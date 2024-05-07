import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { debounce } from "@mui/material/utils";
import { useNavigate } from "react-router-dom";

import { StyledButton } from "../DiseaseTraitPortal/DiseaseTraitDetails";

const SNP_AUTOCOMPLETE_QUERY = `
query snpAutocompleteQuery($snpid: String!, $assembly: String!) {
    snpAutocompleteQuery(snpid: $snpid, assembly: $assembly) {
        id
        coordinates {
            chromosome
            start
            end
        }
    }
}
`;
export const SnpAutoComplete = (props) => {
  const [value, setValue] = React.useState<any>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<any[]>([]);
  const [snpids, setSnpIds] = React.useState<any[]>([]);
  const navigate = useNavigate();

  const onSearchChange = async (value: any) => {
    setOptions([]);
    const response = await fetch("https://ga.staging.wenglab.org/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: SNP_AUTOCOMPLETE_QUERY,
        variables: {
          assembly: "grch38",
          snpid: value,
        },
      }),
      headers: { "Content-Type": "application/json" },
    });
    const snpSuggestion = (await response.json()).data?.snpAutocompleteQuery;
    if (snpSuggestion && snpSuggestion.length > 0) {
      const r = snpSuggestion.map((g: any) => g.id);
      const snp = snpSuggestion.map((g: any) => {
        return {
          chrom: g.coordinates.chromosome,
          start: g.coordinates.start,
          end: g.coordinates.end,
          id: g.id,
        };
      });
      setOptions(r);
      setSnpIds(snp);
    } else if (snpSuggestion && snpSuggestion.length === 0) {
      setOptions([]);
      setSnpIds([]);
    }
    
  };

  const debounceFn = React.useCallback(debounce(onSearchChange, 500), []);

  return (
    <Grid container alignItems="center">
      {props.showTitle && (
        <Grid item sm={12} md={12} lg={12} xl={12}>
          <Typography>Search snp:</Typography>
          <br />
        </Grid>
      )}
      <Grid item sm={5.5} md={5.5} lg={5.5} xl={5.5}>
        <Autocomplete
          id="google-map-demo"
          sx={{ width: 300, paper: { height: 200 } }}
          options={options}
          ListboxProps={{
            style: {
              maxHeight: "180px",
            },
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.defaultPrevented = true;
              value &&
                props.onSelected &&
                props.onSelected({
                  snpid: value,
                  chromosome: snpids.find((g) => g.id === value)?.chrom,
                  start: snpids.find((g) => g.id === value)?.start,
                  end: snpids.find((g) => g.id === value)?.end,
                });
              if (value && props.navigateto) {
                navigate(props.navigateto + value, {
                  state: {
                    snpid: value,
                    chromosome: snpids.find((g) => g.id === value)?.chrom,
                    start: snpids.find((g) => g.id === value)?.start,
                    end: snpids.find((g) => g.id === value)?.end,
                  },
                });
              }
            }
          }}
          value={value}
          onChange={(_: any, newValue: string | null) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            if (newInputValue !== "") {
              debounceFn(newInputValue);
            }

            setInputValue(newInputValue);
          }}
          noOptionsText="e.g. rs11669173"
          renderInput={(params) => (
            <TextField {...params} label="e.g. rs11669173" fullWidth />
          )}
          renderOption={(props, option) => {
            return (
              <li {...props} key={props.id}>
                <Grid container alignItems="center">
                  <Grid
                    item
                    sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
                  >
                    <Box component="span" sx={{ fontWeight: "regular" }}>
                      {option}
                    </Box>
                    {snpids && snpids.find((g) => g.id === option) && (
                      <Typography variant="body2" color="text.secondary">
                        {`${snpids.find((g) => g.id === option)?.chrom}:${
                          snpids.find((g) => g.id === option)?.start
                        }:${snpids.find((g) => g.id === option)?.end}`}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </li>
            );
          }}
        />
      </Grid>
      {!props.hideSearchButton && (
        <Grid
          item
          sm={1}
          md={1}
          lg={1}
          xl={1}
          sx={{ verticalAlign: "middle", textAlign: "center" }}
        >
          <StyledButton
            bvariant="filled"
            btheme="light"
            onClick={() => {
              if (value)
                navigate(props.navigateto + value, {
                  state: {
                    snpid: value,
                    chromosome: snpids.find((g) => g.id === value)?.chrom,
                    start: snpids.find((g) => g.id === value)?.start,
                    end: snpids.find((g) => g.id === value)?.end,
                  },
                });
            }}
          >
            Search
          </StyledButton>
        </Grid>
      )}
    </Grid>
  );
};
