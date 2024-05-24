import React, { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { associateBy } from "queryz";
import {
  CustomizedTable,
  Typography,
} from "@weng-lab/psychscreen-ui-components";
import { CircularProgress } from "@material-ui/core";
import { Link } from "@mui/material";

export type GenomicRange = {
  chromosome?: string;
  start: number;
  end: number;
};

export type CCREEntry = {
  accession: string;
  coordinates: GenomicRange;
  rDHS: string;
  group?: string;
  dnaseZ?: number;
  h3k4me3Z?: number;
  h3k27acZ?: number;
  ctcfZ?: number;
  zScores?: {
    score: number;
  }[];
};

export type LDEntry = {
  id: string;
  rSquared: number;
  coordinates: GenomicRange;
};

export function expandCoordinates(
  coordinates: GenomicRange,
  l = 20000
): GenomicRange {
  return {
    chromosome: coordinates.chromosome,
    start: coordinates.start - l < 0 ? 0 : coordinates.start - l,
    end: coordinates.end + l,
  };
}

export const CCRE_FIELDS = gql`
  fragment CCREFields on CCRE {
    accession
    coordinates {
      chromosome
      start
      end
    }
    rDHS
    group
    dnaseZ: maxZ(assay: "dnase")
    h3k4me3Z: maxZ(assay: "h3k4me3")
    h3k27acZ: maxZ(assay: "h3k27ac")
    ctcfZ: maxZ(assay: "ctcf")
  }
`;

const SNP_COORDINATE_QUERY = gql`
  ${CCRE_FIELDS}
  query s($id: [String]) {
    snpQuery(assembly: "hg38", snpids: $id) {
      coordinates {
        chromosome
        start
        end
      }
      id
      intersecting_ccres {
        intersecting_ccres {
          ...CCREFields
        }
      }
    }
  }
`;

export type QTLEntry = {
  coordinates: {
    chromosome: string;
    start: number;
    end: number;
  };
  id: string;
  intersecting_ccres: {
    intersecting_ccres: CCREEntry[];
  };
  eQTL: EQTL;
};

export type SNPCoordinateResponse = {
  snpQuery: QTLEntry[];
};

const SNP_QUERY = gql`
  query s(
    $chromosome: String
    $start: Int
    $end: Int
    $coordinates: [GenomicRangeInput]
    $assembly: String!
  ) {
    snpQuery(assembly: "hg38", coordinates: $coordinates, common: true) {
      id
      coordinates {
        chromosome
        start
        end
      }
    }
    gene(
      chromosome: $chromosome
      start: $start
      end: $end
      assembly: $assembly
      version: 40
    ) {
      name
      strand
      transcripts {
        name
        strand
        exons {
          coordinates {
            chromosome
            start
            end
          }
        }
        coordinates {
          chromosome
          start
          end
        }
      }
    }
  }
`;

export type Transcript = {
  id: string;
  name: string;
  strand: string;
  coordinates: GenomicRange;
};
export type SNPQueryResponse = {
  snpQuery: {
    id: string;
    coordinates: GenomicRange;
  }[];
  gene: {
    name: string;
    strand: string;
    transcripts: Transcript[];
  }[];
};

const QUERY = gql`
  ${CCRE_FIELDS}
  query q($assembly: String!, $name: [String]) {
    queriedGene: gene(name: $name, assembly: $assembly, version: 40) {
      transcripts {
        associated_ccres_pls {
          intersecting_ccres {
            ...CCREFields
          }
        }
      }
      fetal_eqtls(population: "shared") {
        eqtls {
          snp
          fdr
          nominal_pval
          slope
        }
      }
    }
    queriedTranscript: transcript(name: $name, assembly: $assembly) {
      associated_ccres_pls {
        intersecting_ccres {
          ...CCREFields
        }
      }
      fetal_isoqtls(population: "shared") {
        isoqtls {
          snp
          fdr
          nominal_pval
          slope
        }
      }
    }
  }
`;

export type EQTL = {
  snp: string;
  fdr: number;
  nominal_pval: number;
  slope: number;
};

export type GeneQueryResponse = {
  queriedGene: {
    transcripts: {
      associated_ccres_pls: {
        intersecting_ccres: CCREEntry[];
      };
    }[];
    fetal_eqtls: {
      eqtls: EQTL[];
    };
  }[];
  queriedTranscript: {
    associated_ccres_pls: {
      intersecting_ccres: CCREEntry[];
    };
    fetal_isoqtls: {
      isoqtls: {
        snp: string;
        fdr: number;
        nominal_pval: number;
        slope: number;
      }[];
    };
  }[];
};

export function useGenePageData(
  expandedCoordinates: GenomicRange,
  assembly: string,
  name: string,
  resolvedTranscript?: boolean
) {
  const { data, loading } = useQuery<GeneQueryResponse>(QUERY, {
    variables: {
      coordinates: expandedCoordinates,
      ...expandedCoordinates,
      assembly,
      name,
    },
    context: {
      clientName: "psychscreen",
    },
  });

  const snpCoordinateResponse = useQuery<SNPCoordinateResponse>(
    SNP_COORDINATE_QUERY,
    {
      variables: {
        id: [
          ...(data?.queriedGene[0]?.fetal_eqtls.eqtls.map((x) => x.snp) || []),
          ...(data?.queriedTranscript[0]?.fetal_isoqtls.isoqtls.map(
            (x) => x.snp
          ) || []),
        ],
      },
      context: {
        clientName: "psychscreen",
      },
      skip: loading,
    }
  );

  const coordinates = useMemo(
    () =>
      expandCoordinates(
        /* {
        chromosome: snpCoordinateResponse.data?.snpQuery[0]?.coordinates.chromosome || "",
        start: Math.min(...(snpCoordinateResponse.data?.snpQuery.map(x => x.coordinates.start) || [0])),
        end: Math.max(...(snpCoordinateResponse.data?.snpQuery.map(x => x.coordinates.end) || [0]))
    }*/ expandedCoordinates,
        100000
      ),
    [expandedCoordinates]
  );

  const snpResponse = useQuery<SNPQueryResponse>(SNP_QUERY, {
    variables: { ...coordinates, coordinates, assembly },
    skip: loading || snpCoordinateResponse.loading,
  });

  const groupedTranscripts = useMemo(
    () =>
      snpResponse.data?.gene.map((x) => ({
        ...x,
        transcripts: x.transcripts.map((xx) => ({
          ...xx,
          color:
            (resolvedTranscript ? xx : x).name === name ? "#880000" : "#aaaaaa",
        })),
      })),
    [resolvedTranscript, name, snpResponse]
  );

  return {
    data: { ...snpResponse.data, ...data },
    loading: loading || snpCoordinateResponse.loading || snpResponse.loading,
    snpData: snpResponse.data,
    snpCoordinateData: snpCoordinateResponse.data,
    groupedTranscripts,
    expandedCoordinates: coordinates,
  };
}
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

const AssociatedxQTL: React.FC<any> = (props) => {
  const [bccre, setbCRE] = useState<
    { accession: string; chrom: string; start: number; end: number }[]
  >([]);

  const eexpandedCoordinates = useMemo(
    () => expandCoordinates(props.coordinates),
    [props.coordinates]
  );

  const { data, loading, snpCoordinateData } = useGenePageData(
    eexpandedCoordinates,
    "GRCh38" || "",
    props.name,
    props.resolvedTranscript
  );

  const { data: eqtlData, loading: eqtlLoading } = useQuery(DECONQTL_QUERY, {
    variables: {
      geneid: props.geneid,
    },
  });

  const { data: qtlsigassocData, loading: qtlsigassocLoading } = useQuery(
    QTLSIGASSOC_QUERY,
    {
      variables: {
        geneid: props.geneid,
      },
    }
  );

  const qtlsigData =
    qtlsigassocData &&
    qtlsigassocData.qtlsigassocQuery.map((x) => [
      {
        header: "SNP ID",
        value: x.snpid,
      },
      {
        header: "Dist",
        value: x.dist,
      },
      {
        header: "Slope",
        value: x.slope.toFixed(3),
      },
      {
        header: "FDR",
        value: x.fdr.toFixed(3),
      },
      {
        header: "Npval",
        value: x.npval.toFixed(3),
      },
    ]);

  const deconqtlData =
    eqtlData &&
    eqtlData.deconqtlsQuery.map((x) => [
      {
        header: "SNP ID",
        value: x.snpid,
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

  const groupedQTLs = useMemo(
    () =>
      associateBy(
        (data?.queriedGene && data.queriedGene[0]?.fetal_eqtls.eqtls) || [],
        (x) => x.snp,
        (x) => x
      ),
    [data]
  );
  const allQTLs = useMemo(
    () =>
      snpCoordinateData?.snpQuery.map((x) => ({
        ...x,
        eQTL: groupedQTLs.get(x.id)!,
      })) ||
      //.sort((a, b) => a.eQTL.fdr - b.eQTL.fdr)
      [],
    [snpCoordinateData, groupedQTLs]
  );

  const allQTLsData =
    allQTLs &&
    allQTLs.map((x) => [
      {
        header: "SNP ID",
        value: x.id,
      },
      {
        header: "eQTL FDR",
        value: x.eQTL ? x.eQTL.fdr.toExponential(2) : 0,
      },
      {
        header: "eQTL nominal p-value",
        value: x.eQTL.nominal_pval.toExponential(2),
      },
      {
        header: "coordinates",
        value: `${x.coordinates.chromosome}:${x.coordinates.start}`,
      },
      {
        header: "intersecting cCRE",
        value: x.intersecting_ccres.intersecting_ccres[0]?.accession || "--",
        render: x.intersecting_ccres.intersecting_ccres[0]?.accession ? (
          <Typography
            type="body"
            size="medium"
            style={{
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 400,
              letterSpacing: "0.1px",
              marginBottom: "10px",
            }}
          >
            {bccre &&
            bccre.find(
              (b) =>
                b.accession ===
                x.intersecting_ccres.intersecting_ccres[0]?.accession
            ) ? (
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href={`https://screen.beta.wenglab.org/search?assembly=GRCh38&accessions=${x.intersecting_ccres.intersecting_ccres[0]?.accession}&page=2`}
                //href={`https://screen.beta.wenglab.org/search/?q=${x.intersecting_ccres.intersecting_ccres[0]?.accession}&assembly=GRCh38`}
              >
                {"*" + x.intersecting_ccres.intersecting_ccres[0]?.accession}
              </Link>
            ) : (
              <Link
                rel="noopener noreferrer"
                target="_blank"
                href={`https://screen.beta.wenglab.org/search?assembly=GRCh38&accessions=${x.intersecting_ccres.intersecting_ccres[0]?.accession}&page=2`}
                
              >
                {x.intersecting_ccres.intersecting_ccres[0]?.accession}
              </Link>
            )}
          </Typography>
        ) : (
          <>
            <Typography type="body" size="medium">
              {"--"}
            </Typography>
          </>
        ),
      },
    ]);
  React.useEffect(() => {
    fetch("https://downloads.wenglab.org/union_bCREs.bed")
      .then((x) => x.text())
      .then((x: string) => {
        const q = x.split("\n");
        const bcres = q.map((a) => {
          let r = a.split("\t");
          return {
            accession: r[4],
            chrom: r[0],
            start: +r[1],
            end: +r[2],
          };
        });
        setbCRE(bcres);
      });
  }, []);
  if (!loading && allQTLsData && allQTLsData.length === 0)
    return (
      <Typography type="body" size="large">
        No eQTLs or linked b-cCREs were identified for this gene.
      </Typography>
    );

  return (
    <>
      {loading || eqtlLoading || qtlsigassocLoading ? (
        <CircularProgress />
      ) : (
        <>
          {allQTLsData && allQTLsData.length > 0 && (
            <>
              <Typography type="headline" size="small">
                {`The following eQTLs have been identified for ${props.name} by PsychENCODE:`}
              </Typography>
              <CustomizedTable
                style={{ width: "max-content" }}
                tabledata={allQTLsData}
              />
              <Typography type={"label"} size="small">
                {`cCREs prefixed with an asterisk are b-cCREs`}
              </Typography>
              <br />
              <br />
            </>
          )}
          {deconqtlData && deconqtlData.length > 0 && (
            <>
              <Typography type="headline" size="small">
                {`The following decon-eQTLs (Liu) have been identified for ${props.name} by PsychENCODE:`}
              </Typography>
              <CustomizedTable
                style={{ width: "max-content" }}
                tabledata={deconqtlData}
              />
            </>
          )}
          {qtlsigData && qtlsigData.length > 0 && (
            <>
              <Typography type="headline" size="small">
                {`The following eQTLs (Gandal Lab) have been identified for ${props.name} by PsychENCODE:`}
              </Typography>
              <CustomizedTable
                style={{ width: "max-content" }}
                tabledata={qtlsigData}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default AssociatedxQTL;
