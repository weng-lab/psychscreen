import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Grid, Container } from "@mui/material";
import { DataTable } from "@weng-lab/psychscreen-ui-components";
import {
  Typography
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

  const gwasColumns = [
        { header: "PubMed ID", value:(d) => d.pubMedId, render: (d) => 
        <a target="_blank" rel="noopener noreferrer" href={`https://pubmed.ncbi.nlm.nih.gov/${d.pubMedId}`}>
        {d.pubMedId}
      </a> },
        { header: "Lead Author", value:(d) => d.author },
        { header: "Trait", value:(d) => d.name },
      ];
    

  return (
    <Grid container {...props}>
      <Grid item sm={12}>
        <Container style={{ marginTop: "10px", marginLeft: "-30px" }}>
          {data?.snpQuery[0]?.genomeWideAssociation.length ? (
            <>
              <Typography
                type="title"
                size="large"
              >
                {" "}
                {props.id} has been identified in{" "}
                {data?.snpQuery[0]?.genomeWideAssociation.length} GWAS.
              </Typography>
            </>
          ) : (
            <Typography
              type="title"              
              size="large"
            >
              {props.id} has not been identified in any GWAS catalogued by
              psychSCREEN.
            </Typography>
          )}
          {data && data.snpQuery[0]?.genomeWideAssociation.length>0 && (
            <DataTable
              columns={gwasColumns}
              rows={data.snpQuery[0]?.genomeWideAssociation}
            />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};
export default GwasPage;
