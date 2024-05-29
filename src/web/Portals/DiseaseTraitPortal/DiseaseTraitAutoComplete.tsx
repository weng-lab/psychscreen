import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { DISEASE_CARDS } from "./config/constants";
import { StyledButton } from "../styles";
import { Stack } from "@mui/material";
const OPTIONS = DISEASE_CARDS.map((d) => d.cardLabel).sort();
export const DiseaseTraitAutoComplete = (props) => {
  const [inputValue, setInputValue] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = () => {
    const submittedTrait = DISEASE_CARDS.find((d) => d.cardLabel.toLowerCase() ===  inputValue.toLowerCase());
    if (submittedTrait){
      navigate(props.navigateto + submittedTrait.val, {
        state: { searchvalue: submittedTrait.val, diseaseDesc: submittedTrait.diseaseDesc },
      });
    }
  }

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
          freeSolo
          sx={{ width: 300, paper: { height: 200 } }}
          options={OPTIONS}
          ListboxProps={{
            style: {
              maxHeight: "250px",
            },
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onSubmit()
            }
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          noOptionsText="No Diseases/Traits Found"
          renderInput={(params) => (
            <TextField
              {...params}
              label="e.g. Schizophrenia, Insomnia"
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
          onClick={onSubmit}
        >
          Search
        </StyledButton>
      </Grid>
    </Grid>
    </Stack>
  );
};
