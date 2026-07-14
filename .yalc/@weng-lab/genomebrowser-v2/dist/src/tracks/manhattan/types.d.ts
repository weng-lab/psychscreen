import { TrackInteraction } from '../../modules/types';
export type ManhattanDisplay = "full";
export type ManhattanYDomain = {
    min?: number;
    max?: number;
};
export type ManhattanConfig = {
    url: string;
    yDomain?: ManhattanYDomain;
};
export type ManhattanPoint = {
    id: string;
    chromosome: string;
    start: number;
    end: number;
    value: number;
};
export type ManhattanData = ManhattanPoint[];
export type ManhattanInput = {
    id: string;
    title: string;
    display?: ManhattanDisplay;
    height?: number;
    color?: string;
    config: ManhattanConfig;
};
export type ManhattanInteraction = TrackInteraction<ManhattanPoint>;
