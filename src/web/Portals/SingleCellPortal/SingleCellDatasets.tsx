import React, { useState, useCallback, useMemo, useEffect } from "react";
import { ValuedPoint } from "umms-gb/dist/utils/types";
import { RequestError } from "umms-gb/dist/components/tracks/trackset/types";
import { Box, GridProps, Tabs } from "@mui/material";
import {
  Typography,
  HorizontalCard,
  Button,
} from "@weng-lab/psychscreen-ui-components";
import { useParams, useNavigate } from "react-router-dom";
import { Container, Slide } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import DownloadIcon from "@mui/icons-material/Download";
import { EmptyTrack, DenseBigBed } from "umms-gb";
import { gql, useQuery } from "@apollo/client";
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import { DataTable } from "@weng-lab/ts-ztable";
import { SingleCellBrowser } from "./SingleCellBrowser";
import { DegExpression } from "../GenePortal/DegExpression";
import { GeneAutoComplete } from "../GenePortal/GeneAutocomplete";
import { StyledTab, StyledButton } from "../../Portals/styles";

export const cellTypeCards = [
  { val: "Ast", cardLabel: "Astrocytes", cardDesc: "" },
  { val: "Chandelier", cardLabel: "Chandelier", cardDesc: "" },
  { val: "End", cardLabel: "Endothelial cells", cardDesc: "" },
  { val: "Immune", cardLabel: "Immune Cells", cardDesc: "" },
  { val: "VLMC", cardLabel: "Vascular Leptomeningeal Cells", cardDesc: "" },
  { val: "Sncg", cardLabel: "Sncg", cardDesc: "" },
  { val: "Vip", cardLabel: "Vip", cardDesc: "" },
  { val: "Sst", cardLabel: "Sst", cardDesc: "" },
  { val: "Pvalb", cardLabel: "Pvalb", cardDesc: "" },
  { val: "Pax6", cardLabel: "Pax6", cardDesc: "" },
  { val: "Oli", cardLabel: "Oligodendrocytes", cardDesc: "" },
  { val: "OPC", cardLabel: "Oligodendrocyte Precursor Cells", cardDesc: "" },
  { val: "Mic", cardLabel: "Microglia", cardDesc: "" },
  { val: "Lamp5.Lhx6", cardLabel: "Lamp5.Lhx6", cardDesc: "" },
  { val: "Lamp5", cardLabel: "Lamp5", cardDesc: "" },
  { val: "L6b", cardLabel: "L6b", cardDesc: "" },
  {
    val: "L6.IT",
    cardLabel: "Layer 6 Intratelencephalic projecting",
    cardDesc: "",
  },
  {
    val: "L6.IT.Car3",
    cardLabel: "Layer 6 Intratelencephalic projecting Car3",
    cardDesc: "",
  },
  {
    val: "L6.CT",
    cardLabel: "Layer 6 Corticothalamic projecting",
    cardDesc: "",
  },
  {
    val: "L5.IT",
    cardLabel: "Layer 5 Intratelencephalic projecting",
    cardDesc: "",
  },
  {
    val: "L5.ET",
    cardLabel: "Layer 5 Extratelencephalic projecting",
    cardDesc: "",
  },
  { val: "L5.6.NP", cardLabel: "Layer 5/6 Near projecting", cardDesc: "" },
  {
    val: "L4.IT",
    cardLabel: "Layer 4 Intratelencephalic projecting",
    cardDesc: "",
  },
  {
    val: "L2.3.IT",
    cardLabel: "Layer 2/3 Intratelencephalic projecting",
    cardDesc: "",
  },
];

export const degCards = [
  { val: "ASD", cardLabel: "ASD", cardDesc: "" },
  { val: "Age", cardLabel: "Aging", cardDesc: "" },
  { val: "Bipolar_Disorder", cardLabel: "Bipolar", cardDesc: "" },
  { val: "Schizophrenia", cardLabel: "Schizophrenia", cardDesc: "" },
];

export const qtlcellTypeCards = [
  { val: "Astro", cardLabel: "Astrocytes", cardDesc: "" },
  { val: "Chandelier__Pvalb", cardLabel: "Chandelier", cardDesc: "" },
  //{val: "Endo__VLMC", cardLabel: "Endothelial cells", cardDesc: ""},
  // {val: "Immune", cardLabel: "Immune Cells", cardDesc: ""},
  //  { val: "SMC", cardLabel: "Smooth Muscle Cells", cardDesc: ""},
  //{val: "Sncg", cardLabel: "Sncg", cardDesc: ""},
  { val: "Vip", cardLabel: "Vip", cardDesc: "" },
  { val: "Sst__Sst.Chodl", cardLabel: "Sst", cardDesc: "" },
  { val: "PC", cardLabel: "Pericytes", cardDesc: "" },
  //  {val: "Pax6", cardLabel: "Pax6", cardDesc: ""},
  { val: "Oligo", cardLabel: "Oligodendrocytes", cardDesc: "" },
  { val: "OPC", cardLabel: "Oligodendrocyte Precursor Cells", cardDesc: "" },
  { val: "	Micro.PVM", cardLabel: "Microglia", cardDesc: "" },
  { val: "Lamp5", cardLabel: "Lamp5", cardDesc: "" },
  { val: "Lamp5.Lhx6", cardLabel: "Lamp5.Lhx6", cardDesc: "" },
  { val: "	L6b", cardLabel: "L6b", cardDesc: "" },
  {
    val: "L6.IT",
    cardLabel: "Layer 6 Intratelencephalic projecting",
    cardDesc: "",
  },
  //  {val: "L6.IT.Car3", cardLabel: "Layer 6 Intratelencephalic projecting Car3", cardDesc: ""},
  {
    val: "L6.CT",
    cardLabel: "Layer 6 Corticothalamic projecting",
    cardDesc: "",
  },
  {
    val: "L5.IT",
    cardLabel: "Layer 5 Intratelencephalic projecting",
    cardDesc: "",
  },
  //  { val: "L5.ET", cardLabel: "Layer 5 Extratelencephalic projecting", cardDesc: ""},
  { val: "L5.6.NP", cardLabel: "Layer 5/6 Near projecting", cardDesc: "" },
  {
    val: "L4.IT",
    cardLabel: "Layer 4 Intratelencephalic projecting",
    cardDesc: "",
  },
  {
    val: "L2.3.IT",
    cardLabel: "Layer 2/3 Intratelencephalic projecting",
    cardDesc: "",
  },
];

export const DISEASE_CARDS = [
  {
    val: "DevBrain",
    cardLabel: "DevBrain",
    cardDesc:
      "Autism (n=9), Williams syndrome (n=3), and control (n=4) adult DLPFC samples with snRNA-Seq data",
  },
  {
    val: "IsoHuB",
    cardLabel: "IsoHuB",
    cardDesc:
      "Four control adult DLPFC samples with short and long-read snRNA-Seq data",
  },
  {
    val: "SZBDMulti-Seq",
    cardLabel: "SZBDMulti-Seq",
    cardDesc:
      "Schizophrenia, bipolar disorder, and control (n=24 each) adult DLPFC samples with snRNA-Seq data",
  },
  {
    val: "MultiomeBrain-DLPFC",
    cardLabel: "MultiomeBrain-DLPFC",
    cardDesc:
      "Schizophrenia (n=6), bipolar disorder (n=10), and control (n=5) adult DLPFC samples with snMultiome data",
  },
  {
    val: "CMC",
    cardLabel: "CMC",
    cardDesc:
      "Schizophrenia (n=47) and control (n=53) adult DLPFC samples with snRNA-Seq data",
  },
  {
    val: "UCLA-ASD",
    cardLabel: "UCLA-ASD",
    cardDesc:
      "Autism (n=27) and control (n=25) adult DLPFC samples with snRNA-Seq and snATAC-Seq data",
  },
  {
    val: "LIBD",
    cardLabel: "LIBD",
    cardDesc:
      "Ten control adult DLPFC samples with snRNA-Seq and spatial transcriptomics data",
  },
  {
    val: "PTSDBrainomics",
    cardLabel: "PTSDBrainomics",
    cardDesc:
      "PTSD (n=6), MDD (n=4), and control (n=9) adult DLPFC samples with snRNA-Seq data",
  },
];

type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};

export const BIG_QUERY = gql`
  query BigRequests($bigRequests: [BigRequest!]!) {
    bigRequests(requests: $bigRequests) {
      data
      error {
        errortype
        message
      }
    }
  }
`;

export type BigResponseData =
  | BigWigData[]
  | BigBedData[]
  | BigZoomData[]
  | ValuedPoint[];

export type BigResponse = {
  data: BigResponseData;
  error: RequestError;
};

export type BigQueryResponse = {
  bigRequests: BigResponse[];
};

const peaks = [
  [
    "Astrocytes",
    "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/ATAC_Seq/merged_peaks_Astro.bigbed",
  ],
  [
    "Endo",
    "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/ATAC_Seq/merged_peaks_Endo.bigbed",
  ],
  [
    "OPC",
    "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/ATAC_Seq/merged_peaks_OPC.bigbed",
  ],
  [
    "Exc",
    "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/ATAC_Seq/merged_peaks_Exc.bigbed",
  ],
  [
    "Oligo",
    "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/ATAC_Seq/merged_peaks_Oligo.bigbed",
  ],
  [
    "Inh",
    "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/ATAC_Seq/merged_peaks_Inh.bigbed",
  ],
  [
    "Micro",
    "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/ATAC_Seq/merged_peaks_Micro.bigbed",
  ],
  [
    "All Types",
    "http://warehouse.gersteinlab.org/data/Psychscreen_tracks/ATAC_Seq/merged_peaks_all_types.bigbed",
  ],
];

const COLUMNS = [
  {
    header: "Cell Type",
    value: (row) => row.name,
  },
  {
    header: "Download",
    value: (row) => row.url,
    render: (row) => (
      <a href={row.url} download style={{ textDecoration: "none" }}>
        <Button bvariant="filled" btheme="light">
          <DownloadIcon />
        </Button>
      </a>
    ),
  },
];

const SingleCellDatasets: React.FC<GridProps> = (props) => {
  const navigate = useNavigate();
  const [tabIndex, setTabIndex] = useState(0);
  const { disease } = useParams();
  const [gene, setGene] = useState("SNX31");

  const [page, setPage] = useState<number>(-1);
  const [grnpage, setGrnPage] = useState<number>(-1);
  const [qtlpage, setQtlPage] = useState<number>(-1);
  const svgRef = React.useRef<SVGSVGElement>(null);
  const [coordinates, setCoordinates] = useState<GenomicRange>({
    chromosome: "chr11",
    start: 6192271,
    end: 6680547,
  });
  const handleTabChange = (_: any, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };
  const onDomainChanged = useCallback((d: GenomicRange) => {
    const chr =
      d.chromosome === undefined ? coordinates.chromosome : d.chromosome;
    if (Math.round(d.end) - Math.round(d.start) > 10) {
      setCoordinates({
        chromosome: chr,
        start: Math.round(d.start),
        end: Math.round(d.end),
      });
    }
  }, []);

  let d = [
    ["Astro", "Astrocytes"],
    ["Endo", "Endothelial Cells"],
    ["OPC", "Oligodendrocyte Precursor Cells"],
    ["Exc", "Exc"],
    ["Inh", "Inh"],
    ["Micro", "Microglia"],
    ["Oligo", "Oligodendrocytes"],
    ["all_types", "All Types"],
  ].map((ct) => {
    return {
      name: ct[1],
      url: `https://downloads.wenglab.org/${ct[0]}.PeakCalls.bed`,
    };
  });

  return (
    <Grid
      container
      spacing={3}
      mt={6}
      mb={8}
      ml={"auto"}
      mr={"auto"}
      maxWidth={{ xl: "65%", lg: "75%", md: "85%", sm: "90%", xs: "90%" }}
    >
      {disease === "Diff-expressed-genes" && (
        <Grid xs={12}>
          <Typography
            type="display"
            size="medium"
            style={{
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: "57.6px",
              letterSpacing: "0.5px",
            }}
          >
            {"Differential Gene Expression"}
          </Typography>
          <br />
          <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
            <StyledTab label="Differential Gene Expression " />
            <StyledTab label="Data Table" />
          </Tabs>
          {tabIndex === 1 && (
            <Slide direction="up" in timeout={1000}>
              <Box>
                <HorizontalCard
                  width={500}
                  onCardClick={(v?: string) => {
                    navigate(
                      `/psychscreen/single-cell/datasets/Diff-expressed-genes/${v}`,
                      { state: { searchvalue: v } }
                    );
                  }}
                  cardContentText={degCards}
                />
              </Box>
            </Slide>
          )}
          {tabIndex === 0 && (
            <Box>
              <Typography
                type="display"
                size="small"
                style={{
                  display: "inline-block",
                  fontSize: "28px",
                  marginBottom: "0.5em",
                }}
              >
                Gene: {gene}
              </Typography>
              <br />
              <span>Switch to another gene:</span>
              <br />
              <br />
              <GeneAutoComplete
                onSelected={(value) => {
                  setGene(value.name);
                }}
                gridsize={3.5}
              />
              <DegExpression gene={gene} disease={"Schizophrenia"} />
            </Box>
          )}
        </Grid>
      )}
      {disease === "scATAC-Seq-peaks" && (
        <Grid xs={12}>
          <Typography
            type="display"
            size="medium"
            mb={1}
            style={{
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: "57.6px",
              letterSpacing: "0.5px",
            }}
          >
            {"scATAC-Seq Peaks"}
          </Typography>
          <StyledButton
            bvariant={page === -1 ? "filled" : "outlined"}
            btheme="light"
            onClick={() => setPage(-1)}
          >
            Genome Browser
          </StyledButton>
          &nbsp;&nbsp;&nbsp;
          <StyledButton
            bvariant={page === 0 ? "filled" : "outlined"}
            btheme="light"
            onClick={() => setPage(0)}
          >
            Cell Type specific ATAC peaks
          </StyledButton>
          &nbsp;&nbsp;&nbsp;
          {page === 0 && (
            <Box mt={3}>
              <DataTable
                columns={COLUMNS}
                rows={d}
                itemsPerPage={10}
                searchable
              />
            </Box>
          )}
          {page === -1 && (
            <Grid sm={10} md={10} lg={9} xl={9}>
              {/*
                    <>
                      <br />
                      <br />
                      <div
                        style={{
                          marginTop: "1em",
                          width: "100%",
                          textAlign: "center",
                        }}
                      >
                        {`${coordinates.chromosome}:${coordinates.start}-${coordinates.end}`}{" "}
                      </div>
                      <br />
                      <CytobandView
                        innerWidth={1000}
                        height={15}
                        chromosome={coordinates.chromosome!}
                        assembly="hg38"
                        position={coordinates}
                      />
                      <br />
                      <div style={{ textAlign: "center" }}>
                        <UCSCControls
                          onDomainChanged={onDomainChanged}
                          domain={coordinates}
                          withInput={false}
                        />
                      </div>
                      <br />
                      <GenomeBrowser
                        svgRef={svgRef}
                        domain={coordinates}
                        innerWidth={1400}
                        width="100%"
                        noMargin
                        onDomainChanged={(x) => {
                          if (Math.ceil(x.end) - Math.floor(x.start) > 10) {
                            setCoordinates({
                              chromosome: coordinates.chromosome,
                              start: Math.floor(x.start),
                              end: Math.ceil(x.end),
                            });
                          }
                        }}
                      >
                        <RulerTrack
                          domain={coordinates}
                          height={30}
                          width={1400}
                        />
                        <Trackset coordinates={coordinates} tracks={peaks} />
                      </GenomeBrowser>
                    </>
                    */}
              {
                <SingleCellBrowser
                  coordinates={coordinates}
                  assembly={"hg38"}
                  atactracks
                  grntracks
                  qtltracks
                />
              }
            </Grid>
          )}
        </Grid>
      )}
      {disease === "Gene-regulatory-networks" && (
        <Grid xs={12}>
          <Container>
            <Typography
              type="display"
              size="medium"
              mb={1}
              style={{
                fontWeight: 700,
                fontSize: "40px",
                lineHeight: "57.6px",
                letterSpacing: "0.5px",
              }}
            >
              Gene Regulatory Networks
            </Typography>
            <StyledButton
              bvariant={grnpage === -1 ? "filled" : "outlined"}
              btheme="light"
              onClick={() => setGrnPage(-1)}
            >
              Genome Browser
            </StyledButton>
            &nbsp;&nbsp;&nbsp;
            <StyledButton
              bvariant={grnpage === 0 ? "filled" : "outlined"}
              btheme="light"
              onClick={() => setGrnPage(0)}
            >
              Cell Types
            </StyledButton>
            &nbsp;&nbsp;&nbsp;
            <br />
            <br />
            {grnpage === 0 && (
              <Slide direction="up" in timeout={1000}>
                <Box>
                  <HorizontalCard
                    width={500}
                    onCardClick={(v?: string) => {
                      navigate(
                        `/psychscreen/single-cell/datasets/Gene-regulatory-networks/${v}`,
                        { state: { searchvalue: v } }
                      );
                    }}
                    cardContentText={cellTypeCards}
                  />
                </Box>
              </Slide>
            )}
            {grnpage === -1 && (
              <SingleCellBrowser
                coordinates={coordinates}
                assembly={"hg38"}
                grntracks
              />
            )}
          </Container>
        </Grid>
      )}
      {disease === "Cell-type-specific-eQTLs" && (
        <Grid xs={12}>
          <Typography
            type="display"
            size="medium"
            mb={1}
            style={{
              fontWeight: 700,
              fontSize: "40px",
              lineHeight: "57.6px",
              letterSpacing: "0.5px",
            }}
          >
            Cell Type Specific eQTLs
          </Typography>
          <StyledButton
            bvariant={qtlpage === -1 ? "filled" : "outlined"}
            btheme="light"
            onClick={() => setQtlPage(-1)}
          >
            Genome Browser
          </StyledButton>
          &nbsp;&nbsp;&nbsp;
          <StyledButton
            bvariant={qtlpage === 0 ? "filled" : "outlined"}
            btheme="light"
            onClick={() => setQtlPage(0)}
          >
            Cell Types
          </StyledButton>
          &nbsp;&nbsp;&nbsp;
          <br />
          <br />
          {qtlpage === 0 && (
            <>
              <Slide direction="up" in timeout={1000}>
                <Box>
                  <HorizontalCard
                    width={500}
                    onCardClick={(v?: string) => {
                      navigate(
                        `/psychscreen/single-cell/datasets/Cell-type-specific-eQTLs/${v}`,
                        { state: { searchvalue: v } }
                      );
                    }}
                    cardContentText={qtlcellTypeCards}
                  />
                </Box>
              </Slide>
            </>
          )}
          {qtlpage === -1 && (
            <>
              <SingleCellBrowser
                coordinates={coordinates}
                assembly={"hg38"}
                qtltracks
              />
            </>
          )}
        </Grid>
      )}
      {disease === "Indiv-cohort-expression-data" && (
        <Grid xs={12}>
          <Slide direction="up" in timeout={1000}>
            <Box>
              <HorizontalCard
                width={500}
                onCardClick={(v?: string) => {
                  navigate(`/psychscreen/single-cell/${v}`, {
                    state: { searchvalue: v },
                  });
                }}
                cardContentText={DISEASE_CARDS}
              />
            </Box>
          </Slide>
        </Grid>
      )}
    </Grid>
  );
};

const BBTrack: React.FC<{
  data: BigResponseData;
  url: string;
  title: string;
  color?: string;
  height: number;
  transform?: string;
  onHeightChanged?: (height: number) => void;
  domain: GenomicRange;
  svgRef?: React.RefObject<SVGSVGElement>;
}> = ({
  data,
  url,
  title,
  height,
  domain,
  transform,
  onHeightChanged,
  svgRef,
  color,
}) => {
  useEffect(
    () => onHeightChanged && onHeightChanged(height + 40),
    [height, onHeightChanged]
  );
  return (
    <g transform={transform}>
      <EmptyTrack
        height={40}
        width={1400}
        transform="translate(0,8)"
        id=""
        text={title}
      />
      <DenseBigBed
        width={1400}
        height={height}
        domain={domain}
        id="atc"
        transform="translate(0,40)"
        data={data as BigBedData[]}
        svgRef={svgRef}
      />
    </g>
  );
};

const Trackset: React.FC<any> = (props) => {
  const height = useMemo(
    () => props.tracks.length * 80,
    [props.tracks, props.coordinates]
  );
  const bigRequests = useMemo(
    () =>
      props.tracks.map((url) => ({
        chr1: props.coordinates.chromosome,
        start: props.coordinates.start,
        end: props.coordinates.end,
        chr2: props.coordinates.chromosome,
        url: url[1],
        preRenderedWidth: 1400,
      })),
    [props.coordinates]
  );
  useEffect(() => {
    props.onHeightChanged && props.onHeightChanged(height);
  }, [props.onHeightChanged, height, props]);
  const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, {
    variables: { bigRequests },
  });

  return loading || (data?.bigRequests.length || 0) < 2 ? (
    <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." />
  ) : (
    <>
      {(data?.bigRequests || []).map((data, i) => (
        <BBTrack
          height={40}
          key={props.tracks[i][0]}
          url={props.tracks[i][1]}
          domain={props.coordinates}
          title={props.tracks[i][0]}
          svgRef={props.svgRef}
          data={data.data}
          transform={`translate(0,${i * 70})`}
        />
      ))}
    </>
  );
};
export default SingleCellDatasets;
