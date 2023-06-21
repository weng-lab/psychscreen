import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GenomicRange } from '../GenePortal/AssociatedxQTL';
import CytobandView from '../GenePortal/Browser/Explorer/Cytobands';
import { GenomeBrowser, RulerTrack, UCSCControls } from 'umms-gb';
import GeneTrack from './GeneTrack';
import { EpigeneticTracks, tracks } from '../../../genome-explorer';
import { DeepLearnedModelTracks } from '../../../genome-explorer/DeepLearnedModels';
import { Button } from '@weng-lab/psychscreen-ui-components';
import { downloadSVG } from '../GenePortal/violin/utils';
import { downloadSVGAsPNG } from '../../svgToPng';

type GenomeExplorerProps = {
    coordinates: GenomicRange;
    onDomainChanged: (coordinates: GenomicRange) => void;
    defaultTrackset?: string;
};

const GenomeExplorer: React.FC<GenomeExplorerProps>
    = ({ coordinates, onDomainChanged, defaultTrackset }) => {

        /* SVG-related refs and coordinate conversion */
        const svgRef = useRef<SVGSVGElement>(null);
        const l = useCallback((c: number) => (
            (c - coordinates.start) * 1850 / (coordinates.end - coordinates.start)
        ), [ coordinates ]);

        /* drawing rectangular highlight at a given range */
        const [ highlight, setHighlight ] = useState<GenomicRange | null>(null);
        
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
                        assembly="GRCh38"
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
                        defaultTrackset={defaultTrackset}
                        key={defaultTrackset}
                    />
                </GenomeBrowser>
                <Button
                    onClick={() => { downloadSVG(svgRef, "browser-view.svg") }}
                    btheme='light'
                    bvariant='filled'
                >
                    Download SVG
                </Button>&nbsp;
                <Button
                    onClick={() => { svgRef.current && downloadSVGAsPNG(svgRef.current, "browser-view.png") }}
                    btheme='light'
                    bvariant='filled'
                >
                    Download PNG
                </Button>
            </>
        )

    };

export default GenomeExplorer;
