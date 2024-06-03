import React, { useMemo } from "react";
import { Grid, Container, CircularProgress } from "@mui/material";
import { DataTable } from "@weng-lab/psychscreen-ui-components";
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

const formatEntry = [
  { header: "Gene ID", value: (d)=> d.gene_id },
          { header: "Gene Name", value:(d)=> d.gene_name },
          { header: "Hsq", value:(d)=> d.hsq.toFixed(2) },
          {
            header: "p-value",
            value:(d)=>
              d.twas_p < 0.01 ? d.twas_p.toExponential(2) : d.twas_p.toFixed(2),
          },
          {
            header: "q-value",
            value:(d)=>
              d.twas_bonferroni < 0.01
                ? d.twas_bonferroni.toExponential(2)
                : d.twas_bonferroni.toFixed(2),
          },
          { header: "FDR", value: (d)=> d.dge_fdr.toFixed(2) },
          { header: "log2 fold change", value: (d)=> d.dge_log2fc.toFixed(2) },
];

const GeneAssociations: React.FC<GeneAssociationsProps> = (props) => {
  const tabledata = useMemo(
    () => props.data && [...props.data].sort((a, b) => a.twas_bonferroni - b.twas_bonferroni),
    [props.data]
  );

  return (
          props.data && tabledata ? (
             <DataTable
             columns={formatEntry}
             rows={tabledata}
             itemsPerPage={10}
             
             searchable
           />
           
          ) : (
            <CircularProgress color="inherit" />
          )
  );
};
export default GeneAssociations;
