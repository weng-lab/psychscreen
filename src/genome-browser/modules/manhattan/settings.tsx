import type { TrackSettingsProps } from "@weng-lab/genomebrowser";
import {
  TrackSettingsLayout,
  TrackSettingsSection,
  TrackSettingsFieldGrid,
  TrackSettingsNumberField,
  TrackSettingsRangeFields,
} from "@weng-lab/genomebrowser-tracks/shared";
import { SourceSettingsSection } from "../shared/sourceSettings";
import type { ManhattanConfig, ManhattanPoint } from "./types";

export function ManhattanSettings({
  track,
  updateTrack,
}: TrackSettingsProps<ManhattanConfig, ManhattanPoint>) {
  const { config } = track;
  return (
    <TrackSettingsLayout>
      <SourceSettingsSection
        title="GWAS source"
        url={config.url}
        disabled={track.source === "host"}
        onCommit={(url) => updateTrack({ config: { url } })}
      />
      <TrackSettingsSection title="Y-axis range (−log10 P)">
        <TrackSettingsRangeFields
          mode="independent"
          range={config.yDomain}
          onCommit={(yDomain) => updateTrack({ config: { yDomain } })}
        />
      </TrackSettingsSection>
      <TrackSettingsSection title="Significance threshold">
        <TrackSettingsFieldGrid>
          <TrackSettingsNumberField
            label="P-value threshold (P ≤)"
            required
            value={config.pValueThreshold}
            step="any"
            validate={(value) =>
              value > 0 && value <= 1
                ? undefined
                : "Enter a P-value greater than 0 and at most 1."
            }
            onCommit={(pValueThreshold) =>
              updateTrack({ config: { pValueThreshold } })
            }
          />
        </TrackSettingsFieldGrid>
      </TrackSettingsSection>
    </TrackSettingsLayout>
  );
}
