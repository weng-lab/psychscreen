import { gql, useQuery } from "@apollo/client";
import { associateBy } from "queryz";
import React, { useMemo } from "react";
import { EGene } from "./SNPDetails";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Typography,
  CustomizedTable,
} from "@weng-lab/psychscreen-ui-components";
import { useNavigate } from "react-router-dom";
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

  const qtlsigData =
    qtlsigassocData &&
    qtlsigassocData.qtlsigassocQuery.map((x) => [
      {
        header: "Gene ID",
        value: x.geneid.includes("ENSG")
          ? (geneNameData &&
              geneNameData.gene.find((g) => g.id.split(".")[0] === x.geneid)
                ?.name) ||
            x.geneid
          : (transcriptNameData &&
              transcriptNameData.transcript.find(
                (g) => g.id.split(".")[0] === x.geneid.split(".")[0]
              )?.name) ||
            x.geneid,
      },
      {
        header: "Distance",
        value: x.dist,
      },
      {
        header: "Slope",
        value: x.slope.toFixed(2),
      },
      {
        header: "FDR",
        value: x.fdr.toFixed(2),
      },
      {
        header: "p",
        value: x.npval.toFixed(2),
      },
      {
        header: "Type",
        value: x.qtltype,
      },
    ]);

  const deconqtlData =
    eqtlData &&
    eqtlData.deconqtlsQuery.map((x) => [
      {
        header: "Gene ID",
        value: x.geneid,
        render: (
          <Typography
            type="body"
            size="medium"
            onClick={() => navigate("/psychscreen/gene/" + x.geneid)}
            style={{
              color: "#1976d2",
              textDecoration: "underline",
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 400,
              letterSpacing: "0.1px",
              marginBottom: "10px",
            }}
          >
            {x.geneid}
          </Typography>
        ),
      },
      {
        header: "Slope",
        value: x.slope.toFixed(2),
      },
      {
        header: "eQTL nominal p-value",
        value: x.nom_val.toExponential(2),
      },
      {
        header: "Adjusted beta pvalue",
        value: x.adj_beta_pval.toFixed(2),
      },
      {
        header: "r Squared",
        value: x.r_squared.toFixed(2),
      },
      {
        header: "coordinates",
        value: "chr" + x.snp_chrom + ":" + x.snp_start,
      },
      {
        header: "Cell Type",
        value: x.celltype,
      },
    ]);

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

  const egeneData =
    data &&
    data.gene &&
    [...genes.keys()]
      .map((k) => genes.get(k)!)
      .map((d) => {
        return [
          {
            header: "Gene",
            value: d.name,
            render: (
              <Typography
                type="body"
                size="medium"
                onClick={() => navigate("/psychscreen/gene/" + d.name)}
                style={{
                  color: "#1976d2",
                  textDecoration: "underline",
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 400,
                  letterSpacing: "0.1px",
                  marginBottom: "10px",
                }}
              >
                {d.name}
              </Typography>
            ),
          },
          {
            header: "p",
            value: d.nominal_pval,
            render: (
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
            value: d.fdr,
            render: (
              <span>
                {d.fdr < 0.001 ? d.fdr.toExponential(2) : d.fdr.toFixed(2)}
              </span>
            ),
          },
          {
            header: "slope",
            value: d.slope,
            render: <span>{d.slope.toFixed(2)}</span>,
          },
        ];
      });
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

          <CustomizedTable
            style={{ width: "max-content" }}
            tabledata={egeneData}
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
      {deconqtlData && deconqtlData.length > 0 && (
        <>
          <Typography type="title" size="large">
            {`The following decon-eQTLs have been identified for ${props.snp} by PsychENCODE:`}
          </Typography>
          <CustomizedTable
            style={{ width: "max-content" }}
            tabledata={deconqtlData}
          />
        </>
      )}
      {qtlsigData && qtlsigData.length > 0 && (
        <>
          <Typography type="title" size="large">
            {`The following eQTLs/isoQTLs (Gandal lab) have been identified for ${props.snp} by PsychENCODE:`}
          </Typography>
          <CustomizedTable
            style={{ width: "max-content" }}
            tabledata={qtlsigData}
          />
        </>
      )}
    </>
  );
};
export default EGeneTable;
