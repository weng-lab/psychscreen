import type { TrackTooltipComponent } from "@weng-lab/genomebrowser";
import {
  TrackTooltip,
  formatGenomicInterval,
} from "@weng-lab/genomebrowser-tracks/shared";
import type { LDConfig, LDVariant } from "./types";
import { useLDSelection } from "./selection";
import { LD_CONTEXT, LD_REQUEST } from "./requestConfig";

export const LDTooltip: TrackTooltipComponent<LDVariant, LDConfig> = ({
  item,
  context,
}) => {
  const selection = useLDSelection();
  const status =
    selection.pinnedVariantId === item.id
      ? "Pinned variant"
      : selection.anchor?.id === item.id
        ? "Selected variant"
        : undefined;
  return (
    <TrackTooltip
      title={item.id}
      titleColor={context.base.color}
      rows={[
        {
          label: "Location",
          value: formatGenomicInterval(item.start, item.end, item.chromosome),
        },
        ...(status ? [{ label: "Status", value: status }] : []),
        { label: "LD query", value: `${LD_REQUEST.assembly} · ${LD_CONTEXT}` },
        {
          label: "Interactions",
          value: "Click to pin/unpin; hover an arc for r²",
        },
      ]}
    />
  );
};
