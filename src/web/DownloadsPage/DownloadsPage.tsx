/**
 * DownloadsPage.tsx: contains links to various PsychSCREEN downloads.
 */

import React from "react";
import { Grid } from "@mui/material";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { Container } from "@mui/material";
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
    all: "#fafafa",
  },
  defaultRows: [
    createData(
      "Astrocytes",
      "all",
      75616,
      9159977,
      "https://downloads.wenglab.org/Astro_sig_QTLs.dat"
    ),

    createData(
      "Chandelier Inhibitory Neurons",
      "all",
      122979,
      14900515,
      "https://downloads.wenglab.org/Chandelier__Pvalb_sig_QTLs.dat"
    ),

    createData(
      "Layer 2/3 Intratelencephalic Projecting Excitatory Neurons",
      "all",
      368686,
      9159977,
      "https://downloads.wenglab.org/L2.3.IT_sig_QTLs.dat"
    ),
    createData(
      "Layer 4 Intratelencephalic Projecting Excitatory Neurons",
      "all",
      149884,
      18170994,
      "https://downloads.wenglab.org/L4.IT_sig_QTLs.dat"
    ),

    createData(
      "Layer 5/6 Near Projecting Excitatory Neurons",
      "all",
      1128,
      128574,
      "https://downloads.wenglab.org/L5.6.NP_sig_QTLs.dat"
    ),

    createData(
      "Layer 5 Intratelencephalic Projecting Excitatory Neurons",
      "all",
      200390,
      24259466,
      "https://downloads.wenglab.org/L5.IT_sig_QTLs.dat"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  extraRows: [
    createData(
      "Layer 6b Excitatory Neurons",
      "all",
      5067,
      600035,
      "https://downloads.wenglab.org/L6b_sig_QTLs.dat"
    ),

    createData(
      "Layer 6 Corticothalamic Projecting Excitatory Neurons",
      "all",
      24254,
      2932574,
      "https://downloads.wenglab.org/L6.CT_sig_QTLs.dat"
    ),

    createData(
      "Layer 6 Intratelencephalic Projecting Excitatory Neurons",
      "all",
      178645,
      21604986,
      "https://downloads.wenglab.org/L6.IT_sig_QTLs.dat"
    ),

    createData(
      "LAMP5/LHX6-expressing Inhibitory Neurons",
      "all",
      139,
      16614,
      "https://downloads.wenglab.org/Lamp5.Lhx6_sig_QTLs.dat"
    ),

    createData(
      "LAMP5-expressing Inhibitory Neurons",
      "all",
      34653,
      4187511,
      "https://downloads.wenglab.org/Lamp5_sig_QTLs.dat"
    ),

    createData(
      "Microglia",
      "all",
      7334,
      876091,
      "https://downloads.wenglab.org/Micro.PVM_sig_QTLs.dat"
    ),
    createData(
      "Oligodendrocytes",
      "all",
      113473,
      13738363,
      "https://downloads.wenglab.org/Oligo_sig_QTLs.dat"
    ),

    createData(
      "Oligodendrocyte Precursor Cells",
      "all",
      44567,
      5406474,
      "https://downloads.wenglab.org/OPC_sig_QTLs.dat"
    ),

    createData(
      "Pericytes",
      "all",
      520,
      61819,
      "https://downloads.wenglab.org/PC_sig_QTLs.dat"
    ),
    createData(
      "SST-expressing Inhibitory Neurons",
      "all",
      48602,
      5883595,
      "https://downloads.wenglab.org/Sst__Sst.Chodl_sig_QTLs.dat"
    ),

    createData(
      "VIP-expressing Inhibitory Neurons",
      "all",
      78316,
      9513653,
      "https://downloads.wenglab.org/Vip_sig_QTLs.dat"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
};
const deg = {
  colorGroups: {
    all: "#fafafa",
  },
  defaultRows: [
    createData(
      "Autism Spectrum Disorder",
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
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  extraRows: [
    createData(
      "Bipolar Disorder",
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
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
};
const grns = {
  colorGroups: {
    all: "#fafafa",
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
      "Chandelier Inhibitory Neurons",
      "all",
      111593,
      10621216,
      "https://downloads.wenglab.org/Chandelier_GRN.txt"
    ),
    createData(
      "Endothelial Cells",
      "all",
      147187,
      11474071,
      "https://downloads.wenglab.org/End_GRN.txt"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  extraRows: [
    createData(
      "Immune Cells",
      "all",
      365163,
      30909389,
      "https://downloads.wenglab.org/Immune_GRN.txt"
    ),
    createData(
      "Layer 2/3 Intratelencephalic Projecting Excitatory Neurons",
      "all",
      1121326,
      93844103,
      "https://downloads.wenglab.org/L2.3.IT_GRN.txt"
    ),
    createData(
      "Layer 4 Intratelencephalic Projecting Excitatory Neurons",
      "all",
      1118974,
      91304745,
      "https://downloads.wenglab.org/L4.IT_GRN.txt"
    ),
    createData(
      "Layer 5/6 Near Projecting Excitatory Neurons",
      "all",
      1120861,
      93893001,
      "https://downloads.wenglab.org/L5.6.NP_GRN.txt"
    ),
    createData(
      "Layer 5 Extratelencephalic Projecting Excitatory Neurons",
      "all",
      1123716,
      92134774,
      "https://downloads.wenglab.org/L5.ET_GRN.txt"
    ),
    createData(
      "Layer 5 Intratelencephalic Projecting Excitatory Neurons",
      "all",
      1119683,
      91416944,
      "https://downloads.wenglab.org/L5.IT_GRN.txt"
    ),
    createData(
      "Layer 6 Corticothalamic Projecting Excitatory Neurons",
      "all",
      1123628,
      91987391,
      "https://downloads.wenglab.org/L6.CT_GRN.txt"
    ),
    createData(
      "Layer 6 Intratelencephalic Projecting Excitatory Neurons Expressing Car3",
      "all",
      1125599,
      97944193,
      "https://downloads.wenglab.org/L6.IT.Car3_GRN.txt"
    ),
    createData(
      "Layer 6 Intratelencephalic Projecting Excitatory Neurons",
      "all",
      1123520,
      91958291,
      "https://downloads.wenglab.org/L6.IT_GRN.txt"
    ),
    createData(
      "Layer 6b Excitatory Neurons",
      "all",
      159900,
      1124341,
      "https://downloads.wenglab.org/L6b_GRN.txt"
    ),
    createData(
      "LAMP5/LHX6-expressing Inhibitory Neurons",
      "all",
      159900,
      115918,
      "https://downloads.wenglab.org/Lamp5.Lhx6_GRN.txt"
    ),
    createData(
      "LAMP5-expressing Inhibitory Neurons",
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
      `PAX6-expressing Inhibitory Neurons`,
      "all",
      115494,
      10431360,
      "https://downloads.wenglab.org/Pax6_GRN.txt"
    ),
    createData(
      "PVALB-expressing Inhibitory Neurons",
      "all",
      114769,
      10430956,
      "https://downloads.wenglab.org/Pvalb_GRN.txt"
    ),
    createData(
      "SNCG-expressing Inhibitory Neurons",
      "all",
      114459,
      10320486,
      "https://downloads.wenglab.org/Sncg_GRN.txt"
    ),
    createData(
      "SST-expressing Inhibitory Neurons",
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
      "VIP-expressing Inhibitory Neurons",
      "all",
      114088,
      10145653,
      "https://downloads.wenglab.org/Vip_GRN.txt"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
};

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
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
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
      "All Cell types",
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
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  colorGroups: {
    all: "#fafafa",
  },
};
const bCREDownloads = {
  defaultRows: [
    createData(
      "Human candidate brain cis-Regulatory Elements (b-cCREs), All",
      "all",
      361844,
      19868751,
      "https://downloads.wenglab.org/all_bCREs.bed"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  extraRows: [
    createData(
      "Adult candidate brain cis-Regulatory Elements (b-cCREs), All",
      "adult",
      253638,
      13919707,
      "https://downloads.wenglab.org/adult_bCREs.bed"
    ),
    createData(
      "Adult candidate brain cis-Regulatory Elements (b-cCREs), Neuron-specific",
      "adult",
      46194,
      2123419,
      "https://downloads.wenglab.org/neuron_bCREs.bed"
    ),
    createData(
      "Adult candidate brain cis-Regulatory Elements (b-cCREs), Glia-specific",
      "adult",
      43866,
      2013769,
      "https://downloads.wenglab.org/glia_bCREs.bed"
    ),
    createData(
      "Fetal candidate brain cis-Regulatory Elements (b-cCREs), All",
      "fetal",
      230936,
      12677878,
      "https://downloads.wenglab.org/fetal_bCREs.bed"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  colorGroups: {
    all: "#fafafa",
    adult: "#eeeeee",
    fetal: "#fafafa",
  },
};

const bulkImportantRegionDownloads = {
  defaultRows: [
    createData(
      "VLPFC Neurons ATAC-seq Signal, Upregulating",
      "VLPFC",
      368895,
      505784897,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_neurons.profile_scores.bw.pos.bb.bed.annotated.bed"
    ),
    createData(
      "VLPFC Glia ATAC-seq Signal, Upregulating",
      "VLPFC",
      309342,
      422733989,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_glia.profile_scores.bw.pos.bb.bed.annotated.bed"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  extraRows: [
    createData(
      "VLPFC Neurons ATAC-seq signal, Downregulating",
      "VLPFC",
      125881,
      153033684,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_neurons.profile_scores.bw.neg.bb.bed.annotated.bed"
    ),
    createData(
      "VLPFC Glia ATAC-seq signal, Downregulating",
      "VLPFC",
      74863,
      88924905,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_glia.profile_scores.bw.neg.bb.bed.annotated.bed"
    ),
    createData(
      "Putamen Neurons, Upregulating",
      "putamen",
      368895,
      499367427,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN+.profile_scores.bw.pos.bb.bed.annotated.bed"
    ),
    createData(
      "Putamen Glia, Upregulating",
      "putamen",
      309342,
      422733989,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN-.profile_scores.bw.pos.bb.bed.annotated.bed"
    ),
    createData(
      "Putamen Neurons, Downregulating",
      "putamen",
      125881,
      175470333,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN+.profile_scores.bw.neg.bb.bed.annotated.bed"
    ),
    createData(
      "Putamen Glia, Downregulating",
      "putamen",
      74863,
      96898982,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN-.profile_scores.bw.neg.bb.bed.annotated.bed"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  colorGroups: {
    VLPFC: "#fafafa",
    putamen: "#eeeeee",
  },
};

const singleCellImportantRegionDownloads = {
  defaultRows: [
    createData(
      "Microglia, Upregulating",
      "microglia",
      257851,
      279454648,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Microglia.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Microglia, Downregulating",
      "microglia",
      44629,
      37124711,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Microglia.profile_scores.bw.neg.bed.annotated.bed"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  extraRows: [
    createData(
      "Astrocytes, Upregulating",
      "astrocytes",
      121724,
      87663966,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Astrocyte_1.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Astrocytes, Downregulating",
      "astrocytes",
      9624,
      6870613,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Astrocyte_1.profile_scores.bw.neg.bed.annotated.bed"
    ),
    createData(
      "Oligodendrocyte Precursors, Upregulating",
      "opcs",
      183446,
      157867921,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte_Precursor.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Oligodendrocyte Precursors, Downregulating",
      "opcs",
      29434,
      21496793,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte_Precursor.profile_scores.bw.neg.bed.annotated.bed"
    ),
    createData(
      "Oligodendrocytes, Upregulating",
      "olig",
      312172,
      363360704,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Oligodendrocytes, Downregulating",
      "olig",
      72775,
      65344684,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte.profile_scores.bw.neg.bed.annotated.bed"
    ),
    createData(
      "Glutaminergic Neurons I, Upregulating",
      "gluI",
      365861,
      424763761,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_1.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Glutaminergic Neurons I, Downregulating",
      "gluI",
      139464,
      129318985,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_1.profile_scores.bw.neg.bed.annotated.bed"
    ),
    createData(
      "Glutaminergic Neurons II, Upregulating",
      "gluII",
      357677,
      395951962,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_2.profile_scores.bw.pos.bed.annotated.bed"
    ),
    createData(
      "Glutaminergic Neurons II, Downregulating",
      "gluII",
      128745,
      120385750,
      "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_2.profile_scores.bw.neg.bed.annotated.bed"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  colorGroups: {
    microglia: "#fafafa",
    astrocytes: "#eeeeee",
    opcs: "#fafafa",
    olig: "#eeeeee",
    gluI: "#fafafa",
    gluII: "#eeeeee",
  },
};
/*
  Anorexia:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Anorexia_meta_PGC.formatted.bigBed",
  ASD: "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ASD_Matoba2021.formatted.bigBed",
  BipolarDisorder:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Bipolar_PGC_meta.formatted.bigBed",
  BMI: "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/BMI_meta_Yengo.formatted.bigBed",
  CigsPerDay:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/CigarettesPerDay_meta_Koskeridis.formatted.bigBed",
  "Major Depressive Disorder":
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/MDD_PGC_meta.formatted.bigBed",
  "Attention deficit hyperactive disorder":
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ADHD_meta_PGC.formatted.bigBed",
  Depression:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/MDD_PGC_meta.formatted.bigBed",
  //Dyslexia: "dyslexia",
  EverSmoked:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/EverSmoked_meta_Karlsson.formatted.bigBed",
  Insomnia:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Insomnia_UKB_Backman.formatted.bigBed",
  Intelligence:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Intelligence_meta_Savage.formatted.bigBed",
  Parkinsons:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Parkinson_Nalls_meta.formatted.bigBed",
  ReactionTime:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ReactionTime_Davies.formatted.bigBed",
  Schizophrenia:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/SCZ_meta_PGC.formatted.bigBed",
  SleepDuration:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/SleepDuration_meta_Dashti.formatted.bigBed",
  YearsEducation:
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/YearsOfEducation_meta_Okbay.formatted.bigBed",

*/
const gwasMetaDownloads = {
  defaultRows: [
    createData(
      "Attention Deficit Hyperactive Disorder",
      "brain",
      7997741,
      430168632,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ADHD_meta_PGC.formatted.bed"
    ),
    createData(
      "Mother's Age At Birth Of First Child",
      "brain",
      15342055,
      836612757,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/AgeFirstBirth_Mills_meta.formatted.bed"
    ),
    createData(
      "Alzheimers",
      "brain",
      1185515,
      63141184,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Alzheimers_Bellenguez_meta.formatted.bed"
    ),
    createData(
      "Anorexia Nervosa",
      "brain",
      8170867,
      441227579,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Anorexia_meta_PGC.formatted.bed"
    ),

    createData(
      "Autism Spectrum Disorder",
      "brain",
      9616178,
      519317164,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ASD_Matoba2021.formatted.bed"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  extraRows: [
    createData(
      "Bipolar Disorder",
      "brain",
      12316354,
      667694563,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Bipolar_PGC_meta.formatted.bed"
    ),
    createData(
      "Body Mass Index",
      "brain",
      1187064,
      63273621,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/BMI_meta_Yengo.formatted.bed"
    ),
    createData(
      "Cigarettes Smoked Per Day",
      "brain",
      1187090,
      63471107,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/CigarettesPerDay_meta_Koskeridis.formatted.bed"
    ),
    createData(
      "Intelligence",
      "brain",
      1187178,
      63063383,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Intelligence_meta_Savage.formatted.bed"
    ),
    createData(
      "Major Depressive Disorder",
      "brain",
      13631590,
      739615394,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/MDD_PGC_meta.formatted.bed"
    ),
    createData(
      "Schizophrenia",
      "brain",
      9538405,
      513791524,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/SCZ_meta_PGC.formatted.bed"
    ),
    createData(
      "History Of Smoking",
      "non-brain",
      1187049,
      63394018,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/EverSmoked_meta_Karlsson.formatted.bed"
    ),
    createData(
      "Insomnia",
      "non-brain",
      1187263,
      63405162,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Insomnia_UKB_Backman.formatted.bed"
    ),
    createData(
      "Reaction Time",
      "non-brain",
      1181256,
      62886677,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/ReactionTime_Davies.formatted.bed"
    ),
    createData(
      "Parkinson’s Disease",
      "non-brain",
      1187261,
      63298941,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Parkinson_Nalls_meta.formatted.bed"
    ),
    createData(
      "Sleep Duration",
      "non-brain",
      1187048,
      63268462,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/SleepDuration_meta_Dashti.formatted.bed"
    ),
    createData(
      "Years Of Education",
      "non-brain",
      1172234,
      62735623,
      "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/YearsOfEducation_meta_Okbay.formatted.bed"
    ),
  ].sort((a: DataRow, b: DataRow) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  ),
  colorGroups: {
    brain: "#fafafa",
    "non-brain": "#eeeeee",
  },
};

const pages = [
  "Regulatory Elements",
  "TF Binding Sites",
  "GWAS Meta-Analysis",
  "ATAC-seq Peaks",
  "Gene Regulatory Networks",
  "Differentially Expressed Genes",
  "Cell Type-Specific eQTLs",
];

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
                title="Candidate Brain cis-Regulatory Elements (b-cCREs)"
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
                  title="GWAS Meta-Analysis"
                  elementText="SNPs"
                  {...gwasMetaDownloads}
                />
              </>
            )}
            {page === 3 && (
              <BEDFileDownloadTable title="Atac seq peaks" {...atacPeaks} />
            )}
            {page === 4 && (
              <BEDFileDownloadTable
                title="Gene Regulatory Networks"
                {...grns}
              />
            )}
            {page === 5 && (
              <BEDFileDownloadTable
                title="Differentially expressed genes "
                {...deg}
              />
            )}
            {page === 6 && (
              <BEDFileDownloadTable
                title="Cell type-specific eQTLs"
                {...eqtls}
              />
            )}
          </div>
        </Grid>
        <Grid item sm={0} md={0} lg={1} xl={2} />
      </Grid>
    </>
  );
};
export default DownloadsPage;
