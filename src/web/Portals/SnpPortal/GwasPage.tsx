import { gql, useQuery } from "@apollo/client";
import React from "react";
import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import { Table, TableColDef } from "@weng-lab/ui-components";

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

const gwasColumns: TableColDef<GWASEntry>[] = [
  {
    field: "pubMedId",
    headerName: "PubMed ID",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`https://pubmed.ncbi.nlm.nih.gov/${params.value}`}
        style={{ color: "#0000EE" }}
      >
        {params.value}
      </a>
    ),
  },
  { field: "author", headerName: "Lead Author" },
  { field: "name", headerName: "Trait" },
];

const GwasPage: React.FC<GWASPageProps> = (props) => {
  const { data } = useQuery<QueryResponse>(QUERY, {
    variables: { id: props.id },
  });

  return (
    <Grid container {...props}>
      <Grid size={{ sm: 12 }}>
        <Container style={{ marginTop: "10px", marginLeft: "-30px" }}>
          {data?.snpQuery[0]?.genomeWideAssociation.length ? (
            <>
              <Typography variant="subtitle1">
                {" "}
                {props.id} has been identified in{" "}
                {data?.snpQuery[0]?.genomeWideAssociation.length} GWAS.
              </Typography>
            </>
          ) : (
            <Typography variant="subtitle1">
              {props.id} has not been identified in any GWAS catalogued by
              psychSCREEN.
            </Typography>
          )}
          {data && data.snpQuery[0]?.genomeWideAssociation.length > 0 && (
            <Table
              label="Genome-Wide Associations"
              columns={gwasColumns}
              rows={data.snpQuery[0]?.genomeWideAssociation}
              divHeight={{ maxHeight: 750 }}
              emptyTableFallback="No genome-wide associations found"
            />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};
export default GwasPage;
