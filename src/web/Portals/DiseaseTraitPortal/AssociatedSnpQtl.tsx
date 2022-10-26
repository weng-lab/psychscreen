import React from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import { Typography, CustomizedTable } from '@zscreen/psychscreen-ui-components';
import CircularProgress from '@mui/material/CircularProgress';
/*const SNP_QTL_ASSOCIATION_DATA = Array(10).fill({
    Chromosome: 'chr12',
    Position: 2236139,
    ID: 'rs1006737',
    'In Regulatory Element?': 'No'
});*/


type SnpAssociation = {
    snpid: string,
    n: number,
    z: number,
    chisq: number,
    a1: string,
    a2: string
}


export type AssociatedSnpQtlProps = GridProps & {
    disease: string,
    data: SnpAssociation[]
};

const AssociatedSnpQtl: React.FC<AssociatedSnpQtlProps> = props => {    
    
    const SnpAssociationData = props.data && props.data.map((d: SnpAssociation)=>{
        return [{header: 'SNP Id', value: d.snpid},
            {header: 'N', value: d.n},
            {header: 'Z',value: d.z},
            {header: 'A1', value: d.a1},
            {header: 'A2', value: d.a2},
            {header: 'CHISQ', value: d.chisq}]
    })
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
                    <br/>                    
                    {props.data ? <CustomizedTable style={{ width: "max-content" }}  tabledata={SnpAssociationData}/>: <CircularProgress color='inherit'/>}
                </Container>
            </Grid>
        </Grid>
    );
};
export default AssociatedSnpQtl;
