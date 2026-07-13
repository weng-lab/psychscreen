import { z } from 'zod';
import { BigBedRow, BigBedSchema } from './types';
export type BigBedParser<Row = BigBedRow> = (chrom: string, start: number, end: number, rest: string) => Row;
export declare function createBigBedSchemaParser<TSchema extends BigBedSchema>(schema: TSchema): BigBedParser<z.output<TSchema> & BigBedRow>;
export declare function parseBigBedRowWithSchema<TSchema extends BigBedSchema>(schema: TSchema, chrom: string, start: number, end: number, rest: string): z.output<TSchema> & BigBedRow;
