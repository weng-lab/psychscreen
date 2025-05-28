import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { Divider, Box, Tabs, Stack } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import ViolinPlot from "./violin/violin";
import { gql, useQuery } from "@apollo/client";
import { groupBy } from "queryz";
import { tissueColors } from "./consts";
import AssociatedxQTL from "./AssociatedxQTL";
import GeneExpressionPage from "./GeneExpression";
import Browser from "./Browser/Browser";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import SingleCell from "./SingleCell";
import { StyledTab, StyledToggleButton } from "../../Portals/styles";
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

  let { geneid, chromosome, start, end, tabind } = state
    ? state
    : { geneid: "", chromosome: "", start: null, end: null, tabind: 0 };
  const [tabIndex, setTabIndex] = useState(tabind || 0);
  const ref = useRef<SVGSVGElement>(null);
  const [gid, setGid] = useState(geneid);
  const [tissueCategory, setTissueCategory] = React.useState<string | null>(
    "granular"
  );

  //const [ partialGeneId, setPartialGeneId ] = useState<string | null>(null);
  //const [ trueGeneId, setTrueGeneId ] = useState<string | null>(null);
  //const [ trueGeneName, setTrueGeneName ] = useState<string | null>(null);

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
  /*const onGeneChange = React.useCallback(
      async (value: any) => {
          
          const response = await fetch('https://ga.staging.wenglab.org/graphql', {
              method: 'POST',
              body: JSON.stringify({
                  query: GENE_ID_QUERY,
                  variables: {
                    name_prefix: [value?.toUpperCase()],
                    assembly: "GRCh38"
                  },
              }),
              headers: { 'Content-Type': 'application/json' },
          });
          const geneID = (await response.json()).data?.gene; 
          let d = geneID.find(n=>n.name.toUpperCase()===value.toUpperCase()) ? geneID.find(n=>n.name.toUpperCase()===value.toUpperCase()): geneID[0]         
          setTrueGeneName(value)
          setTrueGeneId(d.id.split(".")[0])
          setRegion({chromosome: d.coordinates.chromosome,start: d.coordinates.start,end: d.coordinates.end})
      },
      [params.gene]
  );*/
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
      <Grid xs={12}>
        <Stack direction="row" alignItems={"center"} gap={1}>
          <img
            alt="DNA"
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Font_Awesome_5_solid_dna.svg/640px-Font_Awesome_5_solid_dna.svg.png"
            height={"25px"}
          />
          <Typography type="headline" size="large">
            Gene Details: <i>{gene}</i>
          </Typography>
        </Stack>
      </Grid>
      <Grid xs={12}>
        <Typography type="body" size="medium" mb={1}>
          Switch to another gene:
        </Typography>
        <GeneAutoComplete navigateto="/psychscreen/gene/" gridsize={3.5} />
      </Grid>
      <Grid xs={12}>
        <Box>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            <StyledTab label="Epigenome Browser" />
            <StyledTab label="Single Cell Expression" />
            <StyledTab label="Tissue Expression (GTEx)" />
            <StyledTab label="eQTLs and b-cCREs" />
            <StyledTab label="Differential Gene Expression" />
            <StyledTab label="Spatial Expression" />
          </Tabs>
          <Divider />
        </Box>
        <Box sx={{ padding: 2 }}>
          {
            //region.chromosome==='' && !region.start && !region.end && <CircularProgress/>
          }
          {tabIndex === 3 && 0 > 1 ? (
            <Box></Box>
          ) : tabIndex === 0 &&
            (geneCoords ||
              (region.chromosome !== "" && region.start && region.end)) ? (
            <Box>
              <Browser
                name={gene?.toUpperCase()}
                coordinates={{
                  chromosome:
                    region.chromosome === ""
                      ? geneCoords.gene[0].coordinates.chromosome
                      : region.chromosome,
                  start:
                    region.start === null
                      ? +geneCoords.gene[0].coordinates.start
                      : +region.start,
                  end:
                    region.end === null
                      ? +geneCoords.gene[0].coordinates.end
                      : +region.end,
                }}
                // coordinates={{ chromosome: region.chromosome, start:   +region.start, end: +region.end }}
              />
            </Box>
          ) : tabIndex === 3 && 0 > 1 ? (
            <Box>
              <GeneExpressionPage id={geneid} />
            </Box>
          ) : tabIndex === 3 &&
            (geneCoords ||
              (region.chromosome !== "" && region.start && region.end)) ? (
            <Box>
              <AssociatedxQTL
                name={gene?.toUpperCase()}
                geneid={
                  gid || (geneCoords && geneCoords.gene[0].id.split(".")[0])
                }
                coordinates={{
                  chromosome:
                    region.chromosome === ""
                      ? geneCoords.gene[0].coordinates.chromosome
                      : region.chromosome,
                  start:
                    region.start === null
                      ? +geneCoords.gene[0].coordinates.start
                      : +region.start,
                  end:
                    region.end === null
                      ? +geneCoords.gene[0].coordinates.end
                      : +region.end,
                }}
                //coordinates={ {chromosome: region.chromosome,start: parseInt(region.start),end: parseInt(region.end)}}
              />
            </Box>
          ) : tabIndex === 4 ? (
            <Box>
              <DegExpression gene={gene || "APOE"} disease={"Schizophrenia"} />
            </Box>
          ) : tabIndex === 5 ? (
            <Box>
              <Typography type="body" size="small">
                <BrainSpatial gene={gene || "MBP"} />
              </Typography>
            </Box>
          ) : tabIndex === 1 ? (
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
                <Typography type="body" size="large">
                  No GTex data found for {gene?.toUpperCase()}
                </Typography>
              ) : (
                <>
                  <Typography type="body" size="large" mb={1}>
                    Group By:{" "}
                  </Typography>
                  <ToggleButtonGroup
                    size={"small"}
                    value={tissueCategory}
                    exclusive
                    onChange={handleTissueCategory}
                  >
                    <StyledToggleButton value="broad">
                      Broad Tissue Category
                    </StyledToggleButton>
                    <StyledToggleButton value="granular">
                      Granular Tissue Category
                    </StyledToggleButton>
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
