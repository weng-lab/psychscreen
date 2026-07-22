import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

import { Divider, Box, Tabs, Tab, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { CelltypeAutoComplete } from "./CelltypeAutoComplete";

import { diseaseCT } from "./consts";
import SingleCelldegCelltypeDotplot from "./SingleCelldegCelltypeDotplot";
import GenomeBrowserView from "../../../gb-view/GenomeBrowserView";
import {
  SINGLE_CELL_ATAC_DEFAULT_TRACK_IDS,
  SINGLE_CELL_GRN_DEFAULT_TRACK_IDS,
  SINGLE_CELL_QTL_DEFAULT_TRACK_IDS,
} from "../../../gb-view/defaultTrackIds";
import { createSingleCellBrowserSession } from "../../../gb-view/stores";
import type { BrowserRegion } from "@weng-lab/genomebrowser";
import type { SelectChangeEvent } from "@mui/material/Select";
import { SINGLE_CELL_TRACK_CATALOGS } from "../../../gb-view/catalogs";

const SINGLE_CELL_BROWSER_REGION: BrowserRegion = {
  chromosome: "chr11",
  start: 6_192_271,
  end: 6_680_547,
};

const SingleCellCellTypeDetails: React.FC = () => {
  const { celltype } = useParams();

  const handleChange = (event: SelectChangeEvent) => {
    setDataset(event.target.value);
  };
  const [tabIndex, setTabIndex] = React.useState(0);
  const [browserSessions] = React.useState(() => ({
    atac: createSingleCellBrowserSession(SINGLE_CELL_BROWSER_REGION),
    grn: createSingleCellBrowserSession(SINGLE_CELL_BROWSER_REGION),
    qtl: createSingleCellBrowserSession(SINGLE_CELL_BROWSER_REGION),
  }));
  const [visitedBrowserTabs, setVisitedBrowserTabs] = React.useState<
    ReadonlySet<number>
  >(() => new Set([0]));

  useEffect(
    () => () => {
      browserSessions.atac.dispose();
      browserSessions.grn.dispose();
      browserSessions.qtl.dispose();
    },
    [browserSessions],
  );

  const handleTabChange = (_: React.SyntheticEvent, newTabIndex: number) => {
    setTabIndex(newTabIndex);
    if (newTabIndex <= 2) {
      setVisitedBrowserTabs((visitedTabs) =>
        visitedTabs.has(newTabIndex)
          ? visitedTabs
          : new Set([...visitedTabs, newTabIndex]),
      );
    }
  };

  const degDiseases: string[] = [];
  if (
    diseaseCT["ASD"].find((d) => d.cardLabel === celltype?.replace(" or ", "/"))
  )
    degDiseases.push("Autism Specturm Disorder");
  if (
    diseaseCT["Age"].find((d) => d.cardLabel === celltype?.replace(" or ", "/"))
  )
    degDiseases.push("Age");
  if (
    diseaseCT["Bipolar_Disorder"].find(
      (d) => d.cardLabel === celltype?.replace(" or ", "/"),
    )
  )
    degDiseases.push("Bipolar Disorder");
  if (
    diseaseCT["Schizophrenia"].find(
      (d) => d.cardLabel === celltype?.replace(" or ", "/"),
    )
  )
    degDiseases.push("Schizophrenia");

  const [dataset, setDataset] = React.useState(
    (degDiseases && degDiseases[0]) || null,
  );

  useEffect(() => {
    setDataset((degDiseases && degDiseases[0]) || null);
  }, [celltype]);

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
        <Typography
          variant="h4"
          style={{ marginTop: "1em", marginBottom: "0.2em" }}
        >
          Celltype Details:{" "}
          {celltype?.replace(" or ", "/").includes("-expressing") ? (
            <i>
              {celltype?.replace(" or ", "/").split("-expressing")[0]}
              {" expressing"}
              {celltype?.replace(" or ", "/").split("-expressing")[1]}
            </i>
          ) : (
            celltype?.replace(" or ", "/")
          )}
        </Typography>
        <br />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <span style={{ marginRight: "10px" }}>
            Switch to another celltype:
          </span>
          <CelltypeAutoComplete
            navigateto="/psychscreen/single-cell/celltype/"
            gridsize={3.5}
          />
        </div>
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
            <Tab label="scATAC-Seq Peaks " tabIndex={0} />
            <Tab label="Gene Regulatory Networks" tabIndex={1} />
            <Tab label="eQTLs" tabIndex={2} />
            <Tab label="Differential Gene Expression" tabIndex={3} />
          </Tabs>
          <Divider />
        </Box>
        {visitedBrowserTabs.has(0) && (
          <Box sx={{ display: tabIndex === 0 ? "block" : "none" }}>
            <GenomeBrowserView
              browserStore={browserSessions.atac.browserStore}
              trackStore={browserSessions.atac.trackStore}
              trackCatalogs={SINGLE_CELL_TRACK_CATALOGS}
              defaultTrackIds={SINGLE_CELL_ATAC_DEFAULT_TRACK_IDS}
            />
          </Box>
        )}
        {visitedBrowserTabs.has(1) && (
          <Box sx={{ display: tabIndex === 1 ? "block" : "none" }}>
            <GenomeBrowserView
              browserStore={browserSessions.grn.browserStore}
              trackStore={browserSessions.grn.trackStore}
              trackCatalogs={SINGLE_CELL_TRACK_CATALOGS}
              defaultTrackIds={SINGLE_CELL_GRN_DEFAULT_TRACK_IDS}
            />
          </Box>
        )}
        {visitedBrowserTabs.has(2) && (
          <Box sx={{ display: tabIndex === 2 ? "block" : "none" }}>
            <GenomeBrowserView
              browserStore={browserSessions.qtl.browserStore}
              trackStore={browserSessions.qtl.trackStore}
              trackCatalogs={SINGLE_CELL_TRACK_CATALOGS}
              defaultTrackIds={SINGLE_CELL_QTL_DEFAULT_TRACK_IDS}
            />
          </Box>
        )}
        {tabIndex == 3 && degDiseases && degDiseases.length == 0 && (
          <>
            <br />{" "}
            {"No data diff. expressed genes available for " +
              celltype?.replace(" or ", "/")}{" "}
          </>
        )}
        {tabIndex == 3 && degDiseases.length > 0 && dataset && (
          <SingleCelldegCelltypeDotplot
            disease={dataset}
            dataset={dataset}
            degDiseases={degDiseases}
            handleChange={handleChange}
            celltype={
              diseaseCT[
                dataset === "Autism Specturm Disorder"
                  ? "ASD"
                  : dataset.replace(" ", "_")
              ].find((d) => d.cardLabel === celltype?.replace(" or ", "/"))?.val
            }
          />
        )}
      </Grid>
    </Grid>
  );
};
export default SingleCellCellTypeDetails;
