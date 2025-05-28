import React, { useMemo, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { associateBy } from "queryz";
import {
  CustomizedTable,
  Typography,
} from "@weng-lab/psychscreen-ui-components";
import { CircularProgress } from "@material-ui/core";
import { Link } from "@mui/material";
import { DataTable } from "@weng-lab/psychscreen-ui-components";
import { toScientificNotation } from "../DiseaseTraitPortal/utils";

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

const QUERYQTL = gql`
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
    }
    queriedTranscript: transcript(name: $name, assembly: $assembly) {
      associated_ccres_pls {
        intersecting_ccres {
          ...CCREFields
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
function useGenePageDataWithQTL(
  expandedCoordinates: GenomicRange,
  assembly: string,
  name: string,
  resolvedTranscript?: boolean,
  geneid?: string
) {
  const { data, loading } = useQuery<GeneQueryResponse>(QUERYQTL, {
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

  const { data: qtlsigassocData, loading: qtlsigassocLoading } = useQuery(
    QTLSIGASSOC_QUERY,
    {
      variables: {
        geneid: geneid,
        qtltype: "eQTL",
      },
      context: {
        clientName: "psychscreen",
      },
      skip: !geneid,
    }
  );

  console.log("qtlsigassocData", qtlsigassocData);
  const snpCoordinateResponse = useQuery<SNPCoordinateResponse>(
    SNP_COORDINATE_QUERY,
    {
      variables: {
        id: [
          ...(qtlsigassocData?.qtlsigassocQuery.map((x) => x.snpid) || []),
          /*...(data?.queriedTranscript[0]?.fetal_isoqtls.isoqtls.map(
            (x) => x.snp
          ) || []),*/
        ],
      },
      context: {
        clientName: "psychscreen",
      },
      skip: loading || qtlsigassocLoading || !geneid,
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
  query qtlsigassocQuery($geneid: String, $snpid: String, $qtltype: String) {
    qtlsigassocQuery(geneid: $geneid, snpid: $snpid, qtltype: $qtltype) {
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

  const { data, loading, snpCoordinateData } = useGenePageDataWithQTL(
    eexpandedCoordinates,
    "GRCh38" || "",
    props.name,
    props.resolvedTranscript,
    props.geneid
  );

  const { data: eqtlData, loading: eqtlLoading } = useQuery(DECONQTL_QUERY, {
    variables: {
      geneid: props.geneid,
    },
  });

  console.log(props.geneid, "geneid");

  const { data: qtlsigassocData, loading: qtlsigassocLoading } = useQuery(
    QTLSIGASSOC_QUERY,
    {
      variables: {
        geneid: props.geneid,
        qtltype: "eQTL",
      },
    }
  );

  const deconqtlColumns = [
    {
      header: "SNP ID",
      value: (x) => x.snpid,
      render: (d) => (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/psychscreen/snp/${d.snpid}`}
        >
          {d.snpid}
        </a>
      ),
    },
    {
      header: "Slope",
      value: (x) => x.slope.toFixed(2),
    },
    {
      header: "eQTL nominal p-value",
      HeaderRender: (x) => (
        <>
          eQTL nominal<i>P</i>
        </>
      ),
      value: (x) => toScientificNotation(x.nom_val, 2),
    },
    {
      header: "Adjusted beta pvalue",
      HeaderRender: (x) => (
        <>
          Adjusted beta<i>P</i>
        </>
      ),
      value: (x) => x.adj_beta_pval.toFixed(2),
    },
    {
      header: "r Squared",
      value: (x) => x.r_squared.toFixed(2),
    },
    {
      header: "Coordinates",
      value: (x) => "chr" + x.snp_chrom + ":" + x.snp_start,
    },
    {
      header: "Cell Type",
      value: (x) => x.celltype,
    },
  ];

  const groupedQTLs: Map<string, EQTL> = useMemo(
    () =>
      associateBy(
        (qtlsigassocData?.qtlsigassocQuery &&
          qtlsigassocData?.qtlsigassocQuery.map((q) => {
            return {
              snp: q.snpid,
              fdr: q.fdr,
              nominal_pval: q.npval,
              slope: q.slope,
            } as EQTL;
          })) ||
          [],
        (x: EQTL) => x.snp,
        (x) => x
      ),
    [qtlsigassocData]
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

  const allQTLsColumns = [
    {
      header: "SNP ID",
      value: (x) => x.id,
      render: (d) => (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href={`/psychscreen/snp/${d.id}`}
        >
          {d.id}
        </a>
      ),
    },
    {
      header: "eQTL FDR",
      value: (x) => (x.eQTL ? toScientificNotation(x.eQTL.fdr, 2) : 0),
    },
    {
      header: "eQTL nominal p-value",
      value: (x) => toScientificNotation(x.eQTL.nominal_pval, 2),
    },
    {
      header: "Coordinates",
      value: (x) => `${x.coordinates.chromosome}:${x.coordinates.start}`,
    },
    {
      header: "Intersecting cCRE",
      value: (x) =>
        x.intersecting_ccres.intersecting_ccres[0]?.accession || "--",
      render: (x) =>
        x.intersecting_ccres.intersecting_ccres[0]?.accession ? (
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
            {x.bcre ? (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://screen.beta.wenglab.org/search?assembly=GRCh38&accessions=${x.intersecting_ccres.intersecting_ccres[0]?.accession}&page=2`}
              >
                {"*" + x.intersecting_ccres.intersecting_ccres[0]?.accession}
              </a>
            ) : (
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://screen.beta.wenglab.org/search?assembly=GRCh38&accessions=${x.intersecting_ccres.intersecting_ccres[0]?.accession}&page=2`}
              >
                {x.intersecting_ccres.intersecting_ccres[0]?.accession}
              </a>
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
  ];

  useEffect(() => {
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
  if (!loading && allQTLs && allQTLs.length === 0)
    return (
      <Typography type="body" size="large">
        No eQTLs or linked candidate brain candidate cis-Regulatory Elements
        (b-cCREs) were identified for this gene.
      </Typography>
    );

  return (
    <>
      {loading || eqtlLoading || qtlsigassocLoading ? (
        <CircularProgress />
      ) : (
        <>
          {allQTLs && allQTLs.length > 0 && (
            <>
              <Typography type="headline" size="small">
                {`The following eQTLs have been identified for ${props.name} by PsychENCODE:`}
              </Typography>
              <DataTable
                columns={allQTLsColumns}
                rows={allQTLs.map((x) => {
                  return {
                    ...x,
                    bcre:
                      bccre &&
                      bccre.find(
                        (b) =>
                          b.accession ===
                          x.intersecting_ccres.intersecting_ccres[0]?.accession
                      ),
                  };
                })}
              />
              <Typography type={"label"} size="small">
                {`cCREs prefixed with an asterisk are candidate brain candidate cis-Regulatory Elements (b-cCREs)`}
              </Typography>
              <br />
              <br />
            </>
          )}
          {eqtlData && eqtlData.deconqtlsQuery.length > 0 && (
            <>
              <Typography type="headline" size="small">
                {`The following decon-eQTLs (Liu) have been identified for ${props.name} by PsychENCODE:`}
              </Typography>
              <DataTable
                columns={deconqtlColumns}
                rows={eqtlData.deconqtlsQuery}
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default AssociatedxQTL;
