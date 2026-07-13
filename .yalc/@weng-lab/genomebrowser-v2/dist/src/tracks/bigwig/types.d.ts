import { TrackInteraction } from '../../modules/types';
export type BigWigDisplay = "full" | "dense";
export type BigWigConfig = {
    url: string;
    fillWithZero?: boolean;
    yRange?: YRange;
};
export type BigWigInput = {
    id: string;
    title: string;
    display?: BigWigDisplay;
    height?: number;
    color?: string;
    config: BigWigConfig;
};
export type BigWigInteraction = TrackInteraction<RenderedBigWigPoint>;
export type YRange = {
    min: number;
    max: number;
};
export type RenderedBigWigPoint = {
    x: number;
    min: number | null;
    max: number | null;
};
export type BigWigData = {
    chr: string;
    start: number;
    end: number;
    value: number;
};
