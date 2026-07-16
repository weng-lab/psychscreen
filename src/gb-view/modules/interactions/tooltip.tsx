import { TrackTooltip } from "@weng-lab/genomebrowser-v2";
import { createElement } from "react";
import type { InteractionTooltipItem } from "./types";

export function InteractionTooltip({
  item,
  kind,
}: {
  item: InteractionTooltipItem;
  kind: "grn" | "qtl";
}) {
  const { endpoint, relationships } = item;
  const genes = uniqueValues(
    relationships.map((relationship) => relationship.targetGene),
  );
  const tfs = uniqueValues(
    relationships.map((relationship) => relationship.targetTF),
  );
  const lines = [
    `${capitalize(endpoint.role)}: ${formatCoordinates(endpoint)}`,
    `Target gene${genes.length === 1 ? "" : "s"}: ${summarize(genes)}`,
  ];
  if (kind === "grn" && tfs.length > 0) {
    lines.push(`TF${tfs.length === 1 ? "" : "s"}: ${summarize(tfs)}`);
  }

  return createElement(
    TrackTooltip,
    null,
    createElement(
      "g",
      null,
      ...lines.map((line, index) =>
        createElement(
          "text",
          {
            key: line,
            y: index * 14,
            fill: "#000000",
            fontSize: 12,
            dominantBaseline: "middle",
          },
          line,
        ),
      ),
    ),
  );
}

function formatCoordinates({
  chromosome,
  start,
  end,
}: InteractionTooltipItem["endpoint"]) {
  return `${chromosome}:${start.toLocaleString()}-${end.toLocaleString()}`;
}

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
