import { gql, useApolloClient } from '@apollo/client';
import { linearTransform } from 'jubilant-carnival';
import { associateBy } from 'queryz';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { EmptyTrack } from 'umms-gb';
import { SNP } from 'umms-gb/dist/components/tracks/ld/types';
import { expandCoordinates, GenomicRange, useGenePageData } from '../web/Portals/GenePortal/AssociatedxQTL';
import ManhattanPlotTrack, { LDEntry } from './ManhattanPlotTrack';

export const STUDIES = [{
    url: "gs://gcp.wenglab.org/GCST010763_buildGRCh37.hg38.sorted.bigBed",
    trait: "Schizophrenia (age at diagnosis)",
    author: "Bi W",
    pmid: 32589924
}, {
    url: "gs://gcp.wenglab.org/ASD_SPARK_iPSYCH_PGC.bigBed",
    trait: "Autism Spectrum Disorder",
    author: "Matoba N",
    pmid: 32747698
}];

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

const VariantTracks: React.FC<{ coordinates: GenomicRange, resolvedTranscript?: boolean, name: string, onHeightChanged?: (x: number) => void }> = (props) => {
    
    const client = useApolloClient();
    
    const eexpandedCoordinates = useMemo( () => expandCoordinates(props.coordinates), [ props.coordinates ]);
    const { data, snpCoordinateData, expandedCoordinates } = useGenePageData(
        eexpandedCoordinates,
        "GRCh38" || "",
        props.name,
        props.resolvedTranscript
    );
    const groupedQTLs = useMemo( () => associateBy((data?.queriedGene && data.queriedGene[0]?.fetal_eqtls.eqtls) || [], x => x.snp, x => x), [ data ]);
    const allQTLs = useMemo( () => (
        snpCoordinateData?.snpQuery
            .map(x => ({ ...x, eQTL: groupedQTLs.get(x.id)! }))
    ) || [], [ snpCoordinateData, groupedQTLs, props ]);

    const [ ld, setLD ] = useState<{ anchor: string; ld: LDEntry[] }>({ anchor: "", ld: [] });
    const ldSet = useMemo( () => new Map([ ...ld.ld.map(x => [ x.id, x.rSquared ]), [ ld.anchor, 1 ] ] as [ string, number ][]), [ ld ]);
    const snpMouseOver = useCallback((xx: SNP) => {
        client.query<LDQueryResponse>({
            query: LD_QUERY,
            variables: { id: [ xx.id ] }
        }).then(x => setLD({ anchor: xx.id, ld: x.data.snp[0]?.linkageDisequilibrium || [] }));
    }, [ setLD, client ]);
    const gradient = useCallback(linearTransform({ start: 0.1, end: 1 }, { start: 215, end: 0 }), []);

    const study = 32747698;
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect( () => { props.onHeightChanged && props.onHeightChanged(300); }, [ props.onHeightChanged ]);

    return (
        <>
            <EmptyTrack
                height={40}
                width={1400}
                text={`Variant Associations with ${STUDIES.filter(x => x.pmid === study)[0].trait}`}
                transform=""
                id=""
            />
            <ManhattanPlotTrack
                url={STUDIES.filter(x => x.pmid === study)[0].url}
                domain={props.coordinates || expandedCoordinates}
                onSNPMousedOver={x => snpMouseOver(({ domain: x.data.coordinates, id: x.data.rsId }))}
                snpProps={snp => ldSet.has(snp.data.rsId) ? { fill: `rgb(255,${gradient(ldSet.get(snp.data.rsId)!)},0)` } : { fill: "#dddddd", fillOpacity: 0.4 }}
                allQTLs={allQTLs}
                groupedQTLs={groupedQTLs}
                anchor={ld.anchor}
                ld={ld.ld}
                sortOrder={(a, b) => (ldSet.has(a.data.rsId) ? a.data.score : -a.data.score) - (ldSet.has(b.data.rsId) ? b.data.score : -b.data.score)}
                svgRef={svgRef}
                gene={props.name}
            />
            <g className="xqtl">
                <rect y={22} height={65} fill="none" width={1400} /> 
            </g>
        </>
    )

};
export default VariantTracks;
