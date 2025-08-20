import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useMemo, useState, useEffect } from "react";
import { EvoConservationTracks } from "../tracks/conservation";
import { DeepLearnedTracks } from "../tracks/deep-learned";
import { EpigeneticTracks } from "../tracks/epigenetic";
import { TrackList, TrackTemplate } from "../types";
import {
  BigBedConfig,
  BigWigConfig,
  DisplayMode,
  TrackStoreInstance,
  TrackType,
} from "genomebrowser-test";

interface TrackDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedTracks: TrackTemplate[];
  setSelectedTracks: (tracks: TrackTemplate[]) => void;
  maxTracks?: number;
}

export default function TrackDialog({
  open,
  setOpen,
  selectedTracks,
  setSelectedTracks,
  maxTracks = 10,
}: TrackDialogProps) {
  const [newTracks, setNewTracks] = useState<TrackTemplate[]>(selectedTracks);

  // Memoize processed track data to avoid recalculating on every render
  const processedTrackLists = useMemo(() => {
    const processed: Record<string, Record<string, TrackTemplate[]>> = {};
    Object.entries(allTrackLists).forEach(([mainCategory, subCategories]) => {
      processed[mainCategory] = {};
      Object.entries(subCategories).forEach(([subCategory, tracks]) => {
        processed[mainCategory][subCategory] = processTemplateVariables(tracks);
      });
    });
    return processed;
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    track: TrackTemplate
  ) => {
    if (event.target.checked) {
      setNewTracks([...newTracks, track]);
    } else {
      setNewTracks(newTracks.filter((t) => t.title !== track.title));
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedTracks([...selectedTracks]);
    setNewTracks([...selectedTracks]);
  };

  const handleAccept = () => {
    if (newTracks.length > maxTracks) {
      alert(`You can only select up to ${maxTracks} tracks`);
      return;
    }
    setSelectedTracks([...newTracks]);
    setOpen(false);
  };

  const isSelected = (track: TrackTemplate) => {
    return newTracks.some((newTrack) => newTrack.title === track.title);
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      {/* Header */}
      <DialogHeader
        title="Select Tracks"
        content={`Select up to ${maxTracks} tracks to display in the genome browser`}
        handleCancel={handleCancel}
      />
      {/* Content */}
      <DialogContent>
        {Object.entries(allTrackLists).map(([mainCategory, subCategories]) => (
          <Accordion
            key={mainCategory}
            sx={{
              mb: 1,
              borderLeft: `5px solid ${categoryColors[mainCategory]}`,
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box
                width="100%"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  {mainCategory}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {
                    Object.values(processedTrackLists[mainCategory])
                      .flat()
                      .filter((track) => isSelected(track)).length
                  }{" "}
                  /{" "}
                  {
                    Object.values(processedTrackLists[mainCategory]).flat()
                      .length
                  }
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {Object.entries(subCategories).map(([subCategory, tracks]) => {
                const processedTracks =
                  processedTrackLists[mainCategory][subCategory];
                return (
                  <Accordion
                    key={`${mainCategory}-${subCategory}`}
                    sx={{ mb: 1 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        width="100%"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography fontWeight="bold">{subCategory}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {
                            processedTracks.filter((track) => isSelected(track))
                              .length
                          }{" "}
                          / {processedTracks.length}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Box display="flex" flexDirection="column" gap={1}>
                        {processedTracks.map((track, index) => (
                          <Box
                            key={`${track.title}-${index}`}
                            display="flex"
                            alignItems="center"
                            gap={1}
                          >
                            <Checkbox
                              checked={isSelected(track)}
                              onChange={(event) => handleChange(event, track)}
                            />
                            <Typography variant="body2">
                              {track.title}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </AccordionDetails>
          </Accordion>
        ))}
      </DialogContent>

      {/* Actions */}
      <ActionButtons
        numTracks={newTracks.length}
        maxTracks={maxTracks}
        handleCancel={handleCancel}
        handleAccept={handleAccept}
      />
    </Dialog>
  );
}

function DialogHeader({ title, content, handleCancel }) {
  return (
    <DialogTitle
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        backgroundColor: "grey.100",
        marginBottom: 3,
      }}
    >
      <Box
        display="flex"
        width="100%"
        alignItems="center"
        justifyContent="space-between"
        gap={1}
        mb={0}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <EditIcon /> {title}
        </Box>
        <IconButton onClick={handleCancel} sx={{ padding: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContentText>{content}</DialogContentText>
    </DialogTitle>
  );
}

function ActionButtons({ numTracks, maxTracks, handleCancel, handleAccept }) {
  return (
    <DialogActions
      sx={{
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "grey.100",
      }}
    >
      <Box display="flex" gap={1} alignItems="center">
        <Typography
          fontWeight="bold"
          color={numTracks >= maxTracks ? "#aa0000" : "#000000"}
        >
          {numTracks} / {maxTracks}
        </Typography>
        <Button
          variant="outlined"
          sx={{
            color: "#aa0000",
            borderColor: "#aa0000",
            "&:hover": {
              backgroundColor: "#ffaaaa",
              borderColor: "#aa0000",
            },
          }}
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{
            color: "white",
            backgroundColor: "#000000",
            "&:hover": {
              backgroundColor: "#202020",
            },
          }}
          onClick={handleAccept}
          disabled={numTracks === 0}
        >
          Add Tracks
        </Button>
      </Box>
    </DialogActions>
  );
}

// Utility function to process template variables like ${NEUN}
function processTemplateVariables(tracks: TrackTemplate[]): TrackTemplate[] {
  return tracks.flatMap((track) => {
    if (track.title.includes("{NEUN}") || track.url.includes("{NEUN}")) {
      return [
        {
          title: track.title.replace("{NEUN}", "NeuN+"),
          url: track.url.replace("{NEUN}", "NeuN+"),
        },
        {
          title: track.title.replace("{NEUN}", "NeuN-"),
          url: track.url.replace("{NEUN}", "NeuN-"),
        },
      ];
    }
    return [track];
  });
}
// id is title
// color comes from top level category
// provide, color, id, title, url
const createBigWig = (title: string, url: string, color: string) => {
  const config: BigWigConfig = {
    id: title,
    title: title,
    url: url,
    color: color,
    trackType: TrackType.BigWig,
    displayMode: DisplayMode.Full,
    titleSize: 12,
    height: 50,
  };
  return config;
};

const createBigBed = (title: string, url: string, color: string) => {
  const config: BigBedConfig = {
    id: title,
    title: title,
    url: url,
    color: color,
    trackType: TrackType.BigBed,
    displayMode: DisplayMode.Dense,
    titleSize: 12,
    height: 30,
  };
  return config;
};

// Simple utility to create track from template with automatic BigBed/BigWig detection
function createTrackFromTemplate(
  template: TrackTemplate,
  categoryColor: string
) {
  const isBigBed =
    template.url.endsWith(".bb") || template.url.endsWith(".bigBed");
  return isBigBed
    ? createBigBed(template.title, template.url, categoryColor)
    : createBigWig(template.title, template.url, categoryColor);
}

const allTrackLists: Record<string, TrackList> = {
  "Epigenetic Tracks": EpigeneticTracks,
  "Deep Learned Models": DeepLearnedTracks,
  "Evolutionary Conservation": EvoConservationTracks,
};

const categoryColors: Record<string, string> = {
  "Epigenetic Tracks": "#9479bc",
  "Deep Learned Models": "#758c7b",
  "Evolutionary Conservation": "#c0a9e2",
};
