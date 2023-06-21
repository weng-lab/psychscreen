import React, { useMemo, useState } from 'react';
import { Grid, Container, GridProps, Divider } from '@mui/material';
import { CustomizedTable, Button } from '@zscreen/psychscreen-ui-components';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import styled from "@emotion/styled";
import { compareByMinimumP } from './AssociatedSnpQtl';
import { StyledButton } from './DiseaseTraitDetails';

export const StyledTab = styled(Tab)(() => ({
    textTransform: "none",
  }))
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

const formatEntry = (d: GwasIntersectingSnpsWithBcres | GwasIntersectingSnpsWithCcres) => [
    { header: 'SNP ID', value: d.snpid },
    { header: 'Chromosome', value: d.snp_chrom },
    { header: 'Position', value: d.snp_stop.toLocaleString() },
    { header: 'Risk Allele', value: d.riskallele },
    { header: 'Nearest Gene', value: d.associated_gene },
    { header: 'GWAS p-value', value: d.association_p_val.join(",") },
    { header: 'bCRE chromosome', value: d.ccre_chrom },
    { header: 'bCRE start', value: d.ccre_start.toLocaleString() },
    { header: 'bCRE end', value: d.ccre_stop.toLocaleString() },
    { header: 'bCRE ID', value: d.ccreid },
    { header: 'bCRE class', value: d.ccre_class }
];

const DiseaseIntersectingSnpsWithccres: React.FC<DiseaseIntersectingSnpsWithccresProps>
    = ({ ccredata, adult_bcredata, fetal_bcredata, ...props }) => {
        
        const [ tabIndex, setTabIndex] = useState(0);
        const [ page, setPage ] = useState<number>(0);

        const handleTabChange = (_: any, newTabIndex: number) => {
            setTabIndex(newTabIndex);
        };

        const GWASIntersectingSnpDataWithCcre = useMemo( () => (
            ccredata && [ ...ccredata ].sort(compareByMinimumP).map(
                formatEntry
            )
        ), [ ccredata ]);

        const AdultGWASIntersectingSnpDataWithBcre = useMemo( () => (
            adult_bcredata && [ ...adult_bcredata ].sort(compareByMinimumP).map(
                formatEntry
            )
        ), [ adult_bcredata ]);

        const FetalGWASIntersectingSnpDataWithBcre = useMemo( () => (
            fetal_bcredata && [ ...fetal_bcredata ].sort(compareByMinimumP).map(
                formatEntry
            )
        ), [ fetal_bcredata ]);

        return (
            <Grid container {...props}>    
                <Grid item sm={12}>
                    <Container style={{ marginTop: "30px", marginLeft: "100px" }}>
                        <Box>
                            <Tabs value={tabIndex} onChange={handleTabChange}>
                                <StyledTab label="SNPs Intersecting any cCRE" ></StyledTab>
                                { adult_bcredata && fetal_bcredata && (adult_bcredata.length > 0 || fetal_bcredata.length > 0) && (
                                    <StyledTab label="SNPs Intersecting brain cCREs (bCREs)" />
                                )}
                            </Tabs>
                            <Divider/>
                        </Box>
                        { ccredata && tabIndex === 0 && <CustomizedTable style={{ width: "max-content" }} tabledata={GWASIntersectingSnpDataWithCcre} /> }
                        { adult_bcredata && fetal_bcredata && (adult_bcredata.length > 0 || fetal_bcredata.length > 0) && tabIndex === 1 && (
                            <>
                                <br/>
                                { adult_bcredata && <StyledButton bvariant={page === 0 ? "filled" : "outlined"}  btheme="light" onClick={() => setPage(0)}>Adult</StyledButton> }&nbsp;&nbsp;&nbsp;
                                { fetal_bcredata && <StyledButton bvariant={page === 1 ? "filled" : "outlined"}  btheme="light" onClick={() => setPage(1)}>Fetal</StyledButton> }
                                { page === 0 && <CustomizedTable style={{ width: "max-content" }} tabledata={AdultGWASIntersectingSnpDataWithBcre} /> }
                                { page === 1 && <CustomizedTable style={{ width: "max-content" }} tabledata={FetalGWASIntersectingSnpDataWithBcre} /> }
                            </>
                        )}
                    </Container>
                </Grid>
            </Grid>
        );

    };
export default DiseaseIntersectingSnpsWithccres;
