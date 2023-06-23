import React, { useCallback, useMemo } from 'react';
import { GWAS_SIGNIFICANT_SNPS } from '../../../data/all-significant-snps.gwas';
import { groupBy } from 'queryz';
import { CustomizedTable } from '@weng-lab/psychscreen-ui-components';
import { GenomicRange } from '../GenePortal/AssociatedxQTL';

type SignificantSNPEntry = {
    fdr: number;
    trait: string;
    score: number;
    TF_impact: "pos" | "neg" | "none";
    snp: string;
    tissue: string;
    coordinates: {
        chromosome: string;
        position: number;
    };
};

export function useSNPs(trait: string) {
    const all_snps = useMemo( () => (
        Object.keys(GWAS_SIGNIFICANT_SNPS)
            .reduce<SignificantSNPEntry[]>(
                (v, k) => [
                    ...GWAS_SIGNIFICANT_SNPS[k]
                        .filter((x: SignificantSNPEntry) => x.trait === trait)
                        .map((x: SignificantSNPEntry) => ({ ...x, tissue: k })),
                    ...v
                ],
                []
            )
    ), [ GWAS_SIGNIFICANT_SNPS ]);
    const groupedSNPs = useMemo( () => (
        groupBy(all_snps, x => x.snp, x => x)
    ), [ all_snps ]);
    return useMemo( () => (
        [ ...groupedSNPs.keys() ].map(x => ({
            ...groupedSNPs.get(x)![0],
            fdr: Math.min(...groupedSNPs.get(x)!.map(x => x.fdr)),
            score: Math.max(...groupedSNPs.get(x)!.map(x => Math.abs(x.score))),
            tissues: groupedSNPs.get(x)!.map(x => x.tissue.replace(/-/g, " "))
        }))
    ), [ groupedSNPs ]);
}

export function traitKey(trait: string): string {
    if (trait.includes("MDD")) return "MDD";
    if (trait.includes("bipolar")) return "bipolar-II";
    if (trait.includes("ADHD")) return "ADHD-meta-filtered";
    if (trait.includes("Anorexia")) return "anorexia";
    return ";"
}

type SignificantSNPsProps = {
    trait: string;
    onSNPClick?: (coordinates: GenomicRange) => void;
};

function snpWindow(chromosome: string, position: number, halfWidth: number = 100000): GenomicRange {
    return {
        chromosome,
        start: position - halfWidth,
        end: position + halfWidth
    };
}

const SignifcantSNPs: React.FC<SignificantSNPsProps>
    = ({ trait, onSNPClick }) => {

        const significantSNPs = useSNPs(traitKey(trait));
        
        const onSNPRowClick = useCallback((row: SignificantSNPEntry) => {
            if (onSNPClick)
                onSNPClick(snpWindow(row[1].value.split(':')[0], +row[1].value.split(':')[1]))
        }, [ onSNPClick ]);

        const tabledata = useMemo( () => significantSNPs.sort((a, b) => a.fdr - b.fdr).map(d => [
            { header: 'SNP ID', value: d.snp },
            { header: 'position', value: `${d.coordinates.chromosome}:${d.coordinates.position}` },
            { header: 'FDR', value: d.fdr.toExponential(3) },
            { header: 'magnitude of predicted impact', value: d.score.toFixed(3) },
            { header: 'active tissues', value: d.tissues.join(", ") },
            { header: 'impacts TF binding site?', value: d.TF_impact !== 'none' ? 'yes' : 'no' }
        ]), [ SignifcantSNPs ]);

        return tabledata.length > 0 ? (
            <CustomizedTable
                style={{ width: "max-content" }}
                tabledata={tabledata}
                onRowClick={onSNPRowClick}
            />
        ) : <></>;
        
    };
export default SignifcantSNPs;
