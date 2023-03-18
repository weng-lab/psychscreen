
import React from 'react';

const Legend = ({ x, y, width, fill, stroke, title, content, fontSize }) => (
    <g transform={`translate(${x},${y})`}>
        <rect width={width} height={fontSize * (Object.keys(content).length + 3)} fill={fill} stroke={stroke} strokeWidth={2} />
        <text fontWeight="bold" fontSize={fontSize * 1.25} textAnchor="middle" x={width / 2} y={fontSize * 1.4}>
            {title}
        </text>
        { Object.keys(content).map( (key, i) => (
            <React.Fragment key={i}>
                <rect x={width * 0.1} y={fontSize * (i + 2.5)} width={fontSize * 0.8} height={fontSize * 0.8} fill={key} />
                <text fontSize={fontSize * 0.9} x={width * 0.18} y={fontSize * (i + 3.2)}>
                    {content[key]}
                </text>
            </React.Fragment>
        ))}
    </g>
);
export default Legend;
