import { ReactNode } from 'react';
import { TrackTooltipComponent } from '../../modules/types';
import { TooltipStore } from './types';
import { TooltipStoreInstance } from './tooltipStore';
export type TooltipContextValue = {
    isDisabled: () => boolean;
    getTooltipComponent: (type: string) => TrackTooltipComponent<any, any> | undefined;
    store: TooltipStoreInstance;
};
export declare function TooltipContextProvider({ children, isDisabled, getTooltipComponent, store, }: {
    children: ReactNode;
    isDisabled: () => boolean;
    getTooltipComponent: (type: string) => TrackTooltipComponent<any, any> | undefined;
    store: TooltipStoreInstance;
}): import("react/jsx-runtime").JSX.Element;
export declare function useTooltipDisabled(): () => boolean;
export declare function useTooltipComponent<Item, Config>(type: string): TrackTooltipComponent<Item, Config> | undefined;
export declare function useInternalTooltipStore<T>(selector: (state: TooltipStore) => T): T;
