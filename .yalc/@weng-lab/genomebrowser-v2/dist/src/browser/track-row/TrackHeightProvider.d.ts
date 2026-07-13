import { ReactNode } from 'react';
import { TrackMutationResult } from '../../modules/types';
export type TrackHeightContextValue = {
    getTrackHeight: (trackId: string) => number | undefined;
    updateHeight: (trackId: string, height: number) => TrackMutationResult;
};
export declare const TrackHeightContext: import('react').Context<TrackHeightContextValue | null>;
export declare function TrackHeightProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
