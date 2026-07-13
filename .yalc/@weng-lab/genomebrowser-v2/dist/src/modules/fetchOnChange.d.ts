import { z } from 'zod';
import { TrackInstance } from './types';
export declare function fetchOnChange<Schema extends z.core.$ZodType>(schema: Schema): Schema;
export declare function createFetchSignature<Config>(module: {
    configSchema: z.ZodType<Config>;
}, track: TrackInstance<Config, never>): string;
