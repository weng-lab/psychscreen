import React from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Typography } from '@zscreen/psychscreen-ui-components';

import DiseaseTrait from '../../assets/disease-trait.png';
import GeneBCRE from '../../assets/gene-bcre.png';
import SNPQTL from '../../assets/snp-qtl.png';
import SingleCell from '../../assets/single-cell.png';
import { useNavigate } from 'react-router-dom';

const DiseaseTraitPortalPanel: React.FC<GridProps> = props => {
    const navigate = useNavigate();  
    
    return(
    <Grid container {...props}>
        <Grid item sm={12}>
            <Container style={{ marginLeft: "160px", width: "741px" }}>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "32px", lineHeight: "38.4px", fontWeight: 700 }}
                >
                    Portals
                </Typography>
            </Container>
        </Grid>
        <Grid item sm={6}>
            <Container style={{ marginLeft: "160px", marginTop: "111px", width: "508px", paddingLeft: "50px" }}>
                <img src={DiseaseTrait} style={{ width: "100%" }} />
            </Container>
        </Grid>
        <Grid item sm={6}>
            <Container style={{ marginTop: "140px" }}>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "20px", lineHeight: "24.4px", fontWeight: 700, letterSpacing: "1%", marginBottom: "40px" }}
                >
                    Disease/Trait Portal
                </Typography>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "414px" }}
                >
                    Explore heritability enrichment for 40 distinct psychiatric, behavioral, and neuronal traits within gene regulatory features,
                    such as bCREs and quantitative trait loci (QTLs). Search genes associated with complex traits based on PsychENCODE TWAS.
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> 40 total traits cataloged
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px", marginBottom: "40px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> 1,103 bCRE/trait associations
                </Typography>
                <Button bvariant="filled" btheme="light" onClick={()=>{ navigate("/psychscreen/traits")}} >Explore Diseases/Traits</Button>
            </Container>
        </Grid>
    </Grid>
)};

const GeneBCREPortalPanel: React.FC<GridProps> = props => (
    <Grid container {...props}>
        <Grid item sm={5}>
            <Container style={{ marginLeft: "200px" }}>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "20px", lineHeight: "24.4px", fontWeight: 700, letterSpacing: "1%", marginBottom: "40px" }}
                >
                    Gene/bCRE Portal
                </Typography>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "414px" }}
                >
                    Explore gene expression and regulatory element activity in the fetal and adult brain at bulk and single-cell resolution. Visualize gene/bCRE
                    links based on PsychENCODE QTLs and single cell co-expression analyses.
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> Gene expression in 11 brain regions
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> 23 fetal, adolescent, and adult time points covered
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px", marginBottom: "40px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> 761,984 brain regulatory elements
                </Typography>
                <Button bvariant="filled" btheme="light">Explore Genes/bCREs</Button>
            </Container>
        </Grid>
        <Grid item sm={4}>
            <Container style={{ width: "508px", paddingLeft: "50px" }}>
                <img src={GeneBCRE} style={{ width: "100%" }} />
            </Container>
        </Grid>
    </Grid>
);

const SNPQTLPortalPanel: React.FC<GridProps> = props => (
    <Grid container {...props}>
        <Grid item sm={6}>
            <Container style={{ marginLeft: "160px", marginTop: "111px", width: "508px", paddingLeft: "100px" }}>
                <img src={SNPQTL} style={{ width: "120%" }} />
            </Container>
        </Grid>
        <Grid item sm={6}>
            <Container style={{ marginTop: "140px" }}>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "20px", lineHeight: "24.4px", fontWeight: 700, letterSpacing: "1%", marginBottom: "40px" }}
                >
                    SNP/QTL Portal
                </Typography>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "414px" }}
                >
                    Search SNPs of interest and explore their impact on gene expression, chromatin accessibility, transcription factor (TF) binding
                    and other molecular traits in the human brain based on PsychENCODE QTLs and sequence analysis of bCREs. Link SNPs to complex traits
                    using GWAS annotations.
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> 441,502 eQTLs, sQTLs, caQTLs, and fQTLs
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> 13,336 variants associated with complex traits
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px", marginBottom: "40px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> 510,062 variants in bCREs
                </Typography>
                <Button bvariant="filled" btheme="light">Explore SNPs/QTLs</Button>
            </Container>
        </Grid>
    </Grid>
);

const SingleCellPortalPanel: React.FC<GridProps> = props => (
    <Grid container {...props}>
        <Grid item sm={5}>
            <Container style={{ marginLeft: "200px" }}>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "20px", lineHeight: "24.4px", fontWeight: 700, letterSpacing: "1%", marginBottom: "40px" }}
                >
                    Single-Cell Portal
                </Typography>
                <Typography
                    type="body"
                    size="medium"
                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "414px" }}
                >
                    Visualize the single cell composition of the human brain based on single cell ATAC-seq and RNA-seq from PsychENCODE and public
                    sources. Identify marker genes and bCREs specific to particular cell types and states.
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> Transcriptomes for 1,391,772 single cells
                </Typography>
                <Typography
                    type="body"
                    size="large"
                    style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px", marginBottom: "40px" }}
                >
                    <CheckIcon style={{ marginRight: "9px" }} /> Chromatin accessibility for 1,009,942 single cells
                </Typography>
                <Button bvariant="filled" btheme="light">Explore Single Cells</Button>
            </Container>
        </Grid>
        <Grid item sm={4}>
            <Container style={{ width: "508px", paddingLeft: "50px" }}>
                <img src={SingleCell} style={{ width: "100%" }} />
            </Container>
        </Grid>
    </Grid>
);

const PortalsPanel: React.FC<GridProps> = props => (
    <>
        <DiseaseTraitPortalPanel {...props} />
        <GeneBCREPortalPanel style={{ marginTop: "216px" }} />
        <SNPQTLPortalPanel style={{ marginTop: "156px" }} />
        <SingleCellPortalPanel style={{ marginTop: "176px" }} />
    </>
);
export default PortalsPanel;