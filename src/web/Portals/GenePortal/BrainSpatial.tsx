import React, { useState, useEffect } from "react";
import { Vitessce } from "vitessce";

import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import {
  Alert,
  Box,
  Button,
  Link,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface SampleInfo {
  dataset: string;
  headerGroup: string;
  internalFileName: string;
  shortDescription: string;
  availableAssignments: string[];
  additionalInfo?: string; // Optional field for any additional information
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

  const ErrorAlert = () => {
    const { resetBoundary } = useErrorBoundary();

    return (
      <Alert
        severity="error"
        action={
          <Button onClick={resetBoundary} sx={{ textTransform: "none" }}>
            Reload
          </Button>
        }
      >
        Vitessce ran into an error, please reload!
      </Alert>
    );
  };

  return (
    <Grid container spacing={2}>
      <>
        <Grid sm={12} md={12} lg={12} xl={12}>
          <Autocomplete
            options={sampleOptions}
            value={selectedSample}
            groupBy={(option) => option.headerGroup}
            onChange={(event, newValue) => {
              if (newValue) setSelectedSample(newValue);
            }}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Brain Sample"
                variant="outlined"
              />
            )}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  <Grid container direction="column">
                    <Typography type="body" size="medium">
                      {option.label}
                    </Typography>
                    {option.availableAssignments &&
                      option.availableAssignments.length > 0 && (
                        <Typography
                          type="body"
                          size="small"
                          color="text.secondary"
                        >
                          {option.availableAssignments.join(", ")}
                        </Typography>
                      )}
                    {option.additionalInfo && (
                      <Typography
                        type="body"
                        size="small"
                        color="text.secondary"
                      >
                        {option.additionalInfo}
                      </Typography>
                    )}
                  </Grid>
                </li>
              );
            }}
            sx={{ width: 300 }}
          />
        </Grid>
        {config && (
          <Grid sm={12} md={12} lg={12} xl={12}>
            <ErrorBoundary fallback={<ErrorAlert />}>
              <Vitessce config={config} theme="light" />
            </ErrorBoundary>
            <Box mt={2}>
              <Typography type="title" fontWeight="bold" size="medium">
                Source of gene expression and layer/cluster assignment:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary={
                      <>
                        Maynard <i>et al</i>. Transcriptome-scale spatial gene
                        expression in the human dorsolateral prefrontal cortex.{" "}
                        <i>Nature Neuroscience</i> <b>24</b>, 425–436 (2021).
                        (doi:{" "}
                        <Link
                          href="https://doi.org/10.1038/s41593-020-00787-0"
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          10.1038/s41593-020-00787-0
                        </Link>
                        ).
                      </>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary={
                      <>
                        Huuki-Myers <i>et al</i>. A data-driven single-cell and
                        spatial transcriptomic map of the human prefrontal
                        cortex. <i>Science</i> <b>384</b>, 866 (2024). (doi:{" "}
                        <Link
                          href="https://doi.org/10.1126/science.adh1938"
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                        >
                          10.1126/science.adh1938
                        </Link>
                        ).
                      </>
                    }
                  />
                </ListItem>
              </List>
            </Box>
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
    headerGroup: "Suggested Samples",
    internalFileName: "DLPFC_Br6522_mid_manual_alignment_all",
    shortDescription: "Brain 6522 - Middle",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
    additionalInfo: "From Huuki-Myers et al. 2024",
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Suggested Samples",
    internalFileName: "DLPFC_Br6522_ant_manual_alignment_all",
    shortDescription: "Brain 6522 - Anterior",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
    additionalInfo: "From Huuki-Myers et al. 2024",
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Suggested Samples",
    internalFileName: "DLPFC_Br8667_post_manual_alignment_all",
    shortDescription: "Brain 8667 - Posterior",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
    additionalInfo: "From Huuki-Myers et al. 2024",
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Suggested Samples",
    internalFileName: "151673",
    shortDescription: "Sample 151673",
    availableAssignments: ["Manual Annotation"],
    additionalInfo: "From Maynard et al. 2021",
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br2720_ant_2",
    shortDescription: "Brain 2720 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br2720_mid_manual_alignment",
    shortDescription: "Brain 2720 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br2720_post_extra_reads",
    shortDescription: "Brain 2720 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br2743_ant_manual_alignment",
    shortDescription: "Brain 2743 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br2743_mid_manual_alignment_extra_reads",
    shortDescription: "Brain 2743 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br2743_post_manual_alignment",
    shortDescription: "Brain 2743 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br3942_ant_manual_alignment",
    shortDescription: "Brain 3942 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br3942_mid_manual_alignment",
    shortDescription: "Brain 3942 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br3942_post_manual_alignment",
    shortDescription: "Brain 3942 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6423_ant_manual_alignment_extra_reads",
    shortDescription: "Brain 6423 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6423_mid_manual_alignment",
    shortDescription: "Brain 6423 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6423_post_extra_reads",
    shortDescription: "Brain 6423 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6432_ant_2",
    shortDescription: "Brain 6432 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6432_mid_manual_alignment",
    shortDescription: "Brain 6432 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6432_post_manual_alignment",
    shortDescription: "Brain 6432 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6471_ant_manual_alignment_all",
    shortDescription: "Brain 6471 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6471_mid_manual_alignment_all",
    shortDescription: "Brain 6471 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6471_post_manual_alignment_all",
    shortDescription: "Brain 6471 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6522_ant_manual_alignment_all",
    shortDescription: "Brain 6522 - Anterior",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6522_mid_manual_alignment_all",
    shortDescription: "Brain 6522 - Middle",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br6522_post_manual_alignment_all",
    shortDescription: "Brain 6522 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br8325_ant_manual_alignment_all",
    shortDescription: "Brain 8325 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br8325_mid_2",
    shortDescription: "Brain 8325 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br8325_post_manual_alignment_all",
    shortDescription: "Brain 8325 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br8492_ant_manual_alignment",
    shortDescription: "Brain 8492 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br8492_mid_manual_alignment_extra_reads",
    shortDescription: "Brain 8492 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br8492_post_manual_alignment",
    shortDescription: "Brain 8492 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br8667_ant_extra_reads",
    shortDescription: "Brain 8667 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br8667_mid_manual_alignment_all",
    shortDescription: "Brain 8667 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "DLPFC_Br8667_post_manual_alignment_all",
    shortDescription: "Brain 8667 - Posterior",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151507",
    shortDescription: "Sample 151507",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151508",
    shortDescription: "Sample 151508",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151509",
    shortDescription: "Sample 151509",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151510",
    shortDescription: "Sample 151510",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151669",
    shortDescription: "Sample 151669",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151670",
    shortDescription: "Sample 151670",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151671",
    shortDescription: "Sample 151671",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151672",
    shortDescription: "Sample 151672",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151673",
    shortDescription: "Sample 151673",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151674",
    shortDescription: "Sample 151674",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151675",
    shortDescription: "Sample 151675",
    availableAssignments: ["Manual Annotation"],
  },
  {
    dataset: "HumanPilot10X",
    headerGroup: "Maynard et al. 2021",
    internalFileName: "151676",
    shortDescription: "Sample 151676",
    availableAssignments: ["Manual Annotation"],
  },
];

const sampleOptions: SampleOption[] = SAMPLES.map((sample) => ({
  ...sample,
  label: sample.shortDescription, // Just the short description for now
  id: `${sample.dataset}__${sample.internalFileName}`, //unique identifier
}));

export default BrainSpatial;
