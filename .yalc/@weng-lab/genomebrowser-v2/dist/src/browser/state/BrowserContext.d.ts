import { ReactNode } from 'react';
import { TrackMutationResult } from '../../modules/types';
import { SettingsStore, SettingsStoreInstance } from './settingsStore';
import { BrowserStore, BrowserStoreInstance } from './browserStore';
import { ContextMenuStore, ContextMenuStoreInstance } from './contextMenuStore';
import { TrackStore, TrackStoreInstance } from './trackStore';
type BrowserContextValue = {
    browserStore: BrowserStoreInstance;
    trackStore: TrackStoreInstance;
    contextMenuStore: ContextMenuStoreInstance;
    settingsStore: SettingsStoreInstance;
};
type InteractionGateContextValue = {
    isInteractionBlocked: boolean;
};
export declare function BrowserProvider({ children, value, }: {
    children: ReactNode;
    value: BrowserContextValue;
}): import("react/jsx-runtime").JSX.Element;
export declare function InteractionGateProvider({ children, value, }: {
    children: ReactNode;
    value: InteractionGateContextValue;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTrackStore<T>(selector: (state: TrackStore) => T): T;
export declare function useBrowserStore<T>(selector: (state: BrowserStore) => T): T;
export declare function useContextMenuStore<T>(selector: (state: ContextMenuStore) => T): T;
export declare function useSettingsStore<T>(selector: (state: SettingsStore) => T): T;
export declare function useTrackMutationGate(): {
    isInteractionBlocked: boolean;
    runTrackMutation: (mutation: () => TrackMutationResult) => {
        ok: true;
    } | {
        ok: boolean;
        error: string;
    };
};
export {};
