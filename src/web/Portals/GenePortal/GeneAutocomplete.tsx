import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { debounce } from '@mui/material/utils';
import { useNavigate } from 'react-router-dom';
import { QueryResponse } from './GeneOverview';
import { StyledButton } from '../DiseaseTraitPortal/DiseaseTraitDetails';
import { Label } from '@mui/icons-material';

const GENE_AUTOCOMPLETE_QUERY = `
query ($assembly: String!, $name_prefix: [String!], $limit: Int) {
    gene(assembly: $assembly, name_prefix: $name_prefix, limit: $limit) {
      name
      id
      coordinates {
        start
        chromosome
        end
      }
      __typename
    }
  }
  
 `;

export const GeneAutoComplete = (props) =>{
    const [value, setValue] = React.useState<any>(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState<any[]>([]);
    const navigate = useNavigate();
    const [ geneDesc, setgeneDesc] = React.useState<{name: string, desc: string}[]>()
    
    React.useEffect(()=>{ 
    
        const fetchDAta =  async ()=>{
            let f = await Promise.all(options.map(gene =>
                // do something with this response like parsing to JSON
                fetch("https://clinicaltables.nlm.nih.gov/api/ncbi_genes/v3/search?authenticity_token=&terms=" + gene.toUpperCase())
                .then(x => x && x.json())
                .then(x => {
                    const matches = (x as QueryResponse)[3] && (x as QueryResponse)[3].filter(x => x[3] === gene.toUpperCase());
                    return  {desc: (matches && matches.length >= 1 ? matches[0][4] : "(no description available)"), name: gene }
                })
                .catch(()=>{
                    return {desc: "(no description available)", name: gene }
                })
             ))         
             setgeneDesc(f)
           }
        
           options && fetchDAta()
         } ,[options])
         
    
    
    const onSearchChange = async (value: any) => {
            setOptions([]);
            const response = await fetch('https://ga.staging.wenglab.org/graphql', {
                method: 'POST',
                body: JSON.stringify({
                    query: GENE_AUTOCOMPLETE_QUERY,
                    variables: {
                        assembly: "GRCh38",
                        name_prefix: value,
                        limit: 1000
                    },
                }),
                headers: { 'Content-Type': 'application/json' },
            });
            const genesSuggestion = (await response.json()).data?.gene;            
            if(genesSuggestion && genesSuggestion.length > 0) {
                const r = genesSuggestion.map((g: any)=>g.name);
                setOptions(r);
            } else if (genesSuggestion && genesSuggestion.length === 0) {
                setOptions([]);
            }
                //setgeneCards([]);
            
        }
        
    
        const debounceFn = React.useCallback(debounce(onSearchChange, 500), []);

    return(
    <Grid container alignItems="center">
        <Grid item sm={12} md={12} lg={12} xl={12}>
            <Typography>Search gene:</Typography>
            <br/>
        </Grid>
        <Grid item sm={5.5} md={5.5} lg={5.5} xl={5.5} >
     <Autocomplete
      id="google-map-demo"
      sx={{ width: 300, paper: { height: 200 } }}
     
      options={options}
     ListboxProps={
        {
          style:{
              maxHeight: '180px',
          }
        }
      }
     onKeyDown={(event) => {
        if (event.key === 'Enter') {
          event.defaultPrevented = true;
          
          if(value)
            navigate(props.navigateto+value)
        }
      }}
      value={value}
        onChange={(_: any, newValue: string | null) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
            if(newInputValue!=""){
                debounceFn(newInputValue)
            }
            
            setInputValue(newInputValue);
        }}

      noOptionsText="e.g sox4,gapdh"
      
      renderInput={(params) => (
        <TextField {...params} label="e.g sox4,gapdh" fullWidth />
      )}

      renderOption={(props, option) => {
        return (
          <li {...props} key={props.id}>
           <Grid container alignItems="center">
                <Grid item sx={{ width: 'calc(100% - 44px)', wordWrap: 'break-word' }}>
                   
                  <Box
                    
                    component="span"
                    sx={{ fontWeight: 'regular' }}
                  >
                    {option}
                  </Box>
                  {geneDesc && geneDesc.find(g=>g.name===option)  &&<Typography variant="body2" color="text.secondary">
                  { geneDesc.find(g=>g.name===option)?.desc}
                </Typography>}
                </Grid>
           </Grid>
          </li>
        );
      }}
    />
    
    </Grid>
    <Grid item sm={1} md={1} lg={1} xl={1} sx={{ verticalAlign:'middle', textAlign:'center' }} >
    <StyledButton bvariant='filled' btheme='light' onClick={()=>{
           console.log(value,'val')
           if(value)
           navigate(props.navigateto+value)
    }}>Search</StyledButton>
    </Grid>
    </Grid>)
}