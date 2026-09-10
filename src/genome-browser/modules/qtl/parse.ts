import type { NamedBigBedRow } from "../shared/bigBed";
import {
  parseEndpoint,
  createRelationshipId,
  parseRowEndpoint,
} from "../interactions/normalize";
import type { GenomicInteraction } from "../interactions/types";

const TARGET_PATTERN = /^([^:]+):(\d+)-(\d+):([^:]+)$/;

export function parseQtlRow(
  row: NamedBigBedRow,
): GenomicInteraction | undefined {
  const source = parseRowEndpoint(row, "variant");
  const targetMatch = row.name?.trim().match(TARGET_PATTERN);
  if (!source || !targetMatch) return undefined;

  const [, chromosome, startToken, endToken, geneToken] = targetMatch;
  const start = Number(startToken);
  const end = Number(endToken);
  const targetGene = geneToken.trim();
  const target = parseEndpoint(chromosome, start, end, "gene");
  if (!target || !targetGene) return undefined;

  const relationship = { source, target, targetGene };
  return { id: createRelationshipId(relationship), ...relationship };
}
