import { TrackList } from "../types";

export const DeepLearnedTracks: TrackList = {
  "Adult brain bulk ATAC-seq": [
    {
      title: "VLPFC glia ATAC signal",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_glia/predictions_VLPFC_glia_chrombpnet_nobias.bw",
    },
    {
      title: "VLPFC neurons ATAC signal",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_neurons/predictions_VLPFC_neurons_chrombpnet_nobias.bw",
    },
    {
      title: "putamen glia",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_glia/predicitons_NeuN-_chrombpnet_nobias.bw",
    },
    {
      title: "putamen neurons",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_neurons/predictions_NeuN+_chrombpnet_nobias.bw",
    },
  ],
  "Adult cerebrum single cell ATAC-seq": [
    {
      title: "astrocytes",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell/predictions_Astrocyte_1_chrombpnet_nobias.bw",
    },
    {
      title: "GABA-ergic type I",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell/predictions_GABAergic_Neuron_1_chrombpnet_nobias.bw",
    },
    {
      title: "GABA-ergic type II",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell/predictions_GABAergic_Neuron_2_chrombpnet_nobias.bw",
    },
    {
      title: "glutaminergic type I",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell/predictions_Glutaminergic_Neuron_1_chrombpnet_nobias.bw",
    },
    {
      title: "glutaminergic type II",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell/predictions_Glutaminergic_Neuron_2_chrombpnet_nobias.bw",
    },
    {
      title: "microglia",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell/predictions_Microglia_chrombpnet_nobias.bw",
    },
    {
      title: "oligodendrocytes",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell/predictions_Oligodendrocyte_chrombpnet_nobias.bw",
    },
    {
      title: "oligodendrocyte precursors",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell/predictions_Oligodendrocyte_Precursor_chrombpnet_nobias.bw",
    },
  ],
  "Fetal brain DNase-seq": [
    {
      title: "fetal-50-days",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/fetal/fetal-50-days/predictions_fetal-50-days_chrombpnet_nobias.bw",
    },
    {
      title: "fetal-80-days",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/fetal/fetal-80-days/predictions_fetal-80-days_chrombpnet_nobias.bw",
    },
    {
      title: "fetal-105-days",
      url: "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/fetal/fetal-105-days/predictions_fetal-105-days_chrombpnet_nobias.bw",
    },
  ],
  "Evolutionary conservation": [
    {
      title: "241-way mammalian phylo-P",
      url: "gs://gcp.wenglab.org/241-mammalian-2020v2.bigWig",
    },
  ],
};
