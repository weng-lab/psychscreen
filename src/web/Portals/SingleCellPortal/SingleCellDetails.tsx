import React from 'react';
import { GridProps } from '@mui/material';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";

const SingleCellDetails: React.FC<GridProps> = (props) => {
    const { disease } = useParams();
    const navigate = useNavigate(); 
    return(
        <>
            <AppBar
                centered
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
        </>
    )
}

export default SingleCellDetails;