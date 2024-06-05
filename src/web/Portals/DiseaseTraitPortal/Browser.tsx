import React, { useMemo, useRef, useState, useCallback } from "react";
import CytobandView from "../GenePortal/Browser/Explorer/Cytobands";
import { GenomeBrowser, RulerTrack, UCSCControls } from "umms-gb";
import EGeneTracks from "../GenePortal/Browser/EGeneTracks";
import {
  EpigeneticTracks,
  tracks,
  VariantTracks,
  ConservationTracks,
} from "../../../genome-explorer";
import { useGenePageData } from "../GenePortal/AssociatedxQTL";
import { DeepLearnedModelTracks } from "../../../genome-explorer/DeepLearnedModels";
import { Box, Divider, FormControl, MenuItem, Stack, Typography } from "@mui/material";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { SnpAutoComplete } from "../SnpPortal/SnpAutoComplete";
import { GeneAutoComplete } from "../GenePortal/GeneAutocomplete";
import { CoordinatesSearch } from "./CoordinatesSearch";
import Grid from "@mui/material/Unstable_Grid2";
import { toScientificNotation } from "./utils";

export type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};

function mergeRegions(regions: GenomicRange[]): GenomicRange[] {
  const mergedRegions: GenomicRange[] = [];
  let currentRegion = { ...regions[0] };
  for (let i = 1; i < regions.length; ++i) {
    const region = regions[i];
    if (currentRegion.end >= region.start)
      currentRegion.end = Math.max(currentRegion.end, region.end);
    else {
      mergedRegions.push(currentRegion);
      currentRegion = { ...region };
    }
  }
  mergedRegions.push(currentRegion);
  return mergedRegions;
}

const Browser: React.FC<{
  coordinates: GenomicRange;
  url: string;
  trait: string;
  gwasLocusSNPs?: { SNPCount : number, minimump: number, coordinates: GenomicRange }
}> = (props) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [coordinates, setCoordinates] = useState<GenomicRange>(
    props.coordinates
  );
  const [highlight] = useState<GenomicRange | null>(null);
  const [selectedSearch, setSearch] = useState<string>("Genes");
  const handleChange = (event: SelectChangeEvent) => {
    setSearch(event.target.value);
  };

  const epigeneticTracks = useMemo(
    () =>
      tracks(
        "GRCh38",
        coordinates as { chromosome: string; start: number; end: number }
      ),
    [coordinates]
  );

  const onDomainChanged = useCallback(
    (d: GenomicRange) => {
      const chr =
        d.chromosome === undefined
          ? props.coordinates.chromosome
          : d.chromosome;
      if (Math.round(d.end) - Math.round(d.start) > 10) {
        setCoordinates({
          chromosome: chr,
          start: Math.round(d.start) < 0 ? 1 : Math.round(d.start),
          end: Math.round(d.end),
        });
      }
    },
    [props.coordinates]
  );

  const { groupedTranscripts } = useGenePageData(
    coordinates,
    "GRCh38",
    "APOE",
    false
  );

  const [importantRegions, setImportantRegions] = useState<GenomicRange[]>([]);
  const onImportantRegionsLoaded = useCallback((regions: GenomicRange[]) => {
    setImportantRegions(
      mergeRegions(
        regions
          .sort((a, b) => a.start - b.start)
          .filter((x) => x.end - x.start >= 4)
      )
    );
  }, []);

  const l = useCallback(
    (c: number) =>
      ((c - coordinates.start) * 1400) / (coordinates.end - coordinates.start),
    [coordinates]
  );
  return (
    <Stack alignItems={"center"} spacing={3}>
      {props.gwasLocusSNPs && props.gwasLocusSNPs.coordinates.chromosome === coordinates.chromosome && props.gwasLocusSNPs.coordinates.start === coordinates.start && props.gwasLocusSNPs.coordinates.end === coordinates.end &&
        <>
          <Typography alignSelf={"flex-start"}>
            {props.gwasLocusSNPs.SNPCount} significant SNP{props.gwasLocusSNPs.SNPCount !== 1 ? "s" : ""}{" "} at locus {props.gwasLocusSNPs.coordinates.chromosome + ":" + props.gwasLocusSNPs.coordinates.start.toLocaleString() + "-" + props.gwasLocusSNPs.coordinates.end.toLocaleString()}. Lowest <i>P</i> at this locus:{" "} {toScientificNotation(props.gwasLocusSNPs.minimump, 2)}
          </Typography>
          <Divider sx={{ width: '100%', marginTop: '1rem !important' }} />
        </>
      }
      <Grid container alignItems="center">
          <Grid>
            <FormControl variant="standard">
              <Select
                id="search"
                value={selectedSearch}
                onChange={handleChange}
              >
                <MenuItem value={"Genes"}>Genes</MenuItem>
                <MenuItem value={"SNPs"}>SNPs</MenuItem>
                <MenuItem value={"Coordinates"}>Coordinates</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid>
            {selectedSearch === "Genes" ? (
              <GeneAutoComplete
                gridsize={3.5}
                hideSearchButton
                onSelected={(value) => {
                  setCoordinates({
                    chromosome: value.chromosome,
                    start: +value.start - 20000 < 0 ? 1 : +value.start - 20000,
                    end: +value.end + 20000,
                  });
                }}
              />
            ) : selectedSearch === "SNPs" ? (
              <SnpAutoComplete
                gridsize={3.5}
                hideSearchButton
                onSelected={(value) => {
                  setCoordinates({
                    chromosome: value.chromosome,
                    start: +value.start - 20000 < 0 ? 1 : +value.start - 20000,
                    end: +value.end + 20000,
                  });
                }}
              />
            ) : (
              <CoordinatesSearch
                onSelected={(value) => {
                  setCoordinates({
                    chromosome: value.chromosome,
                    start: +value.start < 0 ? 1 : +value.start,
                    end: +value.end,
                  });
                }}
                hideSearchButton
                defaultText={`${coordinates.chromosome}:${coordinates.start}-${coordinates.end}`}
              />
            )}
          </Grid>
        </Grid>

        <CytobandView
          innerWidth={1400}
          height={15}
          chromosome={coordinates.chromosome!}
          assembly="hg38"
          position={coordinates}
        />
        <div>
          <UCSCControls
            onDomainChanged={onDomainChanged}
            domain={coordinates}
            withInput={false}
          />
        </div>
        <Typography>
          <b>{coordinates.chromosome + ":" + coordinates.start.toLocaleString() + "-" + coordinates.end.toLocaleString()}</b>{" (Hold shift and drag to select a region)"}
        </Typography>
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
              start: Math.floor(x.start) < 0 ? 1 : Math.floor(x.start),
              end: Math.ceil(x.end),
            });
          }
        }}
        >
        {highlight && (
          <rect
            fill="#8ec7d1"
            fillOpacity={0.5}
            height={1000}
            x={l(highlight.start)}
            width={l(highlight.end) - l(highlight.start)}
          />
        )}
        <RulerTrack domain={coordinates} height={40} width={1400} />
        <EGeneTracks
          genes={groupedTranscripts || []}
          expandedCoordinates={coordinates}
          squish
        />

        <EpigeneticTracks
          assembly="GRCh38"
          tracks={epigeneticTracks}
          domain={coordinates}
        />
        <DeepLearnedModelTracks
          domain={coordinates}
          onImportantRegionsLoaded={onImportantRegionsLoaded}
          trait={props.trait}
        />
        <VariantTracks
          coordinates={coordinates}
          resolvedTranscript={false}
          url={props.url}
          name=""
          trait={props.trait}
          importantRegions={importantRegions}
        />
        <ConservationTracks
          assembly="GRCh38"
          //tracks={epigeneticTracks}
          domain={coordinates}
        />
      </GenomeBrowser>
    </Stack>
  );
};
export default Browser;
