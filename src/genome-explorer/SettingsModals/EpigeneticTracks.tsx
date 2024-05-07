import React, { useCallback, useState } from "react";
import { Modal, Accordion, Box } from "@material-ui/core";
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

type EpigeneticTrackModalProps = {
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

const TRACKS = {
  "Candidate cis-Regulatory Elements": [
    [
      "Adult brain b-cCREs",
      "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/adult_bCREs.bigBed",
    ],
    [
      "Fetal brain b-cCREs",
      "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/fetal_bCREs.bigBed",
    ],
    [
      "ENCODE cCREs, all tissues",
      "gs://gcp.wenglab.org/GRCh38-cCREs.V4.bigBed",
    ],
  ],
  "PsychENCODE neuron/non-neuron FANS-sorted ATAC-seq (healthy donors)": [
    ["all brain regions, aggregated", "all", "-ATAC"],
    ["dorsolateral prefrontal cortex", "DLPFC", "-healthy-ATAC"],
    ["frontopolar prefrontal cortex", "FPPFC", "-healthy-ATAC"],
    ["hippocampus", "HIPP", "-healthy-ATAC"],
    ["insular cortex", "INS", "-healthy-ATAC"],
    ["inferior temporal gyrus", "ITC", "-healthy-ATAC"],
    ["mediodorsal thalamic nucleus", "MDT", "-healthy-ATAC"],
    ["medial orbital frontal cortex", "MOFC", "-healthy-ATAC"],
    ["nucleus accumbens", "NA", "-healthy-ATAC"],
    ["premotor cortex", "PMC", "-healthy-ATAC"],
    ["posterior superior temporal cortex", "PMC", "-healthy-ATAC"],
    ["putamen", "PTM", "-healthy-ATAC"],
    ["primary visual cortex", "PVC", "-healthy-ATAC"],
    ["ventrolateral prefrontal cortex", "VLPFC", "-healthy-ATAC"],
  ],
  "PsychENCODE SCZ/BP/healthy DLPFC ATAC-seq": [
    ["healthy donors", "DLPFC-mixed-Norm-ATAC.bigWig"],
    ["bipolar donors", "DLPFC-mixed-BD-ATAC.bigWig"],
    ["schizophrenia donors", "DLPFC-mixed-SCZ-ATAC.bigWig"],
  ],
  "Single cell ATAC-seq pseudobulk": [
    [
      "child/adult layer 4 neuron, RORβ+",
      "C1_ChildAdult_Neuron_L4-RORB.bigWig",
    ],
    [
      "infant (1 month old) astrocyte",
      "C2_Infant-1Month_Astrocyte_Astrocyte.bigWig",
    ],
    [
      "infant (6 month old) astrocyte",
      "C3_Infant-6Month_Astrocyte_Astrocyte.bigWig",
    ],
    [
      "child/adult astrocyte (cluster 1)",
      "C4_ChildAdult_Astrocyte_Astrocyte.bigWig",
    ],
    [
      "child/adult astrocyte (cluster 2)",
      "C5_ChildAdult_Astrocyte_Astrocyte.bigWig",
    ],
    [
      "child/adult astrocyte (cluster 3)",
      "C6_Child_Astrocyte_Astrocyte.bigWig",
    ],
    [
      "infant (10 month old) astrocyte",
      "C7_Infant-10Month_Astrocyte_Astrocyte.bigWig",
    ],
    [
      "child/adult neuron, ID2+ (cluster 1)",
      "C8_ChildAdult_Neuron_IN-ID2.bigWig",
    ],
    [
      "child/adult neuron, ID2+ (cluster 2)",
      "C9_ChildAdult_Neuron_IN-ID2.bigWig",
    ],
    [
      "child/adult neuron, ID2+ (cluster 2)",
      "C9_ChildAdult_Neuron_IN-ID2.bigWig",
    ],
    [
      "infant (1 month old) neuron, TLE4+",
      "C10_Infant-1Month_Neuron_TLE4.bigWig",
    ],
    [
      "infant (3 month old) neuron, layer 2-3 CUX2+",
      "C11_Infant-3Month_Neuron_L2-3-CUX2.bigWig",
    ],
    [
      "fetal (22 week) neuron, THEMIS+",
      "C12_Fetal-GA22_Neuron_Fetal-THEMIS.bigWig",
    ],
    ["child inhibitory neuron, SST+", "C13_Child_Neuron_IN-SST.bigWig"],
    [
      "child/adult inhibitory neuron, SST+",
      "C14_ChildAdult_Neuron_IN-SST.bigWig",
    ],
    ["child neuron, layer 2/3, CUX2+", "C15_Child_Neuron_L2-3-CUX2.bigWig"],
    [
      "child/adult neuron, layer 2/3, CUX2+",
      "C16_ChildAdult_Neuron_L2-3-CUX2.bigWig",
    ],
    [
      "fetal (24 week) neuron, CUX2+",
      "C17_Fetal-GA24_Neuron_Fetal-CUX2.bigWig",
    ],
    [
      "infant (10 month old) developing neuron",
      "C18_Infant-10Month_Neuron_Developing.bigWig",
    ],
    [
      "child/adult oligodendrocyte (cluster 1)",
      "C20_ChildAdult_ODC_ODC.bigWig",
    ],
    [
      "child/adult oligodendrocyte (cluster 2)",
      "C21_ChildAdult_ODC_ODC.bigWig",
    ],
    [
      "infant (6 month old) oligodendrocyte precursor",
      "C22_Infant-6Month_OPC_OPC.bigWig",
    ],
    ["child oligodendrocyte precursor", "C23_Child_OPC_OPC.bigWig"],
    ["child/adult oligodendrocyte precursor", "C24_ChildAdult_OPC_OPC.bigWig"],
  ],
};

const EpigeneticTrackModal: React.FC<EpigeneticTrackModalProps> = (props) => {
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
        ...TRACKS["Candidate cis-Regulatory Elements"].filter(
          (track) =>
            (selectedTracks.find((x) => x === track[0])?.length || 0) > 0
        ),
        ...TRACKS[
          "PsychENCODE neuron/non-neuron FANS-sorted ATAC-seq (healthy donors)"
        ]
          .filter(
            (track) =>
              (selectedTracks.find((x) => x === track[0] + " NeuN+")?.length ||
                0) > 0
          )
          .map((track) => [
            track[0] + " NeuN+",
            `gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/${track[1]}-NeuN+${track[2]}.bigWig`,
          ]),
        ...TRACKS[
          "PsychENCODE neuron/non-neuron FANS-sorted ATAC-seq (healthy donors)"
        ]
          .filter(
            (track) =>
              (selectedTracks.find((x) => x === track[0] + " NeuN-")?.length ||
                0) > 0
          )
          .map((track) => [
            track[0] + " NeuN-",
            `gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/${track[1]}-NeuN-${track[2]}.bigWig`,
          ]),
        ...TRACKS["PsychENCODE SCZ/BP/healthy DLPFC ATAC-seq"]
          .filter(
            (track) =>
              (selectedTracks.find((x) => x === track[0])?.length || 0) > 0
          )
          .map((track) => [
            track[0],
            `gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/${track[1]}`,
          ]),
        ...TRACKS["Single cell ATAC-seq pseudobulk"]
          .filter(
            (track) =>
              (selectedTracks.find((x) => x === track[0])?.length || 0) > 0
          )
          .map((track) => [
            track[0],
            `gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/${track[1]}`,
          ]),
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
          Select Epigenetic Tracks for Display
        </Typography>
        <Accordion expanded={expanded.get("Candidate cis-Regulatory Elements")}>
          <AccordionSummary
            onClick={() => expand("Candidate cis-Regulatory Elements")}
            expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography type="title" size="medium">
              Candidate cis-Regulatory Elements
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup style={{ marginLeft: "3em" }}>
              {TRACKS["Candidate cis-Regulatory Elements"].map((track) => (
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
        <Accordion
          expanded={expanded.get(
            "PsychENCODE neuron/non-neuron FANS-sorted ATAC-seq (healthy donors)"
          )}
        >
          <AccordionSummary
            onClick={() =>
              expand(
                "PsychENCODE neuron/non-neuron FANS-sorted ATAC-seq (healthy donors)"
              )
            }
            expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography type="title" size="medium">
              PsychENCODE neuron/non-neuron FANS-sorted ATAC-seq (healthy
              donors)
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ overflowY: "scroll", maxHeight: "300px" }}>
            {TRACKS[
              "PsychENCODE neuron/non-neuron FANS-sorted ATAC-seq (healthy donors)"
            ].map((track) => (
              <Grid container key={track[0]}>
                <Grid item xs={4}>
                  <Typography
                    display="inline"
                    style={{ marginRight: "4em" }}
                    size="large"
                    type="body"
                  >
                    {track[0]}
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <FormControlLabel
                    key={track[0]}
                    control={
                      <Checkbox
                        checked={
                          (selectedTracks.find((x) => x === track[0] + " NeuN+")
                            ?.length || 0) > 0
                        }
                      />
                    }
                    label="NeuN+"
                    onChange={() =>
                      toggleTrack([track[0] + " NeuN+", ...track.slice(1)])
                    }
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControlLabel
                    key={track[0]}
                    control={
                      <Checkbox
                        checked={
                          (selectedTracks.find((x) => x === track[0] + " NeuN-")
                            ?.length || 0) > 0
                        }
                      />
                    }
                    label="NeuN-"
                    onChange={() =>
                      toggleTrack([track[0] + " NeuN-", ...track.slice(1)])
                    }
                  />
                </Grid>
                <Grid item xs={2} />
              </Grid>
            ))}
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded.get("PsychENCODE SCZ/BP/healthy DLPFC ATAC-seq")}
        >
          <AccordionSummary
            onClick={() => expand("PsychENCODE SCZ/BP/healthy DLPFC ATAC-seq")}
            expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography type="title" size="medium">
              PsychENCODE SCZ/BP/healthy DLPFC ATAC-seq
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormGroup style={{ marginLeft: "3em" }}>
              {TRACKS["PsychENCODE SCZ/BP/healthy DLPFC ATAC-seq"].map(
                (track) => (
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
                )
              )}
            </FormGroup>
          </AccordionDetails>
        </Accordion>
        <Accordion expanded={expanded.get("Single cell ATAC-seq pseudobulk")}>
          <AccordionSummary
            onClick={() => expand("Single cell ATAC-seq pseudobulk")}
            expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography type="title" size="medium">
              Single cell ATAC-seq pseudobulk
            </Typography>
          </AccordionSummary>
          <AccordionDetails style={{ overflowY: "scroll", maxHeight: "200px" }}>
            <FormGroup style={{ marginLeft: "3em" }}>
              {TRACKS["Single cell ATAC-seq pseudobulk"].map((track) => (
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
export default EpigeneticTrackModal;
