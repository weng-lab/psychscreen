import type { TrackCollection } from "@weng-lab/genomebrowser";

export const POSTNATAL_NEURON_CLASSES = [
  { value: "GABA", label: "GABAergic neurons" },
  { value: "GLU", label: "Glutamatergic neurons" },
] as const;

export const POSTNATAL_STAGES = [
  { value: "Infancy", label: "infancy", color: "#D59A4B", topColor: "#FFEFDA" },
  {
    value: "Early_Childhood",
    label: "early childhood",
    color: "#D77F32",
    topColor: "#FCE8D6",
  },
  {
    value: "Late_Childhood",
    label: "late childhood",
    color: "#CE5D26",
    topColor: "#FBE2D4",
  },
  {
    value: "Adolescence",
    label: "adolescence",
    color: "#B44535",
    topColor: "#F4DEDA",
  },
  {
    value: "Early_Adulthood",
    label: "early adulthood",
    color: "#813045",
    topColor: "#E8D8DC",
  },
  {
    value: "Adulthood",
    label: "adulthood",
    color: "#5E2E34",
    topColor: "#DFD4D5",
  },
] as const;

function createTrack(
  neuronClass: (typeof POSTNATAL_NEURON_CLASSES)[number],
  stage: (typeof POSTNATAL_STAGES)[number],
) {
  return {
    type: "cave",
    base: {
      id: `${neuronClass.value}.${stage.value}`,
      title: `${neuronClass.label} · ${stage.label} · 5hmC / 5mC`,
      color: stage.color,
    },
    config: {
      neurotransmitter: neuronClass.value,
      age: stage.value,
      topColor: stage.topColor,
      bottomColor: stage.color,
    },
    metadata: {
      neuronClass: neuronClass.label,
      developmentalStage: stage.label,
    },
  };
}

export const POSTNATAL_METHYLOME_DEVELOPMENT_COLLECTION = {
  assembly: "hg38",
  id: "brainome",
  label: "Postnatal Neuronal Methylome Development",
  description:
    "5hmC and 5mC in GABAergic and glutamatergic neurons from infancy to adulthood. Xu et al., Dracheva & Mukamel, *bioRxiv* (2026) · doi:10.64898/2026.02.18.706675",
  views: [
    {
      id: "neurotransmitter",
      label: "By neuron class",
      columns: [
        { field: "neuronClass", label: "Neuron class" },
        { field: "developmentalStage", label: "Developmental stage" },
      ],
      grouping: ["neuronClass"],
      leaf: "developmentalStage",
    },
    {
      id: "developmental-age",
      label: "By developmental stage",
      columns: [
        { field: "developmentalStage", label: "Developmental stage" },
        { field: "neuronClass", label: "Neuron class" },
      ],
      grouping: ["developmentalStage"],
      leaf: "neuronClass",
    },
  ],
  tracks: POSTNATAL_NEURON_CLASSES.flatMap((neuronClass) =>
    POSTNATAL_STAGES.map((stage) => createTrack(neuronClass, stage)),
  ),
} satisfies TrackCollection;
