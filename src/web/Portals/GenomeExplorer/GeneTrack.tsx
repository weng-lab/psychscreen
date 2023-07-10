import React, { useState } from "react";
import {
  EmptyTrack,
  GraphQLTranscriptTrack,
  PackTranscriptTrack,
  SquishTranscriptTrack,
} from "umms-gb";
import { GenomicRange } from "../SnpPortal/SNPDetails";

type GeneTrackProps = {
  assembly: string;
  position: GenomicRange;
  onHeightChanged?: (x: number) => void;
  transform?: string;
};

const GeneTrack: React.FC<GeneTrackProps> = ({
  assembly,
  position,
  onHeightChanged,
  transform,
}) => {
  const [settingsMousedOver, setSettingsMousedOver] = useState(false);
  const [height, setHeight] = useState(0);
  return (
    <g transform={transform}>
      <GraphQLTranscriptTrack
        id="gencode"
        endpoint="https://ga.staging.wenglab.org/graphql"
        assembly={assembly}
        domain={position}
        transform=""
        onHeightChanged={(height) => {
          onHeightChanged && onHeightChanged(height);
          setHeight(height);
        }}
      >
        <EmptyTrack
          height={40}
          text="GENCODE v29 transcripts"
          width={1400}
          transform=""
          id=""
        />
        {position.end - position.start >= 20000 ? (
          <SquishTranscriptTrack
            rowHeight={20}
            width={1400}
            domain={position}
            id="innergencode"
          />
        ) : (
          <PackTranscriptTrack
            rowHeight={20}
            width={1400}
            domain={position}
            id="innergencode"
          />
        )}
      </GraphQLTranscriptTrack>
      {settingsMousedOver && (
        <rect
          width={1400}
          height={height}
          transform="translate(0,0)"
          fill="#bf2604"
          fillOpacity={0.1}
        />
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
        fill="#bf2604"
        stroke="#000000"
        fillOpacity={settingsMousedOver ? 1 : 0.6}
        onMouseOver={() => setSettingsMousedOver(true)}
        onMouseOut={() => setSettingsMousedOver(false)}
        strokeWidth={1}
        transform="translate(20,0)"
      />
      <text
        transform={`rotate(270) translate(-${height / 2 + 20},12)`}
        fill="#bf2604"
      >
        Genes
      </text>
    </g>
  );
};

export default GeneTrack;
