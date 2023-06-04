import { useQuery } from '@apollo/client';
import React, { RefObject, useCallback, useEffect, useMemo, useState } from 'react';
import { BIG_QUERY, BigQueryResponse } from './EpigeneticTracks';
import { Header, Loader } from 'semantic-ui-react';
import { BigBedData } from 'bigwig-reader';
import { ManhattanTrack, ManhattanTrackProps, LDTrack, EmptyTrack } from 'umms-gb';
import { ManhattanSNP } from 'umms-gb/dist/components/tracks/manhattan/types';
import { linearTransform } from '../web/Portals/GenePortal/violin/utils';

export type LDEntry = {
    id: string;
    rSquared: number;
    coordinates: GenomicRange;
};

export type EQTL = {
    snp: string;
    fdr: number;
    nominal_pval: number;
    slope: number;
};

type GenomicRange = {
    chromosome?: string;
    start: number;
    end: number;
}

type ManhattanPlotTrackProps = {
    urls: string[];
    titles: string[];
    domain: GenomicRange;
    onHeightChanged?: (height: number) => void;
    onSNPMousedOver?: (snp: ManhattanSNP) => void;
    snpProps: (snp: ManhattanSNP, props: ManhattanTrackProps) => React.SVGProps<SVGCircleElement>;
    className?: string;
    anchor: string;
    ld: LDEntry[];
    groupedQTLs: Map<string, EQTL>;
    allQTLs: any[];
    sortOrder?: (a: ManhattanSNP, b: ManhattanSNP) => number;
    svgRef?: RefObject<SVGSVGElement>;
    onSettingsClick?: () => void;
    gene: string;
    importantRegions?: GenomicRange[];
};

const tracks = (urls: string[], pos: GenomicRange) => urls.map(url => ({
    chr1: pos.chromosome!,
    start: pos.start,
    end: pos.end,
    url
}));

const Tooltip: React.FC<ManhattanSNP> = snp => (
    <div style={{ marginTop: "-5em", marginLeft: "-4em", background: "#ffffff" }}>
        <Header as="h4">{snp.data.rsId}</Header>
        {snp.data.score.toExponential(3)}
    </div>
);

function findSnpsInRegions(snps: (GenomicRange & { id: string })[], regions: GenomicRange[]): (GenomicRange & { id: string })[] {
    const snpsInRegions: (GenomicRange & { id: string })[] = [];
    for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        let j = 0;
        while (j < snps.length && snps[j].end < region.start)
            ++j;
        while (j < snps.length && snps[j].end <= region.end)
            snpsInRegions.push(snps[j++]);
    }
    return snpsInRegions;
}

const ManhattanPlotTrack: React.FC<ManhattanPlotTrackProps> = props => {
    
    // fetch SNPs
    const { data, loading } = useQuery<BigQueryResponse>(BIG_QUERY, {
        variables: { bigRequests: tracks(props.urls, props.domain)}
    });
    const transform = useCallback(linearTransform([ props.domain.start, props.domain.end ], [ 0, 1400 ]), [ props ]);

    // merge GWAS SNPs and QTLs in viewport
    const inView = useMemo( () => [
        ...((data?.bigRequests || []).flatMap((x, i) => (
            ((x?.data || []) as BigBedData[]).map((xx: BigBedData) => ({
                rsId: xx.name?.split("_")[0] || "",
                [i]: Math.exp(-(+(xx.name?.split("_")[1] || "0"))),
                coordinates: {
                    start: xx.start,
                    end: xx.end,
                    chromosome: xx.chr
                }
            }))
        ))),
        ...props.allQTLs.map(xx => ({
            rsId: xx.id,
            score: 1,
            coordinates: xx.coordinates
        }))
    ], [ data, props.allQTLs ]);

    const allQTLs = useMemo( () => (
        inView?.filter(x => props.groupedQTLs.get(x.rsId))
            .map(x => ({ ...x, eQTL: props.groupedQTLs.get(x.rsId)! }))
    ) || [], [ inView, props ]);

    // determine which SNPs intersect important regions
    const importantSNPs = useMemo( () => (
        props.importantRegions && inView && findSnpsInRegions(inView.map(x => ({ ...x.coordinates, id: x.rsId })), props.importantRegions)
    ), [ props, inView ]);

    // compute height, handle settings mouse over
    const [ settingsMousedOver, setSettingsMousedOver ] = useState(false);
    const height = useMemo( () => 220 * props.titles.length + 100, [ props.titles ]);
    useEffect( () => props.onHeightChanged && props.onHeightChanged(height), [ height, props.onHeightChanged ]);

    // format and return
    return loading ? <Loader active>Loading...</Loader> : (
        <g transform="translate(0,25)">
            { props.titles.map((title, i) => (
                <g transform={`translate(0,${200 * i})`}>
                    <EmptyTrack
                        height={40}
                        width={1400}
                        text={`GWAS summary statistics for ${title}`}
                        transform=""
                        id=""
                    />
                    { importantSNPs && (
                        <g transform="translate(0,40)">
                            { importantSNPs.map(snp => (
                                <rect
                                    fill="#ff0000"
                                    height={10}
                                    y={5}
                                    width={2}
                                    x={transform(snp.start)}
                                    onMouseOver={() => props.onSNPMousedOver && props.onSNPMousedOver({ x: transform(snp.start), y: 0, data: { rsId: snp.id, score: 0, coordinates: { ...snp, chromosome: snp.chromosome! } }})}
                                />
                            ))}
                        </g>
                    )}
                    <ManhattanTrack
                        height={props.importantRegions ? 130 : 150}
                        data={inView.map(v => ({ coordinates: v.coordinates, rsId: v.rsId, score: v[i] || 1 }))}
                        width={1400}
                        domain={props.domain}
                        tooltipContent={Tooltip}
                        onSNPMousedOver={props.onSNPMousedOver}
                        snpProps={props.snpProps}
                        className={props.className}
                        sortOrder={props.sortOrder}
                        svgRef={props.svgRef}
                        transform={`translate(0,${props.importantRegions ? 60 : 40})`}
                        threshold={4}
                        max={12}
                    />
                </g>
            ))}
            <EmptyTrack
                height={25}
                text={props.gene ? `Brain eQTLs for ${props.gene} (red) and other SNPs (black)` : "SNPs"}
                width={1400}
                transform={`translate(0,${200 * props.urls.length + 30})`}
                id=""
            />
            <LDTrack
                width={1400}
                height={50}
                domain={props.domain}
                anchor={props.anchor}
                data={{
                    snps: [
                        ...(inView || []).map(x => ({ id: x.rsId, domain: x.coordinates }))
                    ].sort((a, b) => a.domain.start - b.domain.start), ld: props.ld
                }}
                onVariantMouseOver={data => props.onSNPMousedOver && props.onSNPMousedOver({ data: { score: 0, rsId: data.id, coordinates: { chromosome: props.domain.chromosome!, start: data.domain.start, end: data.domain.end } }, x: 0, y: 0 })}
                ldThreshold={0.1}
                highlighted={new Set(allQTLs.map(x => x.rsId))}
                highlightColor="#ff0000"
                transform={`translate(0,${200 * props.urls.length + 40})`}
            />
            { settingsMousedOver && (
                <rect width={1400} height={height} transform="translate(0,-30)" fill="#24529c" fillOpacity={0.1} />
            )}
            <rect
                transform="translate(0,-30)"
                height={height}
                width={40}
                fill="#ffffff"
            />
            <rect
                height={height}
                width={15}
                fill="#24529c"
                stroke="#000000"
                fillOpacity={settingsMousedOver ? 1 : 0.6}
                onMouseOver={() => setSettingsMousedOver(true)}
                onMouseOut={() => setSettingsMousedOver(false)}
                strokeWidth={1}
                transform="translate(20,-30)"
                onClick={props.onSettingsClick}
            />
            <text transform={`rotate(270) translate(-${height / 2},12)`} textAnchor="middle" fill="#24529c">
                Variants and GWAS
            </text>
        </g>
    );
};
export default ManhattanPlotTrack;
