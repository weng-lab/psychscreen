import type { TrackSelectCatalog } from "@weng-lab/genomebrowser-ui";

export const BRAINOME_NEUROTRANSMITTERS = ["GABA", "GLU"] as const;

export const BRAINOME_AGES = [
  { value: "Infancy", label: "Infancy", color: "#ff0000" },
  {
    value: "Early_Childhood",
    label: "Early Childhood",
    color: "#ff6f00",
  },
  {
    value: "Late_Childhood",
    label: "Late Childhood",
    color: "#008000",
  },
  { value: "Adolescence", label: "Adolescence", color: "#0000ff" },
  {
    value: "Early_Adulthood",
    label: "Early Adulthood",
    color: "#880088",
  },
  { value: "Adulthood", label: "Adulthood", color: "#000000" },
] as const;

function createBrainomeTrack(
  neurotransmitter: (typeof BRAINOME_NEUROTRANSMITTERS)[number],
  age: (typeof BRAINOME_AGES)[number],
) {
  return {
    type: "cave",
    id: `${neurotransmitter}.${age.value}`,
    title: `Brainome ${neurotransmitter} ${age.label}`,
    color: age.color,
    config: {
      neurotransmitter,
      age: age.value,
    },
    metadata: {
      neurotransmitter,
      developmentalAge: age.label,
    },
  };
}

export const BRAINOME_TRACK_CATALOG = {
  id: "brainome",
  label: "Brainome Developmental Methylation",
  description: "Brainome developmental hmC and OXBS tracks",
  views: [
    {
      id: "neurotransmitter",
      label: "By Neurotransmitter",
      columns: [
        { field: "neurotransmitter", label: "Neurotransmitter" },
        { field: "developmentalAge", label: "Developmental Age" },
      ],
      grouping: ["neurotransmitter"],
      leaf: "developmentalAge",
    },
    {
      id: "developmental-age",
      label: "By Developmental Age",
      columns: [
        { field: "developmentalAge", label: "Developmental Age" },
        { field: "neurotransmitter", label: "Neurotransmitter" },
      ],
      grouping: ["developmentalAge"],
      leaf: "neurotransmitter",
    },
  ],
  tracks: BRAINOME_NEUROTRANSMITTERS.flatMap((neurotransmitter) =>
    BRAINOME_AGES.map((age) => createBrainomeTrack(neurotransmitter, age)),
  ),
} satisfies TrackSelectCatalog;
