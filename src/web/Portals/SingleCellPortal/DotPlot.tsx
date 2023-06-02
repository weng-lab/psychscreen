import { gql, useQuery } from '@apollo/client';
import { Typography } from '@zscreen/psychscreen-ui-components';
import React from 'react';
import { YAxis } from '../GenePortal/axis';
import { linearTransform } from '../GenePortal/violin/utils';

function pickHex(color1: number[], color2: number[], w1: number) {
    const w2 = 1 - w1;
    return [
        Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)
    ];
}

const DOT_PLOT_QUERY = gql`
query singleCellBoxPlot($disease: String!, $gene:[String]) {
    singleCellBoxPlotQuery(disease: $disease, gene: $gene) {
        expr_frac
        mean_count
        disease
        gene
        celltype
    }
}`;

type DotPlotQueryResponse = {
    singleCellBoxPlotQuery: {
        expr_frac: number;
        mean_count: number;
        disease: string;
        gene: string;
        celltype: string;
    }[];
};

type DotPlotProps = {
    disease: string;
    gene: string;
};

function useGeneData(disease: string, gene: string) {

    // fetch results from API
    const { data } = useQuery<DotPlotQueryResponse>(DOT_PLOT_QUERY, {
        variables: {
            disease,
            gene
        }
    });

    // map cell types to radii and color shadings
    const results = React.useMemo(() => new Map(
        data?.singleCellBoxPlotQuery.map(x => [
            x.celltype,
            { radius: x.mean_count, colorpercent: x.expr_frac }
        ])
    ), [ data ]);

    // get sorted cell types as keys
    const keys = React.useMemo( () => (
        [ ...results.keys() ]
            .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
    ), [ results ]);

    return [ data, results, keys ] as [
        DotPlotQueryResponse | undefined,
        Map<string, { radius: number, colorpercent: number }>,
        string[]
    ];

}

const DotPlot: React.ForwardRefRenderFunction<SVGSVGElement, DotPlotProps>
    = ({ disease, gene }, ref) => {

        // SVG-related parameters
        const width = 15000;
        const height = width / 3;

        // Fetch and format expression data
        const [ data, results, keys ] = useGeneData(disease, gene);
  
        // Compute dimension factors
        const radiusDomain: [ number, number ] = React.useMemo(() => {
            const radii = keys.map(k => results.get(k)!.radius);
            return [Math.min(...radii), Math.max(...radii)];
        }, [ results, keys ]);
        const radiusTransform = React.useCallback(linearTransform(radiusDomain, [ 20, 60 ]), radiusDomain);
        const verticalTransform = React.useCallback(linearTransform([ 0, 1 ], [ height / 2 * 0.9, height / 2 * 0.1 ]), [ height ]);

        // Compute radius and color scaling factors
        const length = keys.length + 4;
        const radiusRange = React.useMemo( () => {
            const diff = +((+radiusDomain[1] - +radiusDomain[0]) / 4);
            return [ 0, 1, 2, 3 ].map(x => radiusDomain[0] + diff * x);
        }, [ radiusDomain ]);
        const colorPercent = [ 0, 0.25, 0.5, 0.75, 1 ];
        
        // No data message if this gene is not recognized
        if (data?.singleCellBoxPlotQuery.length === 0)
            return (
                <Typography type="body" size="large">
                    No data found for {gene}
                </Typography>
            );
        
        // Dot plot for recognized genes
        return (
            <svg
                viewBox={`0 0 ${width} ${width / 3}`}
                style={{ width: '100%' }}
                ref={ref}
            >
                <YAxis
                    title={gene}
                    width={(width / length) * 2}
                    height={height / 2}
                    range={[ 0, 1 ]}
                />
                { keys.map((x, i) => (
                    <React.Fragment key={`${x}_${i}`}>
                        <g>                   
                            <rect
                                width={(width / length) * 0.8}
                                x={((i + 2.1) * width) / length}
                                y={height * 0.48}
                                height={1}
                                fill="#888888"
                            />
                            <text
                                key={x}
                                fontSize="140px"
                                transform="rotate(-90)"
                                textAnchor="end"
                                y={((i + 2.5) * width) / length}
                                x={-height / 2}
                                height={width / (length - 1)}
                                fill="#000000"
                                alignmentBaseline="middle"
                            >
                                {x}
                            </text>
                            <circle
                                fill={`rgb(${pickHex([20,20,255],[235,235,255],results.get(x)!!.colorpercent).join(",")})`}
                                cy={verticalTransform(0.5)}
                                r={radiusTransform(results.get(x)!!.radius)}
                                cx={(i + 2.5) * width / length}
                            />
                        </g>
                    </React.Fragment>
                ))}
                <text
                    fontSize="140px"
                    fill="#000000"
                    x={25.3 * width / length}
                    y={height * 0.75}
                >
                    Mean Count
                </text>
                { radiusRange.map((r, i) => (
                    <>
                        <circle
                            r={radiusTransform(r)} 
                            cx={26.3 * width / length}
                            cy={i * 150 + height * 0.8}
                            fill="#000000"
                        />
                        <text
                            fontSize="140px"
                            x={26.6 * width / length}
                            y={i * 150 + height * 0.81}
                            fill="#000000"
                        >
                            {r.toFixed(2)}
                        </text>
                    </>
                ))}
                <text
                    fontSize="140px"
                    fill="#000000"
                    x={17.3 * width / length}
                    y={height * 0.75}
                >
                    Fraction Expressed
                </text>
                { colorPercent.map((r, i) => (
                    <>
                        <rect
                            width={100} 
                            height={100} 
                            x={18.3 * width / length}
                            y={i * 150 + height * 0.8}
                            fill={`rgb(${pickHex([20,20,255],[235,235,255], r).join(",")})`}
                        />
                        <text
                            fontSize="140px"
                            x={18.8 * width / length}
                            y={i * 150 + height * 0.82}
                            fill="#000000"
                        >
                            {r.toFixed(2)}
                        </text>
                    </>
                ))}
            </svg>
        );

    };

export default React.forwardRef(DotPlot);
