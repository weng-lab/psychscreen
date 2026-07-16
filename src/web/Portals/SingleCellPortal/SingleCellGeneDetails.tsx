import {
  useState,
  useEffect,
  useMemo,
  useRef,
  type SyntheticEvent,
} from "react";
import { useParams } from "react-router-dom";

import {
  Divider,
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
} from "@mui/material";
import Grid, { type GridProps } from "@mui/material/Grid";

import { gql, useQuery } from "@apollo/client";
import SingleCell from "../GenePortal/SingleCell";

import { GeneAutoComplete } from "../GenePortal/GeneAutocomplete";
import GenomeBrowserView from "../../../gb-view/GenomeBrowserView";
import { createSingleCellGeneBrowserSession } from "../../../gb-view/stores";
import type { BrowserRegion } from "@weng-lab/genomebrowser-v2";
import { SINGLE_CELL_TRACK_CATALOGS } from "../../../gb-view/catalogs";

type GeneCoordinatesQueryResponse = {
  gene: Array<{
    name: string;
    coordinates: BrowserRegion;
  }>;
};

function SingleCellGeneBrowserPanel({
  region,
  visible,
}: {
  region: BrowserRegion;
  visible: boolean;
}) {
  const [session] = useState(() => createSingleCellGeneBrowserSession(region));
  const previousRegionRef = useRef(region);

  useEffect(() => {
    const previous = previousRegionRef.current;
    if (
      previous.chromosome === region.chromosome &&
      previous.start === region.start &&
      previous.end === region.end
    )
      return;

    previousRegionRef.current = region;
    session.setRegion(region);
  }, [region, session]);

  useEffect(() => () => session.dispose(), [session]);

  return (
    <Box sx={{ display: visible ? "block" : "none" }}>
      <GenomeBrowserView
        browserStore={session.browserStore}
        trackStore={session.trackStore}
        trackCatalogs={SINGLE_CELL_TRACK_CATALOGS}
      />
    </Box>
  );
}

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
export const SingleCellGeneDetails = (props: GridProps) => {
  const { gene } = useParams();
  const [tabIndex, setTabIndex] = useState(0);
  const {
    data: geneCoords,
    loading: geneCoordsLoading,
    error: geneCoordsError,
  } = useQuery<GeneCoordinatesQueryResponse>(GENE_COORDS_QUERY, {
    variables: {
      name_prefix: gene ? [gene] : [],
      assembly: "GRCh38",
    },
    skip: !gene,
    context: { clientName: "staging" },
  });
  const selectedGene = useMemo(
    () =>
      geneCoords?.gene.find(
        (candidate) => candidate.name.toLowerCase() === gene?.toLowerCase(),
      ),
    [gene, geneCoords],
  );
  const geneBrowserRegion = useMemo<BrowserRegion | undefined>(() => {
    if (!selectedGene) return undefined;
    return {
      chromosome: selectedGene.coordinates.chromosome,
      start: Math.max(0, selectedGene.coordinates.start - 20_000),
      end: selectedGene.coordinates.end + 20_000,
    };
  }, [selectedGene]);
  const handleTabChange = (_: SyntheticEvent, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  return (
    <Grid container {...props} style={{ marginTop: "0.5em" }}>
      <Grid size={{ sm: 1, lg: 1.5 }} />
      <Grid size={{ sm: 9 }}>
        <Typography
          variant="h4"
          style={{ marginTop: "-0.6em", marginBottom: "0.2em" }}
        >
          <img
            alt="DNA"
            src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Font_Awesome_5_solid_dna.svg"
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
      <Grid size={{ sm: 1, lg: 1.5 }} />
      <Grid size={{ sm: 12 }} style={{ marginBottom: "10px" }} />
      <Grid size={{ sm: 1, lg: 1.5 }} />
      <Grid size={{ sm: 9 }}>
        <Box>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Brain Single Cell Expression" />
            <Tab label="Brain Epigenome Browser" />
          </Tabs>
          <Divider />
        </Box>
        <Box sx={{ padding: 2 }}>
          {tabIndex === 0 && (
            <Box>
              <SingleCell
                gene={gene || "APOE"}
                pedataset={"SZBDMulti-Seq"}
                selectDatasets
              />
            </Box>
          )}
          {geneBrowserRegion ? (
            <SingleCellGeneBrowserPanel
              region={geneBrowserRegion}
              visible={tabIndex === 1}
            />
          ) : tabIndex === 1 ? (
            geneCoordsLoading ? (
              <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
              </Box>
            ) : (
              <Typography color="error">
                {geneCoordsError
                  ? `Unable to load browser coordinates for ${gene}.`
                  : `No browser coordinates found for ${gene}.`}
              </Typography>
            )
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
};
