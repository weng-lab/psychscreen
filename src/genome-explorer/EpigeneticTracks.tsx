import { gql, useQuery } from '@apollo/client';
import { BigWigData, BigBedData, BigZoomData } from "bigwig-reader";
import { GraphQLImportanceTrack } from 'bpnet-ui';
// import { associateBy } from 'queryz';
import React, { RefObject, useEffect, useMemo, useState } from 'react';
import { DenseBigBed, EmptyTrack, FullBigWig } from 'umms-gb';
import { BigRequest, RequestError } from 'umms-gb/dist/components/tracks/trackset/types';
import { ValuedPoint } from 'umms-gb/dist/utils/types';
import CCRETooltip from '../web/cCREDetails/CCRETooltip';
import { EpigeneticTracksModal } from './SettingsModals';
import TitledImportanceTrack from './TitledImportanceTrack';

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

const TitledTrack: React.FC<{ data: BigResponseData, url: string, title: string, color?: string, height: number, transform?: string, onHeightChanged?: (height: number) => void, domain: GenomicRange, svgRef?: React.RefObject<SVGSVGElement> }>
    = ({ data, url, title, height, domain, transform, onHeightChanged, svgRef, color }) => {
    useEffect( () => onHeightChanged && onHeightChanged(height + 40), [ height, onHeightChanged ]);
    return (
        <g transform={transform}>
            <EmptyTrack
                height={40}
                width={1400}
                transform="translate(0,8)"
                id=""
                text={title}
            />
            { url.endsWith(".bigBed") ? (
                <DenseBigBed
                    width={1400}
                    height={height}
                    domain={domain}
                    id="adult-bCREs"
                    transform="translate(0,40)"
                    data={data as BigBedData[]}
                    svgRef={svgRef}
                    tooltipContent={rect => <CCRETooltip { ...rect} assembly="grch38" />}
                />
            ) : (
                <FullBigWig
                    transform="translate(0,40)"
                    width={1400}
                    height={height}
                    domain={domain}
                    id="NeuN+"
                    color={color}   
                    data={data as BigWigData[]}
                    noTransparency
                />
            )}
        </g>
    );
};

const EpigeneticTracks: React.FC<EpigeneticTrackProps> = props => {
    
    const [ cTracks, setTracks ] = useState<[ string, string ][]>([
        [ "Adult brain bCREs", "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/adult_bCREs.bigBed" ],
        // [ "PSC patient ATAC-seq", "gs://gcp.wenglab.org/psychencode-analysis/chrombpnet/VLPFC/VLPFC_glia_.interpreted_regions.bigBed" ],
        [ "all brain regions, aggregated NeuN+", "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/ACC-NeuN+-healthy-ATAC.bigWig" ],
        [ "all brain regions, aggregated NeuN-", "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/ACC-NeuN--healthy-ATAC.bigWig" ],
        // [ "PSC patient ATAC-seq", "gs://gcp.wenglab.org/psychencode-analysis/chrombpnet/VLPFC/VLPFC_glia_.profile_scores.bw" ]
    ]);
    const height = useMemo( () => props.domain.end - props.domain.start <= 10000 ? 660 + cTracks.length * 70 : 530 + cTracks.length * 70, [ cTracks, props.domain ]);
    const bigRequests = useMemo( () => cTracks.map(x => ({
        chr1: props.domain.chromosome!,
        start: props.domain.start,
        end: props.domain.end,
        preRenderedWidth: 1400,
        url: x[1]
    })), [ cTracks, props ]);
    const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, { variables: { bigRequests }});
    useEffect( () => { props.onHeightChanged && props.onHeightChanged(height); }, [ props.onHeightChanged, height, props ]);
    // const cCRECoordinateMap = useMemo( () => associateBy((data?.bigRequests[0].data || []) as BigBedData[], x => x.name, x => ({ chromosome: x.chr, start: x.start, end: x.end })), [ data ]);

    const [ settingsMousedOver, setSettingsMousedOver ] = useState(false);
    const [ settingsModalShown, setSettingsModalShown ] = useState(false);

    return loading || (data?.bigRequests.length || 0) < 2 ? <EmptyTrack width={1400} height={40} transform="" id="" text="Loading..." /> : (
        <>
            <EpigeneticTracksModal
                open={settingsModalShown}
                onCancel={() => setSettingsModalShown(false)}
                onAccept={x => { setTracks(x); setSettingsModalShown(false); }}
                initialSelection={cTracks}
            />
            <g className="encode-fetal-brain">
                <rect y={10} height={55} fill="none" width={1400} /> 
            </g>
            { (data?.bigRequests || []).map( (data, i) => (
                <TitledTrack
                    height={40}
                    url={cTracks[i][1]}
                    domain={props.domain}
                    title={cTracks[i][0]}
                    svgRef={props.svgRef}
                    data={data.data}
                    transform={`translate(0,${i * 70})`}
                />
            ))}
            <g className="tf-motifs">
                <rect y={110} height={55} fill="none" width={1400} /> 
            </g>
            <TitledImportanceTrack
                transform="translate(0,230)"
                title="VLPFC neuron profile importance scores"
                height={130}
                width={1400}
                signalURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_neurons/VLPFC-f_.profile_scores.bw"
                imputedSignalURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_neurons/VLPFC-neurons_chrombpnet_nobias.bw"
                domain={props.domain}
            />
            <TitledImportanceTrack
                transform="translate(0,360)"
                title="VLPFC glia profile importance scores"
                height={130}
                width={1400}
                signalURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_glia/VLPFC_glia_.profile_scores.bw"
                imputedSignalURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/VLPFC_glia/VLPFC-glia_chrombpnet_nobias.bw"
                domain={props.domain}
            />
            <TitledImportanceTrack
                transform="translate(0,490)"
                title="PTM neuron profile importance scores"
                height={130}
                width={1400}
                positiveRegionURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_neurons/NeuN+.profile_scores.bw.pos.bb"
                negativeRegionURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_neurons/NeuN+.profile_scores.bw.neg.bb"
                neutralRegions={(data?.bigRequests[0]?.data || []) as BigBedData[]}
                signalURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_neurons/NeuN+.profile_scores.bw"
                imputedSignalURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_neurons/NeuN+.predictions_chrombpnet_nobias.bw"
                domain={props.domain}
            />
            <TitledImportanceTrack
                transform="translate(0,620)"
                title="PTM glia profile importance scores"
                height={130}
                width={1400}
                positiveRegionURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_glia/NeuN-.profile_scores.bw.pos.bb"
                negativeRegionURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_glia/NeuN-.profile_scores.bw.neg.bb"
                neutralRegions={(data?.bigRequests[0]?.data || []) as BigBedData[]}
                signalURL="gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_glia/NeuN-.profile_scores.bw"
                imputedSignalURL="gs://gcp.wenglab.org/projects/chrombpnet/workflows/PTM-glia/outputs/predictions_PTM-glia-smalltest_chrombpnet_nobias.bw"
                domain={props.domain}
            />
            { props.domain.end - props.domain.start <= 10000 && (
                <TitledImportanceTrack
                    transform="translate(0,750)"
                    title="Mammalian 241-way PhyloP from Zoonomia"
                    height={130}
                    width={1400}
                    signalURL="gs://gcp.wenglab.org/hg38.phyloP100way.bigWig"
                    domain={props.domain}
                />
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
                onClick={() => {props.onSettingsClick && props.onSettingsClick(); setSettingsModalShown(true); }}
            />
            <text transform={`rotate(270) translate(-${height / 2},12)`} textAnchor="middle" fill="#4c1f8f">
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
