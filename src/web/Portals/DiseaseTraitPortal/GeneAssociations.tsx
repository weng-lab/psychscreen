import React from 'react';
import { Grid, Container, CircularProgress } from '@mui/material';
import { CustomizedTable } from '@zscreen/psychscreen-ui-components';
import { GridProps } from '@mui/material';

type GeneAssociation = {
    hsq: number,
    twas_p: number,
    twas_bonferroni: number,
    dge_log2fc: number,
    gene_id: string,
    gene_name: string,        
    dge_fdr: number
}

export type GeneAssociationsProps =  GridProps & {
    disease: string,
    data: GeneAssociation[]
};

/*const GENE_ASSOCIATION_DATA = Array(10).fill({
    Symbol: 'DRD2',
    'Overall Association Score': 0.60,
    'Genetic Associations': 'No Data',
    'Text Mining': 0.08,
    'RNA Expression': 'No data'
});*/

const GeneAssociations: React.FC<GeneAssociationsProps> = props => {
   
    const tabledata = props.data.map((d: GeneAssociation)=>{
        return [{header: 'Gene Id', value: d.gene_id},
            {header: 'Gene Name', value: d.gene_name},
            {header: 'Hsq', value: d.hsq},
            {header:'Twas P Value',value: d.twas_p},                            
            {header: 'Twas Bonferroni', value: d.twas_bonferroni},
            {header: 'Dge Fdr', value: d.dge_fdr},                           
            {header: 'Dge Log2Fc', value: d.dge_log2fc                         
        }]
    })

    return (        
        <Grid container {...props}>    
            <Grid item sm={12}>
                <Container style={{ marginTop: "50px", marginLeft: "150px", width: "800px" }}>                   
                    {props.data ? <CustomizedTable style={{ width: "max-content" }}  tabledata={tabledata}/>: <CircularProgress color='inherit'/>}
                </Container>
            </Grid>
        </Grid>
        
    );
};
export default GeneAssociations;
