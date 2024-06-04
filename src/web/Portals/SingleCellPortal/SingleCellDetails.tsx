import React, { useState, useCallback } from "react";
import { GridProps, Paper } from "@mui/material";
import {
  Typography,
  SearchBox,
  HorizontalCard,
} from "@weng-lab/psychscreen-ui-components";
import { useParams, useNavigate } from "react-router-dom";
import { Grid, Container, Slide } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { GeneAutoComplete } from "../GenePortal/GeneAutocomplete";

const GENE_AUTOCOMPLETE_QUERY = `
query ($assembly: String!, $name_prefix: [String!], $limit: Int) {
    gene(assembly: $assembly, name_prefix: $name_prefix, limit: $limit, version: 40) {
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

const SingleCellDetails: React.FC<GridProps> = (props) => {
  const { disease } = useParams();
  const navigate = useNavigate();
  const [val, setVal] = useState<string>("");
  const [fetching, setFetching] = useState<boolean>(false);
  const [geneCards, setgeneCards] = useState<
    { cardLabel: string; val: string; cardDesc: string }[] | undefined
  >(undefined);
  const onSearchChange = useCallback(async (value: any) => {
    setFetching(true);
    const response = await fetch("https://ga.staging.wenglab.org/graphql", {
      method: "POST",
      body: JSON.stringify({
        query: GENE_AUTOCOMPLETE_QUERY,
        variables: {
          assembly: "GRCh38",
          name_prefix: value,
          limit: 5,
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

  return (
    <Grid container {...props}>
      <Grid item sm={2}></Grid>
      <Grid item sm={4}>
        <Container style={{ width: "741px", marginTop: "147px" }} fixed>
          <Typography
            type="body"
            size="small"
            style={{
              fontWeight: 500,
              fontSize: "23px",
              lineHeight: "57.6px",
              letterSpacing: "0.5px",
              marginBottom: "16px",
            }}
          >
            Search Gene to show Dot Plot
          </Typography>
          <GeneAutoComplete
            navigateto={`/psychscreen/single-cell/${disease}/`}
          />
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
              helperText={<>e.g., <i>SOX4</i>, <i>APOE</i></>}
            />
          )}
        </Container>
      </Grid>

      <Grid item sm={6}>
        {fetching ? (
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
            {0 > 1 && geneCards && geneCards!.length > 0 && (
              <Slide direction="up" in timeout={1000}>
                <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
                  {
                    <Paper
                      elevation={0}
                      style={{ maxHeight: 500, width: 350, overflow: "auto" }}
                    >
                      <HorizontalCard
                        width={500}
                        onCardClick={(v?: string) => {
                          let f = geneCards!!.find((g: any) => g.val === v);
                          navigate(
                            `/psychscreen/single-cell/${disease}/${f?.cardLabel}`
                          );
                        }}
                        cardContentText={geneCards!!}
                      />
                    </Paper>
                  }
                </Container>
              </Slide>
            )}
            {geneCards && geneCards!.length === 0 && (
              <Container style={{ marginLeft: "12px", marginTop: "150px" }}>
                {"No Results Found"}
              </Container>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );
};

export default SingleCellDetails;
