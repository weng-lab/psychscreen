import { ManhattanTooltip } from "./tooltip";
import { DEFAULT_P_VALUE_THRESHOLD } from "./helpers";
import { defineTrackModule, fetchOnChange } from "@weng-lab/genomebrowser";
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
  pValueThreshold: z
    .number()
    .positive()
    .max(1)
    .default(DEFAULT_P_VALUE_THRESHOLD),
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
  tooltipComponent: ManhattanTooltip,
});
