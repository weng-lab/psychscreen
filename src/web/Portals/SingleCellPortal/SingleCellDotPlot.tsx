import React from 'react';
import { GridProps } from '@mui/material';
import { AppBar, Typography } from '@zscreen/psychscreen-ui-components';
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
//import DotPlot from './DotPlot'

const SingleCellDotPlot: React.FC<GridProps> = (props) => {
    const navigate = useNavigate(); 
    const { disease, gene } = useParams();
    return(<>
     <AppBar
                centered
                onDownloadsClicked={() => navigate("/psychscreen/downloads")}
                onHomepageClicked={() => navigate("/")}
                onAboutClicked={() => navigate("/psychscreen/aboutus")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
            {disease && gene && <>
            
            <Typography type="body" size="large">
                          Disease: {disease} &nbsp; &nbsp; &nbsp; &nbsp; Gene: {gene}
            </Typography>
            <br/>
            {
                //<DotPlot disease={disease} gene={gene}/>
            }
            </>
            }

    </>)
}

export default SingleCellDotPlot;