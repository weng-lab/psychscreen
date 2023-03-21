import React, {useState, useCallback} from 'react';
import { GridProps } from '@mui/material';
import { AppBar, Typography, SearchBox, HorizontalCard } from '@zscreen/psychscreen-ui-components';
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { Grid, Container, Slide } from '@mui/material';
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

const SingleCellDetails: React.FC<GridProps> = (props) => {
    const { disease } = useParams();
    const navigate = useNavigate(); 
    const [ val, setVal ] = useState<string>('')         
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
   
    return(
        <>
            <AppBar
                centered
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
            <Grid container {...props}> 
                <Grid item sm={2} ></Grid>
                <Grid item sm={4}>
                    
                    <Container  style={{ width:"741px", marginTop: "147px" }} fixed>
                    <Typography
                            type="body"
                            size="small"
                            style={{ fontWeight: 500, fontSize: "23px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px" }}
                        >
                            Search Gene to show Dot Plot 
                        </Typography>
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
                
                    
                
              
                <Grid item sm={6} >
                { fetching ? ( <Container style={{ marginLeft: "12px", marginTop: "150px" }}> <> 
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
                            {geneCards && geneCards!.length > 0 && <Slide direction="up" in timeout={1000}>
                                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                    {<HorizontalCard width={500}
                                        onCardClick={(v?: string) => {
                                            let f = geneCards!!.find((g: any)=> g.val===v)
                                            
                                   navigate(`/psychscreen/single-cell/${disease}/${f?.cardLabel}`)
                                        }}
                                        cardContentText={geneCards!!} 
                                    />  }          
                                </Container>
                            </Slide> } 
                            {geneCards && geneCards!.length === 0 &&
                                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>            
                                    {'No Results Found'  }          
                                </Container>
                            }
                            </>
                        )}
                
                </Grid>

            </Grid>
           
        </>
    )
}

export default SingleCellDetails;