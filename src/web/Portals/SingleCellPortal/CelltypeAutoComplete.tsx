import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { CELLTYPE_CARDS } from "./consts";
import { StyledButton } from "../styles";

const OPTIONS = CELLTYPE_CARDS.map((d) => d.cardLabel).sort();
export const CelltypeAutoComplete = (props) => {
  const [value, setValue] = React.useState<any>(null);
  const [inputValue, setInputValue] = React.useState("");
  const navigate = useNavigate();
 
  return (
    <Grid container alignItems="center">
      {props.showTitle && (
        <Grid item sm={12} md={12} lg={12} xl={12}>
          <Typography>Search Celltype:</Typography>
          <br />
        </Grid>
      )}
      <Grid item sm={props.gridsize || 5.5} md={props.gridsize || 5.5} lg={props.gridsize || 5.5} xl={props.gridsize || 5.5}>
        <Autocomplete
          sx={{ width: 300, paper: { height: 200 } }}
          options={OPTIONS}
          ListboxProps={{
            style: {
              maxHeight: "180px",
            },
          }}
          
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.defaultPrevented = true;

              const val = CELLTYPE_CARDS.find((d) => d.cardLabel === value)?.cardLabel;
            
              if (value)
                navigate(props.navigateto + val, {
                  state: { searchvalue: val },
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
          noOptionsText="e.g. Astrocytes, Chandelier"
          renderInput={(params) => (
            <TextField
              {...params}
              label="e.g. Astrocytes, Chandelier"
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
            const val = CELLTYPE_CARDS.find((d) => d.cardLabel === value)?.cardLabel;
          
            if (value)
              navigate(props.navigateto + val, {
                state: { searchvalue: val },
              });
          }}
        >
          Search
        </StyledButton>
      </Grid>
    </Grid>
  );
};
