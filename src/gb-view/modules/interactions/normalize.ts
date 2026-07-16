import type { BigBedRow, BrowserRegion } from "@weng-lab/genomebrowser-v2";
import type {
  GenomicInteraction,
  InteractionEndpoint,
  InteractionRole,
} from "./types";

export type InteractionRowParser = (
  row: BigBedRow,
) => GenomicInteraction | undefined;

export function parseRowEndpoint(
  row: BigBedRow,
  role: InteractionRole,
): InteractionEndpoint | undefined {
  const chromosome = row.chr ?? row.chrom;
  if (
    !chromosome ||
    !Number.isFinite(row.start) ||
    !Number.isFinite(row.end) ||
    row.start < 0 ||
    row.end < row.start
  ) {
    return undefined;
  }

  return createEndpoint(chromosome, row.start, row.end, role);
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
  region: BrowserRegion,
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
