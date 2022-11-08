import React, {useMemo}  from 'react';
import { gql, useQuery } from '@apollo/client';
import { associateBy } from 'queryz';
import { CustomizedTable, Typography } from '@zscreen/psychscreen-ui-components';
import { CircularProgress } from '@material-ui/core';

export type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
}

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

export function expandCoordinates(coordinates: GenomicRange, l = 20000): GenomicRange {
    return {
        chromosome: coordinates.chromosome,
        start: coordinates.start - l < 0 ? 0 : coordinates.start - l,
        end: coordinates.end + l
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
}`;

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
query s($chromosome: String, $start: Int, $end: Int, $coordinates: [GenomicRangeInput], $assembly: String!) {
  snpQuery(assembly: "hg38", coordinates: $coordinates, common: true) {
    id
    coordinates {
      chromosome
      start
      end
    }
  }
  gene(chromosome: $chromosome, start: $start, end: $end, assembly: $assembly) {
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
  queriedGene: gene(name: $name, assembly: $assembly) {
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

export function useGenePageData(expandedCoordinates: GenomicRange, assembly: string, name: string, resolvedTranscript?: boolean) {

    const { data, loading } = useQuery<GeneQueryResponse>(QUERY, {
        variables: {
            coordinates: expandedCoordinates,
            ...expandedCoordinates,
            assembly,
            name
        }, context: {
			clientName: 'psychscreen'
		}
    });

    const snpCoordinateResponse = useQuery<SNPCoordinateResponse>(SNP_COORDINATE_QUERY, {
        variables: {
            id: [
                ...(data?.queriedGene[0]?.fetal_eqtls.eqtls.map(x => x.snp) || []),
                ...(data?.queriedTranscript[0]?.fetal_isoqtls.isoqtls.map(x => x.snp) || [])
            ]
        }, context: {
			clientName: 'psychscreen'
		},
        skip: loading
    });
    
    const coordinates = useMemo( () => expandCoordinates(/* {
        chromosome: snpCoordinateResponse.data?.snpQuery[0]?.coordinates.chromosome || "",
        start: Math.min(...(snpCoordinateResponse.data?.snpQuery.map(x => x.coordinates.start) || [0])),
        end: Math.max(...(snpCoordinateResponse.data?.snpQuery.map(x => x.coordinates.end) || [0]))
    }*/ expandedCoordinates, 100000), [ expandedCoordinates ]);

    const snpResponse = useQuery<SNPQueryResponse>(SNP_QUERY, {
        variables: { ...coordinates, coordinates, assembly },
        skip: loading || snpCoordinateResponse.loading
    });

    const groupedTranscripts = useMemo( () => snpResponse.data?.gene.map(
        x => ({
            ...x,
            transcripts: x.transcripts.map(xx => ({ ...xx, color: (resolvedTranscript ? xx : x).name === name ? "#880000" : "#aaaaaa" }))
        })
    ), [ resolvedTranscript, name, snpResponse ]);

    return {
        data: { ...snpResponse.data, ...data },
        loading: loading || snpCoordinateResponse.loading || snpResponse.loading,
        snpData: snpResponse.data,
        snpCoordinateData: snpCoordinateResponse.data,
        groupedTranscripts,
        expandedCoordinates: coordinates
    };

}



const AssociatedxQTL: React.FC<any> = (props) => { 

    const eexpandedCoordinates = useMemo( () => expandCoordinates(props.coordinates), [ props.coordinates ]);
    
    const { data, loading, snpCoordinateData } = useGenePageData(
        eexpandedCoordinates,
        "GRCh38" || "",
        props.name,
        props.resolvedTranscript
    );
    const groupedQTLs = useMemo( () => associateBy((data?.queriedGene && data.queriedGene[0]?.fetal_eqtls.eqtls) || [], x => x.snp, x => x), [ data ]);

    const allQTLs = useMemo( () => (
        snpCoordinateData?.snpQuery
            .map(x => ({ ...x, eQTL: groupedQTLs.get(x.id)! }))            
    ) || [], [ snpCoordinateData, groupedQTLs ]);
    
    const allQTLsData =allQTLs && allQTLs.map(x=> [{
        header: "SNP ID",
        value: x.id
    }, {
        header: "eQTL FDR",
        value: x.eQTL.fdr.toExponential(2)
    }, {
        header: "eQTL nominal p-value",
        value: x.eQTL.nominal_pval.toExponential(2)
    }, {
        header: "coordinates",
        value: `${x.coordinates.chromosome}:${x.coordinates.start}`
    }, {
        header: "intersecting cCRE",
        value:  x.intersecting_ccres.intersecting_ccres[0]?.accession || "--",
        render:  (
            <span
                style={{ color: x.intersecting_ccres.intersecting_ccres[0] ? "#006edb" : "#000000" }}
            >
                {x.intersecting_ccres.intersecting_ccres[0]?.accession || "--"}
            </span>
        )
    }]);
    
    if (!loading && allQTLsData && allQTLsData.length === 0) return (
        <Typography type="body" size="large">
            No eQTLs or linked bCREs were identified for this gene.
        </Typography>
    );

    return (
        <>
            { loading ? (
                <CircularProgress />
            ) : allQTLsData && allQTLsData.length > 0 && (
                <CustomizedTable style={{ width: "max-content" }} tabledata={allQTLsData} />
            )}
        </>
    );

}


export default AssociatedxQTL