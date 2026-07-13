import { ComponentType, ReactNode } from 'react';
import { AnyTrackInstance, TrackBase, TrackMutationResult } from '../../modules/types';
export type SettingsPosition = {
    x: number;
    y: number;
};
export type SettingsModalProps = {
    track: AnyTrackInstance;
    title: string;
    position: SettingsPosition;
    closeSettings: () => void;
    children: ReactNode;
};
export type BaseSettingsProps = {
    base: TrackBase;
    displayOptions: string[];
    updateBase: (partial: Partial<TrackBase>) => TrackMutationResult;
};
export type SettingsStoreInput = {
    modalComponent?: ComponentType<SettingsModalProps>;
    baseSettingsComponent?: ComponentType<BaseSettingsProps>;
};
