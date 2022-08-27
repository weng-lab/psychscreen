import React from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import BoltIcon from '@mui/icons-material/Bolt';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import { Typography, SearchBoxWithSelect } from '@zscreen/psychscreen-ui-components';

import BRAIN from '../../assets/brain.png';

const PORTAL_SELECT_OPTIONS = [
    { value: "disease/trait", name: "Disease/Trait", helperText: "e.g. schizophrenia, years of education" },
    { value: "gene/bcre", name: "Gene/bCRE", helperText: "e.g. APOE, SOX4" },
    { value: "snp/qtl", name: "SNP/QTL", helperText: "e.g. rs2836883, rs7690700" }
];

const MainPanel: React.FC<GridProps> = props => (
    <Grid {...props} container>
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
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px", marginBottom: "56px" }}
                >
                    <AccessibilityNewIcon style={{ marginRight: "9px" }} /> Accessible to all
                </Typography>
                <SearchBoxWithSelect
                    selectOptions={PORTAL_SELECT_OPTIONS}
                    style={{ marginBottom: "14px" }}
                />
            </Container>
        </Grid>
        <Grid item sm={6}>
            <Container style={{ marginTop: "63px" }}>
                <img src={BRAIN} style={{ width: "75%" }} />
            </Container>
        </Grid>
    </Grid>
);
export default MainPanel;
