import { StoreApi, UseBoundStore } from 'zustand';
import { ModuleRegistry } from '../../modules/registry';
import { AnyTrackInstance, AnyTrackModule, TrackBase, TrackInteraction, TrackMutationResult } from '../../modules/types';
export type TrackStoreOptions<Modules extends readonly AnyTrackModule[] = readonly AnyTrackModule[], Track extends AnyTrackInstance = AnyTrackInstance> = {
    modules: Modules;
    tracks?: Track[];
};
export type TrackConfigUpdate<Config> = Partial<Config>;
export type TrackInteractionUpdate<Item> = Partial<TrackInteraction<Item>>;
export type TrackStore = {
    tracks: AnyTrackInstance[];
    order: string[];
    registry: ModuleRegistry;
    setTracks: <Track extends AnyTrackInstance>(tracks: Track[]) => TrackMutationResult;
    addTrack: <Track extends AnyTrackInstance>(track: Track, index?: number) => TrackMutationResult;
    removeTrack: (id: string) => TrackMutationResult;
    applyTrackChanges: <Track extends AnyTrackInstance>(changes: {
        add?: Track[];
        remove?: string[];
    }) => TrackMutationResult;
    reorderTracks: (ids: string[]) => TrackMutationResult;
    updateBase: (id: string, partial: Partial<TrackBase>) => TrackMutationResult;
    updateConfig: <Config>(id: string, partial: TrackConfigUpdate<Config>) => TrackMutationResult;
    updateInteraction: (id: string, partial: TrackInteractionUpdate<unknown>) => TrackMutationResult;
    getTrack: (id: string) => AnyTrackInstance | undefined;
};
export type TrackStoreInstance = UseBoundStore<StoreApi<TrackStore>>;
export declare function createTrackStore<const Modules extends readonly AnyTrackModule[], Track extends AnyTrackInstance = AnyTrackInstance>(options: TrackStoreOptions<Modules, Track>): TrackStoreInstance;
