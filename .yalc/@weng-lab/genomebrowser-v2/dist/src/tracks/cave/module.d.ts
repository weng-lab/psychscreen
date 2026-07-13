import { z } from 'zod';
import { CaveTooltipItem } from './types';
export declare const caveModule: import('../../lib').TrackModule<"cave", z.ZodObject<{
    neurotransmitter: z.ZodEnum<{
        GABA: "GABA";
        GLU: "GLU";
    }>;
    age: z.ZodEnum<{
        Infancy: "Infancy";
        Early_Childhood: "Early_Childhood";
        Late_Childhood: "Late_Childhood";
        Adolescence: "Adolescence";
        Early_Adulthood: "Early_Adulthood";
        Adulthood: "Adulthood";
    }>;
}, z.core.$strip>, import('./types').CaveData, CaveTooltipItem, "full">;
