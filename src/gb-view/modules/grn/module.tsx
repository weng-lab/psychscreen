import {
  defineTrackModule,
  fetchOnChange,
  type TrackFetchContext,
  type TrackRendererProps,
} from "@weng-lab/genomebrowser-v2";
import { createElement } from "react";
import { z } from "zod";
import { fetchInteractions } from "../interactions/fetch";
import { InteractionRenderer } from "../interactions/render";
import { InteractionTooltip } from "../interactions/tooltip";
import type {
  GenomicInteraction,
  InteractionConfig,
  InteractionTooltipItem,
} from "../interactions/types";
import { parseGrnRow } from "./parse";

const configSchema = z.object({
  url: fetchOnChange(z.string().min(1)),
});

function FullGrn(
  props: TrackRendererProps<InteractionConfig, GenomicInteraction[]>,
) {
  return createElement(InteractionRenderer, {
    ...props,
  });
}

export const singleCellGrnModule = defineTrackModule<InteractionTooltipItem>()({
  type: "singleCellGrn",
  defaults: {
    display: "full",
    height: 50,
    color: "#9479bc",
  },
  configSchema,
  fetch: ({ config, region }: TrackFetchContext<InteractionConfig>) =>
    fetchInteractions(config.url, region, parseGrnRow),
  render: { full: FullGrn },
  tooltipComponent: ({ item }) =>
    createElement(InteractionTooltip, { item, kind: "grn" }),
});
