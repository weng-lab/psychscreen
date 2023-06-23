import { gql, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { CustomizedTable, Typography } from '@weng-lab/psychscreen-ui-components';
import React, { useMemo } from 'react';
import { GenomicRange } from './SNPDetails';

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

export const SEARCH_QUERY = gql`
    ${CCRE_FIELDS}
    query ccre($assembly: String!, $coordinates: [GenomicRangeInput!], $accession: [String!]) {
        cCREQuery(assembly: "GRCh38", coordinates: $coordinates, accession: $accession) {
            ...CCREFields
        }
        rDHSQuery(assembly: $assembly, coordinates: $coordinates, accession: $accession) {
            accession
            coordinates {
                chromosome
                start
                end
            }
            dnaseZ: maxZ(assay: "dnase")
            h3k4me3Z: maxZ(assay: "h3k4me3")
            h3k27acZ: maxZ(assay: "h3k27ac")
            ctcfZ: maxZ(assay: "ctcf")
        }
    }
`;
export type RegulatoryElementsProps = {
    coordinates: GenomicRange;
    assembly: string;
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

export type SearchQueryResponse = {
    cCREQuery: CCREEntry[];
    rDHSQuery: CCREEntry[];
}

export const COLORS: Map<string, string> = new Map([
    [ "PLS", "#ff0000" ],
    [ "pELS", "#ffa700" ],
    [ "dELS", "#ffcd00" ],
    [ "DNase-H3K4me3", "#ffaaaa" ],
    [ "CTCF-only", "#00b0f0" ]
]);

export const GROUPS: Map<string, string> = new Map([
    [ "PLS", "promoter-like" ],
    [ "pELS", "proximal enhancer-like" ],
    [ "dELS", "distal enhancer-like" ],
    [ "DNase-H3K4me3", "DNase-H3K4me3" ],
    [ "CTCF-only", "CTCF-only" ]
]);

const RegulatoryElements: React.FC<RegulatoryElementsProps> = props => {
    const { data, loading } = useQuery<SearchQueryResponse>(SEARCH_QUERY, {
        variables: {
            assembly: props.assembly,
            coordinates: props.coordinates
        }
    });
    const ur = useMemo( () => (
        new Set((data?.cCREQuery || []).map(x => x.rDHS))
    ), [ data ]);
    const allResults = useMemo( () => [
        ...(data?.cCREQuery || []),
        ...(data?.rDHSQuery || []).filter(x => !ur.has(x.accession))
    ], [ data, ur ]);
    const combinedResults = useMemo( () => [ ...allResults ], [ allResults ]);

    const tableData = combinedResults.map(d=>{
        return [{header: 'Accession', value: d.accession},
        {header: 'Group', value:  GROUPS.get(d.group || "") || d.group || "rDHS", render: <svg height={18}>
        <rect width={10} height={10} y={3} fill={COLORS.get(d.group || "") || "#06da93" } />
        <text x={16} y={12}>{GROUPS.get(d.group || "") || d.group || "rDHS"}</text>
    </svg>},
        {header: 'DNase Z-score in fetal brain', value: (d.zScores && d.zScores[0].score) || -11, render: d.dnaseZ ? <span style={{ fontWeight: d.dnaseZ > 1.64 ? "bold" : "normal" }}>{d.dnaseZ.toFixed(2)}</span> : <span>--</span>},
        {
            header: "Chromosome",
            value: d.coordinates.chromosome!
        }, {
            header: "Start",
            value: d.coordinates.start,
            render: d.coordinates.start.toLocaleString()
        }, {
            header: "Length",
            value: d.coordinates.end - d.coordinates.start
        }
    ]
    })

    return(loading ? <>
    <Typography
            type="body"
            size="large"
            style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', fontSize: "16px", fontWeight: 400, lineHeight: "19px" }}
        >
                Loading Data...
        </Typography>
                        <br/>
    <CircularProgress color="inherit"/>
    </> : <>
    <Typography  type="display" style={{ fontWeight: 500, fontSize: "28px" }}
            size="small"> Your search returned {combinedResults.length.toLocaleString() || 0} cCREs and rDHSs.</Typography>
            {tableData && tableData.length>0 &&  <CustomizedTable style={{ width: "max-content" }}  tabledata={tableData} />}
    </> )
}

export default RegulatoryElements;