/**
 * DiseaseTraitPortal.tsx: the disease/trait portal page.
 */

import React, { useState } from 'react';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Container, GridProps, Slide } from '@mui/material';
import DiseaseTrait from '../../../assets/disease-trait.png';
import { Typography } from '@zscreen/psychscreen-ui-components';
import CheckIcon from '@mui/icons-material/Check';
import { SearchBox, HorizontalCard } from '@zscreen/psychscreen-ui-components';
//import HorizontalCard  from './HorizontalCard';

const DISEASE_CARDS = [{cardLabel: "Schizophrenia", val: "Schizophrenia", cardDesc: "Description"},
{cardLabel: "Schizoaffective disorder", val: "Schizoaffective disorder", cardDesc: "Description"},
{cardLabel: "Schizoid Personality disorder", val: "Schizoid Personality disorder", cardDesc: "Description"},
{cardLabel: "Schizophreniform disorder", val: "Schizophreniform disorder", cardDesc: "Description"},
{cardLabel: "Schizoid Personality disorder", val: "Schizoid Personality disorder", cardDesc: "Description"}]

const DiseaseTraitPortal: React.FC<GridProps> = (props: GridProps) => {
    const { state }: any = useLocation();
    const { searchvalue } = state ? state : { searchvalue: ''} 
    const navigate = useNavigate(); 
    const [ val, setVal ] = useState<string>(searchvalue)         
    const [diseaseCards, setdiseaseCards] = useState<{cardLabel: string, val: string, cardDesc: string}[] | undefined>(searchvalue!=='' ? DISEASE_CARDS:  undefined)
    
    return (
        <>
            <AppBar
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
            />
            <Grid container {...props}> 
            <Grid item sm={6}>
                <Container style={{ marginTop: "147px", marginLeft: "100px", width: "741px" }}>
                    <Typography
                        type="display"
                        size="medium"
                        style={{ fontWeight: 700, fontSize: "48px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px" }}
                    >
                        Disease/Trait Portal
                    </Typography>
                    <br/>
                    <Typography
                        type="body"
                        size="large"
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
                    <SearchBox
                        value={val}
                        onChange={e => { 
                            if(e.target.value===''){
                                setdiseaseCards(undefined)
                            }
                            setVal(e.target.value)                            
                        }}
                        onClick={() => {                             
                            if(val !== ''){                                    
                                setdiseaseCards(DISEASE_CARDS)
                            }
                        }}                
                        helperText={"e.g. schizophrenia, years of education"}                            
                    />
                </Container>
            </Grid>
            <Grid item xs={6}>
                {!diseaseCards ? 
                ( 
                    <Container style={{ marginTop: "130px" }}>
                        <img alt="disease/trait portal" src={DiseaseTrait} style={{ width: "60%" ,height: "100%" }} />
                    </Container>
                )
                : ( 
                    <Slide direction="up" in timeout={1000}>
                        <Container style={{ marginLeft: "12px", marginTop: "170px" }}>            
                            <HorizontalCard width={600}
                                onCardClick={(v?: string) => {
                                    navigate(`/psychscreen/traits/${v}`, { state: { searchvalue: val } })
                                }}
                                cardContentText={diseaseCards} 
                            />            
                        </Container>
                    </Slide>              
                )}
            </Grid>
        </Grid>
        </>
    );
};
export default DiseaseTraitPortal;
