import React, {useState, useCallback} from 'react';
import { GridProps } from '@mui/material';
import { AppBar, Typography, SearchBox, HorizontalCard, Button, CustomizedTable } from '@zscreen/psychscreen-ui-components';
import { useParams, useNavigate } from "react-router-dom";
import { PORTALS } from "../../../App";
import { Grid, Container, Slide } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

export const cellTypeCards = [{ val: "Ast", cardLabel: "Astrocytes", cardDesc: ""},
{val: "Chandelier", cardLabel: "Chandelier", cardDesc: ""},
{val: "End", cardLabel: "Endothelial cells", cardDesc: ""},
{val: "Immune", cardLabel: "Immune Cells", cardDesc: ""},
{ val: "VLMC", cardLabel: "Vascular Leptomeningeal Cells", cardDesc: ""},
{val: "Sncg", cardLabel: "Sncg", cardDesc: ""},
{val: "Vip", cardLabel: "Vip", cardDesc: ""},
{val: "Sst", cardLabel: "Sst", cardDesc: ""},
{val: "Pvalb", cardLabel: "Pvalb", cardDesc: ""},
{val: "Pax6", cardLabel: "Pax6", cardDesc: ""},
{val: "Oli", cardLabel: "Oligodendrocytes", cardDesc: ""},
{ val: "OPC", cardLabel: "Oligodendrocyte Precursor Cells", cardDesc: ""},
{val: "Mic", cardLabel: "Microglia", cardDesc: ""},
{val: "Lamp5.Lhx6", cardLabel: "Lamp5.Lhx6", cardDesc: ""},
{val: "L6b", cardLabel: "L6b", cardDesc: ""},
{ val: "L6.IT", cardLabel: "Layer 6 Intratelencephalic projecting", cardDesc: ""},
{val: "L6.IT.Car3", cardLabel: "Layer 6 Intratelencephalic projecting Car3", cardDesc: ""},
{val: "L6.CT", cardLabel: "Layer 6 Corticothalamic projecting", cardDesc: ""},
{val: "L5.IT", cardLabel: "Layer 5 Intratelencephalic projecting", cardDesc: ""},
{ val: "L5.ET", cardLabel: "Layer 2/3 Extratelencephalic projecting", cardDesc: ""},
{val: "L5.6.NP", cardLabel: "Layer 5/6 Near projecting", cardDesc: ""},
{val: "L4.IT", cardLabel: "Layer 4 Intratelencephalic projecting", cardDesc: ""},
{val: "L2.3.IT", cardLabel: "Layer 2/3 Intratelencephalic projecting", cardDesc: ""}]

export const DISEASE_CARDS = [
    {val: "DevBrain", cardLabel: "DevBrain", cardDesc: ""},
    {val: "IsoHuB", cardLabel: "IsoHuB", cardDesc: ""},
    {val: "SZBDMulti-Seq", cardLabel: "SZBDMulti-Seq", cardDesc: ""},
    {val: "Urban-DLPFC", cardLabel: "Urban-DLPFC", cardDesc: ""},
    {val: "CMC-CellHashing", cardLabel: "CMC-CellHashingr", cardDesc: ""},
    {val: "UCLA-ASD", cardLabel: "UCLA-ASD", cardDesc: ""},
    ]

const CELLTYPES = [{ val: "Astro", cardLabel: "Astrocytes", cardDesc: ""},

{val: "Endo", cardLabel: "Endothelial cells", cardDesc: ""},
{val: "Exc", cardLabel: "Exc", cardDesc: ""},
{val: "Inh", cardLabel: "Inh", cardDesc: ""},
{val: "all_types", cardLabel: "All Types", cardDesc: ""},
{val: "Oligo", cardLabel: "Oligodendrocytes", cardDesc: ""},
{ val: "OPC", cardLabel: "Oligodendrocyte Precursor Cells", cardDesc: ""},
{val: "Micro", cardLabel: "Microglia", cardDesc: ""}
]
 
const SingleCellDatasets: React.FC<GridProps> = (props) => {
    const navigate = useNavigate(); 
    const { disease } = useParams();
    const [ page, setPage ] = useState<number>(-1);
    let d =  ['Astro', 'Endo','OPC','Exc','Inh','Micro','Oligo' ,"all_types"].map((ct)=>{
        let url = `https://downloads.wenglab.org/merged_peaks_${ct}.bed`
        return [{header:'Cell Type', value: CELLTYPES.find(c=>c.val===ct)?.cardLabel},{header:'Download', value:'1', render: <Button bvariant='outlined' btheme="light" endIcon={<DownloadIcon/>}>
                            
        <a href={url} download>
             Download
        </a>
    </Button>}]
    })  
    return (<>
    <AppBar
                centered
                onDownloadsClicked={() => navigate("/downloads")}
                onHomepageClicked={() => navigate("/")}
                onPortalClicked={index => navigate(`/psychscreen${PORTALS[index][0]}`)}
                style={{ marginBottom: "63px" }}
            />
            <Grid>
           <Grid item sm={1}  md={1} lg={1.5} xl={1.5} />
                {disease==='scATAC-Seq-peaks'  && <Grid item  sm={10}  md={10} lg={9} xl={9}>
                    <Container style={{ marginTop: "-10px", marginLeft: "100px" }}>
                        <Typography
                            type="display"
                            size="medium"
                            style={{ fontWeight: 700, fontSize: "40px", lineHeight: "57.6px", letterSpacing: "0.5px", marginBottom: "16px"  }}
                        >
                            {'scATAC-Seq Peaks'}
                        </Typography>
                        <br/>
                        <Button bvariant={page === -1 ? "filled" : "outlined"} btheme="light" onClick={() => setPage(-1)}>Cell Type specific ATAC peaks</Button>&nbsp;&nbsp;&nbsp;
                        <Button bvariant={page === 0 ? "filled" : "outlined"} btheme="light" onClick={() => setPage(0)}>Genome Browser</Button>&nbsp;&nbsp;&nbsp;
                        <Grid sm={10} md={10} lg={9} xl={9}>
                            {page===-1 ? <CustomizedTable tabledata={d}/> : <></> }
                        
                        </Grid>
                    </Container>
                </Grid>}
                {disease==='Gene-regulatory-networks'  && <Grid item  sm={10}  md={10} lg={9} xl={9}>
                    <Container style={{ marginTop: "-10px", marginLeft: "100px" }}>
                        <Typography
                            type="display"
                            size="medium"
                            style={{ fontWeight: 700, fontSize: "36px", lineHeight: "57.6px", letterSpacing: "0.5px",  marginLeft: "30px",marginBottom: "16px"  }}
                        >
                            {'Cell Types'}
                        </Typography>
                        <br/>
                        
                        <Grid sm={10} md={10} lg={9} xl={9}>
                        <Slide direction="up" in timeout={1000}>
                                <Container style={{ marginLeft: "30px", marginTop: "10px" }}>            
                                    <HorizontalCard width={500}
                                        onCardClick={(v?: string) => {
                                            navigate(`/psychscreen/single-cell/datasets/Gene-regulatory-networks/${v}`, { state: { searchvalue: v } })
                                        }}
                                        cardContentText={cellTypeCards} 
                                    />            
                                </Container>
                            </Slide>  
                        
                        </Grid>
                    </Container>
                </Grid>}
                {disease==='Indiv-cohort-expression-data'  && <Grid item  sm={10}  md={10} lg={9} xl={9}>
                    <Container style={{ marginTop: "-10px", marginLeft: "100px" }}>
                                               
                        <Grid sm={10} md={10} lg={9} xl={9}>
                        <Slide direction="up" in timeout={1000}>
                                <Container style={{ marginLeft: "30px", marginTop: "10px" }}>            
                                    <HorizontalCard width={500}
                                        onCardClick={(v?: string) => {
                                            navigate(`/psychscreen/single-cell/${v}`, { state: { searchvalue: v } })
                                        }}
                                        cardContentText={DISEASE_CARDS} 
                                    />            
                                </Container>
                            </Slide>  
                        
                        </Grid>
                    </Container>
                </Grid>}
                </Grid>
                

    </>)
}

export default SingleCellDatasets;