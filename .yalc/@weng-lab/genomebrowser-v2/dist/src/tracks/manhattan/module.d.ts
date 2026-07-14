import { z } from 'zod';
import { ManhattanPoint } from './types';
export declare const manhattanModule: import('../../lib').TrackModule<"manhattan", z.ZodObject<{
    url: z.ZodString;
    yDomain: z.ZodOptional<z.ZodObject<{
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strict>>;
}, z.core.$strip>, import('./types').ManhattanData, ManhattanPoint, "full">;
