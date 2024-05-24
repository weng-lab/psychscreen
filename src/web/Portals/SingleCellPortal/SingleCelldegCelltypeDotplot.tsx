import { useState, useRef } from "react";
import { CircularProgress } from "@mui/material";
import { Grid, FormControl } from "@mui/material";
import {  Typography } from "@weng-lab/psychscreen-ui-components";
import { gql, useQuery } from "@apollo/client";
import DotPlot from "./DotPlot";
import { Select as MUISelect } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

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

  const handleValueChange = (event) => {
    setValue(event.target.value);
  };
  const [value, setValue] = useState("log2(fold change)");

  const dotPlotRef = useRef<SVGSVGElement>(null);

  const dotplotData =
    !loading && data
      ? data.degQuery
          .filter((d) => d.padj != 0)
          .filter((k) => k.padj < 0.05)
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
      <Grid container>
        <Grid
          item
          sm={4}
          md={4}
          lg={4}
          xl={4}
          style={{ marginBottom: "2em", marginTop: "2em" }}
        >
          <Typography
            style={{ marginLeft: "0.1em", marginTop: "0.1em" }}
            type="body"
            size="large"
          >
            Select Disease:
          </Typography>

          <FormControl
            sx={{ m: 1, minWidth: 400 }}
            style={{ marginLeft: "0.1em", marginTop: "1em" }}
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
          <Grid
            item
            sm={6}
            md={6}
            lg={6}
            xl={6}
            style={{ marginBottom: "2em", marginTop: "2em" }}
          >
            <Typography
              style={{ marginLeft: "0.1em", marginTop: "0.1em" }}
              type="body"
              size="large"
            >
              {`Showing top 50 datasets based on ${value}:`}
            </Typography>

            <FormControl
              sx={{ m: 1, minWidth: 400 }}
              style={{ marginLeft: "0.1em", marginTop: "1em" }}
            >
              <InputLabel id="value-select">Value:</InputLabel>
              <MUISelect
                labelId="value-select-helper"
                id="value-select"
                value={value}
                label="Dt"
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
        <Grid item sm={12} md={12} lg={12} xl={12}>
          {loading || !dotplotData ? (
            <CircularProgress />
          ) : dotplotData.length == 0 ? (
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
