import React, { useState } from 'react';
import { GridProps, Grid, Divider } from '@mui/material';
import { AppBar, Typography } from '@zscreen/psychscreen-ui-components';
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GwasPage from './GwasPage';

const SNPDetails: React.FC<GridProps> = (props) => {
    const { snpid } = useParams();
    const navigate = useNavigate(); 
    const [ tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (_: any, newTabIndex: number) => {
        setTabIndex(newTabIndex);
    };
    return(
        <>
            <AppBar
                centered
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
            <Grid container {...props}> 
                <Grid item sm={1} lg={1.5} />
                <Grid item sm={9}>
                    <Typography type="headline" size="large" style={{ marginTop: "-0.6em", marginBottom: "0.2em" }}>
                        SNP Details: {snpid}
                    </Typography>
                </Grid>
                <Grid item sm={1} lg={1.5} />
                <Grid item sm={1} lg={1.5} />  
                <Grid item sm={9}>
                  <Box>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Genome Browser" />
                        <Tab label="eGenes" />
                        <Tab label="Regulatory Elements" />
                        <Tab label="GWAS" />
                    </Tabs>
                    <Divider/>
                  </Box>
                  <Box sx={{ padding: 2 }}>
                   { tabIndex===3 && snpid && <GwasPage id={snpid}/> }
                  </Box>
                </Grid>
            </Grid>
        </>
    )
}

export default SNPDetails;