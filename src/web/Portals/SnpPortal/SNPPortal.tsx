
/**
 * SNPPortal.tsx: the SNP/QTL portal page.
 */

 import React, {useState, useCallback} from 'react';
 import { AppBar } from '@zscreen/psychscreen-ui-components';
 import { useNavigate, useLocation } from 'react-router-dom';
 import { Grid, Container, GridProps, Slide } from '@mui/material';
 import { TabletAppBar } from '@zscreen/psychscreen-ui-components';
 import { Typography } from '@zscreen/psychscreen-ui-components';
 import CheckIcon from '@mui/icons-material/Check';
 import { HorizontalCard, SearchBox } from '@zscreen/psychscreen-ui-components';
 import { useTheme, useMediaQuery, Paper } from '@material-ui/core';
 import { PORTALS } from '../../../App';
 import { Logo } from '../../../mobile-portrait/HomePage/HomePage';
 import SNPQTL from '../../../assets/snp-qtl.png';
 import CircularProgress from '@mui/material/CircularProgress';
 

const SNP_AUTOCOMPLETE_QUERY = `
query snpAutocompleteQuery($snpid: String!, $assembly: String!) {
    snpAutocompleteQuery(snpid: $snpid, assembly: $assembly) {
        id
        coordinates {
            chromosome
            start
            end
        }
    }
}
`;


const SNPPortal: React.FC<GridProps> = (props: GridProps) => {
    const navigate = useNavigate();
    const theme = useTheme();
    const { state }: any = useLocation();
    const { searchvalue } = state ? state : { searchvalue: ''}     
    const [ val, setVal ] = useState<string>(searchvalue)         
    const [ fetching, setFetching ] = useState<boolean>(false)         
    const [ snpCards, setsnpCards] = useState<{cardLabel: string, val: string, cardDesc: string}[] | undefined>(undefined)
   
    const onSearchChange = useCallback(
        async (value: any) => {
            setFetching(true);
            const response = await fetch('https://ga.staging.wenglab.org/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: SNP_AUTOCOMPLETE_QUERY,
                    variables: {
                        assembly: "grch38",
                        snpid: value,
                    },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            const snpSuggestion = (await response.json()).data?.snpAutocompleteQuery;            
            if(snpSuggestion && snpSuggestion.length > 0) {
                const r = snpSuggestion.map((g: any)=>{
                    return {
                        val: `${g.id}/${g.coordinates.chromosome}/${g.coordinates.start}/${g.coordinates.end}`,
                        cardDesc: `${g.coordinates.chromosome}:${g.coordinates.start}-${g.coordinates.end}`, //.split(".")[0],
                        cardLabel: g.id
                    }
                });
                setsnpCards(r);
            } else if (snpSuggestion && snpSuggestion.length === 0)
                setsnpCards([]);
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
                        onDownloadsClicked={() => navigate("/psychscreen/downloads")}
                        onAboutClicked={() => navigate("/psychscreen/aboutus")}
                        onHomepageClicked={() => navigate("/")}
                        onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                    /> 
            }   
            <Grid container {...props}> 
                <Grid item sm={0}  md={1} lg={2} xl={2}></Grid>
                <Grid item sm={8} md={6} lg={5} xl={4}>
                    {useMediaQuery(theme.breakpoints.down('sm')) && <Container style={{ marginTop: "130px" }}>
                            <img alt="SNP/QTL Portal" src={SNPQTL} style={{ width: "70%" ,height: "100%" }} />
                    </Container>}
                    <Container  style={{ width:"741px", marginTop: "147px" }} fixed>
                        <Typography
                            type="display"
                            size="medium"
                            style={{ fontWeight: 700, fontSize: "48px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px" }}
                        >
                            SNP/QTL Portal
                        </Typography>
                        <br/>
                        <Typography
                            type="body"
                            size="large"
                            style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px", width: "414px" }}
                        >
                           Search SNPs of interest and explore their impact on gene expression, chromatin accessibility, transcription factor (TF) binding and other molecular traits in the human brain based on PsychENCODE QTLs and sequence analysis of bCREs. Link SNPs to complex traits using GWAS annotations.
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
                            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
                        >
                            <CheckIcon style={{ marginRight: "9px" }} /> 510,062 variants in bCREs
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
                            helperText={"e.g. rs3794102"}                            
                        />

                    </Container>
                   
                </Grid>
                {useMediaQuery(theme.breakpoints.up('md'))  && <Grid item sm={4} md={4} lg={3} xl={3}>
                    {!snpCards && !fetching ? ( 
                            <Container style={{ marginTop: "170px" }}>
                                <img alt="gene/bcre portal" src={SNPQTL} style={{ width: "100%" ,height: "100%" }} />
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
                            {snpCards!.length > 0 && <Slide direction="up" in timeout={1000}>
                                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                    {<Paper elevation={0} style={{  maxHeight: 500, width: 350, overflow: 'auto'}}><HorizontalCard width={500}
                                        onCardClick={(v?: string) => {
                                            let f = snpCards!!.find((g: any)=> g.val===v)                                            
                                            navigate(`/psychscreen/snp/${f?.cardLabel}`, { state: { snpid: v!!.split("/")[0], chromosome: v!!.split("/")[1] , start:  v!!.split("/")[2] , end: v!!.split("/")[3] } })
                                        }}
                                        cardContentText={snpCards!!} 
                                    /></Paper>  }          
                                </Container>
                            </Slide> } 
                            {snpCards!.length === 0 &&
                                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                    {'No Results found'  }          
                                </Container>
                            }
                            </>
                        )}
                </Grid>}
              
                <Grid item sm={0} md={1} lg={2} xl={3} ></Grid>
            </Grid>
         
        </>
    );
};
export default SNPPortal;
