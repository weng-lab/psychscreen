/**
 * GenePortal.tsx: the gene portal page.
 */

import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, Container, Slide } from "@mui/material";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import CheckIcon from "@mui/icons-material/Check";
import { SearchBox, HorizontalCard } from "@weng-lab/psychscreen-ui-components";
import { useTheme, useMediaQuery, Paper } from "@material-ui/core";
import GeneBCRE from "../../../assets/gene-bcre.png";
import CircularProgress from "@mui/material/CircularProgress";
import { QueryResponse } from "./GeneOverview";

import { GeneAutoComplete } from "./GeneAutocomplete";
import { StyledButton } from "../styles";

const GENE_AUTOCOMPLETE_QUERY = `
query ($assembly: String!, $name_prefix: [String!], $limit: Int) {
    gene(assembly: $assembly, name_prefix: $name_prefix, limit: $limit) {
      name
      id
      coordinates {
        start
        chromosome
        end
      }
      __typename
    }
  }
  
 `;

const GenePortal: React.FC = (props) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { state }: any = useLocation();
  const { searchvalue } = state ? state : { searchvalue: "" };
  const [val, setVal] = useState<string>(searchvalue);
  const [fetching, setFetching] = useState<boolean>(false);
  const [geneCards, setgeneCards] = useState<
    { cardLabel: string; val: string; cardDesc: string }[] | undefined
  >(undefined);
  const [geneDesc, setgeneDesc] = useState<{ name: string; desc: string }[]>();

  const onSearchChange = useCallback(async (value: any) => {
    setFetching(true);
    const response = await fetch("https://ga.staging.wenglab.org/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: GENE_AUTOCOMPLETE_QUERY,
        variables: {
          assembly: "GRCh38",
          name_prefix: value,
          //  limit: 5
        },
      }),
      headers: { "Content-Type": "application/json" },
    });
    const genesSuggestion = (await response.json()).data?.gene;

    if (genesSuggestion && genesSuggestion.length > 0) {
      const r = genesSuggestion.map((g: any) => {
        return {
          val: `${g.id}/${g.coordinates.chromosome}/${g.coordinates.start}/${g.coordinates.end}`,
          cardDesc: g.id, //.split(".")[0],
          cardLabel: g.name,
        };
      });
      setgeneCards(r);
    } else if (genesSuggestion && genesSuggestion.length === 0)
      setgeneCards([]);
    setFetching(false);
  }, []);
  useEffect(() => {
    const fetchDAta = async () => {
      let f = await Promise.all(
        geneCards!!
          .map((f) => f.cardLabel!!)
          .map((gene) =>
            // do something with this response like parsing to JSON
            fetch(
              "https://clinicaltables.nlm.nih.gov/api/ncbi_genes/v3/search?authenticity_token=&terms=" +
                gene.toUpperCase()
            )
              .then((x) => x.json())
              .then((x) => {
                const matches =
                  (x as QueryResponse)[3] &&
                  (x as QueryResponse)[3].filter(
                    (x) => x[3] === gene.toUpperCase()
                  );
                return {
                  desc:
                    matches && matches.length >= 1
                      ? matches[0][4]
                      : "(no description available)",
                  name: gene,
                };
              })
              .catch()
          )
      );
      setgeneDesc(f);
    };

    geneCards && fetchDAta();
  }, [geneCards]);

  return (
    <Grid container {...props}>
      <Grid item sm={0} md={1} lg={2} xl={2}></Grid>
      <Grid item sm={8} md={6} lg={5} xl={4}>
        {useMediaQuery(theme.breakpoints.down("sm")) && (
          <Container style={{ marginTop: "130px" }}>
            <img
              alt="Gene b-cCRE portal"
              src={GeneBCRE}
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
            Gene/b-cCRE Portal
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
            Explore gene expression and regulatory element activity in the fetal
            and adult brain at bulk and single-cell resolution. Visualize
            gene/b-cCRE links based on PsychENCODE QTLs and single cell
            co-expression analyses.
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
            <CheckIcon style={{ marginRight: "9px" }} /> Gene expression in 11
            brain regions
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
            <CheckIcon style={{ marginRight: "9px" }} /> 23 fetal, adolescent,
            and adult time points covered
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
            <CheckIcon style={{ marginRight: "9px" }} /> 761,984 brain
            regulatory elements
          </Typography>
          <br />
          <br />
          <GeneAutoComplete navigateto="/psychscreen/gene/" showTitle />
          <br />
          {0 > 1 && (
            <SearchBox
              value={val}
              onChange={(e) => {
                setVal(e.target.value);
              }}
              onSearchButtonClick={() => {
                if (val !== "") {
                  onSearchChange(val);
                }
              }}
              helperText={"e.g. sox4, gapdh"}
            />
          )}

          <br />
          <br />
          <br />
          {0 > 1 && (
            <StyledButton
              bvariant="outlined"
              btheme="light"
              style={{ marginLeft: "100px" }}
              onClick={() => {
                navigate(`/psychscreen/gene/gtexumap`);
              }}
            >
              GTEx Umap Plots
            </StyledButton>
          )}
        </Container>
      </Grid>
      {useMediaQuery(theme.breakpoints.up("md")) && (
        <Grid item sm={4} md={4} lg={3} xl={3}>
          {!geneCards && !fetching ? (
            <Container style={{ marginTop: "170px" }}>
              <img
                alt="gene/b-ccre portal"
                src={GeneBCRE}
                style={{ width: "100%", height: "100%" }}
              />
            </Container>
          ) : fetching ? (
            <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
              {" "}
              <>
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
                  Loading Data...
                </Typography>
                <br />
                <CircularProgress color="inherit" />
              </>{" "}
            </Container>
          ) : (
            <>
              {0 > 1 && geneCards!.length > 0 && geneDesc && (
                <Slide direction="up" in timeout={1000}>
                  <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
                    {
                      <Paper
                        elevation={0}
                        style={{
                          maxHeight: 500,
                          width: 350,
                          overflow: "auto",
                        }}
                      >
                        <HorizontalCard
                          width={300}
                          onCardClick={(v?: string) => {
                            let f = geneCards!!.find((g: any) => g.val === v);
                            navigate(`/psychscreen/gene/${f?.cardLabel}`, {
                              state: {
                                geneid: v!!.split("/")[0].split(".")[0],
                                chromosome: v!!.split("/")[1],
                                start: v!!.split("/")[2],
                                end: v!!.split("/")[3],
                                tabind: 0,
                              },
                            });
                          }}
                          cardContentText={geneCards!!.map((d) => {
                            return {
                              ...d,
                              cardDesc: geneDesc!!.find(
                                (h) => h.name === d.cardLabel
                              )
                                ? geneDesc!!.find(
                                    (h) => h.name === d.cardLabel
                                  )!!.desc
                                : "(no description available)",
                            };
                          })}
                        />{" "}
                      </Paper>
                    }
                  </Container>
                </Slide>
              )}
              {geneCards!.length === 0 && (
                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
                  {"No Results Found"}
                </Container>
              )}
            </>
          )}
        </Grid>
      )}
      <Grid item sm={0} md={1} lg={2} xl={3}></Grid>
    </Grid>
  );
};
export default GenePortal;
