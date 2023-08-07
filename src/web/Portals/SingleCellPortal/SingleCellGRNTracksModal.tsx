import React, { useCallback, useState } from "react";
import { Modal, Accordion, Box, Paper } from "@material-ui/core";
import { Typography, Button } from "@weng-lab/psychscreen-ui-components";
import {
  AccordionDetails,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

type SingleCellGRNTracksModalProps = {
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
  "Gene Regulatory Network Tracks": [
    [
        "Astrocytes Enhancer and Promoter",
        "https://downloads.wenglab.org/Ast.bb",
      ],
      [
        "Endothelial cells Enhancer and Promoter",
        "https://downloads.wenglab.org/End.bb",
      ],
      ["Vip  Enhancer and Promoter",
       "https://downloads.wenglab.org/Vip.bb"
      ],
      [
        "Oligodendrocytes Enhancer and Promoter",
        "https://downloads.wenglab.org/Oli.bb",
      ],
      [
        "Chandelier Enhancer and Promoter",
        "https://downloads.wenglab.org/Chandelier.bb",
      ],
      [
        "Immune Cells  Enhancer and Promoter",
        "https://downloads.wenglab.org/Immune.bb",
      ],
    
      [
        "Vascular Leptomeningeal Cells Enhancer and Promoter",
        "https://downloads.wenglab.org/VLMC.bb",
      ],
      ["Sncg Enhancer and Promoter", "https://downloads.wenglab.org/Sncg.bb"],
      ["Sst  Enhancer and Promoter", "https://downloads.wenglab.org/Sst.bb"],
      ["Pvalb  Enhancer and Promoter", "https://downloads.wenglab.org/Pvalb.bb"],
      ["Pax6  Enhancer and Promoter", "https://downloads.wenglab.org/Pax6.bb"],
      [
        "Oligodendrocyte Precursor Cells  Enhancer and Promoter",
        "https://downloads.wenglab.org/OPC.bb",
      ],
      ["Microglia Enhancer and Promoter", "https://downloads.wenglab.org/Mic.bb"],
      [
        "Lamp5.Lhx6  Enhancer and Promoter",
        "https://downloads.wenglab.org/Lamp5.Lhx6.bb",
      ],
      ["Lamp5 Enhancer and Promoter", "https://downloads.wenglab.org/Lamp5.bb"],
      ["L6b  Enhancer and Promoter", "https://downloads.wenglab.org/L6b.bb"],
      [
        "Layer 6 Intratelencephalic projecting  Enhancer and Promoter",
        "https://downloads.wenglab.org/L6.IT.bb",
      ],
      [
        "Layer 5 Intratelencephalic projecting Enhancer and Promoter",
        "https://downloads.wenglab.org/L5.IT.bb",
      ],
      [
        "Layer 4 Intratelencephalic projecting Enhancer and Promoter",
        "https://downloads.wenglab.org/L4.IT.bb",
      ],
      [
        "Layer 2/3 Intratelencephalic projecting Enhancer and Promoter",
        "https://downloads.wenglab.org/L2.3.IT.bb",
      ],
      [
        "Layer 5 Extratelencephalic projecting Enhancer and Promoter",
        "https://downloads.wenglab.org/L5.ET.bb",
      ],
      [
        "Layer 5/6 Near projecting Enhancer and Promoter",
        "https://downloads.wenglab.org/L5.6.NP.bb",
      ],
      [
        "Layer 6 Intratelencephalic projecting Car3 Enhancer and Promoter",
        "https://downloads.wenglab.org/L6.IT.Car3.bb",
      ],
      [
        "Layer 6 Corticothalamic projecting  Enhancer and Promoter",
        "https://downloads.wenglab.org/L6.CT.bb",
      ]
  ],
  
};

const SingleCellGRNTracksModal: React.FC<SingleCellGRNTracksModalProps> = (props) => {
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
        ...TRACKS["Gene Regulatory Network Tracks"].filter(
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
          Select Gene Regulatory Network Tracks for Display
        </Typography>
        <Accordion expanded={expanded.get("Gene Regulatory Network Tracks")}>
          <AccordionSummary
            onClick={() => expand("Gene Regulatory Network Tracks")}
            expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography type="title" size="medium">
            Gene Regulatory Network Tracks
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
          <Paper elevation={3}
                          style={{
                            maxHeight: 500,
                            width: 800,
                            overflow: "auto",
                          }}>
            <FormGroup style={{ marginLeft: "3em" }}>
              {TRACKS["Gene Regulatory Network Tracks"].map((track) => (
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
export default SingleCellGRNTracksModal;
