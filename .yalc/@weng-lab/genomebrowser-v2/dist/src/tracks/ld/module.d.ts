import { z } from 'zod';
import { LDVariant } from './types';
export declare const ldModule: import('../../lib').TrackModule<"ld", z.ZodObject<{
    studyIds: z.ZodArray<z.ZodString>;
}, z.core.$strip>, import('./types').LDData, LDVariant, "full">;
