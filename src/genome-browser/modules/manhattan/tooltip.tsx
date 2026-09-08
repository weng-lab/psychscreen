import type { TrackTooltipComponent } from "@weng-lab/genomebrowser";
import {
  TrackTooltip,
  formatGenomicInterval,
  formatSignalValue,
} from "@weng-lab/genomebrowser-tracks/shared";
import { scoreToPValue } from "./helpers";
import type { ManhattanConfig, ManhattanPoint } from "./types";

export const ManhattanTooltip: TrackTooltipComponent<
  ManhattanPoint,
  ManhattanConfig
> = ({ item, context }) => (
  <TrackTooltip
    title={item.id}
    titleColor={context.base.color}
    rows={[
      {
        label: "Location",
        value: formatGenomicInterval(item.start, item.end, item.chromosome),
      },
      { label: "−log10(P)", value: formatSignalValue(item.value) },
      { label: "P-value", value: scoreToPValue(item.value).toExponential(3) },
    ]}
  />
);
