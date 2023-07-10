import React from "react";
import { Typography } from "@weng-lab/psychscreen-ui-components";

import { linearTransform } from "./utils";
import XAxis from "./xaxis";
import YAxis from "./yaxis";
import Legend from "./legend";
import Trendline from "./trendline";

const identityTransform = linearTransform([1, 2], [1, 2]);

const AdultFetalScatterPlot: React.FC<any> = ({
  xtitle,
  ytitle,
  fx,
  fy,
  ax,
  ay,
  logScale,
  width,
  height,
  colors,
  legendTitle,
  legendContent,
  normalized,
}) => {
  if (!fy || !ay || !fx || !ax || !fy[0] || !ay[0] || !fx[0] || !ax[0])
    return (
      <Typography
        type="body"
        size="large"
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          fontSize: "16px",
          fontWeight: 400,
          lineHeight: "19px",
        }}
      >
        No data match the given criteria.
      </Typography>
    );
  if (logScale) {
    fy = fy.map((yy: any) => yy.map((yyy) => Math.log(yyy + 0.01)));
    ay = ay.map((yy: any) => yy.map((yyy) => Math.log(yyy + 0.01)));
  }
  const fetalDomain = [0, 38];
  const adultDomain = [
    -0.01,
    Math.max(...ax.map((d) => Math.max(...(d || [])))),
  ];
  const range = [
    normalized ? -5.0 : logScale ? Math.log(0.01) : 0.0, // Math.min(...y.map(d => Math.min(...d))),
    Math.max(
      ...fy.map((d) => Math.max(...(d || []))),
      ...ay.map((d) => Math.max(...(d || [])))
    ),
  ];
  const fhorizontalTransform = linearTransform(fetalDomain, [
    width * 0.08,
    width * 0.36,
  ]);
  const ahorizontalTransform = linearTransform(adultDomain, [
    width * 0.36,
    width * 0.72,
  ]);
  const verticalTransform = linearTransform(range, [height * 0.7, 0]);
  const fpaired = Object.keys(fy).map((i) =>
    fy[i]
      ? fy[i].map((yyy, j) => ({
          y: yyy,
          x: fhorizontalTransform(fx[i][j]),
        }))
      : []
  );
  const apaired = Object.keys(ay).map((i) =>
    ay[i]
      ? ay[i].map((yyy, j) => ({
          y: yyy,
          x: ahorizontalTransform(ax[i][j]),
        }))
      : []
  );
  return (
    <g>
      <g transform={`translate(0,${-height * 0.1})`}>
        <YAxis
          title={ytitle}
          width={width * 0.1}
          height={height * 0.9}
          range={range}
        />
      </g>
      <g transform={`translate(${width * 0.08},${height * 0.7})`}>
        <XAxis
          title="fetal age (PCW)"
          width={width * 0.28}
          height={height * 0.2}
          range={fetalDomain}
        />
      </g>
      <g transform={`translate(${width * 0.36},0)`}>
        <line x1={0} y1={0} x2={0} y2={height * 0.7} stroke="#000000" />
      </g>
      <g transform={`translate(${width * 0.36},${height * 0.7})`}>
        <XAxis
          title="postnatal age (years)"
          width={width * 0.36}
          height={height * 0.2}
          range={adultDomain}
        />
      </g>
      {Object.keys(fx)
        .filter((key) => fx[key])
        .map((key) =>
          fx[key].map((xx, i) => (
            <rect
              x={fhorizontalTransform(xx) - 2}
              y={verticalTransform(fy[key][i]) - 2}
              width={4}
              height={4}
              fill={colors[key] || "#000000"}
            />
          ))
        )}
      {Object.keys(ax)
        .filter((key) => ax[key])
        .map((key) =>
          ax[key].map((xx, i) => (
            <rect
              x={ahorizontalTransform(xx) - 2}
              y={verticalTransform(ay[key][i]) - 2}
              width={4}
              height={4}
              fill={colors[key] || "#000000"}
            />
          ))
        )}
      {colors.map((color, i) => (
        <Trendline
          data={[...fpaired[i], ...apaired[i]]}
          xt={identityTransform}
          yt={verticalTransform}
          color={color}
        />
      ))}
      <Legend
        x={width * 0.75}
        y={height * 0.1}
        width={width * 0.15}
        title={legendTitle}
        content={legendContent}
        fontSize={15}
        fill="#eeeeee"
        stroke="#eeeeee"
      />
    </g>
  );
};
export default AdultFetalScatterPlot;
