import React, { useState } from 'react';
import { CircularProgress, Grid, GridProps } from '@mui/material';
import { AppBar, Typography } from '@weng-lab/psychscreen-ui-components';
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { useQuery } from '@apollo/client';
import DotPlot from './DotPlot'
import { StyledButton } from '../DiseaseTraitPortal/DiseaseTraitDetails';
import { GET_PEDATASET_VALS_BYCT_QUERY, GET_PEDATASET_VALS_BYSC_QUERY, PedatasetValuesbyCelltypeResponse, PedatasetValuesbySubclassResponse } from '../GenePortal/SingleCell';

const SingleCellDotPlot: React.FC<GridProps> = (props) => {
    const navigate = useNavigate(); 
    const { disease, gene } = useParams();
    const [ ctClass, setCtClass] = useState("by SubClass")
 
    const {loading: byCtDataLoading, data: byCtData } = useQuery<PedatasetValuesbyCelltypeResponse>(GET_PEDATASET_VALS_BYCT_QUERY, {
        variables: {
             dataset: disease==="DevBrain" ? ["DevBrain-snRNAseq"]: [disease],
            gene: gene
        }
    });
    const {loading: byScDataLoading, data: byScData } = useQuery<PedatasetValuesbySubclassResponse>(GET_PEDATASET_VALS_BYSC_QUERY, {
        variables: {
             dataset: disease==="DevBrain" ? ["DevBrain-snRNAseq"]: [disease],
            gene: gene
        }
    });
    const ctrows = !byCtDataLoading && byCtData  ? byCtData.getPedatasetValuesbyCelltypeQuery:[];
  
    const scrows = !byScDataLoading && byScData  ? byScData.getPedatasetValuesbySubclassQuery:[];
 
    const dotplotDataCt  = !byCtDataLoading && byCtData ? 
        ctrows.map(k=>{
            return {
                expr_frac: k.pctexp,
                mean_count: k.avgexp,
                dataset: disease==="DevBrain" ? "DevBrain-snRNAseq": k.dataset,
                gene: gene,
                celltype: k.celltype
            }
        })
      :   []

    const dotplotDataSc  = !byScDataLoading && byScData ?
        scrows.filter(s=>s.celltype!=="RB").map(k=>{
            return {
                expr_frac: k.pctexp,
                mean_count: k.avgexp,
                dataset: disease==="DevBrain" ? "DevBrain-snRNAseq": k.dataset,
                gene: gene,
                celltype: k.celltype
            }
        })
       : []
   
    return(<>
     <AppBar
                centered
                onDownloadsClicked={() => navigate("/psychscreen/downloads")}
                onHomepageClicked={() => navigate("/")}
                onAboutClicked={() => navigate("/psychscreen/aboutus")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
            <Grid container>
            <Grid item sm={12} md={12} lg={12} xl={12} style={{ marginLeft: "15em" }}>
            {disease && gene && <>
                <StyledButton btheme="light" bvariant={ctClass === "by SubClass" ? "filled": "outlined"} key={"by SubClass"} onClick={() => setCtClass("by SubClass")}>
                        by SubClass
                        </StyledButton>&nbsp;
                        {<StyledButton btheme="light" bvariant={ctClass === "by Celltype" ? "filled": "outlined"} key={"by Celltype"} onClick={() => setCtClass("by Celltype")}>
                        by Celltype
                        </StyledButton>}
                        <br/>
                        <br/>
                        <br/>
            
            <Typography type="body" size="large">
                          Disease: {disease} &nbsp; &nbsp; &nbsp; &nbsp; Gene: {gene}
            </Typography>
            <br/>
            {(byCtDataLoading || byScDataLoading)  ? 
                <CircularProgress/> : 
                <DotPlot
                    disease={disease}
                    gene={gene}
                    dotplotData={ctClass === "by SubClass" ? dotplotDataSc.filter(d=>d.dataset===( disease==="DevBrain" ? "DevBrain-snRNAseq": disease)): dotplotDataCt.filter(d=>d.dataset===( disease==="DevBrain" ? "DevBrain-snRNAseq": disease))}                
                /> 
            }
           
            </>
            }
            </Grid>
             </Grid>

    </>)
}

export default SingleCellDotPlot;