import React, { useCallback, useState } from "react";
import { Modal, Accordion, Box } from "@material-ui/core";
import { Typography, Button } from "@weng-lab/psychscreen-ui-components";
import {
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type AtacSeaPeaksTrackModalProps = {
  open?: boolean;
  onAccept?: (tracks: [string, string][]) => void;
  onCancel?: () => void;
  initialSelection: [string, string][];
};

const style = {
  position: "absolute" as "absolute",
  top: "25%",
  left: "50%",
  transform: "translate(-50%, -15%)",
  width: "50%",
  bgcolor: "background.paper",
  backgroundColor: "#ffffff",
  border: "2px solid #000",
  p: 4,
  padding: "2em",
  borderRadius: "20px",
};

/*
 ["Astro", "Astrocytes"],
    ["Endo", "Endothelial Cells"],
    ["OPC", "Oligodendrocyte Precursor Cells"],
    ["Exc", "Exc"],
    ["Inh", "Inh"],
    ["Micro", "Microglia"],
    ["Oligo", "Oligodendrocytes"],
    ["all_types", "All Types"],

*/
const TRACKS = {
  "ATAC Seq Peaks": [
      [
        "Astrocytes",
        "https://downloads.wenglab.org/Astro.PeakCalls.bb",
      ],
      [
        "Endothelial Cells",
        "https://downloads.wenglab.org/Endo.PeakCalls.bb",
      ],
      [
        "Oligodendrocyte Precursor Cells",
        "https://downloads.wenglab.org/OPC.PeakCalls.bb",
      ],
      [
        "Excitatory Neurons",
        "https://downloads.wenglab.org/Exc.PeakCalls.bb",
      ],
      [
        "Oligodendrocytes",
        "https://downloads.wenglab.org/Oligo.PeakCalls.bb",
      ],
      [
        "Inhibitory Neurons",
        "https://downloads.wenglab.org/Inh.PeakCalls.bb",
      ],
      [
        "Microglia",
        "https://downloads.wenglab.org/Micro.PeakCalls.bb",
      ],
      [
        "All CellTypes",
        "https://downloads.wenglab.org/All.celltypes.Union.PeakCalls.bb",
      ],
  ],
  
};

const AtacSeaPeaksTrackModal: React.FC<AtacSeaPeaksTrackModalProps> = (props) => {
  const [expanded, setExpanded] = useState(
    new Map(Object.keys(TRACKS).map((k) => [k, false]))
  );
  const [selectedTracks, setSelectedTracks] = useState(
    props.initialSelection.map((x) => x[0])
  );
  const toggleTrack = useCallback(
    (track: string[]) => {
      const selected = !!selectedTracks.find((x) => x === track[0])?.length;
      if (!selected) setSelectedTracks([...selectedTracks, track[0]]);
      else setSelectedTracks(selectedTracks.filter((x) => x !== track[0]));
    },
    [selectedTracks]
  );
  const expand = useCallback(
    (key: string) =>
      setExpanded(
        new Map(
          Object.keys(TRACKS).map((k) => [
            k,
            k === key ? !expanded.get(k) : !!expanded.get(k),
          ])
        )
      ),
    [expanded]
  );

  const onAccept = useCallback(
    () =>
      props.onAccept &&
      props.onAccept([
        ...TRACKS["ATAC Seq Peaks"].filter(
          (track) =>
            (selectedTracks.find((x) => x === track[0])?.length || 0) > 0
        )
      ] as [string, string][]),
    [selectedTracks, props]
  );

  return (
    <Modal
      open={!!props.open}
      onClose={props.onCancel}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      
      <Box sx={style} style={style}>
        <Typography
          type="headline"
          size="medium"
          style={{ marginBottom: "0.6em" }}
        >
          Select Atac Seq Peaks Tracks for Display
        </Typography>
        <Accordion expanded={expanded.get("ATAC Seq Peaks")}>
          <AccordionSummary
            onClick={() => expand("ATAC Seq Peaks")}
            expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography type="title" size="medium">
            ATAC Seq Peaks
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup style={{ marginLeft: "3em" }}>
              {TRACKS["ATAC Seq Peaks"].map((track) => (
                <FormControlLabel
                  key={track[0]}
                  control={
                    <Checkbox
                      checked={
                        (selectedTracks.find((x) => x === track[0])?.length ||
                          0) > 0
                      }
                    />
                  }
                  label={track[0]}
                  onChange={() => toggleTrack(track)}
                />
              ))}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <div style={{ marginTop: "1em", width: "100%", textAlign: "right" }}>
          <Button bvariant="outlined" btheme="light" onClick={onAccept}>
            OK
          </Button>
          &nbsp;
          <Button
            bvariant="outlined"
            btheme="light"
            onClick={() => {
              props.onCancel && props.onCancel();
              setSelectedTracks(props.initialSelection.map((x) => x[0]));
            }}
          >
            cancel
          </Button>
        </div>
      </Box>
      
    </Modal>
  );
};
export default AtacSeaPeaksTrackModal;
