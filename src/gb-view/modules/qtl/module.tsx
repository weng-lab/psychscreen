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
import { parseQtlRow } from "./parse";

const configSchema = z.object({
  url: fetchOnChange(z.string().min(1)),
});

function FullQtl(
  props: TrackRendererProps<InteractionConfig, GenomicInteraction[]>,
) {
  return createElement(InteractionRenderer, {
    ...props,
  });
}

export const singleCellQtlModule = defineTrackModule<InteractionTooltipItem>()({
  type: "singleCellQtl",
  defaults: {
    display: "full",
    height: 50,
    color: "#000000",
  },
  configSchema,
  fetch: ({ config, region }: TrackFetchContext<InteractionConfig>) =>
    fetchInteractions(config.url, region, parseQtlRow),
  render: { full: FullQtl },
  tooltipComponent: ({ item }) =>
    createElement(InteractionTooltip, { item, kind: "qtl" }),
});
