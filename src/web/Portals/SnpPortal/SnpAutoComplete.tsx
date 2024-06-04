import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { debounce } from "@mui/material/utils";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../../Portals/styles";
import { Stack } from "@mui/material";

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

  const onSubmit = () => {
    const submittedSNP = snpids.find((g) => g.id.toLowerCase() === inputValue.toLowerCase())
    if (submittedSNP) {
      props.onSelected && props.onSelected({
        snpid: submittedSNP.id,
        chromosome: submittedSNP.chrom,
        start: submittedSNP.start,
        end: submittedSNP.end,
      });
      props.navigateto && navigate(props.navigateto + submittedSNP.id, {
        state: {
          snpid: submittedSNP.id,
          chromosome: submittedSNP.chrom,
          start: submittedSNP.start,
          end: submittedSNP.end,
        },
      });
    }
  }

  return (
    <Stack>
      {props.showTitle && (
        <Grid item sm={12} md={12} lg={12} xl={12}>
          <Typography>Search a SNP of interest:</Typography>
          <br />
        </Grid>
      )}
      <Grid container alignItems="center" wrap="nowrap" gap={2}>
      <Grid item>
        <Autocomplete
          freeSolo
          sx={{ width: 300, paper: { height: 200 } }}
          options={options}
          ListboxProps={{
            style: {
              maxHeight: "250px",
            },
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.defaultPrevented = true;
              onSubmit()
            }
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
          <Grid item sx={{ verticalAlign: "middle", textAlign: "center" }}>
          <StyledButton
            bvariant="filled"
            btheme="light"
            onClick={onSubmit}
          >
            Search
          </StyledButton>
        </Grid>
      )}
    </Grid>
    </Stack>
    
  );
};
