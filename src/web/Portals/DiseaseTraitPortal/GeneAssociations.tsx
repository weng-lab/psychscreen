import React, { useMemo } from "react";
import { Grid, Container, CircularProgress } from "@mui/material";
import { CustomizedTable } from "@weng-lab/psychscreen-ui-components";
import { GridProps } from "@mui/material";

type GeneAssociation = {
  hsq: number;
  twas_p: number;
  twas_bonferroni: number;
  dge_log2fc: number;
  gene_id: string;
  gene_name: string;
  dge_fdr: number;
};

export type GeneAssociationsProps = GridProps & {
  disease: string;
  data: GeneAssociation[];
};

/*const GENE_ASSOCIATION_DATA = Array(10).fill({
    Symbol: 'DRD2',
    'Overall Association Score': 0.60,
    'Genetic Associations': 'No Data',
    'Text Mining': 0.08,
    'RNA Expression': 'No data'
});*/

const GeneAssociations: React.FC<GeneAssociationsProps> = (props) => {
  const tabledata = useMemo(
    () =>
      props.data &&
      [...props.data]
        .sort((a, b) => a.twas_bonferroni - b.twas_bonferroni)
        .map((d) => [
          { header: "Gene ID", value: d.gene_id },
          { header: "Gene Name", value: d.gene_name },
          { header: "Hsq", value: d.hsq.toFixed(3) },
          {
            header: "p-value",
            value:
              d.twas_p < 0.01 ? d.twas_p.toExponential(3) : d.twas_p.toFixed(3),
          },
          {
            header: "q-value",
            value:
              d.twas_bonferroni < 0.01
                ? d.twas_bonferroni.toExponential(3)
                : d.twas_bonferroni.toFixed(3),
          },
          { header: "FDR", value: d.dge_fdr.toFixed(3) },
          { header: "log2 fold change", value: d.dge_log2fc.toFixed(3) },
        ]),
    [props.data]
  );

  return (
    <Grid container {...props}>
      <Grid item sm={12}>
        <Container style={{ marginTop: "30px", marginLeft: "150px" }}>
          {props.data ? (
            <CustomizedTable
              style={{ width: "max-content" }}
              tabledata={tabledata}
            />
          ) : (
            <CircularProgress color="inherit" />
          )}
        </Container>
      </Grid>
    </Grid>
  );
};
export default GeneAssociations;
