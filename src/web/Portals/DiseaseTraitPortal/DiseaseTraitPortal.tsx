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
 

export const DISEASE_CARDS = [{val: "ADHD", cardLabel: "Attention deficit hyperactive disorder", cardDesc: "", diseaseDesc: "Attention deficit hyperactive disorder (ADHD) is a neurodevelopmental psychiatric disease usually diagnosed in childhood and characterized by trouble paying attention, controlling impulses, or being overly active that affects about 5% of children and 2.5% of adults. Twin studies suggest ADHD is approximately 70% heritable and shares genetic risk with other psychiatric conditions, including mood disorders, schizophrenia, and autism spectrum disorder. Treatment of ADHD involves behavioral therapy and medications, usually stimulants."},
{val: "AgeFirstBirth", cardLabel: "Age at birth of first child", cardDesc: "", diseaseDesc: "The mother’s age when she has her first child."},
{val: "Alzheimers", cardLabel: "Alzheimers", cardDesc: "", diseaseDesc: "Alzheimer’s disease is a neurodegenerative disease beginning with mild and progressively worsening memory loss that affects approximately 6% of people over age 65. It is the most common cause of dementia and symptoms include problems with recent memory, language, disorientation, mood swings, self-neglect and behavioral issues. Alzheimer’s disease has complex risk factors, including APOE mutations, advanced age, environmental factors, and common genetic variants. Medications can help with some symptoms and new treatments promising to slow disease progression are emerging, but their efficacy in clinical use remains unclear."},
{val: "Anorexia", cardLabel: "Anorexia", cardDesc: "", diseaseDesc: "Anorexia nervosa (often simply anorexia) is an eating disorder characterized by food restriction, body image problems, fear of weight gain, and low weight that affects women more than men. Cultural, social, and genetic factors play a role, and identical twins are more often both affected than fraternal twins. Therapy is the mainstay of treatment although medications may be used for concomitant depression or anxiety."},
{val: "ASD", cardLabel: "Autism spectrum disorder", cardDesc: "", diseaseDesc: "Autism spectrum disorder is a range of neurodevelopmental diseases that involve difficulties in social communication, repetitive behaviors, restricted interests and sensory reactivity. Autism has a strong genetic basis and several rare genetic abnormalities are highly causative; however, many common variants also confer risk of the disease. Autism commonly co-occurs with other neurologic, psychiatric or congenital abnormalities and shares genetic risk variants with other psychiatric diseases."},
{val: "BipolarDisorder", cardLabel: "BipolarDisorder", cardDesc: "", diseaseDesc: "Bipolar disorder is a mood disorder characterized by bouts of depression intermixed with episodes of mania or hypomania. During manic episodes, people experience elated moods, happiness, and sometimes make impulsive decisions. There is a strong genetic basis to bipolar disorder and environmental factors also play a role. Medical therapy including mood stabilizers and anticonvulsants are the mainstay of treatment, supported by therapy."},
{val: "Schizophrenia", cardLabel: "Schizophrenia", cardDesc: "", diseaseDesc: "Schizophrenia is a psychiatric disease characterized by psychosis, a state of altered mental status with symptoms including hallucinations, delusions, disorganized thinking. Other symptoms include social withdrawal, apathy and decreased emotional expression. Schizophrenia affects approximately 0.5% of people. Genetic and environmental factors play a role in developing schizophrenia and over one hundred genetic variants have been associated with the disease. Medical treatment involves antipsychotics which primarily act as dopamine antagonists."},
{val: "BMI", cardLabel: "BMI", cardDesc: "", diseaseDesc: "A person’s body mass index (BMI) – weight divided by height-squared (in kilograms and meters)."},
{val: "CigsPerDay", cardLabel: "Cigarettes smoked per day", cardDesc: "", diseaseDesc: "The number of cigarettes a cigarette smoker has per day. This averages around 15 but is skewed by people who smoke many cigarettes per day."},
{val: "EverSmoked", cardLabel: "History of smoking", cardDesc: "", diseaseDesc: "Whether someone has ever smoked. Smoking as a behavior is affected by personality, upbringing, social and cultural factors, and genetics to some extent. "},
//{val: "GeneralRiskTolerance_KarlssonLinner2019", cardLabel: "General risk tolerance", cardDesc: "Description"},
{val: "Insomnia", cardLabel: "Insomnia", cardDesc: "", diseaseDesc: "Insomnia is a sleep disorder characterized by difficulty falling asleep or staying asleep, and often involves daytime sleepiness, low energy, and depressed mood. Genetic and environmental risk factors play a role. Treatments for insomnia include sleep hygiene, lifestyle changes such as reducing caffeine or alcohol consumption or increasing exercise, and medications including melatonin agonists or central nervous system depressants. Approximately 6% of people are affected by insomnia that lasts more than a month and is not due to another primary cause."},
{val: "Intelligence", cardLabel: "Intelligence", cardDesc: "", diseaseDesc: "As measured by an assessment of “fluid intelligence,” this describes a capacity to solve problems that require logic and reasoning and do not depend on prior knowledge. "},
//{val: "NumberChildrenEverBorn", cardLabel: "Number of children", cardDesc: "Description"},
{val: "ReactionTime", cardLabel: "Reaction Time", cardDesc: "", diseaseDesc: "This category examines the genetics of reaction time as measured by 12 rounds of a card game, “Snap.” A participant is shown two cards at a time. If both cards are the same, they press a button as quickly as possible. "},
{val: "SleepDuration", cardLabel: "Sleep Duration", cardDesc: "", diseaseDesc: "The number of hours of sleep per day a person gets. On average, people sleep a little more than 7 hours a day, with most people sleeping between 6 to 8 hours on average."},
{val: "YearsEducation", cardLabel: "Years of Education", cardDesc: "", diseaseDesc: "The level of education of people in the United Kingdom, ranging from little or no formal education to advanced professional degrees. "},
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
                    {useMediaQuery(theme.breakpoints.down('sm')) && diseaseCards && diseaseCards.length>0 && <Slide direction="up" in timeout={1000}>
                            <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                <HorizontalCard width={500}
                                    onCardClick={(v?: string) => {
                                        let d = DISEASE_CARDS.find(d=>d.val===v)?.diseaseDesc
                                        navigate(`/psychscreen/traits/${v}`, { state: { searchvalue: val, diseaseDesc: d } })
                                    }}
                                    cardContentText={diseaseCards} 
                                />            
                            </Container>
                        </Slide> 
                    }
                    {useMediaQuery(theme.breakpoints.down('sm')) && diseaseCards && diseaseCards.length===0 &&
                            <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                 No results found             
                            </Container>
                         
                    }
                </Grid>
                {useMediaQuery(theme.breakpoints.up('md'))  && <Grid item sm={4} md={4} lg={3} xl={3}>
                    {!diseaseCards ? ( 
                            <Container style={{ marginTop: "170px" }}>
                                <img alt="disease/trait portal" src={DiseaseTrait} style={{ width: "100%" ,height: "100%" }} />
                            </Container>
                        ):diseaseCards && diseaseCards.length>0 ? ( 
                            <Slide direction="up" in timeout={1000}>
                                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                    <HorizontalCard width={500}
                                        onCardClick={(v?: string) => {
                                            let d = DISEASE_CARDS.find(d=>d.val===v)?.diseaseDesc
                                            navigate(`/psychscreen/traits/${v}`, { state: { searchvalue: val, diseaseDesc: d } })
                                        }}
                                        cardContentText={diseaseCards} 
                                    />            
                                </Container>
                            </Slide>              
                        ): (<Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                            No results found
                        </Container>)}
                </Grid>}
                <Grid item sm={0} md={1} lg={2} xl={3} ></Grid>
            </Grid>
        </>
    );
};
export default DiseaseTraitPortal;
