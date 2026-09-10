import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import HighlightIcon from "@mui/icons-material/Highlight";
import {
  GenomeBrowser,
  createSettingsStore,
  type BrowserStoreInstance,
  type Highlight,
  type TrackStoreInstance,
} from "@weng-lab/genomebrowser";

import { HighlightDialog, TrackSelect } from "@weng-lab/genomebrowser-ui";
import { TrackBaseSettings } from "@weng-lab/genomebrowser-tracks/shared";
import { useEffect, useRef, useState } from "react";
import { TRACK_COLLECTIONS } from "./collections";
import BrowserSearch from "./components/BrowserSearch";
import BrowserControls from "./components/BrowserControls";
import BrowserOverview from "./components/BrowserOverview";

export default function GenomeBrowserView({
  browserStore,
  trackStore,
  trackCollections = TRACK_COLLECTIONS,
  defaultTrackIds,
  cytobandMarkers,
}: {
  browserStore: BrowserStoreInstance;
  trackStore: TrackStoreInstance;
  trackCollections?: unknown[];
  defaultTrackIds?: readonly string[];
  cytobandMarkers?: readonly Highlight[];
}) {
  const [trackSelectOpen, setTrackSelectOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);
  const [useSettingsStore] = useState(() =>
    createSettingsStore({ baseSettingsComponent: TrackBaseSettings }),
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      // Preserve the last measured width while a portal tab is hidden.
      if (entry.contentRect.width <= 0) return;
      const state = browserStore.getState();
      const width = Math.max(1, entry.contentRect.width - state.marginWidth);
      if (width !== state.trackWidth) state.setTrackWidth(width);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [browserStore]);

  return (
    <>
      <Stack sx={{ overflow: "hidden", px: { xs: 2, md: 4, lg: 6 }, py: 2 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <BrowserSearch useBrowserStore={browserStore} />
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            alignItems={{ xs: "stretch", sm: "center" }}
            sx={{
              width: { xs: "100%", md: "auto" },
            }}
          >
            <Button
              variant="contained"
              startIcon={<HighlightIcon />}
              size="small"
              onClick={() => setHighlightOpen(true)}
              sx={{ minHeight: 44 }}
            >
              Highlights
            </Button>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              size="small"
              onClick={() => setTrackSelectOpen(true)}
              sx={{ minHeight: 44 }}
            >
              Select Tracks
            </Button>
          </Stack>
        </Stack>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems="center"
          border="1px solid rgb(204, 204, 204)"
          borderBottom="none"
          p={1}
          mt={2}
        >
          <BrowserOverview
            useBrowserStore={browserStore}
            cytobandMarkers={cytobandMarkers}
          />
          <BrowserControls useBrowserStore={browserStore} />
        </Stack>
        <div ref={containerRef} style={{ width: "100%", minWidth: 0 }}>
          <GenomeBrowser
            browserStore={browserStore}
            trackStore={trackStore}
            settingsStore={useSettingsStore}
          />
        </div>
      </Stack>
      <HighlightDialog
        open={highlightOpen}
        onClose={() => setHighlightOpen(false)}
        browserStore={browserStore}
      />
      <TrackSelect
        open={trackSelectOpen}
        onClose={() => setTrackSelectOpen(false)}
        trackCollections={trackCollections}
        useTrackStore={trackStore}
        title="Psychscreen Tracks"
        defaultTrackIds={defaultTrackIds}
      />
    </>
  );
}
