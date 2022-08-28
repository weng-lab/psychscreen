import React, { useState } from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import { Typography, Button } from '@zscreen/psychscreen-ui-components';
import DataTable from "./DataTable";

const SNP_QTL_ASSOCIATION_DATA = Array(10).fill({
    Chromosome: 'chr12',
    Position: 2236139,
    ID: 'rs1006737',
    'In Regulatory Element?': 'No'
});

const AssociatedSnpQtl: React.FC<GridProps> = props => {
    const [ table, setTable ] = useState<number>(1);
    return (
        <Grid container {...props}>    
            <Grid item sm={6}>
                <Container style={{ marginTop: "30px", marginLeft: "130px", width: "800px" }}>
                    <Typography
                        type="body"
                        size="large"
                        style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px" }}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean cursus turpis a orci volutpat, id congue leo laoreet. Nulla facilisi. Duis sit amet lorem faucibus, venenatis dui a, ultricies mi. In hac habitasse platea dictumst. Vestibulum ac laoreet tortor. 
                    </Typography>                
                    <Button style={{ marginTop: "30px" }} bvariant={table===1 ? "filled" : "outlined"}  btheme="light" onClick={()=>{ setTable(1)}} >Table 1</Button>&nbsp;&nbsp;&nbsp;
                    <Button style={{ marginTop: "30px" }} bvariant={table===2 ? "filled" : "outlined"} btheme="light"  onClick={()=>{ setTable(2)}} >Table 2</Button>&nbsp;&nbsp;&nbsp;
                    <br/>
                    <br/>
                    <DataTable style={{ width: "max-content" }}  tabledata={SNP_QTL_ASSOCIATION_DATA}/>
                </Container>
            </Grid>
        </Grid>
    );
};
export default AssociatedSnpQtl;
