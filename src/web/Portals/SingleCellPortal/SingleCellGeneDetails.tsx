import { useState, useEffect, useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { Divider, Grid, Box, Tabs } from "@mui/material";

import { gql, useQuery } from "@apollo/client";
import SingleCell from "../GenePortal/SingleCell";

import { GeneAutoComplete } from "../GenePortal/GeneAutocomplete";
import { StyledTab } from "../../Portals/styles";
import BrowserView from "../../../genome-browser/browserView";
import {
  evoConservation,
  geneTrack,
  regulatoryFeatures,
  deepLearnedModels,
} from "../../../genome-browser/tracks/tracks";
import {
  createBrowserStore,
  createDataStore,
  createTrackStore,
  ManhattanPoint,
  Track,
} from "genomebrowser-test";
import {
  manhattanTrack,
  useManhattanData,
} from "../../../genome-browser/useManhattanData";
import { ldTrack } from "../../../genome-browser/useManhattanData";
import { useLDQuery } from "../../../genome-browser/useLDQuery";

const GENE_COORDS_QUERY = gql`
  query ($assembly: String!, $name_prefix: [String!]) {
    gene(assembly: $assembly, name_prefix: $name_prefix, version: 40) {
      name
      id
      coordinates {
        start
        chromosome
        end
      }
    }
  }
`;
export const SingleCellGeneDetails = (props) => {
  const { gene } = useParams();
  const { state }: any = useLocation();
  let { geneid, chromosome, start, end, tabind } = state
    ? state
    : { geneid: "", chromosome: "", start: null, end: null, tabind: 0 };
  const [tabIndex, setTabIndex] = useState(tabind || 0);

  const [gid, setGid] = useState(geneid);
  const [region, setRegion] = useState({
    chromosome: chromosome,
    start: start,
    end: end,
  });

  useEffect(() => {
    setTabIndex(0);
  }, []);

  useEffect(() => {
    let { geneid, chromosome, start, end, tabind } = state
      ? state
      : { geneid: "", chromosome: "", start: null, end: null, tabind: 0 };
    setRegion({ chromosome, start, end });
    setGid(geneid);
  }, [gene, state]);
  const { data: geneCoords } = useQuery(GENE_COORDS_QUERY, {
    variables: {
      name_prefix: [gene],
      assembly: "GRCh38",
    },
    skip: gene === "",
  });
  const handleTabChange = (_: any, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const browserStore = useMemo(
    () =>
      createBrowserStore({
        domain: {
          chromosome:
            region.chromosome === ""
              ? geneCoords.gene[0].coordinates.chromosome
              : region.chromosome,
          start:
            (region.start === null
              ? +geneCoords.gene[0].coordinates.start
              : +region.start) - 20000,
          end:
            (region.end === null
              ? +geneCoords.gene[0].coordinates.end
              : +region.end) + 20000,
        },
        marginWidth: 100,
        trackWidth: 1400,
        multiplier: 3,
      }),
    [region]
  );
  const [hovered, setHovered] = useState<ManhattanPoint | null>(null);
  const trackStore = useMemo(
    () =>
      createTrackStore([
        geneTrack(gene),
        ...regulatoryFeatures,
        ...deepLearnedModels,
        {
          ...manhattanTrack,
          onHover: (item) => {
            setHovered(item);
          },
        },
        {
          ...ldTrack,
          onHover: (item) => {
            setHovered(item);
          },
        },
        ...evoConservation,
      ]),
    [setHovered]
  );
  const editTrack = trackStore((state) => state.editTrack);

  useLDQuery(hovered, editTrack);

  const dataStore = useMemo(() => createDataStore(), []);
  useManhattanData(
    "https://downloads.wenglab.org/pyschscreensumstats/GWAS_fullsumstats/Alzheimers_Bellenguez_meta.formatted.bigBed",
    browserStore,
    dataStore
  );

  return (
    <Grid container {...props} style={{ marginTop: "0.5em" }}>
      <Grid item sm={1} lg={1.5} />
      <Grid item sm={9}>
        <Typography
          type="headline"
          size="large"
          style={{ marginTop: "-0.6em", marginBottom: "0.2em" }}
        >
          <img
            alt="DNA"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Font_Awesome_5_solid_dna.svg/640px-Font_Awesome_5_solid_dna.svg.png"
            width="1.7%"
          />
          &nbsp;Gene Details: <i>{gene}</i>
        </Typography>
        <br />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <span style={{ marginRight: "10px" }}>Switch to another gene:</span>
          <GeneAutoComplete
            navigateto="/psychscreen/single-cell/gene/"
            gridsize={3.5}
          />
        </div>
      </Grid>
      <Grid item sm={1} lg={1.5} />
      <Grid item sm={12} style={{ marginBottom: "10px" }} />
      <Grid item sm={1} lg={1.5} />
      <Grid item sm={9}>
        <Box>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <StyledTab label="Brain Epigenome Browser" />
            <StyledTab label="Brain Single Cell Expression" />
          </Tabs>
          <Divider />
        </Box>
        <Box sx={{ padding: 2 }}>
          {tabIndex === 0 &&
          (geneCoords ||
            (region.chromosome !== "" && region.start && region.end)) ? (
            <Box>
              <BrowserView
                browserStore={browserStore}
                trackStore={trackStore}
                dataStore={dataStore}
              />
            </Box>
          ) : (
            <Box>
              <SingleCell
                gene={gene || "APOE"}
                pedataset={"SZBDMulti-Seq"}
                selectDatasets
              />
            </Box>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};
