/**
 * DownloadsPage.tsx: contains links to various PsychSCREEN downloads.
 */

import React from "react";
import { Grid } from "@mui/material";
import {
  Typography
} from "@weng-lab/psychscreen-ui-components";
import { Container } from "@mui/system";
import BEDFileDownloadTable, { DataRow } from "./BCRETable";
import { StyledButton } from "../Portals/styles";

function createData(
  name: string,
  group: string,
  elements: number,
  fileSize: number,
  url: string
): DataRow {
  return { name, group, elements, fileSize, url };
}

const eqtls = {
  colorGroups: {
    all: "#fafafa"
  },
  defaultRows: [

    createData(
      "Astrocytes",
      "all",
      75616,
      9159977,
      "https://downloads.wenglab.org/Astro_sig_QTLs.dat"),

    createData(
      "Chandelier",
      "all",
      122979,
      14900515,
      "https://downloads.wenglab.org/Chandelier__Pvalb_sig_QTLs.dat"),

    createData(
      "Layer 2/3 Intratelencephalic projecting",
      "all",
      368686,
      9159977,
      "https://downloads.wenglab.org/L2.3.IT_sig_QTLs.dat"),
    createData(
      "Layer 4 Intratelencephalic projecting",
      "all",
      149884,
      18170994,
      "https://downloads.wenglab.org/L4.IT_sig_QTLs.dat"),

    createData(
      "Layer 5/6 Near projecting",
      "all",
      1128,
      128574,
      "https://downloads.wenglab.org/L5.6.NP_sig_QTLs.dat"),

    createData(
      "Layer 5 Intratelencephalic projecting",
      "all",
      200390,
      24259466,
      "https://downloads.wenglab.org/L5.IT_sig_QTLs.dat"),

  ],
  extraRows: [


    createData(
      "L6b",
      "all",
      5067,
      600035,
      "https://downloads.wenglab.org/L6b_sig_QTLs.dat"),

    createData(
      "Layer 6 Corticothalamic projecting",
      "all",
      24254,
      2932574,
      "https://downloads.wenglab.org/L6.CT_sig_QTLs.dat"),

    createData(
      "Layer 6 Intratelencephalic projecting",
      "all",
      178645,
      21604986,
      "https://downloads.wenglab.org/L6.IT_sig_QTLs.dat"),

    createData(
      "Lamp5.Lhx6",
      "all",
      139,
      16614,
      "https://downloads.wenglab.org/Lamp5.Lhx6_sig_QTLs.dat"),

    createData(
      "Lamp5",
      "all",
      34653,
      4187511,
      "https://downloads.wenglab.org/Lamp5_sig_QTLs.dat"),

    createData(
      "Microglia",
      "all",
      7334,
      876091,
      "https://downloads.wenglab.org/Micro.PVM_sig_QTLs.dat"),
    createData(
      "Oligodendrocytes",
      "all",
      113473,
      13738363,
      "https://downloads.wenglab.org/Oligo_sig_QTLs.dat"),

    createData(
      "Oligodendrocyte Precursor Cells",
      "all",
      44567,
      5406474,
      "https://downloads.wenglab.org/OPC_sig_QTLs.dat"),

    createData(
      "Pericytes",
      "all",
      520,
      61819,
      "https://downloads.wenglab.org/PC_sig_QTLs.dat"),
    createData(
      "Sst",
      "all",
      48602,
      5883595,
      "https://downloads.wenglab.org/Sst__Sst.Chodl_sig_QTLs.dat"),

    createData(
      "Vip",
      "all",
      78316,
      9513653,
      "https://downloads.wenglab.org/Vip_sig_QTLs.dat"),



  ]
}
const deg = {
  colorGroups: {
    all: "#fafafa"
  },
  defaultRows: [
    createData(
      "ASD",
      "all",
      281936,
      23330766,
      "https://downloads.wenglab.org/ASD_DEGcombined.csv"

    ),
    createData(
      "Age",
      "all",
      333486,
      28216020,
      "https://downloads.wenglab.org/Age_DEGcombined.csv"

    )

  ],
  extraRows: [createData(
    "Bipolar",
    "all",
    333486,
    27890177,
    "https://downloads.wenglab.org/Bipolar_DEGcombined.csv"

  ),
  createData(
    "Schizophrenia",
    "all",
    333486,
    28152425,
    "https://downloads.wenglab.org/Schizophrenia_DEGcombined.csv"

  )]
}
const grns = {
  colorGroups: {
    all: "#fafafa"
  },
  defaultRows: [
    createData(
      "Astrocytes",
      "all",
      119371,
      10167596,
      "https://downloads.wenglab.org/Ast_GRN.txt"

    ),
    createData(
      "Chandelier",
      "all",
      111593,
      10621216,
      "https://downloads.wenglab.org/Chandelier_GRN.txt"

    ),
    createData(
      "Endothelial cells",
      "all",
      147187,
      11474071,
      "https://downloads.wenglab.org/End_GRN.txt"

    )
  ],
  extraRows: [
    createData(
      "Immune cells",
      "all",
      365163,
      30909389,
      "https://downloads.wenglab.org/Immune_GRN.txt"

    ),
    createData(
      "Layer 2/3 Intratelencephalic projecting",
      "all",
      1121326,
      93844103,
      "https://downloads.wenglab.org/L2.3.IT_GRN.txt"

    ),
    createData(
      "Layer 4 Intratelencephalic projecting",
      "all",
      1118974,
      91304745,
      "https://downloads.wenglab.org/L4.IT_GRN.txt"

    ), createData(
      "Layer 5/6 Near projecting",
      "all",
      1120861,
      93893001,
      "https://downloads.wenglab.org/L5.6.NP_GRN.txt"

    ),
    createData(
      "Layer 5 Extratelencephalic projecting",
      "all",
      1123716,
      92134774,
      "https://downloads.wenglab.org/L5.ET_GRN.txt"

    ),
    createData(
      "Layer 5 Intratelencephalic projecting",
      "all",
      1119683,
      91416944,
      "https://downloads.wenglab.org/L5.IT_GRN.txt"

    ),
    createData(
      "Layer 6 Corticothalamic projecting",
      "all",
      1123628,
      91987391,
      "https://downloads.wenglab.org/L6.CT_GRN.txt"

    ),
    createData(
      "Layer 6 Intratelencephalic projecting Car3",
      "all",
      1125599,
      97944193,
      "https://downloads.wenglab.org/L6.IT.Car3_GRN.txt"

    ),
    createData(
      "Layer 6 Intratelencephalic projecting",
      "all",
      1123520,
      91958291,
      "https://downloads.wenglab.org/L6.IT_GRN.txt"

    ),
    createData(
      "L6b",
      "all",
      159900,
      1124341,
      "https://downloads.wenglab.org/L6b_GRN.txt"

    ),
    createData(
      "Lamp5.Lhx6",
      "all",
      159900,
      115918,
      "https://downloads.wenglab.org/Lamp5.Lhx6_GRN.txt"

    ),
    createData(
      "Lamp5",
      "all",
      114228,
      10377377,
      "https://downloads.wenglab.org/Lamp5_GRN.txt"

    ),
    createData(
      "Microglia",
      "all",
      363592,
      29463266,
      "https://downloads.wenglab.org/Mic_GRN.txt"

    ),
    createData(
      "Oligodendrocyte Precursor Cells",
      "all",
      75433,
      5000000,
      "https://downloads.wenglab.org/OPC_GRN.txt"

    ),
    createData(
      "Oligodendrocytes",
      "all",
      386903,
      31752688,
      "https://downloads.wenglab.org/Oli_GRN.txt"

    ),
    createData(
      "Pax6",
      "all",
      115494,
      10431360,
      "https://downloads.wenglab.org/Pax6_GRN.txt"

    ),
    createData(
      "Pvalb",
      "all",
      114769,
      10430956,
      "https://downloads.wenglab.org/Pvalb_GRN.txt"

    ),
    createData(
      "Sncg",
      "all",
      114459,
      10320486,
      "https://downloads.wenglab.org/Sncg_GRN.txt"

    ),
    createData(
      "Sst",
      "all",
      115462,
      10313395,
      "https://downloads.wenglab.org/Sst_GRN.txt"

    ),
    createData(
      "Vascular Leptomeningeal Cells",
      "all",
      146108,
      11546374,
      "https://downloads.wenglab.org/VLMC_GRN.txt"

    ),
    createData(
      "Vip",
      "all",
      114088,
      10145653,
      "https://downloads.wenglab.org/Vip_GRN.txt"

    )


  ]
}

const atacPeaks = {
  defaultRows: [
    createData(
      "Astrocytes",
      "all",
      174020,
      4158584,
      "https://downloads.wenglab.org/Astro.PeakCalls.bed"
    ),
    createData(
      "Oligodendrocyte Precursor Cells",
      "all",
      140050,
      7090905,
      "https://downloads.wenglab.org/OPC.PeakCalls.bed"
    ),
    createData(
      "Microglia",
      "all",
      157885,
      3770493,
      "https://downloads.wenglab.org/Micro.PeakCalls.bed"
    )

  ],
  extraRows: [

    //"Inhibitory Neurons",
    createData(
      "Inhibitory Neurons",
      "all",
      203602,
      4862799,
      "https://downloads.wenglab.org/Inh.PeakCalls.bed"
    ),
    createData(
      "Excitatory Neurons",
      "all",
      292037,
      6973227,
      "https://downloads.wenglab.org/Exc.PeakCalls.bed"
    ),
    //"All CellTypes",
    createData(
      "All CellTypes",
      "all",
      562098,
      13430381,
      "https://downloads.wenglab.org/all_types.PeakCalls.bed"
    ),
    //"Endothelial Cells",
    createData(
      "Endothelial Cells",
      "all",
      155772,
      3713682,
      "https://downloads.wenglab.org/Endo.PeakCalls.bed"
    ),
    createData(
      "Oligodendrocytes",
      "all",
      178629,
      4267561,
      "https://downloads.wenglab.org/Oligo.PeakCalls.bed"
    ),

  ],
  colorGroups: {
    all: "#fafafa"
  },
}
const bCREDownloads = {
  defaultRows: [
    createData(
      "All Human b-cCREs",
      "all",
      398100,
      14690395,
      "https://gcp.wenglab.org/psychscreen-downloads/bCREs/all-bCREs.bed"
    ),
  ],
  extraRows: [
    createData(
      "Adult b-cCREs, all",
      "adult",
      253638,
      13919707,
      "https://gcp.wenglab.org/psychscreen-downloads/bCREs/adult-bCREs.bed"
    ),
    createData(
      "Adult b-cCREs, neuron-specific",
      "adult",
      46194,
      2123419,
      "https://gcp.wenglab.org/psychscreen-downloads/bCREs/adult-NeuN+-bCREs.bed"
    ),
    createData(
      "Adult b-cCREs, glia-specific",
      "adult",
      43866,
      2013769,
      "https://gcp.wenglab.org/psychscreen-downloads/bCREs/adult-NeuN--bCREs.bed"
    ),
    createData(
      "Adult b-cCREs, neuron/glia shared",
      "adult",
      69899,
      3840658,
      "https://gcp.wenglab.org/psychscreen-downloads/bCREs/adult-shared-bCREs.bed"
    ),
    createData(
      "Fetal b-cCREs, all",
      "fetal",
      230936,
      12677878,
      "https://gcp.wenglab.org/psychscreen-downloads/bCREs/fetal-bCREs.bed"
    ),
  ],
  colorGroups: {
    all: "#fafafa",
    adult: "#eeeeee",
    fetal: "#fafafa",
  },
};

const bulkImportantRegionDownloads = {
  defaultRows: [
    createData(
      "VLPFC neurons ATAC signal, upregulating",
      "VLPFC",
      368895,
      505784897,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_neurons.profile_scores.bw.pos.bb.bed.annotated.bed"
    ),
    createData(
      "VLPFC glia ATAC signal, upregulating",
      "VLPFC",
      309342,
      422733989,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_glia.profile_scores.bw.pos.bb.bed.annotated.bed"
    ),
  ],
  extraRows: [
    createData(
      "VLPFC neurons ATAC signal, downregulating",
      "VLPFC",
      125881,
      153033684,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_neurons.profile_scores.bw.neg.bb.bed.annotated.bed"
    ),
    createData(
      "VLPFC glia ATAC signal, downregulating",
      "VLPFC",
      74863,
      88924905,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_glia.profile_scores.bw.neg.bb.bed.annotated.bed"
    ),
    createData(
      "putamen neurons, upregulating",
      "putamen",
      368895,
      499367427,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN+.profile_scores.bw.pos.bb.bed.annotated.bed"
    ),
    createData(
      "putamen glia, upregulating",
      "putamen",
      309342,
      422733989,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN-.profile_scores.bw.pos.bb.bed.annotated.bed"
    ),
    createData(
      "putamen neurons, downregulating",
      "putamen",
      125881,
      175470333,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN+.profile_scores.bw.neg.bb.bed.annotated.bed"
    ),
    createData(
      "putamen glia, downregulating",
      "putamen",
      74863,
      96898982,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN-.profile_scores.bw.neg.bb.bed.annotated.bed"
    ),
  ],
  colorGroups: {
    VLPFC: "#fafafa",
    putamen: "#eeeeee",
  },
};

const singleCellImportantRegionDownloads = {
  defaultRows: [
    createData(
      "Microglia, upregulating",
      "microglia",
      257851,
      279454648,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Microglia.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Microglia, downregulating",
      "microglia",
      44629,
      37124711,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Microglia.profile_scores.bw.neg.bed.annotated.bed"
    ),
  ],
  extraRows: [
    createData(
      "Astrocytes, upregulating",
      "astrocytes",
      121724,
      87663966,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Astrocyte_1.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Astrocytes, downregulating",
      "astrocytes",
      9624,
      6870613,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Astrocyte_1.profile_scores.bw.neg.bed.annotated.bed"
    ),
    createData(
      "Oligodendrocyte precursors, upregulating",
      "opcs",
      183446,
      157867921,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte_Precursor.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Oligodendrocyte precursors, downregulating",
      "opcs",
      29434,
      21496793,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte_Precursor.profile_scores.bw.neg.bed.annotated.bed"
    ),
    createData(
      "Oligodendrocytes, upregulating",
      "olig",
      312172,
      363360704,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Oligodendrocytes, downregulating",
      "olig",
      72775,
      65344684,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte.profile_scores.bw.neg.bed.annotated.bed"
    ),
    createData(
      "Glutaminergic Neurons I, upregulating",
      "gluI",
      365861,
      424763761,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_1.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Glutaminergic Neurons I, downregulating",
      "gluI",
      139464,
      129318985,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_1.profile_scores.bw.neg.bed.annotated.bed"
    ),
    createData(
      "Glutaminergic Neurons II, upregulating",
      "gluII",
      357677,
      395951962,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_2.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Glutaminergic Neurons II, downregulating",
      "gluII",
      128745,
      120385750,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_2.profile_scores.bw.neg.bed.annotated.bed"
    ),
  ],
  colorGroups: {
    microglia: "#fafafa",
    astrocytes: "#eeeeee",
    opcs: "#fafafa",
    olig: "#eeeeee",
    gluI: "#fafafa",
    gluII: "#eeeeee",
  },
};

const gwasMetaDownloads = {
  defaultRows: [
    createData(
      "ADHD (5 studies)",
      "brain",
      7997741,
      430168632,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/ADHD1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "alcohol use (2 studies)",
      "brain",
      15342055,
      836612757,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/AlcoholUse1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "Alzheimers (5 studies)",
      "brain",
      1185515,
      63141184,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Alzheimers1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "anorexia nervosa (4 studies)",
      "brain",
      8170867,
      441227579,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Anorexia1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "anxiety (2 studies)",
      "brain",
      6286233,
      337425172,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Anxiety1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "autism spectrum disorder (4 studies)",
      "brain",
      9616178,
      519317164,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Autism1.tsv.snps.bed.bb.bed"
    ),
  ],
  extraRows: [
    createData(
      "bipolar disorder (8 studies)",
      "brain",
      12316354,
      667694563,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Bipolar1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "BMI (3 studies)",
      "brain",
      1187064,
      63273621,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/BMI1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "cigarette use (2 studies)",
      "brain",
      1187090,
      63471107,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/CigaretteUse1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "circadian rhythm (3 studies)",
      "brain",
      1187000,
      63448685,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Circadian1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "intelligence (5 studies)",
      "brain",
      1187178,
      63063383,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Intelligence1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "major depressive disorder (7 studies)",
      "brain",
      13631590,
      739615394,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Depression1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "neuroticism (3 studies)",
      "brain",
      1187150,
      63157541,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Neuroticism1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "number of children (4 studies)",
      "brain",
      1186976,
      63303784,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Children1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "schizophrenia (9 studies)",
      "brain",
      9538405,
      513791524,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Schizophrenia1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "allergies/asthma (4 studies)",
      "non-brain",
      1187049,
      63394018,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/AllergyAsthma1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "cancer (7 studies)",
      "non-brain",
      1187263,
      63405162,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Cancer1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "inflammatory bowel disease (6 studies)",
      "non-brain",
      1181256,
      62886677,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/IBD1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "myocardial traits (4 studies)",
      "non-brain",
      1187261,
      63298941,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Myocardial1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "type 2 diabetes (3 studies)",
      "non-brain",
      1187048,
      63268462,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/Type2Diabetes1.tsv.snps.bed.bb.bed"
    ),
    createData(
      "vascular disease (3 studies)",
      "non-brain",
      1172234,
      62735623,
      "https://downloads.wenglab.org/psychscreen-summary-statistics/meta/bed/VascularDisease1.tsv.snps.bed.bb.bed"
    ),
  ],
  colorGroups: {
    brain: "#fafafa",
    "non-brain": "#eeeeee",
  },
};

const pages = ["Regulatory Elements", "TF Binding Sites", "GWAS meta analysis", "ATAC-Seq Peaks", "Gene Regulatory Networks", "Differentially expressed genes", "Cell type specific eQTLs"];

const DownloadsPage: React.FC = () => {
  // page and navigation controls
  const [page, setPage] = React.useState(0);

  return (
    <>
      <Grid container>
        <Grid item sm={0} md={0} lg={1} xl={2} />
        <Grid item sm={0} md={0} lg={11} xl={10}>
          <Container
            style={{
              marginTop: "25px",
              marginLeft: "0px",
              width: "741px",
              marginBottom: "30px",
            }}
          >
            <Typography
              type="body"
              size="medium"
              style={{
                fontSize: "32px",
                lineHeight: "38.4px",
                fontWeight: 700,
              }}
            >
              PsychSCREEN Downloads
            </Typography>
          </Container>
        </Grid>
        <Grid item sm={0} md={0} lg={1} xl={2} />
        <Grid item sm={0} md={0} lg={10} xl={8}>
          {pages.map((p, i) => (
            <StyledButton
              bvariant={page === i ? "filled" : "outlined"}
              btheme="light"
              onClick={() => setPage(i)}
              style={{ marginRight: "5px" }}
            >
              {p}
            </StyledButton>
          ))}
          <div style={{ marginTop: "20px" }}>
            {page === 0 && (
              <BEDFileDownloadTable
                title="Brain cis-Regulatory Elements (b-cCREs)"
                {...bCREDownloads}
              />
            )}
            {page === 1 && (
              <>
                <BEDFileDownloadTable
                  title="Bulk ATAC-seq TFBSs from ChromBPNet"
                  {...bulkImportantRegionDownloads}
                />
                <BEDFileDownloadTable
                  title="Single Cell ATAC-seq TFBSs from ChromBPNet"
                  {...singleCellImportantRegionDownloads}
                />
              </>
            )}
            {page === 2 && (
              <>
                <BEDFileDownloadTable
                  title="GWAS meta analysis"
                  elementText="SNPs"
                  {...gwasMetaDownloads}
                />
              </>
            )}
            {page === 3 && (
              <BEDFileDownloadTable
                title="Atac seq peaks"
                {...atacPeaks}
              />
            )

            }
            {page === 4 && (
              <BEDFileDownloadTable
                title="Gene Regulatory Networks"
                {...grns}
              />
            )

            }
            {page === 5 && (
              <BEDFileDownloadTable
                title="Differentially expressed genes "
                {...deg}
              />
            )

            }
            {page === 6 && (
              <BEDFileDownloadTable
                title="Cell type specific eQTLs"
                {...eqtls}
              />
            )
            }
          </div>
        </Grid>
        <Grid item sm={0} md={0} lg={1} xl={2} />
      </Grid>
    </>
  );
};
export default DownloadsPage;
