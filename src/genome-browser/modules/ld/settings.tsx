import type { TrackSettingsProps } from "@weng-lab/genomebrowser";
import { TrackSettingsLayout } from "@weng-lab/genomebrowser-tracks/shared";
import { SourceSettingsSection } from "../shared/sourceSettings";
import type { LDConfig, LDVariant } from "./types";

export function LDSettings({
  track,
  updateTrack,
}: TrackSettingsProps<LDConfig, LDVariant>) {
  return (
    <TrackSettingsLayout>
      <SourceSettingsSection
        title="LD source"
        url={track.config.url}
        disabled={track.source === "host"}
        onCommit={(url) => updateTrack({ config: { url } })}
      />
    </TrackSettingsLayout>
  );
}
