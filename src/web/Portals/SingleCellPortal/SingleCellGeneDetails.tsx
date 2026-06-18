import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import { Divider, GridLegacy as Grid, Box, Tabs, Tab, Typography } from "@mui/material";

import { gql, useQuery } from "@apollo/client";
import SingleCell from "../GenePortal/SingleCell";

import { GeneAutoComplete } from "../GenePortal/GeneAutocomplete";

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
  let { geneid } = state ? state : { geneid: "" };
  const [tabIndex, setTabIndex] = useState(0);

  const [gid, setGid] = useState(geneid);

  useEffect(() => {
    setTabIndex(0);
  }, []);

  useEffect(() => {
    let { geneid } = state ? state : { geneid: "" };
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

  return (
    <Grid container {...props} style={{ marginTop: "0.5em" }}>
      <Grid item sm={1} lg={1.5} />
      <Grid item sm={9}>
        <Typography variant="h4"
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
      <Grid item sm={1} lg={1.5} />
      <Grid item sm={12} style={{ marginBottom: "10px" }} />
      <Grid item sm={1} lg={1.5} />
      <Grid item sm={9}>
        <Box>
          <Tabs value={tabIndex} onChange={handleTabChange}>
            <Tab label="Brain Single Cell Expression" />
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
        </Box>
      </Grid>
    </Grid>
  );
};
