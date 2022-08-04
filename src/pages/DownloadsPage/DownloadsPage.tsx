/**
 * DownloadsPage.tsx: contains links to various PsychSCREEN downloads.
 */

import React from 'react';
import { Typography, Button, AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/system';
import DownloadIcon from '@mui/icons-material/Download';

const DownloadsPage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <AppBar
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
            />
            <Container style={{ marginTop: "5em", marginLeft: "6em", width: "40%" }}>
                <Typography
                    type="display"
                    size="small"
                >
                    Downloads
                </Typography>
                <div style={{ height: "2em" }} />
                <Button primary variant="contained">
                    <DownloadIcon /> Adult brain cCREs
                </Button>&nbsp;
                <Button primary variant="contained">
                    <DownloadIcon /> Fetal brain cCREs
                </Button>
            </Container>
        </>
    );
};
export default DownloadsPage;
