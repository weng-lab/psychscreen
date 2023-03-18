import React, { useState } from 'react';
import { Grid, Container, GridProps, Divider } from '@mui/material';
import { CustomizedTable, Button } from '@zscreen/psychscreen-ui-components';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { compareByMinimumP } from './AssociatedSnpQtl';

/*const SNP_QTL_ASSOCIATION_DATA = Array(10).fill({
    Chromosome: 'chr12',
    Position: 2236139,
    ID: 'rs1006737',
    'In Regulatory Element?': 'No'
});*/

export type GwasIntersectingSnpsWithCcres = {    
    snpid: string,
    snp_chrom: string,
    snp_start: number,
    snp_stop: number,
    associated_gene: string,
    riskallele: string,
    association_p_val: number[],
    ccre_chrom: string,
    ccre_start: number,
    ccre_stop: number,
    rdhsid: string,
    ccreid: string,
    ccre_class: string

}

type GwasIntersectingSnpsWithBcres = GwasIntersectingSnpsWithCcres & {        
    bcre_group: string
}

export type DiseaseIntersectingSnpsWithccresProps = GridProps & {
    disease: string,
    ccredata: GwasIntersectingSnpsWithCcres[],
    adult_bcredata: GwasIntersectingSnpsWithBcres[],
    fetal_bcredata: GwasIntersectingSnpsWithBcres[]
};

const DiseaseIntersectingSnpsWithccres: React.FC<DiseaseIntersectingSnpsWithccresProps> = props => {    
    const [ tabIndex, setTabIndex] = useState(0);
    const [page, setPage] = useState<number>(0);

    const handleTabChange = (_: any, newTabIndex: number) => {
        setTabIndex(newTabIndex);
    };

    const GWASIntersectingSnpDataWithCcre = props.ccredata && [ ...props.ccredata ].sort(compareByMinimumP).map((d: GwasIntersectingSnpsWithCcres)=>{
        return [{header: 'SNP ID', value: d.snpid},
            {header: 'Chromosome', value: d.snp_chrom},
            {header: 'Position', value: d.snp_stop.toLocaleString()},            
            {header: 'Risk Allele', value: d.riskallele},
            {header: 'Associated Gene', value: d.associated_gene},
            {header: 'GWAS p-value', value: d.association_p_val.join(",")},
            {header: 'cCRE chromosome', value: d.ccre_chrom},
            {header: 'cCRE start', value: d.ccre_start.toLocaleString()},
            {header: 'cCRE end', value: d.ccre_stop.toLocaleString()},
            {header: 'cCRE ID', value: d.ccreid},
            {header: 'cCRE class', value: d.ccre_class},
        ]
    });
    const AdultGWASIntersectingSnpDataWithBcre = props.adult_bcredata && [ ...props.adult_bcredata ].sort(compareByMinimumP).map((d: GwasIntersectingSnpsWithBcres)=>{
        return [{header: 'SNP ID', value: d.snpid},
            {header: 'Chromosome', value: d.snp_chrom},
            {header: 'Position', value: d.snp_stop.toLocaleString()},            
            {header: 'Risk Allele', value: d.riskallele},
            {header: 'Nearest Gene', value: d.associated_gene},
            {header: 'GWAS p-value', value: d.association_p_val.join(",")},
            {header: 'bCRE chromosome', value: d.ccre_chrom},
            {header: 'bCRE start', value: d.ccre_start.toLocaleString()},
            {header: 'bCRE end', value: d.ccre_stop.toLocaleString()},
            {header: 'bCRE ID', value: d.ccreid},
            {header: 'bCRE class', value: d.ccre_class}
        ]
    });
    const FetalGWASIntersectingSnpDataWithBcre = props.fetal_bcredata && [ ...props.fetal_bcredata ].sort(compareByMinimumP).map((d: GwasIntersectingSnpsWithBcres)=>{
        return [{header: 'SNP ID', value: d.snpid},
            {header: 'Chromosome', value: d.snp_chrom},
            {header: 'Position', value: d.snp_stop.toLocaleString()},            
            {header: 'Risk Allele', value: d.riskallele},
            {header: 'Nearest Gene', value: d.associated_gene},
            {header: 'GWAS p-value', value: d.association_p_val.join(",")},
            {header: 'bCRE chromosome', value: d.ccre_chrom},
            {header: 'bCRE start', value: d.ccre_start.toLocaleString()},
            {header: 'bCRE end', value: d.ccre_stop.toLocaleString()},
            {header: 'bCRE ID', value: d.ccreid},
            {header: 'bCRE class', value: d.ccre_class}
        ]
    });

    return (
        <Grid container {...props}>    
            <Grid item sm={12}>
                <Container style={{ marginTop: "30px", marginLeft: "100px" }}>
                    <Box>
                        <Tabs value={tabIndex} onChange={handleTabChange}>
                            <Tab label="SNPs Intersecting any cCRE" ></Tab>
                            {props.adult_bcredata && props.fetal_bcredata && (props.adult_bcredata.length>0 || props.fetal_bcredata.length>0 ) &&<Tab label="SNPs Intersecting brain cCREs (bCREs)" ></Tab>}
                        </Tabs>
                        <Divider/>
                    </Box>
                    { props.ccredata  && tabIndex === 0 && <CustomizedTable style={{ width: "max-content" }} tabledata={GWASIntersectingSnpDataWithCcre} /> }
                    { props.adult_bcredata && props.fetal_bcredata && (props.adult_bcredata.length>0 || props.fetal_bcredata.length>0 ) && tabIndex === 1 && (
                        <>
                            <br/>
                            { props.adult_bcredata && <Button bvariant={page===0 ? "filled" : "outlined"}  btheme="light" onClick={() => setPage(0)}>Adult</Button> }&nbsp;&nbsp;&nbsp;
                            { props.fetal_bcredata && <Button bvariant={page===1 ? "filled" : "outlined"}  btheme="light" onClick={() => setPage(1)}>Fetal</Button> }
                            { page === 0 && <CustomizedTable style={{ width: "max-content" }}  tabledata={AdultGWASIntersectingSnpDataWithBcre} /> }
                            { page === 1 && <CustomizedTable style={{ width: "max-content" }}  tabledata={FetalGWASIntersectingSnpDataWithBcre} /> }
                        </>
                    )}
                </Container>
            </Grid>
        </Grid>
    );
};
export default DiseaseIntersectingSnpsWithccres;
