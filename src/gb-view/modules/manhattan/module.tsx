import { defineTrackModule, fetchOnChange } from "@weng-lab/genomebrowser-v2";
import { z } from "zod";
import { fetchManhattan } from "./fetch";
import { FullManhattan } from "./render";
import { ManhattanSettings } from "./settings";
import type { ManhattanPoint } from "./types";

const yDomainSchema = z
  .strictObject({
    min: z.number().optional(),
    max: z.number().optional(),
  })
  .refine(
    (domain) =>
      domain.min === undefined ||
      domain.max === undefined ||
      domain.min < domain.max,
    {
      error: "min must be less than max",
      path: ["min"],
    },
  );

const configSchema = z.object({
  url: fetchOnChange(z.string().min(1)),
  yDomain: yDomainSchema.optional(),
});

export const manhattanModule = defineTrackModule<ManhattanPoint>()({
  type: "manhattan",
  defaults: {
    height: 75,
    color: "#c43d3d",
  },
  configSchema,
  fetch: fetchManhattan,
  render: { full: FullManhattan },
  settingsComponent: ManhattanSettings,
  tooltipComponent: ({ item }) => (
    <g>
      <text fill="#000000" fontSize={12} dominantBaseline="middle">
        {item.id}
      </text>
      <text y={14} fill="#000000" fontSize={12} dominantBaseline="middle">
        {item.chromosome}:{item.start}-{item.end}
      </text>
      <text y={28} fill="#000000" fontSize={12} dominantBaseline="middle">
        Value: {item.value}
      </text>
    </g>
  ),
});
