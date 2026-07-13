import { AnyTrackModule, ModuleInstance, TrackCreateInput } from './types';
type ModuleForType<Modules extends readonly AnyTrackModule[], Type extends string> = Extract<Modules[number], {
    type: Type;
}> extends never ? Modules[number] : Extract<Modules[number], {
    type: Type;
}>;
export type ModuleRegistry<Modules extends readonly AnyTrackModule[] = readonly AnyTrackModule[]> = {
    modules: Readonly<Modules>;
    get<T extends string>(type: T): ModuleForType<Modules, T>;
    get(type: string): Modules[number];
};
export type TrackCatalogEntry = TrackCreateInput<unknown> & {
    type: string;
    metadata?: Record<string, string | number | boolean | null>;
};
export declare function createModuleRegistry<const Modules extends readonly AnyTrackModule[]>(modules: Modules): ModuleRegistry<Modules>;
export declare function createTrackFromEntry<Modules extends readonly AnyTrackModule[]>(registry: ModuleRegistry<Modules>, entry: TrackCatalogEntry): ModuleInstance<Modules[number]>;
export {};
