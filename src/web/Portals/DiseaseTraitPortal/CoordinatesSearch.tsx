import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { StyledButton } from "../DiseaseTraitPortal/DiseaseTraitDetails";

export const CoordinatesSearch = (props) => {
  const [value, setValue] = React.useState<any>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState<string[]>([]);

  const gridsize = props.gridsize || 5.5;
  return (
    <Grid container alignItems="center">
      {props.showTitle && (
        <Grid item sm={12} md={12} lg={12} xl={12}>
          <Typography>Search Coordinates:</Typography>
          <br />
        </Grid>
      )}
      <Grid item sm={gridsize} md={gridsize} lg={gridsize} xl={gridsize}>
        <Autocomplete
          id="coords-autocomplete"
          sx={{ width: 300, paper: { height: 200 } }}
          freeSolo
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
                  chromosome: value.split(":")[0],
                  start: +value.split(":")[1].split("-")[0],
                  end: +value.split(":")[1].split("-")[1],
                });
            }
          }}
          value={value}
          onChange={(_: any, newValue: string | null) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          noOptionsText={props.defaultText}
          renderInput={(params) => (
            <TextField {...params} label={props.defaultText} fullWidth />
          )}
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
              value &&
                props.onSelected &&
                props.onSelected({
                  chromosome: value.split(":")[0],
                  start: +value.split(":")[0].split("-")[0],
                  end: +value.split(":")[0].split("-")[1],
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
