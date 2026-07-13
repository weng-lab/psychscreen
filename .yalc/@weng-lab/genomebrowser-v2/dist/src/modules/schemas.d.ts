import { z } from 'zod';
export declare function parsePublicInput<T>(schema: z.ZodType<T>, input: unknown, label: string): T;
