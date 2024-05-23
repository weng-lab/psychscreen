import React, { useState, useMemo, useRef, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Typography,
  Button,
} from "@weng-lab/psychscreen-ui-components";
import { PORTALS } from "../../../App";
import { Divider, Grid, Box, Tabs, FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";

import { Select as MUISelect } from "@mui/material";

import { CelltypeAutoComplete } from "./CelltypeAutoComplete";

import {
  CELLTYPE_CARDS,
  diseaseCT,
  GRN_cellType_Cards,
  Qtl_Celltype_Cards,
} from "./consts";
import SingleCellCelltypeQTL from "./SingleCellCelltypeQTL";
import { SingleCellBrowser } from "./SingleCellBrowser";
import SingleCelldegCelltypeDotplot from "./SingleCelldegCelltypeDotplot";
import { StyledTab } from "../styles";
import { ATACTRACKS } from "./AtacSeaPeaksTrackModal";
type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};
const SingleCellCellTypeDetails: React.FC = (props) => {
  const { celltype } = useParams();

  const handleChange = (event) => {
    setDataset(event.target.value);
  };
  const [coordinates, setCoordinates] = useState<GenomicRange>({
    chromosome: "chr11",
    start: 6192271,
    end: 6680547,
  });
  const navigate = useNavigate();
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
    degDiseases.push("ASD");
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

  console.log(celltype, ATACTRACKS["ATAC Seq Peaks"].find(d=>d[0].toLowerCase()===celltype!!.replace(" or ", "/").toLowerCase()),"atac grn")
  return (
    <>
      <Grid container {...props} style={{ marginTop: "0.5em" }}>
        <Grid item sm={1} lg={1.5} />
        <Grid item sm={9}>
          <Typography
            type="headline"
            size="large"
            style={{ marginTop: "-0.6em", marginBottom: "0.2em" }}
          >
            Celltype Details: {celltype?.replace(" or ", "/")}
          </Typography>
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
          <br />
        </Grid>
        <Grid item sm={1} lg={1.5} />
        <Grid item sm={12} style={{ marginBottom: "10px" }} />
        <Grid item sm={1} lg={1.5} />
        <Grid item sm={9}>
          <Box>
            <Tabs value={tabIndex} onChange={handleTabChange}>
              <StyledTab label="scATAC-Seq Peaks" tabIndex={0} />
              <StyledTab label="Gene Regulatory Networks" tabIndex={1} />
              <StyledTab label="eQTLs" tabIndex={2} />
              <StyledTab label="Diff. Expressed Genes" tabIndex={3} />
            </Tabs>
            <Divider />
          </Box>
          {tabIndex === 0 && celltype && ATACTRACKS["ATAC Seq Peaks"].find(d=>d[0].toLowerCase()===celltype!!.replace(" or ", "/").toLowerCase() ) && (
            <SingleCellBrowser
              coordinates={coordinates}
              assembly={"hg38"}
              atactracks
              defaultatactracks = { [
                ATACTRACKS["ATAC Seq Peaks"].find(d=>d[0].toLowerCase()===celltype!!.replace(" or ", "/").toLowerCase() )
              ]
              }
            />
          ) }
          {tabIndex === 0 && celltype && !ATACTRACKS["ATAC Seq Peaks"].find(d=>d[0].toLowerCase()===celltype!!.replace(" or ", "/").toLowerCase() ) && (
             <><br/>{"No scATAC-Seq peaks tracks available for " + celltype?.replace(" or ", "/")}</>
          )

          }
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
              <>{"No data available for " + celltype?.replace(" or ", "/")}</>
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
              <>{"No data available for " + celltype?.replace(" or ", "/")}</>
            ))}
          {tabIndex == 3 && degDiseases && degDiseases.length == 0 && (
            <>
              <br />{" "}
              {"No data diff. expressed genes available for " +
                celltype?.replace(" or ", "/")}{" "}
            </>
          )}
          {tabIndex == 3 && degDiseases.length > 0 && dataset && (
            <>
              <SingleCelldegCelltypeDotplot
                disease={dataset}
                dataset={dataset}
                degDiseases={degDiseases}
                handleChange={handleChange}
                celltype={
                  diseaseCT[dataset.replace(" ", "_")].find(
                    (d) => d.cardLabel === celltype?.replace(" or ", "/")
                  )?.val
                }
              />
            </>
          )}
        </Grid>
      </Grid>
    </>
  );
};
export default SingleCellCellTypeDetails;
