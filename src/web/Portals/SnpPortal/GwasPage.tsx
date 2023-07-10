import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Grid, Container } from "@mui/material";
import {
  Typography,
  CustomizedTable,
} from "@weng-lab/psychscreen-ui-components";
type GWASPageProps = {
  id: string;
};

export type GWASEntry = {
  pubMedId: string;
  author: string;
  name: string;
};

type QueryResponse = {
  snpQuery: { genomeWideAssociation: GWASEntry[] }[];
};

const QUERY = gql`
  query q($id: [String]) {
    snpQuery(snpids: $id, assembly: "hg38") {
      genomeWideAssociation {
        pubMedId
        author
        name
      }
    }
  }
`;

const GwasPage: React.FC<GWASPageProps> = (props) => {
  const { data } = useQuery<QueryResponse>(QUERY, {
    variables: { id: props.id },
  });

  const gwasData =
    data &&
    data.snpQuery[0]?.genomeWideAssociation.length > 0 &&
    data.snpQuery[0]?.genomeWideAssociation.map((d: GWASEntry) => {
      return [
        { header: "PubMed ID", value: d.pubMedId },
        { header: "Lead Author", value: d.author },
        { header: "Trait", value: d.name },
      ];
    });

  return (
    <Grid container {...props}>
      <Grid item sm={12}>
        <Container style={{ marginTop: "30px", marginLeft: "0px" }}>
          {data?.snpQuery[0]?.genomeWideAssociation.length ? (
            <>
              <Typography
                type="display"
                size="small"
                style={{ fontWeight: 500, fontSize: "28px" }}
              >
                {" "}
                {props.id} has been identified in{" "}
                {data?.snpQuery[0]?.genomeWideAssociation.length} GWAS.
              </Typography>
            </>
          ) : (
            <Typography
              type="display"
              style={{ fontWeight: 500, fontSize: "28px" }}
              size="small"
            >
              {props.id} has not been identified in any GWAS catalogued by
              psychSCREEN.
            </Typography>
          )}
          {gwasData && (
            <CustomizedTable
              style={{ width: "max-content" }}
              tabledata={gwasData}
            />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};
export default GwasPage;
