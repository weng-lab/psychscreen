import React, { useMemo, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import { associateBy } from "queryz";
import { CircularProgress, Typography } from "@mui/material";
import { Table, TableColDef } from "@weng-lab/ui-components";
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
  l = 20000,
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
  resolvedTranscript?: boolean,
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
            (x) => x.snp,
          ) || []),
        ],
      },
      context: {
        clientName: "psychscreen",
      },
      skip: loading,
    },
  );

  const coordinates = useMemo(
    () =>
      expandCoordinates(
        /* {
        chromosome: snpCoordinateResponse.data?.snpQuery[0]?.coordinates.chromosome || "",
        start: Math.min(...(snpCoordinateResponse.data?.snpQuery.map(x => x.coordinates.start) || [0])),
        end: Math.max(...(snpCoordinateResponse.data?.snpQuery.map(x => x.coordinates.end) || [0]))
    }*/ expandedCoordinates,
        100000,
      ),
    [expandedCoordinates],
  );

  const snpResponse = useQuery<SNPQueryResponse>(SNP_QUERY, {
    variables: { ...coordinates, coordinates, assembly },
    skip: loading || snpCoordinateResponse.loading,
    context: { clientName: "staging" },
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
    [resolvedTranscript, name, snpResponse],
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
  geneid?: string,
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
    },
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
    },
  );

  const coordinates = useMemo(
    () =>
      expandCoordinates(
        /* {
        chromosome: snpCoordinateResponse.data?.snpQuery[0]?.coordinates.chromosome || "",
        start: Math.min(...(snpCoordinateResponse.data?.snpQuery.map(x => x.coordinates.start) || [0])),
        end: Math.max(...(snpCoordinateResponse.data?.snpQuery.map(x => x.coordinates.end) || [0]))
    }*/ expandedCoordinates,
        100000,
      ),
    [expandedCoordinates],
  );

  const snpResponse = useQuery<SNPQueryResponse>(SNP_QUERY, {
    variables: { ...coordinates, coordinates, assembly },
    skip: loading || snpCoordinateResponse.loading,
    context: { clientName: "staging" },
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
    [resolvedTranscript, name, snpResponse],
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

const deconqtlColumns: TableColDef[] = [
  {
    field: "snpid",
    headerName: "SNP ID",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/snp/${params.value}`}
        style={{ color: "#0000EE" }}
      >
        {params.value}
      </a>
    ),
  },
  {
    field: "slope",
    headerName: "Slope",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "nom_val",
    headerName: "eQTL nominal p-value",
    type: "number",
    renderHeader: () => (
      <>
        eQTL nominal<i>P</i>
      </>
    ),
    valueFormatter: (value: number) => toScientificNotation(value, 2),
  },
  {
    field: "adj_beta_pval",
    headerName: "Adjusted beta pvalue",
    type: "number",
    renderHeader: () => (
      <>
        Adjusted beta<i>P</i>
      </>
    ),
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "r_squared",
    headerName: "r Squared",
    type: "number",
    valueFormatter: (value: number) => value.toFixed(2),
  },
  {
    field: "coordinates",
    headerName: "Coordinates",
    valueGetter: (_, row) => `chr${row.snp_chrom}:${row.snp_start}`,
  },
  { field: "celltype", headerName: "Cell Type" },
];

const allQTLsColumns: TableColDef[] = [
  {
    field: "id",
    headerName: "SNP ID",
    renderCell: (params) => (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href={`/snp/${params.value}`}
        style={{ color: "#0000EE" }}
      >
        {params.value}
      </a>
    ),
  },
  {
    field: "eQTLFdr",
    headerName: "eQTL FDR",
    valueGetter: (_, row) =>
      row.eQTL ? toScientificNotation(row.eQTL.fdr, 2) : 0,
  },
  {
    field: "eQTLNominalPval",
    headerName: "eQTL nominal p-value",
    valueGetter: (_, row) => toScientificNotation(row.eQTL.nominal_pval, 2),
  },
  {
    field: "snpCoordinates",
    headerName: "Coordinates",
    valueGetter: (_, row) =>
      `${row.coordinates.chromosome}:${row.coordinates.start}`,
  },
  {
    field: "intersectingCcre",
    headerName: "Intersecting cCRE",
    valueGetter: (_, row) =>
      row.intersecting_ccres.intersecting_ccres[0]?.accession || "--",
    renderCell: (params) => {
      const accession =
        params.row.intersecting_ccres.intersecting_ccres[0]?.accession;
      return accession ? (
        <Typography
          variant="body1"
          style={{
            fontSize: "14px",
            lineHeight: "20px",
            fontWeight: 400,
            letterSpacing: "0.1px",
            marginBottom: "10px",
          }}
        >
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://screen.beta.wenglab.org/search?assembly=GRCh38&accessions=${accession}&page=2`}
            style={{ color: "#0000EE" }}
          >
            {params.row.bcre ? `*${accession}` : accession}
          </a>
        </Typography>
      ) : (
        <Typography variant="body1">{"--"}</Typography>
      );
    },
  },
];

const AssociatedxQTL: React.FC<any> = (props) => {
  const [bccre, setbCRE] = useState<
    { accession: string; chrom: string; start: number; end: number }[]
  >([]);

  const eexpandedCoordinates = useMemo(
    () => expandCoordinates(props.coordinates),
    [props.coordinates],
  );

  const { data, loading, snpCoordinateData } = useGenePageDataWithQTL(
    eexpandedCoordinates,
    "GRCh38",
    props.name,
    props.resolvedTranscript,
    props.geneid,
  );

  const { data: eqtlData, loading: eqtlLoading } = useQuery(DECONQTL_QUERY, {
    variables: {
      geneid: props.geneid,
    },
    context: { clientName: "staging" },
  });

  console.log(props.geneid, "geneid");

  const { data: qtlsigassocData, loading: qtlsigassocLoading } = useQuery(
    QTLSIGASSOC_QUERY,
    {
      variables: {
        geneid: props.geneid,
        qtltype: "eQTL",
      },
      context: { clientName: "staging" },
    },
  );

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
        (x) => x,
      ),
    [qtlsigassocData],
  );
  const allQTLs = useMemo(
    () =>
      snpCoordinateData?.snpQuery.map((x) => ({
        ...x,
        eQTL: groupedQTLs.get(x.id)!,
      })) ||
      //.sort((a, b) => a.eQTL.fdr - b.eQTL.fdr)
      [],
    [snpCoordinateData, groupedQTLs],
  );

  useEffect(() => {
    fetch("https://downloads.wenglab.org/union_bCREs.bed")
      .then((x) => x.text())
      .then((x: string) => {
        const q = x.split("\n");
        const bcres = q.map((a) => {
          const r = a.split("\t");
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
      <Typography variant="body1">
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
              <Typography variant="h6">
                {`The following eQTLs have been identified for ${props.name} by PsychENCODE:`}
              </Typography>
              <Table
                label="eQTLs (PsychENCODE)"
                columns={allQTLsColumns}
                rows={allQTLs.map((x) => {
                  return {
                    ...x,
                    bcre:
                      bccre &&
                      bccre.find(
                        (b) =>
                          b.accession ===
                          x.intersecting_ccres.intersecting_ccres[0]?.accession,
                      ),
                  };
                })}
                getRowId={(row) => row.id}
                divHeight={{ maxHeight: 750 }}
                emptyTableFallback="No eQTLs found"
              />
              <Typography variant="caption">
                {`cCREs prefixed with an asterisk are candidate brain candidate cis-Regulatory Elements (b-cCREs)`}
              </Typography>
              <br />
              <br />
            </>
          )}
          {eqtlData && eqtlData.deconqtlsQuery.length > 0 && (
            <>
              <Typography variant="h6">
                {`The following decon-eQTLs (Liu) have been identified for ${props.name} by PsychENCODE:`}
              </Typography>
              <Table
                label="Decon-eQTLs (Liu)"
                columns={deconqtlColumns}
                rows={eqtlData.deconqtlsQuery}
                getRowId={(row) => `${row.snpid}-${row.celltype}`}
                divHeight={{ maxHeight: 750 }}
                emptyTableFallback="No decon-eQTLs found"
              />
            </>
          )}
        </>
      )}
    </>
  );
};

export default AssociatedxQTL;
