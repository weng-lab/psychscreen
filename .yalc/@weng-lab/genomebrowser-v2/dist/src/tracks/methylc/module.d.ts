import { z } from 'zod';
import { MethylCTooltipItem } from './types';
export declare const methylCModule: import('../../lib').TrackModule<"methylc", z.ZodObject<{
    urls: z.ZodObject<{
        plusStrand: z.ZodObject<{
            cpg: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            chg: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            chh: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            depth: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
        minusStrand: z.ZodObject<{
            cpg: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            chg: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            chh: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
            depth: z.ZodObject<{
                url: z.ZodString;
            }, z.core.$strip>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    colors: z.ZodDefault<z.ZodObject<{
        cpg: z.ZodDefault<z.ZodString>;
        chg: z.ZodDefault<z.ZodString>;
        chh: z.ZodDefault<z.ZodString>;
        depth: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>>;
    maskCpgByCoverage: z.ZodDefault<z.ZodBoolean>;
    range: z.ZodOptional<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>, import('./types').MethylCData, MethylCTooltipItem, "split">;
