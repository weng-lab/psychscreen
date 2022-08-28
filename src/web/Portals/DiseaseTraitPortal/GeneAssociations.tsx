import React, { useState } from 'react';
import { Grid, Container } from '@mui/material';
import { Typography, Button } from '@zscreen/psychscreen-ui-components';
import DataTable from "./DataTable";
import { GridProps } from '@mui/material';

const GENE_ASSOCIATION_DATA =  Array(10).fill({Symbol: 'DRD2','Overall Association Score': 0.60,'Genetic Associations': 'No Data', 'Text Mining':0.08, 'RNA Expression': 'No data'});

const GeneAssociations = (props: GridProps) =>{
    const [table, setTable] = useState<number>(1)
    return (
    <Grid container {...props}>    
        <Grid item sm={6}>
            <Container style={{ marginTop: "50px", marginLeft: "150px", width: "800px" }}>
                <Typography
                    type="body"
                    size="large"
                    style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px" }}
                >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus turpis a orci volutpat, id congue leo laoreet. Nulla facilisi. Duis sit amet lorem faucibus, venenatis dui a, ultricies mi. In hac habitasse platea dictumst. Vestibulum ac laoreet tortor. 
                </Typography>                
                <Button bvariant={table===1 ? "filled" : "outlined"}  btheme="light" onClick={()=>{ setTable(1)}} >Table 1</Button>&nbsp;&nbsp;&nbsp;
                <Button bvariant={table===2 ? "filled" : "outlined"} btheme="light"  onClick={()=>{ setTable(2)}} >Table 2</Button>&nbsp;&nbsp;&nbsp;
                   <br/>
                <br/>
                    <DataTable style={{ width: "100%" }} tabledata={GENE_ASSOCIATION_DATA}/>                
                
            </Container>
        </Grid>
    </Grid>)
}

export default GeneAssociations;