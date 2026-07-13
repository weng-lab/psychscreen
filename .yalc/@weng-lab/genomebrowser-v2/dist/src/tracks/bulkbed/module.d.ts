import { z } from 'zod';
import { BulkBedRect } from './types';
export declare const bulkBedModule: import('../../lib').TrackModule<"bulkbed", z.ZodObject<{
    datasets: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        url: z.ZodString;
    }, z.core.$strip>>;
    gap: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, import('./types').BulkBedData, BulkBedRect, "full">;
