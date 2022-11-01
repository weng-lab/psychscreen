
import { gql, useQuery } from '@apollo/client';
import React, {useMemo, useRef, useState, useCallback}  from 'react';
import CytobandView from './Explorer/Cytobands';
import { EmptyTrack, GenomeBrowser, RulerTrack } from 'umms-gb';
import EGeneTracks from './EGeneTracks';



export const LD_QUERY = gql`
query s($id: [String]) {
  snp: snpQuery(assembly: "hg38", snpids: $id) {
    linkageDisequilibrium(rSquaredThreshold: 0.7, population: EUROPEAN) {
      id
      rSquared
      coordinates(assembly: "hg38") {
        chromosome
        start
        end
      }
    }
  }
}
`;

export type LDQueryResponse = {
    snp: {
        linkageDisequilibrium: LDEntry[];
    }[];
};

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


const Browser: React.FC<any> = (props) => { 
    const svgRef = useRef<SVGSVGElement>(null);
    const [ coordinates, setCoordinates ] = useState<GenomicRange | null>(null);
    const [ highlight, setHighlight ] = useState<GenomicRange | null>(null);
    const eexpandedCoordinates = useMemo( () => expandCoordinates(props.coordinates), [ props.coordinates ]);
    
    const { data, loading, groupedTranscripts, expandedCoordinates, snpCoordinateData } = useGenePageData(
        eexpandedCoordinates,
        "GRCh38",
        props.name,
        props.resolvedTranscript
    );

    const l = useCallback(c => (c - expandedCoordinates.start) * 1400 / (expandedCoordinates.end - expandedCoordinates.start), [ expandedCoordinates ]);
    return (<>
        <CytobandView
            innerWidth={1000}
            height={15}
            chromosome={props.coordinates.chromosome!}
            assembly={"hg38"}
            position={props.coordinates}
        /><br />
        <GenomeBrowser
            svgRef={svgRef}
            domain={coordinates || expandedCoordinates}
            innerWidth={1400}
            width="100%"
            noMargin
            onDomainChanged={x => setCoordinates({ chromosome: expandedCoordinates.chromosome, start: Math.floor(x.start), end: Math.ceil(x.end) })}
        >
            { highlight && (
                <rect fill="#8ec7d1" fillOpacity={0.5} height={1000} x={l(highlight.start)} width={l(highlight.end) - l(highlight.start)} />
            )}
            <RulerTrack
                domain={coordinates || expandedCoordinates}
                height={30}
                width={1400}
            />
           <EGeneTracks
                genes={groupedTranscripts || []}
                expandedCoordinates={expandedCoordinates}
            />
        </GenomeBrowser>
    </>)
}

export default Browser;