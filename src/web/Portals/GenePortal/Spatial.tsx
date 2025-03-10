import React, { useState, useEffect } from "react";
import { Vitessce } from "vitessce";
import Grid from "@mui/material/Unstable_Grid2";
import {
  Typography,
  Button,
  DataTable,
} from "@weng-lab/psychscreen-ui-components";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as MUISelect } from "@mui/material";

export const SAMPLES: Map<string, { dataset: string; shortdesc: string }> =
  new Map([
    [
      "Example_1",
      {
        dataset: "Example",
        shortdesc: "Busy view of 2024_8667_mid",
      },
    ],
    [
      "Example_2",
      {
        dataset: "Example",
        shortdesc: "Simpler view with heatmap of 2024_8667_mid",
      },
    ],
    [
      "Example_3",
      {
        dataset: "Example",
        shortdesc: "Manual layer with heatmap of 2021_151674",
      },
    ],
    [
      "Example_4",
      {
        dataset: "Example",
        shortdesc: "Proposed layout for 2024 with MA",
      },
    ],
    [
      "Example_5",
      {
        dataset: "Example",
        shortdesc: "Proposed layout for 2024 without MA",
      },
    ],
    [
      "Example_6",
      {
        dataset: "Example",
        shortdesc: "Proposed layout for 2021",
      },
    ],
    [
      "151674",
      {
        dataset: "HumanPilot10x",
        shortdesc: "Sample # 151674 from HumanPilot10x",
      },
    ],
    [
      "DLPFC_Br8667_mid_manual_alignment_all",
      {
        dataset: "spatialDLPFC",
        shortdesc: "Middle slice of DLPFC from Brain 8667",
      },
    ],
    [
      "DLPFC_Br6522_mid_manual_alignment_all",
      {
        dataset: "spatialDLPFC",
        shortdesc: "Middle slice of Brain 6522",
      },
    ],
  ]);

// Define props interface to include gene
interface SpatialProps {
  gene: string; // Gene should be a string
}

export const Spatial: React.FC<SpatialProps> = (props) => {
  const [sample, setSample] = useState<string>(
    "DLPFC_Br8667_mid_manual_alignment_all"
  );

  const [config, setConfig] = useState<object | null>(null);

  // Fetch the config from the Zervers based on the sample name every time a new sample name is selected
  useEffect(() => {
    if (sample && props.gene) {
      const fetchConfig = async () => {
        let configPath: string;

        if (sample.startsWith("Example")) {
          configPath = `https://users.wenglab.org/kresgeb/psych_encode/example_configs/${sample}/config.json`;
        } else if (sample.startsWith("DLPFC")) {
          // Fetch from spatialDLPFC (2024 paper)
          configPath = `https://users.wenglab.org/kresgeb/psych_encode/spatialDLPFC/configs/${sample}/config.json`;
        } else {
          // Fetch from HumanPilot10X (2021 Paper)
          configPath = `https://users.wenglab.org/kresgeb/psych_encode/HumanPilot10X/configs/${sample}/config.json`;
        }

        const response = await fetch(configPath);
        const data = await response.json();

        // Modify the featureSelection field to use the selected gene as default gene view
        if (data.coordinationSpace && data.coordinationSpace.featureSelection) {
          data.coordinationSpace.featureSelection["A"] = [props.gene];
        }

        setConfig(data);
      };
      fetchConfig();
    }
  }, [sample, props.gene]);

  const handleChange = (event) => {
    console.log(event);
    setSample(event.target.value);
  };

  let keys = Array.from(SAMPLES.keys());
  return (
    <Grid container spacing={2}>
      <>
        <Grid sm={12} md={12} lg={12} xl={12}>
          <Typography type="body" size="large" mb={1}>
            Select Sample:
          </Typography>
          <FormControl>
            <InputLabel id="simple-select-helper-label">Sample:</InputLabel>
            <MUISelect
              labelId="simple-select-helper-label"
              id="simple-select-helper"
              value={sample}
              label="Sample"
              onChange={handleChange}
            >
              {keys.map((d) => {
                return (
                  <MenuItem value={d}>
                    {SAMPLES.get(d)!.dataset}
                    {" : "}
                    {SAMPLES.get(d)!.shortdesc}
                  </MenuItem>
                );
              })}
            </MUISelect>
          </FormControl>
        </Grid>
        <Grid sm={12} md={12} lg={12} xl={12}>
          <Vitessce config={config} theme="light" />
        </Grid>
      </>
    </Grid>
  );
};

export default Spatial;
