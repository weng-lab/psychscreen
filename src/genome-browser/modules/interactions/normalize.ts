import { parseCoordinates, type RowParser } from "../shared/rows";
import type { GenomicRegion } from "@weng-lab/genomebrowser";
import type { NamedBigBedRow } from "../shared/bigBed";
import type {
  GenomicInteraction,
  InteractionEndpoint,
  InteractionRole,
} from "./types";

export type InteractionRowParser = RowParser<
  NamedBigBedRow,
  GenomicInteraction
>;

export function parseRowEndpoint(
  row: NamedBigBedRow,
  role: InteractionRole,
): InteractionEndpoint | undefined {
  return parseEndpoint(row.chromosome, row.start, row.end, role);
}

export function parseEndpoint(
  chromosome: string | undefined,
  start: number,
  end: number,
  role: InteractionRole,
) {
  const coordinates = parseCoordinates(chromosome, start, end);
  return coordinates
    ? createEndpoint(
        coordinates.chromosome,
        coordinates.start,
        coordinates.end,
        role,
      )
    : undefined;
}

export function createEndpoint(
  chromosome: string,
  start: number,
  end: number,
  role: InteractionRole,
): InteractionEndpoint {
  return {
    id: [role, chromosomeKey(chromosome), start, end].join(":"),
    chromosome,
    start,
    end,
    role,
  };
}

export function createRelationshipId({
  source,
  target,
  targetGene,
  targetTF,
}: Omit<GenomicInteraction, "id">) {
  return [
    source.id,
    target?.id ?? "source-only",
    targetGene,
    targetTF ?? "",
  ].join("|");
}

export function deduplicateInteractions(
  interactions: Array<GenomicInteraction | undefined>,
) {
  const byId = new Map<string, GenomicInteraction>();
  for (const interaction of interactions) {
    if (interaction) byId.set(interaction.id, interaction);
  }
  return [...byId.values()];
}

export function isEndpointInRegion(
  endpoint: InteractionEndpoint,
  region: GenomicRegion,
) {
  return (
    chromosomeKey(endpoint.chromosome) === chromosomeKey(region.chromosome) &&
    endpoint.end >= region.start &&
    endpoint.start <= region.end
  );
}

export function isSameChromosome(
  left: InteractionEndpoint,
  right: InteractionEndpoint,
) {
  return chromosomeKey(left.chromosome) === chromosomeKey(right.chromosome);
}

function chromosomeKey(chromosome: string) {
  return chromosome.toLowerCase().replace(/^chr/, "");
}
