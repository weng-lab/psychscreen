import { z } from 'zod';
import { TrackFetch, TrackModule, TrackRenderer, TrackSettingsComponent, TrackTooltipComponent } from './types';
type TrackConfigSchema = z.ZodObject;
type FetchData<Fetch> = Fetch extends TrackFetch<infer _Config, infer Data> ? Data : never;
type DisplayKey<Renderers> = Extract<keyof Renderers, string>;
type ModuleDefaults<Display extends string> = {
    display?: Display;
    height?: number;
    color?: string;
};
type RendererMap<Config, Data, Renderers> = {
    [Display in keyof Renderers]: TrackRenderer<Config, Data>;
};
type ValidateRenderers<Config, Data, Renderers> = Renderers extends RendererMap<Config, Data, Renderers> ? unknown : {
    render: RendererMap<Config, Data, Renderers>;
};
type TrackModuleDefinition<Type extends string, ConfigSchema extends TrackConfigSchema, Fetch extends TrackFetch<z.output<ConfigSchema>, unknown>, Renderers extends object, Item> = {
    type: Type;
    defaults?: ModuleDefaults<DisplayKey<Renderers>>;
    configSchema: ConfigSchema;
    fetch: Fetch;
    render: Renderers;
    settingsComponent?: TrackSettingsComponent<z.output<ConfigSchema>>;
    tooltipComponent?: TrackTooltipComponent<Item, z.output<ConfigSchema>>;
} & ValidateRenderers<z.output<ConfigSchema>, FetchData<Fetch>, Renderers>;
export declare function defineTrackModule<Item = unknown>(): <const Type extends string, ConfigSchema extends TrackConfigSchema, Fetch extends TrackFetch<z.output<ConfigSchema>, unknown>, const Renderers extends object>(definition: TrackModuleDefinition<Type, ConfigSchema, Fetch, Renderers, Item>) => TrackModule<Type, ConfigSchema, FetchData<Fetch>, Item, DisplayKey<Renderers>>;
export declare function defineTrackModule<const Type extends string, ConfigSchema extends TrackConfigSchema, Fetch extends TrackFetch<z.output<ConfigSchema>, unknown>, const Renderers extends object>(definition: TrackModuleDefinition<Type, ConfigSchema, Fetch, Renderers, unknown>): TrackModule<Type, ConfigSchema, FetchData<Fetch>, unknown, DisplayKey<Renderers>>;
export {};
