import React, { useMemo } from "react";
import { Grid, Container, GridProps } from "@mui/material";
import { CustomizedTable } from "@weng-lab/psychscreen-ui-components";
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

const AssociatedSnpQtl: React.FC<AssociatedSnpQtlProps> = ({
  data,
  ...props
}) => {
  const SnpAssociationData = useMemo(
    () =>
      data &&
      [...data].sort(compareByMinimumP).map((d: GWAS_SNP) => [
        { header: "SNP ID", value: d.snpid },
        { header: "Chromosome", value: d.chrom },
        { header: "Position", value: d.stop.toLocaleString() },
        {
          header: "Number of Supporting GWAS",
          value: d.analyses_identifying_snp,
        },
        { header: "Risk Allele", value: d.riskallele },
        { header: "Nearest Gene", value: d.associated_gene },
        { header: "GWAS p-value", value: d.association_p_val.join(",") },
      ]),
    [data]
  );

  return (
    <Grid container {...props}>
      <Grid item sm={12}>
        <Container style={{ marginTop: "30px", marginLeft: "130px" }}>
          {data ? (
            <CustomizedTable
              style={{ width: "max-content" }}
              tabledata={SnpAssociationData}
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
