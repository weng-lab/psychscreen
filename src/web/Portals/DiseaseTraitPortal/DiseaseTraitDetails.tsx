/**
 * @Jonathan 5/3/24 - 
 */

import { useParams } from "react-router-dom";
import React, { useCallback, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Stack } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import { Typography } from "@weng-lab/psychscreen-ui-components";
import GeneAssociations from "./GeneAssociations";
import AssociatedSnpQtl, { GWAS_SNP } from "./AssociatedSnpQtl";
import DiseaseIntersectingSnpsWithccres from "./DiseaseIntersectingSnpsWithccres";
import {
  DISEASE_CARDS,
  FULLSUMSTAT_URL_MAP,
  URL_CHROM_MAP,
  URL_MAP,
} from "./config/constants";
import { gql, useQuery } from "@apollo/client";
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
    bigRequests(requests: $bigRequests) {
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
      bigRequests: [
        {
          chr1: "chr1",
          chr2: URL_CHROM_MAP[trait],
          start: 0,
          end: 300000000,
          url: URL_MAP[trait], //.replace(/\/snps\//g, "/bed/significant/bb/") + ".bed.bb",
        },
      ],
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
          p: Math.exp(-+x.name.split("_")[1]),
        })
      ) || [],
      trait
    );
  }, [data]);

  
  return { loci, loading, data };
}

const DiseaseTraitDetails: React.FC = () => {
  const { disease } = useParams();
  const [page, setPage] = useState<number>(-1);
  const { state }: any = useLocation();
  const { searchvalue, diseaseDesc } = state
    ? state
    : { searchvalue: "", diseaseDesc: "" };

  const [gwasLocusSNPs, setGwasLocusSNPs] = useState<{SNPCount : number, minimump: number, coordinates: GenomicRange }>()
  const [browserCoordinates, setBrowserCoordinates] = useState<GenomicRange>({
    chromosome: "chr1",
    start: 161033654,
    end: 161317875,
  });
  const navigateBrowser = useCallback((coordinates: GenomicRange, gwasLocusSNPs?: { SNPCount : number, minimump: number }) => {
    
    if(gwasLocusSNPs){
      setGwasLocusSNPs({...gwasLocusSNPs, coordinates: coordinates})
    }
    setBrowserCoordinates(coordinates);
    setPage(3);
  }, []);

  const diseaseLabel =
    disease && DISEASE_CARDS.find((d) => d.val === disease)?.cardLabel;
  const summaryStatisticsURL = disease
    ? FULLSUMSTAT_URL_MAP[disease].startsWith("gs") ||
      FULLSUMSTAT_URL_MAP[disease].startsWith("https")
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
    <Grid container spacing={3} mt={6} mb={8} ml={"auto"} mr={"auto"} maxWidth={{ xl: "65%", lg: "75%", md: "85%", sm: "90%", xs: "90%" }}>
      <Grid xs={12}>
          <Typography
            type="display"
            size="medium"
            style={{
              fontWeight: 700,
              fontSize: "48px",
              lineHeight: "57.6px",
              letterSpacing: "0.5px",
            }}
          >
            {diseaseLabel}
          </Typography>
      </Grid>
      <Grid xs={12}>
          <Typography
            type="body"
            size="large"
            style={{
              fontSize: "16px",
              lineHeight: "24px",
              fontWeight: 400,
              letterSpacing: "0.3%",
            }}
          >
            {diseaseDesc.split("~~").length>1 ? <>{diseaseDesc.split("~~")[0]}<><i>{diseaseDesc.split("~~")[1]}</i>{diseaseDesc.split("~~")[2]}</></>: diseaseDesc}
          </Typography>
      </Grid>
      <Grid xs={12}>
        <Stack direction="row" spacing={1}>
          <StyledButton
            bvariant={page === -1 ? "filled" : "outlined"}
            btheme="light"
            onClick={() => setPage(-1)}
          >
            GWAS Locus Overview
          </StyledButton>
          {gassoc && gassoc.length > 0 && (
              <StyledButton
                bvariant={page === 0 ? "filled" : "outlined"}
                btheme="light"
                onClick={() => {
                  setPage(0);
                }}
              >
                Gene Associations (TWAS)
              </StyledButton>
          )}
          {data &&
            (data as { gwassnpAssociationsQuery: GWAS_SNP[] })
              .gwassnpAssociationsQuery?.length > 0 && (
                <StyledButton
                  bvariant={page === 1 ? "filled" : "outlined"}
                  btheme="light"
                  onClick={() => {
                    setPage(1);
                  }}
                >
                  Associated SNPs &amp; QTLs
                </StyledButton>
            )}
          {gwasIntersectingSnpWithCcresData &&
            adultgwasIntersectingSnpWithBcresData &&
            fetalgwasIntersectingSnpWithBcresData &&
            gwasIntersectingSnpWithCcresData.gwasintersectingSnpsWithCcreQuery
              .length > 0 && (
                <StyledButton
                  bvariant={page === 2 ? "filled" : "outlined"}
                  btheme="light"
                  onClick={() => setPage(2)}
                >
                  Associated SNPs in locus
                </StyledButton>
            )}
          {browserCoordinates && (
            <StyledButton
              bvariant={page === 3 ? "filled" : "outlined"}
              btheme="light"
              onClick={() => setPage(3)}
            >
              Brain Epigenome Browser
            </StyledButton>
          )}
          {/* Unused, can I remove? */}
          {significantSNPs && significantSNPs.length > 0 && 0>1 && (
            <StyledButton
              bvariant={page === 4 ? "filled" : "outlined"}
              btheme="light"
              onClick={() => setPage(4)}
            >
              Prioritized risk variants
            </StyledButton>
          )}
        </Stack>
      </Grid>
      <Grid xs={12}>
        {page === -1 ? (
          <RiskLocusView loci={loci || []} onLocusClick={navigateBrowser} disease={disease || ""} />
        ) : page === 0 && gassoc && gassoc.length > 0 ? (
          <GeneAssociations disease={disease || ""} data={gassoc} />
        ) : page === 1 &&
          data &&
          (data as { gwassnpAssociationsQuery: GWAS_SNP[] })
            .gwassnpAssociationsQuery?.length > 0 ? (
          //Which traits have this data
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
            coordinates={browserCoordinates}
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
            <Browser
              coordinates={browserCoordinates}
              url={summaryStatisticsURL}
              trait={diseaseLabel || "Autism Spectrum Disorder"}
              gwasLocusSNPs={gwasLocusSNPs}
            />
        ) : page === 4 && significantSNPs && significantSNPs.length > 0 && 0>1 ?  (
          // Unused, can I remove?
          <SignifcantSNPs trait={trait} onSNPClick={navigateBrowser} />
        ) : null}
      </Grid>
    </Grid>
  );
};
export default DiseaseTraitDetails;
