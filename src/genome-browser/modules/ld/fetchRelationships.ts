import { gql } from "@apollo/client";
import { z } from "zod";
import { apolloClient } from "../../../graphql/client";
import { LD_REQUEST } from "./requestConfig";
import type { LDRelationship } from "./types";

const PSYCHSCREEN_LD_QUERY = gql`
  query PsychscreenLD($ids: [String!]!) {
    snp: snpQuery(assembly: "${LD_REQUEST.assembly}", snpids: $ids) {
      linkageDisequilibrium(
        rSquaredThreshold: ${LD_REQUEST.rSquaredThreshold}
        population: ${LD_REQUEST.population}
      ) {
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
              rSquared: z
                .union([z.number(), z.string().trim().min(1).transform(Number)])
                .pipe(z.number().min(0).max(1)),
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
): Promise<LDRelationship[]> {
  const response = await apolloClient.query({
    query: PSYCHSCREEN_LD_QUERY,
    variables: { ids: [anchorId] },
    context: {
      fetchOptions: { signal },
      queryDeduplication: false,
    },
    fetchPolicy: "no-cache",
  });
  const data = responseSchema.parse(response.data);
  const relationshipsById = new Map<string, LDRelationship>();
  for (const relationship of data.snp?.[0]?.linkageDisequilibrium ?? []) {
    if (
      relationship.id !== anchorId &&
      relationship.rSquared >= LD_REQUEST.rSquaredThreshold
    ) {
      // Duplicate partners use the highest valid score, regardless of row order.
      const previous = relationshipsById.get(relationship.id);
      if (!previous || relationship.rSquared > previous.rSquared) {
        relationshipsById.set(relationship.id, relationship);
      }
    }
  }
  return [...relationshipsById.values()];
}
