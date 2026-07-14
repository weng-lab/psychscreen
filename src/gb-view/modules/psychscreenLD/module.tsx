import {
  TrackTooltip,
  createFullLDRenderer,
  defineTrackModule,
  fetchBigBedRows,
  fetchOnChange,
  normalizeManhattanRows,
  type LDData,
  type LDVariant,
  type TrackFetchContext,
} from "@weng-lab/genomebrowser-v2";
import { z } from "zod";
import {
  applyPsychscreenLDConfig,
  createPsychscreenLDBaseline,
} from "./normalize";
import type { PsychscreenLDConfig } from "./types";

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

export function parsePsychscreenLDAnchor(value: unknown) {
  const result = anchorSchema.safeParse(value);
  return result.success ? result.data : undefined;
}

const PsychscreenLD = createFullLDRenderer<PsychscreenLDConfig>(
  "psychscreenLD",
  (config) => config.anchor?.id,
  {
    transformData: applyPsychscreenLDConfig,
    getPinnedVariantId: (config) => config.pinnedVariantId,
  },
);

export const psychscreenLDModule = defineTrackModule<LDVariant>()({
  type: "psychscreenLD",
  defaults: {
    height: 60,
    color: "#7c97c4",
  },
  configSchema,
  fetch: fetchPsychscreenLDBaseline,
  render: { full: PsychscreenLD },
  tooltipComponent: ({ item }) => (
    <TrackTooltip>
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
    </TrackTooltip>
  ),
});

async function fetchPsychscreenLDBaseline({
  config,
  region,
}: TrackFetchContext<PsychscreenLDConfig>): Promise<LDData> {
  const rows = await fetchBigBedRows({ url: config.url, region });
  return createPsychscreenLDBaseline(normalizeManhattanRows(rows), region);
}
