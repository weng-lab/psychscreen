import { gql, useQuery } from "@apollo/client";
import { Container } from "@mui/system";
import { Box, CircularProgress, Stack } from "@mui/material";
import { groupBy } from "queryz";
import React, { useMemo, useState } from "react";
import { Cytobands } from "umms-gb";
import { linearTransform } from "../GenePortal/violin/utils";
import { Typography } from "@weng-lab/psychscreen-ui-components";
import { GenomicRange } from "../GenePortal/AssociatedxQTL";
import { DISEASE_CARDS } from "./config/constants";
import { toScientificNotation } from "./utils";

type Cytoband = {
  coordinates: {
    chromosome: string;
    start: number;
    end: number;
  };
  stain: string;
  bandname: string;
};

type CytobandQueryResponse = {
  cytoband: Cytoband[];
};

const HUMAN_CYTOBAND_QUERY = gql`
  query {
    cytoband(assembly: "hg38") {
      coordinates {
        chromosome
        start
        end
      }
      stain
      bandname
    }
  }
`;

function useCytobands() {
  return useQuery<CytobandQueryResponse>(HUMAN_CYTOBAND_QUERY);
}

function cappedLinearTransform(
  a: [number, number],
  b: [number, number]
): (x: number) => number {
  const l = linearTransform(a, b);
  return (x: number) => l(x > a[1] ? a[1] : x);
}

function colorGradient(v: number): string {
  const start = [235, 168, 12];
  const end = [235, 168, 12];
  const c = start.map((v, i) =>
    cappedLinearTransform([-Math.log10(5e-8), 20], [v, end[i]])
  );
  return `rgb(${c.map((x) => x(v)).join(",")})`;
}

const RiskLocusView: React.FC<{
  loci: {
    chromosome?: string;
    start: number;
    end: number;
    count: number;
    minimump: number;
  }[];
  disease: string;
  onLocusClick?: (
    locus: GenomicRange,
    gwasLocusSNPs?: { SNPCount: number; minimump: number }
  ) => void;
}> = (props) => {
  const groupedLoci = useMemo(
    () =>
      groupBy(
        props.loci,
        (x) => x.chromosome,
        (x) => x
      ),
    [props.loci]
  );
  const { data: cytobands } = useCytobands();
  const groupedCytobands = useMemo(
    () =>
      groupBy(
        cytobands?.cytoband || [],
        (x) => x.coordinates.chromosome,
        (x) => x
      ),
    [cytobands]
  );
  const maxes = useMemo(
    () =>
      new Map(
        [...groupedCytobands.keys()].map((k) => [
          k,
          Math.max(
            ...(groupedCytobands.get(k)!.length === 0
              ? [1]
              : groupedCytobands.get(k)!.map((x) => x.coordinates.end))
          ),
        ])
      ),
    [groupedCytobands]
  );
  const [selected, setSelected] = useState<
    [string, number, number, number] | null
  >(null);

  return props.loci.length === 0 ? (
    <CircularProgress />
  ) : (
    <Stack spacing={3}>
      <Typography type="body" size="medium">
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
          0
        )}{" "}
        risk loci (orange boxes below). Mouse over or click a locus to explore
        PsychENCODE epigenetic and transcriptomic data in that region.
      </Typography>
      <Box minWidth={"700px"} maxWidth={"1000px"}>
        <svg viewBox={`0 0 1000 ${groupedLoci.size * 30 + 100}`}>
          {[...groupedLoci.keys()]
            .filter((x) => x && groupedCytobands.get(x))
            .sort(
              (a, b) =>
                +a!
                  .replace(/chr/g, "")
                  .replace(/X/g, "23")
                  .replace(/Y/g, "24") -
                +b!.replace(/chr/g, "").replace(/X/g, "23").replace(/Y/g, "24")
            )
            .map((chromosome, i) => (
              <g key={i}>
                <text
                  transform={`translate(40,${i * 30 + 13})`}
                  fontSize="30px"
                  dominantBaseline="middle"
                  textAnchor="end"
                  fontWeight="bold"
                  fontFamily="roboto"
                >
                  {chromosome?.replace(/chr/g, "")}
                </text>
                <Cytobands
                  transform={`translate(50,${i * 30})`}
                  data={groupedCytobands.get(chromosome!)!}
                  highlights={groupedLoci.get(chromosome)?.map((x) => ({
                    ...x,
                    //start: x.start - 1500000 < 0 ? 0 : x.start - 1500000,
                    //end: x.end + 1500000,
                    color: colorGradient(-Math.log10(x.minimump)),
                  }))}
                  width={(950 * maxes.get(chromosome!)!) / maxes.get("chr1")!}
                  height={20}
                  id=""
                  domain={{ start: 0, end: maxes.get(chromosome!)! }}
                  onHighlightMouseOver={(_, x, ii) =>
                    setSelected([chromosome!, ii, x + 50, i * 30])
                  }
                  onHighlightMouseOut={() => setSelected(null)}
                  onHighlightClick={(_, __, ii) =>
                    props.onLocusClick &&
                    selected &&
                    props.onLocusClick(
                      {
                        chromosome: groupedLoci.get(chromosome!)![ii]
                          .chromosome,
                        start:
                          groupedLoci.get(chromosome!)![ii].start + 1400000,
                        end: groupedLoci.get(chromosome!)![ii].end - 1400000,
                      },
                      {
                        SNPCount: groupedLoci.get(selected[0])![selected[1]]
                          .count,
                        minimump: +groupedLoci
                          .get(selected[0])!
                          [selected[1]].minimump.toExponential(1),
                      }
                    )
                  }
                  opacity={0.4}
                />
              </g>
            ))}
          {selected ? (
            <g
              transform={`translate(${
                selected[2] < 180
                  ? 30
                  : selected[2] > 700
                  ? 700
                  : selected[2] - 150
              },${selected[3] + (selected[3] >= 550 ? -105 : 30)})`}
              fontFamily="roboto"
              fontSize="18px"
            >
              <rect
                x={0}
                y={0}
                width={300}
                height={100}
                stroke="#444444"
                strokeWidth={5}
                fill="#ffffff"
                fillOpacity={0.95}
              />
              <text x={12} y={24} fontWeight="bold">
                {groupedLoci.get(selected[0])![selected[1]].chromosome}:
                {(
                  groupedLoci.get(selected[0])![selected[1]].start + 1400000
                ).toLocaleString()}
                -
                {(
                  groupedLoci.get(selected[0])![selected[1]].end - 1400000
                ).toLocaleString()}
              </text>
              <text x={28} y={48}>
                {groupedLoci.get(selected[0])![selected[1]].count} significant
                SNP
                {groupedLoci.get(selected[0])![selected[1]].count !== 1
                  ? "s"
                  : ""}{" "}
                at locus
              </text>
              <text x={28} y={68}>
                lowest <tspan fontStyle="italic">P</tspan> at locus:{" "}
                {toScientificNotation(
                  groupedLoci.get(selected[0])![selected[1]].minimump,
                  2
                )}
              </text>
              <text x={12} y={88} fill="#0000ff">
                Click to explore this locus
              </text>
            </g>
          ) : null}
        </svg>
      </Box>
    </Stack>
  );
};
export default RiskLocusView;
