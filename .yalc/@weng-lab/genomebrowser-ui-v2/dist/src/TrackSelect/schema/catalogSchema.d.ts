import { z } from 'zod';
import { ModuleRegistry } from '@weng-lab/genomebrowser-v2';
export declare const TrackSelectMetadataValueSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>;
declare const TrackSelectColumnSchema: z.ZodObject<{
    field: z.ZodString;
    label: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    width: z.ZodOptional<z.ZodNumber>;
    hidden: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strict>;
declare const TrackSelectViewSchema: z.ZodObject<{
    id: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    columns: z.ZodArray<z.ZodObject<{
        field: z.ZodString;
        label: z.ZodOptional<z.ZodString>;
        description: z.ZodOptional<z.ZodString>;
        width: z.ZodOptional<z.ZodNumber>;
        hidden: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strict>>;
    grouping: z.ZodDefault<z.ZodArray<z.ZodString>>;
    leaf: z.ZodDefault<z.ZodString>;
}, z.core.$strict>;
export declare const TrackSelectCatalogBaseSchema: z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    views: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        columns: z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            hidden: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        grouping: z.ZodDefault<z.ZodArray<z.ZodString>>;
        leaf: z.ZodDefault<z.ZodString>;
    }, z.core.$strict>>;
}, z.core.$strict>;
export declare function createCatalogSchema(registry: ModuleRegistry): z.ZodObject<{
    $schema: z.ZodOptional<z.ZodString>;
    id: z.ZodString;
    label: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    views: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        columns: z.ZodArray<z.ZodObject<{
            field: z.ZodString;
            label: z.ZodOptional<z.ZodString>;
            description: z.ZodOptional<z.ZodString>;
            width: z.ZodOptional<z.ZodNumber>;
            hidden: z.ZodOptional<z.ZodBoolean>;
        }, z.core.$strict>>;
        grouping: z.ZodDefault<z.ZodArray<z.ZodString>>;
        leaf: z.ZodDefault<z.ZodString>;
    }, z.core.$strict>>;
    tracks: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        display: z.ZodDefault<z.ZodType<string, string, z.core.$ZodTypeInternals<string, string>>>;
        height: z.ZodDefault<z.ZodNumber>;
        color: z.ZodOptional<z.ZodString>;
        config: z.ZodObject<z.core.$ZodLooseShape, z.core.$strip>;
        type: z.ZodLiteral<string>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
    }, z.core.$strict>, ...z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        display: z.ZodDefault<z.ZodType<string, string, z.core.$ZodTypeInternals<string, string>>>;
        height: z.ZodDefault<z.ZodNumber>;
        color: z.ZodOptional<z.ZodString>;
        config: z.ZodObject<z.core.$ZodLooseShape, z.core.$strip>;
        type: z.ZodLiteral<string>;
        metadata: z.ZodDefault<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull]>>>;
    }, z.core.$strict>[]], "type">>;
}, z.core.$strict>;
export type TrackSelectColumn = z.infer<typeof TrackSelectColumnSchema>;
export type TrackSelectView = z.infer<typeof TrackSelectViewSchema>;
export type TrackSelectTrack = {
    type: string;
    id: string;
    title: string;
    display?: string;
    height?: number;
    color?: string;
    config: Record<string, unknown>;
    metadata: Record<string, string | number | boolean | null>;
};
export type TrackSelectCatalog = z.infer<typeof TrackSelectCatalogBaseSchema> & {
    tracks: TrackSelectTrack[];
};
export {};
