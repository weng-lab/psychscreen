import React from "react";
import { Grid, Container, GridProps, Box, Stack, Divider } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Button, Typography } from "@weng-lab/psychscreen-ui-components";

import DiseaseTrait from "../../assets/disease-trait.png";
import GeneBCRE from "../../assets/gene-bcre.png";
import SNPQTL from "../../assets/snp-qtl.png";
import SingleCell from "../../assets/single-cell.png";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useTheme, useMediaQuery } from "@material-ui/core";
import { StyledButton } from "../Portals/DiseaseTraitPortal/DiseaseTraitDetails";
import Grid2 from "@mui/material/Unstable_Grid2";


type PortalPanelProps = {
  title: string
  description: string
  stats?: string[]
  buttonText: string
  buttonLink: string
  imageSRC: string
  /**
   * Placement of image on large screen width. On small width will always be on top of button
   */
  imagePlacement: "right" | "left"
  imgAltText: string
}

/**
 * 
 * @param props 
 * Generates homepage panel with given info
 */
export const PortalPanel: React.FC<PortalPanelProps> = (props) => {
  const navigate = useNavigate();

  return (
    <div>
      <Grid2 container xs={12} justifyContent={"space-between"} spacing={3}>
        <Grid2 xs={12} md={6} order={{ xs: 2, md: props.imagePlacement === "right" ? 1 : 2 }} alignSelf={"center"}>
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
              {props.title}
            </Typography>
            <Typography
              type="body"
              size="medium"
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                fontWeight: 400,
                letterSpacing: "0.3%",
                width: "414px",
              }}
            >
              {props.description}
            </Typography>
            <div>
              {props.stats?.map((stat) =>
                <Typography
                  type="body"
                  size="large"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19px",
                  }}
                >
                  <CheckIcon style={{ marginRight: "9px" }} />
                  {stat}
                </Typography>
              )}
            </div>
            <StyledButton
              bvariant="filled"
              btheme="light"
              onClick={() => {
                navigate(props.buttonLink);
              }}
            >
              {props.buttonText}
            </StyledButton>
          </Stack>
        </Grid2>
        <Grid2 xs={12} md={6} 
          order={{ xs: 1, md: props.imagePlacement === "right" ? 2 : 1 }}
          minHeight={300}
        >
          <Box 
            position={"relative"} 
            height={"100%"} 
            width={'100%'} 
            sx={{ 
              objectPosition: props.imagePlacement === "right" ? 
              { md: "right bottom", xs: "left bottom" } 
              : { md: "left bottom", xs: "left bottom" } 
            }}>
            <img
              style={{ 
                objectFit: "contain", 
                objectPosition: "inherit",
                position: "absolute"
              }}
              height={"100%"}
              width={"100%"}
              src={props.imageSRC}
              alt={props.imgAltText}
            />
          </Box>
        </Grid2>
      </Grid2>
    </div>
  )
}

export const PortalsPanel: React.FC<GridProps> = (props) => (
  <Grid2 container rowSpacing={10}>
    <Grid2 xs={12}>
      <PortalPanel
        title={"Disease/Trait Portal"}
        description={`
          Explore heritability enrichment for 40 distinct psychiatric,
          behavioral, and neuronal traits within gene regulatory features,
          such as b-cCREs and quantitative trait loci (QTLs). Search genes
          associated with complex traits based on PsychENCODE TWAS.
        `}
        stats={[
          "40 total traits cataloged",
          "1,103 b-cCRE/trait associations"
        ]}
        buttonText={"Explore Diseases/Traits"}
        buttonLink={"/psychscreen/traits"}
        imageSRC={DiseaseTrait}
        imagePlacement={"left"}
        imgAltText={"Disease/Trait Portal"}
      />
    </Grid2>
    <Grid2 xs={12}>
      <Divider />
    </Grid2>
    <Grid2 xs={12}>
      <PortalPanel
        title={"Gene/b-cCRE Portal"}
        description={`
          Explore gene expression and regulatory element activity in the
          fetal and adult brain at bulk and single-cell resolution.
          Visualize gene/b-cCRE links based on PsychENCODE QTLs and single
          cell co-expression analyses.
        `}
        stats={[
          "Gene expression in 11 brain regions",
          "23 fetal, adolescent, and adult time points covered",
          "761,984 brain regulatory elements"
        ]}
        buttonText={"Explore Genes/b-cCREs"}
        buttonLink={"/psychscreen/gene"}
        imageSRC={GeneBCRE}
        imagePlacement={"right"}
        imgAltText={"Gene b-cCRE portal"}
      />
    </Grid2>
    <Grid2 xs={12}>
      <Divider />
    </Grid2>
    <Grid2 xs={12}>
      <PortalPanel
        title={"SNP/QTL Portal"}
        description={`
          Search SNPs of interest and explore their impact on gene expression,
          chromatin accessibility, transcription factor (TF) binding and other
          molecular traits in the human brain based on PsychENCODE QTLs and
          sequence analysis of b-cCREs. Link SNPs to complex traits using GWAS
        `}
        stats={[
          "441,502 eQTLs, sQTLs, caQTLs, and fQTLs",
          "13,336 variants associated with complex traits",
          "510,062 variants in b-cCREs"
        ]}
        buttonText={"Explore SNPs/QTLs"}
        buttonLink={"/psychscreen/snp"}
        imageSRC={SNPQTL}
        imagePlacement={"left"}
        imgAltText={"SNP/QTL Portal"}
      />
    </Grid2>
    <Grid2 xs={12}>
      <Divider />
    </Grid2>
    <Grid2 xs={12}>
      <PortalPanel
        title={"Single-Cell Portal"}
        description={`
          Visualize the single cell composition of the human brain based
          on single cell ATAC-seq and RNA-seq from PsychENCODE and public
          sources. Identify marker genes and b-cCREs specific to particular
          cell types and states.
        `}
        stats={[
          "Transcriptomes for 1,391,772 single cells",
          "Chromatin accessibility for 1,009,942 single cells"
        ]}
        buttonText={"Explore Single Cells"}
        buttonLink={"/psychscreen/single-cell"}
        imageSRC={SingleCell}
        imagePlacement={"right"}
        imgAltText={"Single cell portal"}
      />
    </Grid2>
    <Grid2 xs={12} mb={3}>
      <Divider />
    </Grid2>
  </Grid2>
);
export default PortalsPanel;
