import { gql, useQuery } from '@apollo/client';
import { Typography } from '@zscreen/psychscreen-ui-components';
import React, { useRef }  from 'react';
import { YAxis } from '../GenePortal/axis';
import { linearTransform } from '../GenePortal/violin/utils';

function pickHex(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
        Math.round(color1[1] * w1 + color2[1] * w2),
        Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
}

const dotPlotQuery=gql`
query singleCellBoxPlot( $disease: String!, $gene:[String]){
    singleCellBoxPlotQuery(disease: $disease, gene: $gene) {
        expr_frac
        mean_count
        disease
        gene
        celltype
    }
}`


const DotPlot: React.FC<{ disease: string, gene: string}> = props => {
    const ref = useRef<SVGSVGElement>(null);
    const { data } = useQuery(dotPlotQuery,{
        variables: {
            disease: props.disease,
            gene:[props.gene]
        }

    })    
  const results: any = React.useMemo( () => new Map(
            data?.singleCellBoxPlotQuery
                .map(
                    (x: any) => {
                        return[
                            x.celltype,
                            {
                                radius:  x.mean_count,
                                colorpercent:  x.expr_frac
                            },
                        ] as [string, { radius: number, colorpercent: number }]}
                )
        ), [ data ]);
    
    const width = 15000
    const height = width / 3

    const keys = [...results.keys()].sort((a: any, b: any) => a.toLowerCase().localeCompare(b.toLowerCase()))
  
    const radiusDomain: [number, number] = React.useMemo(() => {
        let radius = keys.map(k=>{
            return results
         .get(k)!.radius
         
         })
        return [Math.min(...radius), Math.max(...radius)];
    }, [results, keys]);
    
    const radiusTransform = linearTransform( radiusDomain,[20,60]);
    
    const length = (keys.length) + 4;
    
    const verticalTransform = linearTransform([0,1], [(height / 2) * 0.9, (height / 2)* 0.1]);
    let radiusRange: number[] = []
    var diff = +((+radiusDomain[1] - +radiusDomain[0]) / 4);
    let start =+radiusDomain[0]
    radiusRange.push(radiusDomain[0])
    for(var i=0; i<4; i++){
        start += diff;
        radiusRange.push(start)
      }
    const colorPercent =[0,0.25,0.5,0.75,1]
    
    return(
    <>
    {data?.singleCellBoxPlotQuery.length===0 && <Typography type="body" size="large">
                          No data found for {props.gene}
                        </Typography> }
    {data && data.singleCellBoxPlotQuery.length>0 && <svg viewBox={`0 0 ${width} ${width / 3}`} style={{ width: '100%' }} ref={ref}>        
        <YAxis
            title={props.gene}
            width={(width / length) * 2}
            height={height / 2}
            range={[0,1]}
        />
        
        {keys.map((x, i) => (
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
                    <circle fill={"rgb("+pickHex([20,20,255],[235,235,255],results.get(x)!!.colorpercent).join(",")+")"} cy={verticalTransform(0.5)} r={radiusTransform(results.get(x)!!.radius)} cx={((i + 2.5) * width) / length}/>
                    
                    </g>
                </React.Fragment>)
        )}
        <text fontSize="140px" fill="#000000" x={(((22 + 3.3) * width) / length)} y={(0)+ height * 0.75} >Mean Count </text>
        {radiusRange.map((r,i)=>{
            return(<>
            <circle
                        r={radiusTransform(r)} 
                        cx={(((23 + 3.3) * width) / length)}
                        cy={(i*150)+ height * 0.8}
                        fill="#000000"
                    />
                    <text
                       fontSize="140px"
                        x={((23 + 3.6) * width) / length}
                        y={(i*150)+height * 0.81}
                        fill="#000000"
                    > {r.toFixed(2)} </text>
            </>)
        })}
        <text fontSize="140px" fill="#000000" x={((((14) + 3.3) * width) / length)} y={(0)+ height * 0.75} > Fraction Expressed </text>
        {colorPercent.map((r,i)=>{
            return(<>
                    <rect
                        width={100} 
                        height={100} 
                        x={((((15) + 3.3) * width) / length)}
                        y={(i*150)+ height * 0.8}
                        fill={"rgb("+pickHex([20,20,255],[235,235,255],r).join(",")+")"}
                    />
                    <text
                        fontSize="140px"
                        x={(((15) + 3.8) * width) / length}
                        y={(i*150)+height * 0.82}
                        fill="#000000"
                    > {r.toFixed(2)} </text>
            </>)
        })}
       
    </svg>}
    
    </>
    )
}

export default DotPlot