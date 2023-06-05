import { Grid, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Chart, Scatter } from 'jubilant-carnival';
import { Typography, CustomizedTable } from '@zscreen/psychscreen-ui-components';
import React, { useEffect, useMemo, useState, useRef } from 'react';
import { tissueTypeColors } from './consts';
import { lower5, range, upper5 } from './GTexUMAP';

export type QueryResponse = [
    number,
    string[],
    any,
    [ string, string, string, string, string, string ][],
    string[]
];

const TISSUE_TYPE_COLORS = (() => {
    const m: { [ key: string ]: string } = {};
    Object.keys(tissueTypeColors).forEach(k => {
        m[k.replace(/-/g, "_").replace(/\(/g, "").replace(/\)/g, "")] = tissueTypeColors[k];
    });
    return m;
})();

const BRAIN_COLORS = {
    "Brain_Amygdala": "#fcba03",
    "Brain_Anterior_cingulate_cortex_BA24": "#fc4e03",
    "Brain_Caudate_basal_ganglia": "#1c1a73",
    "Brain_Cerebellar_Hemisphere": "#9911cf",
    "Brain_Cerebellum": "#9911cf",
    "Brain_Cortex": "#e61809",
    "Brain_Frontal_Cortex_BA9": "#d93b0f",
    "Brain_Hippocampus": "#d93b0f",
    "Brain_Hypothalamus": "#0e5e48",
    "Brain_Nucleus_accumbens_basal_ganga": "#184f80",
    "Brain_Nucleus_accumbens_basal_ganglia": "#184f80",
    "Brain_Putamen_basal_ganglia": "#1d4ca3",
    "Brain_Spinal_cord_cervical_c-1": "#0c522b",
    "Brain_Substantia_nigra": "#198031"
};

function useSpecificities(gene: string) {
    const [ specificities, setSpecificities ] = useState<{ [ key: string]: { [key: string]: number } }>({});
    useEffect( () => {
        fetch("https://downloads.wenglab.org/GTEx-psychscreen/specificities.json")
            .then(x => x.json())
            .then(setSpecificities)
    }, []);
    const matches = useMemo( () => new Map(Object.keys(specificities).map(k => [
        k, specificities[k][gene] || 0
    ])), [ gene, specificities ]);
    return matches;
}

export function useGeneDescription(gene: string) {
    const [ description, setDescription ] = useState("");
    useEffect( () => {
        setDescription("");
        fetch("https://clinicaltables.nlm.nih.gov/api/ncbi_genes/v3/search?authenticity_token=&terms=" + gene.toUpperCase())
            .then(x => x.json())
            .then(x => {
                const matches = (x as QueryResponse)[3] && (x as QueryResponse)[3].filter(x => x[3] === gene);
                setDescription(matches && matches.length >= 1 ? matches[0][4] : "(no description available)")
            })
            .catch();
    }, [ gene ]);
    return description;
}

function useSampleScatter(url: string, COLORS: { [key: string]: string }) {
    const [ data, setData ] = useState<[ string, number, number ][]>([]);
    useEffect(() => {
        fetch(url)
            .then(data => data.json())
            .then(setData);
    }, [ url ]);
    const colors = useMemo( () => data.map(x => COLORS[x[0]]), [ data, COLORS ]);
    return [ data, colors ] as [ [ string, number, number ][], string[] ];
}

function useGeneScatter(url: string) {
    const [ data, setData ] = useState<{ [ key: string ]: [ number, number ] } | null>(null);
    useEffect(() => {
        fetch(url)
            .then(data => data.json())
            .then(setData);
    }, [ url ]);
    return data;
}

const TissueClusterPlot: React.FC<{ gene?: string | undefined, title: string, fontSize: number, xOffset: number, yOffset: number, url: string, colors: { [key: string ]: string }, geneUrl: string, titleCoordinates: [ number, number ], titleSize: number }>
  = ({ gene, fontSize, title, xOffset, yOffset, url, colors, geneUrl, titleCoordinates, titleSize }) => {

    const [ sampleData, sampleColors ] = useSampleScatter(url, colors);
    const geneData = useGeneScatter(geneUrl);

    const [ highlighted, setHighlighted ] = useState("");
    const tPoints = useMemo( () => [
        ...sampleData.map((x, i) => ({
            x: x[1],
            y: x[2],
            data: x[0],
            svgProps: {
                fill: sampleColors[i],
                r: 12,
                strokeWidth: x[0] === highlighted ? 6 : 0,
                stroke: "#000000",
                fillOpacity: 0.6
            }
        }))
    ].slice(sampleData.length - 2000), [ sampleData, sampleColors, highlighted]);
    const points = useMemo( () => geneData && gene && geneData[gene] ? [
        ...tPoints, { x: geneData[gene][0], y: geneData[gene][1], data: gene, svgProps: { fill: "#00ff00", r: 34, stroke: "#000000", strokeWidth: 3 } }
    ] : tPoints, [ tPoints, gene, geneData ]);
    const domain = useMemo( () => points.length === 0 ? { x: { start: 0, end: 1 }, y: { start: 0, end: 1 } } : ({
        x: { start: lower5(Math.min(...points.map(x => x.x)) * 1.1), end: upper5(Math.max(...points.map(x => x.x)) * 1.1) },
        y: { start: lower5(Math.min(...points.map(x => x.y)) * 1.1), end: upper5(Math.max(...points.map(x => x.y)) * 1.1) }
    }), [ points ]);
    const uref = useRef<SVGSVGElement>(null);

    const [ tooltip, setTooltip ] = useState(-1);

    return (
        <div style={{ marginTop: "-40px", marginLeft: "-50px" }}>
            <Chart
                marginFraction={0.28}
                innerSize={{ width: 2100, height: 2000 }}
                domain={domain}
                xAxisProps={{ ticks: range(domain.x.start, domain.x.end + 5, 5), title: 'UMAP-1' }}
                yAxisProps={{ ticks: range(domain.y.start, domain.y.end + 5, 5), title: 'UMAP-2' }}
                scatterData={[ points ]}
                ref={uref}
            >
                <Scatter
                    data={points}
                    onPointMouseOver={(i: number) => { setTooltip(i); setHighlighted(tPoints[i]?.data); }}
                    onPointMouseOut={() => { setTooltip(-1); setHighlighted(""); }}
                />
                <text x={titleCoordinates[0]} y={titleCoordinates[1]} fontSize={titleSize} textAnchor="middle">{title} {gene}</text>
                { tooltip > -1 && (
                    <rect
                        x={points[tooltip].x - points[tooltip].data.replace(/_/g, " ").length * xOffset}
                        y={points[tooltip].y - yOffset + 0.7}
                        width={points[tooltip].data.replace(/_/g, " ").length * xOffset * 2}
                        height={yOffset - 0.5}
                        stroke="#000000"
                        strokeWidth={0.05}
                        fill="#ffffff"
                        fillOpacity={0.9}
                    />
                )}
                { tooltip > -1 && (
                    <text
                        x={points[tooltip].x}
                        y={points[tooltip].y - yOffset - 0.1}
                        fontSize={fontSize}
                        textAnchor="middle"
                    >
                        {points[tooltip].data.replace(/_/g, " ")}
                    </text>
                )}
            </Chart>
        </div>
    );

}

const LABEL_MAP = {
    "motor": "Striatum",
    "cortex": "Cortex",
    "cerebellar": "Cerebellum",
    "cord": "Brainstem",
    "amygdala": "Limbic System",
    "brain": "Overall Brain"
};

const LABEL_ORDER = [
    "brain",
    "cord",
    "cerebellar",
    "amygdala",
    "motor",
    "cortex"
];

function specificityCategory(c: number, k: string): string {
    if (k === "brain") {
        if (c > 0.15) return "very specific";
        if (c > 0.1) return "specific";
        if (c > 0.05) return "moderately specific";
        if (c > 0.02) return "slightly specific";
        return "not specific";
    }
    if (c > 0.008) return "very specific";
    if (c > 0.005) return "specific";
    if (c > 0.002) return "moderately specific";
    if (c > 0.001) return "slightly specific";
    return "not specific";
}

const GeneOverview: React.FC <{ gene?: string | undefined }> = ({ gene }) => {
    
    const [ category, setCategory ] = useState("all");
    const description = useGeneDescription(gene || "N/A");
    const specificities = useSpecificities(gene || "");
    
    const data = useMemo( () => [[{
        header: "",
        value: "Gene Description"
    }, {
        header: "",
        value: description
    }], [{
        header: "",
        value: "Overall Brain Specificity Score"
    }, {
        header: "",
        value: specificities.get("brain")?.toFixed(3) || "loading",
        render: specificities.get("brain") !== undefined ? (
            <span style={{ fontWeight: specificityCategory(specificities.get("brain")!, "brain") !== "not specific" ? "bold" : "normal" }}>
                {specificityCategory(specificities.get("brain")!, "brain")} ({specificities.get("brain")!.toFixed(3)})
            </span>
        ) : ""
    }], [{
        header: "",
        value: ""
    }, {
        header: "",
        value: ""
    }], [{
        header: "",
        value: "Brain Region Specificity",
        render: (
            <span style={{ fontWeight: "bold" }}>
                Brain Region Specificity
            </span>
        )
    }, {
        header: "",
        value: ""
    }], ...LABEL_ORDER.filter(x => x !== "brain" && specificities.get(x) !== undefined).map(k => [{
        header: "",
        value: `${LABEL_MAP[k]} Specificity Score`
    }, {
        header: "",
        value: (specificities.get(k)! * 10).toFixed(3),
        render: (
            <span style={{ fontWeight: specificityCategory(specificities.get(k)!, k) !== "not specific" ? "bold" : "normal" }}>
                {specificityCategory(specificities.get(k)!, k)} ({(specificities.get(k)! * 10).toFixed(3)})
            </span>
        )
    }])], [ description, specificities ]);

    return (
        <Grid container>
            <Grid item sm={6} md={6} lg={6} xl={6}>
                <Typography type="headline" size="small">
                    Details and Brain Expression Pattern: {gene}
                </Typography>
                { data.length > 0 && <CustomizedTable style={{ width: "max-content" }} tabledata={data} /> }
            </Grid>
            <Grid item sm={6} md={6} lg={6} xl={6}>
                <ToggleButtonGroup style={{ marginLeft: "2em" }} size={"small"} value={category} exclusive onChange={(_, x) => setCategory(x)}>
                    <ToggleButton value="all">
                        All GTEx Tissues
                    </ToggleButton>
                    <ToggleButton value="brain">
                        GTEx Brain Regions
                    </ToggleButton>
                </ToggleButtonGroup>
                { category === "all" ? (
                    <TissueClusterPlot
                        key="all"
                        gene={gene} 
                        yOffset={1.9}
                        xOffset={0.3}
                        fontSize={0.6}
                        title="Tissue Cluster Identity:"
                        url="https://downloads.wenglab.org/GTEx-psychscreen/all-samples.coordinates.json"
                        colors={TISSUE_TYPE_COLORS}
                        geneUrl="https://downloads.wenglab.org/GTEx-psychscreen/all-genes.coordinates.json"
                        titleCoordinates={[ 10, 18.5 ]}
                        titleSize={1}
                    />
                ) : (
                    <TissueClusterPlot
                        key="brain"
                        gene={gene}
                        yOffset={1.7}
                        xOffset={0.15}
                        fontSize={0.5}
                        title="Brain Region Cluster Identity:"
                        url="https://downloads.wenglab.org/GTEx-psychscreen/all-samples.brain-coordinates.json"
                        colors={BRAIN_COLORS}
                        geneUrl="https://downloads.wenglab.org/GTEx-psychscreen/all-genes.brain-coordinates.json"
                        titleCoordinates={[ 10, 9.5 ]}
                        titleSize={0.55}
                    />
                )}
            </Grid>
        </Grid>
    );
};
export default GeneOverview;
