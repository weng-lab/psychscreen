import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import {
  BigBedConfig,
  BigWigConfig,
  Browser,
  BrowserStoreInstance,
  createBrowserStore,
  createTrackStore,
  Cytobands,
  DisplayMode,
  Domain,
  Track,
  TrackStoreInstance,
  TrackType,
} from "genomebrowser-test";
import { useEffect, useState } from "react";
import ControlButtons from "./controls";
import TrackDialog from "./dialog/dialog";
import { TrackTemplate } from "./types";
import EditIcon from "@mui/icons-material/Edit";

export interface BrowserViewProps {
  coordinates: Domain;
  tracks: Track[];
}

export default function BrowserView({ coordinates, tracks }: BrowserViewProps) {
  const browserStore = createBrowserStore({
    domain: coordinates as Domain,
    marginWidth: 100,
    trackWidth: 1400,
    multiplier: 3,
  });
  const trackStore = createTrackStore(tracks);
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: "0rem",
        mb: "1rem",
      }}
    >
      <Stack gap={2} width={"100%"}>
        <LocusInfo browserStore={browserStore} />
        <Box
          display={"flex"}
          flexDirection={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={1}
        >
          <TextField
            label="Search for a feature"
            variant="outlined"
            sx={{ width: "30%" }}
            size="small"
          />
          <AddTracks trackStore={trackStore} />
        </Box>
        <ControlButtons browserStore={browserStore} />
        <Browser trackStore={trackStore} browserStore={browserStore} />
      </Stack>
    </Box>
  );
}

function AddTracks({ trackStore }: { trackStore: TrackStoreInstance }) {
  const currentTracks = trackStore((state) => state.tracks);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState<TrackTemplate[]>(
    currentTracks.map((track) => ({
      title: track.title,
      url: (track as BigBedConfig | BigWigConfig).url ?? "",
    }))
  );

  const insertTrack = trackStore((state) => state.insertTrack);
  const removeTrack = trackStore((state) => state.removeTrack);

  useEffect(() => {
    selectedTracks.forEach((track) => {
      // check if the track is not already in the browser state
      if (!currentTracks.some((t) => t.title === track.title)) {
        let trackToAdd: BigBedConfig | BigWigConfig;
        if (track.url.includes("bigWig") || track.url.includes("bw")) {
          trackToAdd = {
            id: track.title,
            title: track.title,
            url: track.url,
            color: "#000000",
            height: 75,
            titleSize: 16,
            displayMode: DisplayMode.Full,
            trackType: TrackType.BigWig,
          };
        } else {
          trackToAdd = {
            id: track.title,
            title: track.title,
            url: track.url,
            color: "#000000",
            height: 35,
            titleSize: 16,
            displayMode: DisplayMode.Dense,
            trackType: TrackType.BigBed,
          };
        }
        insertTrack(trackToAdd, currentTracks.length);
      }
    });

    // Remove tracks that are no longer selected
    currentTracks.forEach((track) => {
      if (!selectedTracks.some((t) => t.title === track.title)) {
        removeTrack(track.title);
      }
    });
  }, [currentTracks, selectedTracks]);

  return (
    <>
      <Button
        startIcon={<EditIcon />}
        size="small"
        variant="contained"
        sx={{
          color: "white",
          backgroundColor: "#000000",
          "&:hover": {
            backgroundColor: "#202020",
          },
        }}
        onClick={() => setIsOpen(true)}
      >
        Add tracks
      </Button>
      <TrackDialog
        open={isOpen}
        setOpen={setIsOpen}
        setSelectedTracks={setSelectedTracks}
        selectedTracks={selectedTracks}
      />
    </>
  );
}

function LocusInfo({ browserStore }: { browserStore: BrowserStoreInstance }) {
  const domain = browserStore((state) => state.domain);
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"space-evenly"}
    >
      <Typography variant="body2" pr={1}>
        {domain.chromosome +
          ":" +
          domain.start.toLocaleString() +
          "-" +
          domain.end.toLocaleString()}
      </Typography>
      <svg width={700} height={20}>
        <Cytobands assembly="hg38" currentDomain={domain} />
      </svg>
    </Box>
  );
}
