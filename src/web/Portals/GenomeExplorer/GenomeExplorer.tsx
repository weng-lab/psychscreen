import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GenomicRange } from '../GenePortal/AssociatedxQTL';
import CytobandView from '../GenePortal/Browser/Explorer/Cytobands';
import { GenomeBrowser, RulerTrack, UCSCControls } from 'umms-gb';
import GeneTrack from './GeneTrack';
import { EpigeneticTracks, tracks, VariantTracks } from '../../../genome-explorer';
import { DeepLearnedModelTracks } from '../../../genome-explorer/DeepLearnedModels';
import { URL_MAP } from '../DiseaseTraitPortal/config/constants';

type GenomeExplorerProps = {
    coordinates: GenomicRange;
    onDomainChanged: (coordinates: GenomicRange) => void;
};

const GenomeExplorer: React.FC<GenomeExplorerProps>
    = ({ coordinates, onDomainChanged }) => {

        /* SVG-related refs and coordinate conversion */
        const svgRef = useRef<SVGSVGElement>(null);
        const l = useCallback((c: number) => (
            (c - coordinates.start) * 1850 / (coordinates.end - coordinates.start)
        ), [ coordinates ]);

        /* drawing rectangular highlight at a given range */
        const [ highlight, setHighlight ] = useState<GenomicRange | null>(null);
        console.log(setHighlight);

        /* tracks and coordinates */
        const epigeneticTracks = useMemo( () => tracks("GRCh38", coordinates), [ coordinates ]);
        const navigateCoordinates = useCallback(({ start, end }) => {
            onDomainChanged({ ...coordinates, start, end })
        }, []);

        return (
            <>
                <CytobandView
                    innerWidth={1000}
                    height={15}
                    chromosome={coordinates.chromosome!}
                    assembly="hg38"
                    position={coordinates}
                /><br />
                <div style={{ textAlign: "center" }}>
                    <UCSCControls
                        onDomainChanged={navigateCoordinates}
                        domain={coordinates}
                        withInput={false}
                    />
                </div>
                <br />
                <GenomeBrowser
                    svgRef={svgRef}
                    domain={coordinates}
                    innerWidth={1400}
                    width="100%"
                    noMargin
                    onDomainChanged={navigateCoordinates}
                >
                    { highlight && (
                        <rect
                            fill="#8ec7d1"
                            fillOpacity={0.5}
                            height={1000}
                            x={l(highlight.start)} width={l(highlight.end) - l(highlight.start)}
                        />
                    )}
                    <RulerTrack
                        domain={coordinates}
                        height={30}
                        width={1400}
                    />
                    <GeneTrack
                        assembly="hg38"
                        position={coordinates}
                    />
                    <EpigeneticTracks
                        assembly="GRCh38"
                        tracks={epigeneticTracks}
                        domain={coordinates}
                    />
                    <DeepLearnedModelTracks
                        domain={coordinates}
                        trait="MDD"
                    />
                    <VariantTracks
                        coordinates={coordinates}
                        name=""
                        url={`https://downloads.wenglab.org/psychscreen-summary-statistics/${URL_MAP["ASD"]}.bigBed`}
                        trait="Autism Spectrum Disorder"
                    />
                </GenomeBrowser>
            </>
        )

    };

export default GenomeExplorer;
