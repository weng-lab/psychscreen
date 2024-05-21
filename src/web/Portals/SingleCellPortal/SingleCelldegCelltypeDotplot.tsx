import React from "react";
import { CircularProgress } from "@mui/material";
import { Grid } from "@mui/material";

import { gql, useQuery } from "@apollo/client";
import DotPlot from "./DotPlot";


const DEG_BYCT_QUERY = gql`
  query degQuery(
    $gene: String, $disease: String!,$celltype: String
  ) {
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
    const {data, loading} = useQuery(DEG_BYCT_QUERY, { variables: {
        celltype: props.celltype,
        disease: props.disease === "Bipolar Disorder" ? "Bipolar" : props.disease
      }})
      
      const dotPlotRef = React.useRef<SVGSVGElement>(null);      
      
      
      const dotplotData =
        !loading && data
          ? data.degQuery.filter(d=>d.padj!=0).filter(k=>k.padj < 0.05).map((k) => {
          
            
            return {
                expr_frac: -Math.log10(k.padj),            
                highlighted:  false,
                mean_count: k.log2_fc,
                dataset: props.disease === "Bipolar Disorder" ? "Bipolar" : props.disease,
                gene: k.gene,
                celltype: props.celltype,
              };
            })
          : []; 
          
      
    
      return (
        <Grid container>
        <Grid
            item
            sm={12}
            md={12}
            lg={12}
            xl={12}
            style={{ marginBottom: "2em",marginTop: "2em" }}
          >
    
          {
            loading || !dotplotData ? (
                <CircularProgress />
              ): dotplotData.length==0  ? (<>
              {'No data available for ' +props.celltype}
              </>) : (              
              <DotPlot
                deg={true}
                celltype={true}
                disease={props.disease === "Bipolar Disorder" ? "Bipolar" : props.disease}
                yaxistitle={props.celltype}
                showTooltip={true}
                dotplotData={
                    dotplotData.length>=50 ? dotplotData.sort((a,b)=>a.expr_frac-b.expr_frac).slice(0,50) : dotplotData
                }
                title1={<>{"-log"}<tspan baseline-shift = "sub">10</tspan>{"(p-adj)"}</>}                
                title2={<>{"log"}<tspan baseline-shift = "sub">2</tspan>{"(fold change)"}</>}
                ref={dotPlotRef}/>)
          }
          </Grid>
            </Grid>
      );
};

export default SingleCelldegCelltypeDotplot;
