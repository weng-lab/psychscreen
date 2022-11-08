import React, { useState } from 'react';
import { Grid, Container, GridProps, Divider } from '@mui/material';
import { CustomizedTable, Button } from '@zscreen/psychscreen-ui-components';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

/*const SNP_QTL_ASSOCIATION_DATA = Array(10).fill({
    Chromosome: 'chr12',
    Position: 2236139,
    ID: 'rs1006737',
    'In Regulatory Element?': 'No'
});*/

type GwasIntersectingSnpsWithCcres = {    
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

    const GWASIntersectingSnpDataWithCcre = props.ccredata && props.ccredata.map((d: GwasIntersectingSnpsWithCcres)=>{
        return [{header: 'SNP Id', value: d.snpid},
            {header: 'Chrom', value: d.snp_chrom},
            {header: 'Start',value: d.snp_start},
            {header: 'Stop', value: d.snp_stop},            
            {header: 'Risk Allele', value: d.riskallele},
            {header: 'Associated Gene', value: d.associated_gene},
            {header: 'Association P Value', value: d.association_p_val.join(",")},
            {header: 'cCRE Chrom', value: d.ccre_chrom},
            {header: 'cCRE Start', value: d.ccre_start},
            {header: 'cCRE Stop', value: d.ccre_stop},
            {header: 'cCRE Id', value: d.ccreid},
            {header: 'RDHS Id', value: d.rdhsid},
            {header: 'cCRE Class', value: d.ccre_class},

        ]
    })
    const AdultGWASIntersectingSnpDataWithBcre = props.adult_bcredata && props.adult_bcredata.map((d: GwasIntersectingSnpsWithBcres)=>{
        return [{header: 'SNP Id', value: d.snpid},
            {header: 'Chrom', value: d.snp_chrom},
            {header: 'Start',value: d.snp_start},
            {header: 'Stop', value: d.snp_stop},            
            {header: 'Risk Allele', value: d.riskallele},
            {header: 'Associated Gene', value: d.associated_gene},
            {header: 'Association P Value', value: d.association_p_val.join(",")},
            {header: 'bCRE Chrom', value: d.ccre_chrom},
            {header: 'bCRE Start', value: d.ccre_start},
            {header: 'bCRE Stop', value: d.ccre_stop},
            {header: 'bCRE Id', value: d.ccreid},
            {header: 'RDHS Id', value: d.rdhsid},
            {header: 'bCRE Class', value: d.ccre_class},
            {header: 'bCRE group', value: d.bcre_group}

        ]
    })
    const FetalGWASIntersectingSnpDataWithBcre = props.fetal_bcredata && props.fetal_bcredata.map((d: GwasIntersectingSnpsWithBcres)=>{
        return [{header: 'SNP Id', value: d.snpid},
            {header: 'Chrom', value: d.snp_chrom},
            {header: 'Start',value: d.snp_start},
            {header: 'Stop', value: d.snp_stop},            
            {header: 'Risk Allele', value: d.riskallele},
            {header: 'Associated Gene', value: d.associated_gene},
            {header: 'Association P Value', value: d.association_p_val.join(",")},
            {header: 'bCRE Chrom', value: d.ccre_chrom},
            {header: 'bCRE Start', value: d.ccre_start},
            {header: 'bCRE Stop', value: d.ccre_stop},
            {header: 'bCRE Id', value: d.ccreid},
            {header: 'RDHS Id', value: d.rdhsid},
            {header: 'bCRE Class', value: d.ccre_class},
            {header: 'bCRE group', value: d.bcre_group}

        ]
    })
    return (
        <Grid container {...props}>    
            <Grid item sm={6}>
                <Container style={{ marginTop: "30px", marginLeft: "100px", width: "800px" }}>                                       
                <Box>
                    <Tabs value={tabIndex} onChange={handleTabChange}>
                        <Tab label="Intersecting snps with cCREs" ></Tab>
                        <Tab label="Intersecting snps with bCREs" ></Tab>
                        
                    </Tabs>
                    <Divider/>
                  </Box>
                    {props.ccredata  && tabIndex === 0 && <CustomizedTable style={{ width: "max-content" }}  tabledata={GWASIntersectingSnpDataWithCcre}/>}
                    {props.adult_bcredata && props.fetal_bcredata  && tabIndex === 1 && 
                    (<>
                        <br/>
                        {props.adult_bcredata && <Button bvariant={page===0 ? "filled" : "outlined"}  btheme="light" onClick={()=>{ setPage(0)}} >Adult</Button>}&nbsp;&nbsp;&nbsp;
                        {props.fetal_bcredata && <Button bvariant={page===1 ? "filled" : "outlined"}  btheme="light" onClick={()=>{ setPage(1); }} >Fetal</Button>}
                        {page===0 && <CustomizedTable style={{ width: "max-content" }}  tabledata={AdultGWASIntersectingSnpDataWithBcre}/>}
                        {page===1 && <CustomizedTable style={{ width: "max-content" }}  tabledata={FetalGWASIntersectingSnpDataWithBcre}/>}
                    </>)
                    
                    
                    }
                </Container>
            </Grid>
        </Grid>
    );
};
export default DiseaseIntersectingSnpsWithccres;
