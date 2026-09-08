import type { GwasPoint } from "../shared/gwasBigBed";

export type ManhattanYDomain = {
  min?: number;
  max?: number;
};

export type ManhattanConfig = {
  url: string;
  yDomain?: ManhattanYDomain;
  pValueThreshold: number;
};

export type ManhattanPoint = GwasPoint;
export type ManhattanData = ManhattanPoint[];
