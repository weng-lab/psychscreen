import React, { useMemo } from "react";
import { Grid, Container, CircularProgress, Typography } from "@mui/material";
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
          { header: "Gene Name", value:(d)=> d.gene_name,render: (d) => 
          <a target="_blank" rel="noopener noreferrer" href={`/psychscreen/gene/${d.gene_name}`}>
            <i>{d.gene_name}</i>
          </a>  },

          { header: "Hsq", value:(d)=> d.hsq.toFixed(2) },
          {
            header: "P",
            HeaderRender: () => <Typography><i>P</i></Typography>,
            value:(d)=>
              d.twas_p < 0.01 ? d.twas_p.toExponential(2) : d.twas_p.toFixed(2),
          },
          {
            header: "Q",
            HeaderRender: () => <Typography><i>Q</i></Typography>,
            value:(d)=>
              d.twas_bonferroni < 0.01
                ? d.twas_bonferroni.toExponential(2)
                : d.twas_bonferroni.toFixed(2),
          },
          { header: "FDR", value: (d)=> d.dge_fdr.toFixed(2) },
          { header: "log2(fold change)", value: (d)=> d.dge_log2fc.toFixed(2), 
          HeaderRender: () => <Typography>Log<sub>2</sub>(fold change)</Typography> },
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
