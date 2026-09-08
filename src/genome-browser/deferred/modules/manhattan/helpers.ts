import type { ManhattanPoint, ManhattanYDomain } from "./types";

type ResolvedYDomain = {
  min: number;
  max: number;
};

export function resolveManhattanYDomain(
  points: ManhattanPoint[],
  configured?: ManhattanYDomain,
): ResolvedYDomain {
  let dataMin = Infinity;
  let dataMax = -Infinity;

  for (const point of points) {
    dataMin = Math.min(dataMin, point.value);
    dataMax = Math.max(dataMax, point.value);
  }

  const hasData = dataMin !== Infinity && dataMax !== -Infinity;
  let min = configured?.min ?? (hasData ? dataMin : 0);
  let max = configured?.max ?? (hasData ? dataMax : 1);

  if (max <= min) {
    if (configured?.min !== undefined && configured.max === undefined) {
      max = min + 1;
    } else if (configured?.max !== undefined && configured.min === undefined) {
      min = max - 1;
    } else {
      const padding = Math.abs(min) * 0.05 || 1;
      min -= padding;
      max += padding;
    }
  }

  return { min, max };
}

export function createManhattanYScale(domain: ResolvedYDomain, height: number) {
  const span = domain.max - domain.min;
  return (value: number) => {
    const clamped = Math.max(domain.min, Math.min(domain.max, value));
    return height - ((clamped - domain.min) * height) / span;
  };
}
