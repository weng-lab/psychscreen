import { TrackInteraction } from '../../modules/types';
import { BigBedRow } from '../bigbed/types';
export type BulkBedDisplay = "full";
export type BulkBedDataset = {
    name: string;
    url: string;
};
export type BulkBedRect = BigBedRow & {
    datasetName?: string;
};
export type BulkBedConfig = {
    datasets: BulkBedDataset[];
    gap?: number;
};
export type BulkBedData = BulkBedRect[][];
export type BulkBedInput = {
    id: string;
    title: string;
    display?: BulkBedDisplay;
    height?: number;
    color?: string;
    config: BulkBedConfig;
};
export type BulkBedInteraction = TrackInteraction<BulkBedRect>;
