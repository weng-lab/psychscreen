import React from "react";

import { standardDeviation, average } from "./utils";

const trendline = (data, resolution = 20) => {
  const range = [
    Math.min(...data.map((x) => x.x)),
    Math.max(...data.map((x) => x.x)),
  ];
  const step = (range[1] - range[0]) / resolution;
  const averages = {},
    stdevs = {};
  for (let i = range[0]; i < range[1] + step; i += step) {
    const filtered = data.filter(
      (x) => x.x > i - step * 2 && x.x < i + step * 2
    );
    if (filtered.length < 3) continue;
    averages[i] = average(filtered.map((x) => x.y));
    stdevs[i] = standardDeviation(filtered.map((x) => x.y));
  }
  return {
    averages,
    stdevs,
  };
};

const nsort = (a, b) => +a - +b;

const Trendline = ({ data, xt, yt, color, resolution = 20 }) => {
  const { averages, stdevs } = trendline(data, resolution);
  const akeys = Object.keys(averages)
      .sort(nsort)
      .map((x) => +x),
    skeys = Object.keys(stdevs)
      .sort(nsort)
      .map((x) => +x);
  const skeysr = [...skeys].reverse();
  const center = akeys.reduce(
    (acc, x) => acc + ` L ${xt(x)} ${yt(averages[x])}`,
    `M ${xt(akeys[0])} ${yt(averages[akeys[0]])}`
  );
  const top = skeys.reduce(
    (acc, x) => acc + ` L ${xt(x)} ${yt(averages[x] + stdevs[x])}`,
    `M ${xt(akeys[0])} ${yt(averages[akeys[0]] + stdevs[akeys[0]])}`
  );
  const complete =
    skeysr.reduce(
      (acc, x) => acc + ` L ${xt(x)} ${yt(averages[x] - stdevs[x])}`,
      top
    ) + `L ${xt(akeys[0])} ${yt(averages[akeys[0]] - stdevs[akeys[0]])}`;
  return (
    <>
      <path d={center} stroke={color} strokeWidth={3} fill="none" />
      <path d={complete} fill={color} fillOpacity={0.3} strokeWidth={2} />
    </>
  );
};
export default Trendline;
