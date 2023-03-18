import { GraphQLImportanceTrack } from 'bpnet-ui';
import { ImportanceTrackDataPoint } from 'bpnet-ui/dist/components/ImportanceTrack/ImportanceTrack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { EmptyTrack, FullBigWig } from 'umms-gb';
import { RawLogo, DNAAlphabet } from 'logojs-react';
import { GenomicRange } from '../web/Portals/GenePortal/AssociatedxQTL';
import { useQuery } from '@apollo/client';
import { BigQueryResponse, BIG_QUERY } from '../web/Portals/GenePortal/Browser/DefaultTracks';
import { BigBedData, BigWigData } from "bigwig-reader";
import { linearTransform } from '../web/Portals/GenePortal/violin/utils';

type TitledImportanceTrackProps = {
    onHeightChanged?: (height: number) => void;
    height: number;
    title: string;
    transform?: string;
    domain: GenomicRange;
    signalURL: string;
    imputedSignalURL?: string;
    positiveRegionURL?: string;
    negativeRegionURL?: string;
    neutralRegions?: BigBedData[];
    width: number;
    color?: string;
};

type TitledImportanceTrackHighlight = {
    coordinates: [ number, number ];
    sequence: string;
    motif: MotifMatch;
    reverseComplement?: boolean;
};

type MotifMatch = {
    pwm: number[][];
    tomtom_matches: {
        target_id: string;
        jaspar_name: string;
        e_value: number;
    }[];
};

type MotifResponse = {
    data: {
        meme_motif_search: {
            results: [{
                motif: MotifMatch;
                reverseComplement: boolean;
            }];
        }[];
    };
};

type SequenceResponse = {
    data: {
        bigRequests: {
            data: string;
        }[];
    };
};

const MOTIF_QUERY = `
query MemeMotifSearch($pwms: [[[Float!]]]!) {
    meme_motif_search(pwms: $pwms, assembly: "GRCh38", limit: 1, offset: 1) {
      results {
        motif {
          pwm
          tomtom_matches {
            target_id
            jaspar_name
            e_value
          }
        }
        reverseComplement
      }
    }
  }  
`;

const SEQUENCE_QUERY = `
query($requests: [BigRequest!]!) {
    bigRequests(requests: $requests) {
        data
    }
}
`;

function seqToPWM(sequence: string[]): number[][] {
    const M = { 'A': [ 1, 0, 0, 0 ], 'C': [ 0, 1, 0, 0 ], 'G': [ 0, 0, 1, 0], 'T': [ 0, 0, 0, 1 ] };
    return sequence.map(x => M[x]);
}

export const reverseComplement = (ppm: number[][]): number[][] =>
    ppm && ppm[0] && ppm[0].length === 4
        ? ppm.map(inner => inner.slice().reverse()).reverse()
        : ppm.map(entry => [entry[3], entry[2], entry[1], entry[0], entry[5], entry[4]]).reverse();

export const logLikelihood = (backgroundFrequencies: any) => (r: any) => {
    let sum = 0.0;
    r.map((x: any, i: any) => (sum += x === 0 ? 0 : x * Math.log2(x / (backgroundFrequencies[i] || 0.01))));
    return r.map((x: any) => {
        const v = x * sum;
        return v <= 0.0 ? 0.0 : v / 2;
    });
};

type TOMTOMMatch = {
    e_value: number;
    jaspar_name?: string | null;
    target_id: string;
};

function best(x: TOMTOMMatch[]): TOMTOMMatch {
    return x.sort((a, b) => a.e_value - b.e_value)[0];
}

type ImportantRegionTrackProps = {
    positiveRegions: BigBedData[];
    negativeRegions: BigBedData[];
    neutralRegions: BigBedData[];
    domain: GenomicRange;
    width: number;
    onRegionClick?: (coordinates: [number, number]) => void;
};

const ImportantRegions: React.FC<ImportantRegionTrackProps> = props => {
    const transform = linearTransform([ props.domain.start, props.domain.end ], [ 0, props.width ]);
    return (
        <g transform="translate(0,63)">
            { props.neutralRegions.map((r, i) => (
                <rect
                    key={`neutral_${i}`}
                    y={4}
                    height={3}
                    x={transform(r.start)}
                    width={transform(r.end) - transform(r.start)}
                    fill="#000000"
                />
            ))}
            { props.positiveRegions.filter(r => r.end - r.start > 3).map((r, i) => (
                <rect
                    key={`important_${i}`}
                    y={0}
                    height={12}
                    x={transform(r.start - 0.5)}
                    width={transform(r.end - 0.5) - transform(r.start - 0.5)}
                    fill="#2d4f25"
                    onClick={() => props.onRegionClick && props.onRegionClick([ r.start, r.end ])}
                />
            ))}
            { props.negativeRegions.filter(r => r.end - r.start > 3).map((r, i) => (
                <rect
                    key={`important_${i}`}
                    y={0}
                    height={12}
                    x={transform(r.start)}
                    width={transform(r.end - 0.5) - transform(r.start + 0.5)}
                    fill="#361c1c"
                    fillOpacity={0.2}
                    onClick={() => props.onRegionClick && props.onRegionClick([ r.start, r.end ])}
                />
            ))}
        </g>
    );
};

const TitledImportanceTrack: React.FC<TitledImportanceTrackProps> = props => {
    const { height, transform, signalURL, width, title, domain, imputedSignalURL, color, negativeRegionURL, positiveRegionURL } = props;
    useEffect( () => props.onHeightChanged && props.onHeightChanged(height), [ height, props.onHeightChanged ]);

    const coordinateMap = useCallback((coordinate: number) => (
        coordinate * width / (domain.end - domain.start)
    ), [ domain ]);

    const [ selectedHighlight, setSelectedHighlight ] = useState<number | null>(null);
    const [ highlights, setHighlights ] = useState<TitledImportanceTrackHighlight[]>([]);
    const onSelectionEnd = useCallback((coordinates: [ number, number ], values: ImportanceTrackDataPoint[]) => {
        const sequence = values.map(x => x.base);
        fetch("https://ga.staging.wenglab.org/graphql", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: MOTIF_QUERY, variables: { pwms: [ seqToPWM(sequence) ] } })
        })
            .then(response => response.json())
            .then(data => setHighlights([ ...highlights, {
                sequence: sequence.join(""),
                coordinates,
                motif: (data as MotifResponse).data.meme_motif_search[0].results[0].motif,
                reverseComplement: (data as MotifResponse).data.meme_motif_search[0].results[0].reverseComplement
            }]))
            .catch(error => console.error(error));
    }, [ highlights ]);
    const onImportantRegionClick = useCallback((coordinates: [ number, number ]) => {
        fetch("https://ga.staging.wenglab.org/graphql", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: SEQUENCE_QUERY,
                variables: {
                    requests: {
                        url: "gs://gcp.wenglab.org/hg38.2bit",
                        chr1: domain.chromosome,
                        chr2: domain.chromosome,
                        start: coordinates[0],
                        end: coordinates[1] + 1
                    }
                }
            })
        })
            .then(response => response.json())
            .then(data => onSelectionEnd(
                coordinates.map(x => x - domain.start) as [ number, number ],
                (data as SequenceResponse).data.bigRequests[0].data[0].split("").map(x => ({ base: x, importance: 0 }))
            ));
    }, [ onSelectionEnd, domain ]);

    const bigRequests = useMemo( () => {
        const bw = [{
            chr1: domain.chromosome!,
            start: domain.start,
            end: domain.end,
            preRenderedWidth: width,
            url: imputedSignalURL
        }];
        if (negativeRegionURL === undefined || positiveRegionURL === undefined) return bw;
        return [
            ...bw,
            {
                chr1: domain.chromosome!,
                start: domain.start,
                end: domain.end,
                preRenderedWidth: width,
                url: negativeRegionURL
            }, {
                chr1: domain.chromosome!,
                start: domain.start,
                end: domain.end,
                preRenderedWidth: width,
                url: positiveRegionURL
            }
        ];
    }, [ domain, negativeRegionURL, positiveRegionURL, imputedSignalURL ]);
    const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, { variables: { bigRequests }, skip: imputedSignalURL === undefined });
    return (
        <g transform={transform}>
            <EmptyTrack
                transform=''
                text={title}
                height={30}
                width={1400}
                id=""
            />
            { !loading && positiveRegionURL !== undefined && (
                <ImportantRegions
                    neutralRegions={props.neutralRegions || []}
                    negativeRegions={(data?.bigRequests[1].data as BigWigData[]) || []}
                    positiveRegions={(data?.bigRequests[2].data as BigWigData[]) || []}
                    width={width}
                    domain={domain}
                    onRegionClick={onImportantRegionClick}
                />
            )}
            { !loading && imputedSignalURL !== undefined && (
                <FullBigWig
                    transform="translate(0,15)"
                    width={1400}
                    height={height - (props.domain.end - props.domain.start <= 10000 ? 85 : 30)}
                    domain={domain}
                    id="NeuN+"
                    color={color}
                    data={data?.bigRequests[0].data as BigWigData[]}
                    noTransparency
                />
            ) }
            {(props.domain.end - props.domain.start <= 10000) && (
                <g transform={`translate(0,${loading || imputedSignalURL === undefined ? 30 : 80})`}>
                    <GraphQLImportanceTrack
                        width={width}
                        height={height - (loading || imputedSignalURL === undefined ? 30 : 80)}
                        endpoint="https://ga.staging.wenglab.org"
                        signalURL={signalURL}
                        sequenceURL="gs://gcp.wenglab.org/hg38.2bit"
                        coordinates={domain as any}
                        allowSelection
                        onSelectionEnd={onSelectionEnd}
                    />
                </g>
            )}
            { highlights.map((highlight, i) => (
                <rect
                    key={`highlight_${i}`}
                    transform={`translate(${coordinateMap(highlight.coordinates[0])},30)`}
                    width={coordinateMap(highlight.coordinates[1]) - coordinateMap(highlight.coordinates[0])}
                    fill="#ff0000"
                    fillOpacity={0.1}
                    height={100}
                    onMouseOver={() => setSelectedHighlight(i)}
                    onMouseOut={() => setSelectedHighlight(null)}
                />
            ))}
            { selectedHighlight !== null && highlights[selectedHighlight] && highlights[selectedHighlight].motif && (
                <g
                    transform={`translate(${coordinateMap(highlights[selectedHighlight].coordinates[0]) - 120},-150)`}
                >
                    <rect fill="#ffffff" stroke="#000000" strokeWidth={2} width={300} height={200}>
                    </rect>
                    <g transform="translate(10,60)">
                        <RawLogo
                            alphabet={DNAAlphabet}
                            values={(highlights[selectedHighlight].reverseComplement ? reverseComplement(highlights[selectedHighlight].motif.pwm) : highlights[selectedHighlight].motif.pwm).map(logLikelihood([ 0.25, 0.25, 0.25, 0.25 ]))}
                            glyphWidth={10}
                            stackHeight={50}
                            x={0}
                            y={0}
                        />
                        { highlights[selectedHighlight].motif.tomtom_matches && highlights[selectedHighlight].motif.tomtom_matches.length > 0 && (
                            <text x={0} y={80} fontWeight="bold">
                                {best(highlights[selectedHighlight].motif.tomtom_matches).target_id.startsWith("MA")
                                    ? best(highlights[selectedHighlight].motif.tomtom_matches).jaspar_name
                                    : best(highlights[selectedHighlight].motif.tomtom_matches).target_id}
                            </text>
                        )}
                    </g>
                </g>
            )}
        </g>
    );
};
export default TitledImportanceTrack;
