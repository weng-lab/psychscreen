import React, { useCallback, useState } from "react";
import { Modal, Accordion, Box, Paper } from "@material-ui/core";
import { Typography, Button } from "@weng-lab/psychscreen-ui-components";
import {
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type SingleCellQTLTracksModalProps = {
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
  "Celltype specific eQTLS": [
    ["Astrocytes", "https://downloads.wenglab.org/Astro_sig_QTLs.dat.bb"],

    [
      "Chandelier",
      "https://downloads.wenglab.org/Chandelier__Pvalb_sig_QTLs.dat.bb",
    ],

    ["Vip", "https://downloads.wenglab.org/Vip_sig_QTLs.dat.bb"],

    ["Sst", "https://downloads.wenglab.org/Sst__Sst.Chodl_sig_QTLs.dat.bb"],

    ["Pericytes", "https://downloads.wenglab.org/PC_sig_QTLs.dat.bb"],

    [
      "Layer 2/3 Intratelencephalic projecting",
      "https://downloads.wenglab.org/L2.3.IT_sig_QTLs.dat.bb",
    ],

    [
      "Layer 4 Intratelencephalic projecting ",
      "https://downloads.wenglab.org/L4.IT_sig_QTLs.dat.bb",
    ],

    [
      "Layer 5/6 Near projecting ",
      "https://downloads.wenglab.org/L5.6.NP_sig_QTLs.dat.bb",
    ],

    [
      "Layer 5 Intratelencephalic projecting",
      "https://downloads.wenglab.org/L5.IT_sig_QTLs.dat.bb",
    ],

    [
      "Layer 6 Corticothalamic projecting ",
      "https://downloads.wenglab.org/L6.CT_sig_QTLs.dat.bb",
    ],
    [
      "Layer 6 Intratelencephalic projecting ",
      "https://downloads.wenglab.org/L6.IT_sig_QTLs.dat.bb",
    ],

    ["L6b", "https://downloads.wenglab.org/L6b_sig_QTLs.dat.bb"],

    ["Lamp5.Lhx6", "https://downloads.wenglab.org/Lamp5.Lhx6_sig_QTLs.dat.bb"],
    ["Lamp5", "https://downloads.wenglab.org/Lamp5_sig_QTLs.dat.bb"],
    ["Microglia", "https://downloads.wenglab.org/Micro.PVM_sig_QTLs.dat.bb"],
    ["Oligodendrocytes", "https://downloads.wenglab.org/Oligo_sig_QTLs.dat.bb"],
    [
      "Oligodendrocyte Precursor Cells",
      "https://downloads.wenglab.org/OPC_sig_QTLs.dat.bb",
    ],
  ],
};

const SingleCellQTLTracksModal: React.FC<SingleCellQTLTracksModalProps> = (
  props
) => {
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
        ...TRACKS["Celltype specific eQTLS"].filter(
          (track) =>
            (selectedTracks.find((x) => x === track[0])?.length || 0) > 0
        ),
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
          Select Celltype specific eQTL Tracks for Display
        </Typography>
        <Accordion expanded={expanded.get("Celltype specific eQTLS")}>
          <AccordionSummary
            onClick={() => expand("Celltype specific eQTLS")}
            expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography type="title" size="medium">
              Celltype specific eQTL Tracks
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Paper
              elevation={3}
              style={{
                maxHeight: 500,
                width: 800,
                overflow: "auto",
              }}
            >
              <FormGroup style={{ marginLeft: "3em" }}>
                {TRACKS["Celltype specific eQTLS"].map((track) => (
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
            </Paper>
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
export default SingleCellQTLTracksModal;
