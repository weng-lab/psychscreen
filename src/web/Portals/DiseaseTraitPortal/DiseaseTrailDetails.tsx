
import { useParams } from "react-router-dom";
import ArrowBack from '@mui/icons-material/ArrowBack';
import React, { useState } from 'react';
import { AppBar } from '@zscreen/psychscreen-ui-components';
import { useNavigate, useLocation } from 'react-router-dom';
import { Grid, Container, GridProps } from '@mui/material';
import { Typography, Button } from '@zscreen/psychscreen-ui-components';
import GeneAssociations from "./GeneAssociations";
import AssociatedSnpQtl from "./AssociatedSnpQtl";
import DiseaseIntersectingSnpsWithccres from "./DiseaseIntersectingSnpsWithccres";
import { DISEASE_CARDS } from "./DiseaseTraitPortal";
import { gql, useQuery } from "@apollo/client";
import { PORTALS } from "../../../App";

const AssociatedSnpQuery = gql`
query gwassnpAssoQuery(
    $disease: String!,
    $snpid: String,
    $limit: Int,
    $offset: Int
) {
    gwassnpAssociationsQuery(disease: $disease,snpid: $snpid, limit:$limit, offset:$offset) { 
        chrom
        stop
        snpid
        start
        associated_gene
        association_p_val
        analyses_identifying_snp
        riskallele
    }
}
`

const AssociatedGenesQuery = gql`
query genesAssoQuery(
    $disease: String!,
    $gene_id: String,
    $limit: Int,
    $offset: Int
) {
    genesAssociationsQuery(disease: $disease,gene_id: $gene_id, limit:$limit, offset:$offset) { 
        hsq
        twas_p
        twas_bonferroni
        dge_log2fc
        gene_id
        gene_name
        disease
        dge_fdr
    }
}
`
const GwasIntersectingSnpswithCcresQuery=gql`
query gwasintersectingSnpsWithCcre($disease: String!, $snpid: String, $limit: Int) {
    gwasintersectingSnpsWithCcreQuery(disease: $disease, snpid: $snpid, limit: $limit){
        disease
        snpid
        snp_chrom 
        snp_start
        snp_stop
        riskallele
        associated_gene
        association_p_val
        ccre_chrom
        ccre_start
        ccre_stop
        rdhsid
        ccreid
        ccre_class

    }

}`

const GwasIntersectingSnpswithBcresQuery = gql`
query gwasintersectingSnpsWithBcre($disease: String!, $snpid: String, $bcre_group: String, $limit: Int) {
    gwasintersectingSnpsWithBcreQuery(disease: $disease, snpid: $snpid, bcre_group: $bcre_group,limit: $limit){
        disease
        snpid
        snp_chrom 
        snp_start
        snp_stop
        riskallele
        associated_gene
        association_p_val
        ccre_chrom
        ccre_start
        ccre_stop
        rdhsid
        ccreid
        ccre_class
        bcre_group

    }

}`

const DiseaseTraitDetails: React.FC<GridProps> = (props) => {
    const { disease } = useParams();
    const navigate = useNavigate();  
    const [page, setPage] = useState<number>(0);
    const { state }: any = useLocation();
    const { searchvalue, diseaseDesc } = state ? state : { searchvalue: '', diseaseDesc: ''} 
    
    const diseaseLabel = disease && DISEASE_CARDS.find(d=>d.val===disease)?.cardLabel
    const { data } = useQuery(AssociatedSnpQuery, {		
        variables: {
                disease: (disease)
            },
            skip: disease===''
        });
    const { data: genesdata } = useQuery(AssociatedGenesQuery, {		
            variables: {
                    disease: (disease), limit: 1000
                },
                skip: disease===''
        });
    const { data: gwasIntersectingSnpWithCcresData } = useQuery(GwasIntersectingSnpswithCcresQuery,{
        variables: {
            disease: disease
        },
        skip: disease===''

    })
    const { data: adultgwasIntersectingSnpWithBcresData } = useQuery(GwasIntersectingSnpswithBcresQuery,{
        variables: {
            disease: disease,
            bcre_group: 'adult'
        },
        skip: disease===''

    })
    const { data: fetalgwasIntersectingSnpWithBcresData } = useQuery(GwasIntersectingSnpswithBcresQuery,{
        variables: {
            disease: disease,
            bcre_group: 'fetal'
        },
        skip: disease===''

    })
    return (
        <>
            <AppBar
                centered
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
            <Grid container {...props}>  
                <Grid item sm={1} md={1} lg={2} xl={2.5}></Grid>
                <Grid item sm={10} md={10} lg={7} xl={6}>
                    <Container style={{marginTop: "50px", marginLeft: "100px", width: "841px" }}>
                        <ArrowBack onClick={()=>{                            
                            navigate("/psychscreen/traits", { state: { searchvalue: searchvalue } } )
                        }} style={{ width: "70px", height: "70px", color: "#E0E0E0" }}/>
                    </Container>
                </Grid>  
                <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
                <Grid item sm={1}  md={1} lg={2} xl={2.5}></Grid>
                <Grid item  sm={10}  md={10} lg={7} xl={6}>
                    <Container style={{ marginTop: "80px", marginLeft: "100px", width: "841px" }}>
                        
                        <Typography
                            type="display"
                            size="medium"
                            style={{ fontWeight: 700, fontSize: "48px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px"  }}
                        >
                            {diseaseLabel}
                        </Typography>
                        <br/>
                        <Typography
                            type="body"
                            size="large"
                            style={{ fontSize: "16px", lineHeight: "24px", fontWeight: 400, letterSpacing: "0.3%", marginBottom: "16px" }}
                        >
                            {diseaseDesc}
                        </Typography>
                        <br/>
                        
                        {data && data.gwassnpAssociationsQuery.length>0 && <Button bvariant={page===0 ? "filled" : "outlined"}  btheme="light" onClick={()=>{ setPage(0)}} >{'Associated SNP & xQTL'}</Button>}&nbsp;&nbsp;&nbsp;
                        {genesdata && genesdata.genesAssociationsQuery.length>0 && <Button bvariant={page===1 ? "filled" : "outlined"}  btheme="light" onClick={()=>{ setPage(1); }} >Gene Associations</Button>} &nbsp;&nbsp;&nbsp;
                        {gwasIntersectingSnpWithCcresData && gwasIntersectingSnpWithCcresData.gwasintersectingSnpsWithCcreQuery.length>0 && <Button bvariant={page===2 ? "filled" : "outlined"}  btheme="light" onClick={()=>{ setPage(2); }} >SNPs WITH REGULATORY IMPACT</Button>} 
                     
                            
                    </Container>
                </Grid>
                <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
               
                { page === 1 && genesdata && genesdata.genesAssociationsQuery.length>0 && (
                    <>
                        <Grid item sm={1}  md={1} lg={2} xl={2.5}></Grid>
                        <Grid sm={10}  md={10} lg={7} xl={6}>
                            <GeneAssociations disease={disease || ''} data={genesdata.genesAssociationsQuery} />
                        </Grid>
                        <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
                    </>

                )}
                { page === 0 && data && data.gwassnpAssociationsQuery.length>0 && (
                    <>
                        <Grid item sm={1}  md={1} lg={2} xl={2.5}></Grid>
                        <Grid item sm={10}  md={10} lg={7} xl={6}>
                            <AssociatedSnpQtl disease={disease || ''} data={data.gwassnpAssociationsQuery}/>
                        </Grid>
                        <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
                    </>
                )}
                 { page === 2 && gwasIntersectingSnpWithCcresData && adultgwasIntersectingSnpWithBcresData && fetalgwasIntersectingSnpWithBcresData && gwasIntersectingSnpWithCcresData.gwasintersectingSnpsWithCcreQuery.length>0 && (
                    <>
                        <Grid item sm={1}  md={1} lg={2} xl={2.5}></Grid>
                        <Grid sm={10}  md={10} lg={7} xl={6}>
                            <DiseaseIntersectingSnpsWithccres disease={disease || ''} 
                            ccredata={gwasIntersectingSnpWithCcresData.gwasintersectingSnpsWithCcreQuery} 
                            adult_bcredata={adultgwasIntersectingSnpWithBcresData.gwasintersectingSnpsWithBcreQuery}
                            fetal_bcredata={fetalgwasIntersectingSnpWithBcresData.gwasintersectingSnpsWithBcreQuery}
                            />
                        </Grid>
                        <Grid item sm={1}  md={1} lg={3} xl={3}></Grid>
                    </>

                )}
            </Grid>

        </>
    );
}
export default DiseaseTraitDetails;
