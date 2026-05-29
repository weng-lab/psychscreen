import { gql, useQuery } from "@apollo/client";
import { ManhattanPoint } from "genomebrowser-test";
import { ldTrack, manhattanTrack } from "./useManhattanData";

export const ldQuery = gql(`
  query snips_in_ld($id: [String]) {
    snp: snpQuery(assembly: "hg38", snpids: $id) {
      linkageDisequilibrium(rSquaredThreshold: 0.7, population: EUROPEAN) {
        id
        rSquared
        coordinates(assembly: "hg38") {
          chromosome
          start
          end
          __typename
         }
        __typename
      }
    __typename
    }
  }
  `);

export function useLDQuery(
  hovered: ManhattanPoint | null,
  editTrack: (trackId: string, update: any) => void
) {
  const result = useQuery(ldQuery, {
    variables: {
      id: [hovered?.snpId],
    },
  });

  if (result.data?.snp[0]) {
    editTrack(manhattanTrack.id, {
      associatedSnps: result.data.snp[0].linkageDisequilibrium.map(
        (ld: any) => ld.id
      ),
    });
    editTrack(ldTrack.id, {
      associatedSnps: result.data.snp[0].linkageDisequilibrium.map(
        (ld: any) => ld.id
      ),
      lead: hovered?.snpId,
    });
  }

  if (!hovered) {
    editTrack(manhattanTrack.id, {
      associatedSnps: [],
    });
    editTrack(ldTrack.id, {
      associatedSnps: [],
    });
  }
}
