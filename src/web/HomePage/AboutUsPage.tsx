import React from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import AboutUsPanel from './AboutUsPanel'
import { useNavigate } from 'react-router-dom';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { PORTALS } from '../../App';
const AboutUsPage: React.FC<GridProps> = props => {
    const navigate = useNavigate();
    return (
    <>
    <AppBar
                    onDownloadsClicked={() => navigate("/psychscreen/downloads")}
                    onHomepageClicked={() => navigate("/")}
                    onAboutClicked={() => navigate("/psychscreen/aboutus")}
                    onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                    style={{ marginBottom: "63px" }}
                    centered={true}
                />
                <AboutUsPanel/>
    </>)
    
}

export default AboutUsPage;