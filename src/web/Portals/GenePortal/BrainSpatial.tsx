import React, { Suspense, useState, useEffect } from "react";

import Grid from "@mui/material/Unstable_Grid2";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import {
  Alert,
  Box,
  Button,
  Link,
  ListItemText,
  useMediaQuery,
  useTheme,
  Typography } from "@mui/material";

const Vitessce = React.lazy(() =>
  import("vitessce").then((module) => ({ default: module.Vitessce }))
);

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
    sampleOptions.find((sample) => sample.internalFileName === "Br6522_mid") ||
      sampleOptions[0]
  );

  const [config, setConfig] = useState<object | null>(null);

  const theme = useTheme();
  const useSingleColumn = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch the config from the Zervers based on the sample name every time a new sample name is selected
  useEffect(() => {
    if (selectedSample && gene) {
      const fetchConfig = async () => {
        let configPath: string = `https://downloads.wenglab.org/psychscreen/spatial/${
          selectedSample.dataset
        }/configs/${selectedSample.internalFileName}/config${
          useSingleColumn ? "_single_column" : ""
        }.json`;

        try {
          const response = await fetch(configPath);
          const data = await response.json();

          // Update the config with the selected gene
          if (data.coordinationSpace?.featureSelection) {
            data.coordinationSpace.featureSelection["gene"] = [gene];
          }

          setConfig(data);
        } catch (error) {
          console.error("Failed to fetch config:", error);
        }
      };

      fetchConfig();
    }
  }, [selectedSample, gene, useSingleColumn]);

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
    <Grid container spacing={2} id="parentEl">
      <Grid xs={12} sm={12} md={12} lg={12} xl={12}>
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
                  <Typography variant="body1">
                    {option.label}
                  </Typography>
                  {option.availableAssignments &&
                    option.availableAssignments.length > 0 && (
                      <Typography variant="body2"
                        color="text.secondary"
                      >
                        {option.availableAssignments.join(", ")}
                      </Typography>
                    )}
                  {option.additionalInfo && (
                    <Typography variant="body2" color="text.secondary">
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
            <Suspense fallback={<Box>Loading spatial view...</Box>}>
              <Vitessce config={config} theme="light" />
            </Suspense>
          </ErrorBoundary>
          <Box mt={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Sources of gene expression and layer/cluster/domain assignment:
            </Typography>
            <ul>
              <li>
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
              </li>
              <li>
                <ListItemText
                  primary={
                    <>
                      Huuki-Myers <i>et al</i>. A data-driven single-cell and
                      spatial transcriptomic map of the human prefrontal cortex.{" "}
                      <i>Science</i> <b>384</b>, 866 (2024). (doi:{" "}
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
              </li>
              <li>
                <ListItemText
                  primary={
                    <>
                      Pardo <i>et al</i>. spatialLIBD: an R/Bioconductor package
                      to visualize spatially-resolved transcriptomics data.{" "}
                      <i>BMC Genomics</i> <b>23</b>, 434 (2022). (doi:{" "}
                      <Link
                        href="https://doi.org/10.1186/s12864-022-08601-w"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        10.1186/s12864-022-08601-w
                      </Link>
                      ).
                    </>
                  }
                />
              </li>
              <li>
                <ListItemText
                  primary={
                    <>
                      Thompson <i>et al</i>. An integrated single-nucleus and
                      spatial transcriptomics atlas reveals the molecular
                      landscape of the human hippocampus.{" "}
                      <i>Nature Neuroscience</i> <b>28</b>, 1990–2004 (2025).
                      (doi:{" "}
                      <Link
                        href="https://doi.org/10.1038/s41593-025-02022-0"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        10.1038/s41593-025-02022-0
                      </Link>
                      ).
                    </>
                  }
                />
              </li>
            </ul>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
              Visualization powered by{" "}
              <Link
                href="https://vitessce.io"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
              >
                Vitessce v3.8.3
              </Link>
            </Typography>
            <ul>
              <li>
                <ListItemText
                  primary={
                    <>
                      Keller <i>et al</i>. Vitessce: integrative visualization
                      of multimodal and spatially resolved single-cell data.{" "}
                      <i>Nature Methods</i> <b>22</b>, 63–67 (2025). (doi:{" "}
                      <Link
                        href="https://doi.org/10.1038/s41592-024-02436-x"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        10.1038/s41592-024-02436-x
                      </Link>
                      ).
                    </>
                  }
                />
              </li>
              <li>
                <ListItemText
                  primary={
                    <>
                      Manz <i>et al</i>. Viv: multiscale visualization of
                      high-resolution multiplexed bioimaging data on the web.{" "}
                      <i>Nature Methods</i> <b>19</b>, 1569–1576 (2022). (doi:{" "}
                      <Link
                        href="https://doi.org/10.1038/s41592-022-01482-7"
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                      >
                        10.1038/s41592-022-01482-7
                      </Link>
                      ).
                    </>
                  }
                />
              </li>
            </ul>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};
// TODO: Change this to a stored json file that is fetched from the server
const SAMPLES: SampleInfo[] = [
  {
    dataset: "spatialDLPFC",
    headerGroup: "Suggested Samples",
    internalFileName: "Br6522_mid",
    shortDescription: "Brain 6522 - Middle",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
    additionalInfo: "From Huuki-Myers et al. 2024",
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Suggested Samples",
    internalFileName: "Br6522_ant",
    shortDescription: "Brain 6522 - Anterior",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
    additionalInfo: "From Huuki-Myers et al. 2024",
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Suggested Samples",
    internalFileName: "Br8667_post",
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
    dataset: "hippocampus",
    headerGroup: "Suggested Samples",
    internalFileName: "V11L05-333_B1",
    shortDescription: "Brain 3942 - Top Right",
    availableAssignments: ["PRECAST", "NMF"],
    additionalInfo: "From Thompson et al. 2025",
  },
  {
    dataset: "hippocampus",
    headerGroup: "Suggested Samples",
    internalFileName: "V12F14-051_A1",
    shortDescription: "Brain 2720 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
    additionalInfo: "From Thompson et al. 2025",
  },
  {
    dataset: "hippocampus",
    headerGroup: "Suggested Samples",
    internalFileName: "V11U08-081_D1",
    shortDescription: "Brain 2743 - Bottom Right",
    availableAssignments: ["PRECAST", "NMF"],
    additionalInfo: "From Thompson et al. 2025",
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br2720_ant",
    shortDescription: "Brain 2720 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br2720_mid",
    shortDescription: "Brain 2720 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br2720_post",
    shortDescription: "Brain 2720 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br2743_ant",
    shortDescription: "Brain 2743 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br2743_mid",
    shortDescription: "Brain 2743 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br2743_post",
    shortDescription: "Brain 2743 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br3942_ant",
    shortDescription: "Brain 3942 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br3942_mid",
    shortDescription: "Brain 3942 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br3942_post",
    shortDescription: "Brain 3942 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6423_ant",
    shortDescription: "Brain 6423 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6423_mid",
    shortDescription: "Brain 6423 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6423_post",
    shortDescription: "Brain 6423 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6432_ant",
    shortDescription: "Brain 6432 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6432_mid",
    shortDescription: "Brain 6432 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6432_post",
    shortDescription: "Brain 6432 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6471_ant",
    shortDescription: "Brain 6471 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6471_mid",
    shortDescription: "Brain 6471 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6471_post",
    shortDescription: "Brain 6471 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6522_ant",
    shortDescription: "Brain 6522 - Anterior",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6522_mid",
    shortDescription: "Brain 6522 - Middle",
    availableAssignments: ["Manual Annotation", "BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br6522_post",
    shortDescription: "Brain 6522 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br8325_ant",
    shortDescription: "Brain 8325 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br8325_mid",
    shortDescription: "Brain 8325 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br8325_post",
    shortDescription: "Brain 8325 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br8492_ant",
    shortDescription: "Brain 8492 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br8492_mid",
    shortDescription: "Brain 8492 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br8492_post",
    shortDescription: "Brain 8492 - Posterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br8667_ant",
    shortDescription: "Brain 8667 - Anterior",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br8667_mid",
    shortDescription: "Brain 8667 - Middle",
    availableAssignments: ["BayesSpace"],
  },
  {
    dataset: "spatialDLPFC",
    headerGroup: "Huuki-Myers et al. 2024",
    internalFileName: "Br8667_post",
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
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V12F14-051_C1",
    shortDescription: "Brain 2720 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V12F14-051_D1",
    shortDescription: "Brain 2720 - Top Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V12F14-051_A1",
    shortDescription: "Brain 2720 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V12F14-051_B1",
    shortDescription: "Brain 2720 - Bottom Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V10B01-086_D1",
    shortDescription: "Brain 2743 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V10B01-086_C1",
    shortDescription: "Brain 2743 - Top Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11U08-081_C1",
    shortDescription: "Brain 2743 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11U08-081_D1",
    shortDescription: "Brain 2743 - Bottom Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-333_A1",
    shortDescription: "Brain 3942 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-333_B1",
    shortDescription: "Brain 3942 - Top Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-333_C1",
    shortDescription: "Brain 3942 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-333_D1",
    shortDescription: "Brain 3942 - Bottom Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V10B01-085_B1",
    shortDescription: "Brain 6423 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V10B01-085_A1",
    shortDescription: "Brain 6423 - Top Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V10B01-085_D1",
    shortDescription: "Brain 6423 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V10B01-085_C1",
    shortDescription: "Brain 6423 - Bottom Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V10B01-086_A1",
    shortDescription: "Brain 6432 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V10B01-086_B1",
    shortDescription: "Brain 6432 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-335_C1",
    shortDescription: "Brain 6471 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-335_B1",
    shortDescription: "Brain 6471 - Top Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-335_A1",
    shortDescription: "Brain 6471 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11U08-084_A1",
    shortDescription: "Brain 6522 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11U08-084_B1",
    shortDescription: "Brain 6522 - Top Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11U08-084_C1",
    shortDescription: "Brain 6522 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11U08-084_D1",
    shortDescription: "Brain 6522 - Bottom Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11A20-297_C1",
    shortDescription: "Brain 8325 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11A20-297_D1",
    shortDescription: "Brain 8325 - Top Right (High)",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-335_D1",
    shortDescription: "Brain 8325 - Top Right (Low)",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11A20-297_A1",
    shortDescription: "Brain 8325 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11A20-297_B1",
    shortDescription: "Brain 8325 - Bottom Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11U08-081_A1",
    shortDescription: "Brain 8492 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11U08-081_B1",
    shortDescription: "Brain 8492 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-336_A1",
    shortDescription: "Brain 8667 - Top Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-336_B1",
    shortDescription: "Brain 8667 - Top Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-336_C1",
    shortDescription: "Brain 8667 - Bottom Left",
    availableAssignments: ["PRECAST", "NMF"],
  },
  {
    dataset: "hippocampus",
    headerGroup: "Thompson et al. 2025",
    internalFileName: "V11L05-336_D1",
    shortDescription: "Brain 8667 - Bottom Right",
    availableAssignments: ["PRECAST", "NMF"],
  },
];

const sampleOptions: SampleOption[] = SAMPLES.map((sample) => ({
  ...sample,
  label: sample.shortDescription, // Just the short description for now
  id: `${sample.dataset}__${sample.internalFileName}`, //unique identifier
}));

export default BrainSpatial;
