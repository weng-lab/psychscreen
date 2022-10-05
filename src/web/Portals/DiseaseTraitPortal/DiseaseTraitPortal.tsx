/**
 * DiseaseTraitPortal.tsx: the disease/trait portal page.
 */

import React, { useState } from 'react';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Container, GridProps, Slide } from '@mui/material';
import DiseaseTrait from '../../../assets/disease-trait.png';
import { TabletAppBar } from '@zscreen/psychscreen-ui-components';
import { Typography } from '@zscreen/psychscreen-ui-components';
import CheckIcon from '@mui/icons-material/Check';
import { SearchBox, HorizontalCard } from '@zscreen/psychscreen-ui-components';
import { useTheme, useMediaQuery } from '@material-ui/core';
import { PORTALS } from '../../../App';
import { Logo } from '../../../mobile-portrait/HomePage/HomePage';
 

export const DISEASE_CARDS = [{val: "ADHD_Demontis2018", cardLabel: "Attention deficit hyperactive disorder", cardDesc: "Description"},
{val: "AgeFirstBirth", cardLabel: "Age at birth of first child", cardDesc: "Description"},
{val: "Alzheimers_Jansen2019", cardLabel: "Alzheimers", cardDesc: "Description"},
{val: "Anorexia", cardLabel: "Anorexia", cardDesc: "Description"},
{val: "Autism", cardLabel: "Autism spectrum disorder", cardDesc: "Description"},

{val: "BDSCZ_Ruderfer2018", cardLabel: "Schizophrenia", cardDesc: "Description"},
{val: "BMI1", cardLabel: "BMI", cardDesc: "Description"},
{val: "CigarettesPerDay_Liu2019", cardLabel: "Cigarettes smoked per day", cardDesc: "Description"},
{val: "Ever_Smoked", cardLabel: "History of smoking", cardDesc: "Description"},
{val: "GeneralRiskTolerance_KarlssonLinner2019", cardLabel: "General risk tolerance", cardDesc: "Description"},

{val: "Insomnia_Jansen2019", cardLabel: "Insomnia", cardDesc: "Description"},
{val: "Intelligence_SavageJansen2018", cardLabel: "Intelligence", cardDesc: "Description"},
{val: "NumberChildrenEverBorn", cardLabel: "Number of children", cardDesc: "Description"},
{val: "ReactionTime_Davies2018", cardLabel: "Reaction Time", cardDesc: "Description"},
{val: "SleepDuration_Dashti2019", cardLabel: "Sleep Duration", cardDesc: "Description"},
{val: "Years_of_Education1", cardLabel: "Years of Education", cardDesc: "Description"},
]

const DiseaseTraitPortal: React.FC<GridProps> = (props: GridProps) => {
    const { state }: any = useLocation();
    const { searchvalue } = state ? state : { searchvalue: ''} 
    const navigate = useNavigate(); 
    const [ val, setVal ] = useState<string>(searchvalue)         
    const [diseaseCards, setdiseaseCards] = useState<{cardLabel: string, val: string, cardDesc: string}[] | undefined>(searchvalue!=='' ? DISEASE_CARDS.filter(d=>d.cardLabel.toLowerCase().includes(val.toLowerCase())):  undefined)    
    const theme = useTheme();
    return (
        <>
            {  //show vertical app bar only for mobile view 
                useMediaQuery(theme.breakpoints.down('xs')) ? 
                    <TabletAppBar
                        onDownloadsClicked={() => navigate("/psychscreen/downloads")}
                        onHomepageClicked={() => navigate("/")}
                        onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                        style={{ marginBottom: "63px" }}
                        title={<Logo /> as any}
                    />
                    :<AppBar
                        centered={true}
                        onDownloadsClicked={() => navigate("/downloads")}
                        onHomepageClicked={() => navigate("/")}
                        onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                    /> 
            }           
            <Grid container {...props}> 
                <Grid item sm={0}  md={1} lg={2} xl={2}></Grid>
                <Grid item sm={8} md={6} lg={5} xl={4}>
                    {useMediaQuery(theme.breakpoints.down('sm')) && <Container style={{ marginTop: "130px" }}>
                            <img alt="disease/trait portal" src={DiseaseTrait} style={{ width: "70%" ,height: "100%" }} />
                    </Container>}
                    <Container  style={{ width:"741px", marginTop: "147px" }} fixed>
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
                                    setdiseaseCards(DISEASE_CARDS.filter(d=>d.cardLabel.toLowerCase().includes(val.toLowerCase())))
                                }
                            }}                
                            helperText={"e.g. schizophrenia, years of education"}                            
                        />
                    </Container>
                    {useMediaQuery(theme.breakpoints.down('sm')) && diseaseCards && <Slide direction="up" in timeout={1000}>
                            <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                <HorizontalCard width={500}
                                    onCardClick={(v?: string) => {
                                        navigate(`/psychscreen/traits/${v}`, { state: { searchvalue: val } })
                                    }}
                                    cardContentText={diseaseCards} 
                                />            
                            </Container>
                        </Slide> 
                    }
                </Grid>
                {useMediaQuery(theme.breakpoints.up('md'))  && <Grid item sm={4} md={4} lg={3} xl={3}>
                    {!diseaseCards ? ( 
                            <Container style={{ marginTop: "170px" }}>
                                <img alt="disease/trait portal" src={DiseaseTrait} style={{ width: "100%" ,height: "100%" }} />
                            </Container>
                        ):( 
                            <Slide direction="up" in timeout={1000}>
                                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                    <HorizontalCard width={500}
                                        onCardClick={(v?: string) => {
                                            navigate(`/psychscreen/traits/${v}`, { state: { searchvalue: val } })
                                        }}
                                        cardContentText={diseaseCards} 
                                    />            
                                </Container>
                            </Slide>              
                        )}
                </Grid>}
                <Grid item sm={0} md={1} lg={2} xl={3} ></Grid>
            </Grid>
        </>
    );
};
export default DiseaseTraitPortal;
