import { TrackList } from "../types";

// Note: PsychENCODE neuron/non-neuron FANS-sorted ATAC-seq (healthy donors) has NEUN+ and NEUN- variants
// url = gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/DLPFC-{NEUN}-healthy-ATAC.bigWig
// title = "DLPFC healthy ATAC-seq {NEUN} "
// output = { title: "DLPFC healthy ATAC-seq NeuN+", url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/DLPFC-NeuN+-healthy-ATAC.bigWig" }
export const EpigeneticTracks: TrackList = {
  "Candidate cis-Regulatory Elements": [
    {
      title: "Adult candidate brain cis-Regulatory Elements (b-cCREs)",
      url: "http://downloads.wenglab.org/psychscreen/adult_bCREs.bb",
    },
    {
      title: "Fetal candidate brain cis-Regulatory Elements (b-cCREs)",
      url: "http://downloads.wenglab.org/psychscreen/fetal_bCREs.bb",
    },
    {
      title: "ENCODE cCREs, all tissues",
      url: "gs://gcp.wenglab.org/GRCh38-cCREs.V4.bigBed",
    },
  ],
  "PsychENCODE neuron/non-neuron FANS-sorted ATAC-seq (healthy donors)": [
    {
      title: "all brain regions, aggregated {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/all-{NEUN}-ATAC.bigWig",
    },
    {
      title: "dorsolateral prefrontal cortex {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/DLPFC-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "frontopolar prefrontal cortex {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/FPPFC-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "hippocampus {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/HIPP-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "insular cortex {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/INS-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "inferior temporal gyrus {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/ITC-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "mediodorsal thalamic nucleus {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/MDT-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "medial orbital frontal cortex {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/MOFC-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "nucleus accumbens {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/NA-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "premotor cortex {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/PMC-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "putamen {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/PTM-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "primary visual cortex {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/PVC-{NEUN}-healthy-ATAC.bigWig",
    },
    {
      title: "ventrolateral prefrontal cortex {NEUN}",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/VLPFC-{NEUN}-healthy-ATAC.bigWig",
    },
  ],
  "PsychENCODE SCZ/BP/healthy DLPFC ATAC-seq": [
    {
      title: "healthy donors",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/DLPFC-mixed-Norm-ATAC.bigWig",
    },
    {
      title: "bipolar donors",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/DLPFC-mixed-BD-ATAC.bigWig",
    },
    { title: "schizophrenia donors", url: "DLPFC-mixed-SCZ-ATAC.bigWig" },
  ],
  "Single cell ATAC-seq pseudobulk": [
    {
      title: "child/adult layer 4 neuron, RORβ+",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C1_ChildAdult_Neuron_L4-RORB.bigWig",
    },
    {
      title: "infant (1 month old) astrocyte",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C2_Infant-1Month_Astrocyte_Astrocyte.bigWig",
    },
    {
      title: "infant (6 month old) astrocyte",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C3_Infant-6Month_Astrocyte_Astrocyte.bigWig",
    },
    {
      title: "child/adult astrocyte (cluster 1)",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C4_ChildAdult_Astrocyte_Astrocyte.bigWig",
    },
    {
      title: "child/adult astrocyte (cluster 2)",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C5_ChildAdult_Astrocyte_Astrocyte.bigWig",
    },
    {
      title: "child/adult astrocyte (cluster 3)",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C6_Child_Astrocyte_Astrocyte.bigWig",
    },
    {
      title: "infant (10 month old) astrocyte",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C7_Infant-10Month_Astrocyte_Astrocyte.bigWig",
    },
    {
      title: "child/adult neuron, ID2+ (cluster 1)",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C8_ChildAdult_Neuron_IN-ID2.bigWig",
    },
    {
      title: "child/adult neuron, ID2+ (cluster 2)",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C9_ChildAdult_Neuron_IN-ID2.bigWig",
    },
    {
      title: "child/adult neuron, ID2+ (cluster 2)",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C9_ChildAdult_Neuron_IN-ID2.bigWig",
    },
    {
      title: "infant (1 month old) neuron, TLE4+",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C10_Infant-1Month_Neuron_TLE4.bigWig",
    },
    {
      title: "infant (3 month old) neuron, layer 2-3 CUX2+",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C11_Infant-3Month_Neuron_L2-3-CUX2.bigWig",
    },
    {
      title: "fetal (22 week) neuron, THEMIS+",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C12_Fetal-GA22_Neuron_Fetal-THEMIS.bigWig",
    },
    {
      title: "child inhibitory neuron, SST+",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C13_Child_Neuron_IN-SST.bigWig",
    },
    {
      title: "child/adult inhibitory neuron, SST+",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C14_ChildAdult_Neuron_IN-SST.bigWig",
    },
    {
      title: "child neuron, layer 2/3, CUX2+",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C15_Child_Neuron_L2-3-CUX2.bigWig",
    },
    {
      title: "child/adult neuron, layer 2/3, CUX2+",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C16_ChildAdult_Neuron_L2-3-CUX2.bigWig",
    },
    {
      title: "fetal (24 week) neuron, CUX2+",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C17_Fetal-GA24_Neuron_Fetal-CUX2.bigWig",
    },
    {
      title: "infant (10 month old) developing neuron",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C18_Infant-10Month_Neuron_Developing.bigWig",
    },
    {
      title: "child/adult oligodendrocyte (cluster 1)",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C20_ChildAdult_ODC_ODC.bigWig",
    },
    {
      title: "child/adult oligodendrocyte (cluster 2)",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C21_ChildAdult_ODC_ODC.bigWig",
    },
    {
      title: "infant (6 month old) oligodendrocyte precursor",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C22_Infant-6Month_OPC_OPC.bigWig",
    },
    {
      title: "child oligodendrocyte precursor",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C23_Child_OPC_OPC.bigWig",
    },
    {
      title: "child/adult oligodendrocyte precursor",
      url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/C24_ChildAdult_OPC_OPC.bigWig",
    },
  ],
};
