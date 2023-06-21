import { gql, useQuery } from '@apollo/client';
import { CircularProgress, Grid, Tabs, Tab, ToggleButton, ToggleButtonGroup, Paper, FormHelperText } from '@mui/material';
import { Typography, Button, CustomizedTable, DataTable } from '@weng-lab/psychscreen-ui-components';
import { Chart, linearTransform, Scatter } from 'jubilant-carnival';
import { groupBy } from 'queryz';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import DotPlot, { DotPlotQueryResponse, DOT_PLOT_QUERY } from '../SingleCellPortal/DotPlot';
import { lower5, range, upper5 } from './GTexUMAP';
import { downloadSVGAsPNG } from '../../svgToPng';
import { downloadSVG } from './violin/utils';
import styled from "@emotion/styled";
import { StyledButton } from '../DiseaseTraitPortal/DiseaseTraitDetails';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as MUISelect } from "@mui/material";

const COLUMNS = [{
    header: "Cell Type",
    value: row => row.celltype
},{
    header: "Fraction Cells Non-Zero",
    value: row => row.pct,
    render: row => row.pct.toFixed(3)
},{
    header: "Average Expression",
    value: row => row.avgexp,
    render: row => row.avgexp.toFixed(3)
}]

export const StyledTab = styled(Tab)(() => ({
    textTransform: "none",
  }))
export type SingleCellGeneQueryItem = {
    sampleid: string;
    featureid: string;
    featurekey: string;
    val: number;
    barcodekey: string;
    n_genes: number;
    n_cells: number;
    n_counts: number;
    anno: string;
    channel: string;
    percent_cells: number;
    subclass: string;
    celltype: string;
};

export type SingleCellUMAPQueryItem = {
    subclass: string;
    barcodekey: string;
    umap_1: number;
    umap_2: number;
    celltype: string;
};

export type SingleCellUMAPQueryResponse = {
    singleCellUmapQuery: SingleCellUMAPQueryItem[];
};

export type SingleCellGeneQueryResponse = {
    singleCellGenesQuery: SingleCellGeneQueryItem[];
};

export const SINGLE_CELL_GENE_QUERY = gql`
query q($disease: String!, $featureKey: [String]) {
   singleCellGenesQuery(disease: $disease, featurekey: $featureKey) {
      sampleid
      featureid
      featurekey
      val
      barcodekey
      n_genes
      n_cells
      n_counts
      anno
      celltype
      channel
      subclass
      percent_cells
   }
}
`;

export const SINGLE_CELL_UMAP_QUERY = gql`
query q($disease: String!) {
   singleCellUmapQuery(disease: $disease) {
      subclass
      celltype
      barcodekey
      umap_1
      umap_2
   }
}
`;

function useSingleCellGeneData(dataset: string, gene: string) {
    return useQuery<SingleCellGeneQueryResponse>(SINGLE_CELL_GENE_QUERY, {
        variables: {
            disease: dataset,
            featureKey: gene
        }
    });
}

function useSingleCellUMAPData(dataset: string) {
    return useQuery<SingleCellUMAPQueryResponse>(SINGLE_CELL_UMAP_QUERY, {
        variables: {
            disease: dataset
        }
    });
}

function generateColors(n: number) {
    const colors: string[] = [];
    for (let i = 0; i < n; ++i)
        colors.push(`hsl(${(360 / n) * (n - i)}, 80%, 50%)`);
    return colors;
}

const celltypeColors = {
    ExcitatoryNeurons: "#E31A1C",
    InhibitoryNeurons: "#1F78B4",
    Astrocytes:"#33A02C",
    Oligodendrocytes:"#FF7F00",
    OPCs:"#FFD92F",
    Microglia:"#C7E9C0",
    Misc:"#B15928"
}

const subClassColors = {
    ["L2/3 IT"]:"#078d46",
["L4 IT"]:"#0073ab",
["L5 IT"]:"#fbdbe6",
["L6 IT"]:"#8ecda0",
["L6 IT Car3"]:"#ba9c66",
["L5 ET"]:"#d388b1",
["L5/6 NP"]:"#7b4c1e",
["L6b"]:"#004d45",
["L6 CT"]:"#29348c",
["Sst"]:"#6b6a64",
["Sst Chodl"]:"#bc2025",
["Pvalb"]:"#5066b0",
["Chandelier"]:"#64cce9",
["Lamp5 Lhx6"]:"#ae98a1",
["Lamp5"]:"#a1b6de",
["Sncg"]:"#f175aa",
["Vip"]:"#35bba0",
["Pax6"]:"#67be62",
["Astro"]:"#f5ed1f",
["Oligo"]:"#99994e",
["OPC"]:"#869c98",
["Micro"]:"#92575d",
["Endo"]:"#d490bf",
["VLMC"]:"#717c33",
["PC"]:"#29471f",
["SMC"]:"#413c42",
["Immune"]:"#f15c5a",
["RB"]:"#050304"
}

function useSingleCellData(dataset: string, gene: string, ctClass: string) {
    
    const { loading: expressionLoading, data: expressionData } = useSingleCellGeneData(dataset, gene);
    let f = expressionData && expressionData.singleCellGenesQuery.filter(e=>e.val>0)
    
    const { loading: UMAPLoading, data: UMAPData } = useSingleCellUMAPData(dataset);
    
    const maximumValue = Math.max(...(expressionData?.singleCellGenesQuery || [ { val: 0 }, { val: 1 } ]).map((x: { val: number }) => Math.log(x.val + 1)));
    const results = useMemo( () => {
        if (expressionLoading || UMAPLoading) return new Map<string, SingleCellGeneQueryItem & SingleCellUMAPQueryItem & { expressionColor: string }>([]);
        const UMAP_map = new Map(UMAPData?.singleCellUmapQuery.map(x => [ x.barcodekey, x ]) || []);
        const expression_map = new Map(expressionData?.singleCellGenesQuery.map(x => [ x.barcodekey, x ]) || []);
        const gradient = linearTransform({ start: 0, end: maximumValue }, { start: 215, end: 0 });
        return new Map<string, SingleCellGeneQueryItem & SingleCellUMAPQueryItem & { expressionColor: string }>([ ...UMAP_map.keys() ].filter(k => expression_map.get(k)).map(x => [
            x, {
                ...UMAP_map.get(x)!,
                ...expression_map.get(x)!,
                expressionColor: `rgb(255,${gradient(Math.log(expression_map.get(x)!.val + 1)).toFixed(0)},0)`
            }
        ]));
    }, [ expressionLoading, expressionData, UMAPData, UMAPLoading, maximumValue ]);
    const colors = useMemo( () => {
        const unique_celltypes = new Set([ ...results.values() ].map(x => ctClass==="by SubClass" ? x.subclass: x.celltype));
        
        const rcolors = generateColors(unique_celltypes.size);
        return new Map([ ...unique_celltypes ].map((x, i) => [ x,  ctClass==="by SubClass" ?  subClassColors[x]: celltypeColors[x] ]))
    }, [ results, ctClass ]);
    
    return { loading: expressionLoading || UMAPLoading, data: results, colors, maximumValue };
}

const DATASETS = [
    "SZBDMulti-Seq","UCLA-ASD"//,"IsoHuB","PTSDBrainomics","LIBD"
];


const SingleCell: React.FC<{ gene: string }> = ({ gene }) => {
    const [ dataset, setDataset ] = useState("SZBDMulti-Seq");
    const [ ctClass, setCtClass] = useState("by SubClass")
    const [ pct, setPct ] = useState<any>([]);
    const [ avgexp, setAvgexp ] = useState<any>([]);
    const { loading, data, colors, maximumValue } = useSingleCellData(dataset, gene, ctClass);
    const [ tooltip, setTooltip ] = useState(-1);
    const [ highlighted, setHighlighted ] = useState("");
    const [ colorScheme, setColorScheme ] = React.useState<string | null>('expression');


    useEffect(()=>{
        const categoryAvgexp  = ctClass==="by SubClass" ? `https://downloads.wenglab.org/psychscreen/${dataset}_avgexpression_bysubclass.txt`
         : `https://downloads.wenglab.org/psychscreen/${dataset}_avgexpression_bycelltype.txt`
         setAvgexp([])
        fetch(categoryAvgexp)
        .then(x => x.text())
        .then((x: string) => {
            const q = x.split("\n");
            const r =    q.filter(x => x !== "").filter(s=>{
                let f = s.split(",")
                return f[0] === gene

            }) 
            let e: any = []
            r.forEach(q=>{
                let y = q.split(",")
                
                if(ctClass==="by SubClass") {
                    //featurekey,Pvalb,Micro,Lamp5,L5/6 NP,Immune,Sst,L5 ET,L5 IT,Chandelier,L6 IT Car3,L4 IT,Lamp5 Lhx6,PC,
                    //Sncg,L6 IT,L2/3 IT,L6 CT,SMC,Sst Chodl,Astro,Oligo,Pax6,VLMC,Endo,Vip,OPC,L6b
                    e.push({
                        featurekey: y[0],
                        ["L2/3 IT"]: +y[1],
                        ["L4 IT"]: +y[2],
                        ["L5 IT"]: +y[3],
                        ["L6 IT"]: +y[4],
                        ["L6 IT Car3"]: +y[5],
                        ["L5 ET"]: +y[6],
                        ["L5/6 NP"]: +y[7],
                        ["L6b"]: +y[8],
                        ["L6 CT"]: +y[9],  
                        Sst: +y[10],
                        ["Sst Chodl"]: +y[11],  
                        Pvalb: +y[12],
                        Chandelier: +y[13],
                        ["Lamp5 Lhx6"]: +y[14],
                        Lamp5: +y[15] ,
                        ["Sncg"]: +y[16],
                        ["Vip"]: +y[17], 
                        ["Pax6"]: +y[18],   
                        ["Astro"]: +y[19],
                        ["Oligo"]: +y[20],
                        ["OPC"]: +y[21],
                        Micro: +y[22],
                        ["Endo"]: +y[23],
                        ["VLMC"]: +y[24],                        
                        ["PC"]: +y[25],  
                        ["SMC"]: +y[26],
                        Immune: +y[27],
                        RB: +y[28],
                    })

                } else {
                    e.push({
                        // ExcitatoryNeurons,OPCs,Astrocytes,Misc,Oligodendrocytes,Microglia,InhibitoryNeurons
                        featurekey: y[0],                        
                        ExcitatoryNeurons: +y[1],
                        InhibitoryNeurons: +y[2] ,
                        Astrocytes: +y[3] ,
                        Oligodendrocytes: +y[4],
                        OPCs: +y[5],
                        Microglia: +y[6],
                        Misc: +y[7]
                    })
                }
                
            })
            setAvgexp(e)
        })
           
    },[ctClass,gene,dataset])
    useEffect( () => {
        const categoryPct  = ctClass==="by SubClass" ? 
        `https://downloads.wenglab.org/psychscreen/${dataset}_percentexpressed_bysubclass.txt` : 
        `https://downloads.wenglab.org/psychscreen/${dataset}_percentexpressed_bycelltype.txt`        
        setPct([])        
        fetch(categoryPct)
        .then(x => x.text())
        .then((x: string) => {
            const q = x.split("\n");
            const r = q.filter(x => x !== "").filter(s=>{
                let f = s.split(",")
                return f[0] === gene

            }) 
            let e: any = []
            r.forEach(q=>{
                let y = q.split(",")
                
                if(ctClass==="by SubClass") {
                    //featurekey,Pvalb,Micro,Lamp5,L5/6 NP,Immune,Sst,L5 ET,L5 IT,Chandelier,L6 IT Car3,L4 IT,Lamp5 Lhx6,PC,
                    //Sncg,L6 IT,L2/3 IT,L6 CT,SMC,Sst Chodl,Astro,Oligo,Pax6,VLMC,Endo,Vip,OPC,L6b
                    e.push({
                        featurekey: y[0],
                        ["L2/3 IT"]: +y[1],
                        ["L4 IT"]: +y[2],
                        ["L5 IT"]: +y[3],
                        ["L6 IT"]: +y[4],
                        ["L6 IT Car3"]: +y[5],
                        ["L5 ET"]: +y[6],
                        ["L5/6 NP"]: +y[7],
                        ["L6b"]: +y[8],
                        ["L6 CT"]: +y[9],  
                        Sst: +y[10],
                        ["Sst Chodl"]: +y[11],  
                        Pvalb: +y[12],
                        Chandelier: +y[13],
                        ["Lamp5 Lhx6"]: +y[14],
                        Lamp5: +y[15] ,
                        ["Sncg"]: +y[16],
                        ["Vip"]: +y[17], 
                        ["Pax6"]: +y[18],   
                        ["Astro"]: +y[19],
                        ["Oligo"]: +y[20],
                        ["OPC"]: +y[21],
                        Micro: +y[22],
                        ["Endo"]: +y[23],
                        ["VLMC"]: +y[24],                        
                        ["PC"]: +y[25],  
                        ["SMC"]: +y[26],
                        Immune: +y[27],
                        RB: +y[28],
                    })

                } else {
                    e.push({
                        // ExcitatoryNeurons,OPCs,Astrocytes,Misc,Oligodendrocytes,Microglia,InhibitoryNeurons
                        featurekey: y[0],                        
                        ExcitatoryNeurons: +y[1],
                        InhibitoryNeurons: +y[2] ,
                        Astrocytes: +y[3] ,
                        Oligodendrocytes: +y[4],
                        OPCs: +y[5],
                        Microglia: +y[6],
                        Misc: +y[7],
                        
                    })
                }
                
            })
            setPct(e)
        })
    }, [ctClass,gene,dataset]);
    const rows = pct && avgexp && pct.length>0 && avgexp.length>0 ? Object.keys(pct[0]).filter(k=>k!=="featurekey").map(k=>{
              return { 
                        celltype: k,
                        pct: pct[0][k],
                        avgexp: avgexp[0][k]

    }}):[];
    /*const ddata = useQuery<DotPlotQueryResponse>(DOT_PLOT_QUERY, {
        variables: {
            disease: dataset,
            gene
        }
    });*/
    const dotplotData  = pct && avgexp && pct.length>0 && avgexp.length>0 ? { singleCellBoxPlotQuery : 
        Object.keys(pct[0]).filter(k=>k!=="featurekey").map(k=>{
            return {
                expr_frac: pct[0][k],
                mean_count: avgexp[0][k],
                disease: dataset,
                gene: gene,
                celltype: k
            }
        })
    }   : { singleCellBoxPlotQuery:  []}
    

    const points = useMemo( () => [ ...data.values() ].slice(6000).map(x => ({ 
        x: x.umap_1, y: x.umap_2, data:ctClass==="by SubClass"? x.subclass: x.celltype, val: Math.log(x.val+1), svgProps: {
        fill: colorScheme === "expression" ? x.expressionColor : colors.get(ctClass==="by SubClass"? x.subclass: x.celltype),
        fillOpacity: colorScheme === "expression" && x.val === 0 ? 0.1 : 0.6,
        r: 8,
        strokeWidth: ctClass==="by SubClass" ?  (x.subclass === highlighted ? 4 : 0) : (  x.celltype === highlighted ? 4 : 0),
        stroke: "#000000",
        strokeOpacity: 0.4
    } })), [ data, highlighted, colorScheme, colors, ctClass ]);
    /*const groupedVals = useMemo( () => {
        const groups = groupBy(points, x => x.data, x => x.val);
        return [ ...groups.keys() ].sort().map(x => [{
            header: "Cell Type",
            value: x
        }, {
            header: "Fraction Cells Non-Zero",
            value: groups.get(x)!.filter(x => x !== 0).length / groups.get(x)!.length,
            render: (groups.get(x)!.filter(x => x !== 0).length / groups.get(x)!.length).toFixed(3)
        }, {
            header: "Average Expression",
            value: groups.get(x)!.reduce((x, c) => x + c, 0) / groups.get(x)!.length,
            render: (groups.get(x)!.reduce((x, c) => x + c, 0) / groups.get(x)!.length).toFixed(3)
        }]).sort((a, b) => -(+a[2].value - +b[2].value));
    }, [ points ]);*/
    const domain = useMemo( () => points.length === 0 ? { x: { start: 0, end: 1 }, y: { start: 0, end: 1 } } : ({
        x: { start: lower5(Math.min(...points.map(x => x.x)) * 1.1), end: upper5(Math.max(...points.map(x => x.x))) },
        y: { start: lower5(Math.min(...points.map(x => x.y)) * 1.1), end: upper5(Math.max(...points.map(x => x.y))) }
    }), [ points ]);
    const [ tabIndex, setTabIndex ] = useState(0);
    const handleTabChange = (_: any, newTabIndex: number) => {
        setTabIndex(newTabIndex);
    };
    const chartRef = useRef<SVGSVGElement>(null);
    const dotPlotRef = useRef<SVGSVGElement>(null);
    const handleChange = (event) => {
        setDataset(event.target.value);
      };
    
    return (
        <Grid container>         
            
            <Grid item sm={12} md={12} lg={12} xl={12} style={{ marginBottom: "2em" }}>
            <Typography style={{ marginLeft: "1em", marginTop: "0.1em" }} type="body" size="large">Select Dataset:</Typography>
            
                {<FormControl sx={{ m: 1, minWidth: 400 }} style={{ marginLeft: "1em", marginTop: "1em" }}>
                    <InputLabel id="simple-select-helper-label">Dataset:</InputLabel>
                    <MUISelect
                    labelId="simple-select-helper-label"
                    id="simple-select-helper"
                    value={dataset}
                    label="Dataset"
                    onChange={handleChange}
                    >
                        {DATASETS.map(d=>{
                            return <MenuItem value={d}>{d}</MenuItem>
                        })}
                    </MUISelect>
                    
                </FormControl>}
               
            </Grid>
            <Grid item sm={12}>
                <Tabs value={tabIndex} onChange={handleTabChange}>
                    <StyledTab label="Detailed Expression Profile" />
                    <StyledTab label="Expression Summary" />
                    
                </Tabs>
            </Grid>
            { tabIndex === 1 ? (
                <Grid item sm={12}>

                    { (!dotplotData) ? <CircularProgress /> : (
                        <>
                        <br/>
                        <StyledButton btheme="light" bvariant={ctClass === "by SubClass" ? "filled": "outlined"} key={"by SubClass"} onClick={() => setCtClass("by SubClass")}>
                        by SubClass
                        </StyledButton>&nbsp;
                        {<StyledButton btheme="light" bvariant={ctClass === "by Celltype" ? "filled": "outlined"} key={"by Celltype"} onClick={() => setCtClass("by Celltype")}>
                        by Celltype
                        </StyledButton>}
                        <br/>
                        <br/>
                            <DotPlot
                                disease={dataset}
                                gene={gene}
                                dotplotData={dotplotData}
                                ref={dotPlotRef}
                            />
                            <Button
                                onClick={() => dotPlotRef?.current && downloadSVG(dotPlotRef, `${gene}-${dataset}-single-cell-dot-plot.svg`)}
                                btheme="dark"
                                bvariant='outlined'
                            >
                                Download
                            </Button>
                        </>
                    )}
                </Grid>
            ) : (
                <>
                
                    <Grid item sm={6} md={6} lg={6} xl={6}>
                        <>
                        <br/>
                        <StyledButton btheme="light" bvariant={ctClass === "by SubClass" ? "filled": "outlined"} key={"by SubClass"} onClick={() => setCtClass("by SubClass")}>
                        by SubClass
                        </StyledButton>&nbsp;
                        {<StyledButton btheme="light" bvariant={ctClass === "by Celltype" ? "filled": "outlined"} key={"by Celltype"} onClick={() => setCtClass("by Celltype")}>
                        by Celltype
                        </StyledButton>}
                        <br/>
                        <br/>
                        {  pct && avgexp && pct.length>0 && avgexp.length>0 ? (
                            <Paper elevation={0} style={{  maxHeight: 500, width: 550, overflow: 'auto'}}>
                                <DataTable
                                    columns={COLUMNS} rows={rows} itemsPerPage={30} searchable sortColumn={2}
                                    onRowMouseEnter={(row: any) => setHighlighted(row.celltype)}
                                    onRowMouseLeave={() => setHighlighted("")}
                                />
                            </Paper>

                        ) : <CircularProgress/>}
                        </>
                        
                    </Grid>
                    {<Grid item sm={6} md={6} lg={6} xl={6}>
                        <div style={{ marginLeft: "8em" }}>
                            <Typography style={{ marginLeft: "2em", marginBottom: "0.5em" }} type="body" size="large">Color Scheme: &nbsp;&nbsp;&nbsp;&nbsp;   Gene: {gene} </Typography>
                            <ToggleButtonGroup style={{ marginLeft: "2em" }} size={"small"} value={colorScheme} exclusive onChange={(_, x) => setColorScheme(x)}>
                                <ToggleButton value="expression">
                                Gene Expression
                                </ToggleButton>
                                <ToggleButton value="cluster">
                                    Cell Type Cluster
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </div>
                        <div style={{ marginLeft: "-2em", marginTop: "-3em" }}>
                            { loading ? <CircularProgress /> : (
                                <>
                                    <Chart
                                        key={dataset}
                                        marginFraction={0.28}
                                        innerSize={{ width: 2100, height: 2000 }}
                                        domain={domain}
                                        xAxisProps={{ ticks: range(domain.x.start, domain.x.end + 1, 5), title: 'UMAP-1' }}
                                        yAxisProps={{ ticks: range(domain.y.start, domain.y.end + 1, 5), title: 'UMAP-2' }}
                                        scatterData={[ points ]}
                                        ref={chartRef}
                                    >
                                        <Scatter
                                            data={points}
                                            onPointMouseOver={(i: number) => { setTooltip(i); setHighlighted(points[i]?.data); }}
                                            onPointMouseOut={() => { setTooltip(-1); setHighlighted(""); }}
                                        />
                                        <defs>
                                            <linearGradient id="scale" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stop-color="red" />
                                                <stop offset="100%" stop-color="#ffcd00" />
                                            </linearGradient>
                                        </defs>
                                        { tooltip > -1 && (
                                            <rect
                                                x={points[tooltip].x - points[tooltip].data.replace(/_/g, " ").length * 1}
                                                y={points[tooltip].y - 3 + 0.7}
                                                width={points[tooltip].data.replace(/_/g, " ").length * 1 * 2}
                                                height={3}
                                                stroke="#000000"
                                                strokeWidth={0.05}
                                                fill="#ffffff"
                                                fillOpacity={0.9}
                                            />
                                        )}
                                        { tooltip > -1 && (
                                            <text
                                                x={points[tooltip].x}
                                                y={points[tooltip].y - 4.2 - 0.1}
                                                fontSize={2}
                                                textAnchor="middle"
                                            >
                                                {points[tooltip].data.replace(/_/g, " ")}
                                            </text>
                                        )}
                                        { colorScheme === "expression" && (
                                            <rect
                                                x={upper5(Math.max(...points.map(x => x.x))) + 2}
                                                y={upper5(Math.max(...points.map(x => x.y))) - 2}
                                                width={1}
                                                height={upper5(Math.max(...points.map(x => x.y))) - lower5(Math.min(...points.map(x => x.y))) - 5}
                                                fill="url(#scale)"
                                            />
                                        )}
                                        { colorScheme === "expression" && (
                                            <text
                                                x={upper5(Math.max(...points.map(x => x.x))) + 1}
                                                y={(lower5(Math.min(...points.map(x => x.y))) + upper5(Math.max(...points.map(x => x.y)))) / 2 + 0.5}
                                                transform="rotate(-90)"
                                                fontSize={1.5}
                                                textAnchor="middle"
                                            >
                                                log 10 {gene} Expression
                                            </text>
                                        )}
                                        { colorScheme === "expression" && (
                                            <text
                                                x={upper5(Math.max(...points.map(x => x.x))) + 4}
                                                y={upper5(Math.max(...points.map(x => x.y))) - 2.5}
                                                fontSize={1.2}
                                            >
                                                {maximumValue.toFixed(1)}
                                            </text>
                                        )}
                                        { colorScheme === "expression" && (
                                            <text
                                                x={upper5(Math.max(...points.map(x => x.x))) + 4}
                                                y={lower5(Math.min(...points.map(x => x.y))) + 2.5}
                                                fontSize={1.2}
                                            >
                                                0.0
                                            </text>
                                        )}
                                    </Chart>
                                    <Button
                                        onClick={() => chartRef?.current && downloadSVGAsPNG(chartRef.current, `${gene}-${dataset}-single-cell-UMAP.png`)}
                                        btheme='dark'
                                        bvariant='filled'
                                        style={{ marginLeft: "150px", marginTop: "-100px" }}
                                    >
                                        Download
                                    </Button>
                                </>
                            )}
                        </div>
                    </Grid>}
                </>
            )}
        </Grid>
    );
};
export default SingleCell;
