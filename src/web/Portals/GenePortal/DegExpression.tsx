import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Grid } from "@mui/material";
import * as React from "react";
import DotPlot from "../SingleCellPortal/DotPlot";
import {
    Typography,
    Button,
    DataTable,
  } from "@weng-lab/psychscreen-ui-components";
  import InputLabel from "@mui/material/InputLabel";
  import MenuItem from "@mui/material/MenuItem";
  import FormControl from "@mui/material/FormControl";
  import { Select as MUISelect } from "@mui/material";
export const scCtMapping: Map<string, string> = new Map([
    ["Chandelier","InhibitoryNeurons"],
    ["Endo","Misc"],
    ["L2.3.IT","ExcitatoryNeurons"],
    ["L4.IT","ExcitatoryNeurons"],
    ["L5.6.NP","ExcitatoryNeurons"],
    ["L5.IT","ExcitatoryNeurons"],
    ["L6b","ExcitatoryNeurons"],
    ["L6.CT","ExcitatoryNeurons"],
    ["L6.IT","ExcitatoryNeurons"],
    ["L6.IT.Car3","ExcitatoryNeurons"],
    ["Lamp5","InhibitoryNeurons"],
    ["Lamp5.Lhx6","InhibitoryNeurons"],
    ["Micro","Microglia"],
    ["Oligo","Oligodendrocytes"],
    ["OPC","OPCs"],
    ["Pvalb","InhibitoryNeurons"],
    ["Sncg","InhibitoryNeurons"],
    ["Sst","InhibitoryNeurons"],
	["Pax6","InhibitoryNeurons"],
	["Sst Chodl","InhibitoryNeurons"],
	["VLMC","Misc"],
	["PC","Misc"],
	["SMC","Misc"],
	["RB","Misc"],
	["Immune","Misc"],
	["Astro","Astrocytes"],
    ["Vip","InhibitoryNeurons"]
]);

const DEG_QUERY = gql`
  query degQuery(
    $gene: String!, $disease: String!
  ) {
    degQuery(gene: $gene, disease: $disease) {
        padj
        base_mean
        lfc_se
        stat
        pvalue
        celltype
        log2_fc
    }
  }
`;
export const DATASETS: Map<
  string,
  { cohort: string; desc: string; shortdesc: string }
> = new Map([
  [
    "Bipolar",
    {
      cohort: "Bipolar",
      shortdesc: "Bipolar Disorder",
      desc: "Bipolar",
    },
  ],
  [
    "ASD",
    {
      cohort: "ASD",
      shortdesc: "Autism Spectrum Disorder",
      desc: "ASD",
    },
  ],
  [
    "Schizophrenia",
    {
      cohort: "Schizophrenia",
      shortdesc: "Schizophrenia",
      desc: "Schizophrenia",
    },
  ],
  [
    "Age",
    {
      cohort: "Age",
      shortdesc: "Aging",
      desc: "Age",
    },
  ]
]);



export const DegExpression = (props) =>{
    const [dataset, setDataset] = React.useState(props.disease);
    
    const {data, loading} = useQuery(DEG_QUERY, {variables: {
        gene: props.gene,
        disease: dataset
      }})
      const handleChange = (event) => {
        setDataset(event.target.value);
      };
    const dotPlotRef = React.useRef<SVGSVGElement>(null);
    let keys = Array.from(DATASETS.keys());
    const dotplotData =
    !loading && data
      ? data.degQuery.map((k) => {
          return {
            expr_frac: k.log2_fc,
            mean_count: -Math.log10(k.padj),
            dataset,
            gene: props.gene,
            celltype: k.celltype,
          };
        })
      : []; 
      
    return (<>
    <Grid container>
    <Grid
        item
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{ marginBottom: "2em",marginTop: "2em" }}
      >

{<>
      <Grid
        item
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{ marginBottom: "2em" }}
      >
        <Typography
          style={{ marginLeft: "1em", marginTop: "0.1em" }}
          type="body"
          size="large"
        >
          Select PsychEncode Dataset:
        </Typography>

        {
          <FormControl
            sx={{ m: 1, minWidth: 400 }}
            style={{ marginLeft: "1em", marginTop: "1em" }}
          >
            <InputLabel id="simple-select-helper-label">Dataset:</InputLabel>
            <MUISelect
              labelId="simple-select-helper-label"
              id="simple-select-helper"
              value={dataset}
              label="Dataset"
              onChange={handleChange}
            >
              {keys.map((d) => {
                return (
                  <MenuItem value={DATASETS.get(d)!.cohort}>
                    {d}
                    {" - "}
                    {DATASETS.get(d)!.shortdesc}
                  </MenuItem>
                );
              })}
            </MUISelect>
          </FormControl>
        }
      </Grid>
      </>}
      {
        loading || !dotplotData ? (
            <CircularProgress />
          ): ( <>
          
          <DotPlot
            disease={dataset}
            gene={props.gene}
            dotplotData={
                dotplotData
            }
            title2={"-log10(P-adjusted)"}
            title1={"log2(expression fold change)"}
            ref={dotPlotRef}/></>)
      }
      </Grid>
        </Grid></>)
}