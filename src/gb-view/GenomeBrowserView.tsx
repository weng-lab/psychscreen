import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import HighlightIcon from "@mui/icons-material/Highlight";
import {
  GenomeBrowser,
  type BrowserStoreInstance,
  type Highlight,
  type TrackStoreInstance,
} from "@weng-lab/genomebrowser";

import { TrackSelect } from "@weng-lab/genomebrowser-ui";
import { useState } from "react";
import { MAIN_TRACK_CATALOGS } from "./catalogs";
import BrowserSearch from "./components/BrowserSearch";
import ControlButtons from "./components/ControlButtons";
import DomainDisplay from "./components/DomainDisplay";
import HighlightDialog from "./components/HighlightDialog";

export default function GenomeBrowserView({
  browserStore,
  trackStore,
  trackCatalogs = MAIN_TRACK_CATALOGS,
  defaultTrackIds,
  cytobandMarkers,
}: {
  browserStore: BrowserStoreInstance;
  trackStore: TrackStoreInstance;
  trackCatalogs?: unknown[];
  defaultTrackIds?: readonly string[];
  cytobandMarkers?: readonly Highlight[];
}) {
  const [trackSelectOpen, setTrackSelectOpen] = useState(false);
  const [highlightOpen, setHighlightOpen] = useState(false);

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
          <DomainDisplay
            useBrowserStore={browserStore}
            cytobandMarkers={cytobandMarkers}
          />
          <ControlButtons useBrowserStore={browserStore} />
        </Stack>
        <GenomeBrowser browserStore={browserStore} trackStore={trackStore} />
      </Stack>
      <HighlightDialog
        open={highlightOpen}
        onClose={() => setHighlightOpen(false)}
        useBrowserStore={browserStore}
      />
      <TrackSelect
        open={trackSelectOpen}
        onClose={() => setTrackSelectOpen(false)}
        trackCatalogs={trackCatalogs}
        useTrackStore={trackStore}
        title="Psychscreen Tracks"
        defaultTrackIds={defaultTrackIds}
      />
    </>
  );
}
