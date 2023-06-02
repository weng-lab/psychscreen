import React, { useMemo } from 'react';
import { FullBigWig } from 'umms-gb';
import { GenomicRange } from '../../web/Portals/GenePortal/AssociatedxQTL';

export type BigWigDataPoint = {
    x: number;
    max: number;
    min: number;
    value: number;
};

type SubtractedBigWigProps = {
    dataA: BigWigDataPoint[];
    dataB: BigWigDataPoint[];
    width: number;
    height: number;
    domain: GenomicRange;
    transform?: string;
};

const SubtractedBigWigTrack: React.FC<SubtractedBigWigProps>
    = ({ dataA, dataB, width, height, domain, transform }) => {

        // compute the difference between the two tracks as separate negative and positive regions
        const [ singleValuesA, singleValuesB ] = useMemo( () => [ dataA, dataB ].map( data => (
            data.map(x => ({
                ...x,
                min: (x.max + x.min) / 2,
                max: (x.max + x.min) / 2
            }))
        )), [ dataA, dataB ]);
            const range = useMemo( () => ({
            max: Math.max(...singleValuesA.map(x => x.max), ...singleValuesB.map(x => x.max)),
            min: -Math.max(...singleValuesA.map(x => x.max), ...singleValuesB.map(x => x.max))
        }), [ singleValuesA, singleValuesB ]);
        const difference = useMemo( () => ([
            ...singleValuesA.map((a, i) => ({
                ...a,
                min: a.min - singleValuesB[i].min,
                max: a.min - singleValuesB[i].max,
            })), {
                min: 0,
                max: 0,
                x: width + 1,
                value: 0
            }
        ]), [ singleValuesA, singleValuesB, range, width ]);
        const [ negatives, positives ] = useMemo( () => [
            difference.map(x => ({ ...x, min: x.min < 0 ? x.min : 0, max: x.max < 0 ? x.max : 0 })),
            difference.map(x => ({ ...x, min: x.min > 0 ? x.min : 0, max: x.max > 0 ? x.max : 0 })),
        ], [ difference ]);

        // display the tracks
        return (
            <>
                <FullBigWig
                    data={negatives}
                    color="#9e2911"
                    width={width}
                    height={height}
                    domain={domain}
                    id="negatives"
                    range={range}
                    transform={transform}
                />
                <FullBigWig
                    data={positives}
                    color="#3c8c5f"
                    width={width}
                    height={height}
                    domain={domain}
                    id="positives"
                    range={range}
                    transform={transform}
                />
            </>
        );

    };
export default SubtractedBigWigTrack;
