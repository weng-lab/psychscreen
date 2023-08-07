import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Typography,
  Button,
} from "@weng-lab/psychscreen-ui-components";
import { PORTALS } from "../../../App";
import {
  Divider,
  Grid,
  TextField,
  Box,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";

import { gql, useQuery } from "@apollo/client";
import { groupBy } from "queryz";

import SingleCell from "../GenePortal/SingleCell";
import styled from "@emotion/styled";
import { GeneAutoComplete } from "../GenePortal/GeneAutocomplete";
import { SingleCellBrowser } from "./SingleCellBrowser";

export const StyledTab = styled(Tab)(() => ({
    textTransform: "none",
  }));
  const GENE_COORDS_QUERY = gql`
  query ($assembly: String!, $name_prefix: [String!]) {
    gene(assembly: $assembly, name_prefix: $name_prefix) {
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
export const SingleCellGeneDetails = (props) =>{
    const navigate = useNavigate();

    const { gene } = useParams();
    const { state }: any = useLocation();
    let { geneid, chromosome, start, end, tabind } = state
    ? state
    : { geneid: "", chromosome: "", start: null, end: null, tabind: 0 };
  const [tabIndex, setTabIndex] = useState(tabind || 0);
  

    const ref = useRef<SVGSVGElement>(null);
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
    skip: gene == "",
  });
  const handleTabChange = (_: any, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

    return(<>
     <>
      <AppBar
        centered
        onDownloadsClicked={() => navigate("/psychscreen/downloads")}
        onHomepageClicked={() => navigate("/")}
        onAboutClicked={() => navigate("/psychscreen/aboutus")}
        onPortalClicked={(index) =>
          navigate(`/psychscreen${PORTALS[index][0]}`)
        }
        style={{ marginBottom: "63px" }}
      />
      <Grid container {...props} style={{ marginTop: "6em" }}>
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
            &nbsp;Gene Details: {gene}
          </Typography>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            <span style={{ marginRight: "10px" }}>Switch to another gene:</span>
            <GeneAutoComplete navigateto="/psychscreen/single-cell/gene/" gridsize={3.5} />
          </div>
        </Grid>
        <Grid item sm={1} lg={1.5} />
        <Grid item sm={12} style={{ marginBottom: "10px" }} />
        <Grid item sm={1} lg={1.5} />
        <Grid item sm={9}>
          <Box>
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <StyledTab label="Brain epi Genome Browser" />
              <StyledTab label="Brain Single Cell Expression" />
            </Tabs>
            <Divider />
          </Box>
          <Box sx={{ padding: 2 }}>
            {tabIndex === 0 &&
              (geneCoords ||
                (region.chromosome !== "" && region.start && region.end)) ? (
              <Box>
                <SingleCellBrowser
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
            ) : <Box>
            <SingleCell gene={gene || "APOE"} pedataset={"SZBDMulti-Seq"} selectDatasets />
          </Box>}
         </Box>
        </Grid>
      </Grid>
    </>
    </>)
}