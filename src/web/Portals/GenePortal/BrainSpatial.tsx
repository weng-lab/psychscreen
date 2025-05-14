import React, { useState, useEffect } from "react";
import { Vitessce } from "vitessce";

import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface SampleInfo {
  dataset: string;
  internalFileName: string;
  shortDescription: string;
}

interface SampleOption extends SampleInfo {
  label: string; // for now: just the short description
  id: string; // dataset_internalFileName
}

// Define props interface to include gene
interface SpatialProps {
  gene: string; // Gene should be a string
}

export const BrainSpatial: React.FC<SpatialProps> = ({ gene }) => {
  const [selectedSample, setSelectedSample] = useState<SampleOption>(
    sampleOptions.find(
      (sample) =>
        sample.internalFileName === "DLPFC_Br6522_mid_manual_alignment_all"
    ) || sampleOptions[0]
  );

  const [config, setConfig] = useState<object | null>(null);

  // Fetch the config from the Zervers based on the sample name every time a new sample name is selected
  useEffect(() => {
    if (selectedSample && gene) {
      const fetchConfig = async () => {
        let configPath: string = `https://users.wenglab.org/kresgeb/psych_encode/${selectedSample.dataset}/configs/${selectedSample.internalFileName}/config.json`;

        try {
          const response = await fetch(configPath);
          const data = await response.json();

          // Update the config with the selected gene
          if (data.coordinationSpace?.featureSelection) {
            data.coordinationSpace.featureSelection["A"] = [gene];
          }

          setConfig(data);
        } catch (error) {
          console.error("Failed to fetch config:", error);
        }
      };

      fetchConfig();
    }
  }, [selectedSample, gene]);

  return (
    <Grid container spacing={2}>
      <>
        <Grid sm={12} md={12} lg={12} xl={12}>
          <Autocomplete
            options={sampleOptions}
            value={selectedSample}
            groupBy={(option) => option.dataset}
            onChange={(event, newValue) => {
              if (newValue) setSelectedSample(newValue);
            }}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField {...params} label="Select Sample" variant="outlined" />
            )}
            sx={{ width: 300 }}
          />
        </Grid>
        {config && (
          <Grid sm={12} md={12} lg={12} xl={12}>
            <Vitessce config={config} theme="light" />
          </Grid>
        )}
      </>
    </Grid>
  );
};
// TODO: Change this to a stored json file that is fetched from the server
const SAMPLES: SampleInfo[] = [
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br2720_ant_2",
    shortDescription: "Brain 2720 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br2720_mid_manual_alignment",
    shortDescription: "Brain 2720 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br2720_post_extra_reads",
    shortDescription: "Brain 2720 - Posterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br2743_ant_manual_alignment",
    shortDescription: "Brain 2743 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br2743_mid_manual_alignment_extra_reads",
    shortDescription: "Brain 2743 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br2743_post_manual_alignment",
    shortDescription: "Brain 2743 - Posterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br3942_ant_manual_alignment",
    shortDescription: "Brain 3942 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br3942_mid_manual_alignment",
    shortDescription: "Brain 3942 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br3942_post_manual_alignment",
    shortDescription: "Brain 3942 - Posterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6423_ant_manual_alignment_extra_reads",
    shortDescription: "Brain 6423 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6423_mid_manual_alignment",
    shortDescription: "Brain 6423 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6423_post_extra_reads",
    shortDescription: "Brain 6423 - Posterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6432_ant_2",
    shortDescription: "Brain 6432 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6432_mid_manual_alignment",
    shortDescription: "Brain 6432 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6432_post_manual_alignment",
    shortDescription: "Brain 6432 - Posterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6471_ant_manual_alignment_all",
    shortDescription: "Brain 6471 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6471_mid_manual_alignment_all",
    shortDescription: "Brain 6471 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6471_post_manual_alignment_all",
    shortDescription: "Brain 6471 - Posterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6522_ant_manual_alignment_all",
    shortDescription: "Brain 6522 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6522_mid_manual_alignment_all",
    shortDescription: "Brain 6522 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br6522_post_manual_alignment_all",
    shortDescription: "Brain 6522 - Posterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br8325_ant_manual_alignment_all",
    shortDescription: "Brain 8325 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br8325_mid_2",
    shortDescription: "Brain 8325 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br8325_post_manual_alignment_all",
    shortDescription: "Brain 8325 - Posterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br8492_ant_manual_alignment",
    shortDescription: "Brain 8492 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br8492_mid_manual_alignment_extra_reads",
    shortDescription: "Brain 8492 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br8492_post_manual_alignment",
    shortDescription: "Brain 8492 - Posterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br8667_ant_extra_reads",
    shortDescription: "Brain 8667 - Anterior",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br8667_mid_manual_alignment_all",
    shortDescription: "Brain 8667 - Middle",
  },
  {
    dataset: "spatialDLPFC",
    internalFileName: "DLPFC_Br8667_post_manual_alignment_all",
    shortDescription: "Brain 8667 - Posterior",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151507",
    shortDescription: "Sample 151507",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151508",
    shortDescription: "Sample 151508",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151509",
    shortDescription: "Sample 151509",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151510",
    shortDescription: "Sample 151510",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151669",
    shortDescription: "Sample 151669",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151670",
    shortDescription: "Sample 151670",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151671",
    shortDescription: "Sample 151671",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151672",
    shortDescription: "Sample 151672",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151673",
    shortDescription: "Sample 151673",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151674",
    shortDescription: "Sample 151674",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151675",
    shortDescription: "Sample 151675",
  },
  {
    dataset: "HumanPilot10X",
    internalFileName: "151676",
    shortDescription: "Sample 151676",
  },
];

const sampleOptions: SampleOption[] = SAMPLES.map((sample) => ({
  ...sample,
  label: sample.shortDescription, // Just the short description for now
  id: `${sample.dataset}__${sample.internalFileName}`, //unique identifier
}));

export default BrainSpatial;
