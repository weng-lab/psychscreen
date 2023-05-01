import React, {useState, useCallback} from 'react';
import { GridProps } from '@mui/material';
import { AppBar, Typography, SearchBox, HorizontalCard, Button, CustomizedTable } from '@zscreen/psychscreen-ui-components';
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { Grid, Container, Slide } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';


const celltypedata = [[{header:'TF', value: "RXRG" },{header:'enhancer', value:'chr1:1019276-1019776'},
{header:'promoter', value: "chr1:958584-960584" },{header:'TG', value:'KLHL17'},
{header:'CRE', value: "proximal" }],
[{header:'TF', value: "NR4A2" },{header:'enhancer', value:'chr1:1019276-1019776'},
{header:'promoter', value: "chr1:958584-960584" },{header:'TG', value:'KLHL17'},
{header:'CRE', value: "proximal" }],

[{header:'TF', value: "THRB" },{header:'enhancer', value:'chr1:1019276-1019776'},
{header:'promoter', value: "chr1:958584-960584" },{header:'TG', value:'KLHL17'},
{header:'CRE', value: "proximal" }],

[{header:'TF', value: "IRF1" },{header:'enhancer', value:'chr1:925367-925867'},
{header:'promoter', value: "chr1:1000172-1002172" },{header:'TG', value:'HES4'},
{header:'CRE', value: "proximal" }]]


const SingleCellGeneRegulatoryDatasets: React.FC<GridProps> = (props) => {
    const navigate = useNavigate(); 
    const { celltype } = useParams();
  
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
                        
                        <Grid sm={10} md={10} lg={9} xl={9}>
                        <CustomizedTable tabledata={celltypedata}/>
                        
                        </Grid>
                    </Container>
                </Grid>}
                </Grid>
                

    </>)
}

export default SingleCellGeneRegulatoryDatasets;