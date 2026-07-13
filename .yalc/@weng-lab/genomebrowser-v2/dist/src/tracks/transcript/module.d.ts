import { z } from 'zod';
import { Transcript } from './types';
export declare const transcriptModule: import('../../lib').TrackModule<"transcript", z.ZodObject<{
    assembly: z.ZodString;
    version: z.ZodNumber;
    geneName: z.ZodOptional<z.ZodString>;
    canonicalColor: z.ZodOptional<z.ZodString>;
    highlightColor: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, import('./types').TranscriptData, Transcript, "pack" | "squish">;
