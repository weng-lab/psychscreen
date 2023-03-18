import React from 'react';
import { linearTransform } from './utils';
import { ticks } from './utils';

const YAxis:React.FC<any> = ({ width, height, range, title }) => {
    const verticalTransform = linearTransform(range, [ height * 0.9, height * 0.1 ]);
    return (
        <>
            <text transform="rotate(-90)" textAnchor="middle" x={-height / 2} y={width * 0.2} dominantBaseline="center" fontSize="20px">
                {title}
            </text>
            <rect height={height * 0.8} y={height * 0.1} x={width * 0.8} width={2} fill="#000000" />
            {ticks(range).filter(x => verticalTransform(x) > height * 0.1 && verticalTransform(x) < height * 0.9).map( rangeValue => (
                <g transform={`translate(0,${verticalTransform(rangeValue)})`} key={rangeValue}>
                    <text textAnchor="end" x={width * 0.6} fontSize="15px" alignmentBaseline="middle">
                        {rangeValue.toFixed(Math.log10(range[1] + 0.01) > 1.0 ? 0 : 2)}
                    </text>
                    <rect width={width * 0.1} height={2} x={width * 0.7} y={-2} fill="#000000" />
                </g>
            ))}
        </>
    );
};
export default YAxis;
