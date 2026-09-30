import type { TrackMutationResult } from "@weng-lab/genomebrowser";
import {
  TrackSettingsFieldGrid,
  TrackSettingsFullRow,
  TrackSettingsLayout,
  TrackSettingsSection,
  TrackSettingsUrlField,
} from "@weng-lab/genomebrowser-tracks/shared";

type Props = {
  title: string;
  url: string;
  disabled: boolean;
  onCommit: (url: string) => TrackMutationResult;
};

export function SourceSettingsSection({
  title,
  url,
  disabled,
  onCommit,
}: Props) {
  return (
    <TrackSettingsSection title={title}>
      <TrackSettingsFieldGrid>
        <TrackSettingsFullRow>
          <TrackSettingsUrlField
            required
            disabled={disabled}
            value={url}
            onCommit={onCommit}
          />
        </TrackSettingsFullRow>
      </TrackSettingsFieldGrid>
    </TrackSettingsSection>
  );
}

export function SourceSettings(props: Props) {
  return (
    <TrackSettingsLayout>
      <SourceSettingsSection {...props} />
    </TrackSettingsLayout>
  );
}
