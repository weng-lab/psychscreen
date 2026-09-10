import type { TrackTooltipComponent } from "@weng-lab/genomebrowser";
import {
  TrackTooltip,
  formatGenomicInterval,
  type TrackTooltipRow,
} from "@weng-lab/genomebrowser-tracks/shared";
import type { InteractionTooltipItem, InteractionConfig } from "./types";

export const InteractionTooltip: TrackTooltipComponent<
  InteractionTooltipItem,
  InteractionConfig
> = ({ item, context }) => {
  const { endpoint, relationships } = item;
  const genes = uniqueValues(
    relationships.map((relationship) => relationship.targetGene),
  );
  const tfs = uniqueValues(
    relationships.map((relationship) => relationship.targetTF),
  );
  const rows: TrackTooltipRow[] = [
    {
      label: "Location",
      value: formatGenomicInterval(
        endpoint.start,
        endpoint.end,
        endpoint.chromosome,
      ),
    },
    {
      label: genes.length === 1 ? "Target gene" : "Target genes",
      value: summarize(genes) || "None",
    },
  ];
  if (tfs.length)
    rows.push({
      label: tfs.length === 1 ? "TF" : "TFs",
      value: summarize(tfs),
    });
  return (
    <TrackTooltip
      title={capitalize(endpoint.role)}
      titleColor={context.base.color}
      rows={rows}
    />
  );
};

function uniqueValues(values: Array<string | undefined>) {
  return [
    ...new Set(values.filter((value): value is string => Boolean(value))),
  ];
}

function summarize(values: string[]) {
  const visible = values.slice(0, 3).join(", ");
  const remaining = values.length - 3;
  return remaining > 0 ? `${visible} (+${remaining} more)` : visible;
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
