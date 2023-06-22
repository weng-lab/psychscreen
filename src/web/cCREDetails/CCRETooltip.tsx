import React, { useMemo } from 'react';
import { Loader } from 'semantic-ui-react';
import { useBiosamples, useCCREInformation } from './hooks';

type CCRETooltipProps = {
    start: number;
    end: number;
    name?: string;
    assembly?: string;
};

export const COLORS: Map<string, string> = new Map([
    [ "PLS", "#ff0000" ],
    [ "pELS", "#ffa700" ],
    [ "dELS", "#ffcd00" ],
    [ "DNase-H3K4me3", "#ffaaaa" ],
    [ "CTCF-only", "#00b0f0" ]
]);

export const GROUPS: Map<string, string> = new Map([
    [ "PLS", "promoter-like" ],
    [ "pELS", "proximal enhancer-like" ],
    [ "dELS", "distal enhancer-like" ],
    [ "DNase-H3K4me3", "DNase-H3K4me3" ],
    [ "CTCF-only", "CTCF-only" ]
]);

const MARKS = [ "DNase", "H3K4me3", "H3K27ac", "CTCF" ];

function useBrainBiosamples() {
    const { data, loading } = useBiosamples();
    const brainBiosamples = useMemo( () => (
        data?.ccREBiosampleQuery.biosamples
            .filter(x => x.ontology.toLocaleLowerCase().includes("brain"))
    ), [ data ]);
    return {
        loading,
        data: brainBiosamples ? {
            dnase: new Set(brainBiosamples?.filter(x => x.dnase).map(x => x.dnase!)),
            h3k4me3: new Set(brainBiosamples?.filter(x => x.h3k4me3).map(x => x.h3k4me3!)),
            h3k27ac: new Set(brainBiosamples?.filter(x => x.h3k27ac).map(x => x.h3k27ac!)),
            ctcf: new Set(brainBiosamples?.filter(x => x.ctcf).map(x => x.ctcf!))
        } : null
    };
}

const CCRETooltip: React.FC<CCRETooltipProps> = props => {
    
    const { data, loading } = useCCREInformation(props.name || "");
    const { data: biosamples, loading: biosamplesLoading } = useBrainBiosamples();
    
    const maxZ = useMemo( () => data && biosamples && {
        DNase: Math.max(...[ ...biosamples.dnase ].map(x => data.zScores.get(x) || -10)),
        H3K4me3: Math.max(...[ ...biosamples.h3k4me3 ].map(x => data.zScores.get(x) || -10)),
        H3K27ac: Math.max(...[ ...biosamples.h3k27ac ].map(x => data.zScores.get(x) || -10)),
        CTCF: Math.max(...[ ...biosamples.ctcf ].map(x => data.zScores.get(x) || -10))
    }, [ data, biosamples ]);

    return (
        <div style={{ border: "1px solid", padding: "0.75em", background: "#ffffff" }}>
            { loading || !data?.accession ? <Loader active /> : (
                <>
                    <svg height={18}>
                        <rect width={10} height={10} y={3} fill={COLORS.get(data.group || "") || "#06da93" } />
                        <text x={16} y={12}>{props.name} ⸱ {GROUPS.get(data.group || "")}</text>
                    </svg>
                    Click for details about this cCRE<br /><br />
                    <strong>Max Z-scores in brain:</strong><br />
                    { maxZ && [ "DNase", "H3K4me3", "H3K27ac", "CTCF" ].map( (x, i) => (
                        <React.Fragment key={i}>
                            <strong>{x}</strong>: {maxZ && maxZ[x]?.toFixed(2)}<br />
                        </React.Fragment>
                    ))}
                </>
            )}
        </div>
    );

};
export default CCRETooltip;
