import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../DiseaseTraitPortal/DiseaseTraitDetails";
import { DISEASE_CARDS } from "./config/constants";
import { Stack } from "@mui/material";

const OPTIONS = DISEASE_CARDS.map((d) => d.cardLabel).sort();
export const DiseaseTraitAutoComplete = (props) => {
  const [value, setValue] = React.useState<any>(null);
  const [inputValue, setInputValue] = React.useState("");
  const navigate = useNavigate();

  return (
    <Stack>
      {props.showTitle && (
        <Grid item sm={12} md={12} lg={12} xl={12}>
          <Typography>Search trait:</Typography>
          <br />
        </Grid>
      )}
      <Grid container alignItems="center" wrap="nowrap" gap={2}>
      <Grid item>
        <Autocomplete
          sx={{ width: 270 }}
          options={OPTIONS}
          ListboxProps={{
            style: {
              maxHeight: "250px",
            },
          }}
          
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.defaultPrevented = true;

              const val = DISEASE_CARDS.find((d) => d.cardLabel === value)?.val;
              const diseaseDesc = DISEASE_CARDS.find(
                (d) => d.cardLabel === value
              )?.diseaseDesc;
              if (value)
                navigate(props.navigateto + val, {
                  state: { searchvalue: val, diseaseDesc },
                });
            }
          }}
          value={value}
          onChange={(_: any, newValue: string | null) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          noOptionsText="e.g. schizophrenia, Insomnia"
          renderInput={(params) => (
            <TextField
              {...params}
              label="e.g. schizophrenia, Insomnia"
              fullWidth
            />
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
                    <Typography variant="body2" color="text.secondary">
                      {
                        DISEASE_CARDS.find((d) => d.cardLabel === option)
                          ?.cardDesc
                      }
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            );
          }}
        />
      </Grid>
      <Grid item sx={{ verticalAlign: "middle", textAlign: "center" }}>
        <StyledButton
          bvariant="filled"
          btheme="light"
          onClick={() => {
            const val = DISEASE_CARDS.find((d) => d.cardLabel === value)?.val;
            const diseaseDesc = DISEASE_CARDS.find(
              (d) => d.cardLabel === value
            )?.diseaseDesc;
            if (value)
              navigate(props.navigateto + val, {
                state: { searchvalue: val, diseaseDesc },
              });
          }}
        >
          Search
        </StyledButton>
      </Grid>
    </Grid>
    </Stack>
  );
};
