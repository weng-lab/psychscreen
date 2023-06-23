import React, {useMemo, useRef, useState, useCallback}  from 'react';
import CytobandView from '../GenePortal/Browser/Explorer/Cytobands';
import { GenomeBrowser, RulerTrack, UCSCControls } from 'umms-gb';
import EGeneTracks from '../GenePortal/Browser/EGeneTracks';
import { EpigeneticTracks, tracks, VariantTracks, ConservationTracks } from '../../../genome-explorer';
import { useGenePageData } from '../GenePortal/AssociatedxQTL';
import { DeepLearnedModelTracks } from '../../../genome-explorer/DeepLearnedModels';

type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
};

function mergeRegions(regions: GenomicRange[]): GenomicRange[] {
    const mergedRegions: GenomicRange[] = [];
    let currentRegion = { ...regions[0] };
    for (let i = 1; i < regions.length; ++i) {
        const region = regions[i];
        if (currentRegion.end >= region.start)
            currentRegion.end = Math.max(currentRegion.end, region.end);
        else {
            mergedRegions.push(currentRegion);
            currentRegion = { ...region };
        }
    }
    mergedRegions.push(currentRegion);
    return mergedRegions;
}

const Browser: React.FC<{ coordinates: GenomicRange, url: string, trait: string }> = (props) => { 
    const svgRef = useRef<SVGSVGElement>(null);
    const [ coordinates, setCoordinates ] = useState<GenomicRange>(props.coordinates);
    const [ highlight ] = useState<GenomicRange | null>(null);
    
    const epigeneticTracks = useMemo( () => tracks("GRCh38", coordinates as { chromosome: string, start: number, end: number }), [ coordinates ]);

    const onDomainChanged = useCallback(
        (d: GenomicRange) => {
            const chr = d.chromosome === undefined ? props.coordinates.chromosome : d.chromosome;
            setCoordinates({ chromosome: chr, start: Math.round(d.start), end: Math.round(d.end) });
        }, [ props.coordinates ]
    );

    const { groupedTranscripts } = useGenePageData(
        coordinates,
        "GRCh38",
        "APOE",
        false
    );

    const [ importantRegions, setImportantRegions ] = useState<GenomicRange[]>([]);
    const onImportantRegionsLoaded = useCallback((regions: GenomicRange[]) => {
        setImportantRegions(
            mergeRegions(
                regions.sort((a, b) => a.start - b.start).filter(x => x.end - x.start >= 4)
            )
        );
    }, []);

    const l = useCallback((c: number) => (c - coordinates.start) * 1400 / (coordinates.end - coordinates.start), [ coordinates ]);
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
                <UCSCControls onDomainChanged={onDomainChanged} domain={coordinates} withInput={false} />
            </div>
            <br />
            <GenomeBrowser
                svgRef={svgRef}
                domain={coordinates}
                innerWidth={1400}
                width="100%"
                noMargin
                onDomainChanged={x => setCoordinates({ chromosome: coordinates.chromosome, start: Math.floor(x.start), end: Math.ceil(x.end) })}
            >
                { highlight && (
                    <rect fill="#8ec7d1" fillOpacity={0.5} height={1000} x={l(highlight.start)} width={l(highlight.end) - l(highlight.start)} />
                )}
                <RulerTrack
                    domain={coordinates}
                    height={30}
                    width={1400}
                />
                <EGeneTracks
                    genes={groupedTranscripts || []}
                    expandedCoordinates={coordinates}
                    squish
                />
                
                <EpigeneticTracks
                    assembly="GRCh38"
                    tracks={epigeneticTracks}
                    domain={coordinates}
                />
                <DeepLearnedModelTracks
                    domain={coordinates}
                    onImportantRegionsLoaded={onImportantRegionsLoaded}
                    trait={props.trait}
                />
                <VariantTracks
                    coordinates={coordinates}
                    resolvedTranscript={false}
                    url={props.url}
                    name=""
                    trait={props.trait}
                    importantRegions={importantRegions}
                />
                <ConservationTracks
                    assembly="GRCh38"
                    //tracks={epigeneticTracks}
                    domain={coordinates}
                />
                 
            </GenomeBrowser>
        </>
    );

}
export default Browser;
