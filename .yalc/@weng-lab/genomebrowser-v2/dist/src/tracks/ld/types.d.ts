import { TrackInteraction } from '../../modules/types';
export type LDDisplay = "full";
export type LDConfig = {
    studyIds: string[];
};
export type LDVariant = {
    id: string;
    chromosome: string;
    start: number;
    end: number;
    isLead?: boolean;
};
export type LDConnection = {
    sourceId: string;
    targetId: string;
};
export type LDData = {
    variants: LDVariant[];
    connections: LDConnection[];
};
export type LDInput = {
    id: string;
    title: string;
    display?: LDDisplay;
    height?: number;
    color?: string;
    config: LDConfig;
};
export type LDInteraction = TrackInteraction<LDVariant>;
