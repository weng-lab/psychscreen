import React from 'react';
import { Grid, Container, GridProps } from '@mui/material';
import { CustomizedTable } from '@zscreen/psychscreen-ui-components';
import CircularProgress from '@mui/material/CircularProgress';

type GWAS_SNP = {
    snpid: string;
    chrom: string;
    start: number;
    stop: number;
    analyses_identifying_snp: number;
    associated_gene: string;
    riskallele: string;
    association_p_val: number[];
};

export type AssociatedSnpQtlProps = GridProps & {
    disease: string;
    data: GWAS_SNP[];
};

const AssociatedSnpQtl: React.FC<AssociatedSnpQtlProps> = props => {    
    
    const SnpAssociationData = props.data && props.data.map( (d: GWAS_SNP)=>{
        return [
            { header: 'SNP Id', value: d.snpid },
            { header: 'Chrom', value: d.chrom },
            { header: 'Start',value: d.start },
            { header: 'Stop', value: d.stop },
            { header: 'Analyses identifying SNP', value: d.analyses_identifying_snp },
            { header: 'Risk Allele', value: d.riskallele },
            { header: 'Associated Gene', value: d.associated_gene },
            { header: 'Association P Value', value: d.association_p_val.join(",") }
        ]
    });

    return (
        <Grid container {...props}>    
            <Grid item sm={6}>
                <Container style={{ marginTop: "30px", marginLeft: "130px", width: "800px" }}>
                                       
                    {props.data ? <CustomizedTable style={{ width: "max-content" }}  tabledata={SnpAssociationData}/>: <CircularProgress color='inherit'/>}
                </Container>
            </Grid>
        </Grid>
    );
    
};
export default AssociatedSnpQtl;
