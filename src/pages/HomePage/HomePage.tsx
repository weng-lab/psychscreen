/**
 * HomePage.tsx: the app home page.
 */

import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/system';
import { Alert, Grid } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

import { AppBar, Typography } from '@zscreen/psychscreen-ui-components';

import BRAIN from '../../assets/brain.png';
import { PORTALS } from '../../App';

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    return (
        <>
            <AppBar
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(PORTALS[index][0])}
                style={{ marginBottom: "63px" }}
            />
            <Grid container>
                <Grid item sm={6}>
                    <Container style={{ marginTop: "147px", marginLeft: "100px", width: "741px" }}>
                        <Typography
                            type="display"
                            size="medium"
                            style={{ fontWeight: 700, fontSize: "48px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px" }}
                        >
                            Explore the genetics and epigenetics of human brain development, function, and pathophysiology.
                        </Typography>
                        <Typography
                            type="body"
                            size="large"
                            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px", marginBottom: "4px" }}
                        >
                            <BoltIcon style={{ marginRight: "9px" }} /> Powered by the PsychENCODE Consortium
                        </Typography>
                        <Typography
                            type="body"
                            size="large"
                            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px", marginBottom: "14px" }}
                        >
                            <AccessibilityNewIcon style={{ marginRight: "9px" }} /> Accessible to all
                        </Typography>
                        <Alert severity='info'>
                            <Typography
                                type="title"
                                size="large"
                            >
                                This page is in development.
                            </Typography>
                            <Typography
                                type="body"
                                size="medium"
                            >
                                Use the "downloads" link at the top right to download some analysis results, including a set of
                                brain-active cis-regulatory elements.
                            </Typography>
                        </Alert>
                    </Container>
                </Grid>
                <Grid item sm={6}>
                    <Container style={{ marginTop: "63px" }}>
                        <img src={BRAIN} style={{ width: "75%" }} />
                    </Container>
                </Grid>
            </Grid>
        </>
    );
};
export default HomePage;
