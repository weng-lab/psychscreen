import { useQuery } from '@apollo/client';
import { GenomicRange } from '../../web/Portals/GenePortal/AssociatedxQTL';
import React, { useCallback, useMemo } from 'react';
import { DenseBigBed, EmptyTrack, FullBigWig } from 'umms-gb';
import { BigBedData, BigWigData } from 'bigwig-reader';
import { BigQueryResponse, BIG_QUERY } from '../EpigeneticTracks';
import SubtractedBigWigTrack, { BigWigDataPoint } from './SubtractedBigWig';
import { linearTransform } from '../../web/Portals/GenePortal/violin/utils';

type GWASPredictionTrackProps = {
    riskBigBedURL: string;
    protectiveBigBedURL: string;
    riskPredictionBigWigURL: string;
    protectivePredictionBigWigURL: string;
    width: number;
    height: number;
    domain: GenomicRange;
    transform?: string;
};

const GWASPredictionTrack: React.FC<GWASPredictionTrackProps>
    = ({
        riskBigBedURL, protectiveBigBedURL, riskPredictionBigWigURL, protectivePredictionBigWigURL,
        width, height, domain, transform
    }) => {

        // request data
        const bigRequests = useMemo( () => (
            [ riskBigBedURL, protectiveBigBedURL, riskPredictionBigWigURL, protectivePredictionBigWigURL ].map(url => ({
                chr1: domain.chromosome!,
                start: domain.start,
                end: domain.end,
                preRenderedWidth: width,
                url
            }))
        ), [ domain, riskBigBedURL, protectiveBigBedURL, riskPredictionBigWigURL, protectivePredictionBigWigURL ]);
        const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, { variables: { bigRequests }});

        // make sure bigBed regions are at least 2 pixels wide for visibility
        const xtransform = useCallback(linearTransform([ domain.start, domain.end ], [ 0, width ]), [ domain, width ]);
        const rtransform = useCallback(linearTransform([ 0, width ], [ domain.start, domain.end ]), [ domain, width ]);
        const formattedBigBedData = useMemo(() => (
            ((data?.bigRequests[0].data || []) as BigBedData[]).map(x => ({
                ...x,
                end: xtransform(x.end) - xtransform(x.start) < 2 ? rtransform(xtransform(x.start) + 2) : x.end
            }))
        ), [ data, xtransform ]);

        // display the tracks
        return loading ? null : (
            <g transform={transform}>
                <DenseBigBed
                    data={formattedBigBedData}
                    domain={domain}
                    width={width}
                    height={height * 0.15}
                    transform={`translate(0,${height * 0.05})`}
                />
                <EmptyTrack
                    transform=""
                    text="risk and protective predictions, overlaid (risk purple, protective orange), associated SNPs highlighted"
                    width={width}
                    height={height * 0.05}
                    id=""
                />
                <FullBigWig
                    transform={`translate(0,${height * 0.25})`}
                    data={(data?.bigRequests[2].data || []) as BigWigData[]}
                    color="#a6754e88"
                    domain={domain}
                    width={width}
                    height={height * 0.3}
                    id="risk"
                    noTransparency
                />
                <FullBigWig
                    transform={`translate(0,${height * 0.25})`}
                    data={(data?.bigRequests[3].data || []) as BigWigData[]}
                    color="#6246a388"
                    domain={domain}
                    width={width}
                    height={height * 0.3}
                    id="protective"
                    noTransparency
                />
                <EmptyTrack
                    transform={`translate(0,${height * 0.65})`}
                    text="difference between risk (positive, green) and protective (negative, red)"
                    width={width}
                    height={height * 0.05}
                    id=""
                />
                <SubtractedBigWigTrack
                    dataB={(data?.bigRequests[2].data || []) as BigWigDataPoint[]}
                    dataA={(data?.bigRequests[3].data || []) as BigWigDataPoint[]}
                    width={width}
                    height={height * 0.25}
                    domain={domain}
                    transform={`translate(0,${height * 0.7})`}
                />
            </g>
        );

    };
export default GWASPredictionTrack;
