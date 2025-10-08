import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
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
  createDataStore,
  DataStoreInstance,
  Chromosome,
} from "genomebrowser-test";
import { useEffect, useMemo, useState } from "react";
import ControlButtons from "./controls";
import TrackDialog, { getTrackColor } from "./dialog/dialog";
import { TrackTemplate } from "./types";
import EditIcon from "@mui/icons-material/Edit";
import { Result, ResultType } from "./genomesearch/types";
import GenomeSearch from "./genomesearch/autocomplete";
import { Search } from "@mui/icons-material";

export interface BrowserViewProps {
  browserStore: BrowserStoreInstance;
  trackStore: TrackStoreInstance;
  dataStore: DataStoreInstance;
}

const expansionPercentages: Record<ResultType, number> = {
  cCRE: 20,
  iCRE: 20,
  Gene: 0.2,
  SNP: 5.0,
  Coordinate: 0.25,
  Study: 0.2,
};

function expandCoordinates(coordinates: Domain, type: ResultType) {
  let length = coordinates.end - coordinates.start;

  if (length <= 100) {
    length = 100;
  }

  const expansionPercentage = expansionPercentages[type];
  const padding = Math.floor(length * expansionPercentage);

  return {
    chromosome: coordinates.chromosome as Chromosome,
    start: Math.max(0, coordinates.start - padding),
    end: coordinates.end + padding,
  };
}

export function randomColor() {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
}

export default function BrowserView({
  browserStore,
  trackStore,
  dataStore,
}: BrowserViewProps) {
  const theme = useTheme();
  const editTrack = trackStore((state) => state.editTrack);
  const addHighlight = browserStore((state) => state.addHighlight);
  const setDomain = browserStore((state) => state.setDomain);

  const handeSearchSubmit = (r: Result) => {
    if (r.type === "Gene") {
      editTrack("gene-track", {
        geneName: r.title,
      });
    }
    addHighlight({
      domain: r.domain as Domain,
      color: randomColor(),
      id: r.title || "highlight",
    });

    setDomain(expandCoordinates(r.domain as Domain, r.type as ResultType));
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: "0rem",
        mb: "1rem",
        pt: "1rem",
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
          <GenomeSearch
            size="small"
            assembly={"GRCh38"}
            onSearchSubmit={handeSearchSubmit}
            queries={["Gene", "SNP", "cCRE", "Coordinate"]}
            geneLimit={3}
            sx={{ width: "400px" }}
            slots={{
              button: (
                <IconButton sx={{ color: theme.palette.primary.main }}>
                  <Search />
                </IconButton>
              ),
            }}
            slotProps={{
              input: {
                label: "Change browser region",
                sx: {
                  backgroundColor: "white",
                  "& label.Mui-focused": {
                    color: theme.palette.primary.main,
                  },
                  "& .MuiOutlinedInput-root": {
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                },
              },
            }}
          />
          <AddTracks trackStore={trackStore} />
        </Box>
        <ControlButtons browserStore={browserStore} />
        <Browser
          trackStore={trackStore}
          browserStore={browserStore}
          externalDataStore={dataStore}
        />
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
        const color = getTrackColor(track);
        if (track.url.includes("bigWig") || track.url.includes("bw")) {
          trackToAdd = {
            id: track.title,
            title: track.title,
            url: track.url,
            color: color,
            height: 50,
            titleSize: 16,
            displayMode: DisplayMode.Full,
            trackType: TrackType.BigWig,
          };
        } else {
          trackToAdd = {
            id: track.title,
            title: track.title,
            url: track.url,
            color: color,
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
