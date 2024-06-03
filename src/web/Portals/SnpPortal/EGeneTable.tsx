import { gql, useQuery } from "@apollo/client";
import { associateBy } from "queryz";
import React, { useMemo } from "react";
import { EGene } from "./SNPDetails";
import CircularProgress from "@mui/material/CircularProgress";
import { DataTable } from "@weng-lab/psychscreen-ui-components";
import { Typography as MUITypography } from "@mui/material";
import {
  Typography
} from "@weng-lab/psychscreen-ui-components";
import { useNavigate } from "react-router-dom";
import { toScientificNotation } from "../DiseaseTraitPortal/utils";
const QUERY = gql`
  query q($id: [String!]) {
    gene(name_prefix: $id, assembly: "GRCh38", version: 40) {
      name
      id
    }
  }
`;

type QueryResponse = {
  gene: {
    name: string;
    id: string;
  }[];
};
const DECONQTL_QUERY = gql`
  query deconqtlsQuery($geneid: String, $snpid: String) {
    deconqtlsQuery(geneid: $geneid, snpid: $snpid) {
      celltype
      snpid
      slope
      nom_val
      geneid
      adj_beta_pval
      r_squared
      snp_chrom
      snp_start
    }
  }
`;

const QTLSIGASSOC_QUERY = gql`
  query qtlsigassocQuery($geneid: String, $snpid: String) {
    qtlsigassocQuery(geneid: $geneid, snpid: $snpid) {
      snpid
      slope
      qtltype
      dist
      geneid
      npval
      fdr
    }
  }
`;

const GENE_NAME_QUERY = gql`
  query ($assembly: String!, $name_prefix: [String!]) {
    gene(assembly: $assembly, name_prefix: $name_prefix, version: 40) {
      name
      id
    }
  }
`;
const TRANSCRIPT_NAME_QUERY = gql`
  query ($assembly: String!, $name_prefix: [String!]) {
    transcript(assembly: $assembly, name_prefix: $name_prefix) {
      name
      id
    }
  }
`;
const EGeneTable: React.FC<{ genes: EGene[]; snp: string }> = (props) => {
  const navigate = useNavigate();
  const { data, loading } = useQuery<QueryResponse>(QUERY, {
    variables: { id: props.genes.map((x) => x.gene.split(".")[0]) },
  });
  const { data: eqtlData, loading: eqtlLoading } = useQuery(DECONQTL_QUERY, {
    variables: {
      snpid: props.snp,
    },
  });

  const { data: qtlsigassocData, loading: qtlsigassocLoading } = useQuery(
    QTLSIGASSOC_QUERY,
    {
      variables: {
        snpid: props.snp,
      },
    }
  );

  const { data: geneNameData } = useQuery(GENE_NAME_QUERY, {
    variables: {
      name_prefix:
        qtlsigassocData &&
        qtlsigassocData.qtlsigassocQuery
          .map((x) => x.geneid.split(".")[0])
          .filter((x) => x.includes("ENSG")),
      assembly: "GRCh38",
    },
    skip: qtlsigassocLoading || !qtlsigassocData,
  });

  const { data: transcriptNameData } = useQuery(TRANSCRIPT_NAME_QUERY, {
    variables: {
      name_prefix:
        qtlsigassocData &&
        qtlsigassocData.qtlsigassocQuery
          .map((x) => x.geneid.split(".")[0])
          .filter((x) => x.includes("ENST")),
      assembly: "GRCh38",
    },
    skip: qtlsigassocLoading || !qtlsigassocData,
  });

 
  const qtlsigData = [
      {
        header: "Gene ID",
        value: (x) => x.geneid,
        render: (x) => x.qtltype==="eQTL" ?   
        <a target="_blank" rel="noopener noreferrer" href={`/psychscreen/gene/${x.geneid}`}>
          <i>{x.geneid}</i> 
        </a> : x.geneid
        
      },
      {
        header: "Distance",
        value:(x) =>  x.dist,
      },
      {
        header: "Slope",
        value:(x) =>  x.slope.toFixed(2),
      },
      {
        header: "FDR",
        value:(x) =>  x.fdr.toFixed(2),
      },
      {
        header: "P",
        HeaderRender: () => <MUITypography><i>P</i></MUITypography>,
        value:(x) =>  x.npval.toFixed(2),
      },
      {
        header: "Type",
        value:(x) =>  x.qtltype,
      }
    ];

  const deconqtlColumns = [
    {
      header: "Gene ID",
      value:(x) => x.geneid      
    },
    {
      header: "Slope",
      value:(x) => x.slope.toFixed(2),
    },
    {
      header: "eQTL nominal P",
      HeaderRender: () => <MUITypography>eQTL nominal <i>P</i></MUITypography>,
      value:(x) => toScientificNotation(x.nom_val,2),
    },
    {
      header: "Adjusted beta pvalue",
      value:(x) => x.adj_beta_pval.toFixed(2),
    },
    {
      header: "R Squared",
      value:(x) => x.r_squared.toFixed(2),
    },
    {
      header: "Coordinates",
      value:(x) => "chr" + x.snp_chrom + ":" + x.snp_start.toLocaleString(),
    },
    {
      header: "Cell Type",
      value:(x) => x.celltype,
    },
  ];  

  const deconqtlData =
    eqtlData &&
    eqtlData.deconqtlsQuery

  const genemap = useMemo(
    () =>
      associateBy(
        props.genes,
        (x) => x.gene,
        (x) => x
      ),
    [props]
  );
  const genes = useMemo(
    () =>
      associateBy(
        data?.gene || [],
        (x) => x.id,
        (x) =>
          ({ ...genemap.get(x.id.split(".")[0]), name: x.name } as EGene & {
            name: string;
          })
      ),
    [data, genemap]
  );

  const egenesColumns  = [
    {
      header: "Gene",
      value:(d) => d.name,
      render:(d) => (
        <a target="_blank" rel="noopener noreferrer" href={`/psychscreen/gene/${d.name}`}>
          <i>{d.name}</i> 
        </a>
      ),
    },
    {
      header: "p",
      value:(d) => d.nominal_pval,
      render:(d) => (
        <span>
          {" "}
          {d.nominal_pval < 0.001
            ? d.nominal_pval.toExponential(2)
            : d.nominal_pval.toFixed(2)}
        </span>
      ),
    },
    {
      header: "FDR",
      value:(d) => d.fdr,
      render:(d) => (
        <span>
          {d.fdr < 0.001 ? d.fdr.toExponential(2) : d.fdr.toFixed(2)}
        </span>
      ),
    },
    {
      header: "slope",
      value:(d) => d.slope,
      render: (d) => <span>{d.slope.toFixed(2)}</span>,
    }

  ]
  const egeneData =
    data &&
    data.gene &&
    [...genes.keys()]
      .map((k) => genes.get(k)!)
      
  return loading || !egeneData || qtlsigassocLoading || eqtlLoading ? (
    <>
      <Typography
        type="body"
        size="large"
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "19px",
        }}
      >
        Loading Data...
      </Typography>
      <br />
      <CircularProgress color="inherit" />
    </>
  ) : (
    <>
      {" "}
      {egeneData && egeneData.length > 0 ? (
        <>
          <Typography
            type="title"          
            size="large"
          >
            eGenes for {props.snp}:
          </Typography>

          <DataTable            
            columns={egenesColumns}
            rows={egeneData}
          />
        </>
      ) : (
        <>
          <Typography type="title" size="large">
            {" "}
            No eGenes have been identified for this SNP.
          </Typography>
          <br />
          <br />
        </>
      )}
      {deconqtlData && deconqtlData.length > 0  &&(
        <>
          <Typography type="title" size="large">
            {`The following decon-eQTLs have been identified for ${props.snp} by PsychENCODE:`}
          </Typography>
          <DataTable
            rows={deconqtlData}
            columns={deconqtlColumns}
          />
        </>
      )}
      <br/>
      {qtlsigassocData && qtlsigassocData.qtlsigassocQuery.length > 0 && (
        <>
          <Typography type="title" size="large">
            {`The following eQTLs/isoQTLs (Gandal lab) have been identified for ${props.snp} by PsychENCODE:`}
          </Typography>
          <DataTable
            
            columns={qtlsigData}
            rows={qtlsigassocData.qtlsigassocQuery.map(x=>{
              return {
                ...x,
                geneid:  x.geneid.includes("ENSG")
                ? (geneNameData &&
                    geneNameData.gene.find((g) => g.id.split(".")[0] === x.geneid)
                      ?.name) ||
                  x.geneid
                : (transcriptNameData &&
                    transcriptNameData.transcript.find(
                      (g) => g.id.split(".")[0] === x.geneid.split(".")[0]
                    )?.name) ||
                  x.geneid,
              }
            })}
            
            sortDescending
          />
        </>
      )}
    </>
  );
};
export default EGeneTable;
