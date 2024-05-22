import { gql, useQuery } from "@apollo/client";
import { CircularProgress, Grid } from "@mui/material";
import * as React from "react";
import DotPlot from "../SingleCellPortal/DotPlot";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as MUISelect } from "@mui/material";
export const scCtMapping: Map<string, string> = new Map([
  ["Chandelier", "InhibitoryNeurons"],
  ["Endo", "Misc"],
  ["L2.3.IT", "ExcitatoryNeurons"],
  ["L4.IT", "ExcitatoryNeurons"],
  ["L5.6.NP", "ExcitatoryNeurons"],
  ["L5.IT", "ExcitatoryNeurons"],
  ["L6b", "ExcitatoryNeurons"],
  ["L6.CT", "ExcitatoryNeurons"],
  ["L6.IT", "ExcitatoryNeurons"],
  ["L6.IT.Car3", "ExcitatoryNeurons"],
  ["Lamp5", "InhibitoryNeurons"],
  ["Lamp5.Lhx6", "InhibitoryNeurons"],
  ["Micro", "Microglia"],
  ["Oligo", "Oligodendrocytes"],
  ["OPC", "OPCs"],
  ["Pvalb", "InhibitoryNeurons"],
  ["Sncg", "InhibitoryNeurons"],
  ["Sst", "InhibitoryNeurons"],
  ["Pax6", "InhibitoryNeurons"],
  ["Sst Chodl", "InhibitoryNeurons"],
  ["VLMC", "Misc"],
  ["PC", "Misc"],
  ["SMC", "Misc"],
  ["RB", "Misc"],
  ["Immune", "Misc"],
  ["Astro", "Astrocytes"],
  ["Vip", "InhibitoryNeurons"]
]);

const DEG_QUERY = gql`
  query degQuery(
    $gene: String, $disease: String!
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
      shortdesc: "SZBD cohort, BPD (n=23) versus control (n=24)",
      desc: "Bipolar",
    },
  ],
  [
    "ASD",
    {
      cohort: "ASD",
      shortdesc: "UCLA-ASD cohort, ASD (n=21) versus control (n=19)",
      desc: "ASD",
    },
  ],
  [
    "Schizophrenia",
    {
      cohort: "Schizophrenia",
      shortdesc: "SZBD cohort, SCZ (n=24) versus control (n=24)",
      desc: "Schizophrenia",
    },
  ],
  [
    "Age",
    {
      cohort: "Age",
      shortdesc: "CMC&SZBD cohorts, >70 y.o. (n=40) versus <70 y.o. (n=36)",
      desc: "Age",
    },
  ]
]);



export const DegExpression = (props) => {
  const [dataset, setDataset] = React.useState(props.disease);

  const { data, loading } = useQuery(DEG_QUERY, {
    variables: {
      gene: props.gene,
      disease: dataset
    }
  })
  const handleChange = (event) => {
    setDataset(event.target.value);
  };
  const dotPlotRef = React.useRef<SVGSVGElement>(null);
  let keys = Array.from(DATASETS.keys());
  const dotplotData =
    !loading && data
      ? data.degQuery.filter(d => d.padj != 0).map((k) => {
        return {
          expr_frac: -Math.log10(k.padj),

          highlighted: (k.padj) < 0.05 ? true : false,
          mean_count: k.log2_fc,
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
        style={{ marginBottom: "2em", marginTop: "2em" }}
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
          ) : dotplotData.length === 0 ? (<>
            {'No data available for ' + props.gene}
          </>) : (<>

            <DotPlot
              deg={true}
              disease={dataset}
              gene={props.gene}
              showTooltip={true}
              dotplotData={
                dotplotData
              }
              title1={"-log10(P-adj)"}
              title2={"log2(fc)"}
              ref={dotPlotRef} /></>)
        }
      </Grid>
    </Grid></>)
}