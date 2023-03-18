import React from 'react';
import { linearTransform } from './utils';
import { ticks } from './utils';

const XAxis: React.FC<any> = ({ width, height, range, title }) => {
    const horizontalTransform = linearTransform(range, [ 0, width ]);
    return (
        <>
            <text textAnchor="middle" x={width / 2} y={height * 0.5} fontSize="20px">
                {title}
            </text>
            <rect width={width} y={0} x={0} height={2} fill="#000000" />
            {ticks(range).filter(x => horizontalTransform(x) > 0 && horizontalTransform(x) < width).map( rangeValue => (
                <g transform={`translate(${horizontalTransform(rangeValue)},0)`}>
                    <text transform="rotate(-90)" textAnchor="end" x={-height * 0.15} y={5} fontSize="15px">
                        {rangeValue.toFixed(Math.log10(range[1] + 0.01) > 1.0 ? 0 : 2)}
                    </text>
                    <rect height={height * 0.1} width={2} y={0} x={-2} fill="#000000" />
                </g>
            ))}
        </>
    );
};
export default XAxis;
