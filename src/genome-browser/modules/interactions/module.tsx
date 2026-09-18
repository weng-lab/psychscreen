import {
  TrackBaseSettings,
  TrackSettingsLayout,
} from "@weng-lab/genomebrowser-tracks/shared";
import { SourceSettingsSection } from "../shared/sourceSettings";
import {
  defineTrackModule,
  fetchOnChange,
  type TrackFetchContext,
} from "@weng-lab/genomebrowser";
import { z } from "zod";
import { fetchInteractions } from "./fetch";
import type { InteractionRowParser } from "./normalize";
import { InteractionRenderer } from "./render";
import { InteractionTooltip } from "./tooltip";
import type { InteractionConfig, InteractionTooltipItem } from "./types";

const configSchema = z.object({ url: fetchOnChange(z.string().min(1)) });

export function createInteractionModule({
  type,
  parseRow,
  color,
}: {
  type: string;
  parseRow: InteractionRowParser;
  color: string;
}) {
  return defineTrackModule<InteractionTooltipItem>()({
    type,
    defaults: { display: "full", height: 50, color },
    configSchema,
    fetch: ({
      track,
      demand,
      resources,
    }: TrackFetchContext<InteractionConfig>) =>
      fetchInteractions(track.config.url, demand.region, parseRow, resources),
    render: { full: InteractionRenderer },
    settingsComponent: ({ track, updateTrack, displayOptions }) => (
      <TrackSettingsLayout>
        <TrackBaseSettings
          track={track}
          updateTrack={updateTrack}
          displayOptions={displayOptions}
        />
        <SourceSettingsSection
          title="Interaction source"
          url={track.config.url}
          disabled={track.source === "host"}
          onCommit={(url) => updateTrack({ config: { url } })}
        />
      </TrackSettingsLayout>
    ),
    tooltipComponent: InteractionTooltip,
  });
}
