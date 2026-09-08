import { gql } from "@apollo/client";
import { z } from "zod";
import { apolloClient } from "../../../graphql/client";

const R_SQUARED_THRESHOLD = 0.7;

const PSYCHSCREEN_LD_QUERY = gql`
  query PsychscreenLD($ids: [String!]!) {
    snp: snpQuery(assembly: "hg38", snpids: $ids) {
      linkageDisequilibrium(rSquaredThreshold: 0.7, population: EUROPEAN) {
        id
        rSquared
      }
    }
  }
`;

const responseSchema = z.object({
  snp: z
    .array(
      z.object({
        linkageDisequilibrium: z
          .array(
            z.object({
              id: z.string().min(1),
              rSquared: z.coerce.number(),
            }),
          )
          .nullish(),
      }),
    )
    .nullish(),
});

export async function fetchLDRelationships(
  anchorId: string,
  signal: AbortSignal,
): Promise<string[]> {
  const response = await apolloClient.query({
    query: PSYCHSCREEN_LD_QUERY,
    variables: { ids: [anchorId] },
    context: {
      clientName: "psychscreen",
      fetchOptions: { signal },
      queryDeduplication: false,
    },
    fetchPolicy: "no-cache",
  });
  const data = responseSchema.parse(response.data);
  const associatedVariantIdSet = new Set<string>();
  for (const relationship of data.snp?.[0]?.linkageDisequilibrium ?? []) {
    if (relationship.rSquared >= R_SQUARED_THRESHOLD) {
      associatedVariantIdSet.add(relationship.id);
    }
  }
  return [...associatedVariantIdSet];
}
