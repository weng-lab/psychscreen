import { z } from 'zod';
import { RenderedBigWigPoint } from './types';
export declare const bigWigModule: import('../../lib').TrackModule<"bigwig", z.ZodObject<{
    url: z.ZodString;
    fillWithZero: z.ZodDefault<z.ZodBoolean>;
    yRange: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>, import('./types').BigWigData[], RenderedBigWigPoint, "dense" | "full">;
