import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { Add, Delete, ExpandMore } from "@mui/icons-material";
import type {
  BrowserRegion,
  BrowserStoreInstance,
  Highlight as GBHighlight,
} from "@weng-lab/genomebrowser-v2";
import { useState } from "react";

const VALID_CHROMOSOMES = [
  "chr1",
  "chr2",
  "chr3",
  "chr4",
  "chr5",
  "chr6",
  "chr7",
  "chr8",
  "chr9",
  "chr10",
  "chr11",
  "chr12",
  "chr13",
  "chr14",
  "chr15",
  "chr16",
  "chr17",
  "chr18",
  "chr19",
  "chr20",
  "chr21",
  "chr22",
  "chrX",
  "chrY",
] as const;

type HighlightFormState = {
  id: string;
  chromosome: string;
  start: string;
  end: string;
  color: string;
};

type HighlightCreationFormProps = {
  currentRegion: BrowserRegion;
  addHighlight: (highlight: GBHighlight) => void;
};

type HighlightsListProps = {
  highlights: GBHighlight[];
  removeHighlight: (id: string) => void;
};

function HighlightCreationForm({
  currentRegion,
  addHighlight,
}: HighlightCreationFormProps) {
  const [newHighlight, setNewHighlight] = useState<HighlightFormState>({
    id: "",
    chromosome: "",
    start: "",
    end: "",
    color: "#0000FF",
  });
  const [errors, setErrors] = useState<{
    chromosome: string;
    start: string;
    end: string;
  }>({
    chromosome: "",
    start: "",
    end: "",
  });

  const validateChromosome = (chromosome: string) => {
    if (!chromosome) {
      return "Chromosome is required";
    }
    if (
      !VALID_CHROMOSOMES.includes(
        chromosome as (typeof VALID_CHROMOSOMES)[number],
      )
    ) {
      return "Invalid chromosome. Use format: chr1, chr2, ..., chr22, chrX, chrY";
    }
    return "";
  };

  const validatePosition = (position: string, field: "start" | "end") => {
    if (!position) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} position is required`;
    }
    const numericPosition = parseInt(position, 10);
    if (Number.isNaN(numericPosition)) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be a number`;
    }
    if (numericPosition < 0) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} must be positive`;
    }
    return "";
  };

  const handleInputChange = (
    field: keyof HighlightFormState,
    value: string,
  ) => {
    setNewHighlight((previous) => ({ ...previous, [field]: value }));

    if (
      (field === "chromosome" || field === "start" || field === "end") &&
      errors[field]
    ) {
      setErrors((previous) => ({ ...previous, [field]: "" }));
    }
  };

  const handleSetCurrentDomain = () => {
    handleInputChange("chromosome", currentRegion.chromosome);
    handleInputChange("start", currentRegion.start.toString());
    handleInputChange("end", currentRegion.end.toString());
  };

  const handleAddHighlight = () => {
    const chromosomeError = validateChromosome(newHighlight.chromosome);
    const startError = validatePosition(newHighlight.start, "start");
    const endError = validatePosition(newHighlight.end, "end");

    let finalEndError = endError;
    if (!startError && !endError) {
      const start = parseInt(newHighlight.start, 10);
      const end = parseInt(newHighlight.end, 10);
      if (start >= end) {
        finalEndError = "End position must be greater than start position";
      }
    }

    setErrors({
      chromosome: chromosomeError,
      start: startError,
      end: finalEndError,
    });

    if (!chromosomeError && !startError && !finalEndError) {
      addHighlight({
        id: newHighlight.id,
        region: {
          chromosome: newHighlight.chromosome,
          start: parseInt(newHighlight.start, 10),
          end: parseInt(newHighlight.end, 10),
        },
        color: newHighlight.color,
      });

      setNewHighlight({
        id: "",
        chromosome: "",
        start: "",
        end: "",
        color: "#0000FF",
      });
      setErrors({ chromosome: "", start: "", end: "" });
    }
  };

  return (
    <Accordion sx={{ mb: 2 }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="highlight-form-content"
        id="highlight-form-header"
        sx={{
          backgroundColor: "#f5f5f5",
          "&:hover": {
            backgroundColor: "lightgray",
          },
        }}
      >
        <Typography variant="h6" sx={{ display: "flex", alignItems: "center" }}>
          <Add sx={{ mr: 1 }} />
          Add New Highlight
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Chromosome"
              value={newHighlight.chromosome}
              onChange={(event) =>
                handleInputChange("chromosome", event.target.value)
              }
              size="small"
              placeholder="e.g., chr1"
              error={!!errors.chromosome}
              helperText={errors.chromosome}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Start Position"
              value={newHighlight.start}
              onChange={(event) =>
                handleInputChange("start", event.target.value)
              }
              size="small"
              placeholder="e.g., 1000000"
              type="number"
              error={!!errors.start}
              helperText={errors.start}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="End Position"
              value={newHighlight.end}
              onChange={(event) => handleInputChange("end", event.target.value)}
              size="small"
              placeholder="e.g., 2000000"
              type="number"
              error={!!errors.end}
              helperText={errors.end}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Color"
              value={newHighlight.color}
              onChange={(event) =>
                handleInputChange("color", event.target.value)
              }
              size="small"
              type="color"
              sx={{
                "& input[type='color']": {
                  height: "23px",
                  cursor: "pointer",
                },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="ID"
              value={newHighlight.id}
              onChange={(event) => handleInputChange("id", event.target.value)}
              size="small"
              placeholder="Enter highlight ID"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSetCurrentDomain}
            >
              Use Current Region
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddHighlight}
              disabled={
                !newHighlight.id ||
                !newHighlight.chromosome ||
                !newHighlight.start ||
                !newHighlight.end
              }
            >
              Add Highlight
            </Button>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}

function HighlightItem({
  highlight,
  index,
  removeHighlight,
}: {
  highlight: GBHighlight;
  index: number;
  removeHighlight: (id: string) => void;
}) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="left"
      width="100%"
      bgcolor={index % 2 === 0 ? "#f5f5f5" : "white"}
      sx={{
        "&:hover": {
          backgroundColor: "lightgray",
        },
      }}
      p={2}
      mb={1}
    >
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography variant="body1" color={highlight.color}>
          {decodeURIComponent(highlight.id)}
        </Typography>
        <IconButton
          size="small"
          onClick={() => removeHighlight(highlight.id)}
          sx={{
            color: "gray",
            "&:hover": {
              color: "red",
              backgroundColor: "rgba(255, 0, 0, 0.1)",
            },
          }}
        >
          <Delete fontSize="small" />
        </IconButton>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="body2" color="gray">
          {highlight.region.chromosome}:
          {highlight.region.start.toLocaleString()}-
          {highlight.region.end.toLocaleString()}
        </Typography>
      </Box>
    </Box>
  );
}

function HighlightsList({ highlights, removeHighlight }: HighlightsListProps) {
  if (highlights.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        width="100%"
        bgcolor="#f5f5f5"
        p={3}
      >
        <Typography variant="body2" color="text.secondary">
          No highlights added yet.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {highlights.map((highlight, index) => (
        <HighlightItem
          key={highlight.id}
          highlight={highlight}
          index={index}
          removeHighlight={removeHighlight}
        />
      ))}
    </>
  );
}

export default function HighlightDialog({
  open,
  onClose,
  useBrowserStore,
}: {
  open: boolean;
  onClose: () => void;
  useBrowserStore: BrowserStoreInstance;
}) {
  const region = useBrowserStore((state) => state.region);
  const highlights = useBrowserStore((state) => state.highlights);
  const addHighlight = useBrowserStore((state) => state.addHighlight);
  const removeHighlight = useBrowserStore((state) => state.removeHighlight);
  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Current Highlights</DialogTitle>
        <DialogContent>
          <HighlightCreationForm
            currentRegion={region}
            addHighlight={addHighlight}
          />
          <Typography variant="h6" sx={{ mb: 1 }}>
            Active Highlights
          </Typography>
          <HighlightsList
            highlights={highlights}
            removeHighlight={removeHighlight}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
