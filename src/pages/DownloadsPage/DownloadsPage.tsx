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
                <a href="https://storage.googleapis.com/gcp.wenglab.org/adult-bCREs.bed" download style={{ textDecoration: "none" }}>
                    <Button bvariant="filled" btheme="light">
                        <DownloadIcon /> Adult brain cCREs
                    </Button>
                </a>&nbsp;
                <a href="https://storage.googleapis.com/gcp.wenglab.org/fetal-bCREs.bed" download style={{ textDecoration: "none" }}>
                    <Button bvariant="filled" btheme="light">
                        <DownloadIcon /> Fetal brain cCREs
                    </Button>
                </a>
            </Container>
        </>
    );
};
export default DownloadsPage;
