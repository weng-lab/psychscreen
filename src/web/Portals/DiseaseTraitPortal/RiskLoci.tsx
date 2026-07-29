import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { Cytobands } from "@weng-lab/genomebrowser-ui";
import type { Highlight } from "@weng-lab/genomebrowser";
import { groupBy } from "queryz";
import React, { useMemo } from "react";
import { linearTransform } from "../GenePortal/violin/utils";

import { GenomicRange } from "../GenePortal/AssociatedxQTL";
import { DISEASE_CARDS } from "./config/constants";
import { focusedRiskLocus, toScientificNotation } from "./utils";

type RiskLocus = {
  chromosome?: string;
  start: number;
  end: number;
  count: number;
  minimump: number;
};

const HG38_CHROMOSOME_LENGTHS = {
  chr1: 248_956_422,
  chr2: 242_193_529,
  chr3: 198_295_559,
  chr4: 190_214_555,
  chr5: 181_538_259,
  chr6: 170_805_979,
  chr7: 159_345_973,
  chr8: 145_138_636,
  chr9: 138_394_717,
  chr10: 133_797_422,
  chr11: 135_086_622,
  chr12: 133_275_309,
  chr13: 114_364_328,
  chr14: 107_043_718,
  chr15: 101_991_189,
  chr16: 90_338_345,
  chr17: 83_257_441,
  chr18: 80_373_285,
  chr19: 58_617_616,
  chr20: 64_444_167,
  chr21: 46_709_983,
  chr22: 50_818_468,
  chrX: 156_040_895,
  chrY: 57_227_415,
} as const;

type Hg38Chromosome = keyof typeof HG38_CHROMOSOME_LENGTHS;

const HG38_CHROMOSOMES = Object.keys(
  HG38_CHROMOSOME_LENGTHS,
) as Hg38Chromosome[];

function isHg38Chromosome(
  chromosome: string | undefined,
): chromosome is Hg38Chromosome {
  return chromosome !== undefined && chromosome in HG38_CHROMOSOME_LENGTHS;
}

function cappedLinearTransform(
  a: [number, number],
  b: [number, number],
): (x: number) => number {
  const l = linearTransform(a, b);
  return (x: number) => l(x > a[1] ? a[1] : x);
}

function colorGradient(v: number): string {
  const start = [235, 168, 12];
  const end = [235, 168, 12];
  const c = start.map((v, i) =>
    cappedLinearTransform([-Math.log10(5e-8), 20], [v, end[i]]),
  );
  return `rgb(${c.map((x) => x(v)).join(",")})`;
}

const RiskLocusView: React.FC<{
  loci: RiskLocus[];
  disease: string;
  onLocusClick?: (
    locus: GenomicRange,
    gwasLocusSNPs?: { SNPCount: number; minimump: number },
  ) => void;
}> = (props) => {
  const groupedLoci = useMemo(
    () =>
      groupBy(
        props.loci,
        (x) => x.chromosome,
        (x) => x,
      ),
    [props.loci],
  );
  const chromosomes = useMemo(
    () =>
      [...groupedLoci.keys()]
        .filter(isHg38Chromosome)
        .sort(
          (a, b) => HG38_CHROMOSOMES.indexOf(a) - HG38_CHROMOSOMES.indexOf(b),
        ),
    [groupedLoci],
  );

  return props.loci.length === 0 ? (
    <CircularProgress />
  ) : (
    <Stack spacing={3}>
      <Typography variant="body1">
        The study{" "}
        <a
          target={"_blank"}
          rel={"noreferrer noopener"}
          href={DISEASE_CARDS.find((d) => d.val === props.disease)?.link}
        >
          {DISEASE_CARDS.find((d) => d.val === props.disease)?.cardDesc}
        </a>{" "}
        has identified{" "}
        {[...groupedLoci.keys()].reduce<number>(
          (v, c) => v + groupedLoci.get(c)!.length,
          0,
        )}{" "}
        risk loci (orange boxes below). Mouse over a locus to view its
        coordinates and summary statistics.
      </Typography>
      <Box minWidth="700px" maxWidth="1000px" width="100%">
        <Stack spacing={1.25}>
          {chromosomes.map((chromosome) => {
            const loci = groupedLoci.get(chromosome)!;
            const lociByHighlightId = new Map<string, RiskLocus>();
            const highlights: Highlight[] = loci.map((locus, index) => {
              const id = `${chromosome}:${locus.start}-${locus.end}:${index}`;
              lociByHighlightId.set(id, locus);
              return {
                id,
                region: {
                  chromosome,
                  start: locus.start,
                  end: locus.end,
                },
                color: colorGradient(-Math.log10(locus.minimump)),
                opacity: 0.5,
              };
            });
            const width =
              (950 * HG38_CHROMOSOME_LENGTHS[chromosome]) /
              HG38_CHROMOSOME_LENGTHS.chr1;

            return (
              <Stack
                key={chromosome}
                direction="row"
                spacing={1.25}
                alignItems="flex-start"
              >
                <Typography
                  width={40}
                  flexShrink={0}
                  fontSize={18}
                  fontWeight="bold"
                  lineHeight="20px"
                  textAlign="right"
                >
                  {chromosome.replace("chr", "")}
                </Typography>
                <Box flex={1}>
                  <Box
                    position="relative"
                    width={`${(100 * HG38_CHROMOSOME_LENGTHS[chromosome]) / HG38_CHROMOSOME_LENGTHS.chr1}%`}
                    sx={{
                      "&:hover": { zIndex: 1 },
                      "& > svg": { width: "100%" },
                    }}
                  >
                    <Cytobands
                      assembly="GRCh38"
                      chromosome={chromosome}
                      width={width}
                      height={20}
                      highlights={highlights}
                      renderHighlightTooltip={(highlight) => {
                        const locus = lociByHighlightId.get(highlight.id);
                        return locus ? (
                          <RiskLocusTooltip
                            locus={locus}
                            clickable={props.onLocusClick !== undefined}
                          />
                        ) : null;
                      }}
                      onHighlightClick={
                        props.onLocusClick
                          ? (highlight) => {
                              const locus = lociByHighlightId.get(highlight.id);
                              if (!locus) return;
                              props.onLocusClick?.(focusedRiskLocus(locus), {
                                SNPCount: locus.count,
                                minimump: +locus.minimump.toExponential(1),
                              });
                            }
                          : undefined
                      }
                    />
                  </Box>
                </Box>
              </Stack>
            );
          })}
        </Stack>
      </Box>
    </Stack>
  );
};

function RiskLocusTooltip({
  locus,
  clickable,
}: {
  locus: RiskLocus;
  clickable: boolean;
}) {
  const { start, end } = focusedRiskLocus(locus);

  return (
    <g>
      <text y={0} dominantBaseline="hanging" fontWeight="bold">
        {locus.chromosome}:{start.toLocaleString()}-{end.toLocaleString()}
      </text>
      <text y={18} dominantBaseline="hanging">
        {locus.count} significant SNP{locus.count === 1 ? "" : "s"} at locus
      </text>
      <text y={36} dominantBaseline="hanging">
        lowest <tspan fontStyle="italic">P</tspan> at locus:{" "}
        {toScientificNotation(locus.minimump, 2)}
      </text>
      {clickable ? (
        <text y={54} dominantBaseline="hanging" fill="#0000ff">
          Click to explore this locus
        </text>
      ) : null}
    </g>
  );
}

export default RiskLocusView;
