import {  
  ApolloClient,
  gql,
  InMemoryCache,
  useQuery,
} from "@apollo/client";
import { useMemo } from "react";

export type BiosampleEntry = {
  dnase?: string | null;
  h3k4me3?: string | null;
  h3k27ac?: string | null;
  ctcf?: string | null;
  name: string;
  lifeStage: string;
  ontology: string;
  sampleType: string;
};

const BIOSAMPLE_QUERY = gql`
  query {
    ccREBiosampleQuery(assembly: "grch38") {
      biosamples {
        dnase: experimentAccession(assay: "dnase")
        h3k4me3: experimentAccession(assay: "h3k4me3")
        h3k27ac: experimentAccession(assay: "h3k27ac")
        ctcf: experimentAccession(assay: "ctcf")
        name
        lifeStage
        ontology
        sampleType
      }
    }
  }
`;

export type CCREInformation = {
  rDHS: string;
  accession: string;
  group: string;
  coordinates: {
    chromosome: string;
    start: number;
    end: number;
  };
  zScores: {
    experiment: string;
    score: number;
  }[];
};

const CCRE_QUERY = gql`
  query q($rDHS: [String!]) {
    cCREQuery(rDHS: $rDHS, assembly: "grch38") {
      rDHS
      accession
      group
      coordinates {
        chromosome
        start
        end
      }
      zScores {
        experiment
        score
      }
    }
  }
`;

export function useBiosamples() {
  const client = useMemo(
    () =>
      new ApolloClient({
        uri: "https://psychscreen.api.wenglab.org/graphql",
        cache: new InMemoryCache(),
      }),
    []
  );
  return useQuery<{ ccREBiosampleQuery: { biosamples: BiosampleEntry[] } }>(
    BIOSAMPLE_QUERY,
    { client }
  );
}

export function useCCREInformation(rDHSAccession: string) {
  const client = useMemo(
    () =>
      new ApolloClient({
        uri: "https://psychscreen.api.wenglab.org/graphql",
        cache: new InMemoryCache(),
      }),
    []
  );
  const { data, loading } = useQuery<{ cCREQuery: CCREInformation[] }>(
    CCRE_QUERY,
    { variables: { rDHS: rDHSAccession }, client }
  );
  const r = useMemo(
    () =>
      data?.cCREQuery[0] && {
        ...data?.cCREQuery[0],
        zScores: new Map<string, number>(
          data?.cCREQuery[0].zScores.map((x) => [x.experiment, x.score]) || []
        ),
      },
    [data]
  );
  return { data: r, loading };
}
