import React, { useCallback, useMemo, useReducer, useRef } from 'react';
import { GenomeBrowser, GraphQLTrackSet, GraphQLTranscriptTrack, WrappedDenseBigBed, WrappedFullBigWig, WrappedPackTranscriptTrack, WrappedRulerTrack, WrappedSquishTranscriptTrack } from 'umms-gb';
import CCRETooltip from '../CCRETooltip';
import { COLOR_MAP, DEFAULT_TRACKS, TRACK_ORDER } from './constants';
import CytobandView from './Cytobands';
import { GenomeExplorerActions, genomeExplorerReducer } from './reducer';

export type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
}

export type GenomeExplorerState = {
    position: GenomicRange;
    highlights: GenomicRange[];
    nextHighlight?: GenomicRange;
};

export type GenomeExplorerProps = {
    initialPosition: GenomicRange;
    initialHighlights?: GenomicRange[];
    oncCREClicked?: (accession: string) => void;
    assembly: string;
};

const GenomeExplorer: React.FC<GenomeExplorerProps> = props => {
    const [ state, dispatch ] = useReducer(genomeExplorerReducer, {
        position: props.initialPosition,
        highlights: props.initialHighlights || []
    });
    const svgRef = useRef<SVGSVGElement>(null);
    const pos = useMemo( () => ({ chr1: state.position.chromosome!, start: state.position.start, end: state.position.end }), [ state.position ]);
    const tracks = useMemo( () => [ "cCREs", ...TRACK_ORDER.get(props.assembly)! ].map(x => ({ ...pos, ...DEFAULT_TRACKS.get(props.assembly.toLocaleLowerCase())!.get(x)!, preRenderedWidth: 1850 })), [ pos ]);
    const l = useCallback(c => (c - state.position.start) * 1850 / (state.position.end - state.position.start), [ state ]);

    return (
        <>
            { props.initialPosition.chromosome && (
                <CytobandView
                    innerWidth={1000}
                    height={15}
                    chromosome={props.initialPosition.chromosome}
                    assembly={props.assembly === "GRCh38" ? "hg38" : "mm10"}
                    position={props.initialPosition}
                />
            )}
            <GenomeBrowser
                domain={state.position}
                innerWidth={2000}
                width="100%"
                onDomainChanged={domain => { dispatch({ type: GenomeExplorerActions.GENOME_EXPLORER_DOMAIN_CHANGED, domain: { ...domain, chromosome: state.position.chromosome } }) }}
                svgRef={svgRef}
            >
                { state.highlights.map( x => (
                    <g transform="translate(150,0)">
                        <rect fill="#8ec7d1" fillOpacity={0.5} height={1000} x={l(x.start)} width={l(x.end) - l(x.start)} />
                    </g>
                ))}
                <WrappedRulerTrack width={2000} height={50} domain={state.position} id="ruler" />
                <GraphQLTranscriptTrack
                    id="gencode"
                    endpoint="https://ga.staging.wenglab.org/graphql"
                    assembly={props.assembly}
                    domain={state.position}
                    transform=""
                >
                    { props.initialPosition.end - props.initialPosition.start >= 20000 ? (
                        <WrappedSquishTranscriptTrack
                            title="GENCODE v29 genes"
                            titleSize={15}
                            rowHeight={20}
                            width={2000}
                            domain={state.position}
                            id="innergencode"
                        />
                    ) : (
                        <WrappedPackTranscriptTrack
                            title="GENCODE v29 transcripts"
                            titleSize={15}
                            rowHeight={20}
                            width={2000}
                            domain={state.position}
                            id="innergencode"
                        />
                    )}
                </GraphQLTranscriptTrack>
                {/*<GraphQLTrackSet id="main" tracks={tracks} transform="" endpoint="https://ga.staging.wenglab.org/graphql" width={2000}>
                    {<>
                        <WrappedDenseBigBed
                        title="cCREs"
                        titleSize={15}
                        width={2000}
                        height={60}
                        domain={state.position}
                        id="cCREs"
                        svgRef={svgRef}
                        tooltipContent={rect => <CCRETooltip { ...rect} assembly={props.assembly.toLocaleLowerCase()} />}
                        onClick={x => props.oncCREClicked && x.name && props.oncCREClicked(x.name)}
                    />
                    { TRACK_ORDER.get(props.assembly)!.map( m => (
                        <WrappedFullBigWig
                            titleSize={15}
                            title={`aggregated ${m} signal across all ENCODE biosamples`}
                            width={2000}
                            height={100}
                            domain={state.position}
                            id={m}
                            key={m}
                            color={COLOR_MAP.get(m)}
                        />
                    ))}
                    </> as any
                    } as any
                </GraphQLTrackSet> */}
            </GenomeBrowser>
        </>
    );
};
export default GenomeExplorer;
