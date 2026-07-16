import type { BigBedRow } from "@weng-lab/genomebrowser-v2";
import {
  createEndpoint,
  createRelationshipId,
  parseRowEndpoint,
} from "../interactions/normalize";
import type { GenomicInteraction } from "../interactions/types";

const TARGET_PATTERN = /^([^:]+):(\d+)-(\d+):([^:]+)$/;

export function parseQtlRow(row: BigBedRow): GenomicInteraction | undefined {
  const source = parseRowEndpoint(row, "variant");
  const targetMatch = row.name?.trim().match(TARGET_PATTERN);
  if (!source || !targetMatch) return undefined;

  const [, chromosome, startToken, endToken, geneToken] = targetMatch;
  const start = Number(startToken);
  const end = Number(endToken);
  const targetGene = geneToken.trim();
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    end < start ||
    !targetGene
  ) {
    return undefined;
  }

  const target = createEndpoint(chromosome, start, end, "gene");
  const relationship = { source, target, targetGene };
  return { id: createRelationshipId(relationship), ...relationship };
}
