import type { BigBedRow } from "@weng-lab/genomebrowser-v2";
import {
  createEndpoint,
  createRelationshipId,
  parseRowEndpoint,
} from "../interactions/normalize";
import type { GenomicInteraction } from "../interactions/types";

const LINKED_TARGET_PATTERN = /^([^:]+):(\d+)-(\d+):([^:]+):([^:]+)$/;
const TARGETLESS_PATTERN = /^:([^:]+):([^:]+):([^:]+)$/;
const TARGETLESS_GENE_SCORE_PATTERN = /^(.+)-(?:\d+(?:\.\d+)?|\.\d+)$/;

export function parseGrnRow(row: BigBedRow): GenomicInteraction | undefined {
  const source = parseRowEndpoint(row, "enhancer");
  const name = row.name?.trim();
  if (!source || !name) return undefined;

  const targetless = TARGETLESS_PATTERN.exec(name);
  if (targetless) {
    const [, geneToken, tfToken, detailToken] = targetless;
    const targetGene = parseTargetlessGene(geneToken, detailToken);
    const targetTF = tfToken.trim();
    if (!targetGene || !targetTF) return undefined;

    const relationship = { source, targetGene, targetTF };
    return { id: createRelationshipId(relationship), ...relationship };
  }

  const linked = LINKED_TARGET_PATTERN.exec(name);
  if (!linked) return undefined;

  const [, chromosome, startToken, endToken, tfToken, geneToken] = linked;
  const start = Number(startToken);
  const end = Number(endToken);
  const targetTF = tfToken.trim();
  const targetGene = geneToken.trim();
  if (
    !Number.isSafeInteger(start) ||
    !Number.isSafeInteger(end) ||
    start < 0 ||
    end < start ||
    !targetTF ||
    !targetGene
  ) {
    return undefined;
  }

  const target = createEndpoint(chromosome, start, end, "promoter");
  const relationship = { source, target, targetGene, targetTF };
  return { id: createRelationshipId(relationship), ...relationship };
}

function parseTargetlessGene(token: string, detailToken: string) {
  const trimmed = token.trim();
  const detail = detailToken.trim();
  if (detail && Number.isFinite(Number(detail))) return trimmed;

  return TARGETLESS_GENE_SCORE_PATTERN.exec(trimmed)?.[1]?.trim() ?? trimmed;
}
