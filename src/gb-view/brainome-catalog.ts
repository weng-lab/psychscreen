import type { TrackSelectCatalog } from "@weng-lab/genomebrowser-ui";

export const BRAINOME_NEUROTRANSMITTERS = ["GABA", "GLU"] as const;

function lightenHexColor(color: string, amount: number) {
  const value = Number.parseInt(color.slice(1), 16);
  const channels = [value >> 16, (value >> 8) & 0xff, value & 0xff];

  return `#${channels
    .map((channel) => Math.round(channel + (255 - channel) * amount))
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

export const BRAINOME_AGES = [
  { value: "Infancy", label: "Infancy", color: "#F7C98A" },
  {
    value: "Early_Childhood",
    label: "Early Childhood",
    color: "#F4A154",
  },
  {
    value: "Late_Childhood",
    label: "Late Childhood",
    color: "#EF7A3B",
  },
  { value: "Adolescence", label: "Adolescence", color: "#D2614D" },
  {
    value: "Early_Adulthood",
    label: "Early Adulthood",
    color: "#9D4255",
  },
  { value: "Adulthood", label: "Adulthood", color: "#774147" },
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
      topColor: lightenHexColor(age.color, 0.5),
      bottomColor: age.color,
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
