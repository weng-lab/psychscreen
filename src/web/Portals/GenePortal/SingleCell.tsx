import { gql, useQuery } from "@apollo/client";
import {
  Box,
  CircularProgress,
  Tabs,
  ToggleButton,
  ToggleButtonGroup,
  Button,
  Stack,
  FormLabel,
  Typography,
  useMediaQuery } from "@mui/material";

import Grid from "@mui/material/Grid";
import { linearTransform } from "jubilant-carnival";
import { Point, ScatterPlot, DownloadPlotHandle } from "@weng-lab/visualization";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DotPlot from "../SingleCellPortal/DotPlot";
import { downloadSVG } from "./violin/utils";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Select as MUISelect, Tab } from "@mui/material";
import { Download } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import SingleCellExpressionTable from "./SingleCellExpressionTable";

// Band-aid: ScatterPlot's controls are absolutely positioned on the left of the container.
// The square plot uses min(width, height), so we keep height < width to ensure the controls
// don't overlap the plot. Measure the container width and cap height at width - CONTROLS_OFFSET.
const CONTROLS_OFFSET = 65;

type UMAPPointMetadata = {
  cluster: string;
  val: number;
};

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
  const theme = useTheme();
  const [dataset, setDataset] = useState(pedataset);
  const [ctClass, setCtClass] = useState("by Cell type");
  const { loading, data, colors, maximumValue } = useSingleCellData(
    dataset,
    gene,
    ctClass
  );
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

  const points: Point<UMAPPointMetadata>[] = useMemo(
    () =>
      [...data.values()].slice(6000).map((x) => {
        const cluster = ctClass === "by Cell type" ? x.subclass : x.celltype;
        const isHighlighted = cluster === highlighted;
        return {
          x: x.umap_1,
          y: x.umap_2,
          r: isHighlighted ? 6 : 4,
          color:
            colorScheme === "expression"
              ? x.expressionColor
              : colors.get(cluster),
          opacity: colorScheme === "expression" && x.val === 0 ? 0.1 : 0.6,
          stroke: isHighlighted ? "#000000" : undefined,
          metaData: { cluster, val: x.val },
        };
      }),
    [data, highlighted, colorScheme, colors, ctClass]
  );

  const [cttabIndex, setCtTabIndex] = useState(0);

  const handleCtTabChange = (_: any, newTabIndex: number) => {
    setCtTabIndex(newTabIndex);
  };

  const chartRef = useRef<DownloadPlotHandle>(null);
  const dotPlotRef = useRef<SVGSVGElement>(null);

  const plotContainerRef = useRef<HTMLDivElement>(null);
  const [plotContainerWidth, setPlotContainerWidth] = useState(0);
  useEffect(() => {
    const el = plotContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) =>
      setPlotContainerWidth(entry.contentRect.width)
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Match the table's height to the UMAP column (plot + legend + download row) so they end at the same line.
  // Uses callback refs (not useRef + useEffect([])) since these elements only mount once data resolves,
  // which happens after the initial render -- a one-time effect would miss the later mount.
  const [umapColumnHeight, setUmapColumnHeight] = useState(0);
  const umapColumnObserver = useRef<ResizeObserver | null>(null);
  const umapColumnRef = useCallback((el: HTMLDivElement | null) => {
    umapColumnObserver.current?.disconnect();
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setUmapColumnHeight(entry.contentRect.height));
    observer.observe(el);
    umapColumnObserver.current = observer;
  }, []);
  // Height (including margin) of the "By Cell Type"/"By Broader Cell Type" buttons sitting above the
  // table in its column, subtracted from umapColumnHeight so the table itself (not its column) ends
  // level with the UMAP column.
  const [tableHeaderHeight, setTableHeaderHeight] = useState(0);
  const tableHeaderObserver = useRef<ResizeObserver | null>(null);
  const tableHeaderRef = useCallback((el: HTMLDivElement | null) => {
    tableHeaderObserver.current?.disconnect();
    if (!el) return;
    const measure = () => setTableHeaderHeight(el.getBoundingClientRect().height + parseFloat(theme.spacing(1)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    tableHeaderObserver.current = observer;
  }, [theme]);
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));
  const handleChange = (event) => {
    setDataset(event.target.value);
  };
  let keys = Array.from(DATASETS.keys());

  return (
    <Grid container spacing={2} alignItems="flex-start">
      {selectDatasets && (
        <>
          <Grid size={12}>
            <Typography variant="body1" mb={1}>
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
          <Grid size={12}>
            <Typography variant="body1">
              {DATASETS.get(dataset)!.desc}
            </Typography>
          </Grid>
        </>
      )}
      <Grid size={12}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Detailed Expression Profile" />
          <Tab label="Expression Summary" />
        </Tabs>
      </Grid>
      {tabIndex === 1 ? (
        <Grid size={12} sx={{height: "600px"}}>
          {byCtDataLoading || byScDataLoading ? (
            <CircularProgress />
          ) : dotplotDataSc.length > 0 || dotplotDataCt.length > 0 ? (
            <>
              <Stack direction={"row"} spacing={1} mb={1}>
                <Button
                  variant={ctClass === "by Cell type" ? "contained" : "outlined"}
                  key={"by Cell type"}
                  onClick={() => setCtClass("by Cell type")}
                >
                  By Cell Type
                </Button>
                <Button
                  variant={ctClass === "by Broader Cell type" ? "contained" : "outlined"}
                  key={"by Broader Cell type"}
                  onClick={() => setCtClass("by Broader Cell type")}
                >
                  By Broader Cell Type
                </Button>
                <Button
                  variant={ctClass === "All Datasets" ? "contained" : "outlined"}
                  key={"All Datasets"}
                  onClick={() => setCtClass("All Datasets")}
                >
                  All Datasets
                </Button>
              </Stack>
              {ctClass === "All Datasets" ? (
                <>
                  <Tabs value={cttabIndex} onChange={handleCtTabChange}>
                    <Tab label="by Cell type" />
                    <Tab label="by Broader Cell type" />
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
              <Button
                startIcon={<Download />}
                onClick={() =>
                  dotPlotRef?.current &&
                  downloadSVG(
                    dotPlotRef,
                    `${gene}-${dataset}-single-cell-dot-plot.svg`
                  )
                }
                sx={{ textTransform: "none", ml: 1, alignSelf: "flex-end" }}
              >
                Download
              </Button>
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
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack direction="row" spacing={1} mb={1} ref={tableHeaderRef}>
                <Button
                  variant={ctClass === "by Cell type" ? "contained" : "outlined"}
                  key={"by Cell type"}
                  onClick={() => setCtClass("by Cell type")}
                >
                  By Cell Type
                </Button>
                <Button
                  variant={ctClass === "by Broader Cell type" ? "contained" : "outlined"}
                  key={"by Broader Cell type"}
                  onClick={() => setCtClass("by Broader Cell type")}
                >
                  By Broader Cell Type
                </Button>
              </Stack>
              {scrows && ctrows && ctrows.length > 0 && scrows.length > 0 ? (
                <SingleCellExpressionTable
                  rows={
                    ctClass === "by Cell type"
                      ? scrows
                          .filter((s) => s.celltype !== "RB")
                          .filter((e) => e.dataset === dataset)
                      : ctrows.filter((e) => e.dataset === dataset)
                  }
                  onRowMouseEnter={(row) => setHighlighted(row.celltype)}
                  onRowMouseLeave={() => setHighlighted("")}
                  height={
                    isMdUp && umapColumnHeight > 0
                      ? Math.max(umapColumnHeight - tableHeaderHeight, 0)
                      : undefined
                  }
                />
              ) : (
                <>{"Data Not available"}</>
              )}
            </Grid>
          )}
          {points && points.length > 0 ? (
            <Grid size={{ xs: 12, md: 7 }} ref={umapColumnRef}>
              <Stack direction="row" spacing={1}>
                <Box
                  ref={plotContainerRef}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    position: "relative",
                    height: 650,
                    ...(plotContainerWidth > 0 && {
                      maxHeight: plotContainerWidth - CONTROLS_OFFSET,
                    }),
                  }}
                >
                  <ScatterPlot
                    key={dataset}
                    pointData={points}
                    loading={loading}
                    groupPointsAnchor="cluster"
                    controlsHighlight={theme.palette.primary.main}
                    tooltipBody={(point) => (
                      <Typography>
                        {point.metaData?.cluster.replace(/_/g, " ")}
                      </Typography>
                    )}
                    leftAxisLabel="UMAP-1"
                    bottomAxisLabel="UMAP-2"
                    ref={chartRef}
                    downloadFileName={`${gene}-${dataset}-single-cell-UMAP.png`}
                  />
                </Box>
                {colorScheme === "expression" && (
                  <Stack alignItems="center" spacing={0.5}>
                    <Typography variant="caption">
                      {maximumValue.toFixed(1)}
                    </Typography>
                    <Box
                      sx={{
                        width: 14,
                        flex: 1,
                        borderRadius: 1,
                        background: "linear-gradient(to bottom, red, #ffcd00)",
                      }}
                    />
                    <Typography variant="caption">0.0</Typography>
                    <Typography variant="caption" sx={{ fontStyle: "italic" }}>
                      {gene}
                    </Typography>
                    <Typography variant="caption">Expression</Typography>
                  </Stack>
                )}
              </Stack>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <FormControl>
                  <FormLabel>UMAP Color Scheme:</FormLabel>
                  <ToggleButtonGroup
                    size={"small"}
                    value={colorScheme}
                    exclusive
                    onChange={(_, x) => setColorScheme(x)}
                    sx={{ textTransform: "none" }}
                  >
                    <ToggleButton
                      value="expression"
                      sx={{ textTransform: "none" }}
                    >
                      Gene Expression
                    </ToggleButton>
                    <ToggleButton
                      value="cluster"
                      sx={{ textTransform: "none" }}
                    >
                      Cell Type Cluster
                    </ToggleButton>
                  </ToggleButtonGroup>
                </FormControl>
                <Button
                  startIcon={<Download />}
                  onClick={() => chartRef.current?.downloadPNG()}
                  sx={{ textTransform: "none", ml: 1, alignSelf: "flex-end" }}
                >
                  Download
                </Button>
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
