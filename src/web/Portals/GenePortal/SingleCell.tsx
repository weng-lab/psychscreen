import { gql, useQuery } from '@apollo/client';
import { CircularProgress, Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Typography, Button, CustomizedTable } from '@zscreen/psychscreen-ui-components';
import { Chart, linearTransform, Scatter } from 'jubilant-carnival';
import { groupBy } from 'queryz';
import React, { useMemo, useState } from 'react';
import { lower5, range, upper5 } from './GTexUMAP';

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
};

export type SingleCellUMAPQueryItem = {
    subclass: string;
    barcodekey: string;
    umap_1: number;
    umap_2: number;
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

function useSingleCellData(dataset: string, gene: string) {
    const { loading: expressionLoading, data: expressionData } = useSingleCellGeneData(dataset, gene);
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
        const unique_celltypes = new Set([ ...results.values() ].map(x => x.subclass));
        const rcolors = generateColors(unique_celltypes.size);
        return new Map([ ...unique_celltypes ].map((x, i) => [ x, rcolors[i] ]))
    }, [ results ]);
    return { loading: expressionLoading || UMAPLoading, data: results, colors, maximumValue };
}

const DATASETS = [
    "DevBrain",
    "IsoHuB",
    "UCLA-ASD",
    "Urban-DLPFC"
];

const SingleCell: React.FC<{ gene: string }> = ({ gene }) => {
    const [ dataset, setDataset ] = useState("UCLA-ASD");
    const { loading, data, colors, maximumValue } = useSingleCellData(dataset, gene);
    const [ tooltip, setTooltip ] = useState(-1);
    const [ highlighted, setHighlighted ] = useState("");
    const [ colorScheme, setColorScheme ] = React.useState<string | null>('expression');
    const points = useMemo( () => [ ...data.values() ].slice(6000).map(x => ({ x: x.umap_1, y: x.umap_2, data: x.subclass, val: x.val, svgProps: {
        fill: colorScheme === "expression" ? x.expressionColor : colors.get(x.subclass),
        fillOpacity: colorScheme === "expression" && x.val === 0 ? 0.1 : 0.6,
        r: 8,
        strokeWidth: x.subclass === highlighted ? 4 : 0,
        stroke: "#000000",
        strokeOpacity: 0.4
    } })), [ data, highlighted, colorScheme ]);
    const groupedVals = useMemo( () => {
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
    }, [ points ]);
    const domain = useMemo( () => points.length === 0 ? { x: { start: 0, end: 1 }, y: { start: 0, end: 1 } } : ({
        x: { start: lower5(Math.min(...points.map(x => x.x)) * 1.1), end: upper5(Math.max(...points.map(x => x.x))) },
        y: { start: lower5(Math.min(...points.map(x => x.y)) * 1.1), end: upper5(Math.max(...points.map(x => x.y))) }
    }), [ points ]);
    return (
        <Grid container>
            <Grid item sm={12} md={12} lg={12} xl={12}>
                <Typography type="headline" size="small" style={{ marginBottom: "0.55em" }}>Select a Single Cell Dataset:</Typography>
                { DATASETS.map( d => (
                    <>
                        <Button btheme="light" bvariant={dataset === d ? "filled": "outlined"} key={d} onClick={() => setDataset(d)}>
                            {d}
                        </Button>&nbsp;
                    </>
                ))}
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={6}>
                { groupedVals.length > 0 && (
                    <CustomizedTable
                        style={{ width: "max-content" }}
                        tabledata={groupedVals}
                        onRowMouseOver={row => setHighlighted(row[0].value)}
                        onRowMouseOut={() => setHighlighted("")}
                    />
                )}
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={6}>
                <div style={{ marginLeft: "8em" }}>
                    <Typography style={{ marginLeft: "2em", marginBottom: "0.5em" }} type="body" size="large">Color Scheme:</Typography>
                    <ToggleButtonGroup style={{ marginLeft: "2em" }} size={"small"} value={colorScheme} exclusive onChange={(_, x) => setColorScheme(x)}>
                        <ToggleButton value="expression">
                            {gene} Expression
                        </ToggleButton>
                        <ToggleButton value="cluster">
                            Cell Type Cluster
                        </ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <div style={{ marginLeft: "-2em", marginTop: "-3em" }}>
                    { loading ? <CircularProgress /> : (
                        <Chart
                            key={dataset}
                            marginFraction={0.28}
                            innerSize={{ width: 2100, height: 2000 }}
                            domain={domain}
                            xAxisProps={{ ticks: range(domain.x.start, domain.x.end + 1, 5), title: 'UMAP-1' }}
                            yAxisProps={{ ticks: range(domain.y.start, domain.y.end + 1, 5), title: 'UMAP-2' }}
                            scatterData={[ points ]}
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
                                    {gene} Expression
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
                    )}
                </div>
            </Grid>
        </Grid>
    );
};
export default SingleCell;
