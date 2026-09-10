import { LDTooltip } from "./tooltip";
import { LDSettings } from "./settings";
import {
  defineTrackModule,
  fetchOnChange,
  type TrackFetchContext,
} from "@weng-lab/genomebrowser";
import { z } from "zod";
import { fetchGwasPoints } from "../shared/gwasBigBed";
import { createLDBaseline } from "./normalize";
import { FullLD } from "./render";
import type { LDConfig, LDData, LDVariant } from "./types";

const configSchema = z.object({
  url: fetchOnChange(z.string().min(1)),
});

export const ldModule = defineTrackModule<LDVariant>()({
  type: "psychscreenLD",
  defaults: {
    height: 60,
    color: "#7c97c4",
  },
  configSchema,
  fetch: fetchLD,
  render: { full: FullLD },
  settingsComponent: LDSettings,
  tooltipComponent: LDTooltip,
});

async function fetchLD({
  track,
  demand,
  resources,
}: TrackFetchContext<LDConfig>): Promise<LDData> {
  const points = await fetchGwasPoints(
    track.config.url,
    demand.region,
    resources,
  );
  return createLDBaseline(points, demand.region);
}
