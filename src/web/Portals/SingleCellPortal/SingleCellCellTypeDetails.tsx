import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
} from "@weng-lab/psychscreen-ui-components";
import { Divider, Box, Tabs } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'
import { CelltypeAutoComplete } from "./CelltypeAutoComplete";

import {
  diseaseCT,
  GRN_cellType_Cards,
  Qtl_Celltype_Cards,
} from "./consts";
import { SingleCellBrowser } from "./SingleCellBrowser";
import SingleCelldegCelltypeDotplot from "./SingleCelldegCelltypeDotplot";
import { StyledTab } from "../styles";
import { ATACTRACKS } from "./AtacSeaPeaksTrackModal";
type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};
const SingleCellCellTypeDetails: React.FC = () => {
  const { celltype } = useParams();

  const handleChange = (event) => {
    setDataset(event.target.value);
  };
  const [coordinates, setCoordinates] = useState<GenomicRange>({
    chromosome: "chr11",
    start: 6192271,
    end: 6680547,
  });
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    setTabIndex(0);
  }, []);

  const handleTabChange = (_: any, newTabIndex: number) => {
    setTabIndex(newTabIndex);
  };

  let degDiseases: string[] = [];
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
      (d) => d.cardLabel === celltype?.replace(" or ", "/")
    )
  )
    degDiseases.push("Bipolar Disorder");
  if (
    diseaseCT["Schizophrenia"].find(
      (d) => d.cardLabel === celltype?.replace(" or ", "/")
    )
  )
    degDiseases.push("Schizophrenia");

  const [dataset, setDataset] = React.useState(
    (degDiseases && degDiseases[0]) || null
  );

  useEffect(() => {
    setDataset((degDiseases && degDiseases[0]) || null);
  }, [celltype]);

  return (
      <Grid container spacing={3} mt={6} mb={8} ml={"auto"} mr={"auto"} maxWidth={{ xl: "65%", lg: "75%", md: "85%", sm: "90%", xs: "90%" }}>
        <Grid xs={12}>
          <Typography
            type="headline"
            size="large"
            style={{ marginTop: "1em", marginBottom: "0.2em" }}
          >
            Celltype Details: {celltype?.replace(" or ", "/").includes("-expressing") ?  <i>{celltype?.replace(" or ", "/").split("-expressing")[0]}{" expressing"}{celltype?.replace(" or ", "/").split("-expressing")[1]}</i> : celltype?.replace(" or ", "/")} 
          </Typography>
          <br/>
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
        <Grid xs={12}>
          <Box>
            <Tabs value={tabIndex} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
              <StyledTab label="scATAC-Seq Peaks" tabIndex={0} />
              <StyledTab label="Gene Regulatory Networks" tabIndex={1} />
              <StyledTab label="eQTLs" tabIndex={2} />
              <StyledTab label="Differential Gene Expression" tabIndex={3} />
            </Tabs>
            <Divider />
          </Box>
          {tabIndex === 0 && celltype && (
            <SingleCellBrowser
              coordinates={coordinates}
              assembly={"hg38"}
              atactracks
             
            />
          ) }
          {tabIndex == 1 &&
            (GRN_cellType_Cards.find(
              (c) => c.cardLabel === celltype?.replace(" or ", "/")
            ) ? (
              <SingleCellBrowser
                coordinates={coordinates}
                assembly={"hg38"}
                grntracks
              />
            ) : (
              <><br/>{"No data available for " + celltype?.replace(" or ", "/")}</>
            ))}
          {tabIndex == 2 &&
            (Qtl_Celltype_Cards.find(
              (c) => c.cardLabel === celltype?.replace(" or ", "/")
            ) ? (
              <SingleCellBrowser
                coordinates={coordinates}
                assembly={"hg38"}
                qtltracks
              />
            ) : (
              <><br/>{"No data available for " + celltype?.replace(" or ", "/")}</>
            ))}
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
                  diseaseCT[dataset === "Autism Specturm Disorder"  ? "ASD"  : dataset.replace(" ", "_")].find(
                    (d) => d.cardLabel === celltype?.replace(" or ", "/")
                  )?.val
                }
              />
          )}
        </Grid>
      </Grid>
  );
};
export default SingleCellCellTypeDetails;
