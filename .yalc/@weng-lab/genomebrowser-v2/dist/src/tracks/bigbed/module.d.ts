import { z } from 'zod';
import { BigBedRow } from './types';
export declare const bigBedModule: import('../../lib').TrackModule<"bigbed", z.ZodObject<{
    url: z.ZodString;
}, z.core.$strip>, import('./types').BigBedData, BigBedRow, "dense" | "squish">;
