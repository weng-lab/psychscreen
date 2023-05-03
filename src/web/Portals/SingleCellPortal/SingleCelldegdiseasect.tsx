import React, {useState, useEffect} from 'react';
import { GridProps } from '@mui/material';
import { AppBar, Typography } from '@zscreen/psychscreen-ui-components';
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { Grid, Container } from '@mui/material';
import  {DataTable} from "@weng-lab/ts-ztable";


const COLUMNS = [{
    header: "Gene",
    value: row => row.gene
},{
    header: "Base mean",
    value: row => row.baseMean
}, {
    header: "LfcSE",
    value: row => row.lfcSE
},
{
    header: "Stat",
    value: row => row.stat
  },
{
  header: "Pvalue",
  value: row => row.pvalue
},
{
    header: "Padj",
    value: row => row.padj
  }];


const SingleCelldegdiseasect: React.FC<GridProps> = (props) => {
    const navigate = useNavigate(); 
    const { disease } = useParams();
    const { celltype } = useParams();
    const [ deg, setDeg ] = useState<any>([]);
    
    useEffect( () => {
        fetch(`https://downloads.wenglab.org/${celltype}_${disease}_table.csv`)
            .then(x => x.text())
            .then((d)=>{
                
                let r =d.split("\n").filter(x=>!x.includes("pvalue")).filter(x=>x!="").map(s=>{
                    let val = s.split(",")
                    return {
                        gene: val[0].replace(/['"]+/g, ''),
                        baseMean: +val[1],
                        lfcSE: +val[2],
                        stat: +val[3],
                        pvalue: +val[4],
                        padj: +val[5],
                    }
                })
                setDeg(r)
            })
    }, [disease,celltype]);
  
    return (<>
    <AppBar
                centered
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
            <Grid>
           <Grid item sm={1}  md={1} lg={1.5} xl={1.5} />
                { <Grid item  sm={10}  md={10} lg={9} xl={9}>
                    <Container style={{ marginTop: "-10px", marginLeft: "100px" }}>
                        <Typography
                            type="display"
                            size="medium"
                            style={{ fontWeight: 700, fontSize: "36px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px"  }}
                        >
                            {celltype}
                        </Typography>
                        <br/>
                        { deg.length==0 && <Grid sm={10} md={10} lg={9} xl={9}>
                        <Typography
                            type="body"
                            size="large"
                            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                        >
                                Loading Diff. Expressed genes for {celltype}...
                        </Typography>
                        
                        </Grid>}
                        {deg && deg.length>0 &&  <Grid sm={10} md={10} lg={9} xl={9}>
                        <DataTable columns={COLUMNS} rows={deg} itemsPerPage={20} searchable/>
                        
    </Grid>}
                    </Container>
                </Grid>}
                </Grid>
                

    </>)
}

export default SingleCelldegdiseasect