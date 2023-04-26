/**
 * DownloadsPage.tsx: contains links to various PsychSCREEN downloads.
 */

import React from 'react';
import { Grid } from '@mui/material';
import { Typography, AppBar, Button } from '@zscreen/psychscreen-ui-components';
import { useNavigate } from 'react-router-dom';
import { Container } from '@mui/system';

import { PORTALS } from '../../App';
import BEDFileDownloadTable, { DataRow } from './BCRETable';

function createData(
    name: string,
    group: string,
    elements: number,
    fileSize: number,
    url: string
): DataRow {
  return { name, group, elements, fileSize, url };
}

const bCREDownloads = {
    defaultRows: [
        createData('All Human bCREs', "all", 398100, 14690395, "https://gcp.wenglab.org/psychscreen-downloads/bCREs/all-bCREs.bed")
    ],
    extraRows: [
        createData('Adult bCREs, all', "adult", 253638, 13919707, "https://gcp.wenglab.org/psychscreen-downloads/bCREs/adult-bCREs.bed"),
        createData('Adult bCREs, neuron-specific', "adult", 46194, 2123419, "https://gcp.wenglab.org/psychscreen-downloads/bCREs/adult-NeuN+-bCREs.bed"),
        createData('Adult bCREs, glia-specific', "adult", 43866, 2013769, "https://gcp.wenglab.org/psychscreen-downloads/bCREs/adult-NeuN--bCREs.bed"),
        createData('Adult bCREs, neuron/glia shared', "adult", 69899, 3840658, "https://gcp.wenglab.org/psychscreen-downloads/bCREs/adult-shared-bCREs.bed"),
        createData('Fetal bCREs, all', "fetal", 230936, 12677878, "https://gcp.wenglab.org/psychscreen-downloads/bCREs/fetal-bCREs.bed"),
    ],
    colorGroups: {
        all: "#fafafa",
        adult: "#eeeeee",
        fetal: "#fafafa"
    }
};

const bulkImportantRegionDownloads = {
    defaultRows: [
        createData('VLPFC neurons, upregulating', "VLPFC", 368895, 505784897, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_neurons.profile_scores.bw.pos.bb.bed.annotated.bed"),
        createData('VLPFC glia, upregulating', "VLPFC", 309342, 422733989, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_glia.profile_scores.bw.pos.bb.bed.annotated.bed")
    ],
    extraRows: [
        createData('VLPFC neurons, downregulating', "VLPFC", 125881, 153033684, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_neurons.profile_scores.bw.neg.bb.bed.annotated.bed"),
        createData('VLPFC glia, downregulating', "VLPFC", 74863, 88924905, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/VLPFC_glia.profile_scores.bw.neg.bb.bed.annotated.bed"),
        createData('putamen neurons, upregulating', "putamen", 368895, 499367427, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN+.profile_scores.bw.pos.bb.bed.annotated.bed"),
        createData('putamen glia, upregulating', "putamen", 309342, 422733989, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN-.profile_scores.bw.pos.bb.bed.annotated.bed"),
        createData('putamen neurons, downregulating', "putamen", 125881, 175470333, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN+.profile_scores.bw.neg.bb.bed.annotated.bed"),
        createData('putamen glia, downregulating', "putamen", 74863, 96898982, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/NeuN-.profile_scores.bw.neg.bb.bed.annotated.bed")
    ],
    colorGroups: {
        VLPFC: "#fafafa",
        putamen: "#eeeeee"
    }
};

const singleCellImportantRegionDownloads = {
    defaultRows: [
        createData('Microglia, upregulating', "microglia", 257851, 279454648, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Microglia.profile_scores.bw.pos.bed.annotated.bed"),
        createData('Microglia, downregulating', "microglia", 44629, 37124711, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Microglia.profile_scores.bw.neg.bed.annotated.bed")
    ],
    extraRows: [
        createData('Astrocytes, upregulating', "astrocytes", 121724, 87663966, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Astrocyte_1.profile_scores.bw.pos.bed.annotated.bed"),
        createData('Astrocytes, downregulating', "astrocytes", 9624, 6870613, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Astrocyte_1.profile_scores.bw.neg.bed.annotated.bed"),
        createData('Oligodendrocyte precursors, upregulating', "opcs", 183446, 157867921, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte_Precursor.profile_scores.bw.pos.bed.annotated.bed"),
        createData('Oligodendrocyte precursors, downregulating', "opcs", 29434, 21496793, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte_Precursor.profile_scores.bw.neg.bed.annotated.bed"),
        createData('Oligodendrocytes, upregulating', "olig", 312172, 363360704, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte.profile_scores.bw.pos.bed.annotated.bed"),
        createData('Oligodendrocytes, downregulating', "olig", 72775, 65344684, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Oligodendrocyte.profile_scores.bw.neg.bed.annotated.bed"),
        createData('Glutaminergic Neurons I, upregulating', "gluI", 365861, 424763761, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_1.profile_scores.bw.pos.bed.annotated.bed"),
        createData('Glutaminergic Neurons I, downregulating', "gluI", 139464, 129318985, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_1.profile_scores.bw.neg.bed.annotated.bed"),
        createData('Glutaminergic Neurons II, upregulating', "gluII", 357677, 395951962, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_2.profile_scores.bw.pos.bed.annotated.bed"),
        createData('Glutaminergic Neurons II, downregulating', "gluII", 128745, 120385750, "https://gcp.wenglab.org/psychscreen-downloads/important-regions/Glutaminergic_Neuron_2.profile_scores.bw.neg.bed.annotated.bed")
    ],
    colorGroups: {
        microglia: "#fafafa",
        astrocytes: "#eeeeee",
        opcs: "#fafafa",
        olig: "#eeeeee",
        gluI: "#fafafa",
        gluII: "#eeeeee"
    }
};

const pages = [
    "Regulatory Elements",
    "TF Binding Sites"
];

const DownloadsPage: React.FC
    = () => {

        // page and navigation controls
        const [ page, setPage ] = React.useState(0);
        const navigate = useNavigate();

        return (
            <>
                <AppBar
                    onDownloadsClicked={() => navigate("/psychscreen/downloads")}
                    onHomepageClicked={() => navigate("/")}
                    onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                    style={{ marginBottom: "63px" }}
                    centered={true}
                />
                <Grid container>
                    <Grid item sm={0} md={0} lg={1} xl={2} />
                    <Grid item sm={0} md={0} lg={11} xl={10}>
                        <Container style={{ marginTop: "25px", marginLeft: "0px", width: "741px", marginBottom: "30px" }}>
                            <Typography
                                type="body"
                                size="medium"
                                style={{ fontSize: "32px", lineHeight: "38.4px", fontWeight: 700 }}
                            >
                                PsychSCREEN Downloads
                            </Typography>
                        </Container>
                    </Grid>
                    <Grid item sm={0} md={0} lg={1} xl={2} />
                    <Grid item sm={0} md={0} lg={10} xl={8}>
                        { pages.map((p, i) => (
                            <Button
                                bvariant={page === i ? "filled" : "outlined"}
                                btheme="light"
                                onClick={() => setPage(i)}
                                style={{ marginRight: "5px" }}
                            >
                                {p}
                            </Button>
                        ))}
                        <div style={{ marginTop: "20px" }}>
                            { page === 0 && (
                                <BEDFileDownloadTable
                                    title="Brain cis-Regulatory Elements (bCREs)"
                                    {...bCREDownloads}
                                />
                            )}
                            { page === 1 && (
                                <>
                                    <BEDFileDownloadTable
                                        title="Bulk ATAC-seq TFBSs from ChromBPNet"
                                        {...bulkImportantRegionDownloads}
                                    />
                                    <BEDFileDownloadTable
                                        title="Single Cell ATAC-seq TFBSs from ChromBPNet"
                                        {...singleCellImportantRegionDownloads}
                                    />
                                </>
                            )}
                        </div>
                    </Grid>
                    <Grid item sm={0} md={0} lg={1} xl={2} />
                </Grid>
            </>
        );
};
export default DownloadsPage;
