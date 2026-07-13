import { ReactNode } from 'react';
import { TrackInteraction } from './types';
export declare function TrackInteractionProvider({ interaction, children, }: {
    interaction?: TrackInteraction<never>;
    children: ReactNode;
}): import('react').FunctionComponentElement<import('react').ProviderProps<TrackInteraction<never> | null>>;
export declare function useInteraction<Item>(): TrackInteraction<Item> | null;
