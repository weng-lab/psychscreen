import React, { useMemo } from "react";
import { Container } from "@mui/material";
import Grid, { GridProps } from "@mui/material/Grid";
import { Table, TableColDef } from "@weng-lab/ui-components";
import CircularProgress from "@mui/material/CircularProgress";
import { GwasIntersectingSnpsWithCcres } from "./DiseaseIntersectingSnpsWithccres";

export type GWAS_SNP = {
  snpid: string;
  chrom: string;
  start: number;
  stop: number;
  analyses_identifying_snp: number;
  associated_gene: string;
  riskallele: string;
  association_p_val: number[];
};

export type AssociatedSnpQtlProps = GridProps & {
  disease: string;
  data: GWAS_SNP[];
};

export function compareByMinimumP(
  a: GWAS_SNP | GwasIntersectingSnpsWithCcres,
  b: GWAS_SNP | GwasIntersectingSnpsWithCcres
) {
  return Math.min(...a.association_p_val) - Math.min(...b.association_p_val);
}

const associatedSnpQtlColumns: TableColDef<GWAS_SNP>[] = [
  { field: "snpid", headerName: "SNP ID" },
  { field: "chrom", headerName: "Chromosome" },
  {
    field: "stop",
    headerName: "Position",
    type: "number",
    valueFormatter: (value: number) => value.toLocaleString(),
  },
  {
    field: "analyses_identifying_snp",
    headerName: "Number of Supporting GWAS",
    type: "number",
  },
  { field: "riskallele", headerName: "Risk Allele" },
  { field: "associated_gene", headerName: "Nearest Gene" },
  {
    field: "association_p_val",
    headerName: "GWAS p-value",
    valueGetter: (_, row) => row.association_p_val.join(","),
  },
];

const AssociatedSnpQtl: React.FC<AssociatedSnpQtlProps> = ({
  data,
  ...props
}) => {
  const sortedData = useMemo(
    () => data && [...data].sort(compareByMinimumP),
    [data]
  );

  return (
    <Grid container {...props}>
      <Grid size={{ sm: 12 }}>
        <Container style={{ marginTop: "30px", marginLeft: "130px" }}>
          {sortedData ? (
            <Table
              label="Associated SNPs"
              columns={associatedSnpQtlColumns}
              rows={sortedData}
              getRowId={(row) => row.snpid}
              divHeight={{ maxHeight: 750 }}
              emptyTableFallback="No associated SNPs found"
            />
          ) : (
            <CircularProgress color="inherit" />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};
export default AssociatedSnpQtl;
