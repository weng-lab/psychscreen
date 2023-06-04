import React from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { Button, Typography } from '@zscreen/psychscreen-ui-components';

import DiseaseTrait from '../../assets/disease-trait.png';
import GeneBCRE from '../../assets/gene-bcre.png';
import SNPQTL from '../../assets/snp-qtl.png';
import SingleCell from '../../assets/single-cell.png';
import { useNavigate } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme, useMediaQuery } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {      
      [theme.breakpoints.up('xl')]: {
        paddingLeft: "90px"
      },
      [theme.breakpoints.between('md','lg')]: {
        paddingLeft: "40px"
      }
    }    
}));

const DiseaseTraitPortalPanel: React.FC<GridProps> = props => {
    const navigate = useNavigate();      
    const classes = useStyles();
    return (
        <Grid container {...props}>
            <Grid item xs={0} sm={1}  md={0} lg={1} xl={2}></Grid>
            <Grid item xs={12} sm={11} md={0} lg={11} xl={10}>          
                <Typography
                    type="body"
                    size="medium"
                    className={classes.root}
                    style={{ fontSize: "32px", lineHeight: "38.4px", fontWeight: 700 }}
                >
                    Portals
                </Typography>
            </Grid>
            <Grid item xs={0} sm={0}  md={0} lg={1} xl={2}></Grid>
            <Grid item xs={12} sm={12} md={8} lg={6} xl={5}>
                <Container style={{ marginTop: "111px", width: "508px" }}>
                    <img alt="Disease/Trait Portal" src={DiseaseTrait} style={{ width: "90%" }} />
                </Container>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                <Container style={{ marginTop: "140px", width: "508px" }}>
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
            <Grid item xs={0} sm={0} md={0} lg={1} xl={2} ></Grid>
        </Grid>
    );
};

const GeneBCREPortalPanel: React.FC<GridProps> = props => {
    const theme = useTheme();
    const navigate = useNavigate();      
    return (
        <Grid container {...props}>
            <Grid item  xs={0} sm={0} md={0} lg={1} xl={2}></Grid>
            {
                useMediaQuery(theme.breakpoints.down('sm'))
                    ? (
                        <>
                            <Grid item xs={12} sm={12} md={4} lg={5} xl={3}>
                                <Container style={{ width: "508px" }}>
                                    <img alt="Gene bCRE portal" src={GeneBCRE} style={{ width: "80%" }} />
                                </Container><br/><br/>
                            </Grid>
                            <Grid item xs={12} sm={12} md={8} lg={5} xl={5}>
                                <Container style={{ marginLeft: "110px",  width: "508px" }}>
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
                                    <Button bvariant="filled" btheme="light" onClick={()=>{ navigate("/psychscreen/gene")}}>Explore Genes/bCREs</Button>
                                </Container>
                            </Grid> 
                        </>
                    ) : (
                        <>                
                            <Grid item xs={12} sm={12} md={8} lg={5} xl={5}>
                                <Container style={{ marginLeft: "70px",  width: "508px" }}>
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
                                    <Button bvariant="filled" btheme="light"   onClick={()=>{ navigate("/psychscreen/gene")}}>Explore Genes/bCREs</Button>
                                </Container>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={5} xl={3}>
                                <Container style={{ width: "508px" }}>
                                    <img alt="Gene bCRE portal" src={GeneBCRE} style={{ width: "90%" }} />
                                </Container>
                            </Grid>
                        </>
                    )
                }
            <Grid item xs={0} sm={0} md={0} lg={1} xl={2} ></Grid>
        </Grid>
    );
};

const SNPQTLPortalPanel: React.FC<GridProps> = props => {
    const navigate = useNavigate();      
    return(
    <Grid container {...props}>
        <Grid item xs={0} sm={0}  md={0} lg={1} xl={2}></Grid>
        <Grid item xs={12} sm={12} md={8} lg={6} xl={5}>
            <Container style={{ marginTop: "111px", width: "508px"}}>
                <img alt="SNP/QTL Portal" src={SNPQTL} style={{ width: "80%" }} />
            </Container>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
            <Container style={{ marginTop: "140px",  width: "508px" }}>
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
                <Button bvariant="filled" btheme="light"   onClick={()=>{ navigate("/psychscreen/snp")}}>Explore SNPs/QTLs</Button>
            </Container>
        </Grid>
        <Grid item xs={0} sm={0} md={0} lg={1} xl={2} ></Grid>
    </Grid>
)};

const SingleCellPortalPanel: React.FC<GridProps> = props => {
   const theme = useTheme();
   const navigate = useNavigate();      
   return (
    <Grid container {...props}>
        <Grid item xs={0} sm={0} md={0} lg={1} xl={2}></Grid>
        { useMediaQuery(theme.breakpoints.down('sm')) ? 
            <>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                    <Container style={{ width: "408px" }}>
                        <img alt="single cell portal" src={SingleCell} style={{ width: "100%" }} />
                    </Container><br/><br/>
                </Grid>
                <Grid item xs={12} sm={12} md={8} lg={6} xl={5}>
                    <Container style={{ marginLeft: "120px",  width: "508px" }}>
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
                        <Button bvariant="filled" btheme="light"  onClick={()=>{ navigate("/psychscreen/single-cell")}}>Explore Single Cells</Button>
                    </Container>
                </Grid>
            </> : 
            <>
                <Grid item xs={12} sm={12} md={8} lg={6} xl={5}>
                    <Container style={{ marginLeft: "70px",  width: "508px" }}>
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
                        <Button bvariant="filled" btheme="light" onClick={()=>{ navigate("/psychscreen/single-cell")}}>Explore Single Cells</Button>
                    </Container>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={3}>
                    <Container style={{ width: "508px",  marginLeft: "40px" }}>
                        <img alt="single cell portal" src={SingleCell} style={{ width: "80%" }} />
                    </Container>
                </Grid>
            </>
        }
        <Grid item xs={0} sm={0} md={0} lg={1} xl={2} ></Grid>
    </Grid>
)};

const PortalsPanel: React.FC<GridProps> = props => (
    <>
        <DiseaseTraitPortalPanel {...props} />
        <GeneBCREPortalPanel style={{ marginTop: "216px" }} />
        <SNPQTLPortalPanel style={{ marginTop: "156px" }} />
        <SingleCellPortalPanel style={{ marginTop: "176px" }} />
    </>
);
export default PortalsPanel;
