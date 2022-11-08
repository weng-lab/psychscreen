import { gql, useQuery } from '@apollo/client';
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import { GraphQLImportanceTrack } from 'bpnet-ui';
import { associateBy } from 'queryz';
import React, { RefObject, useEffect, useMemo, useState } from 'react';
import { DenseBigBed, EmptyTrack, FullBigWig } from 'umms-gb';
import { BigRequest, RequestError } from 'umms-gb/dist/components/tracks/trackset/types';
import { ValuedPoint } from 'umms-gb/dist/utils/types';

export const DEFAULT_TRACKS = (assembly: string): Map<string, { url: string }> => new Map([
    [ "adult bCREs", { url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/adult_bCREs.bigBed" } ],
    [ "PsychSCREEN aggregated NeuN+ ATAC-seq", { url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/all-NeuN+-ATAC.bigWig" } ],
    [ "PsychSCREEN aggregated NeuN- ATAC-seq", { url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/all-NeuN--ATAC.bigWig" } ],
    [ "PsychSCREEN aggregated non-sorted ATAC-seq", { url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/all-mixed-ATAC.bigWig" } ],
    [ "motifs", { url: "gs://gcp.wenglab.org/all-conserved-motifs.merged.bigBed" } ]
]);

export const TRACK_ORDER = [ "adult bCREs", "PsychSCREEN aggregated NeuN+ ATAC-seq", "PsychSCREEN aggregated NeuN- ATAC-seq", "PsychSCREEN aggregated non-sorted ATAC-seq", "motifs" ];

export const COLOR_MAP: Map<string, string> = new Map([
    [ "PsychSCREEN aggregated NeuN+ ATAC-seq", "#0d825d" ],
    [ "PsychSCREEN aggregated NeuN- ATAC-seq", "#164182" ],
    [ "PsychSCREEN aggregated non-sorted ATAC-seq", "#1c8099" ],
]);

export const tracks = (assembly: string, pos: GenomicRange) => TRACK_ORDER.map(x => ({ chr1: pos.chromosome!, start: pos.start, end: pos.end, ...DEFAULT_TRACKS(assembly).get(x)!, preRenderedWidth: 1400 }));

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

type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
};

export type BigResponseData = BigWigData[] | BigBedData[] | BigZoomData[] | ValuedPoint[];

export type BigResponse = {
    data: BigResponseData;
    error: RequestError;
}

export type BigQueryResponse = {
    bigRequests: BigResponse[];
};

type EpigeneticTrackProps = {
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

const EpigeneticTracks: React.FC<EpigeneticTrackProps> = props => {
    const height = useMemo( () => props.domain.end - props.domain.start <= 10000 ? 350 : 250, [ props.domain ]);
    const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, { variables: { bigRequests: props.tracks }});
    useEffect( () => { props.onHeightChanged && props.onHeightChanged(height); }, [ props.onHeightChanged, height, props ]);
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
                text="Adult brain cCREs (bCREs)"
            />
            <DenseBigBed
                width={1400}
                height={30}
                domain={props.domain}
                id="adult-bCREs"
                transform="translate(0,40)"
                data={(data!.bigRequests[0].data as BigBedData[]).map(x => ({ ...x, color: props.cCREHighlights?.has(x.name || "") ? "#0000ff" : x.color }))}
                svgRef={props.svgRef}
                onClick={x => props.oncCREClicked && x.name && props.oncCREClicked(x.name)}
                onMouseOver={x => props.oncCREMousedOver && x.name && props.oncCREMousedOver(cCRECoordinateMap.get(x.name))}
                onMouseOut={props.oncCREMousedOut}
            />
            <EmptyTrack
                height={40}
                width={1400}
                transform="translate(0, 75)"
                id=""
                text="PsychSCREEN aggregated NeuN+ ATAC-seq"
            />
            <FullBigWig
                transform="translate(0,115)"
                width={1400}
                height={30}
                domain={props.domain}
                id="NeuN+"
                color={COLOR_MAP.get("PsychSCREEN aggregated NeuN+ ATAC-seq")}
                data={data!.bigRequests[1].data as BigWigData[]}
                noTransparency
            />
            <EmptyTrack
                height={40}
                width={1400}
                transform="translate(0,150)"
                id=""
                text="PsychSCREEN aggregated NeuN- ATAC-seq"
            />
            <FullBigWig
                transform="translate(0,190)"
                width={1400}
                height={30}
                domain={props.domain}
                id="NeuN+"
                color={COLOR_MAP.get("PsychSCREEN aggregated NeuN- ATAC-seq")}
                data={data!.bigRequests[2].data as BigWigData[]}
                noTransparency
            />
            <g className="tf-motifs">
                <rect y={110} height={55} fill="none" width={1400} /> 
            </g>
            { props.domain.end - props.domain.start <= 10000 && (
                <EmptyTrack
                    transform="translate(0,220)"
                    text="Sequence Scaled by PhyloP 100-way"
                    height={30}
                    width={1400}
                    id=""
                />
            )}
            { props.domain.end - props.domain.start <= 10000 && (
                <g transform="translate(0,250)">
                    <GraphQLImportanceTrack
                        width={1400}
                        height={100}
                        endpoint="https://ga.staging.wenglab.org"
                        signalURL="gs://gcp.wenglab.org/hg38.phyloP100way.bigWig"
                        sequenceURL="gs://gcp.wenglab.org/hg38.2bit"
                        coordinates={props.domain as any}
                    />
                </g>
            )}
            { settingsMousedOver && (
                <rect width={1400} height={height} transform="translate(0,-0)" fill="#4c1f8f" fillOpacity={0.1} />
            )}
            <rect
                transform="translate(0,0)"
                height={height}
                width={40}
                fill="#ffffff"
            />
            <rect
                height={height}
                width={15}
                fill="#4c1f8f"
                stroke="#000000"
                fillOpacity={settingsMousedOver ? 1 : 0.6}
                onMouseOver={() => setSettingsMousedOver(true)}
                onMouseOut={() => setSettingsMousedOver(false)}
                strokeWidth={1}
                transform="translate(20,0)"
                onClick={props.onSettingsClick}
            />
            <text transform={`rotate(270) translate(-${height === 350 ? 250 : 190},12)`} fill="#4c1f8f">
                Regulatory Features
            </text>
        </>
    );
}
export default EpigeneticTracks;

/*
            <EmptyTrack
                height={40}
                width={1400}
                transform="translate(0,225)"
                id=""
                text="PsychSCREEN aggregated non-sorted ATAC-seq"
            />
            <FullBigWig
                transform="translate(0,265)"
                width={1400}
                height={30}
                domain={props.domain}
                id="NeuN+"
                color={COLOR_MAP.get("PsychSCREEN aggregated non-sorted ATAC-seq")}
                data={data!.bigRequests[3].data as BigWigData[]}
                noTransparency
            />
            <EmptyTrack
                height={40}
                width={1400}
                transform="translate(0,295)"
                text="Evolutionarily Conserved TF Motif Instances"
                id=""
            />
            <DenseBigBed
                transform="translate(0,335)"
                width={1400}
                height={30}
                domain={props.domain}
                id="motifs"
                color="#880088"
                data={data!.bigRequests[4].data as BigBedData[]}
            />
*/
