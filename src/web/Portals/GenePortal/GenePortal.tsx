/**
 * GenePortal.tsx: the gene portal page.
 */
// import { DenseBigBed, EmptyTrack, FullBigWig } from 'umms-gb';
 //import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import React, { useState, useCallback } from 'react';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Container, Slide } from '@mui/material';

import { TabletAppBar } from '@zscreen/psychscreen-ui-components';
import { Typography, Button } from '@zscreen/psychscreen-ui-components';
import CheckIcon from '@mui/icons-material/Check';
import { SearchBox, HorizontalCard } from '@zscreen/psychscreen-ui-components';
import { useTheme, useMediaQuery } from '@material-ui/core';
import { PORTALS } from '../../../App';
import { Logo } from '../../../mobile-portrait/HomePage/HomePage';
import GeneBCRE from '../../../assets/gene-bcre.png';
import CircularProgress from '@mui/material/CircularProgress';

const GENE_AUTOCOMPLETE_QUERY = `
 query suggest($id: String!, $assembly: String!) {
     suggest(id: $id, assembly: $assembly, limit: 5) {
         id
         coordinates {
             chromosome
             start
             end
         }
         ...on Gene {
             name
         }
         ...on Transcript {
             name
         }
         __typename
     }
 }
 `;

 const GenePortal: React.FC = props => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { state }: any = useLocation();
    const { searchvalue } = state ? state : { searchvalue: ''}     
    const [ val, setVal ] = useState<string>(searchvalue)         
    const [ fetching, setFetching ] = useState<boolean>(false)         
    const [ geneCards, setgeneCards] = useState<{cardLabel: string, val: string, cardDesc: string}[] | undefined>(undefined)
   
    const onSearchChange = useCallback(
        async (value: any) => {
            setFetching(true);
            const response = await fetch('https://ga.staging.wenglab.org/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: GENE_AUTOCOMPLETE_QUERY,
                    variables: {
                        assembly: "GRCh38",
                        id: value,
                    },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            const genesSuggestion = (await response.json()).data?.suggest;            
            if(genesSuggestion && genesSuggestion.length > 0) {
                const r = genesSuggestion.map((g: any)=>{
                    return {
                        val: `${g.id}/${g.coordinates.chromosome}/${g.coordinates.start}/${g.coordinates.end}`,
                        cardDesc: g.id, //.split(".")[0],
                        cardLabel: g.name
                    }
                });
                setgeneCards(r);
            } else if (genesSuggestion && genesSuggestion.length === 0)
                setgeneCards([]);
            setFetching(false);
        },
        []
    );
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
                            <img alt="Gene bCRE portal" src={GeneBCRE} style={{ width: "70%" ,height: "100%" }} />
                    </Container>}
                    <Container  style={{ width:"741px", marginTop: "147px" }} fixed>
                        <Typography
                            type="display"
                            size="medium"
                            style={{ fontWeight: 700, fontSize: "48px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px" }}
                        >
                            Gene/bCRE Portal
                        </Typography>
                        <br/>
                        <Typography
                            type="body"
                            size="large"
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
                            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                        >
                            <CheckIcon style={{ marginRight: "9px" }} /> 761,984 brain regulatory elements
                        </Typography>
                        <br/>
                        <br/>
                        <SearchBox
                            value={val}
                            onChange={
                            e => { 
                                setVal(e.target.value)       
                            }}
                            onSearchButtonClick={() => { 
                                if(val !== ''){
                                    onSearchChange(val)               
                                }   
                            }}                
                            helperText={"e.g. sox4, gapdh"}                            
                        />

                    </Container>
                   
                </Grid>
                {useMediaQuery(theme.breakpoints.up('md'))  && <Grid item sm={4} md={4} lg={3} xl={3}>
                    {!geneCards && !fetching ? ( 
                            <Container style={{ marginTop: "170px" }}>
                                <img alt="gene/bcre portal" src={GeneBCRE} style={{ width: "100%" ,height: "100%" }} />
                            </Container>
                        ): fetching ? ( <Container style={{ marginLeft: "12px", marginTop: "150px" }}> <> 
                        <Typography
                                               type="body"
                                               size="large"
                                               style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                                           >
                                                   Loading Data...
                                           </Typography>
                                           <br/>
                       <CircularProgress color="inherit"/>
                       
                        </>  </Container>) :  ( 
                            <>
                            {geneCards!.length > 0 && <Slide direction="up" in timeout={1000}>
                                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                    {<HorizontalCard width={500}
                                        onCardClick={(v?: string) => {
                                            let f = geneCards!!.find((g: any)=> g.val===v)
                                            navigate(`/psychscreen/gene/${f?.cardLabel}`, { state: { geneid: v!!.split("/")[0].split(".")[0], chromosome: v!!.split("/")[1] , start:  v!!.split("/")[2] , end: v!!.split("/")[3] } })
                                        }}
                                        cardContentText={geneCards!!} 
                                    />  }          
                                </Container>
                            </Slide> } 
                            {geneCards!.length === 0 &&
                                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                    {'No Results Found'  }          
                                </Container>
                            }
                            </>
                        )}
                </Grid>}
              
                <Grid item sm={0} md={1} lg={2} xl={3} ></Grid>
            </Grid>
            <br/>
            <br/>
            <br/>
            <Grid container>
                <Grid item sm={1}  md={2} lg={3} xl={3}></Grid>
                <Grid item sm={8} md={6} lg={5} xl={4}>
                    <Button bvariant={"outlined"}  btheme="light" onClick={()=>{
                        navigate(`/psychscreen/gene/gtexumap`)

                    }} >{'GTEx Umap Plots'}</Button>
                </Grid>
            </Grid>
         
        </>
    );
};
export default GenePortal;
