import type { TrackTooltipComponent } from "@weng-lab/genomebrowser";
import {
  TrackTooltip,
  formatGenomicInterval,
} from "@weng-lab/genomebrowser-tracks/shared";
import type { LDConfig, LDVariant } from "./types";

export const LDTooltip: TrackTooltipComponent<LDVariant, LDConfig> = ({
  item,
  context,
}) => (
  <TrackTooltip
    title={item.id}
    titleColor={context.base.color}
    rows={[
      {
        label: "Location",
        value: formatGenomicInterval(item.start, item.end, item.chromosome),
      },
      ...(item.isLead ? [{ label: "Status", value: "Lead variant" }] : []),
    ]}
  />
);
