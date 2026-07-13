import { ComponentType } from 'react';
import { StoreApi, UseBoundStore } from 'zustand';
import { BaseSettingsProps, SettingsModalProps, SettingsPosition, SettingsStoreInput } from '../settings/types';
export type SettingsStore = {
    open: boolean;
    trackId?: string;
    position: SettingsPosition;
    modalComponent: ComponentType<SettingsModalProps>;
    baseSettingsComponent: ComponentType<BaseSettingsProps>;
    openSettings: (trackId: string, position: SettingsPosition) => void;
    closeSettings: () => void;
    setModalComponent: (component: ComponentType<SettingsModalProps>) => void;
    setBaseSettingsComponent: (component: ComponentType<BaseSettingsProps>) => void;
};
export type SettingsStoreInstance = UseBoundStore<StoreApi<SettingsStore>>;
export declare function createSettingsStore(input?: SettingsStoreInput): SettingsStoreInstance;
export type { BaseSettingsProps, SettingsModalProps, SettingsPosition, SettingsStoreInput, } from '../settings/types';
