import {
  defineTrackModule,
  fetchOnChange,
  type TrackFetchContext,
} from "@weng-lab/genomebrowser-v2";
import { z } from "zod";
import { fetchGwasPoints } from "../shared/gwasBigBed";
import { createLDBaseline } from "./normalize";
import { FullLD } from "./render";
import type { LDConfig, LDData, LDVariant } from "./types";

const anchorSchema = z.object({
  id: z.string().min(1),
  chromosome: z.string().min(1),
  start: z.number(),
  end: z.number(),
});

const configSchema = z.object({
  url: fetchOnChange(z.string().min(1)),
  anchor: anchorSchema.optional(),
  associatedVariantIds: z.array(z.string().min(1)).default([]),
  pinnedVariantId: z.string().min(1).optional(),
});

export function parseLDAnchor(value: unknown) {
  const result = anchorSchema.safeParse(value);
  return result.success ? result.data : undefined;
}

export const ldModule = defineTrackModule<LDVariant>()({
  type: "psychscreenLD",
  defaults: {
    height: 60,
    color: "#7c97c4",
  },
  configSchema,
  fetch: fetchLD,
  render: { full: FullLD },
  tooltipComponent: ({ item }) => (
    <g>
      <text fill="#000000" fontSize={12} dominantBaseline="middle">
        {item.id}
      </text>
      <text y={14} fill="#000000" fontSize={12} dominantBaseline="middle">
        {item.chromosome}:{item.start}-{item.end}
      </text>
      {item.isLead ? (
        <text y={28} fill="#000000" fontSize={12} dominantBaseline="middle">
          Lead variant
        </text>
      ) : null}
    </g>
  ),
});

async function fetchLD({
  config,
  region,
}: TrackFetchContext<LDConfig>): Promise<LDData> {
  const points = await fetchGwasPoints(config.url, region);
  return createLDBaseline(points, region);
}
