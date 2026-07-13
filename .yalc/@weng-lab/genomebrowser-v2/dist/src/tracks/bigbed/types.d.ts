import { z } from 'zod';
import { TrackInteraction } from '../../modules/types';
export type BigBedDisplay = "dense" | "squish";
export type BigBedSchema = z.ZodObject;
export type BigBedConfig = {
    url: string;
};
export type BigBedData = BigBedRow[];
export type BigBedRow = {
    chr?: string;
    chrom?: string;
    chromStart?: number;
    chromEnd?: number;
    start: number;
    end: number;
    name?: string;
    score?: number | string;
    strand?: string;
    color?: string;
    rest?: string[] | string;
    [key: string]: unknown;
};
export type InferBigBedRow<TSchema extends BigBedSchema | undefined = undefined> = TSchema extends BigBedSchema ? z.output<TSchema> & BigBedRow : BigBedRow;
export type RenderedBigBedRect<Row extends BigBedRow = BigBedRow> = {
    row: Row;
    start: number;
    end: number;
    color?: string;
    name?: string;
    score?: number | string;
};
export type BigBedInput = {
    id: string;
    title: string;
    display?: BigBedDisplay;
    height?: number;
    color?: string;
    config: BigBedConfig;
};
export type BigBedInteraction = TrackInteraction<BigBedRow>;
