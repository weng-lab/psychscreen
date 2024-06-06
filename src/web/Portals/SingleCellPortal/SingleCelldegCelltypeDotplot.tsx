import { useState, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { Grid, FormControl } from "@mui/material";
import {  Typography } from "@weng-lab/psychscreen-ui-components";
import { gql, useQuery } from "@apollo/client";
import DotPlot from "./DotPlot";
import { Select as MUISelect } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { Box,  FormLabel, Slider } from "@mui/material";


const DEG_BYCT_QUERY = gql`
  query degQuery($gene: String, $disease: String!, $celltype: String) {
    degQuery(gene: $gene, disease: $disease, celltype: $celltype) {
      padj
      base_mean
      lfc_se
      stat
      pvalue
      gene
      celltype
      log2_fc
    }
  }
`;
const SingleCelldegCelltypeDotplot = (props) => {
  const { data, loading } = useQuery(DEG_BYCT_QUERY, {
    variables: {
      celltype: props.celltype,
      disease: props.disease === "Bipolar Disorder" ? "Bipolar" : props.disease,
    },
  });
  const [pValCutoff, setPValCutoff] = useState<number>(0.05)

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };
  const [value, setValue] = useState("log2(fold change)");

  const dotPlotRef = useRef<SVGSVGElement>(null);

  
  // In the slider, the "value" is used to place marks equally on track. The scale function below is used to pull out the true value that we want
  const pValMarks = [
    {
      value: 0,
      scaledValue: 0.0001,
      label: 0.0001
    },
    {
      value: 1,
      scaledValue: 0.001,
      label: 0.001
    },
    {
      value: 2,
      scaledValue: 0.01,
      label: 0.01
    },
    {
      value: 3,
      scaledValue: 0.05,
      label: 0.05
    },
    {
      value: 4,
      scaledValue: 1,
      label: 1
    },
  ]

  const scale = (value: number) => {
    return pValMarks.find(x => x.value === value)!!.scaledValue
  };
  const dotplotData =
    !loading && data
      ? data.degQuery
          .filter((d) => d.padj != 0)
          .filter((k) => k.padj <= pValCutoff)
          .map((k) => {
            return {
              expr_frac: -Math.log10(k.padj),
              highlighted: false,
              mean_count: k.log2_fc,
              dataset:
                props.disease === "Bipolar Disorder"
                  ? "Bipolar"
                  : props.disease,
              gene: k.gene,
              celltype: props.celltype,
            };
          })
      : [];

  return (
    <>
      <Grid container mt={2} mb={2} gap={2}>
        <Grid item>
          <Typography
            type="body"
            size="large"
          >
            Select Disease:
          </Typography>
          <FormControl
            sx={{ minWidth: 300 }}
            style={{ marginTop: "0.5em" }}
          >
            <InputLabel id="simple-select-helper-label">Disease:</InputLabel>
            <MUISelect
              labelId="simple-select-helper-label"
              id="simple-select-helper"
              value={props.dataset}
              label="Dataset"
              onChange={props.handleChange}
            >
              {props.degDiseases.map((d) => {
                return <MenuItem value={d}>{d}</MenuItem>;
              })}
            </MUISelect>
          </FormControl>
        </Grid>
        {dotplotData.length >= 50 && (
          <Grid item>
            <Typography
              type="body"
              size="large"
            >
              {`Showing top 50 datasets based on ${value}:`}
            </Typography>
            <FormControl
              sx={{ minWidth: 300 }}
              style={{ marginTop: "0.5em" }}
            >
              <InputLabel id="value-select">Value:</InputLabel>
              <MUISelect
                labelId="value-select-helper"
                id="value-select"
                value={value}
                label="Value"
                onChange={handleValueChange}
              >
                {["log2(fold change)", "-log10(padj)"].map((d) => {
                  return <MenuItem value={d}>{d}</MenuItem>;
                })}
              </MUISelect>
            </FormControl>
          </Grid>
        )}
      </Grid>
      <Grid container>
        <Grid item>
        <Box width={300}>
            <FormLabel><i>P</i><sub>adj</sub> Cutoff</FormLabel>
            <Slider
              min={0} //Min/Max is 0/4 since that is the true value of the marks above
              max={4}
              defaultValue={3}
              scale={scale} //Allows the slider to access the scaled values which we want displayed
              aria-label="Restricted values"
              onChange={(event: Event, value: number | number[], activeThumb: number) => setPValCutoff(scale(value as number))} //Sets p value cutoff to scaled value
              getAriaValueText={(value: number, index: number) => value.toString()}
              step={null}
              valueLabelDisplay="auto"
              marks={pValMarks}
            />
          </Box>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} minWidth={700}>
          {loading || !dotplotData ? (
            <CircularProgress />
          ) : dotplotData.length === 0 ? (
            <>{"No data available for " + props.celltype}</>
          ) : (
            <DotPlot
              deg={true}
              celltype={true}
              disease={
                props.disease === "Bipolar Disorder" ? "Bipolar" : props.disease
              }
              yaxistitle={props.celltype}
              showTooltip={true}
              dotplotData={
                dotplotData.length >= 50
                  ? dotplotData
                      .sort((a, b) =>
                        value === "log2(fold change)"
                          ? Math.abs(b.mean_count) - Math.abs(a.mean_count)
                          : b.expr_frac - a.expr_frac
                      )
                      .slice(0, 50)
                  : dotplotData
              }
              title1={
                <>
                  {"-log"}
                  <tspan baseline-shift="sub">10</tspan>
                  {"(p-adj)"}
                </>
              }
              title2={
                <>
                  {"log"}
                  <tspan baseline-shift="sub">2</tspan>
                  {"(fold change)"}
                </>
              }
              ref={dotPlotRef}
            />
          )}
        </Grid>
      </Grid>
    </>
  );
};

export default SingleCelldegCelltypeDotplot;
