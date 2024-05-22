import { useParams } from "react-router-dom";
import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, Container, GridProps } from "@mui/material";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import GeneAssociations from "./GeneAssociations";
import AssociatedSnpQtl, { GWAS_SNP } from "./AssociatedSnpQtl";
import DiseaseIntersectingSnpsWithccres from "./DiseaseIntersectingSnpsWithccres";
import { DISEASE_CARDS, FULLSUMSTAT_URL_MAP, URL_CHROM_MAP, URL_MAP } from "./config/constants";
import { gql, useQuery } from "@apollo/client";
import { PORTALS } from "../../../App";
import { riskLoci } from "./utils";
import RiskLocusView from "./RiskLoci";
import { GenomicRange } from "../GenePortal/AssociatedxQTL";
import Browser from "./Browser";
import SignifcantSNPs, { traitKey, useSNPs } from "./SignificantSNPs";
import { StyledButton } from "../../Portals/styles";

const AssociatedSnpQuery = gql`
  query gwassnpAssoQuery(
    $disease: String!
    $snpid: String
    $limit: Int
    $offset: Int
  ) {
    gwassnpAssociationsQuery(
      disease: $disease
      snpid: $snpid
      limit: $limit
      offset: $offset
    ) {
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
`;

const AssociatedGenesQuery = gql`
  query genesAssoQuery(
    $disease: String!
    $gene_id: String
    $limit: Int
    $offset: Int
  ) {
    genesAssociationsQuery(
      disease: $disease
      gene_id: $gene_id
      limit: $limit
      offset: $offset
    ) {
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
`;

const GwasIntersectingSnpswithCcresQuery = gql`
  query gwasintersectingSnpsWithCcre(
    $disease: String!
    $snpid: String
    $limit: Int
  ) {
    gwasintersectingSnpsWithCcreQuery(
      disease: $disease
      snpid: $snpid
      limit: $limit
    ) {
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
  }
`;

const GwasIntersectingSnpswithBcresQuery = gql`
  query gwasintersectingSnpsWithBcre(
    $disease: String!
    $snpid: String
    $bcre_group: String
    $limit: Int
  ) {
    gwasintersectingSnpsWithBcreQuery(
      disease: $disease
      snpid: $snpid
      bcre_group: $bcre_group
      limit: $limit
    ) {
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
  }
`;

const locusQuery = gql`
  query q($bigRequests: [BigRequest!]!) {
    bigRequests(
      requests:  $bigRequests 
    ) {
      data
      error {
        message
      }
    }
  }
`;

function useLoci(trait: string) {
  const { data, loading } = useQuery<
    | { gwassnpAssociationsQuery: GWAS_SNP[] }
    | { bigRequests: [{ data: (GenomicRange & { name: string })[] }] }
  >(!URL_MAP[trait].startsWith("https") ? AssociatedSnpQuery : locusQuery, {
    variables: {
      disease: trait || "",
      bigRequests: [{
        chr1: "chr1",
        chr2: URL_CHROM_MAP[trait],
        start: 0,
        end: 300000000,
        url: URL_MAP[trait] //.replace(/\/snps\//g, "/bed/significant/bb/") + ".bed.bb",
      }],


    },
  });
  
  const loci = useMemo(() => {
    if (!data) return undefined;
    if (!URL_MAP[trait].startsWith("https"))
      return riskLoci(
        (
          data as { gwassnpAssociationsQuery: GWAS_SNP[] }
        ).gwassnpAssociationsQuery?.map((x) => ({
          chromosome: x.chrom,
          start: x.start,
          end: x.stop,
          p: Math.min(...x.association_p_val),
        })) || []
      );
    const d = data as {
      bigRequests: [{ data: (GenomicRange & { name: string; chr: string })[] }];
    };
    return riskLoci(
      d.bigRequests[0].data?.map(
        (x: GenomicRange & { name: string; chr: string }) => ({
          chromosome: x.chr,
          start: x.start,
          end: x.end,
          p: Math.exp(- +x.name.split("_")[1]),
        })
      ) || [], trait
    );
  }, [data]);

  return { loci, loading, data };
}

const DiseaseTraitDetails: React.FC<GridProps> = (props) => {
  const { disease } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(-1);
  const { state }: any = useLocation();
  const { searchvalue, diseaseDesc } = state
    ? state
    : { searchvalue: "", diseaseDesc: "" };
  const [browserCoordinates, setBrowserCoordinates] = useState<GenomicRange>({
    chromosome: "chr12",
    start: 5219427,
    end: 5234775,
  });
  const navigateBrowser = useCallback((coordinates: GenomicRange) => {
    setBrowserCoordinates(coordinates);
    setPage(3);
  }, []);

  const diseaseLabel =
    disease && DISEASE_CARDS.find((d) => d.val === disease)?.cardLabel;
  const summaryStatisticsURL = disease
  ? FULLSUMSTAT_URL_MAP[disease].startsWith("gs") || FULLSUMSTAT_URL_MAP[disease].startsWith("https")
        ? FULLSUMSTAT_URL_MAP[disease]
      : `https://downloads.wenglab.org/psychscreen-summary-statistics/${URL_MAP[disease]}.bigBed`
    : "https://downloads.wenglab.org/psychscreen-summary-statistics/autism.bigBed";
  const { loci, data } = useLoci(disease || "");

  const { data: genesdata } = useQuery(AssociatedGenesQuery, {
    variables: {
      disease: disease || "",
      //  limit: 1000,
      skip: disease === "",
    },
  });
  const { data: gwasIntersectingSnpWithCcresData } = useQuery(
    GwasIntersectingSnpswithCcresQuery,
    {
      variables: {
        disease: disease,
      },
      skip: disease === "",
    }
  );
  const { data: adultgwasIntersectingSnpWithBcresData } = useQuery(
    GwasIntersectingSnpswithBcresQuery,
    {
      variables: {
        disease: disease,
        bcre_group: "adult",
      },
      skip: disease === "",
    }
  );
  const { data: fetalgwasIntersectingSnpWithBcresData } = useQuery(
    GwasIntersectingSnpswithBcresQuery,
    {
      variables: {
        disease: disease,
        bcre_group: "fetal",
      },
      skip: disease === "",
    }
  );
  const trait = disease ? URL_MAP[disease] : "";
  const significantSNPs = useSNPs(traitKey(trait));
  const gassoc =
    genesdata &&
    genesdata.genesAssociationsQuery.filter((g) => g.dge_fdr <= 0.05);
  return (
    <Grid container {...props}>
      <Grid item sm={1} md={1} lg={1.5} xl={1.5} />
      <Grid item sm={10} md={10} lg={9} xl={9}>
        <Container style={{ marginTop: "-10px", marginLeft: "100px" }}>
          <Typography
            type="display"
            size="medium"
            style={{
              fontWeight: 700,
              fontSize: "48px",
              lineHeight: "57.6px",
              letterSpacing: "0.5px",
              marginBottom: "16px",
            }}
          >
            {diseaseLabel}
          </Typography>
          <br />
          <Typography
            type="body"
            size="large"
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 400,
              letterSpacing: "0.3%",
              marginBottom: "16px",
            }}
          >
            {diseaseDesc}
          </Typography>
          <br />
          <StyledButton
            bvariant={page === -1 ? "filled" : "outlined"}
            btheme="light"
            onClick={() => setPage(-1)}
          >
            GWAS Locus Overview
          </StyledButton>
          &nbsp;&nbsp;&nbsp;
          {gassoc && gassoc.length > 0 && (
            <>
              <StyledButton
                bvariant={page === 0 ? "filled" : "outlined"}
                btheme="light"
                onClick={() => {
                  setPage(0);
                }}
              >
                Gene Associations (TWAS)
              </StyledButton>
              &nbsp;&nbsp;&nbsp;
            </>
          )}
          {data &&
            (data as { gwassnpAssociationsQuery: GWAS_SNP[] })
              .gwassnpAssociationsQuery?.length > 0 && (
              <>
                <StyledButton
                  bvariant={page === 1 ? "filled" : "outlined"}
                  btheme="light"
                  onClick={() => {
                    setPage(1);
                  }}
                >
                  Associated SNPs &amp; QTLs
                </StyledButton>
                &nbsp;&nbsp;&nbsp;
              </>
            )}
          {gwasIntersectingSnpWithCcresData &&
            adultgwasIntersectingSnpWithBcresData &&
            fetalgwasIntersectingSnpWithBcresData &&
            gwasIntersectingSnpWithCcresData.gwasintersectingSnpsWithCcreQuery
              .length > 0 && (
              <>
                <StyledButton
                  bvariant={page === 2 ? "filled" : "outlined"}
                  btheme="light"
                  onClick={() => setPage(2)}
                >
                  Regulatory SNP Associations
                </StyledButton>
                &nbsp;&nbsp;&nbsp;
              </>
            )}
          {browserCoordinates && (
            <StyledButton
              bvariant={page === 3 ? "filled" : "outlined"}
              btheme="light"
              onClick={() => setPage(3)}
            >
              Brain epi Genome Browser
            </StyledButton>
          )}
          {significantSNPs && significantSNPs.length > 0 && (
            <StyledButton
              bvariant={page === 4 ? "filled" : "outlined"}
              btheme="light"
              onClick={() => setPage(4)}
            >
              Prioritized risk variants
            </StyledButton>
          )}
        </Container>
      </Grid>
      <Grid item sm={1} md={1} lg={1.5} xl={1.5} />
      <Grid item sm={1} md={1} lg={1.5} xl={1.5} />
      <Grid sm={10} md={10} lg={9} xl={9}>
        {page === -1 ? (
          <RiskLocusView loci={loci || []} onLocusClick={navigateBrowser} />
        ) : page === 0 && gassoc && gassoc.length > 0 ? (
          <GeneAssociations disease={disease || ""} data={gassoc} />
        ) : page === 1 &&
          data &&
          (data as { gwassnpAssociationsQuery: GWAS_SNP[] })
            .gwassnpAssociationsQuery?.length > 0 ? (
          <AssociatedSnpQtl
            disease={disease || ""}
            data={
              (data as { gwassnpAssociationsQuery: GWAS_SNP[] })
                .gwassnpAssociationsQuery
            }
          />
        ) : page === 2 &&
          gwasIntersectingSnpWithCcresData &&
          adultgwasIntersectingSnpWithBcresData &&
          fetalgwasIntersectingSnpWithBcresData &&
          gwasIntersectingSnpWithCcresData.gwasintersectingSnpsWithCcreQuery
            .length > 0 ? (
          <DiseaseIntersectingSnpsWithccres
            disease={disease || ""}
            ccredata={
              gwasIntersectingSnpWithCcresData.gwasintersectingSnpsWithCcreQuery
            }
            adult_bcredata={
              adultgwasIntersectingSnpWithBcresData.gwasintersectingSnpsWithBcreQuery
            }
            fetal_bcredata={
              fetalgwasIntersectingSnpWithBcresData.gwasintersectingSnpsWithBcreQuery
            }
          />
        ) : page === 3 ? (
          <div style={{ marginTop: "2em" }}>
            <Browser
              coordinates={browserCoordinates}
              url={summaryStatisticsURL}
              trait={diseaseLabel || "Autism Spectrum Disorder"}
            />
          </div>
        ) : page === 4 && significantSNPs && significantSNPs.length > 0 ? (
          <SignifcantSNPs trait={trait} onSNPClick={navigateBrowser} />
        ) : null}
      </Grid>
      <Grid item sm={1} md={1} lg={1.5} xl={1.5} />
    </Grid>
  );
};
export default DiseaseTraitDetails;
