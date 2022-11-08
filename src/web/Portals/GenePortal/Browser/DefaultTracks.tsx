import { gql, useQuery } from '@apollo/client';
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import { associateBy } from 'queryz';
import React, { RefObject, useEffect, useMemo, useState } from 'react';
import { DenseBigBed, EmptyTrack, FullBigWig } from 'umms-gb';
import { BigRequest, RequestError } from 'umms-gb/dist/components/tracks/trackset/types';
import { ValuedPoint } from 'umms-gb/dist/utils/types';
//import { GenomicRange } from '../../../HomePage/Browser/Explorer/GenomeExplorer';
import CCRETooltip from '../../../../genome-explorer/CCRETooltip';
export type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
}

export const DEFAULT_TRACKS = (assembly: string): Map<string, { url: string }> => new Map([
    [ "cCREs", { url: `gs://gcp.wenglab.org/psychscreen/${assembly}-cCREs-DCC.bigBed` } ],
    [ "DNase", { url: `gs://gcp.wenglab.org/dnase.${assembly}.sum.bigWig` } ],
    [ "fetal brain cCREs", { url: "gs://gcp.wenglab.org/psychscreen-tracks/ENCFF586GWE.7group.bigBed" } ],
    [ "fetal brain DNase", { url: "https://encode-public.s3.amazonaws.com/2020/11/06/ffd0cc4b-0abd-498a-be12-e1b570c0fa50/ENCFF586GWE.bigWig" } ],
    [ "motifs", { url: "gs://gcp.wenglab.org/all-conserved-motifs.merged.bigBed" } ]
]);

export const TRACK_ORDER = [ "DNase", "fetal brain cCREs", "fetal brain DNase", "motifs" ];

export const COLOR_MAP: Map<string, string> = new Map([
    [ "DNase", "#06DA93" ],
    [ "H3K4me3", "#00b0d0" ]
]);

export const tracks = (assembly: string, pos: GenomicRange) => [ "cCREs", ...TRACK_ORDER ].map(x => ({ chr1: pos.chromosome!, start: pos.start, end: pos.end, ...DEFAULT_TRACKS(assembly).get(x)!, preRenderedWidth: 1400 }));

export const BIG_QUERY = gql`
query BigRequests($bigRequests: [BigRequest!]!) {
    bigRequests(requests: $bigRequests) {
        data
        error {
            errortype,
            message
        }
    }
}
`;

export type BigResponseData = BigWigData[] | BigBedData[] | BigZoomData[] | ValuedPoint[];

export type BigResponse = {
    data: BigResponseData;
    error: RequestError;
}

export type BigQueryResponse = {
    bigRequests: BigResponse[];
};

type DefaultTrackProps = {
    tracks: BigRequest[];
    domain: GenomicRange;
    onHeightChanged?: (i: number) => void;
    cCREHighlight?: GenomicRange;
    cCREHighlights?: Set<string>;
    svgRef?: RefObject<SVGSVGElement>;
    assembly: string;
    oncCREClicked?: (accession: string) => void;
    oncCREMousedOver?: (coordinates?: GenomicRange) => void;
    oncCREMousedOut?: () => void;
    onSettingsClick?: () => void;
};

const BIOSAMPLE = {
    name: "Fetal Brain",
    dnase: "ENCSR475VQD",
    h3k4me3: null,
    h3k27ac: null,
    ctcf: null,
    dnase_signal: "ENCFF586GWE",
    h3k4me3_signal: null,
    h3k27ac_signal: null,
    ctcf_signal: null
};

const DefaultTracks: React.FC<DefaultTrackProps> = props => {
    const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, { variables: { bigRequests: props.tracks }});
    useEffect( () => { props.onHeightChanged && props.onHeightChanged(105); }, [ props.onHeightChanged ]);
    const cCRECoordinateMap = useMemo( () => associateBy((data?.bigRequests[0].data || []) as BigBedData[], x => x.name, x => ({ chromosome: x.chr, start: x.start, end: x.end })), [ data ]);
    const [ settingsMousedOver, setSettingsMousedOver ] = useState(false);
    return loading || (data?.bigRequests.length || 0) < 2 ? <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." /> : (
        <>
            <g className="encode-fetal-brain">
                <rect y={10} height={55} fill="none" width={1400} /> 
            </g>
            <EmptyTrack
                height={40}
                width={1400}
                transform=""
                id=""
                text="Fetal brain cCREs and aggregated DNase-seq signal from ENCODE"
            />
            <DenseBigBed
                width={1400}
                height={30}
                domain={props.domain}
                id="fbcCREs"
                transform="translate(0,40)"
                data={(data!.bigRequests[2].data as BigBedData[]).map(x => ({ ...x, color: props.cCREHighlights?.has(x.name || "") ? "#0000ff" : x.color }))}
                tooltipContent={rect => <CCRETooltip { ...rect} biosample={BIOSAMPLE} assembly={props.assembly.toLocaleLowerCase()} />}
                svgRef={props.svgRef}
                onClick={x => props.oncCREClicked && x.name && props.oncCREClicked(x.name)}
                onMouseOver={x => props.oncCREMousedOver && x.name && props.oncCREMousedOver(cCRECoordinateMap.get(x.name))}
                onMouseOut={props.oncCREMousedOut}
            />
            <FullBigWig
                transform="translate(0,75)"
                width={1400}
                height={30}
                domain={props.domain}
                id="fbDNase"
                color="#06da93"
                data={data!.bigRequests[3].data as BigWigData[]}
            />
            <EmptyTrack
                height={40}
                width={1400}
                transform="translate(0,110)"
                text="Evolutionarily Conserved TF Motif Instances"
                id=""
            />
            <DenseBigBed
                transform="translate(0,135)"
                width={1400}
                height={30}
                domain={props.domain}
                id="motifs"
                color="#880088"
                data={data!.bigRequests[4].data as BigBedData[]}
            />
            <g className="tf-motifs">
                <rect y={110} height={55} fill="none" width={1400} /> 
            </g>
           
            { settingsMousedOver && (
                <rect width={1400} height={210} transform="translate(0,-20)" fill="#4c1f8f" fillOpacity={0.1} />
            )}
            <rect
                transform="translate(0,-20)"
                height={210}
                width={40}
                fill="#ffffff"
            />
            <rect
                height={210}
                width={15}
                fill="#4c1f8f"
                stroke="#000000"
                fillOpacity={settingsMousedOver ? 1 : 0.6}
                onMouseOver={() => setSettingsMousedOver(true)}
                onMouseOut={() => setSettingsMousedOver(false)}
                strokeWidth={1}
                transform="translate(20,-20)"
                onClick={props.onSettingsClick}
            />
            <text transform="rotate(270) translate(-150,10)" fill="#bf2604">
                Regulatory Features
            </text>
        </>
    );
}
export default DefaultTracks;

/*
            <DenseBigBed
                width={1400}
                height={30}
                domain={props.domain}
                id="cCREs"
                transform="translate(0,40)"
                data={cCREData || []}
                tooltipContent={rect => <CCRETooltip { ...rect} assembly={props.assembly.toLocaleLowerCase()} />}
                svgRef={props.svgRef}
                onClick={x => props.oncCREClicked && x.name && props.oncCREClicked(x.name)}
                onMouseOver={x => props.oncCREMousedOver && x.name && props.oncCREMousedOver(cCRECoordinateMap.get(x.name))}
                onMouseOut={props.oncCREMousedOut}
            />
            <FullBigWig
                transform="translate(0,75)"
                width={1400}
                height={30}
                domain={props.domain}
                id="DNase"
                color="#06da93"
                data={data!.bigRequests[1].data as BigWigData[]}
            />
            <EmptyTrack
                height={40}
                width={1400}
                transform="translate(0,110)"
                id=""
                text="Fetal brain cCREs and aggregated DNase-seq signal from ENCODE"
            />
*/
