import { GraphQLImportanceTrack } from 'bpnet-ui';
import { ImportanceTrackDataPoint } from 'bpnet-ui/dist/components/ImportanceTrack/ImportanceTrack';
import React, { useCallback, useEffect, useState } from 'react';
import { EmptyTrack } from 'umms-gb';
import { RawLogo, DNAAlphabet } from 'logojs-react';
import { GenomicRange } from '../web/Portals/GenePortal/AssociatedxQTL';

type TitledImportanceTrackProps = {
    onHeightChanged?: (height: number) => void;
    height: number;
    title: string;
    transform?: string;
    domain: GenomicRange;
    signalURL: string;
    width: number;
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

function last<T>(x: T[]): T {
    return x[x.length - 1];
}

const TitledImportanceTrack: React.FC<TitledImportanceTrackProps> = props => {
    const { height, transform, signalURL, width, title, domain } = props;
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
            body: JSON.stringify({ query: MOTIF_QUERY, variables: { "pwms": [ seqToPWM(sequence) ] } })
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

    console.log(highlights.map(x => coordinateMap(x.coordinates[0])))
    console.log(selectedHighlight, selectedHighlight !== null && `translate(${coordinateMap(highlights[selectedHighlight].coordinates[0])},30)`);

    return (
        <g transform={transform}>
            <EmptyTrack
                transform=''
                text={title}
                height={30}
                width={1400}
                id=""
            />
            <g transform="translate(0,30)">
                <GraphQLImportanceTrack
                    width={width}
                    height={height - 30}
                    endpoint="https://ga.staging.wenglab.org"
                    signalURL={signalURL}
                    sequenceURL="gs://gcp.wenglab.org/hg38.2bit"
                    coordinates={props.domain as any}
                    allowSelection
                    onSelectionEnd={onSelectionEnd}
                />
            </g>
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
            { selectedHighlight !== null && (
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
                        <text x={0} y={80} fontWeight="bold">
                            {last(highlights[selectedHighlight].motif.tomtom_matches).target_id.startsWith("MA")
                                ? last(highlights[selectedHighlight].motif.tomtom_matches).jaspar_name
                                : last(highlights[selectedHighlight].motif.tomtom_matches).target_id}
                        </text>
                    </g>
                </g>
            )}
        </g>
    );
};
export default TitledImportanceTrack;
