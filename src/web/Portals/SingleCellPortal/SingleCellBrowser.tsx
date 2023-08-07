import { gql, useQuery } from "@apollo/client";
import React, {
  useMemo,
  useRef,
  useState,
  useCallback,
  useEffect,
} from "react";
import CytobandView from "../../Portals/GenePortal/Browser/Explorer/Cytobands"
import { GenomeBrowser, RulerTrack, UCSCControls } from "umms-gb";
import EGeneTracks from "../../Portals/GenePortal/Browser/EGeneTracks";
import AtacSeqPeaksTracks, { tracks } from "./AtacSeqPeaksTracks";
import { SingleCellGRNTracks } from "./SingleCellGRNTracks";
import { SingleCellQTLTracks } from "./SingleCellQTLTracks";

const SNP_QUERY = gql`
  query s(
    $chromosome: String
    $start: Int
    $end: Int
    $assembly: String!
  ) {
    gene(
      chromosome: $chromosome
      start: $start
      end: $end
      assembly: $assembly
    ) {
      name
      strand
      transcripts {
        name
        strand
        exons {
          coordinates {
            chromosome
            start
            end
          }
        }
        coordinates {
          chromosome
          start
          end
        }
      }
    }
  }
`;
export type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
  };
  

export type Transcript = {
  id: string;
  name: string;
  strand: string;
  coordinates: GenomicRange;
};
export type SNPQueryResponse = {
  snpQuery: {
    id: string;
    coordinates: GenomicRange;
  }[];
  gene: {
    name: string;
    strand: string;
    transcripts: Transcript[];
  }[];
};
export function expandCoordinates(
    coordinates: GenomicRange,
    l = 20000
  ): GenomicRange {
    return {
      chromosome: coordinates.chromosome,
      start: coordinates.start - l < 0 ? 0 : coordinates.start - l,
      end: coordinates.end + l,
    };
  }
  

export const SingleCellBrowser = (props) =>{
    const svgRef = useRef<SVGSVGElement>(null);
    const [coordinates, setCoordinates] = useState<GenomicRange | null>(null);
    
    const eexpandedCoordinates = useMemo(
      () => expandCoordinates(props.coordinates),
      [
        props.coordinates.chromosome,
        props.coordinates.start,
        props.coordinates.end,
      ]
    );;
    
    const snpResponse = useQuery<SNPQueryResponse>(SNP_QUERY, {
        variables: { ...(coordinates || eexpandedCoordinates), assembly: "GRCh38" }
      });    
      const groupedTranscripts = useMemo(
        () =>
          snpResponse.data?.gene.map((x) => ({
            ...x,
            transcripts: x.transcripts.map((xx) => ({
              ...xx,
              color:
            (x).name === props.name ? "#880000" : "#aaaaaa",
            })),
          })),
        [snpResponse]
      );
      const atacseqpeaksTracks = useMemo(
        () =>
          tracks(
            "GRCh38",
            coordinates || eexpandedCoordinates
          ),
        [coordinates,eexpandedCoordinates]
      );
    
      const onDomainChanged = useCallback(
        (d: GenomicRange) => {
          const chr =
            d.chromosome === undefined
              ? eexpandedCoordinates.chromosome
              : d.chromosome;
          const start = Math.round(d.start);
          const end = Math.round(d.end);
          if (end - start > 10) {
            setCoordinates({ chromosome: chr, start, end });
          }
        },
        [eexpandedCoordinates]
      );
    
      const l = useCallback(
        (c: number) =>
          ((c - eexpandedCoordinates.start) * 1400) /
          (eexpandedCoordinates.end - eexpandedCoordinates.start),
        [eexpandedCoordinates]
      );
    return(<>
        <br/>
        <CytobandView
          innerWidth={1000}
          height={15}
          chromosome={(coordinates || eexpandedCoordinates) .chromosome!}
          assembly={"hg38"}
          position={coordinates || eexpandedCoordinates}
        />
        <br />
        <div style={{ textAlign: "center" }}>
          <UCSCControls
            onDomainChanged={onDomainChanged}
            domain={coordinates ||  eexpandedCoordinates}
            withInput={false}
          />
        </div>
        <br />
        <GenomeBrowser
        svgRef={svgRef}
        domain={coordinates || eexpandedCoordinates}
        innerWidth={1400}
        width="100%"
        noMargin
        onDomainChanged={(x) => {
          if (Math.ceil(x.end) - Math.floor(x.start) > 10) {
            setCoordinates({
              chromosome: (coordinates || eexpandedCoordinates).chromosome,
              start: Math.floor(x.start),
              end: Math.ceil(x.end),
            });
          }
        }}
      >
        <RulerTrack
          domain={coordinates || eexpandedCoordinates}
          height={30}
          width={1400}
        />
        <EGeneTracks
          genes={groupedTranscripts || []}
          expandedCoordinates={coordinates || eexpandedCoordinates}
          squish
        />
        <AtacSeqPeaksTracks
          assembly="GRCh38"
          tracks={atacseqpeaksTracks}
          domain={coordinates || eexpandedCoordinates}
        />
        <SingleCellGRNTracks
         assembly="GRCh38"
         //tracks={atacseqpeaksTracks}
         domain={coordinates || eexpandedCoordinates}
        />
         <SingleCellQTLTracks
         assembly="GRCh38"
         //tracks={atacseqpeaksTracks}
         domain={coordinates || eexpandedCoordinates}
        />

      </GenomeBrowser>
        </>)
}