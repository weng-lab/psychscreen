// Fixed for the lifetime of every LD controller and its session-local cache.
export const LD_REQUEST = Object.freeze({
  assembly: "hg38",
  population: "EUROPEAN",
  rSquaredThreshold: 0.7,
} as const);

export const LD_CONTEXT = `European · r² ≥ ${LD_REQUEST.rSquaredThreshold}`;
