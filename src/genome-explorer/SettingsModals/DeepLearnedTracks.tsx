import React, { useCallback, useState } from 'react';
import { Modal, Accordion, Box } from '@material-ui/core';
import { Typography, Button } from '@zscreen/psychscreen-ui-components';
import { AccordionDetails, AccordionSummary, Checkbox, FormControlLabel, FormGroup, Grid } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

type DeepLearnedTrackModalProps = {
    open?: boolean;
    onAccept?: (tracks: [ string, string ][]) => void;
    onCancel?: () => void;
    initialSelection: [ string, string ][];
};

const style = {
    position: 'absolute' as 'absolute',
    top: '25%',
    left: '50%',
    transform: 'translate(-50%, -15%)',
    width: "50%",
    bgcolor: 'background.paper',
    backgroundColor: "#ffffff",
    border: '2px solid #000',
    p: 4,
    padding: "2em",
    borderRadius: "20px"
};

const TRACKS = {
    "Adult brain bulk ATAC-seq": [
        [ "VLPFC glia", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_glia" ],
        [ "VLPFC neurons", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_neurons" ],
        [ "putamen glia", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_glia" ],
        [ "putamen neurons", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_neurons" ]
    ],
    "Adult cerebrum single cell ATAC-seq": [
        [ "astrocytes", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell" ],
        [ "GABA-ergic type I", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell" ],
        [ "GABA-ergic type II", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell" ],
        [ "glutaminergic type I", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell" ],
        [ "glutaminergic type II", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell" ],
        [ "microglia", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell" ],
        [ "oligodendrocytes", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell" ],
        [ "oligodendrocyte precursors", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/adult-cerebrum-single-cell" ],
    ],
    "Evolutionary conservation": [
        [ "241-way mammalian phylo-P", "gs://gcp.wenglab.org/241-mammalian-2020v2.bigWig" ]
    ]
};

const DeepLearnedTrackModal: React.FC<DeepLearnedTrackModalProps> = props => {

    // start with all tracks collapsed and a default set selected
    const [ expanded, setExpanded ] = useState(new Map(Object.keys(TRACKS).map(k => [ k, false ])));
    const [ selectedTracks, setSelectedTracks ] = useState(props.initialSelection.map(x => x[0]));

    // handle track and accordion toggling
    const toggleTrack = useCallback( (track: string[]) => {
        const selected = !!selectedTracks.find(x => x === track[0])?.length;
        if (!selected) setSelectedTracks([ ...selectedTracks, track[0] ]);
        else setSelectedTracks(selectedTracks.filter(x => x !== track[0]));
    }, [ selectedTracks ]);
    const expand = useCallback((key: string) => {
        setExpanded(
            new Map(
                // expand only the clicked item
                Object.keys(TRACKS).map(k => [ k, k === key ? !expanded.get(k) : !!expanded.get(k) ])
            )
        );
    }, [ expanded ]);

    const onAccept = useCallback( () => props.onAccept && props.onAccept([
        ...TRACKS["Adult brain bulk ATAC-seq"].filter(track => (selectedTracks.find(x => x === track[0])?.length || 0) > 0),
        ...TRACKS["Adult cerebrum single cell ATAC-seq"].filter(track => (selectedTracks.find(x => x === track[0])?.length || 0) > 0),
        ...TRACKS["Evolutionary conservation"].filter(track => (selectedTracks.find(x => x === track[0])?.length || 0) > 0)
    ] as [ string, string ][]), [ selectedTracks ]);

    return (
        <Modal
            open={!!props.open}
            onClose={props.onCancel}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style} style={style}>
                <Typography type='headline' size='medium' style={{ marginBottom: "0.6em" }}>
                    Select Deep Learned Model Tracks for Display
                </Typography>
                <Accordion expanded={expanded.get("Adult brain bulk ATAC-seq")}>
                    <AccordionSummary
                        onClick={() => expand("Adult brain bulk ATAC-seq")}
                        expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography type="title" size="medium">Adult brain bulk ATAC-seq</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup style={{ marginLeft: "3em" }}>
                            { TRACKS["Adult brain bulk ATAC-seq"].map(track => (
                                <FormControlLabel
                                    key={track[0]}
                                    control={<Checkbox checked={(selectedTracks.find(x => x === track[0])?.length || 0) > 0} />}
                                    label={track[0]}
                                    onChange={() => toggleTrack(track)}
                                />
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded.get("Adult cerebrum single cell ATAC-seq")}>
                    <AccordionSummary
                        onClick={() => expand("Adult cerebrum single cell ATAC-seq")}
                        expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography type="title" size="medium">Adult cerebrum single cell ATAC-seq</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup style={{ marginLeft: "3em" }}>
                            { TRACKS["Adult cerebrum single cell ATAC-seq"].map(track => (
                                <FormControlLabel
                                    key={track[0]}
                                    control={<Checkbox checked={(selectedTracks.find(x => x === track[0])?.length || 0) > 0} />}
                                    label={track[0]}
                                    onChange={() => toggleTrack(track)}
                                />
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <Accordion expanded={expanded.get("Evolutionary conservation")}>
                    <AccordionSummary
                        onClick={() => expand("Evolutionary conservation")}
                        expandIcon={!expanded ? <ExpandMoreIcon /> : <ExpandLessIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                    >
                        <Typography type="title" size="medium">Evolutionary conservation</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup style={{ marginLeft: "3em" }}>
                            { TRACKS["Evolutionary conservation"].map(track => (
                                <FormControlLabel
                                    key={track[0]}
                                    control={<Checkbox checked={(selectedTracks.find(x => x === track[0])?.length || 0) > 0} />}
                                    label={track[0]}
                                    onChange={() => toggleTrack(track)}
                                />
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
                <div style={{ marginTop: "1em", width: "100%", textAlign: "right" }}>
                    <Button bvariant='outlined' btheme='light' onClick={onAccept}>OK</Button>&nbsp;
                    <Button
                        bvariant='outlined'
                        btheme='light'
                        onClick={() => { props.onCancel && props.onCancel(); setSelectedTracks(props.initialSelection.map(x => x[0])); }}
                    >
                        cancel
                    </Button>
                </div>
            </Box>
        </Modal>
    );
};
export default DeepLearnedTrackModal;
