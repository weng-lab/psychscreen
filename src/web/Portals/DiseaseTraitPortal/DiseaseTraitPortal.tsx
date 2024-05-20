/**
 * DiseaseTraitPortal.tsx: the disease/trait portal page.
 */

import React, { useState } from "react";
import { AppBar } from "@weng-lab/psychscreen-ui-components";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, Container, GridProps, Slide } from "@mui/material";
import DiseaseTrait from "../../../assets/disease-trait.png";
import { TabletAppBar } from "@weng-lab/psychscreen-ui-components";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import CheckIcon from "@mui/icons-material/Check";
import { SearchBox, HorizontalCard } from "@weng-lab/psychscreen-ui-components";
import { useTheme, useMediaQuery } from "@material-ui/core";
import { PORTALS } from "../../../App";
import { Logo } from "../../../mobile-portrait/HomePage/HomePage";
import { DISEASE_CARDS } from "./config/constants";
import { DiseaseTraitAutoComplete } from "./DiseaseTraitAutoComplete";
const DiseaseTraitPortal: React.FC<GridProps> = (props: GridProps) => {
  const { state }: any = useLocation();
  const { searchvalue } = state ? state : { searchvalue: "" };
  const navigate = useNavigate();
  const [val, setVal] = useState<string>(searchvalue);
  const [diseaseCards, setdiseaseCards] = useState<
    { cardLabel: string; val: string; cardDesc: string }[] | undefined
  >(
    searchvalue !== ""
      ? DISEASE_CARDS.filter(
          (d) =>
            d.cardLabel.toLowerCase().includes(val.toLowerCase()) ||
            (d.aliases &&
              d.aliases.find((el) =>
                el.toLowerCase().includes(val.toLowerCase())
              ))
        )
      : undefined
  );
  const theme = useTheme();
  return (
    <>
      {
        //show vertical app bar only for mobile view
        useMediaQuery(theme.breakpoints.down("xs")) ? (
          <TabletAppBar
            onDownloadsClicked={() => navigate("/psychscreen/downloads")}
            onAboutClicked={() => navigate("/psychscreen/aboutus")}
            onHomepageClicked={() => navigate("/")}
            onPortalClicked={(index) =>
              navigate(`/psychscreen${PORTALS[index][0]}`)
            }
            style={{ marginBottom: "63px" }}
            title={(<Logo />) as any}
          />
        ) : (
          <AppBar
            centered={true}
            onAboutClicked={() => navigate("/psychscreen/aboutus")}
            onDownloadsClicked={() => navigate("/psychscreen/downloads")}
            onHomepageClicked={() => navigate("/")}
            onPortalClicked={(index) =>
              navigate(`/psychscreen${PORTALS[index][0]}`)
            }
          />
        )
      }
      <Grid container {...props}>
        <Grid item sm={0} md={1} lg={2} xl={2} />
        <Grid item sm={8} md={6} lg={5} xl={4}>
          {useMediaQuery(theme.breakpoints.down("sm")) && (
            <Container style={{ marginTop: "130px" }}>
              <img
                alt="disease/trait portal"
                src={DiseaseTrait}
                style={{ width: "70%", height: "100%" }}
              />
            </Container>
          )}
          <Container style={{ width: "741px", marginTop: "147px" }} fixed>
            <Typography
              type="display"
              size="medium"
              style={{
                fontWeight: 700,
                fontSize: "48px",
                lineHeight: "57.6px",
                letterSpacing: "0.5px",
                marginBottom: "16px",
              }}
            >
              Disease/Trait Portal
            </Typography>
            <br />
            <Typography
              type="body"
              size="large"
              style={{
                fontSize: "16px",
                lineHeight: "24px",
                fontWeight: 400,
                letterSpacing: "0.3%",
                marginBottom: "16px",
                width: "414px",
              }}
            >
              Explore heritability enrichment for {DISEASE_CARDS.length}{" "}
              distinct psychiatric, behavioral, and neuronal traits within gene
              regulatory features, such as b-cCREs and quantitative trait loci
              (QTLs). Search genes associated with complex traits based on
              PsychENCODE TWAS.
            </Typography>
            <Typography
              type="body"
              size="large"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "19px",
              }}
            >
              <CheckIcon style={{ marginRight: "9px" }} />{" "}
              {DISEASE_CARDS.length} total traits cataloged
            </Typography>
            <Typography
              type="body"
              size="large"
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "19px",
                marginBottom: "40px",
              }}
            >
              <CheckIcon style={{ marginRight: "9px" }} /> 1,103 b-cCRE/trait
              associations
            </Typography>
            <DiseaseTraitAutoComplete
              navigateto="/psychscreen/traits/"
              showTitle
            />

            {0 > 1 && (
              <SearchBox
                value={val}
                onChange={(e) => {
                  if (e.target.value === "") {
                    setdiseaseCards(undefined);
                  }
                  setVal(e.target.value);
                }}
                onClick={() => {
                  if (val === "") return;
                  setdiseaseCards(
                    DISEASE_CARDS.filter(
                      (d) =>
                        d.cardLabel.toLowerCase().includes(val.toLowerCase()) ||
                        (d.aliases &&
                          d.aliases.find((el) =>
                            el.toLowerCase().includes(val.toLowerCase())
                          ))
                    )
                  );
                }}
                helperText="e.g. schizophrenia, years of education"
              />
            )}
          </Container>
          {useMediaQuery(theme.breakpoints.down("sm")) &&
            diseaseCards &&
            diseaseCards.length > 0 && (
              <Slide direction="up" in timeout={1000}>
                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
                  <HorizontalCard
                    width={500}
                    onCardClick={(v?: string) => {
                      let d = DISEASE_CARDS.find(
                        (d) => d.val === v
                      )?.diseaseDesc;
                      navigate(`/psychscreen/traits/${v}`, {
                        state: { searchvalue: val, diseaseDesc: d },
                      });
                    }}
                    cardContentText={diseaseCards}
                  />
                </Container>
              </Slide>
            )}
          {useMediaQuery(theme.breakpoints.down("sm")) &&
            diseaseCards &&
            diseaseCards.length === 0 && (
              <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
                No results found
              </Container>
            )}
        </Grid>
        {useMediaQuery(theme.breakpoints.up("md")) && (
          <Grid item sm={4} md={4} lg={3} xl={3}>
            {!diseaseCards ? (
              <Container style={{ marginTop: "170px" }}>
                <img
                  alt="disease/trait portal"
                  src={DiseaseTrait}
                  style={{ width: "100%", height: "100%" }}
                />
              </Container>
            ) : diseaseCards && diseaseCards.length > 0 ? (
              <Slide direction="up" in timeout={1000}>
                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
                  <HorizontalCard
                    width={500}
                    onCardClick={(v?: string) => {
                      const d = DISEASE_CARDS.find(
                        (d) => d.val === v
                      )?.diseaseDesc;
                      navigate(`/psychscreen/traits/${v}`, {
                        state: { searchvalue: val, diseaseDesc: d },
                      });
                    }}
                    cardContentText={diseaseCards}
                  />
                </Container>
              </Slide>
            ) : (
              <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
                No results found
              </Container>
            )}
          </Grid>
        )}
        <Grid item sm={0} md={1} lg={2} xl={3} />
      </Grid>
    </>
  );
};
export default DiseaseTraitPortal;
