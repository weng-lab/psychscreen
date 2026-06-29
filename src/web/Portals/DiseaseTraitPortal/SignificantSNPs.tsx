import React, { useMemo } from "react";
import { GWAS_SIGNIFICANT_SNPS } from "../../../data/all-significant-snps.gwas";
import { groupBy } from "queryz";
import { Table, TableColDef } from "@weng-lab/ui-components";
import { GenomicRange } from "../GenePortal/AssociatedxQTL";

type SignificantSNPEntry = {
  fdr: number;
  trait: string;
  score: number;
  TF_impact: "pos" | "neg" | "none";
  snp: string;
  tissue: string;
  coordinates: {
    chromosome: string;
    position: number;
  };
};

export function useSNPs(trait: string) {
  const all_snps = useMemo(
    () =>
      Object.keys(GWAS_SIGNIFICANT_SNPS).reduce<SignificantSNPEntry[]>(
        (v, k) => [
          ...GWAS_SIGNIFICANT_SNPS[k]
            .filter((x: SignificantSNPEntry) => x.trait === trait)
            .map((x: SignificantSNPEntry) => ({ ...x, tissue: k })),
          ...v,
        ],
        []
      ),
    [GWAS_SIGNIFICANT_SNPS]
  );
  const groupedSNPs = useMemo(
    () =>
      groupBy(
        all_snps,
        (x) => x.snp,
        (x) => x
      ),
    [all_snps]
  );
  return useMemo(
    () =>
      [...groupedSNPs.keys()].map((x) => ({
        ...groupedSNPs.get(x)![0],
        fdr: Math.min(...groupedSNPs.get(x)!.map((x) => x.fdr)),
        score: Math.max(...groupedSNPs.get(x)!.map((x) => Math.abs(x.score))),
        tissues: groupedSNPs.get(x)!.map((x) => x.tissue.replace(/-/g, " ")),
      })),
    [groupedSNPs]
  );
}

export function traitKey(trait: string): string {
  if (trait.includes("MDD")) return "MDD";
  if (trait.includes("bipolar")) return "bipolar-II";
  if (trait.includes("ADHD")) return "ADHD-meta-filtered";
  if (trait.includes("Anorexia")) return "anorexia";
  return ";";
}

type SignificantSNPsProps = {
  trait: string;
  onSNPClick?: (coordinates: GenomicRange) => void;
};

function snpWindow(
  chromosome: string,
  position: number,
  halfWidth: number = 100000
): GenomicRange {
  return {
    chromosome,
    start: position - halfWidth,
    end: position + halfWidth,
  };
}

const significantSNPsColumns: TableColDef[] = [
  { field: "snp", headerName: "SNP ID" },
  {
    field: "position",
    headerName: "position",
    valueGetter: (_, row) =>
      `${row.coordinates.chromosome}:${row.coordinates.position}`,
  },
  {
    field: "fdr",
    headerName: "FDR",
    type: "number",
    valueFormatter: (value: number) => value.toExponential(3),
  },
  {
    field: "score",
    headerName: "magnitude of predicted impact",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(3),
  },
  {
    field: "tissues",
    headerName: "active tissues",
    valueGetter: (_, row) => row.tissues.join(", "),
  },
  {
    field: "TF_impact",
    headerName: "impacts TF binding site?",
    valueGetter: (_, row) => (row.TF_impact !== "none" ? "yes" : "no"),
  },
];

const SignifcantSNPs: React.FC<SignificantSNPsProps> = ({
  trait,
  onSNPClick,
}) => {
  const significantSNPs = useSNPs(traitKey(trait));

  const tabledata = useMemo(
    () => [...significantSNPs].sort((a, b) => a.fdr - b.fdr),
    [significantSNPs]
  );

  return tabledata.length > 0 ? (
    <Table
      label="Significant SNPs"
      columns={significantSNPsColumns}
      rows={tabledata}
      getRowId={(row) => row.snp}
      divHeight={{ maxHeight: 750 }}
      emptyTableFallback="No significant SNPs found"
      onRowClick={(params) => {
        if (onSNPClick)
          onSNPClick(
            snpWindow(
              params.row.coordinates.chromosome,
              params.row.coordinates.position
            )
          );
      }}
    />
  ) : (
    <></>
  );
};
export default SignifcantSNPs;
