import React, { useState } from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import { Typography, Button, CustomizedTable } from '@zscreen/psychscreen-ui-components';
import { gql,useQuery } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
/*const SNP_QTL_ASSOCIATION_DATA = Array(10).fill({
    Chromosome: 'chr12',
    Position: 2236139,
    ID: 'rs1006737',
    'In Regulatory Element?': 'No'
});*/

const AssociatedSnpQuery = gql`
query snpAssoQuery(
    $disease: String!,
    $snpid: String,
    $limit: Int,
    $offset: Int
) {
    snpAssociationsQuery(disease: $disease,snpid: $snpid, limit:$limit, offset:$offset) { 
        n
        z
        a1
        a2        
        snpid
        chisq
        disease
    }
}
`



export type AssociatedSnpQtlProps = GridProps & {
    disease: string
};

const AssociatedSnpQtl: React.FC<AssociatedSnpQtlProps> = props => {
    const [ table, setTable ] = useState<number>(1);
    const { data, loading } = useQuery<any>(AssociatedSnpQuery, {
		
        variables: {
                disease: props.disease,limit: 1000
            }, context: {
                clientName: 'opentarget'
            }
        });
        console.log(data,loading)
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
                    {data ?<CustomizedTable style={{ width: "max-content" }}  tabledata={data.snpAssociationsQuery.map((d: any)=>{
                        return {
                            SnpID: d.snpid,
                            N: d.n,
                            Z: d.z,
                            a1: d.a1,
                            a2: d.a2,
                            CHISQ: d.chisq
                            
                        }
                    })}/>: <CircularProgress color='inherit'/>}
                </Container>
            </Grid>
        </Grid>
    );
};
export default AssociatedSnpQtl;
