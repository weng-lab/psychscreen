import { TrackInteraction } from '../../modules/types';
import { BigWigData, RenderedBigWigPoint } from '../bigwig/types';
export type CaveDisplay = "full";
export type CaveNeurotransmitter = "GABA" | "GLU";
export type CaveAge = "Infancy" | "Early_Childhood" | "Late_Childhood" | "Adolescence" | "Early_Adulthood" | "Adulthood";
export type CaveConfig = {
    neurotransmitter: CaveNeurotransmitter;
    age: CaveAge;
};
export type CaveInput = {
    id: string;
    title: string;
    display?: CaveDisplay;
    height?: number;
    color?: string;
    config: CaveConfig;
};
export type CaveInteraction = TrackInteraction<CaveTooltipItem>;
export type CaveData = {
    top: BigWigData[];
    bottom: BigWigData[];
};
export type CaveTooltipItem = {
    x: number;
    top?: RenderedBigWigPoint;
    bottom?: RenderedBigWigPoint;
};
