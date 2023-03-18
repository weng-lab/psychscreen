import { useQuery } from '@apollo/client';
import React, { RefObject, useEffect, useMemo, useState } from 'react';
import { GenomicRange } from '../web/Portals/GenePortal/AssociatedxQTL';
import { BigQueryResponse, BIG_QUERY } from './EpigeneticTracks';
import DeepLearnedTrackModal from './SettingsModals/DeepLearnedTracks';
import TitledImportanceTrack from './TitledImportanceTrack';
import { BigBedData } from 'bigwig-reader';

const CELL_TYPES = new Map([
    [ "astrocytes", "Astrocyte_1" ],
    [ "GABA-ergic type I", "GABAergic_Neuron_1" ],
    [ "GABA-ergic type II", "GABAergic_Neuron_2" ],
    [ "glutaminergic type I", "Glutaminergic_Neuron_1" ],
    [ "glutaminergic type II", "Glutaminergic_Neuron_2" ],
    [ "microglia", "Microglia" ],
    [ "oligodendrocytes", "Oligodendrocyte" ],
    [ "oligodendrocyte precursors", "Oligodendrocyte_Precursor" ],
    [ "putamen glia", "NeuN-" ],
    [ "putamen neurons", "NeuN+" ]
]);

type DeepLearnedModelTrackProps = {
    domain: GenomicRange;
    onHeightChanged?: (i: number) => void;
    svgRef?: RefObject<SVGSVGElement>;
    onSettingsClicked?: () => void;
};



export const DeepLearnedModelTracks: React.FC<DeepLearnedModelTrackProps>
    = ({ domain, onHeightChanged, onSettingsClicked }) => {

        // manage displayed tracks, compute height, and pass height back to parent
        const [ displayedTracks, setDisplayedTracks ] = useState<[ string, string ][]>([
            [ "putamen glia", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_glia" ],
            [ "putamen neurons", "gs://gcp.wenglab.org/projects/chrombpnet/psychencode/PTM_neurons" ]
        ]);
        const height = useMemo(
            () => domain.end - domain.start <= 10000 && displayedTracks.find(x => x[0] === "241-way mammalian phylo-P")?.length
                ? 130 + displayedTracks.length * 130
                : displayedTracks.length * 130,
            [ displayedTracks, domain ]
        );
        useEffect( () => {
            onHeightChanged && onHeightChanged(height);
        }, [ onHeightChanged, height ]);

        // manage settings modal
        const [ settingsMousedOver, setSettingsMousedOver ] = useState(false);
        const [ settingsModalShown, setSettingsModalShown ] = useState(false);

        // request bCREs
        const bigRequests = useMemo( () => [{
            chr1: domain.chromosome!,
            start: domain.start,
            end: domain.end,
            preRenderedWidth: 1400,
            url: "gs://gcp.wenglab.org/GTEx-psychscreen/tracks/data/adult_bCREs.bigBed"
        }], [ domain ]);
        const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, { variables: { bigRequests }});

        return (
            <>
                <DeepLearnedTrackModal
                    open={settingsModalShown}
                    onCancel={() => setSettingsModalShown(false)}
                    onAccept={x => { setDisplayedTracks(x); setSettingsModalShown(false); }}
                    initialSelection={displayedTracks}
                />
                { (domain.end - domain.start) <= 10000 && displayedTracks.find(x => x[0] === "241-way mammalian phylo-P")?.length && (
                    <TitledImportanceTrack
                        transform={`translate(0,${(displayedTracks.length - 1) * 130})`}
                        title="Mammalian 241-way PhyloP from Zoonomia"
                        height={130}
                        width={1400}
                        signalURL="gs://gcp.wenglab.org/hg38.phyloP100way.bigWig"
                        domain={domain}
                        key={domain.start}
                        neutralRegions={[]}
                    />
                )}
                { displayedTracks.filter(x => x[0] !== "241-way mammalian phylo-P").map((x, i) => (
                    <TitledImportanceTrack
                        key={`${i}_${domain.start}`}
                        transform={`translate(0,${130 * i})`}
                        title={x[0]}
                        height={130}
                        width={1400}
                        signalURL={`${x[1]}/${CELL_TYPES.get(x[0])!}.profile_scores.bw`}
                        imputedSignalURL={`${x[1]}/predictions_${CELL_TYPES.get(x[0])!}_chrombpnet_nobias.bw`}
                        positiveRegionURL={`${x[1]}/${CELL_TYPES.get(x[0])!}.profile_scores.bw.pos.bb`}
                        negativeRegionURL={`${x[1]}/${CELL_TYPES.get(x[0])!}.profile_scores.bw.neg.bb`}
                        neutralRegions={loading || !data?.bigRequests[0].data ? [] : (data.bigRequests[0].data as BigBedData[])}
                        domain={domain}
                    />
                ))}
                { settingsMousedOver && (
                    <rect width={1400} height={height} transform="translate(0,-0)" fill="#194023" fillOpacity={0.1} />
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
                    fill="#194023"
                    stroke="#000000"
                    fillOpacity={settingsMousedOver ? 1 : 0.6}
                    onMouseOver={() => setSettingsMousedOver(true)}
                    onMouseOut={() => setSettingsMousedOver(false)}
                    strokeWidth={1}
                    transform="translate(20,0)"
                    onClick={() => {onSettingsClicked && onSettingsClicked(); setSettingsModalShown(true); }}
                />
                <text transform={`rotate(270) translate(-${height / 2},12)`} textAnchor="middle" fill="#194023">
                    Deep Learned Models
                </text>
            </>
        );

    };
