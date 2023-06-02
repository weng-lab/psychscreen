import React, { useState } from 'react';
import { GraphQLTranscriptTrack, WrappedPackTranscriptTrack, WrappedSquishTranscriptTrack } from 'umms-gb';
import { GenomicRange } from '../SnpPortal/SNPDetails';

type GeneTrackProps = {
    assembly: string;
    position: GenomicRange;
};

const GeneTrack: React.FC<GeneTrackProps>
    = ({ assembly, position }) => {
        return (
            <GraphQLTranscriptTrack
                id="gencode"
                endpoint="https://ga.staging.wenglab.org/graphql"
                assembly={assembly}
                domain={position}
                transform=""
            >
                { position.end - position.start >= 20000 ? (
                    <WrappedSquishTranscriptTrack
                        title="GENCODE v29 genes"
                        titleSize={15}
                        rowHeight={20}
                        width={2000}
                        domain={position}
                        id="innergencode"
                    />
                ) : (
                    <WrappedPackTranscriptTrack
                        title="GENCODE v29 transcripts"
                        titleSize={15}
                        rowHeight={20}
                        width={2000}
                        domain={position}
                        id="innergencode"
                    />
                )}
            </GraphQLTranscriptTrack>
        )
    };

export default GeneTrack;
