import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import { Divider, Box, Tabs, Tab, Stack, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import Grid from "@mui/material/Grid";
import ViolinPlot from "./violin/violin";
import { gql, useQuery } from "@apollo/client";
import { groupBy } from "queryz";
import { tissueColors } from "./consts";
import AssociatedxQTL from "./AssociatedxQTL";
import GeneExpressionPage from "./GeneExpression";
import SingleCell from "./SingleCell";
import { GeneAutoComplete } from "./GeneAutocomplete";
import { DegExpression } from "./DegExpression";
import BrainSpatial from "./BrainSpatial";

type GTExGeneQueryResponse = {
  gtex_genes: {
    val: number;
    gene_id: string;
    description: string;
    tissue_type: string;
    tissue_type_detail: string;
  }[];
};

const GTEX_GENES_QUERY = gql`
  query gtexgenes($gene_id: [String]!) {
    gtex_genes(gene_id: $gene_id) {
      val
      gene_id
      description
      tissue_type
      tissue_type_detail
    }
  }
`;

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

const GeneDetails: React.FC = (props) => {
  const { gene } = useParams();
  const { state }: any = useLocation();

  let { geneid, tabind } = state ? state : { geneid: "", tabind: 0 };
  const [tabIndex, setTabIndex] = useState(Math.max((tabind || 1) - 1, 0));
  const ref = useRef<SVGSVGElement>(null);
  const [gid, setGid] = useState(geneid);
  const [tissueCategory, setTissueCategory] = React.useState<string | null>(
    "granular"
  );

  //const [ partialGeneId, setPartialGeneId ] = useState<string | null>(null);
  //const [ trueGeneId, setTrueGeneId ] = useState<string | null>(null);
  //const [ trueGeneName, setTrueGeneName ] = useState<string | null>(null);

  useEffect(() => {
    setTabIndex(0);
  }, []);

  useEffect(() => {
    let { geneid } = state ? state : { geneid: "" };
    setGid(geneid);
  }, [gene, state]);

  //if (trueGeneId) geneid = trueGeneId;
  const params = useParams();
  const handleTissueCategory = (_: any, newTissueCategory: string | null) => {
    setTissueCategory(newTissueCategory);
  };

  const handleTabChange = (_: any, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  const { data: geneCoords } = useQuery(GENE_COORDS_QUERY, {
    variables: {
      name_prefix: [params.gene],
      assembly: "GRCh38",
    },
    skip: params.gene === "",
  });
  const { data } = useQuery<GTExGeneQueryResponse>(GTEX_GENES_QUERY, {
    variables: {
      gene_id: gid || (geneCoords && geneCoords.gene[0].id.split(".")[0]),
    },
    skip: gid === "" && !geneCoords,
  });

  const grouped = useMemo(
    () =>
      groupBy(
        data?.gtex_genes || [],
        (x) =>
          tissueCategory === "granular" ? x.tissue_type_detail : x.tissue_type,
        (x) => x
      ),
    [data, tissueCategory, gid, geneCoords]
  );

  const sortedKeys = useMemo(
    () =>
      [...grouped.keys()]
        .filter((x) => x !== null && grouped.get(x)!)
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())),
    [grouped, gid, geneCoords]
  );

  const toPlot = useMemo(
    () =>
      new Map(
        sortedKeys
          .map(
            (x) =>
              [
                x,
                new Map([
                  [
                    "all",
                    grouped
                      .get(x)!
                      .flatMap((x) => x.val)
                      .filter((x) => x !== undefined)
                      .map((x) => Math.log10(x! + 0.01)),
                  ],
                ]),
              ] as [string, Map<string, number[]>]
          )
          .filter((x) => x[1].get("all")!.length > 1)
      ),
    [sortedKeys, grouped, gid, geneCoords]
  );

  const domain: [number, number] = useMemo(() => {
    const values = [...toPlot.values()].flatMap((x) => x.get("all")!);
    return [Math.log10(0.001), Math.max(...values) + 0.5];
  }, [toPlot]);
  const width = useMemo(() => {
    const keys = [...toPlot.keys()].length;
    return (54 + (keys < 27 ? 27 : keys)) * 200;
  }, [toPlot]);

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
      <Grid size={12}>
        <Stack direction="row" alignItems={"center"} gap={1}>
          <img
            alt="DNA"
            src="https://upload.wikimedia.org/wikipedia/commons/7/7d/Font_Awesome_5_solid_dna.svg"
            height={"25px"}
          />
          <Typography variant="h4">
            Gene Details: <i>{gene}</i>
          </Typography>
        </Stack>
      </Grid>
      <Grid size={12}>
        <Typography variant="body1" mb={1}>
          Switch to another gene:
        </Typography>
        <GeneAutoComplete navigateto="/psychscreen/gene/" gridsize={3.5} />
      </Grid>
      <Grid size={12}>
        <Box>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <Tab label="Single Cell Expression" />
            <Tab label="Spatial Expression" />
            <Tab label="Tissue Expression (GTEx)" />
            <Tab label="eQTLs and b-cCREs" />
            <Tab label="Differential Gene Expression" />
          </Tabs>
          <Divider />
        </Box>
        <Box sx={{ padding: 2 }}>
          {
            //region.chromosome==='' && !region.start && !region.end && <CircularProgress/>
          }
          {tabIndex === 2 && 0 > 1 ? (
            <Box>
              <GeneExpressionPage id={geneid} />
            </Box>
          ) : tabIndex === 3 && geneCoords ? (
            <Box>
              <AssociatedxQTL
                name={gene?.toUpperCase()}
                geneid={
                  gid || (geneCoords && geneCoords.gene[0].id.split(".")[0])
                }
                coordinates={{
                  chromosome:
                    geneCoords.gene[0].coordinates.chromosome,
                  start: +geneCoords.gene[0].coordinates.start,
                  end: +geneCoords.gene[0].coordinates.end,
                }}
                //coordinates={ {chromosome: region.chromosome,start: parseInt(region.start),end: parseInt(region.end)}}
              />
            </Box>
          ) : tabIndex === 4 ? (
            <Box>
              <DegExpression gene={gene || "APOE"} disease={"Schizophrenia"} />
            </Box>
          ) : tabIndex === 1 ? (
            <Box>
              <Typography variant="body2">
                <BrainSpatial gene={gene || "MBP"} />
              </Typography>
            </Box>
          ) : tabIndex === 0 ? (
            <Box>
              <SingleCell
                gene={gene || "APOE"}
                pedataset={"SZBDMulti-Seq"}
                selectDatasets
              />
            </Box>
          ) : tabIndex === 2 ? (
            <Box>
              {data && data?.gtex_genes.length === 0 ? (
                <Typography variant="body1">
                  No GTex data found for {gene?.toUpperCase()}
                </Typography>
              ) : (
                <>
                  <Typography variant="body1" mb={1}>
                    Group By:{" "}
                  </Typography>
                  <ToggleButtonGroup
                    size={"small"}
                    value={tissueCategory}
                    exclusive
                    onChange={handleTissueCategory}
                  >
                    <ToggleButton value="broad">
                      Broad Tissue Category
                    </ToggleButton>
                    <ToggleButton value="granular">
                      Granular Tissue Category
                    </ToggleButton>
                  </ToggleButtonGroup>
                  <svg
                    viewBox={`0 0 ${width} ${width / 2}`}
                    style={{ width: "100%" }}
                    ref={ref}
                  >
                    <ViolinPlot
                      data={toPlot}
                      title="log10(gene expression[TPM])"
                      width={width}
                      height={width / 2}
                      colors={tissueColors}
                      domain={domain}
                      tKeys={54}
                    />
                  </svg>
                </>
              )}
            </Box>
          ) : null}
        </Box>
      </Grid>
    </Grid>
  );
};
export default GeneDetails;
