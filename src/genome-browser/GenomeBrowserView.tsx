import Stack from "@mui/material/Stack";
import {
  GenomeBrowser,
  type BrowserStoreInstance,
  type Highlight,
  type TrackStoreInstance,
} from "@weng-lab/genomebrowser";

import { HighlightDialog, TrackSelect } from "@weng-lab/genomebrowser-ui";
import { useEffect, useRef, useState } from "react";
import { TRACK_COLLECTIONS } from "./collections";
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
      <Stack sx={{ overflow: "hidden", py: 2 }}>
        <BrowserControls
          browserStore={browserStore}
          onManageHighlights={() => setHighlightOpen(true)}
          onSelectTracks={() => setTrackSelectOpen(true)}
        />
        <BrowserOverview
          useBrowserStore={browserStore}
          cytobandMarkers={cytobandMarkers}
        />
        <div ref={containerRef} style={{ width: "100%", minWidth: 0 }}>
          <GenomeBrowser browserStore={browserStore} trackStore={trackStore} />
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
