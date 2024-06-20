import React from "react";
import { GridProps, Box, Stack, Divider } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import DiseaseTrait from "../../assets/disease-trait.png";
import GeneBCRE from "../../assets/gene-bcre.png";
import SNPQTL from "../../assets/snp-qtl.png";
import SingleCell from "../../assets/single-cell.png";
import UMass from "../../assets/umass.png";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../Portals/styles";
import Grid2 from "@mui/material/Unstable_Grid2";
import { ExpandMore } from "@mui/icons-material";
import { DiseaseTraitAutoComplete } from "../Portals/DiseaseTraitPortal/DiseaseTraitAutoComplete";
import { GeneAutoComplete } from "../Portals/GenePortal/GeneAutocomplete";
import { SnpAutoComplete } from "../Portals/SnpPortal/SnpAutoComplete";
import { CelltypeAutoComplete } from "../Portals/SingleCellPortal/CelltypeAutoComplete";

type Portals = 'Disease' | 'Gene' | 'SNP' | 'SingleCell' | 'About'

type PortalPanelProps = {
  portal: Portals,
  mode: "search" | "button"
  /**
   * Placement of image on large screen width. On small width will always be on top of button
   */
  imagePlacement: "right" | "left";
};

/**
 *
 * @param props
 * Generates homepage/portal panel for specified portal
 */
export const PortalPanel: React.FC<PortalPanelProps> = (props) => {
  const navigate = useNavigate();

  const portalInfo: Record<Portals, {
    title: string,
    description: string,
    stats?: string[],
    buttonText: string,
    buttonLink: string,
    searchComponent?: JSX.Element,
    imageSRC: string,
    imgAltText: string
  }> = {
    Disease: {
      title: "Disease/Trait Portal",
      description: `
        Explore heritability enrichment for 17 distinct psychiatric,
        behavioral, and neuronal traits within gene regulatory features,
        such as candidate brain cis-Regulatory Elements (b-cCREs) and quantitative trait loci (QTLs). Search genes
        associated with complex traits based on PsychENCODE Transcriptome-wide association studies (TWAS).
      `,
      stats: [
        "17 total traits cataloged",
        "5,848 b-cCRE/trait associations"
      ],
      buttonText: "Explore Diseases/Traits",
      buttonLink: "/psychscreen/traits",
      imageSRC: DiseaseTrait,
      imgAltText: "Disease/Trait Portal",
      searchComponent: <DiseaseTraitAutoComplete navigateto="/psychscreen/traits/" showTitle />
    },
    Gene: {
      title: "Gene/b-cCRE Portal",
        description: `
          Explore gene expression and regulatory element activity in the
          fetal and adult brain at bulk and single-cell resolution.
          Visualize gene/b-cCRE links based on PsychENCODE QTLs and single
          cell co-expression analyses.
        `,
        stats: [
          "Gene expression from 294 donors, including 7 psychiatric disorders",
          "923,942 brain regulatory elements cataloged",
          "Chromatin accessibility in 13 brain regions",
          "Gene expression and gene regulatory networks across 27 cell types"
        ],
        buttonText: "Explore Genes/b-cCREs",
        buttonLink: "/psychscreen/gene",
        imageSRC: GeneBCRE,
        imgAltText: "Gene b-cCRE portal",
        searchComponent: <GeneAutoComplete navigateto="/psychscreen/gene/" showTitle />
    },
    SNP: {
      title: "SNP/QTL Portal",
      description: `
        Search Single nucleotide polymorphisms (SNPs) of interest and explore their impact on gene expression,
        chromatin accessibility, transcription factor (TF) binding and other
        molecular traits in the human brain based on PsychENCODE QTLs and
        sequence analysis of candidate brain cis-Regulatory Elements (b-cCREs). Link SNPs to complex traits using Genome-wide association studies (GWAS) anotations.
      `,
      stats: [
        "161,676,478 eQTLs, sQTLs, caQTLs, and fQTLs",
        "127,265 variants associated with complex traits",
        "510,062 variants in b-cCREs"
      ],
      buttonText: "Explore SNPs/QTLs",
      buttonLink: "/psychscreen/snp",
      imageSRC: SNPQTL,
      imgAltText: "SNP/QTL Portal",
      searchComponent: <SnpAutoComplete navigateto="/psychscreen/snp/" showTitle />
    },
    SingleCell: {
      title: "Single-Cell Portal",
      description: `
        Visualize the single-cell composition of the human brain based
        on single-cell ATAC-seq and RNA-seq from PsychENCODE and public
        sources. Identify marker genes and candidate brain cis-Regulatory Elements (b-cCREs) specific to particular
        cell types and states.
      `,
      stats: [
        "Transcriptomes for 2,040,943 single cells",
        "Chromatin accessibility for 344,135 single cells"
      ],
      buttonText: "Explore Single Cells",
      buttonLink: "/psychscreen/single-cell",
      imageSRC: SingleCell,
      imgAltText: "Single cell portal",
      searchComponent: <CelltypeAutoComplete navigateto="/psychscreen/single-cell/celltype/" showTitle />
    },
    About: {
      title: "About Us",
      description: `
        PsychSCREEN is a comprehensive catalog of genetic and epigenetic
        knowledge about the human brain. It was designed and built by Dr.
        Zhiping Weng's lab in collaboration with the Moore Lab and Colubri Lab 
        at UMass Chan Medical School as a product of the PsychENCODE Consortium.
      `,
      buttonText: "Learn More",
      buttonLink: "/psychscreen/aboutus",
      imageSRC: UMass,
      imgAltText: "UMass Chan Medical School Logo"
    }
  }

  return (
    <div>
      <Grid2 container xs={12} justifyContent={"space-between"} spacing={10}>
        <Grid2
          xs={12}
          md={6}
          order={{ xs: 2, md: props.imagePlacement === "right" ? 1 : 2 }}
          alignSelf={"center"}
        >
          <Stack spacing={2} alignItems={"flex-start"}>
            <Typography
              type="body"
              size="medium"
              style={{
                fontSize: "20px",
                lineHeight: "24.4px",
                fontWeight: 700,
              }}
            >
              {portalInfo[props.portal].title}
            </Typography>
            <Typography
              type="body"
              size="medium"
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                fontWeight: 400,
                letterSpacing: "0.3%",                
              }}
            >
              {portalInfo[props.portal].description}
            </Typography>
            <div>
              {portalInfo[props.portal].stats?.map((stat, i) => (
                <Typography
                  key={i}
                  type="body"
                  size="large"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                  }}
                >
                  <CheckIcon style={{ marginRight: "9px" }} />
                  {stat}
                </Typography>
              ))}
            </div>
            {props.mode === "button" ?
              <StyledButton
                bvariant="filled"
                btheme="light"
                onClick={() => {
                  navigate(portalInfo[props.portal].buttonLink);
                }}
              >
                {portalInfo[props.portal].buttonText}
              </StyledButton>
              :
              portalInfo[props.portal].searchComponent
            }
          </Stack>
        </Grid2>
        <Grid2
          xs={12}
          md={6}
          order={{ xs: 1, md: props.imagePlacement === "right" ? 2 : 1 }}
          minHeight={350}
        >
          <Box
            position={"relative"}
            height={"100%"}
            width={"100%"}
            sx={{
              objectPosition:
                props.imagePlacement === "right"
                  ? { md: "right center", xs: "left center" }
                  : { md: "left center", xs: "left center" },
            }}
          >
            <img
              style={{
                objectFit: "contain",
                objectPosition: "inherit",
                position: "absolute",
              }}
              height={"100%"}
              width={"100%"}
              src={portalInfo[props.portal].imageSRC}
              alt={portalInfo[props.portal].imgAltText}
            />
          </Box>
        </Grid2>
      </Grid2>
    </div>
  );
};

export const PortalsPanel: React.FC<GridProps> = (props) => (
  <Grid2 container rowSpacing={10}>
    <Grid2 xs={12}>
      <Divider>
        <Stack
          alignItems={"center"}
          onClick={() => {
            var element = document.getElementById("Portals");
            element &&
              element.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          sx={{ cursor: "pointer" }}
        >
          <Typography id="Portals" type={"display"} size={"small"}>
            Portals
          </Typography>
          <ExpandMore />
        </Stack>
      </Divider>
    </Grid2>
    <Grid2 xs={12}>
      <PortalPanel
        portal="Disease"
        mode="button"
        imagePlacement={"left"}
      />
    </Grid2>
    <Grid2 xs={12}>
      <Divider />
    </Grid2>
    <Grid2 xs={12}>
      <PortalPanel
        portal="Gene"
        mode="button"
        imagePlacement={"right"}
      />
    </Grid2>
    <Grid2 xs={12}>
      <Divider />
    </Grid2>
    <Grid2 xs={12}>
      <PortalPanel
        portal="SNP"
        mode="button"
        imagePlacement={"left"}
      />
    </Grid2>
    <Grid2 xs={12}>
      <Divider />
    </Grid2>
    <Grid2 xs={12}>
      <PortalPanel
        portal="SingleCell"
        mode="button"
        imagePlacement={"right"}
      />
    </Grid2>
    <Grid2 xs={12} mb={3}>
      <Divider />
    </Grid2>
  </Grid2>
);
export default PortalsPanel;
