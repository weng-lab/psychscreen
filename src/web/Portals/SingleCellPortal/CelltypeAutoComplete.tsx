import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { CELLTYPE_CARDS } from "./consts";
import { StyledButton } from "../styles";
import { Stack } from "@mui/material";

const OPTIONS = CELLTYPE_CARDS.map((d) => d.cardLabel).sort();
export const CelltypeAutoComplete = (props) => {
  const [inputValue, setInputValue] = React.useState("");
  const navigate = useNavigate();

  const onSubmit = () => {
    const submittedCell = CELLTYPE_CARDS.find((d) => d.cardLabel.toLowerCase() === inputValue.toLowerCase())
    if (submittedCell) {
      navigate(props.navigateto + submittedCell.cardLabel, {
        state: { searchvalue: submittedCell.cardLabel },
      });
    }
  }

  return (
    <Stack>
      {props.showTitle && (
        <Grid item sm={12} md={12} lg={12} xl={12}>
          <Typography>Search a cell type of interest:</Typography>
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
              event.defaultPrevented = true;
              onSubmit()
            }
          }}
          inputValue={inputValue}
          onInputChange={(_, newInputValue) => {
            setInputValue(newInputValue);
          }}
          noOptionsText="e.g., Astrocytes, Chandelier"
          renderInput={(params) => (
            <TextField
              {...params}
              label="e.g., Astrocytes, Chandelier"
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
                      {option.includes("-expressing") ? <><i>{option.split("-expressing")[0]}</i><>{" -expressing"}{option.split("-expressing")[1]}</></> : option} 
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                    { 
                        CELLTYPE_CARDS.find((d) => d.cardLabel === option)
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
