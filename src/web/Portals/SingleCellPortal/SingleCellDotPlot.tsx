import React, { useState, useEffect } from 'react';
import { CircularProgress, Grid, GridProps } from '@mui/material';
import { AppBar, Typography } from '@weng-lab/psychscreen-ui-components';
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { useQuery } from '@apollo/client';
import { DOT_PLOT_QUERY } from './DotPlot';
import DotPlot from './DotPlot'
import { StyledButton } from '../DiseaseTraitPortal/DiseaseTraitDetails';

const SingleCellDotPlot: React.FC<GridProps> = (props) => {
    const navigate = useNavigate(); 
    const { disease, gene } = useParams();
    const [ ctClass, setCtClass] = useState("by SubClass")
   // const [ dataset, setDataset ] = useState(disease);
    const [ pct, setPct ] = useState<any>([]);
    const [ avgexp, setAvgexp ] = useState<any>([]);
    /*const ddata = useQuery<any>(DOT_PLOT_QUERY, {
        variables: {
            disease,
            gene
        }
    });*/
    useEffect(()=>{
        const dataset = disease==="DevBrain" ? "DevBrain-snRNAseq": disease;
        const categoryAvgexp  = ctClass==="by SubClass" ? `https://downloads.wenglab.org/psychscreen/${dataset}_avgexpression_bysubclass.txt`
         : `https://downloads.wenglab.org/psychscreen/${dataset}_avgexpression_bycelltype.txt`
         setAvgexp([])
        fetch(categoryAvgexp)
        .then(x => x.text())
        .then((x: string) => {
            const q = x.split("\n");
            const r =    q.filter(x => x !== "").filter(s=>{
                let f = s.split(",")
                return f[0] === gene

            }) 
            let e: any = []
            r.forEach(q=>{
                let y = q.split(",")
                
                if(ctClass==="by SubClass") {
                    //featurekey,Pvalb,Micro,Lamp5,L5/6 NP,Immune,Sst,L5 ET,L5 IT,Chandelier,L6 IT Car3,L4 IT,Lamp5 Lhx6,PC,
                    //Sncg,L6 IT,L2/3 IT,L6 CT,SMC,Sst Chodl,Astro,Oligo,Pax6,VLMC,Endo,Vip,OPC,L6b
                    e.push({
                        featurekey: y[0],
                        ["L2/3 IT"]: +y[1],
                        ["L4 IT"]: +y[2],
                        ["L5 IT"]: +y[3],
                        ["L6 IT"]: +y[4],
                        ["L6 IT Car3"]: +y[5],
                        ["L5 ET"]: +y[6],
                        ["L5/6 NP"]: +y[7],
                        ["L6b"]: +y[8],
                        ["L6 CT"]: +y[9],  
                        Sst: +y[10],
                        ["Sst Chodl"]: +y[11],  
                        Pvalb: +y[12],
                        Chandelier: +y[13],
                        ["Lamp5 Lhx6"]: +y[14],
                        Lamp5: +y[15] ,
                        ["Sncg"]: +y[16],
                        ["Vip"]: +y[17], 
                        ["Pax6"]: +y[18],   
                        ["Astro"]: +y[19],
                        ["Oligo"]: +y[20],
                        ["OPC"]: +y[21],
                        Micro: +y[22],
                        ["Endo"]: +y[23],
                        ["VLMC"]: +y[24],                        
                        ["PC"]: +y[25],  
                        ["SMC"]: +y[26],
                        Immune: +y[27],
                        RB: +y[28],
                    })

                } else {
                    e.push({
                        // ExcitatoryNeurons,OPCs,Astrocytes,Misc,Oligodendrocytes,Microglia,InhibitoryNeurons
                        featurekey: y[0],                        
                        ExcitatoryNeurons: +y[1],
                        InhibitoryNeurons: +y[2] ,
                        Astrocytes: +y[3] ,
                        Oligodendrocytes: +y[4],
                        OPCs: +y[5],
                        Microglia: +y[6],
                        Misc: +y[7]
                    })
                }
                
            })
            setAvgexp(e)
        })
           
    },[ctClass,gene,disease])
    useEffect( () => {
        const dataset = disease==="DevBrain" ? "DevBrain-snRNAseq": disease;
        const categoryPct  = ctClass==="by SubClass" ? 
        `https://downloads.wenglab.org/psychscreen/${dataset}_percentexpressed_bysubclass.txt` : 
        `https://downloads.wenglab.org/psychscreen/${dataset}_percentexpressed_bycelltype.txt`        
        setPct([])        
        fetch(categoryPct)
        .then(x => x.text())
        .then((x: string) => {
            const q = x.split("\n");
            const r = q.filter(x => x !== "").filter(s=>{
                let f = s.split(",")
                return f[0] === gene

            }) 
            let e: any = []
            r.forEach(q=>{
                let y = q.split(",")
                
                if(ctClass==="by SubClass") {
                    //featurekey,Pvalb,Micro,Lamp5,L5/6 NP,Immune,Sst,L5 ET,L5 IT,Chandelier,L6 IT Car3,L4 IT,Lamp5 Lhx6,PC,
                    //Sncg,L6 IT,L2/3 IT,L6 CT,SMC,Sst Chodl,Astro,Oligo,Pax6,VLMC,Endo,Vip,OPC,L6b
                    e.push({
                        featurekey: y[0],
                        ["L2/3 IT"]: +y[1],
                        ["L4 IT"]: +y[2],
                        ["L5 IT"]: +y[3],
                        ["L6 IT"]: +y[4],
                        ["L6 IT Car3"]: +y[5],
                        ["L5 ET"]: +y[6],
                        ["L5/6 NP"]: +y[7],
                        ["L6b"]: +y[8],
                        ["L6 CT"]: +y[9],  
                        Sst: +y[10],
                        ["Sst Chodl"]: +y[11],  
                        Pvalb: +y[12],
                        Chandelier: +y[13],
                        ["Lamp5 Lhx6"]: +y[14],
                        Lamp5: +y[15] ,
                        ["Sncg"]: +y[16],
                        ["Vip"]: +y[17], 
                        ["Pax6"]: +y[18],   
                        ["Astro"]: +y[19],
                        ["Oligo"]: +y[20],
                        ["OPC"]: +y[21],
                        Micro: +y[22],
                        ["Endo"]: +y[23],
                        ["VLMC"]: +y[24],                        
                        ["PC"]: +y[25],  
                        ["SMC"]: +y[26],
                        Immune: +y[27],
                        RB: +y[28],
                    })

                } else {
                    e.push({
                        // ExcitatoryNeurons,OPCs,Astrocytes,Misc,Oligodendrocytes,Microglia,InhibitoryNeurons
                        featurekey: y[0],                        
                        ExcitatoryNeurons: +y[1],
                        InhibitoryNeurons: +y[2] ,
                        Astrocytes: +y[3] ,
                        Oligodendrocytes: +y[4],
                        OPCs: +y[5],
                        Microglia: +y[6],
                        Misc: +y[7],
                        
                    })
                }
                
            })
            setPct(e)
        })
    }, [ctClass,gene,disease]);
    const dataset = disease==="DevBrain" ? "DevBrain-snRNAseq": disease;
    const dotplotData  = pct && avgexp && pct.length>0 && avgexp.length>0 ? { singleCellBoxPlotQuery : 
        Object.keys(pct[0]).filter(k=>k!=="featurekey").map(k=>{
            return {
                expr_frac: pct[0][k],
                mean_count: avgexp[0][k],
                disease: dataset ,
                gene: gene,
                celltype: k
            }
        })
    }   : { singleCellBoxPlotQuery:  []}
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
            {dotplotData && dotplotData.singleCellBoxPlotQuery.length>0 ? 
                <DotPlot disease={disease} gene={gene} dotplotData={dotplotData}/> : <CircularProgress/>
            }
           
            </>
            }
            </Grid>
             </Grid>

    </>)
}

export default SingleCellDotPlot;