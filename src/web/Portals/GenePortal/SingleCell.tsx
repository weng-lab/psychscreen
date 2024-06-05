import { gql, useQuery } from "@apollo/client";
import {
  CircularProgress,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Button as MUIButton,
  Stack,
  FormLabel,
} from "@mui/material";

import Grid from '@mui/material/Unstable_Grid2'
import {
  Typography,
  Button,
  DataTable,
} from "@weng-lab/psychscreen-ui-components";
import { Chart, linearTransform, Scatter } from "jubilant-carnival";
import React, { useMemo, useRef, useState } from "react";
import DotPlot from "../SingleCellPortal/DotPlot";
import { lower5, range, upper5 } from "./GTexUMAP";
import { downloadSVGAsPNG } from "../../svgToPng";
import { downloadSVG } from "./violin/utils";
import { StyledButton } from "../../Portals/styles";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as MUISelect } from "@mui/material";
import { StyledTab } from "../../Portals/styles";
import { Download } from "@mui/icons-material";

const COLUMNS = [
  {
    header: "Cell Type",
    headerRender: () => {
      return <b>Cell Type</b>;
    },
    value: (row) => row.celltype,
  },
  {
    header: "Fraction Cells Non-Zero",
    headerRender: () => {
      return <b>Fraction Cells Non-Zero</b>;
    },
    value: (row) => row.pctexp,
    render: (row) => row.pctexp.toFixed(2),
  },
  {
    header: "Average Expression",
    headerRender: () => {
      return <b>Average Expression</b>;
    },
    value: (row) => row.avgexp,
    render: (row) => row.avgexp.toFixed(2),
  },
];

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

export type PedatasetValuesbyCelltypeResponse = {
  getPedatasetValuesbyCelltypeQuery: {
    dataset: string;
    gene: string;
    pctexp: number;
    avgexp: number;
    celltype: string;
  }[];
};

export type PedatasetValuesbySubclassResponse = {
  getPedatasetValuesbySubclassQuery: {
    dataset: string;
    gene: string;
    pctexp: number;
    avgexp: number;
    celltype: string;
  }[];
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

export const GET_PEDATASET_VALS_BYCT_QUERY = gql`
  query q($dataset: [String]!, $gene: String!) {
    getPedatasetValuesbyCelltypeQuery(dataset: $dataset, gene: $gene) {
      dataset
      gene
      avgexp
      celltype
      pctexp
    }
  }
`;

export const GET_PEDATASET_VALS_BYSC_QUERY = gql`
  query q($dataset: [String]!, $gene: String!) {
    getPedatasetValuesbySubclassQuery(dataset: $dataset, gene: $gene) {
      dataset
      gene
      avgexp
      celltype
      pctexp
    }
  }
`;

function useSingleCellGeneData(dataset: string, gene: string) {
  return useQuery<SingleCellGeneQueryResponse>(SINGLE_CELL_GENE_QUERY, {
    variables: {
      disease: dataset,
      featureKey: gene,
    },
  });
}

function useSingleCellUMAPData(dataset: string) {
  return useQuery<SingleCellUMAPQueryResponse>(SINGLE_CELL_UMAP_QUERY, {
    variables: {
      disease: dataset,
    },
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
  Astrocytes: "#33A02C",
  Oligodendrocytes: "#FF7F00",
  OPCs: "#FFD92F",
  Microglia: "#C7E9C0",
  Misc: "#B15928",
};

const subClassColors = {
  "L2/3 IT": "#078d46",
  "L4 IT": "#0073ab",
  "L5 IT": "#fbdbe6",
  "L6 IT": "#8ecda0",
  "L6 IT Car3": "#ba9c66",
  "L5 ET": "#d388b1",
  "L5/6 NP": "#7b4c1e",
  L6b: "#004d45",
  "L6 CT": "#29348c",
  Sst: "#6b6a64",
  "Sst Chodl": "#bc2025",
  Pvalb: "#5066b0",
  Chandelier: "#64cce9",
  "Lamp5 Lhx6": "#ae98a1",
  Lamp5: "#a1b6de",
  Sncg: "#f175aa",
  Vip: "#35bba0",
  Pax6: "#67be62",
  Astro: "#f5ed1f",
  Oligo: "#99994e",
  OPC: "#869c98",
  Micro: "#92575d",
  Endo: "#d490bf",
  VLMC: "#717c33",
  PC: "#29471f",
  SMC: "#413c42",
  Immune: "#f15c5a",
  RB: "#050304",
};

function useSingleCellData(dataset: string, gene: string, ctClass: string) {
  const { loading: expressionLoading, data: expressionData } =
    useSingleCellGeneData(dataset, gene);
  let f =
    expressionData &&
    expressionData.singleCellGenesQuery.filter((e) => e.val > 0);

  const { loading: UMAPLoading, data: UMAPData } =
    useSingleCellUMAPData(dataset);

  const maximumValue = Math.max(
    ...(expressionData?.singleCellGenesQuery || [{ val: 0 }, { val: 1 }]).map(
      (x: { val: number }) => x.val
    )
  );
  const results = useMemo(() => {
    if (expressionLoading || UMAPLoading)
      return new Map<
        string,
        SingleCellGeneQueryItem &
          SingleCellUMAPQueryItem & { expressionColor: string }
      >([]);
    const UMAP_map = new Map(
      UMAPData?.singleCellUmapQuery.map((x) => [x.barcodekey, x]) || []
    );
    const expression_map = new Map(
      expressionData?.singleCellGenesQuery.map((x) => [x.barcodekey, x]) || []
    );
    const gradient = linearTransform(
      { start: 0, end: maximumValue },
      { start: 215, end: 0 }
    );
    return new Map<
      string,
      SingleCellGeneQueryItem &
        SingleCellUMAPQueryItem & { expressionColor: string }
    >(
      [...UMAP_map.keys()]
        .filter((k) => expression_map.get(k))
        .map((x) => [
          x,
          {
            ...UMAP_map.get(x)!,
            ...expression_map.get(x)!,
            expressionColor: `rgb(255,${gradient(
              expression_map.get(x)!.val
            ).toFixed(0)},0)`,
          },
        ])
    );
  }, [expressionLoading, expressionData, UMAPData, UMAPLoading, maximumValue]);
  const colors = useMemo(() => {
    const unique_celltypes = new Set(
      [...results.values()].map((x) =>
        ctClass === "by Cell type" ? x.subclass : x.celltype
      )
    );

    const rcolors = generateColors(unique_celltypes.size);
    return new Map(
      [...unique_celltypes].map((x, i) => [
        x,
        ctClass === "by Cell type" ? subClassColors[x] : celltypeColors[x],
      ])
    );
  }, [results, ctClass]);

  return {
    loading: expressionLoading || UMAPLoading,
    data: results,
    colors,
    maximumValue,
  };
}

export const DATASETS: Map<
  string,
  { cohort: string; desc: string; shortdesc: string }
> = new Map([
  [
    "CMC",
    {
      cohort: "CMC",
      shortdesc: "SCZ/control (n=100)",
      desc: "Schizophrenia (n=47) and control (n=53) adult DLPFC samples with snRNA-Seq data",
    },
  ],
  [
    "UCLA-ASD",
    {
      cohort: "UCLA-ASD",
      shortdesc: "ASD/control (n=52)",
      desc: "Autism (n=27) and control (n=25) adult DLPFC samples with snRNA-Seq and snATAC-Seq data",
    },
  ],
  [
    "SZBDMulti-Seq",
    {
      cohort: "SZBDMulti-Seq",
      shortdesc: "SCZ/BPD/control (n=72)",
      desc: "Schizophrenia, bipolar disorder, and control (n=24 each) adult DLPFC samples with snRNA-Seq data",
    },
  ],
  [
    "MultiomeBrain-DLPFC",
    {
      cohort: "MultiomeBrain-DLPFC",
      shortdesc: "SCZ/BPD/control (n=21)",
      desc: "Schizophrenia (n=6), bipolar disorder (n=10), and control (n=5) adult DLPFC samples with snMultiome data",
    },
  ],
  [
    "DevBrain-snRNAseq",
    {
      cohort: "DevBrain-snRNAseq",
      shortdesc: "ASD/Williams/control (n=16)",
      desc: "Autism (n=9), Williams syndrome (n=3), and control (n=4) adult DLPFC samples with snRNA-Seq data",
    },
  ],
  [
    "IsoHuB",
    {
      cohort: "IsoHuB",
      shortdesc: "Control (n=4)",
      desc: "Four control adult DLPFC samples with short and long-read snRNA-Seq data",
    },
  ],
  [
    "PTSDBrainomics",
    {
      cohort: "PTSDBrainomics",
      shortdesc: "PTSD/MDD/control (n=19)",
      desc: "PTSD (n=6), MDD (n=4), and control (n=9) adult DLPFC samples with snRNA-Seq data",
    },
  ],
  [
    "LIBD",
    {
      cohort: "LIBD",
      shortdesc: "Control (n=10)",
      desc: "Ten control adult DLPFC samples with snRNA-Seq and spatial transcriptomics data",
    },
  ],
]);

const SingleCell: React.FC<{
  gene: string;
  pedataset: string;
  selectDatasets: boolean;
}> = ({ gene, pedataset, selectDatasets }) => {
  const [dataset, setDataset] = useState(pedataset);
  const [ctClass, setCtClass] = useState("by Cell type");
  const { loading, data, colors, maximumValue } = useSingleCellData(
    dataset,
    gene,
    ctClass
  );
  const [tooltip, setTooltip] = useState(-1);
  const [highlighted, setHighlighted] = useState("");
  const [colorScheme, setColorScheme] = React.useState<string | null>(
    "expression"
  );
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (_: any, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };
  const { loading: byCtDataLoading, data: byCtData } =
    useQuery<PedatasetValuesbyCelltypeResponse>(GET_PEDATASET_VALS_BYCT_QUERY, {
      variables: {
        dataset: [...DATASETS.keys()],
        gene: gene,
      },
    });
  const { loading: byScDataLoading, data: byScData } =
    useQuery<PedatasetValuesbySubclassResponse>(GET_PEDATASET_VALS_BYSC_QUERY, {
      variables: {
        dataset: [...DATASETS.keys()],
        gene: gene,
      },
    });
  const ctrows =
    !byCtDataLoading && byCtData
      ? byCtData.getPedatasetValuesbyCelltypeQuery
      : [];

  const scrows =
    !byScDataLoading && byScData
      ? byScData.getPedatasetValuesbySubclassQuery
      : [];

  const dotplotDataCt =
    !byCtDataLoading && byCtData
      ? ctrows.map((k) => {
          return {
            expr_frac: k.pctexp,
            mean_count: k.avgexp,
            dataset: k.dataset,
            gene: gene,
            celltype: k.celltype,
          };
        })
      : [];

  const dotplotDataSc =
    !byScDataLoading && byScData
      ? scrows
          .filter((s) => s.celltype !== "RB")
          .map((k) => {
            return {
              expr_frac: k.pctexp,
              mean_count: k.avgexp,
              dataset: k.dataset,
              gene: gene,
              celltype: k.celltype,
            };
          })
      : [];

  const points = useMemo(
    () =>
      [...data.values()].slice(6000).map((x) => ({
        x: x.umap_1,
        y: x.umap_2,
        data: ctClass === "by Cell type" ? x.subclass : x.celltype,
        val: x.val,
        svgProps: {
          fill:
            colorScheme === "expression"
              ? x.expressionColor
              : colors.get(ctClass === "by Cell type" ? x.subclass : x.celltype),
          fillOpacity: colorScheme === "expression" && x.val === 0 ? 0.1 : 0.6,
          r: 8,
          strokeWidth:
            ctClass === "by Cell type"
              ? x.subclass === highlighted
                ? 4
                : 0
              : x.celltype === highlighted
              ? 4
              : 0,
          stroke: "#000000",
          strokeOpacity: 0.4,
        },
      })),
    [data, highlighted, colorScheme, colors, ctClass]
  );
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

  const domain = useMemo(
    () =>
      points.length === 0
        ? { x: { start: 0, end: 1 }, y: { start: 0, end: 1 } }
        : {
            x: {
              start: lower5(Math.min(...points.map((x) => x.x)) * 1.1),
              end: upper5(Math.max(...points.map((x) => x.x))),
            },
            y: {
              start: lower5(Math.min(...points.map((x) => x.y)) * 1.1),
              end: upper5(Math.max(...points.map((x) => x.y))),
            },
          },
    [points]
  );
  const [cttabIndex, setCtTabIndex] = useState(0);

  const handleCtTabChange = (_: any, newTabIndex: number) => {
    setCtTabIndex(newTabIndex);
  };

  const chartRef = useRef<SVGSVGElement>(null);
  const dotPlotRef = useRef<SVGSVGElement>(null);
  const handleChange = (event) => {
    setDataset(event.target.value);
  };
  let keys = Array.from(DATASETS.keys());

  return (
    <Grid container spacing={2}>
      {selectDatasets && (
        <>
          <Grid
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            <Typography type="body" size="large" mb={1}>
              Select PsychENCODE Dataset:
            </Typography>
            {
              <FormControl>
                <InputLabel id="simple-select-helper-label">
                  Dataset:
                </InputLabel>
                <MUISelect
                  labelId="simple-select-helper-label"
                  id="simple-select-helper"
                  value={dataset}
                  label="Dataset"
                  onChange={handleChange}
                >
                  {keys.map((d) => {
                    return (
                      <MenuItem value={DATASETS.get(d)!.cohort}>
                        {d}
                        {" - "}
                        {DATASETS.get(d)!.shortdesc}
                      </MenuItem>
                    );
                  })}
                </MUISelect>
              </FormControl>
            }
          </Grid>
          <Grid
            sm={12}
            md={12}
            lg={12}
            xl={12}
          >
            <Typography
              type="body"
              size="large"
            >
              {DATASETS.get(dataset)!.desc}
            </Typography>
          </Grid>
        </>
      )}
      <Grid xs={12}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <StyledTab label="Detailed Expression Profile" />
          <StyledTab label="Expression Summary" />
        </Tabs>
      </Grid>
      {tabIndex === 1 ? (
        <Grid xs={12}>
          {byCtDataLoading || byScDataLoading ? (
            <CircularProgress />
          ) : dotplotDataSc.length > 0 || dotplotDataCt.length > 0 ? (
            <>
              <Stack direction={"row"} spacing={1} mb={1}>
                <StyledButton
                  btheme="light"
                  bvariant={ctClass === "by Cell type" ? "filled" : "outlined"}
                  key={"by Cell type"}
                  onClick={() => setCtClass("by Cell type")}
                >
                  By Cell Type
                </StyledButton>
                <StyledButton
                  btheme="light"
                  bvariant={ctClass === "by Broader Cell type" ? "filled" : "outlined"}
                  key={"by Broader Cell type"}
                  onClick={() => setCtClass("by Broader Cell type")}
                >
                  By Broader Cell Type
                </StyledButton>
                <StyledButton
                  btheme="light"
                  bvariant={ctClass === "All Datasets" ? "filled" : "outlined"}
                  key={"All Datasets"}
                  onClick={() => setCtClass("All Datasets")}
                >
                  All Datasets
                </StyledButton>
              </Stack>
              {ctClass === "All Datasets" ? (
                <>
                  <Tabs value={cttabIndex} onChange={handleCtTabChange}>
                    <StyledTab label="by Cell type" />
                    <StyledTab label="by Broader Cell type" />
                  </Tabs>
                  <DotPlot
                    disease={dataset}
                    yaxistitle={gene}
                    dotplotData={
                      cttabIndex === 0 ? dotplotDataSc : dotplotDataCt
                    }
                    ref={dotPlotRef}
                  />
                </>
              ) : (
                <DotPlot
                  disease={dataset}
                  yaxistitle={gene}
                  dotplotData={
                    ctClass === "by Cell type"
                      ? dotplotDataSc.filter((d) => d.dataset === dataset)
                      : dotplotDataCt.filter((d) => d.dataset === dataset)
                  }
                  ref={dotPlotRef}
                />
              )}
              <MUIButton
                startIcon={<Download />}
                onClick={() =>
                  dotPlotRef?.current &&
                  downloadSVG(
                    dotPlotRef,
                    `${gene}-${dataset}-single-cell-dot-plot.svg`
                  )
                }
                sx={{ textTransform: 'none', ml: 1, alignSelf: 'flex-end' }}
              >
                Download
              </MUIButton>
            </>
          ) : (
            <>{"Data Not available"}</>
          )}
        </Grid>
      ) : (
        <>
          {byCtDataLoading || byScDataLoading ? (
            <CircularProgress />
          ) : (
            <Grid xs={12} md={5}>
              <Stack direction="row" spacing={1} mb={1}>
                <StyledButton
                  btheme="light"
                  bvariant={ctClass === "by Cell type" ? "filled" : "outlined"}
                  key={"by Cell type"}
                  onClick={() => setCtClass("by Cell type")}
                >
                  By Cell Type
                </StyledButton>
                <StyledButton
                  btheme="light"
                  bvariant={ctClass === "by Broader Cell type" ? "filled" : "outlined"}
                  key={"by Broader Cell type"}
                  onClick={() => setCtClass("by Broader Cell type")}
                >
                  By Broader Cell Type
                </StyledButton>
              </Stack>
                {scrows && ctrows && ctrows.length > 0 && scrows.length > 0 ? (
                    <DataTable
                      columns={COLUMNS}
                      rows={
                        ctClass === "by Cell type"
                          ? scrows
                              .filter((s) => s.celltype !== "RB")
                              .filter((e) => e.dataset === dataset)
                          : ctrows.filter((e) => e.dataset === dataset)
                      }
                      itemsPerPage={10}
                      searchable
                      sortColumn={2}
                      onRowMouseEnter={(row: any) =>
                        setHighlighted(row.celltype)
                      }
                      onRowMouseLeave={() => setHighlighted("")}
                    />
                ) : (
                  <>{"Data Not available"}</>
                )}
            </Grid>
          )}
          {points && points.length > 0 ? (
            <Grid xs={12} md={7}>
              <div>
                {loading ? (
                  <CircularProgress />
                ) : (
                    <Chart
                      key={dataset}
                      marginFraction={0.24}
                      innerSize={{ width: 2000, height: 2000 }}
                      domain={domain}
                      xAxisProps={{
                        ticks: range(domain.x.start, domain.x.end + 1, 5),
                        title: "UMAP-2",
                      }}
                      yAxisProps={{
                        ticks: range(domain.y.start, domain.y.end + 1, 5),
                        title: "UMAP-1",
                      }}
                      scatterData={[points]}
                      ref={chartRef}
                    >
                      <Scatter
                        data={points}
                        onPointMouseOver={(i: number) => {
                          setTooltip(i);
                          setHighlighted(points[i]?.data);
                        }}
                        onPointMouseOut={() => {
                          setTooltip(-1);
                          setHighlighted("");
                        }}
                      />
                      <defs>
                        <linearGradient id="scale" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0%" stop-color="red" />
                          <stop offset="100%" stop-color="#ffcd00" />
                        </linearGradient>
                      </defs>
                      {tooltip > -1 && (
                        <rect
                          x={
                            points[tooltip].x -
                            points[tooltip].data.replace(/_/g, " ").length * 1
                          }
                          y={points[tooltip].y - 3 + 0.7}
                          width={
                            points[tooltip].data.replace(/_/g, " ").length *
                            1 *
                            2
                          }
                          height={3}
                          stroke="#000000"
                          strokeWidth={0.05}
                          fill="#ffffff"
                          fillOpacity={0.9}
                        />
                      )}
                      {tooltip > -1 && (
                        <text
                          x={points[tooltip].x}
                          y={points[tooltip].y - 4.2 - 0.1}
                          fontSize={2}
                          textAnchor="middle"
                        >
                          {points[tooltip].data.replace(/_/g, " ")}
                        </text>
                      )}
                      {colorScheme === "expression" && (
                        <rect
                          x={upper5(Math.max(...points.map((x) => x.x))) + 2}
                          y={upper5(Math.max(...points.map((x) => x.y))) - 2}
                          width={1}
                          height={
                            upper5(Math.max(...points.map((x) => x.y))) -
                            lower5(Math.min(...points.map((x) => x.y))) -
                            5
                          }
                          fill="url(#scale)"
                        />
                      )}
                      {colorScheme === "expression" && (
                        <text
                          x={upper5(Math.max(...points.map((x) => x.x))) + 1}
                          y={
                            (lower5(Math.min(...points.map((x) => x.y))) +
                              upper5(Math.max(...points.map((x) => x.y)))) /
                              2 +
                            0.5
                          }
                          transform="rotate(-90)"
                          fontSize={1.5}
                          textAnchor="middle"
                        >
                          <tspan fontStyle="italic">{gene}</tspan>{"  "} Expression
                          
                        </text>
                      )}
                      {colorScheme === "expression" && (
                        <text
                          x={upper5(Math.max(...points.map((x) => x.x))) + 4}
                          y={upper5(Math.max(...points.map((x) => x.y))) - 2.5}
                          fontSize={1.2}
                        >
                          {maximumValue.toFixed(1)}
                        </text>
                      )}
                      {colorScheme === "expression" && (
                        <text
                          x={upper5(Math.max(...points.map((x) => x.x))) + 4}
                          y={lower5(Math.min(...points.map((x) => x.y))) + 2.5}
                          fontSize={1.2}
                        >
                          0.0
                        </text>
                      )}
                    </Chart>
                )}
              </div>
              <div style={{display: 'flex', justifyContent: 'center'}}>
                <FormControl>
                  <FormLabel>UMAP Color Scheme:</FormLabel>
                  <ToggleButtonGroup
                    size={"small"}
                    value={colorScheme}
                    exclusive
                    onChange={(_, x) => setColorScheme(x)}
                    sx={{ textTransform: 'none' }}
                  >
                    <ToggleButton value="expression" sx={{ textTransform: 'none' }}>Gene Expression</ToggleButton>
                    <ToggleButton value="cluster" sx={{ textTransform: 'none' }}>Cell Type Cluster</ToggleButton>
                    
                  </ToggleButtonGroup>
                </FormControl>
                <MUIButton
                  startIcon={<Download />}
                  onClick={() =>
                    chartRef?.current &&
                    downloadSVGAsPNG(
                      chartRef.current,
                      `${gene}-${dataset}-single-cell-UMAP.png`
                    )
                  }
                  sx={{ textTransform: 'none', ml: 1, alignSelf: 'flex-end' }}
                >
                  Download
                </MUIButton>
              </div>
            </Grid>
          ) : (
            <></>
          )}
        </>
      )}
    </Grid>
  );
};
export default SingleCell;
